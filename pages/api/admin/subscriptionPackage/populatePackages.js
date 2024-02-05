import { prisma } from '/utils/db';

export default async function handler(req, res) {
	if (req.method === 'GET') {
		try {
			const packages = await prisma.subscriptionPackage.findMany();

			const populatePackages = async (packages, packageName, accessor, jsonPrices, jsonDiscounts) => {
				if (!packages.find((subPackage) => subPackage?.accessor === packageName)) {
					await prisma.subscriptionPackage.create({
						data: {
							name: packageName,
							accessor: accessor,
							price: jsonPrices,
							discount: jsonDiscounts,
						},
					});
				}
			};

			const jsonPricesStarter = [
				{
					country: 'rs',
					price: '99',
					currency: 'EUR',
				},
				{
					country: 'cg',
					price: '99',
					currency: 'EUR',
				},
				{
					country: 'ba',
					price: '99',
					currency: 'BAM',
				},
			];

			const jsonPricesStandard = [
				{
					country: 'rs',
					price: '99',
					currency: 'EUR',
				},
				{
					country: 'cg',
					price: '99',
					currency: 'EUR',
				},
				{
					country: 'ba',
					price: '99',
					currency: 'BAM',
				},
			];

			const jsonPricesPremium = [
				{
					country: 'rs',
					price: '99',
					currency: 'EUR',
				},
				{
					country: 'cg',
					price: '99',
					currency: 'EUR',
				},
				{
					country: 'ba',
					price: '99',
					currency: 'BAM',
				},
			];

			const jsonPricesPremiumPlus = [
				{
					country: 'rs',
					price: '0',
					currency: 'EUR',
				},
				{
					country: 'cg',
					price: '0',
					currency: 'EUR',
				},
				{
					country: 'ba',
					price: '0',
					currency: 'BAM',
				},
			];

			const jsonDiscountsStarter = [
				{
					country: 'rs',
					value: '0',
				},
				{
					country: 'cg',
					value: '0',
				},
				{
					country: 'ba',
					value: '0',
				},
			];

			const jsonDiscountsStandard = [
				{
					country: 'rs',
					value: '0',
				},
				{
					country: 'cg',
					value: '0',
				},
				{
					country: 'ba',
					value: '0',
				},
			];

			const jsonDiscountsPremium = [
				{
					country: 'rs',
					value: '0',
				},
				{
					country: 'cg',
					value: '0',
				},
				{
					country: 'ba',
					value: '0',
				},
			];

			const jsonDiscountsPremiumPlus = [
				{
					country: 'rs',
					value: '0',
				},
				{
					country: 'cg',
					value: '0',
				},
				{
					country: 'ba',
					value: '0',
				},
			];

			// Packages
			await populatePackages(packages, 'START', 'START', jsonPricesStarter, jsonDiscountsStarter);
			await populatePackages(packages, 'STANDARD', 'STANDARD', jsonPricesStandard, jsonDiscountsStandard);
			await populatePackages(packages, 'PREMIUM', 'PREMIUM', jsonPricesPremium, jsonDiscountsPremium);
			await populatePackages(packages, 'PREMIUM+', 'PREMIUM+', jsonPricesPremiumPlus, jsonDiscountsPremiumPlus);

			res.status(200).json({ message: 'Packages added' });
		} catch (error) {
			res.status(400).json({ message: error });
		}
	}
}
