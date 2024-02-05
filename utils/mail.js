const nodemailer = require('nodemailer');

export const sendEmail = async (mail) => {
	const contactEmail = nodemailer.createTransport({
		host: 'smtp.postmarkapp.com',
		port: 25,
		secure: false, // upgrade later with STARTTLS
		auth: {
			user: process.env.POSTMARK_SMTP_USERNAME,
			pass: process.env.POSTMARK_SMTP_PASSWORD,
		},
	});

	let sendingEmail = await contactEmail.sendMail(mail);

	return sendingEmail;
};
