import { prisma } from '/utils/db';

const fs = require('fs');

export default async function handler(req, res) {
	if (req.method === 'POST') {
		try {
			const { body } = req;
			const { name, id } = body;

			if (id !== null) {
				fs.unlink(`./public/uploads/${name}`, function (err) {
					if (err && err.code == 'ENOENT') {
						// file doens't exist
						res.status(400).json({
							message: "File doesn't exist, won't remove it.",
						});
					} else if (err) {
						// other errors, e.g. maybe we don't have enough permission
						res.status(400).json({
							message: 'Error occurred while trying to remove file',
						});
					} else {
						res.status(200).json({ message: 'removed' });
					}
				});

				await prisma.image.delete({
					where: {
						id: id,
					},
				});
				res.status(200).json({
					message: `Image ${id} deleted `,
				});
			}

			res.status(200).json({
				message: `There is no such image to delete `,
			});
		} catch (err) {
			res.status(400).json({ err: err.message, code: err.code });
		}
	}
}
