import { prisma } from '/utils/db';

export default async function handler(req, res) {
	if (req.method === 'POST') {
		const { startDate, endDate } = req.body;
		try {
			if (startDate !== '' && endDate !== '') {
				const subscribers = await prisma.subscriber.findMany({
					where: {
						createdAt: {
							lte: new Date(new Date(endDate)),
							gte: new Date(startDate),
						},
					},
				});
				res.status(200).json({ message: 'Views filtered', subscribers });
			}
		} catch (error) {
			res.status(400).json({ message: error });
		}
	}
}
