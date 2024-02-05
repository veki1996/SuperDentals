import { prisma } from '/utils/db';

export default async function handler(req, res) {
	if (req.method === 'POST') {
		const { dateRange, clinicId } = req.body;
		try {
			const now = new Date();

			if (dateRange === 'allTime') {
				const views = await prisma.viewsCounter.findMany({
					where: {
						clinicId: {
							equals: clinicId,
						},
					},
				});
				res.status(200).json({ message: 'Views filtered', views });
			}

			if (dateRange === 'currentYear') {
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
									lte: now,
									gte: new Date(now.getFullYear(), 0, 1),
								},
							},
						],
					},
				});
				res.status(200).json({ message: 'Views filtered', views });
			}

			if (dateRange === 'currentMonth') {
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
									lte: now,
									gte: new Date(now.getFullYear(), now.getMonth(), 1),
								},
							},
						],
					},
				});

				res.status(200).json({ message: 'Views filtered', views });
			}

			if (dateRange === 'currentDay') {
				const getPreviousDay = () => {
					const prev = new Date(now.getTime());
					prev.setDate(now.getDate() - 1);

					return prev;
				};
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
									lte: now,
									gt: getPreviousDay(now),
								},
							},
						],
					},
				});
				res.status(200).json({ message: 'Views filtered', views });
			}

			if (dateRange === 'lastMonth') {
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
									lte: new Date(now.getFullYear(), now.getMonth(), 0),
									gte: new Date(now.getFullYear(), now.getMonth() - 1, 1),
								},
							},
						],
					},
				});

				res.status(200).json({ message: 'Views filtered', views });
			}

			if (dateRange === 'lastWeek') {
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
									lte: now,
									gte: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7),
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
