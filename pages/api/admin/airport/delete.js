import { prisma } from '/utils/db';
export default async function handler(req, res) {
	if (req.method === 'DELETE') {
		const { id } = req.body;
		try {
			const airport = await prisma.airport.delete({
				where: {
					id: id,
				},
			});
			res.status(200).json({ message: 'Airport deleted', airport });
		} catch (error) {
			res.status(400).json({ message: error });
		}
	}
}
