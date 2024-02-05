import { prisma } from '/utils/db';

export default async function handler(req, res) {
	if (req.method === 'POST') {
		try {
			const { name, serviceCategoryId } = req.body;

			const serviceCategory = await prisma.serviceCategory.update({
				where: {
					id: serviceCategoryId,
				},
				data: {
					name: name,
				},
			});

			res.status(200).json({
				message: 'Service Category edited',
				serviceCategory,
			});
		} catch (err) {
			res.status(400).json({ err: err.message });
		}
	}
}
