import nodemailer from "nodemailer";

const getTransporter = () => {
  const user = process.env.SMTP_USER?.replace(/['"]+/g, '').trim();
  const pass = process.env.SMTP_PASSWORD?.replace(/['"]+/g, '').trim();

  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user,
      pass,
    },
    tls: {
      rejectUnauthorized: false, // Fix for "self-signed certificate in certificate chain" error
    },
  });
};

export interface SendEmailDetails {
  to: string;
  subject: string;
  text?: string;
  html?: string;
  replyTo?: string;
}

export async function sendEmail({ to, subject, text, html, replyTo }: SendEmailDetails) {
  const user = process.env.SMTP_USER?.replace(/['"]+/g, '').trim();
  const transporter = getTransporter();

  const mailOptions = {
    from: `"Godawari Hacks" <${user}>`,
    to,
    subject,
    text,
    html,
    replyTo,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent: %s", info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("Error sending email:", error);
    return { success: false, error };
  }
}
