import { prisma } from '/utils/db';
import { hashPass } from '/utils';

export default async function handler(req, res) {
	if (req.method === 'POST') {
		try {
			const { email, hash, password } = req.body;

			const passId = await prisma.forgotPasswordRequests.findFirst({
				where: {
					email: email,
					hash: hash,
				},
			});

			const query = await prisma.forgotPasswordRequests.update({
				where: {
					id: passId.id,
				},
				data: {
					verified: true,
				},
			});

			if (query) {
				const hashedPassword = await hashPass(password);
				await prisma.user.update({
					where: {
						email: email,
					},
					data: {
						password: hashedPassword,
					},
				});

				res.status(200).json({
					message: 'Password changed',
				});
			} else {
				res.status(200).json({
					message: 'Link is expired',
				});
			}
		} catch (err) {
			res.status(400).json({ err: err.message });
		}
	}
}
