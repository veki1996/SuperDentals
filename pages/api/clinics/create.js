import { prisma } from '/utils/db';

export default async function handler(req, res) {
	if (req.method === 'POST') {
		const {
			address,
			city,
			clinicName,
			username,
			clinicsNumber,
			creditCardPayment,
			description,
			doctorsNumber,
			email,
			emergencyAvailability,
			facebook,
			instagram,
			jib,
			languages,
			parkingAvailable,
			pdv,
			phoneNumbers,
			service,
			staffNumber,
			twitter,
			userId,
			warrantyProvided,
			firstCheckupIsFree,
			website,
			wifiAvailable,
			workHours,
			yearsInService,
			mapCoords,
			servicesPrices,
			rating,
			tiktok,
			linkedin,
		} = req.body;

		// Construct description json
		const descriptionJson = [
			{
				country: 'rs',
				description: description.rs,
			},
			{
				country: 'ba',
				description: description.ba,
			},
			{
				country: 'hr',
				description: description.hr,
			},
			{
				country: 'me',
				description: description.me,
			},
			{
				country: 'si',
				description: description.si,
			},
			{
				country: 'gb',
				description: description.gb,
			},
			{
				country: 'de',
				description: description.de,
			},
			{
				country: 'it',
				description: description.it,
			},
		];

		// Create array of objects for many to many relation
		const serviceId = service.map((s) => {
			return {
				id: s,
			};
		});

		try {
			const clinic = await prisma.clinic.create({
				data: {
					email: email,
					jib: jib,
					name: clinicName,
					username: username,
					phoneNumbers: JSON.stringify(phoneNumbers),
					address: address,
					creditCardPaymentAvailable: creditCardPayment,
					description: descriptionJson,
					emergencyAvailability: emergencyAvailability,
					facebook: facebook,
					instagram: instagram,
					tiktok: tiktok,
					linkedin: linkedin,
					languagesSpoken: JSON.stringify(languages),
					locationId: city.id,
					numberOfDoctors: Number(doctorsNumber),
					numberOfOffices: Number(clinicsNumber),
					numberOfStaff: Number(staffNumber),
					parkingAvailable: parkingAvailable,
					pdv: pdv,
					twitter: twitter,
					userId: userId,
					videoAlbum: JSON.stringify([]),
					warrantyProvided: warrantyProvided,
					firstCheckupIsFree: firstCheckupIsFree,
					website: website,
					wifiAvailable: wifiAvailable,
					workHours: JSON.stringify(workHours),
					yearsInService: Number(yearsInService),
					mapCoordinates: mapCoords,
					rating: String(rating),
					services: {
						connect: serviceId,
					},
				},
				include: {
					services: true,
					location: true,
					employees: true,
				},
			});

			servicesPrices.map(async (clinicService) => {
				await prisma.clinicServices.create({
					data: {
						price: clinicService.price,
						currency: '€',
						clinicId: clinic.id,
						serviceId: clinicService.id,
					},
				});
			});

			res.status(201).json({ message: 'Clinic created', clinic });
		} catch (error) {
			res.status(400).json({
				message: error.message,
				status: error.code,
			});
		}
	}
}
