import { prisma } from '/utils/db';

export default async function handler(req, res) {
	if (req.method === 'POST') {
		const { country, city, service, rating, locale } = req.body;

		try {
			const clinics = await prisma.clinic.findMany({
				where: {
					...(country
						? {
								location: {
									country: {
										equals: country,
									},
								},
						  }
						: {}),

					...(city
						? {
								location: {
									cityName: {
										equals: city.trim().split('-').join(' '),
									},
								},
						  }
						: {}),
					...(service
						? {
								services: {
									some: {
										AND: [
											{
												name: {
													path: '$[*].country',
													array_contains: locale,
												},
											},
											{
												name: {
													path: '$[*].name',
													array_contains: service?.trim()?.split('_').join(' '),
												},
											},
										],
									},
								},
						  }
						: {}),
					...(rating
						? {
								rating: {
									lte: rating[1],
									gte: rating[0],
								},
						  }
						: {}),
				},
				include: {
					clinicServices: {
						include: {
							service: true,
						},
					},
					location: true,
					services: true,
					images: true,
					user: {
						include: {
							subscriber: {
								include: {
									package: true,
								},
							},
						},
					},
				},
			});
			res.status(200).json({ message: 'Clinics filtered', clinics });
		} catch (error) {
			res.status(400).json({ message: error });
		}
	}
}
