import { prisma } from '/utils/db';

export default async function handler(req, res) {
	if (req.method === 'POST') {
		const { uid } = req.body;

		try {
			const payment = await prisma.payment.updateMany({
				where: {
					subscriptionId: {
						equals: uid,
					},
				},
				data: {
					status: 'PAID',
				},
			});

			res.status(200).json({ message: 'Payment updated', payment });
		} catch (error) {
			res.status(400).json({ message: error });
		}
	}
}
