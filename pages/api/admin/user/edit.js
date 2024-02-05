import { hashPass } from '/utils';
import { prisma } from '/utils/db';

export default async function handler(req, res) {
	if (req.method === 'POST') {
		try {
			const { name, surname, phone, password, userId, active, referalCode, verified, userOnboarding, email } = req.body;

			let newPassword;
			if (!password.startsWith('$2a$')) {
				newPassword = await hashPass(password);
			}

			const user = await prisma.user.update({
				where: {
					id: userId,
				},
				data: {
					name: name,
					surname: surname,
					phoneNumber: phone,
					email: email,
					password: newPassword === undefined ? password : newPassword,
					referalCode: referalCode,
					active: active,
					verified: verified,
					onboardingComplete: userOnboarding,
				},
			});

			res.status(200).json({
				message: 'User edited',
				user,
			});
		} catch (err) {
			res.status(400).json({ err: err.message });
		}
	}
}
