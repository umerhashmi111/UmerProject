import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendOtpEmail(to: string, code: string, treeTitle: string) {
  if (!process.env.MAIL_FROM) {
    throw new Error("MAIL_FROM not configured");
  }

  await resend.emails.send({
    from: process.env.MAIL_FROM,
    to,
    subject: `Your Family Tree access code`,
    html: `<p>Hello,</p>
           <p>Your access code for <b>${treeTitle}</b> is:</p>
           <h2>${code}</h2>
           <p>This code expires in 10 minutes.</p>`,
  });
}
