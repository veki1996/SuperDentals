import { prisma } from '/utils/db';
export default async function handler(req, res) {
	if (req.method === 'DELETE') {
		const { id } = req.body;
		try {
			const subscriptionPackage = await prisma.subscriptionPackage.delete({
				where: {
					id: id,
				},
			});
			res.status(200).json({ message: 'Service Category deleted', subscriptionPackage });
		} catch (error) {
			res.status(400).json({ message: error });
		}
	}
}
