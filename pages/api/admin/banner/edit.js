import { prisma } from '/utils/db';

export default async function handler(req, res) {
	if (req.method === 'POST') {
		try {
			const { title, position, imageId, website, bannerId, country } = req.body;

			const banner = await prisma.banner.update({
				where: {
					id: bannerId,
				},
				data: {
					title: title,
					website: website,
					country: country,
					position: position,
					imageId: imageId,
				},
			});

			res.status(200).json({
				message: 'Partner edited',
				banner,
			});
		} catch (err) {
			res.status(400).json({ err: err.message });
		}
	}
}
