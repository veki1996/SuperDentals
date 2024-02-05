import { PrismaClient } from '@prisma/client';

// import { prisma } from '/utils/db';
const prisma = new PrismaClient();
export default async function handler(req, res) {
	if (req.method === 'GET') {
		try {
			const MAX_SHOWN_CLINICS = 6;

			let clinics;

			const premiumClinics = await prisma.clinic.findMany({
				where: {
					premium: {
						equals: true,
					},
					user: {
						active: {
							equals: true,
						},
					},
				},
				include: {
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
					clinicServices: {
						include: {
							service: true,
						},
					},
				},
				take: MAX_SHOWN_CLINICS,
			});

			if (premiumClinics?.length < MAX_SHOWN_CLINICS) {
				const nonPremium = await prisma.clinic.findMany({
					where: {
						premium: {
							equals: false,
						},
						user: {
							active: {
								equals: true,
							},
						},
					},
					include: {
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
						clinicServices: {
							include: {
								service: true,
							},
						},
					},
					take: MAX_SHOWN_CLINICS - premiumClinics?.length,
				});
				clinics = [...premiumClinics, ...nonPremium];
			} else {
				clinics = [...premiumClinics];
			}

			res.status(200).json({ message: 'Clinics filtered', clinics });
		} catch (error) {
			res.status(400).json({ message: error });
		}
	}
}
