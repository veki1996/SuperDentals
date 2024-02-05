import { isSameHash, hashPass } from '/utils';
import { prisma } from '/utils/db';

export default async function handler(req, res) {
	if (req.method === 'POST') {
		try {
			const { name, surname, phone, oldPassword, password, userId, userPass, changePassword } = req.body;

			if (changePassword) {
				const isSamePassword = await isSameHash(oldPassword, userPass);

				if (isSamePassword) {
					const hashedPassword = await hashPass(password);
					const editedUser = await prisma.user.update({
						where: {
							id: userId,
						},
						data: {
							password: hashedPassword,
						},
					});

					res.status(200).json({
						message: 'User edited',
						editedUser,
					});
				} else {
					res.status(400).json({
						message: 'Incorrect old password',
					});
				}
			} else {
				const editedUser = await prisma.user.update({
					where: {
						id: userId,
					},
					data: {
						name: name,
						surname: surname,
						phoneNumber: phone,
					},
				});

				res.status(200).json({
					message: 'User edited',
					editedUser,
				});
			}
		} catch (err) {
			res.status(400).json({ err: err.message });
		} finally {
			async () => {
				await prisma.$disconnect();
			};
		}
	}
}
