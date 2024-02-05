export default async function handler(req, res) {
	const { ip } = req?.query;

	try {
		const response = await fetch(`https://trktru.com/geoip/?ip=${ip}`);
		if (response.ok) {
			const { country } = await response.json();
			res.status(200).json({ country: country });
		} else {
			throw new Error('Error');
		}
	} catch (error) {
		res.status(400).json({ error });
	}
}
