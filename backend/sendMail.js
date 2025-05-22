const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    secure: true,
    host: "smtp.gmail.com",
    port: 465,
    auth: {
        user: "karthik.jayavaram@gmail.com",
        pass: "motrjabyovsagrzo",
    }
});

// Email templates
const emailTemplates = {
    signup: (name) => ({
        subject: "Welcome to BreathSafe!",
        html: `
            <h1>Welcome to BreathSafe, ${name}!</h1>
            <p>Thank you for joining our community. We're excited to have you on board!</p>
            <p>With BreathSafe, you can:</p>
            <ul>
                <li>Monitor real-time air quality in your area</li>
                <li>Track your health assessments</li>
                <li>Get personalized air quality recommendations</li>
            </ul>
            <p>If you have any questions, feel free to reach out to our support team.</p>
            <p>Best regards,<br>The BreathSafe Team</p>
        `
    }),
    login: (name) => ({
        subject: "New Login to BreathSafe",
        html: `
            <h1>Hello ${name}!</h1>
            <p>We noticed a new login to your BreathSafe account.</p>
            <p>If this was you, you can ignore this email.</p>
            <p>If you didn't log in, please contact our support team immediately.</p>
            <p>Best regards,<br>The BreathSafe Team</p>
        `
    }),
    settings: (name) => ({
        subject: "Your BreathSafe Account Settings Have Been Updated",
        html: `
            <h1>Hello ${name}!</h1>
            <p>Your BreathSafe account settings have been successfully updated.</p>
            <p>If you made these changes, you can ignore this email.</p>
            <p>If you didn't make these changes, please contact our support team immediately.</p>
            <p>Best regards,<br>The BreathSafe Team</p>
        `
    })
};

async function sendMail(to, type, name) {
    try {
        const template = emailTemplates[type](name);
        
        const mailOptions = {
            from: "karthik.jayavaram@gmail.com",
            to: to,
            subject: template.subject,
            html: template.html
        };

        await transporter.sendMail(mailOptions);
        console.log(`Mail sent successfully to ${to}`);
        return true;
    } catch (error) {
        console.error('Error sending email:', error);
        return false;
    }
}

module.exports = sendMail;