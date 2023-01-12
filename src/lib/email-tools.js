import sgMail from "@sendgrid/mail"
sgMail.setApiKey(process.env.SENDGRID_API_KEY)

export const sendRegistrationEmail = async (recipientAddress) => {
  const msg = {
    to: recipientAddress,
    from: process.env.SENDER_EMAIL,
    subject: "Hello first email sent!",
    text: "testing emails from backend",
    html: "<strong>testing emails from backend</strong>"
  }
  await sgMail.send(msg)
}
