import { prisma } from '/utils/db';

export default async function handler(req, res) {
	if (req.method === 'POST') {
		const { mapCoords, clinicId, rating } = req.body;

		try {
			const clinic = await prisma.clinic.update({
				where: {
					id: clinicId,
				},
				data: {
					mapCoordinates: mapCoords,
					rating: String(rating),
				},
				include: {
					user: true,
				},
			});
			res.status(200).json({ message: 'Clinic updated', clinic });
		} catch (error) {
			res.status(400).json({
				message: error.message,
				status: error.code,
			});
		}
	}
}
