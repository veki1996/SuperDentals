import { prisma } from '/utils/db';

export default async function handler(req, res) {
	if (req.method === 'POST') {
		const { user, subPackage, referalCode, discountedPrice } = req.body;

		try {
			const subscriber = await prisma.subscriber.create({
				data: {
					userId: user,
					subscriptionPackageId: subPackage,
					discountedPackagePrice: discountedPrice || 'No Discount',
					referalCode: referalCode === '' ? null : referalCode,
				},
			});

			res.status(201).json({
				message: 'Subscriber created',
				subscriber,
			});
		} catch (error) {
			res.status(400).json({ error: error.message });
		}
	}
}
