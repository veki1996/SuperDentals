import { prisma } from '/utils/db';

export default async function handler(req, res) {
	if (req.method === 'POST') {
		const { answers, questions } = req.body;

		// Construct question json
		const questionJson = [
			{
				country: 'rs',
				question: questions.rs.replace('<p><br></p>', ''),
			},
			{
				country: 'ba',
				question: questions.ba.replace('<p><br></p>', ''),
			},
			{
				country: 'hr',
				question: questions.hr.replace('<p><br></p>', ''),
			},
			{
				country: 'me',
				question: questions.me.replace('<p><br></p>', ''),
			},
			{
				country: 'si',
				question: questions.si.replace('<p><br></p>', ''),
			},
			{
				country: 'gb',
				question: questions.gb.replace('<p><br></p>', ''),
			},
			{
				country: 'de',
				question: questions.de.replace('<p><br></p>', ''),
			},
			{
				country: 'it',
				question: questions.it.replace('<p><br></p>', ''),
			},
		];

		// Construct answer json
		const answerJson = [
			{
				country: 'rs',
				answer: answers.rs.replace('<p><br></p>', ''),
			},
			{
				country: 'ba',
				answer: answers.ba.replace('<p><br></p>', ''),
			},
			{
				country: 'hr',
				answer: answers.hr.replace('<p><br></p>', ''),
			},
			{
				country: 'me',
				answer: answers.me.replace('<p><br></p>', ''),
			},
			{
				country: 'si',
				answer: answers.si.replace('<p><br></p>', ''),
			},
			{
				country: 'gb',
				answer: answers.gb.replace('<p><br></p>', ''),
			},
			{
				country: 'de',
				answer: answers.de.replace('<p><br></p>', ''),
			},
			{
				country: 'it',
				answer: answers.it.replace('<p><br></p>', ''),
			},
		];

		try {
			const faq = await prisma.faq.create({
				data: {
					question: questionJson,
					answer: answerJson,
				},
			});

			res.status(201).json({ message: 'FAQ created', faq });
		} catch (error) {
			res.status(400).json({
				message: error.message,
				status: error.code,
			});
		}
	}
}
