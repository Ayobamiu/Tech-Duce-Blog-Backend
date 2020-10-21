const sgMail = require("@sendgrid/mail");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);
const msg = {
  to: "ayobamiu@gmail.com",
  from: "usman.ayobami.g20@gmail.com", // Use the email address or domain you verified above
  subject: "Sending with Twilio SendGrid is Fun",
  text: "and easy to do anywhere, even with Node.js",
  html: "<strong>and easy to do anywhere, even with Node.js</strong>",
};

// sgMail.send(msg);

const sendWelcomeMessage = (email, name) => {
  const msg = {
    to: email,
    from: "usman.ayobami.g20@gmail.com", // Use the email address or domain you verified above
    subject: "Welcome to our blog. ",
    text: "Welcome " + name + ", get ready to for exciting updates. ",
  };

  sgMail.send(msg);
};

const sendCancellationMessage = (email, name) => {
  const msg = {
    to: email,
    from: "usman.ayobami.g20@gmail.com", // Use the email address or domain you verified above
    subject: "We will miss you",
    text: name + ", Tell us how we could be better",
  };

  sgMail.send(msg);
};

const resetPasswordMessage = (email, token) => {
  const msg = {
    to: email,
    from: "usman.ayobami.g20@gmail.com", // Use the email address or domain you verified above
    subject: "Reset Password",
    text: `Click the followiing link to reset password  ${process.env.ORIGIN_URL}/reset-password/${token}`,
  };

  sgMail.send(msg);
};

module.exports = {
  sendWelcomeMessage,
  sendCancellationMessage,
  resetPasswordMessage,
};
