import { prisma } from '/utils/db';

export default async function handler(req, res) {
	if (req.method === 'POST') {
		const { id } = req.body;

		try {
			const clinic = await prisma.clinic.findFirst({
				where: {
					userId: {
						equals: id,
					},
				},
			});
			res.status(200).json({ message: 'Clinic created', clinic: clinic || false });
		} catch (error) {
			res.status(400).json({
				message: error.message,
				status: error.code,
			});
		}
	}
}
