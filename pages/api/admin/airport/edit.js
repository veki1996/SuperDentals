import { prisma } from '/utils/db';

export default async function handler(req, res) {
	if (req.method === 'POST') {
		try {
			const { name, airportId, code, mapCoords, location } = req.body;

			const airport = await prisma.airport.update({
				where: {
					id: airportId,
				},
				data: {
					name: name,
					code: code,
					mapCoordinates: mapCoords,
					locationId: location,
				},
			});

			res.status(200).json({
				message: 'Airport edited',
				airport,
			});
		} catch (err) {
			res.status(400).json({ err: err.message });
		}
	}
}
