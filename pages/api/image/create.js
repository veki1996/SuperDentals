import formidable from 'formidable';
import path from 'path';
import fs from 'fs/promises';
const sharp = require('sharp');

//get file extension from mime type
const getExtension = (mimeType) => {
	switch (mimeType) {
		case 'image/jpeg':
			return '.jpg';
		case 'image/jpg':
			return '.jpg';
		case 'image/png':
			return '.png';
	}
};

const formatBytes = (a, b = 2) => {
	if (!+a) return '0 Bytes';
	const c = 0 > b ? 0 : b,
		d = Math.floor(Math.log(a) / Math.log(1024));
	return `${parseFloat((a / Math.pow(1024, d)).toFixed(c))} ${
		['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'][d]
	}`;
};

const displaySize = async (path) => {
	const stats = await fs.stat(path);
	const fileSizeInBytes = stats.size;
	return formatBytes(fileSizeInBytes, 3);
};

const getMetadata = async (name) => {
	try {
		const metadata = await sharp(`./public/uploads/${name}`).metadata();
		let sizekb = await displaySize(`./public/uploads/${name}`);
		return { ...metadata, size: sizekb };
	} catch (error) {
		throw new Error(error);
	}
};

const compressAndResize = async (file, width, height) => {
	//convert file to buffer then resize and compress and save file
	const buffer = await fs.readFile(file.filepath);

	const resizeBasedOnType = async (type, imageBuffer) => {
		switch (type) {
			case 'image/jpeg':
				return await sharp(imageBuffer).resize(Number(width), Number(height)).jpeg({ quality: 80 }).toBuffer();
			case 'image/jpg':
				return await sharp(imageBuffer).resize(Number(width), Number(height)).jpeg({ quality: 80 }).toBuffer();
			case 'image/png':
				return await sharp(imageBuffer).resize(Number(width), Number(height)).png({ quality: 80 }).toBuffer();
		}
	};

	const resized = await resizeBasedOnType(file.mimetype, buffer);

	//convert buffer to file and return file
	const bufferToFile = await sharp(resized).toFile(file.filepath);
	return bufferToFile;
};

const handleFileUpload = async (req, saveLocal, width, height) => {
	const options = {};

	let uniqueHash = Array.from(Array(12), () => Math.floor(Math.random() * 36).toString(36)).join('');

	let filename = `image-${uniqueHash}`;
	if (saveLocal) {
		options.uploadDir = path.join(process.cwd(), '/public/uploads');

		options.filename = (name, ext, path) => {
			filename += getExtension(path.mimetype);

			return filename;
		};
	}

	//resize and compress image with sharp js before saving
	const form = formidable(options);
	return new Promise((resolve, reject) => {
		form.parse(req, (err, fields, files) => {
			if (err) reject(err);
			files.file = compressAndResize(files.file, width, height);

			return resolve({ fields, files, filename });
		});
	});
};

const handler = async (req, res) => {
	// Get width and height for resize from query params
	const { width, height } = req.query;
	try {
		await fs.readdir(path.join(process.cwd() + '/public', '/uploads'));
	} catch (error) {
		await fs.mkdir(path.join(process.cwd() + '/public', '/uploads'));
	}
	//handle file
	let filename = await handleFileUpload(req, true, width, height);
	let metadata = await getMetadata(filename.filename);
	metadata.type = filename.filename.split('.')[1];

	res.json({
		message: 'Image uploaded',
		metadata: {
			...metadata,

			name: filename.filename,
		},
	});
};

export const config = {
	api: {
		bodyParser: false,
	},
};

export default handler;
