export default function handler(req, res) {
	const forwardedFor = req.headers['x-forwarded-for'];

	const ip = forwardedFor ? forwardedFor.split(/, /)[0] : req.connection.remoteAddress;

	res.status(200).json({ ip: ip });
}
