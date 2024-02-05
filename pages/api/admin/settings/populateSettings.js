import { prisma } from '/utils/db';

export default async function handler(req, res) {
	if (req.method === 'GET') {
		try {
			const settings = await prisma.setting.findMany();

			const populateSettings = async (settings, settingName) => {
				if (!settings.find((setting) => setting?.name === settingName)) {
					await prisma.setting.create({
						data: {
							name: settingName,
						},
					});
				}
			};

			// Filters
			populateSettings(settings, 'Filter By Country');
			populateSettings(settings, 'Filter By City');
			populateSettings(settings, 'Filter By Service');
			populateSettings(settings, 'Filter By Language');
			populateSettings(settings, 'Filter By Distance');
			populateSettings(settings, 'Filter By Rating');

			//Sorters
			populateSettings(settings, 'Sort A-Z');
			populateSettings(settings, 'Sort Z-A');
			populateSettings(settings, 'Sort Rating');
			populateSettings(settings, 'Sort Years In Service');

			// Socials
			populateSettings(settings, 'Social Facebook');
			populateSettings(settings, 'Social Instagram');
			populateSettings(settings, 'Social Linkedin');
			populateSettings(settings, 'Social Tiktok');
			populateSettings(settings, 'Social Twitter');
			populateSettings(settings, 'Social Youtube');

			// Other Settings
			populateSettings(settings, 'Default Country');
			populateSettings(settings, 'Admin Email');

			// Contact
			populateSettings(settings, 'Contact Phone Serbia');
			populateSettings(settings, 'Contact Phone Bosnia');
			populateSettings(settings, 'Contact Phone Montenegro');
			populateSettings(settings, 'Contact Email');
			populateSettings(settings, 'Contact Messenger');

			res.status(200).json({ message: 'Setting added' });
		} catch (error) {
			res.status(400).json({ message: error });
		}
	}
}
