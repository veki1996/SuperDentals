import { prisma } from '/utils/db';
import { randomString } from '/utils/utils';

export default async function handler(req, res) {
	if (req.method === 'POST') {
		const { subPackage, referalCode, userId, discountedPrice, discountPercentage, paymentMethod, decrementReferral } =
			req.body;
		try {
			const subscriber = await prisma.subscriber.update({
				where: {
					userId: userId,
				},
				data: {
					referalCode: referalCode,
					subscriptionPackageId: subPackage?.id,
					discountedPackagePrice: discountedPrice || 'No Discount',
					UID: randomString(),
					discountPercentage: discountPercentage,
					approved: false,
					validToDate: '',
				},
				include: {
					user: true,
					package: true,
				},
			});

			await prisma.subscriber.updateMany({
				where: {
					referalCode: {
						equals: subscriber?.user?.referalCode,
					},
					approved: {
						equals: true,
					},
				},
				data: {
					referalCode: '',
				},
			});

			if (paymentMethod === 'INVOICE') {
				await prisma.user.update({
					where: {
						id: userId,
					},
					data: {
						usedReferralCount: {
							decrement: decrementReferral === 0 ? decrementReferral : decrementReferral / 5,
						},
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

			res.status(200).json({ message: 'Subscriber updated', subscriber });
		} catch (error) {
			res.status(400).json({ message: error });
		}
	}
}
