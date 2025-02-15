// Konfigurasi NodeMailer

import nodemailer from "nodemailer";
import ejs from "ejs";

// Menggunakan fitur dari Node JS untuk memanggil File
import path from "path"

import {
    EMAIL_SMTP_HOST,
    EMAIL_SMTP_PASS,
    EMAIL_SMTP_PORT,
    EMAIL_SMTP_SECURE,
    EMAIL_SMTP_SERVICE_NAME,
    EMAIL_SMTP_USER
} from "../env"

// Mail Verification
const transporter = nodemailer.createTransport({
    service: EMAIL_SMTP_SERVICE_NAME,
    host: "rydhlnst@gmail.com",
    port: EMAIL_SMTP_PORT,
    secure: EMAIL_SMTP_SECURE,
    auth: {
        user: EMAIL_SMTP_USER,
        pass: EMAIL_SMTP_PASS
    },
    requireTLS: true
});

// Ngirim Email

export interface ISendMail {
    from: string;
    to: string;
    subject: string;
    html: string
}

export const sendMail = async ({
    ...mailParams
}: ISendMail) => {
    const result = await transporter.sendMail({
        ...mailParams
    });
    return result;
} 

// Mengambil template HTML yang udah diubah menjadi .ejs
export const renderMailHtml = async (template: string, data: any): Promise<string> => {
    const content = await ejs.renderFile(path.join(__dirname, `templates/${template}`), data);
    return content as string;
}