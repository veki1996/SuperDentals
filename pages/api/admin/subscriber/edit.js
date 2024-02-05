import { prisma } from '/utils/db';

export default async function handler(req, res) {
	if (req.method === 'POST') {
		try {
			const { subPackage, subscriberId, referalCode, approved, validDate, discountedPrice } = req.body;

			const subscriber = await prisma.subscriber.update({
				where: {
					id: subscriberId,
				},
				data: {
					subscriptionPackageId: subPackage,
					referalCode: referalCode === '' ? null : referalCode,
					discountedPackagePrice: discountedPrice && '0',
					approved: approved,
					validToDate: validDate,
				},
			});

			res.status(200).json({
				message: 'Subscriber Edited',
				subscriber,
			});
		} catch (err) {
			res.status(400).json({ err: err.message });
		}
	}
}
