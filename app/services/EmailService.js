const config = require('../config');
const nodemailer = require('nodemailer');
const logger = require('log4js').getLogger('app/service/EmailService');

class EmailService {
    /**
     * Send an email
     * Ref: https://nodemailer.com/message/
     *
     * @param message object with the following properties
     *     from: Address of the sender, optional, default: this.defaultFrom
     *     to: Comma separated list or an array of recipients email addresses that will appear on the To: field
     *     cc: Comma separated list or an array of recipients email addresses that will appear on the Cc: field
     *     bcc: Comma separated list or an array of recipients email addresses that will appear on the Bcc: field
     *     subject: Subject of the email
     *     text: Plain text version of the email as an Unicode string, Buffer, Stream or an attachment-like object
     *     html: Html version of the email as an Unicode string, Buffer, Stream or an attachment-like object
     *     attachments: An array of attachment objects (See the ref link for more details)
     *
     *
     * @return {Promise<*>}
     */
    async send(message) {
        this._checkTransporter();

        try {
            return await this.transporter.sendMail(message);
        } catch (e) {
            logger.error('Fail to send email', e);
            throw new BusinessError(e.message);
        }
    }

    async setupTransporter() {
        const transConfig = await this.getMailTransporterConfig();
        if (!transConfig) {
            logger.info('SMTP server has not been configured yet, so we cannot send email');
            return;
        }

        this.transporter = nodemailer.createTransport(transConfig, {
            from: this.defaultFrom
        });

        if (config['SMTP_TEST_SENDING_EMAIL_ON_BOOTING'] === 'true') {
            logger.info('Sending test email');
            await this.verify();
        }

        return this.transporter;
    }

    _checkTransporter() {
        if (!this.transporter) {
            throw new BusinessError('There is no transporter to send email');
        }
    }

    get defaultFrom() {
        return 'Frameworkless <noreply@fwl.com>';
    }

    async verify() {
        this._checkTransporter();

        try {
            await this.transporter.verify();
            logger.info('Test email has been sent successfully');
        } catch (e) {
            throw new BusinessError('Error while sending a test email', e.message);
        }
    }

    async getMailTransporterConfig() {
        const {SMTP_HOST, SMTP_PORT, SMTP_USE_TLS, SMTP_AUTH_USER, SMTP_AUTH_PASS} = config;

        if (SMTP_HOST && SMTP_PORT) {
            return {
                host: SMTP_HOST,
                port: SMTP_PORT,
                secure: SMTP_USE_TLS === 'true',
                auth: {
                    user: SMTP_AUTH_USER,
                    pass: SMTP_AUTH_PASS
                }
            };
        }

        return null;
    }
}

module.exports = new EmailService();
