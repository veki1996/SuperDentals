const fs = require('fs');

export default async function handler(req, res) {
	if (req.method === 'POST') {
		try {
			const { body } = req;
			const { images } = body;

			let error = 'Errors :';

			images.map((image) => {
				fs.unlink(`./public/uploads/${image}`, function (err) {
					if (err && err.code == 'ENOENT') {
						// file doens't exist
						error += `${image} doesn't exist`;
					} else if (err) {
						// other errors, e.g. maybe we don't have enough permission
						error += `...Error occured whilte trying to remove file ${image}`;
					}
				});
			});

			res.status(200).json({
				message: `Images are deleted`,
				errors: error,
			});
		} catch (err) {
			res.status(400).json({ err: err.message, code: err.code });
		}
	}
}
