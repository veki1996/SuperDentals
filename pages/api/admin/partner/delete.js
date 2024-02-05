import { deleteImageFromServer } from '/utils/deleteImage';
import { prisma } from '/utils/db';

export default async function handler(req, res) {
	if (req.method === 'DELETE') {
		const { id } = req.body;
		try {
			const partner = await prisma.partner.delete({
				where: {
					id: id,
				},
			});
			if (partner.imageId !== null) {
				const image = await prisma.image.delete({
					where: {
						id: partner.imageId,
					},
				});
				deleteImageFromServer(image.name);
			}

			res.status(200).json({ message: 'Partner deleted', partner });
		} catch (error) {
			res.status(400).json({ message: error });
		}
	}
}
