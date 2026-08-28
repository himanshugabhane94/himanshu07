import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import bcrypt from 'bcryptjs';
import prisma from '@/lib/prisma';

export const authOptions: NextAuthOptions = {
  debug: true,
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  providers: [
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? [
          GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            allowDangerousEmailAccountLinking: true,
            authorization: {
              params: {
                prompt: 'select_account',
                access_type: 'offline',
                response_type: 'code',
              },
            },
          }),
        ]
      : []),
    CredentialsProvider({
      id: 'credentials',
      name: 'Credentials',
      credentials: {
        authType: { label: 'Auth Type', type: 'text' },
        email: { label: 'Email', type: 'text' },
        otp: { label: 'OTP Code', type: 'text' },
        phoneNumber: { label: 'Phone Number', type: 'text' },
        name: { label: 'Full Name', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const authType = credentials?.authType || (credentials?.otp ? 'email_otp' : 'password');

        // =================================================================
        // 1. EMAIL OTP AUTHENTICATION
        // =================================================================
        if (authType === 'email_otp') {
          if (!credentials?.email || !credentials?.otp) {
            throw new Error('Please provide both your email and the 6-digit OTP.');
          }

          const cleanEmail = credentials.email.trim().toLowerCase();
          const cleanOtp = credentials.otp.trim();

          // Find the newest unverified OTP for this email
          const otpRecord = await prisma.otpVerification.findFirst({
            where: {
              identifier: cleanEmail,
              type: 'EMAIL',
              verified: false,
            },
            orderBy: { createdAt: 'desc' },
          });

          if (!otpRecord) {
            throw new Error('No active OTP found. Please request a new code.');
          }

          if (new Date() > new Date(otpRecord.expiresAt)) {
            throw new Error('This OTP has expired. Please request a new one.');
          }

          if (otpRecord.attempts >= 5) {
            throw new Error('Too many incorrect attempts. Please request a fresh OTP.');
          }

          // Increment attempts
          await prisma.otpVerification.update({
            where: { id: otpRecord.id },
            data: { attempts: { increment: 1 } },
          });

          // Verify hash
          const isOtpValid = await bcrypt.compare(cleanOtp, otpRecord.otpHash);
          if (!isOtpValid) {
            const remaining = 4 - otpRecord.attempts;
            throw new Error(
              remaining > 0
                ? `Invalid OTP. You have ${remaining} attempts remaining.`
                : 'Invalid OTP code. Maximum attempts exceeded.'
            );
          }

          // Mark OTP as verified
          await prisma.otpVerification.update({
            where: { id: otpRecord.id },
            data: { verified: true },
          });

          // Find or create User
          let user = await prisma.user.findUnique({
            where: { email: cleanEmail },
          });

          if (!user) {
            // Automatically register new citizen on first OTP verification
            const defaultName = credentials?.name?.trim() || cleanEmail.split('@')[0].replace(/[._-]/g, ' ');
            user = await prisma.user.create({
              data: {
                name: defaultName.charAt(0).toUpperCase() + defaultName.slice(1),
                email: cleanEmail,
                role: 'USER',
                isActive: true,
              },
            });
          }

          if (!user.isActive) {
            throw new Error('This account has been deactivated. Please contact portal support.');
          }

          return {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            state: user.state,
            gender: user.gender,
            age: user.age,
            occupation: user.occupation,
            income: user.income,
            category: user.category,
            education: user.education,
          } as any;
        }

        // =================================================================
        // 2. MOBILE SMS OTP AUTHENTICATION (Firebase Phone Auth)
        // =================================================================
        if (authType === 'phone_token' || authType === 'mobile_otp') {
          if (!credentials?.phoneNumber) {
            throw new Error('Valid phone number is required.');
          }

          const rawPhone = credentials.phoneNumber.trim();
          // Normalize to +91XXXXXXXXXX
          const cleanPhone = rawPhone.startsWith('+') ? rawPhone : `+91${rawPhone}`;

          // Find or create User linked to this phone number
          let user = await prisma.user.findFirst({
            where: { mobile: cleanPhone },
          });

          if (!user) {
            const phoneDigits = cleanPhone.replace(/[^0-9]/g, '');
            const fallbackEmail = `${phoneDigits}@citizen.yogyasetu.gov.in`;

            // Check if user already exists with fallback email
            const existingByEmail = await prisma.user.findUnique({
              where: { email: fallbackEmail },
            });

            if (existingByEmail) {
              user = await prisma.user.update({
                where: { id: existingByEmail.id },
                data: { mobile: cleanPhone },
              });
            } else {
              const defaultName = credentials?.name?.trim() || `Citizen (${cleanPhone.slice(-4)})`;
              user = await prisma.user.create({
                data: {
                  name: defaultName,
                  email: fallbackEmail,
                  mobile: cleanPhone,
                  role: 'USER',
                  isActive: true,
                },
              });
            }
          }

          if (!user.isActive) {
            throw new Error('This account has been deactivated. Please contact portal support.');
          }

          return {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            state: user.state,
            gender: user.gender,
            age: user.age,
            occupation: user.occupation,
            income: user.income,
            category: user.category,
            education: user.education,
          } as any;
        }

        // =================================================================
        // 3. PASSWORD AUTHENTICATION (For Admin & Password Accounts)
        // =================================================================
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Please enter your email and password.');
        }

        const identifier = credentials.email.trim().toLowerCase();

        // Search by email or mobile
        const user = await prisma.user.findFirst({
          where: {
            OR: [
              { email: identifier },
              { mobile: credentials.email.trim() },
            ],
          },
        });

        if (!user || !user.passwordHash) {
          throw new Error('No password account found. Please sign in with Email/Mobile OTP.');
        }

        if (!user.isActive) {
          throw new Error('This account has been deactivated. Please contact support.');
        }

        const isPasswordValid = await bcrypt.compare(credentials.password, user.passwordHash);

        if (!isPasswordValid) {
          throw new Error('Invalid password credentials.');
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          state: user.state,
          gender: user.gender,
          age: user.age,
          occupation: user.occupation,
          income: user.income,
          category: user.category,
          education: user.education,
        } as any;
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === 'google') {
        if (!user?.email) {
          console.error('Google OAuth did not return an email address');
          return false;
        }

        try {
          const cleanEmail = user.email.trim().toLowerCase();
          let dbUser = await prisma.user.findUnique({
            where: { email: cleanEmail },
          });

          if (!dbUser) {
            const defaultName = user.name || cleanEmail.split('@')[0];
            dbUser = await prisma.user.create({
              data: {
                name: defaultName,
                email: cleanEmail,
                role: 'USER',
                isActive: true,
              },
            });
          }

          if (!dbUser.isActive) {
            console.warn(`Deactivated user ${cleanEmail} attempted to sign in.`);
            return false;
          }
        } catch (err) {
          console.error('Error in Google signIn callback:', err);
        }
      }
      return true;
    },
    async jwt({ token, user, account, trigger, session }) {
      // On sign-in (Credentials or OAuth)
      if (token?.email && (user || account)) {
        const cleanEmail = token.email.trim().toLowerCase();
        try {
          let dbUser = await prisma.user.findUnique({
            where: { email: cleanEmail },
          });

          if (!dbUser) {
            const defaultName = token.name || user?.name || cleanEmail.split('@')[0];
            dbUser = await prisma.user.create({
              data: {
                name: defaultName,
                email: cleanEmail,
                role: 'USER',
                isActive: true,
              },
            });
          }

          token.id = dbUser.id;
          token.name = dbUser.name;
          token.email = dbUser.email;
          token.role = dbUser.role || 'USER';
          token.state = dbUser.state;
          token.gender = dbUser.gender;
          token.age = dbUser.age;
          token.occupation = dbUser.occupation;
          token.income = dbUser.income;
          token.category = dbUser.category;
          token.education = dbUser.education;
        } catch (err) {
          console.error('Error syncing user in jwt callback:', err);
          if (user) {
            token.id = user.id;
            token.role = (user as any).role || 'USER';
          }
        }
      }

      // Handle client-side session update (e.g. when updating profile in Dashboard)
      if (trigger === 'update' && session?.user) {
        token.name = session.user.name;
        token.state = session.user.state;
        token.age = session.user.age;
        token.gender = session.user.gender;
        token.occupation = session.user.occupation;
        token.income = session.user.income;
        token.category = session.user.category;
        token.education = session.user.education;
      }

      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        (session.user as any).id = token.id;
        (session.user as any).role = token.role || 'USER';
        (session.user as any).state = token.state;
        (session.user as any).gender = token.gender;
        (session.user as any).age = token.age;
        (session.user as any).occupation = token.occupation;
        (session.user as any).income = token.income;
        (session.user as any).category = token.category;
        (session.user as any).education = token.education;
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      // If callback target is /login, redirect to /dashboard
      if (url === '/login' || url === `${baseUrl}/login` || url.endsWith('/login')) {
        return `${baseUrl}/dashboard`;
      }
      // Allows relative callback URLs
      if (url.startsWith('/')) {
        return `${baseUrl}${url}`;
      }
      // Allows callback URLs on the same origin
      if (new URL(url).origin === baseUrl) {
        return url;
      }
      return `${baseUrl}/dashboard`;
    },
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  secret: process.env.NEXTAUTH_SECRET || 'yogyasetu-secret-fallback-key-for-jwt-signing',
};
