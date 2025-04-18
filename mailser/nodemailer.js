const nodemailer = require("nodemailer");
require("dotenv").config();

// Create transporter
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com", // ✅ Corrected Gmail SMTP
  port: 587,
  secure: false, // true for 465, false for 587
  auth: {
    user: process.env.SMTP_USER, // ✅ Your Gmail ID
    pass: process.env.SMTP_PASS, // ✅ App Password
  },
});

// Verify SMTP Connection
transporter.verify((error, success) => {
  if (error) {
    console.log("SMTP Connection Error:", error);
  } else {
    console.log("SMTP Server is Ready to Send Emails");
  }
});

// Function to send OTP
const sendOtp = async (email, htmltext) => {
  const mailDetails = {
    from: process.env.SMTP_USER, // ✅ Use your Gmail directly
    to: email,
    subject: "OTP",
    html:htmltext,
  };

  try {
    await transporter.sendMail(mailDetails);
    console.log("OTP sent successfully to", email);
    return true;
  } catch (err) {
    console.log("Error in sending OTP:", err);
    return false;
  }
};

const sendmail = async (email, htmltext) => {
  const mailDetails = {
    from: process.env.SMTP_USER, // ✅ Use your Gmail directly
    to: email,
    subject: "Order",
    html:htmltext,
  };

  try {
    await transporter.sendMail(mailDetails);
    console.log("mail sent successfully to", email);
    return true;
  } catch (err) {
    console.log("Error in sending mail:", err);
    return false;
  }
};

module.exports = {sendOtp,sendmail};
