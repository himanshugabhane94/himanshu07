import { Resend } from 'resend';

const resendApiKey = process.env.RESEND_API_KEY;
const resend = resendApiKey ? new Resend(resendApiKey) : null;
const fromEmail = process.env.EMAIL_FROM || 'YogyaSetu <onboarding@resend.dev>';

export interface SendOtpEmailResult {
  success: boolean;
  messageId?: string;
  error?: string;
  devMode?: boolean;
}

/**
 * Sends a 6-digit OTP verification email via Resend
 */
export async function sendOtpEmail(
  toEmail: string,
  otp: string
): Promise<SendOtpEmailResult> {
  const isDevMode = !resendApiKey || resendApiKey.startsWith('re_placeholder') || resendApiKey.includes('your_');

  if (isDevMode) {
    console.log('\n==================================================');
    console.log(`📨 [YOGYASETU DEV OTP] Email: ${toEmail}`);
    console.log(`🔑 Verification Code: ${otp}`);
    console.log(`⏳ Valid for: 10 minutes`);
    console.log('==================================================\n');

    return {
      success: true,
      devMode: true,
    };
  }

  try {
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>YogyaSetu Verification Code</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #F5F6F8; margin: 0; padding: 24px; color: #1E293B; }
          .card { max-width: 520px; margin: 0 auto; background: #FFFFFF; border-radius: 20px; border: 1px solid #E2E8F0; padding: 36px 32px; box-shadow: 0 4px 16px rgba(11, 61, 145, 0.06); }
          .brand { display: flex; align-items: center; justify-content: center; gap: 10px; margin-bottom: 24px; text-align: center; }
          .badge { width: 36px; height: 36px; background: #FF9933; border-radius: 10px; display: inline-flex; align-items: center; justify-content: center; color: #0B3D91; font-weight: 900; font-size: 18px; margin-right: 8px; vertical-align: middle; }
          .brand-title { font-size: 22px; font-weight: 900; color: #0B3D91; vertical-align: middle; }
          .brand-saffron { color: #FF9933; }
          h2 { font-size: 20px; font-weight: 800; color: #0B3D91; margin: 0 0 8px 0; text-align: center; }
          p { font-size: 14px; line-height: 1.6; color: #475569; margin: 0 0 16px 0; text-align: center; }
          .otp-container { background: #F8FAFC; border: 2px dashed #0B3D91; border-radius: 16px; padding: 20px; text-align: center; margin: 24px 0; }
          .otp-code { font-family: 'Courier New', Courier, monospace; font-size: 36px; font-weight: 900; letter-spacing: 8px; color: #0B3D91; margin: 0; }
          .expiry { font-size: 12px; font-weight: 700; color: #DC2626; margin-top: 8px; }
          .security-box { background: #FEF3C7; border-left: 4px solid #F59E0B; padding: 12px 16px; border-radius: 8px; font-size: 12px; color: #92400E; margin-top: 24px; text-align: left; }
          .footer { font-size: 11px; color: #94A3B8; text-align: center; margin-top: 24px; border-top: 1px solid #F1F5F9; padding-top: 16px; }
        </style>
      </head>
      <body>
        <div class="card">
          <div class="brand">
            <span class="badge">🟧</span>
            <span class="brand-title">Yogya<span class="brand-saffron">Setu</span></span>
          </div>
          <h2>Your One-Time Password (OTP)</h2>
          <p>Use the following 6-digit verification code to sign in to your YogyaSetu citizen account. This code is confidential.</p>
          
          <div class="otp-container">
            <div class="otp-code">${otp}</div>
            <div class="expiry">⏱️ Expires in 10 minutes</div>
          </div>

          <p style="font-size: 13px; color: #64748B;">If you did not request this OTP, please ignore this email or contact support if you suspect unauthorized access.</p>

          <div class="security-box">
            <strong>Security Reminder:</strong> YogyaSetu and Government officials will never ask for your password, OTP, or banking PIN over phone calls or SMS.
          </div>

          <div class="footer">
            Government Scheme Information Aggregator | <a href="https://india.gov.in" style="color: #0B3D91; text-decoration: none;">india.gov.in</a>
            <br>&copy; 2026 YogyaSetu. All rights reserved.
          </div>
        </div>
      </body>
      </html>
    `;

    const data = await resend!.emails.send({
      from: fromEmail,
      to: toEmail,
      subject: `[YogyaSetu] ${otp} is your verification code`,
      html: htmlContent,
    });

    if (data.error) {
      console.error('Resend API error:', data.error);
      return { success: false, error: data.error.message };
    }

    return { success: true, messageId: data.data?.id };
  } catch (err: any) {
    console.error('Error sending OTP email:', err);
    return { success: false, error: err?.message || 'Failed to send OTP email' };
  }
}
