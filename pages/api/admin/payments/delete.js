import { prisma } from '/utils/db';

export default async function handler(req, res) {
	if (req.method === 'DELETE') {
		const { id } = req.body;

		try {
			const payment = await prisma.payment.delete({
				where: {
					id: id,
				},
			});

			res.status(200).json({ message: 'Payment deleted', payment });
		} catch (error) {
			res.status(400).json({ message: error });
		}
	}
}
