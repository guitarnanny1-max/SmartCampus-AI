import { Resend } from "resend";

export async function sendPlatformOtpEmail(
  email: string,
  otp: string
) {
  const from = process.env.OTP_FROM_EMAIL;

  if (!process.env.RESEND_API_KEY) {
    throw new Error("RESEND_API_KEY is not configured.");
  }

  if (!from) {
    throw new Error("OTP_FROM_EMAIL is not configured.");
  }

  const resend = new Resend(process.env.RESEND_API_KEY);

  const { error } = await resend.emails.send({
    from,
    to: [email],
    subject: "Your SmartCampus AI verification code",
    html: `
      <div style="font-family:Arial,sans-serif;max-width:560px;margin:auto">
        <h2>SmartCampus AI</h2>
        <p>Use the verification code below to sign in to the ThomasG Technologies platform.</p>

        <div style="font-size:32px;font-weight:bold;letter-spacing:8px;margin:24px 0">
          ${otp}
        </div>

        <p>This code expires in <strong>10 minutes</strong>.</p>
        <p>If you did not attempt to sign in, you can safely ignore this email.</p>

        <hr />
        <p style="color:#64748b;font-size:13px">
          Powered by ThomasG Technologies · SmartCampus AI
        </p>
      </div>
    `,
  });

  if (error) {
    throw new Error(error.message);
  }
}
