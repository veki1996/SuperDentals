import { prisma } from '/utils/db';

export default async function handler(req, res) {
	if (req.method === 'POST') {
		const { email } = req.body;
		try {
			const newsletter = await prisma.newsletter.create({
				data: {
					email: email,
				},
			});
			res.status(201).json({ message: 'Added to Newsletter', newsletter });
		} catch (error) {
			if ((error.code = 'P2002')) {
				res.status(400).json({ message: `Email ${email} already subscribed!` });
			}
			res.status(400).json({ message: error, status: error.status, code: error.code });
		}
	}
}
