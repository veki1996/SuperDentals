import { prisma } from '/utils/db';
import { deleteImageFromServer } from '/utils/deleteImage';

export default async function handler(req, res) {
	if (req.method === 'DELETE') {
		const { id } = req.body;
		try {
			const employee = await prisma.employee.delete({
				where: {
					id: id,
				},
			});

			if (employee.imageId !== null) {
				const image = await prisma.image.delete({
					where: {
						id: employee.imageId,
					},
				});
				deleteImageFromServer(image.name);
			}
			res.status(200).json({ message: 'Employee deleted', employee });
		} catch (error) {
			res.status(400).json({ message: error });
		}
	}
}
