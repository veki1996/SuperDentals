import { prisma } from '/utils/db';
import { randomString } from '/utils/utils';

export default async function handler(req, res) {
	if (req.method === 'POST') {
		const { subPackage, referalCode, userId, discountedPrice, discountPercentage } = req.body;
		try {
			const subscriber = await prisma.subscriber.create({
				data: {
					referalCode: referalCode,
					subscriptionPackageId: subPackage?.id,
					discountedPackagePrice: discountedPrice || 'No Discount',
					UID: randomString(),
					discountPercentage: discountPercentage,
					userId: userId,
				},
				include: {
					user: true,
					package: true,
				},
			});
			if (subscriber) {
				await prisma.user.update({
					where: {
						id: subscriber?.user?.id,
					},
					data: {
						onboardingComplete: true,
					},
				});
			}

			if (referalCode) {
				await prisma.user.updateMany({
					where: {
						referalCode: {
							equals: referalCode,
						},
					},
					data: {
						usedReferralCount: {
							increment: 1,
						},
					},
				});
			}
			res.status(201).json({ message: 'Subscriber created', subscriber });
		} catch (error) {
			res.status(400).json({ message: error });
		}
	}
}
