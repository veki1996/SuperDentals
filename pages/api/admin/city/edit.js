import { prisma } from '/utils/db';

export default async function handler(req, res) {
	if (req.method === 'POST') {
		try {
			const { name, cityId, zipCode, country, mapCoords } = req.body;

			const city = await prisma.location.update({
				where: {
					id: cityId,
				},
				data: {
					cityName: name,
					zipCode: zipCode,
					mapCoordinates: mapCoords,
					country: country,
				},
			});

			res.status(200).json({
				message: 'City edited',
				city,
			});
		} catch (err) {
			res.status(400).json({ err: err.message });
		}
	}
}
