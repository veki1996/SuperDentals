import { prisma } from '/utils/db';

export default async function handler(req, res) {
	if (req.method === 'POST') {
		const { subscriptionID, decrementReferral } = req.body;

		const dateWithMonthsDelay = (months) => {
			const date = new Date();
			date.setMonth(date.getMonth() + months);

			return date;
		};

		try {
			const subscriber = await prisma.subscriber.update({
				where: {
					UID: subscriptionID,
				},
				data: {
					approved: true,
					validToDate: dateWithMonthsDelay(12).toLocaleDateString('fr-CA'),
				},
			});

			const payment = await prisma.payment.findUnique({
				where: {
					subscriptionId: subscriptionID,
				},
			});

			if (subscriber) {
				await prisma.user.update({
					where: {
						id: subscriber?.userId,
					},
					data: {
						active: true,
						usedReferralCount: decrementReferral,
					},
				});
			}

			res.status(200).json({ message: 'Subscriber updated', subscriber, payment });
		} catch (error) {
			res.status(400).json({ message: error });
		}
	}
}
