import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import {
  getAuth,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  ConfirmationResult,
  Auth,
} from 'firebase/auth';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

export const isFirebaseConfigured = (): boolean => {
  return Boolean(
    process.env.NEXT_PUBLIC_FIREBASE_API_KEY &&
    !process.env.NEXT_PUBLIC_FIREBASE_API_KEY.includes('your_') &&
    !process.env.NEXT_PUBLIC_FIREBASE_API_KEY.startsWith('AIzaSy_placeholder')
  );
};

export function getFirebaseApp(): FirebaseApp | null {
  if (typeof window === 'undefined') return null;

  if (!isFirebaseConfigured()) {
    return null;
  }

  if (getApps().length > 0) {
    return getApp();
  }

  return initializeApp(firebaseConfig);
}

export function getFirebaseAuthInstance(): Auth | null {
  const app = getFirebaseApp();
  if (!app) return null;
  return getAuth(app);
}

/**
 * Initializes invisible reCAPTCHA verifier for Firebase Phone Auth
 */
export function setupRecaptchaVerifier(
  containerId: string,
  onSuccess?: () => void,
  onExpired?: () => void
): RecaptchaVerifier | null {
  const auth = getFirebaseAuthInstance();
  if (!auth) return null;

  try {
    const existingVerifier = (window as any).recaptchaVerifier;
    if (existingVerifier) {
      existingVerifier.clear();
    }

    const verifier = new RecaptchaVerifier(auth, containerId, {
      size: 'invisible',
      callback: () => {
        if (onSuccess) onSuccess();
      },
      'expired-callback': () => {
        if (onExpired) onExpired();
      },
    });

    (window as any).recaptchaVerifier = verifier;
    return verifier;
  } catch (err) {
    console.error('Failed to initialize reCAPTCHA verifier:', err);
    return null;
  }
}

/**
 * Dispatches 6-digit SMS OTP via Firebase Phone Auth
 */
export async function sendFirebasePhoneOtp(
  phoneNumber: string,
  appVerifier: RecaptchaVerifier
): Promise<ConfirmationResult> {
  const auth = getFirebaseAuthInstance();
  if (!auth) {
    throw new Error(
      'Firebase Phone Authentication is not configured. Please add NEXT_PUBLIC_FIREBASE_* keys to .env.'
    );
  }

  // Format phone number to E.164 (e.g. +919876543210)
  const cleanDigits = phoneNumber.replace(/[^0-9]/g, '');
  let formattedNumber = phoneNumber.trim();
  if (!formattedNumber.startsWith('+')) {
    formattedNumber = cleanDigits.length === 10 ? `+91${cleanDigits}` : `+${cleanDigits}`;
  }

  return await signInWithPhoneNumber(auth, formattedNumber, appVerifier);
}
