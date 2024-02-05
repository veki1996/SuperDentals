import { prisma } from '/utils/db';

export default async function handler(req, res) {
	if (req.method === 'POST') {
		const { name, priceSerbia, priceMontenegro, priceBosnia, discountSerbia, discountMontenegro, discountBosnia } =
			req.body;

		const jsonPrices = [
			{
				country: 'rs',
				price: priceSerbia,
				currency: 'EUR',
			},
			{
				country: 'cg',
				price: priceMontenegro,
				currency: 'EUR',
			},
			{
				country: 'ba',
				price: priceBosnia,
				currency: 'BAM',
			},
		];

		const jsonDiscounts = [
			{
				country: 'rs',
				value: discountSerbia,
			},
			{
				country: 'cg',
				value: discountMontenegro,
			},
			{
				country: 'ba',
				value: discountBosnia,
			},
		];

		try {
			const subscriptionPackage = await prisma.subscriptionPackage.create({
				data: {
					name: name,
					price: jsonPrices,
					discount: jsonDiscounts,
				},
			});

			res.status(201).json({
				message: 'Subscription Package created',
				subscriptionPackage,
			});
		} catch (error) {
			res.status(400).json({ error: error.message });
		}
	}
}
