import { Resend } from 'resend'

// Initialize Resend client
const resendApiKey = process.env.RESEND_API_KEY

if (!resendApiKey && process.env.NODE_ENV === 'production') {
  throw new Error('RESEND_API_KEY environment variable is required in production')
}

export const resend = resendApiKey ? new Resend(resendApiKey) : null

// Email templates
export const emailTemplates = {
  otpVerification: (code: string) => ({
    subject: 'Your Maffix Verification Code',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Maffix Verification Code</title>
        </head>
        <body style="margin: 0; padding: 0; background-color: #000000; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
          <table role="presentation" style="width: 100%; border-collapse: collapse;">
            <tr>
              <td align="center" style="padding: 40px 20px;">
                <table role="presentation" style="width: 100%; max-width: 480px; border-collapse: collapse;">
                  <!-- Logo -->
                  <tr>
                    <td align="center" style="padding-bottom: 32px;">
                      <h1 style="margin: 0; font-size: 32px; font-weight: bold; color: #ffffff;">Maffix</h1>
                    </td>
                  </tr>

                  <!-- Main Card -->
                  <tr>
                    <td style="background-color: #1a1a1a; border-radius: 16px; padding: 40px; border: 1px solid #333333;">
                      <h2 style="margin: 0 0 16px 0; font-size: 24px; font-weight: 600; color: #ffffff; text-align: center;">
                        Your Verification Code
                      </h2>
                      <p style="margin: 0 0 32px 0; font-size: 16px; color: #a0a0a0; text-align: center; line-height: 1.5;">
                        Enter this code to access Maffix and start your journey with independent musicians.
                      </p>

                      <!-- OTP Code -->
                      <div style="background-color: #000000; border-radius: 12px; padding: 24px; text-align: center; border: 1px solid #333333;">
                        <span style="font-size: 40px; font-weight: bold; letter-spacing: 8px; color: #FF5656; font-family: 'Courier New', monospace;">
                          ${code}
                        </span>
                      </div>

                      <p style="margin: 32px 0 0 0; font-size: 14px; color: #666666; text-align: center;">
                        This code will expire in <strong style="color: #a0a0a0;">10 minutes</strong>
                      </p>
                    </td>
                  </tr>

                  <!-- Footer -->
                  <tr>
                    <td style="padding-top: 32px; text-align: center;">
                      <p style="margin: 0 0 8px 0; font-size: 14px; color: #666666;">
                        If you didn't request this code, you can safely ignore this email.
                      </p>
                      <p style="margin: 0; font-size: 12px; color: #444444;">
                        &copy; ${new Date().getFullYear()} Maffix. All rights reserved.
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
      </html>
    `,
    text: `Your Maffix verification code is: ${code}\n\nThis code will expire in 10 minutes.\n\nIf you didn't request this code, you can safely ignore this email.`,
  }),
}

/**
 * Send OTP verification email
 */
export async function sendOTPEmail(
  email: string,
  code: string
): Promise<{ success: boolean; error?: string }> {
  // In development without Resend, log to console
  if (!resend) {
    console.log(`[DEV EMAIL] To: ${email}, OTP: ${code}`)
    return { success: true }
  }

  try {
    const template = emailTemplates.otpVerification(code)

    const { data, error } = await resend.emails.send({
      from: 'Maffix <noreply@maffix.io>',
      to: email,
      subject: template.subject,
      html: template.html,
      text: template.text,
    })

    if (error) {
      console.error('Resend error:', error)
      return { success: false, error: error.message }
    }

    console.log(`[EMAIL SENT] To: ${email}, ID: ${data?.id}`)
    return { success: true }
  } catch (error: any) {
    console.error('Email send error:', error)
    return { success: false, error: error.message || 'Failed to send email' }
  }
}
