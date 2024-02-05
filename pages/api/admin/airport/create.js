import { prisma } from '/utils/db';

export default async function handler(req, res) {
	if (req.method === 'POST') {
		const { name, location, code, mapCoords } = req.body;

		try {
			const airport = await prisma.airport.create({
				data: {
					name: name,
					code: code,
					mapCoordinates: mapCoords,
					locationId: location,
				},
			});

			res.status(201).json({
				message: 'Airport created',
				airport,
			});
		} catch (error) {
			res.status(400).json({ error: error.message });
		}
	}
}
