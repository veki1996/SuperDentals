import { prisma } from '/utils/db';

export default async function handler(req, res) {
	if (req.method === 'POST') {
		const { namesData, descriptionsData, imageId, simplifiedName, order } = req.body;

		const jsonNames = [
			{
				country: 'ba',
				name: namesData.nameBosnia.trim(),
			},
			{
				country: 'me',
				name: namesData.nameMontenegro.trim(),
			},
			{
				country: 'rs',
				name: namesData.nameSerbia.trim(),
			},
			{
				country: 'hr',
				name: namesData.nameCroatia.trim(),
			},
			{
				country: 'si',
				name: namesData.nameSlovenia.trim(),
			},
			{
				country: 'gb',
				name: namesData.nameEnglish.trim(),
			},
			{
				country: 'de',
				name: namesData.nameGermany.trim(),
			},
			{
				country: 'it',
				name: namesData.nameItalia.trim(),
			},
		];

		const jsonDescription = [
			{
				country: 'ba',
				description: descriptionsData.descriptionBosnia,
			},
			{
				country: 'me',
				description: descriptionsData.descriptionMontenegro,
			},
			{
				country: 'rs',
				description: descriptionsData.descriptionSerbia,
			},
			{
				country: 'hr',
				description: descriptionsData.descriptionCroatia,
			},
			{
				country: 'si',
				description: descriptionsData.descriptionSlovenia,
			},
			{
				country: 'gb',
				description: descriptionsData.descriptionEnglish,
			},
			{
				country: 'de',
				description: descriptionsData.descriptionGermany,
			},
			{
				country: 'it',
				description: descriptionsData.descriptionItalia,
			},
		];

		try {
			const service = await prisma.service.create({
				data: {
					name: jsonNames,
					simplifiedName: simplifiedName,
					order: Number(order),
					description: jsonDescription,
					serviceCategoryId: null,
					imageId: imageId,
				},
			});

			res.status(201).json({
				message: 'Service created',
				service,
			});
		} catch (error) {
			res.status(400).json({ error: error });
		}
	}
}
