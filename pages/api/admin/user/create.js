import { hashPass } from '/utils';
import { prisma } from '/utils/db';

export default async function handler(req, res) {
	if (req.method === 'POST') {
		const { name, surname, phone, email, password, referalCode } = req.body;

		try {
			const hashedPassword = await hashPass(password);
			const uniqueHash = Array.from(Array(12), () => Math.floor(Math.random() * 36).toString(36)).join('');

			const user = await prisma.user.create({
				data: {
					name: name,
					surname: surname,
					phoneNumber: phone,
					email: email,
					password: hashedPassword,
					referalCode: referalCode,
					hash: uniqueHash,
				},
			});

			res.status(201).json({
				message: 'User created',
				user,
			});
		} catch (error) {
			if ((error.code = 'P2002')) {
				res.status(400).json({ message: `User with ${email} email already exists!` });
			}
			res.status(400).json({ error: error.message });
		}
	}
}
