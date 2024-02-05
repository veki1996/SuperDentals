import { prisma } from '/utils/db';

export default async function handler(req, res) {
	if (req.method === 'POST') {
		const { ContactEmail, ContactMessenger, ContactPhoneSerbia, ContactPhoneBosnia, ContactPhoneMontenegro } = req.body;

		try {
			if (ContactPhoneBosnia !== false) {
				await prisma.setting.updateMany({
					where: {
						name: 'Contact Phone Bosnia',
					},
					data: {
						defaultValue: ContactPhoneBosnia,
					},
				});
			}

			if (ContactPhoneSerbia !== false) {
				await prisma.setting.updateMany({
					where: {
						name: 'Contact Phone Serbia',
					},
					data: {
						defaultValue: ContactPhoneSerbia,
					},
				});
			}

			if (ContactPhoneMontenegro !== false) {
				await prisma.setting.updateMany({
					where: {
						name: 'Contact Phone Montenegro',
					},
					data: {
						defaultValue: ContactPhoneMontenegro,
					},
				});
			}

			if (ContactMessenger !== false) {
				await prisma.setting.updateMany({
					where: {
						name: 'Contact Messenger',
					},
					data: {
						defaultValue: ContactMessenger,
					},
				});
			}

			if (ContactEmail !== false) {
				await prisma.setting.updateMany({
					where: {
						name: 'Contact Email',
					},
					data: {
						defaultValue: ContactEmail,
					},
				});
			}

			res.status(200).json({ message: 'Settings updated' });
		} catch (error) {
			res.status(400).json({ message: error });
		}
	}
}
