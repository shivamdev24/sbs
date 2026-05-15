export const baseTemplate = (params: {
  logoUrl: string;
  title: string;
  message: string;
  otp?: string;
  footerNote: string;
  brandName: string;
  note: string;
}) => {
  const { logoUrl, title, message, otp, note, footerNote, brandName } = params;

  const otpBlock = otp
    ? `
      <table width="100%" cellpadding="0" cellspacing="0" style="margin:20px 0;">
        <tr>
          <td align="center">
            <div style="
              font-size:28px;
              font-weight:bold;
              letter-spacing:6px;
              background:#f1f5f9;
              padding:15px 20px;
              border-radius:6px;
              display:inline-block;
            ">
              ${otp}
            </div>
          </td>
        </tr>
      </table>
    `
    : "";

  return `
  <!DOCTYPE html>
  <html>
    <body style="margin:0; padding:0; background-color:#f4f6f8; font-family:Arial, sans-serif;">
      <table width="100%" cellpadding="0" cellspacing="0" style="padding:20px 0;">
        <tr>
          <td align="center">
            
            <table width="500" cellpadding="0" cellspacing="0" style="background:#ffffff; border-radius:8px; overflow:hidden;">

              <!-- Header -->
              <tr>
                <td style="background:#111; padding:20px; text-align:center;">
                  <img src="${logoUrl}" width="120" style="display:block; margin:auto;" />
                </td>
              </tr>

              <!-- Body -->
              <tr>
                <td style="padding:30px 20px; color:#333;">
                  
                  <h2 style="margin:0 0 10px;">${title}</h2>

                  <p style="margin:0 0 20px; line-height:1.5;">
                    ${message}
                  </p>

                  <p style="margin:0 0 20px; line-height:1.5;">
                    ${note}
                  </p>

                  ${otpBlock}

                  <p style="margin-top:20px; font-size:14px; color:#666;">
                    ${footerNote}
                  </p>

                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td style="background:#f9fafb; padding:15px; text-align:center; font-size:12px; color:#888;">
                  <p style="margin:0;">© ${new Date().getFullYear()} ${brandName}</p>
                  <p style="margin:5px 0 0;">This is an automated email, please do not reply.</p>
                  <p style="margin:5px 0 0; font-size:8px;">Developed By <a href="https://www.shivamdev24.in">shivamdev24.in</a>. Powerd by <a href="https://www.refinix.in">refinix.in</a></p>
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
