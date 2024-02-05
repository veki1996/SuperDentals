import { prisma } from '/utils/db';

export default async function handler(req, res) {
	if (req.method === 'POST') {
		const { name } = req.body;

		try {
			const serviceCategory = await prisma.serviceCategory.create({
				data: {
					name: name,
				},
			});

			res.status(201).json({
				message: 'Service category created',
				serviceCategory,
			});
		} catch (error) {
			res.status(400).json({ error: error.message });
		}
	}
}
