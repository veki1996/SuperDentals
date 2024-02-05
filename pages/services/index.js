import Image from 'next/image';
import { useRouter } from 'next/router';
import { HeadMeta, Nav, Footer, ImageDisplay } from '/components';
import { prisma } from '/utils/db';
import { getServiceName, getServiceDescription } from '/utils/utils';
import useTranslation from 'next-translate/useTranslation';

const Services = ({ services, setting }) => {
	const router = useRouter();
	const { locale } = router;
	const { t } = useTranslation('services');

	const defaultCountry = setting.length > 0 && setting[0].defaultValue ? setting[0].defaultValue : 'ba';

	const handleClick = (service) => {
		const manualCountry = localStorage.getItem('selectedCountry');
		router.push(
			`/services/${service?.simplifiedName.trim().split(' ').join('-')}?country=${
				manualCountry || defaultCountry
			}&service=${getServiceName(service, locale, true).split(' ').join('_')}`,
		);
	};
	return (
		<div>
			<HeadMeta
				title="Usluge"
				link={`${process.env.BASE_URL}/services`}
				content={'superdentals.com'}
				description="Tražite stomatologa po svojoj mjeri? Na pravom ste mjestu."
				image={`${process.env.BASE_URL}/images/logo.jpg`}
			/>
			<Nav />
			<section className="min-h-[calc(100vh-(2*181px))] container mx-auto px-6 md:px-16 py-10 lg:py-20 flex flex-col gap-16">
				{services.map((service) => (
					<div key={service?.id} className="flex flex-col lg:flex-row gap-5 text-center lg:text-left lg:gap-10">
						<div className="flex justify-center">
							{service?.imageId ? (
								<ImageDisplay
									images={service?.image}
									imageType="SERVICE"
									imageFrom="service"
									id={service?.id}
									layout="fill"
									imageStyle="rounded-xl"
									imageContainerStyle="relative w-[200px] h-[200px]"
								/>
							) : (
								<div className="relative w-[200px] h-[200px]">
									<Image
										alt={getServiceName(service, locale, true)}
										src="/placeholder-images/placeholder-1.png"
										layout="fill"
										objectFit="cover"
										className="rounded-xl"
									/>
								</div>
							)}
						</div>
						<div className="flex flex-col gap-6 basis-[70%] justify-between">
							<h1 className="text-[24px] md:text-[40px] text-primaryColor font-[700]">
								{getServiceName(service, locale, true)}
							</h1>
							<p className="text-[18px] md:text-[20px] text-[#21231E]">
								{getServiceDescription(service, locale, true)}
							</p>
							<button
								onClick={() => handleClick(service)}
								className="button-outline hover:text-white hover:bg-primaryColor lg:w-[40%] lg:self-end"
							>
								{t('main.text-1')}
							</button>
						</div>
					</div>
				))}
			</section>
			<Footer />
		</div>
	);
};

export default Services;

export async function getStaticProps() {
	const services = await prisma.service.findMany({
		orderBy: {
			order: 'asc',
		},
		include: {
			image: true,
		},
	});

	const setting = await prisma.setting.findMany({
		where: {
			name: {
				equals: 'Default Country',
			},
		},
	});

	return {
		props: {
			services,
			setting,
		},
		revalidate: 10,
	};
}
