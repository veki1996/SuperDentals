import { prisma } from '/utils/db';

export default async function handler(req, res) {
	if (req.method === 'POST') {
		const { adminEmail, id } = req.body;
		try {
			const setting = await prisma.setting.update({
				where: {
					id: id,
				},
				data: {
					defaultValue: adminEmail,
				},
			});
			res.status(200).json({ message: 'Setting updated', setting });
		} catch (error) {
			res.status(400).json({ message: error });
		}
	}
}
