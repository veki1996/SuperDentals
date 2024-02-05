import { prisma } from '/utils/db';

export default async function handler(req, res) {
	if (req.method === 'GET') {
		const { name } = req.query;
		try {
			const clinic = await prisma.clinic.findUnique({
				where: {
					username: name,
				},
			});
			if (clinic) {
				res.status(200).json({ message: `Korisničko ime je zauzeto.`, clinic, status: 400 });
			} else {
				res.status(200).json({ message: `Korisničko ime je dostupno.`, clinic, status: 200 });
			}
		} catch (error) {
			res.status(400).json({
				message: error.message,
				status: error.code,
			});
		}
	}
}
