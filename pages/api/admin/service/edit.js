import { prisma } from '/utils/db';

export default async function handler(req, res) {
	if (req.method === 'POST') {
		try {
			const {
				nameBosnia,
				nameMontenegro,
				nameCroatia,
				nameSerbia,
				nameSlovenia,
				nameEnglish,
				nameGermany,
				nameItalia,
				descriptionBosnia,
				descriptionSerbia,
				descriptionCroatia,
				descriptionSlovenia,
				descriptionMontenegro,
				descriptionEnglish,
				descriptionGermany,
				descriptionItalia,
				serviceId,
				imageId,
				simplifiedName,
				order,
			} = req.body;

			const jsonNames = [
				{
					country: 'ba',
					name: nameBosnia.trim(),
				},
				{
					country: 'me',
					name: nameMontenegro.trim(),
				},
				{
					country: 'rs',
					name: nameSerbia.trim(),
				},
				{
					country: 'hr',
					name: nameCroatia.trim(),
				},
				{
					country: 'si',
					name: nameSlovenia.trim(),
				},
				{
					country: 'gb',
					name: nameEnglish.trim(),
				},
				{
					country: 'de',
					name: nameGermany.trim(),
				},
				{
					country: 'it',
					name: nameItalia.trim(),
				},
			];

			const jsonDescription = [
				{
					country: 'ba',
					description: descriptionBosnia,
				},
				{
					country: 'me',
					description: descriptionMontenegro,
				},
				{
					country: 'rs',
					description: descriptionSerbia,
				},
				{
					country: 'hr',
					description: descriptionCroatia,
				},
				{
					country: 'si',
					description: descriptionSlovenia,
				},
				{
					country: 'gb',
					description: descriptionEnglish,
				},
				{
					country: 'de',
					description: descriptionGermany,
				},
				{
					country: 'it',
					description: descriptionItalia,
				},
			];

			const service = await prisma.service.update({
				where: {
					id: serviceId,
				},
				data: {
					name: jsonNames,
					simplifiedName: simplifiedName,
					order: Number(order),
					description: jsonDescription,
					serviceCategoryId: null,
					imageId: imageId,
				},
			});

			res.status(200).json({
				message: 'Service edited',
				service,
			});
		} catch (err) {
			res.status(400).json({ error: err });
		}
	}
}
