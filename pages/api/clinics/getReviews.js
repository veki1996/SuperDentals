export default async function handler(req, res) {
	if (req.method === 'POST') {
		const { placeId } = req.body;
		try {
			const response = await fetch(
				`https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`,
				{
					method: 'GET',
				},
			);

			const data = await response.json();

			if (data.status === 'OK') {
				res.status(200).json({
					result: data.result,
				});
			}
		} catch (error) {
			res.status(400).json({
				message: error.message,
				status: error.code,
			});
		}
	}
}
