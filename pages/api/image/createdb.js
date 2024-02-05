import { prisma } from '/utils/db';

export default async function handler(req, res) {
	if (req.method === 'POST') {
		try {
			const { body } = req;
			const { imageType, name, type, size, width, height, clinicId } = body;

			const data = {
				name: name,
				size: size,
				dimensions: `${width}x${height}`,
				type: type,
				clinicId: clinicId,
				imageUsage: imageType,
			};
			const dataw = await prisma.image.create({
				data: data,
			});

			res.status(200).json({
				message: `Image ${name} ....  added to db`,
				id: dataw.id,
			});
		} catch (err) {
			if (e instanceof Prisma.PrismaClientKnownRequestError) {
				if (e.code === 'P2002') {
					res.status(400).json({ message: 'User already have image', code: err.code });
				}
			}
		}
	}
}
