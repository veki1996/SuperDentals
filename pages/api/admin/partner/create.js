import { prisma } from '/utils/db';

export default async function handler(req, res) {
	if (req.method === 'POST') {
		const { imageId, name, website, description } = req.body;

		try {
			const partner = await prisma.partner.create({
				data: {
					imageId: imageId,
					name: name,
					website: website,
					description: description,
				},
			});

			res.status(201).json({
				message: 'Partner created',
				partner,
			});
		} catch (error) {
			res.status(400).json({ error: error.message });
		}
	}
}
