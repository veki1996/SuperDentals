import { prisma } from '/utils/db';

export default async function handler(req, res) {
	if (req.method === 'POST') {
		const { name, country, zipCode, mapCoords } = req.body;

		try {
			const city = await prisma.location.create({
				data: {
					cityName: name,
					zipCode: zipCode,
					mapCoordinates: mapCoords,
					country: country,
				},
			});

			res.status(201).json({
				message: 'City created',
				city,
			});
		} catch (error) {
			res.status(400).json({ error: error.message });
		}
	}
}
