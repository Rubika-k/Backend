// utils/sendMail.js
import nodemailer from 'nodemailer';

export default async function sendMail({ to, subject, html }) {
  const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,  //  use the ENV variable
    pass: process.env.EMAIL_PASS   //  use the ENV variable
  }
});

  await transporter.sendMail({
    from: `"Breeze Home" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
  });
};
