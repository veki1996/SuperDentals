import { prisma } from '/utils/db';
export default async function handler(req, res) {
	if (req.method === 'DELETE') {
		const { id } = req.body;
		try {
			const user = await prisma.user.delete({
				where: {
					id: id,
				},
			});
			res.status(200).json({ message: 'User deleted', user });
		} catch (error) {
			res.status(400).json({ message: error });
		}
	}
}
