import { prisma } from '/utils/db';

export default async function handler(req, res) {
	if (req.method === 'POST') {
		const { premium, id } = req.body;
		try {
			const clinic = await prisma.clinic.update({
				where: {
					id: id,
				},
				data: {
					premium: premium,
				},
			});
			res.status(200).json({ message: 'Clinic updated', clinic });
		} catch (error) {
			res.status(400).json({ message: error });
		}
	}
}
