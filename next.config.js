/** @type {import('next').NextConfig} */
const cron = require('node-cron');

/* This code is scheduling a cron job to run at 7:00 AM every day. The job consists of making two HTTP
requests to the specified endpoints: `${process.env.BASE_URL}/api/subscribers/cron` and
`${process.env.BASE_URL}/api/user/cron`. */
cron.schedule('0 7 * * *', async () => {
	await fetch(`${process.env.BASE_URL}/api/subscribers/cron`);
	await fetch(`${process.env.BASE_URL}/api/user/cron`);
});

const nextTranslate = require('next-translate');
const nextConfig = {
	...nextTranslate(),
	reactStrictMode: true,
	swcMinify: false,
	images: {
		domains: ['localhost'],
	},
	env: {
		BASE_URL: process.env.BASE_URL,
		PRODUCTION_BASE_URL: process.env.PRODUCTION_BASE_URL,
	},
};

module.exports = nextConfig;
