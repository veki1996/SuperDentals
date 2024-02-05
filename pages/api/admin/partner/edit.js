import { prisma } from '/utils/db';

export default async function handler(req, res) {
	if (req.method === 'POST') {
		try {
			const { name, imageId, website, description, partnerId } = req.body;

			const partner = await prisma.partner.update({
				where: {
					id: partnerId,
				},
				data: {
					name: name,
					imageId: imageId,
					website: website,
					description: description,
				},
			});

			res.status(200).json({
				message: 'Partner edited',
				partner,
			});
		} catch (err) {
			res.status(400).json({ err: err.message });
		}
	}
}
