import { isSameHash } from '/utils';
import { prisma } from '/utils/db';

export default async function handler(req, res) {
	if (req.method === 'POST') {
		const { body } = req;
		const { email, password } = JSON.parse(JSON.stringify(body));
		try {
			const user = await prisma.user.findUnique({
				where: {
					email: email,
				},
				include: {
					clinics: true,
					subscriber: {
						include: {
							package: true,
						},
					},
				},
			});

			const isSame = await isSameHash(password, user.password);

			if (user && isSame) {
				const clinicsIds = user?.clinics?.map((clinic) => clinic?.id);
				res.status(200).json({
					id: user.id,
					name: user.name,
					surname: user.surname,
					phoneNumber: user.phoneNumber,
					email: user.email,
					verified: user.verified,
					referalCode: user.referalCode,
					active: user.active,
					subscriber: user.subscriber,
					role: user.role,
					hash: user.hash,
					clinicId: clinicsIds.length > 0 ? clinicsIds[0] : '',
					...(user?.subscriber
						? {
								subscriptionPackage: user?.subscriber?.package?.name,
						  }
						: {}),
				});
			} else {
				res.status(400).json({
					message: 'Something went wrong',
				});
			}
		} catch (err) {
			res.status(400).json({ err: err.message });
		}
	}
}
