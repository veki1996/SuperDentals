import { prisma } from '/utils/db';

export default async function handler(req, res) {
	if (req.method === 'POST') {
		const { title, website, position, imageId, country } = req.body;
		try {
			const banner = await prisma.banner.create({
				data: {
					title: title,
					website: website,
					position: position,
					country: country,
					imageId: imageId,
				},
			});
			res.status(201).json({ message: 'Banner created', banner });
		} catch (error) {
			res.status(400).json({ message: error });
		}
	}
}
