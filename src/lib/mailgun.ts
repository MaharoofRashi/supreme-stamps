import formData from 'form-data';
import Mailgun from 'mailgun.js';

if (!process.env.MAILGUN_API_KEY) {
    throw new Error('MAILGUN_API_KEY is not defined in environment variables');
}

if (!process.env.MAILGUN_DOMAIN) {
    throw new Error('MAILGUN_DOMAIN is not defined in environment variables');
}

// Initialize Mailgun client
const mailgun = new Mailgun(formData);
export const mg = mailgun.client({
    username: 'api',
    key: process.env.MAILGUN_API_KEY,
});

// Mailgun configuration
export const MAILGUN_CONFIG = {
    domain: process.env.MAILGUN_DOMAIN,
    from: `${process.env.MAILGUN_FROM_NAME || 'Supreme Stamps'} <${process.env.MAILGUN_FROM_EMAIL || 'orders@supremestamps.com'}>`,
} as const;
