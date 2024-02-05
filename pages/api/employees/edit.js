import { prisma } from '/utils/db';

export default async function handler(req, res) {
	if (req.method === 'POST') {
		const { name, surname, title, type, employeeId, imageId } = req.body;
		try {
			const employee = await prisma.employee.update({
				where: {
					id: employeeId,
				},
				data: {
					name: name,
					surname: surname,
					title: title,
					type: type,
					imageId: imageId,
				},
			});
			res.status(200).json({ message: 'Employee updated', employee });
		} catch (error) {
			res.status(400).json({ message: error });
		}
	}
}
