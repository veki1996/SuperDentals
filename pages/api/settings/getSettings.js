import { prisma } from '/utils/db';

export default async function handler(req, res) {
	if (req.method === 'GET') {
		try {
			const socialSettings = await prisma.setting.findMany({
				where: {
					name: {
						startsWith: 'Social',
					},
				},
			});

			res.status(200).json({
				socials: socialSettings,
			});
		} catch (error) {
			res.status(400).json({
				message: error.message,
				status: error.code,
			});
		}
	}
}
