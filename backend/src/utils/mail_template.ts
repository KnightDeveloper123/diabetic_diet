interface MailTemplateProps {
  name: string;
  content: string;
}

interface PasswordEmailProps {
  name: string;
  link: string;
}

const mailTemplates = ({
  name,
  content,
}: MailTemplateProps): string => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Diabetic Diet Assistant</title>
    </head>

    <body style="margin:0;padding:0;background:#0f2342;font-family:Arial,sans-serif;">
      <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
        <tr>
          <td align="center" style="padding:40px 10px;">
            <table
              width="600"
              cellpadding="0"
              cellspacing="0"
              role="presentation"
              style="max-width:600px;width:100%;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 10px rgba(0,0,0,0.08);"
            >
              <!-- Header -->
              <tr>
                <td
                  align="center"
                  style="background:#0f2342;color:#ffffff;padding:30px;font-size:24px;font-weight:bold;"
                >
                  Diabetic Diet Assistant
                </td>
              </tr>

              <!-- Body -->
              <tr>
                <td style="padding:40px 30px;">
                  ${content}
                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td
                  align="center"
                  style="padding:20px;background:#f9fafb;color:#9ca3af;font-size:13px;"
                >
                  &copy; 2026 Diabetic Diet Assistant
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
};

// Create password email
export const createPassword = ({
  name,
  link,
}: PasswordEmailProps): string => {
  const content = `
    <p style="font-size:16px;color:#4b5563;line-height:1.7;">
      Hello ${name},
    </p>

    <p style="font-size:16px;color:#4b5563;line-height:1.7;">
      Your account is ready! Click the button below to set your password.
    </p>

    <table cellpadding="0" cellspacing="0" role="presentation" style="margin:30px 0;">
      <tr>
        <td align="center" style="background:#0ea5e9;border-radius:8px;">
          <a
            href="${link}"
            style="display:inline-block;padding:14px 30px;color:#ffffff;text-decoration:none;font-weight:bold;"
          >
            Create Password
          </a>
        </td>
      </tr>
    </table>
  `;

  return mailTemplates({ name, content });
};

// Forgot password email
export const forgotPassword = ({
  name,
  link,
}: PasswordEmailProps): string => {
    console.log(name)
    console.log(link)
  const content = `
    <p style="font-size:16px;color:#4b5563;line-height:1.7;">
      Hello ${name},
    </p>

    <p style="font-size:16px;color:#4b5563;line-height:1.7;">
      We received a request to reset your password.
    </p>

    <p style="font-size:16px;color:#4b5563;line-height:1.7;">
      Click the button below to create a new password.
    </p>

    <table cellpadding="0" cellspacing="0" role="presentation" style="margin:30px 0;">
      <tr>
        <td align="center" style="background:#ef4444;border-radius:8px;">
          <a
            href="${link}"
            style="display:inline-block;padding:14px 30px;color:#ffffff;text-decoration:none;font-size:16px;font-weight:bold;"
          >
            Reset Password
          </a>
        </td>
      </tr>
    </table>

    <p style="font-size:14px;color:#6b7280;">
      This link will expire in 30 minutes.
    </p>

    <p style="font-size:14px;color:#6b7280;">
      If you did not request a password reset, please ignore this email.
    </p>
  `;

  return mailTemplates({ name, content });
};

// Escape dynamic HTML values
// const escapeHtml = (value: string): string => {
//   return value.replace(/[&<>"']/g, (char) => {
//     const entities: Record<string, string> = {
//       "&": "&amp;",
//       "<": "&lt;",
//       ">": "&gt;",
//       '"': "&quot;",
//       "'": "&#39;",
//     };

//     return entities[char];
//   });
// };

export default mailTemplates;