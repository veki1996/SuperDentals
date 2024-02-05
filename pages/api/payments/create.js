import { prisma } from '/utils/db';

export default async function handler(req, res) {
	if (req.method === 'POST') {
		const {
			transactionId,
			subscriptionId,
			amount,
			package: packageName,
			status,
			paymentMethod,
			userId,
			discounts,
		} = req.body;

		try {
			const duplicatePayment = await prisma.payment.findFirst({
				where: {
					subscriptionId: {
						equals: subscriptionId,
					},
				},
			});

			if (!duplicatePayment) {
				const payment = await prisma.payment.create({
					data: {
						userId: userId,
						amount: amount,
						discounts: JSON.stringify(discounts),
						package: packageName,
						paymentMethod: paymentMethod,
						subscriptionId: subscriptionId,
						transactionId: transactionId,
						status: status,
					},
				});

				res.status(201).json({ message: 'Payment created', payment });
			}
		} catch (error) {
			res.status(400).json({ message: error });
		}
	}
}
