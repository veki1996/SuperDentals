import { sendEmail } from '/utils/mail';
import { prisma } from '/utils/db';
export default async function handler(req, res) {
	if (req.method === 'POST') {
		const adminEmail = await prisma.setting.findFirst({
			where: {
				name: 'Admin Email',
			},
		});

		let mail;
		if (req.body.clinicEmail !== '') {
			mail = {
				from: `info@superdentals.com`,
				to: `${req.body.clinicEmail}, ${adminEmail?.defaultValue}`,
				subject: `${req.body.subject}`,
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
												<h1 style="color:#1e1e2d; font-weight:500; margin:0;font-size:32px;font-family:'Rubik',sans-serif;">Imate novu poruku od ${req.body.name}</h1>
												<span
													style="display:inline-block; vertical-align:middle; margin:29px 0 26px; border-bottom:1px solid #cecece; width:100px;"></span>
												<p style="color:#455056; font-size:15px;line-height:24px; margin:0;">
												${req.body.message}
												</p>
												<p
													style="background:#FC5122;text-decoration:none !important; font-weight:700; margin-top:35px; color:#fff; font-size:14px;padding:10px 24px;display:inline-block;border-radius:50px;">Email: ${req.body.mailFrom}</p>
													
											</td>
										</tr>
										<tr style="height:60px;">
										<p
										style="background:#FC5122;text-decoration:none !important; font-weight:700; margin-top:35px; color:#fff; font-size:14px;padding:10px 24px;display:inline-block;border-radius:50px;">Telefon: ${req.body.number}</p>
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
		} else {
			mail = {
				from: `info@superdentals.com`,
				to: `${adminEmail?.defaultValue}`,
				subject: `${req.body.subject}`,
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
								<img src='${process.env.BASE_URL}/images/logo.png' style="height:80px;width: 250px; alt="logo"/>
								</td>
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
												<h1 style="color:#1e1e2d; font-weight:500; margin:0;font-size:32px;font-family:'Rubik',sans-serif;">Imate novu poruku od ${req.body.name}</h1>
												<span
													style="display:inline-block; vertical-align:middle; margin:29px 0 26px; border-bottom:1px solid #cecece; width:100px;"></span>
												<p style="color:#455056; font-size:15px;line-height:24px; margin:0;">
												${req.body.message}
												</p>
												<p
													style="background:#FC5122;text-decoration:none !important; font-weight:700; margin-top:35px; color:#fff; font-size:14px;padding:10px 24px;display:inline-block;border-radius:50px;">Email: ${req.body.mailFrom}</p>
													
											</td>
										</tr>
										<tr style="height:60px;">
										<p
										style="background:#FC5122;text-decoration:none !important; font-weight:700; margin-top:35px; color:#fff; font-size:14px;padding:10px 24px;display:inline-block;border-radius:50px;">Telefon: ${req.body.number}</p>
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
		}

		let response = await sendEmail(mail);

		if (response.messageId !== null) {
			res.status(200).json({
				status: 'Message Sent',
				id: response.messageId,
			});
		} else {
			res.status(400).json({
				message: 'Something went wrong while sending email...',
			});
		}
	}
}
