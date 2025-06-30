 // test-mail.js
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const test = async () => {
  const transporter = nodemailer.createTransport({
    host: process.env.MAILTRAP_HOST,
    port: Number(process.env.MAILTRAP_PORT),
    auth: {
      user: process.env.MAILTRAP_USER,
      pass: process.env.MAILTRAP_PASS,
    },
  });

  try {
    const info = await transporter.sendMail({
      from: '"Test 👋" <test@mailtrap.io>',
      to: "test@example.com", // any dummy email
      subject: "Mailtrap SMTP Test",
      html: "<p>If you see this, SMTP works!</p>",
    });

    console.log("✅ Mail sent!", info.messageId);
  } catch (err) {
    console.error("❌ Error sending test mail:", err);
  }
};

test();
