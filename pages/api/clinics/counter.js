import { prisma } from '/utils/db';

export default async function handler(req, res) {
	if (req.method === 'POST') {
		const { clinicId, date } = req.body;

		try {
			const dateCount = await prisma.viewsCounter.findFirst({
				where: {
					clinicId: clinicId,
					date: date,
				},
			});

			if (dateCount) {
				await prisma.viewsCounter.update({
					where: {
						id: dateCount.id,
					},
					data: {
						views: {
							increment: 1,
						},
					},
				});

				res.status(200).json({ message: `New view for ${clinicId} on ${date}` });
			} else {
				await prisma.viewsCounter.create({
					data: {
						clinicId: clinicId,
						date: date,
						views: 1,
					},
				});
				res.status(200).json({ message: `First view for ${clinicId} on ${date}` });
			}
		} catch (error) {
			res.status(400).json({
				message: error.message,
				status: error.code,
			});
		}
	}
}
