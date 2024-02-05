import { prisma } from '/utils/db';

export default async function handler(req, res) {
	if (req.method === 'POST') {
		const { dateRange } = req.body;
		try {
			const now = new Date();

			if (dateRange === 'allTime') {
				const subscribers = await prisma.subscriber.findMany();
				res.status(200).json({ message: 'Views filtered', subscribers });
			}

			if (dateRange === 'currentYear') {
				const subscribers = await prisma.subscriber.findMany({
					where: {
						createdAt: {
							lte: now,
							gte: new Date(now.getFullYear(), 0, 1),
						},
					},
				});
				res.status(200).json({ message: 'Views filtered', subscribers });
			}

			if (dateRange === 'currentMonth') {
				const subscribers = await prisma.subscriber.findMany({
					where: {
						createdAt: {
							lte: now,
							gte: new Date(now.getFullYear(), now.getMonth(), 1),
						},
					},
				});

				res.status(200).json({ message: 'Views filtered', subscribers });
			}

			if (dateRange === 'currentDay') {
				const getPreviousDay = () => {
					const prev = new Date(now.getTime());
					prev.setDate(now.getDate() - 1);

					return prev;
				};
				const subscribers = await prisma.subscriber.findMany({
					where: {
						createdAt: {
							lte: now,
							gt: getPreviousDay(now),
						},
					},
				});
				res.status(200).json({ message: 'Views filtered', subscribers });
			}

			if (dateRange === 'lastMonth') {
				const subscribers = await prisma.subscriber.findMany({
					where: {
						createdAt: {
							lte: new Date(now.getFullYear(), now.getMonth(), 0),
							gte: new Date(now.getFullYear(), now.getMonth() - 1, 1),
						},
					},
				});

				res.status(200).json({ message: 'Views filtered', subscribers });
			}

			if (dateRange === 'lastWeek') {
				const subscribers = await prisma.subscriber.findMany({
					where: {
						createdAt: {
							lte: now,
							gte: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7),
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
