export function generateResetPasswordEmailBody(token) {
  const resetLink = `https://localhost:5173/reset-password/${token}`

  return {
    subject: 'Trinity Engine Password Reset',
    text: `Hello,

A password reset request was received for your Trinity Engine account.

Click the secure link below to reset your password:

${resetLink}

This link expires in 15 minutes.

If you did not request a password reset, you can safely ignore this email.

Regards,
Trinity Engine Team`,
  }
}
