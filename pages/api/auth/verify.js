import { prisma } from '/utils/db';

export default async function handler(req, res) {
	if (req.method === 'POST') {
		const { body } = req;
		const { email, hash } = JSON.parse(JSON.stringify(body));
		try {
			//verify user with email address and hash
			const query = await prisma.user.updateMany({
				where: {
					email: email,
					hash: hash,
				},
				data: {
					verified: true,
				},
			});

			//Check if update statement affected any row
			if (query.count === 1) {
				res.status(200).json({
					message: 'User ' + email + ' email address was verified.',
					email: email,
					hash: hash,
				});
			} else {
				res.status(400).json({
					message: 'Email verification failed!',
					email: email,
					hash: hash,
				});
			}
		} catch (err) {
			res.status(400).json({ err: err.message });
		}
	}
}
