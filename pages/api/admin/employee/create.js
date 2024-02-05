import { prisma } from '/utils/db';

export default async function handler(req, res) {
	if (req.method === 'POST') {
		const { name, surname, title, type, clinicId, imageId } = req.body;
		try {
			const employee = await prisma.employee.create({
				data: {
					name: name,
					surname: surname,
					title: title,
					type: type,
					imageId: imageId,
					clinicId: clinicId,
				},
			});
			res.status(201).json({ message: 'Employee created', employee });
		} catch (error) {
			res.status(400).json({ message: error });
		}
	}
}
