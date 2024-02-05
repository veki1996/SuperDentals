import { prisma } from '/utils/db';
export default async function handler(req, res) {
	if (req.method === 'DELETE') {
		const { id } = req.body;
		try {
			const city = await prisma.location.delete({
				where: {
					id: id,
				},
			});
			res.status(200).json({ message: 'City deleted', city });
		} catch (error) {
			res.status(400).json({ message: error });
		}
	}
}
