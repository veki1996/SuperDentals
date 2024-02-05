import { hashPass } from '/utils';
import { prisma } from '/utils/db';

export default async function handler(req, res) {
	if (req.method === 'POST') {
		try {
			const { body } = req;
			const { name, surname, phone, email, password, country } = JSON.parse(JSON.stringify(body));
			const hashedPassword = await hashPass(password);
			const uniqueHash = Array.from(Array(12), () => Math.floor(Math.random() * 36).toString(36)).join('');

			const user = {
				name: name,
				surname: surname,
				phoneNumber: phone,
				email: email,
				password: hashedPassword,
				referalCode: `PROMO-${Math.floor(1000 + Math.random() * 9000)}-${
					name.charAt(0).toUpperCase() + name.charAt(name.length - 1).toUpperCase()
				}`,
				hash: uniqueHash,
				country: country,
			};

			await prisma.user.create({
				data: user,
			});

			res.status(200).json({
				message: 'Messag sent to user ' + name,
				name: name,
				email: email,
				password: password,
				hash: uniqueHash,
			});
		} catch (err) {
			res.status(400).json({ err: err.message });
		}
	}
}
