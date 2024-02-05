import { prisma } from '/utils/db';

export default async function handler(req, res) {
	if (req.method === 'GET') {
		const { email } = req.query;

		try {
			const isEmail = await prisma.user.findUnique({
				where: {
					email: email,
				},
			});
			if (isEmail) {
				res.status(200).json({ message: `Korisnik sa ovim emailom je već registrovan`, isEmail, status: 400 });
			} else {
				res.status(200).json({ message: ``, isEmail, status: 200 });
			}
		} catch (error) {
			res.status(400).json({
				message: error.message,
				status: error.code,
			});
		}
	}
}
// status: 200
