import { prisma } from '/utils/db';

export default async function handler(req, res) {
	if (req.method === 'POST') {
		const { promoCode } = req.body;
		try {
			const user = await prisma.user.findMany({
				where: {
					referalCode: {
						equals: promoCode,
					},
				},
			});
			if (user?.length > 0) {
				res.status(200).json({ message: 'Promo Code found', status: 200 });
			} else {
				res.status(200).json({ message: 'Promo Code not found', status: 400 });
			}
		} catch (error) {
			res.status(400).json({ message: error });
		}
	}
}
