import { generateResetPasswordEmailBody } from '../emails/resetPasswordEmail.js'

export async function sendResetEmail(email, resetToken) {
  const mailContent = generateResetPasswordEmailBody(resetToken)

  console.log(`\n======================================================`)
  console.log(`📧 [Nodemailer Mailer] Sending Email To: ${email}`)
  console.log(`📌 Subject: ${mailContent.subject}`)
  console.log(`------------------------------------------------------`)
  console.log(mailContent.text)
  console.log(`======================================================\n`)

  return {
    success: true,
    message: 'Password reset link has been sent to your registered email.',
    email,
    resetToken,
  }
}
