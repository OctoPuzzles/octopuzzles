import nodemailer from 'nodemailer';
import { SMTP_SERVER, SMTP_PORT, SMTP_LOGIN, SMTP_PASSWORD, BASE_URL } from '$env/static/private';
import type SMTPTransport from 'nodemailer/lib/smtp-transport';

export async function sendVerifyUserMail(name: string, email: string, token: string) {
  const options: SMTPTransport.Options = {
    host: SMTP_SERVER,
    port: parseInt(SMTP_PORT),
    secure: false,
    auth: {
      user: SMTP_LOGIN,
      pass: SMTP_PASSWORD
    }
  };
  const transporter = nodemailer.createTransport(options);

  // send mail with defined transport object
  await transporter.sendMail({
    from: '"OctoPuzzles " <octo@octopuzzles.com>',
    to: `"${name}" " <${email}>"`,
    subject: 'Confirm your email at OctoPuzzles',
    text: `Confirm your OctoPuzzles account by following this link ${BASE_URL}/verify-account?token=${token}`,
    html: `<body style=margin:2rem;font-family:sans-serif;background-color:#f5f5f5;display:flex;justify-content:center><div style=margin:2rem;max-width:600px;background-color:#fff><div style=padding:1rem><svg aria-describedby=description aria-labelledby=title role=img viewBox="0 0 500 132"width=192 xmlns=http://www.w3.org/2000/svg><title id=title>Logo</title><desc id=description>A yellow arrow pointing right, with a gridlike interior pattern.</desc><rect fill=none height=29.735001 stroke=orange stroke-width=3 transform=rotate(45) width=29.735001 x=94.752281 y=-29.735001 /><rect fill=none height=29.734999 stroke=orange stroke-width=3 transform=rotate(45) width=29.734999 x=65.017281 y=-29.735001 /><rect fill=none height=29.734999 stroke=orange stroke-width=3 transform=rotate(45) width=29.734999 x=94.752281 y=-2.7684797e-07 /><rect fill=none height=29.734999 stroke=orange stroke-width=3 transform=rotate(45) width=29.734999 x=35.282314 y=-29.735001 /><rect fill=none height=29.734999 stroke=orange stroke-width=3 transform=rotate(45) width=29.734999 x=94.752281 y=29.735004 /><rect fill=none height=29.734999 stroke=orange stroke-width=3 transform=rotate(45) width=29.734999 x=65.017281 y=-4.0915452e-06 /><path d="M 45.97418,3.9225397 C 109.05164,66.999995 109.05164,66.999995 109.05164,66.999995 L 45.974183,130.07746 24.948361,109.05164 45.97418,88.02582 24.948361,66.999995 45.97418,45.974178 24.948359,24.948357 Z"fill=none paint-order="fill markers stroke"stroke=orange stroke-linecap=butt stroke-linejoin=round stroke-width=5 /><text font-family=sans-serif style=font-size:50px x=130 y=86.5>OctoPuzzles</text></svg></div><hr style="border:0;border-top:.5px solid #e0dddd"><h1 style=font-size:30px;text-align:center;color:#4b4949>Email address verification</h1><div style=display:flex;justify-content:center><a href="${BASE_URL}/verify-account?token=${token}"style="background-color:orange;border-radius:.5rem;padding:1rem 1rem;color:#fff;text-decoration:none;margin-top:2rem">Verify your email</a></div><div style=padding:2rem><p style=font-size:16px;color:#0a0a0a>Secure your OctoPuzzles account by verifying your email address.<p style=font-size:16px;color:#0a0a0a>This link will expire after 2 hours. To request another verification email, please login again to get a resend link.</div></div>`
  });
}
