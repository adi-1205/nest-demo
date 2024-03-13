import { Injectable } from '@nestjs/common';
import * as mailer from 'nodemailer'
import { SendHtmlMailOptions } from './interfaces/html-mail.interface';
import * as hbs from 'handlebars';

@Injectable()
export class MailService {

    private htmlTemplate

    constructor() {
        this.htmlTemplate = `
        <h1>Click below link to verify your accout</h1>
        <a href="{{url}}">Verify my email</a>
        `
    }

    createTransport(): mailer.Transporter {
        return mailer.createTransport({
            service: "Gmail",
            host: "smtp.gmail.com",
            port: 465,
            secure: true,
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_KEY
            }
        });
    }

    async sendMail(options: mailer.SendMailOptions): Promise<any> {
        const transporter = this.createTransport();
        try {
            const result = await transporter.sendMail(options);
            console.log('Email sent successfully:', result);
            return { result, sent: true };
        } catch (error) {
            return { error, sent: false }
        }
    }


    async sendHtmlMail(options: SendHtmlMailOptions): Promise<any> {
        const transporter = this.createTransport();
        let compiled = hbs.compile(this.htmlTemplate)
        let htmlOutput = compiled(options.context)
        try {
            const result = await transporter.sendMail({
                ...options,
                html: htmlOutput
            });
            return { result, sent: true };
        } catch (error) {
            return { error, sent: false }
        }
    }
}