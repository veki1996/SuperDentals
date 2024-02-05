import { sendEmail } from '/utils/mail';
import { prisma } from '/utils/db';

/**
 * This function sends subscription reminder emails to subscribers and the admin based on the number of
 * days left until their subscription expires.
 * @param req - The request object, which contains information about the incoming HTTP request.
 * @param res - The "res" parameter is the response object that is used to send a response back to the
 * client making the request. It contains methods such as "status" to set the HTTP status code of the
 * response, and "json" to send a JSON response body.
 */
export default async function handler(req, res) {
	if (req.method === 'GET') {
		try {
			const subscribers = await prisma.subscriber.findMany({
				include: {
					user: true,
				},
			});

			const adminEmail = await prisma.setting.findFirst({
				where: {
					name: 'Admin Email',
				},
			});

			subscribers.map(async (subscriber) => {
				// Date when subscription expires
				let validDate = new Date(subscriber.validToDate);

				// To calculate the time difference of two dates
				let differenceInTime = validDate.getTime() - new Date().getTime();

				// To calculate the no. of days between two dates
				let differenceInDays = Math.round(differenceInTime / (1000 * 3600 * 24));

				let mail = {
					from: 'info@superdentals.com',
					to: `${subscriber.user.email}`,
					subject: 'Subscription Reminder',
					html: `
				<table cellspacing="0" border="0" cellpadding="0" width="100%" bgcolor="#0D3082"
				style="@import url(https://fonts.googleapis.com/css?family=Rubik:300,400,500,700|Open+Sans:300,400,600,700); font-family: 'Open Sans', sans-serif;">
				<tr>
					<td>
						<table style="background-color: #f2f3f8; max-width:670px;  margin:0 auto;" width="100%" border="0"
							align="center" cellpadding="0" cellspacing="0">
							<tr>
								<td style="height:80px;">&nbsp;</td>
							</tr>
							<tr>
								<td style="text-align:center;">
									<img src='${process.env.BASE_URL}/images/logo.png' style="height:80px;width: 250px; alt="logo"/>								</td>
							</tr>
							<tr>
								<td style="height:20px;">&nbsp;</td>
							</tr>
							<tr>
								<td>
									<table width="95%" border="0" align="center" cellpadding="0" cellspacing="0"
										style="max-width:670px;background:#fff; border-radius:3px; text-align:center;-webkit-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);-moz-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);box-shadow:0 6px 18px 0 rgba(0,0,0,.06);">
										<tr>
											<td style="height:40px;">&nbsp;</td>
										</tr>
										<tr>
											<td style="padding:0 35px;">
												<h1 style="color:#1e1e2d; font-weight:500; margin:0;font-size:32px;font-family:'Rubik',sans-serif;">Podsjetnik za istek pretplate</h1>
												<span
													style="display:inline-block; vertical-align:middle; margin:29px 0 26px; border-bottom:1px solid #cecece; width:100px;"></span>
												<p style="color:#455056; font-size:15px;line-height:24px; margin:0;">
												Vaša pretplata ističe ${subscriber.validToDate} imate ${differenceInDays} dana da obnovite pretplatu
												</p>	
											</td>
										</tr>		
										<tr>
											<td style="height:40px;">&nbsp;</td>
										</tr>
									</table>
								</td>
							<tr>
								<td style="height:20px;">&nbsp;</td>
							</tr>
							<tr>
								<td style="text-align:center;">
									<p style="font-size:14px; color:rgba(69, 80, 86, 0.7411764705882353); line-height:18px; margin:0 0 0;">&copy; <strong>www.superdentals.com</strong></p>
								</td>
							</tr>
							<tr>
								<td style="height:80px;">&nbsp;</td>
							</tr>
						</table>
					</td>
				</tr>
			</table>
				`,
				};

				let mailToAdmin = {
					from: 'info@superdentals.com',
					to: `${adminEmail?.defaultValue}`,
					subject: 'Subscription Reminder',

					html: `
				<table cellspacing="0" border="0" cellpadding="0" width="100%" bgcolor="#0D3082"
				style="@import url(https://fonts.googleapis.com/css?family=Rubik:300,400,500,700|Open+Sans:300,400,600,700); font-family: 'Open Sans', sans-serif;">
				<tr>
					<td>
						<table style="background-color: #f2f3f8; max-width:670px;  margin:0 auto;" width="100%" border="0"
							align="center" cellpadding="0" cellspacing="0">
							<tr>
								<td style="height:80px;">&nbsp;</td>
							</tr>
							<tr>
								<td style="text-align:center;">
									<img src='${process.env.BASE_URL}/images/logo.png' style="height:80px;width: 250px; alt="logo"/>								</td>
							</tr>
							<tr>
								<td style="height:20px;">&nbsp;</td>
							</tr>
							<tr>
								<td>
									<table width="95%" border="0" align="center" cellpadding="0" cellspacing="0"
										style="max-width:670px;background:#fff; border-radius:3px; text-align:center;-webkit-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);-moz-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);box-shadow:0 6px 18px 0 rgba(0,0,0,.06);">
										<tr>
											<td style="height:40px;">&nbsp;</td>
										</tr>
										<tr>
											<td style="padding:0 35px;">
												<h1 style="color:#1e1e2d; font-weight:500; margin:0;font-size:32px;font-family:'Rubik',sans-serif;">Podsjetnik za istek pretplate</h1>
												<span
													style="display:inline-block; vertical-align:middle; margin:29px 0 26px; border-bottom:1px solid #cecece; width:100px;"></span>
												<p style="color:#455056; font-size:15px;line-height:24px; margin:0;">
												Pretplata za ${subscriber.user.name} ${subscriber.user.surname} ističe za ${differenceInDays} dana
												</p>	
											</td>
										</tr>		
										<tr>
											<td style="height:40px;">&nbsp;</td>
										</tr>
									</table>
								</td>
							<tr>
								<td style="height:20px;">&nbsp;</td>
							</tr>
							<tr>
								<td style="text-align:center;">
									<p style="font-size:14px; color:rgba(69, 80, 86, 0.7411764705882353); line-height:18px; margin:0 0 0;">&copy; <strong>www.superdentals.com</strong></p>
								</td>
							</tr>
							<tr>
								<td style="height:80px;">&nbsp;</td>
							</tr>
						</table>
					</td>
				</tr>
			</table>
				`,
				};

				if (differenceInDays === 14) {
					await sendEmail(mail);
					await sendEmail(mailToAdmin);
				}

				if (differenceInDays === 7) {
					await sendEmail(mail);
					await sendEmail(mailToAdmin);
				}

				if (differenceInDays === 1) {
					await sendEmail(mail);
					await sendEmail(mailToAdmin);
				}
			});
			res.status(200).json();
		} catch (error) {
			res.status(400).json({ message: error });
		}
	}
}
