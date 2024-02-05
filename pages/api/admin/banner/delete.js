import { prisma } from '/utils/db';
import { deleteImageFromServer } from '/utils/deleteImage';

export default async function handler(req, res) {
	if (req.method === 'DELETE') {
		const { id } = req.body;
		try {
			const banner = await prisma.banner.delete({
				where: {
					id: id,
				},
			});

			if (banner.imageId !== null) {
				const image = await prisma.image.delete({
					where: {
						id: banner.imageId,
					},
				});
				deleteImageFromServer(image.name);
			}
			res.status(200).json({ message: 'Employee deleted', banner });
		} catch (error) {
			res.status(400).json({ message: error });
		}
	}
}
