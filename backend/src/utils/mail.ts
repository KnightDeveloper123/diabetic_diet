import nodemailer, { SendMailOptions, SentMessageInfo } from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: "nikhilkharche101199@gmail.com",
    pass: "vorr bocb qwzu ntvr",
  },
  // Keep certificate validation enabled.
});
// EMAIL_APP_PASSWORD:vorr bocb qwzu ntvr

interface MailResponse {
  success?: string;
  info?: SentMessageInfo;
  error?: string;
}

const sendMail = (
  mailOptions: SendMailOptions
): Promise<MailResponse> => {
  return new Promise((resolve) => {
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending email:", error);

        resolve({
          error: "Something went wrong, please try again",
        });
      } else {
        console.log("Email sent:", info.response);

        resolve({
          success: "Email sent",
          info,
        });
      }
    });
  });
};

export default sendMail;