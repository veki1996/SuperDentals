import { prisma } from '/utils/db';

export default async function handler(req, res) {
	if (req.method === 'POST') {
		const { subscriptionID, responseCode } = req.body;

		try {
			const payment = await prisma.payment.update({
				where: {
					subscriptionId: subscriptionID,
				},
				data: {
					status: responseCode === '0000' ? 'PAID' : 'FAILED',
				},
			});

			res.status(200).json({ message: 'Payment updated', payment });
		} catch (error) {
			res.status(400).json({ message: error });
		}
	}
}
