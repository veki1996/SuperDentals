import { prisma } from '/utils/db';

export default async function handler(req, res) {
	if (req.method === 'POST') {
		const { tiktok, twitter, instagram, facebook, linkedin, youtube } = req.body;

		try {
			if (facebook !== false) {
				await prisma.setting.updateMany({
					where: {
						name: 'Social Facebook',
					},
					data: {
						defaultValue: facebook,
					},
				});
			}

			if (instagram !== false) {
				await prisma.setting.updateMany({
					where: {
						name: 'Social Instagram',
					},
					data: {
						defaultValue: instagram,
					},
				});
			}

			if (linkedin !== false) {
				await prisma.setting.updateMany({
					where: {
						name: 'Social Linkedin',
					},
					data: {
						defaultValue: linkedin,
					},
				});
			}

			if (twitter !== false) {
				await prisma.setting.updateMany({
					where: {
						name: 'Social Twitter',
					},
					data: {
						defaultValue: twitter,
					},
				});
			}

			if (tiktok !== false) {
				await prisma.setting.updateMany({
					where: {
						name: 'Social Tiktok',
					},
					data: {
						defaultValue: tiktok,
					},
				});
			}

			if (youtube !== false) {
				await prisma.setting.updateMany({
					where: {
						name: 'Social Youtube',
					},
					data: {
						defaultValue: youtube,
					},
				});
			}

			res.status(200).json({ message: 'Settings updated' });
		} catch (error) {
			res.status(400).json({ message: error });
		}
	}
}
