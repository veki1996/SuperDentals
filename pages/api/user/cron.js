import { prisma } from '/utils/db';

/**
 * This is an async function that retrieves a list of users with their subscribers and updates the
 * user's active status and subscriber's approval status if their subscription has expired.
 * @param req - The `req` parameter is an object that represents the HTTP request that the server
 * receives. It contains information about the request, such as the HTTP method, headers, and query
 * parameters.
 * @param res - The `res` parameter is the response object that is used to send a response back to the
 * client making the request. It contains methods such as `status` to set the HTTP status code of the
 * response, and `json` to send a JSON response body.
 */
export default async function handler(req, res) {
	if (req.method === 'GET') {
		try {
			const users = await prisma.user.findMany({
				include: {
					subscriber: true,
				},
			});
			users.map(async (user) => {
				const subscriber = user?.subscriber;
				if (subscriber && subscriber?.validToDate) {
					// Date when subscription expires
					let validDate = new Date(subscriber?.validToDate);

					// To calculate the time difference of two dates
					let differenceInTime = validDate.getTime() - new Date().getTime();

					// To calculate the no. of days between two dates
					let differenceInDays = Math.round(differenceInTime / (1000 * 3600 * 24));

					if (differenceInDays < 0) {
						await prisma.user.update({
							where: {
								id: user?.id,
							},
							data: {
								active: false,
								subscriber: {
									update: {
										approved: false,
									},
								},
							},
						});
					}
				}
			});
			res.status(200).json();
		} catch (error) {
			res.status(400).json({ message: error });
		}
	}
}
