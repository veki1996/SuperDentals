import { prisma } from '/utils/db';

export default async function handler(req, res) {
	if (req.method === 'POST') {
		try {
			const {
				name,
				priceSerbia,
				priceMontenegro,
				priceBosnia,
				discountSerbia,
				discountMontenegro,
				discountBosnia,
				subscriptionPackageId,
			} = req.body;

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

			const subscriptionPackage = await prisma.subscriptionPackage.update({
				where: {
					id: subscriptionPackageId,
				},
				data: {
					name: name,
					price: jsonPrices,
					discount: jsonDiscounts,
				},
			});

			res.status(200).json({
				message: 'subscriptionPackage edited',
				subscriptionPackage,
			});
		} catch (err) {
			res.status(400).json({ err: err.message });
		}
	}
}
