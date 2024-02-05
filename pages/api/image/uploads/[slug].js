import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
	const { slug } = req.query;
	const filePath = path.resolve('public', `uploads/${slug}`);
	const imageBuffer = fs.readFileSync(filePath);
	res.setHeader('Content-Type', 'image/jpg');
	return res.send(imageBuffer);
}
