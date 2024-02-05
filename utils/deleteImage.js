const fs = require('fs');

export const deleteImageFromServer = async (imageName) => {
	fs.unlink(`./public/uploads/${imageName}`, function (err) {
		if (err && err.code == 'ENOENT') {
			res.status(400).json({
				message: "File doesn't exist, won't remove it.",
			});
		} else if (err) {
			res.status(400).json({
				message: 'Error occurred while trying to remove file',
			});
		} else {
			res.status(200).json({ message: 'Removed' });
		}
	});
};
