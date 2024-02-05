import { prisma } from '/utils/db';

export default async function handler(req, res) {
	if (req.method === 'POST') {
		const { descriptions, headings, positions, id } = req.body;

		// Construct heading json
		const headingJson = [
			{
				country: 'rs',
				heading: headings.rs.replace('<p><br></p>', ''),
			},
			{
				country: 'ba',
				heading: headings.ba.replace('<p><br></p>', ''),
			},
			{
				country: 'hr',
				heading: headings.hr.replace('<p><br></p>', ''),
			},
			{
				country: 'me',
				heading: headings.me.replace('<p><br></p>', ''),
			},
			{
				country: 'si',
				heading: headings.si.replace('<p><br></p>', ''),
			},
			{
				country: 'gb',
				heading: headings.gb.replace('<p><br></p>', ''),
			},
			{
				country: 'de',
				heading: headings.de.replace('<p><br></p>', ''),
			},
			{
				country: 'it',
				heading: headings.it.replace('<p><br></p>', ''),
			},
		];

		// Construct description json
		const descriptionJson = [
			{
				country: 'rs',
				description: descriptions.rs.replace('<p><br></p>', ''),
			},
			{
				country: 'ba',
				description: descriptions.ba.replace('<p><br></p>', ''),
			},
			{
				country: 'hr',
				description: descriptions.hr.replace('<p><br></p>', ''),
			},
			{
				country: 'me',
				description: descriptions.me.replace('<p><br></p>', ''),
			},
			{
				country: 'si',
				description: descriptions.si.replace('<p><br></p>', ''),
			},
			{
				country: 'gb',
				description: descriptions.gb.replace('<p><br></p>', ''),
			},
			{
				country: 'de',
				description: descriptions.de.replace('<p><br></p>', ''),
			},
			{
				country: 'it',
				description: descriptions.it.replace('<p><br></p>', ''),
			},
		];

		// Construct description json
		const positionJson = [
			{
				country: 'rs',
				position: positions.rs.replace('<p><br></p>', ''),
			},
			{
				country: 'ba',
				position: positions.ba.replace('<p><br></p>', ''),
			},
			{
				country: 'hr',
				position: positions.hr.replace('<p><br></p>', ''),
			},
			{
				country: 'me',
				position: positions.me.replace('<p><br></p>', ''),
			},
			{
				country: 'si',
				position: positions.si.replace('<p><br></p>', ''),
			},
			{
				country: 'gb',
				position: positions.gb.replace('<p><br></p>', ''),
			},
			{
				country: 'de',
				position: positions.de.replace('<p><br></p>', ''),
			},
			{
				country: 'it',
				position: positions.it.replace('<p><br></p>', ''),
			},
		];

		try {
			const lexicon = await prisma.lexicon.update({
				where: {
					id: id,
				},
				data: {
					heading: headingJson,
					description: descriptionJson,
					position: positionJson,
				},
			});

			res.status(200).json({ message: 'Lexicon row updated', lexicon });
		} catch (error) {
			res.status(400).json({
				message: error.message,
				status: error.code,
			});
		}
	}
}
