import { prisma } from '/utils/db';

export default async function handler(req, res) {
	if (req.method === 'POST') {
		const { dateRange } = req.body;
		try {
			const now = new Date();

			if (dateRange === 'allTime') {
				const users = await prisma.user.findMany();
				res.status(200).json({ message: 'Views filtered', users });
			}

			if (dateRange === 'currentYear') {
				const users = await prisma.user.findMany({
					where: {
						createdAt: {
							lte: now,
							gte: new Date(now.getFullYear(), 0, 1),
						},
					},
				});
				res.status(200).json({ message: 'Views filtered', users });
			}

			if (dateRange === 'currentMonth') {
				const users = await prisma.user.findMany({
					where: {
						createdAt: {
							lte: now,
							gte: new Date(now.getFullYear(), now.getMonth(), 1),
						},
					},
				});

				res.status(200).json({ message: 'Views filtered', users });
			}

			if (dateRange === 'currentDay') {
				const getPreviousDay = () => {
					const prev = new Date(now.getTime());
					prev.setDate(now.getDate() - 1);

					return prev;
				};
				const users = await prisma.user.findMany({
					where: {
						createdAt: {
							lte: now,
							gt: getPreviousDay(now),
						},
					},
				});
				res.status(200).json({ message: 'Views filtered', users });
			}

			if (dateRange === 'lastMonth') {
				const users = await prisma.user.findMany({
					where: {
						createdAt: {
							lte: new Date(now.getFullYear(), now.getMonth(), 0),
							gte: new Date(now.getFullYear(), now.getMonth() - 1, 1),
						},
					},
				});

				res.status(200).json({ message: 'Views filtered', users });
			}

			if (dateRange === 'lastWeek') {
				const users = await prisma.user.findMany({
					where: {
						createdAt: {
							lte: now,
							gte: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7),
						},
					},
				});

				res.status(200).json({ message: 'Views filtered', users });
			}
		} catch (error) {
			res.status(400).json({ message: error });
		}
	}
}
