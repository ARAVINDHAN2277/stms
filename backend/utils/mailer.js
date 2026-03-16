// mailer.js
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'gamerbennyhinn2004@gmail.com',
    pass: 'qleo cegf hwcn ccac',
  },
});


export default transporter;
