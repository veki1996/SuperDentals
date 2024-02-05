import { prisma } from '/utils/db';

export default async function handler(req, res) {
	if (req.method === 'POST') {
		const { startDate, endDate, clinicId } = req.body;
		try {
			if (startDate !== '' && endDate !== '') {
				const views = await prisma.viewsCounter.findMany({
					where: {
						AND: [
							{
								clinicId: {
									equals: clinicId,
								},
							},
							{
								createdAt: {
									lte: new Date(new Date(endDate)),
									gte: new Date(startDate),
								},
							},
						],
					},
				});
				res.status(200).json({ message: 'Views filtered', views });
			}
		} catch (error) {
			res.status(400).json({ message: error });
		}
	}
}
