import { Footer, HeadMeta, ImageDisplay, Nav } from '/components';
import Image from 'next/image';
import { getSession } from 'next-auth/react';
import { prisma } from '/utils/db';
import useTranslation from 'next-translate/useTranslation';
import Trans from 'next-translate/Trans';

const Partners = ({ partners }) => {
	const { t } = useTranslation('partners');

	return (
		<div>
			<Nav />
			<HeadMeta
				title="Partneri"
				link={`${process.env.BASE_URL}/partners`}
				content={'superdentals.com'}
				description="Tražite stomatologa po svojoj mjeri? Na pravom ste mjestu."
				image={`${process.env.BASE_URL}/images/logo.jpg`}
			/>
			<div className="lg:bg-partners-image  lg:bg-no-repeat   lg:bg-right-top ">
				<section className="container mx-auto px-6 md:px-16 flex flex-col gap-8 lg:gap-20 lg:flex-row  py-8">
					<div className="flex lg:basis-[50%] flex-col gap-10">
						<h1 className="text-primaryColor font-bold xl:text-heading text-center sm:text-left text-[40px] ">
							{t('hero.title')}
						</h1>
						<div className="md:text-paragraph  lg:text-left  ">
							<Trans i18nKey={t('hero.text-1')} components={[<strong key="key" />]} />{' '}
							<p className="py-6">{t('hero.text-2')}</p>
							<p className="font-bold text-center md:text-left lg:text-[24px]">{t('hero.text-3')}</p>
							<p className="text-primaryColor font-bold text-center md:text-left lg:text-[24px]">
								<a href="mailto:partner@superdentals.com">partner@superdentals.com</a>
							</p>
						</div>
					</div>
				</section>
			</div>
			<section className="container px-6 md:px-16 mx-auto text-center py-5 ">
				<div className="text-[18px] flex justify-center text-center font-bold md:text-[30px] pb-10">
					<div className="xl:w-[50%]">
						<h1>{t('hero.heading')}</h1>
					</div>
				</div>
				{partners?.length === 0 && (
					<span className="text-primaryColor font-[600] text-[18px] md:text-[24px]">{t('hero.text-4')}</span>
				)}
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4  gap-14 px-6 ">
					{partners?.length > 0 ? (
						partners?.map((partner) => (
							<div key={partner.id}>
								<div className="bg-[#FBFBFB] rounded-[12px] cursor-pointer relative">
									{partner.imageId !== null ? (
										<a rel="noreferrer" href={partner?.website} target="_blank">
											<ImageDisplay
												images={partner.image}
												imageType="PARTNER"
												imageFrom="partner"
												layout="fill"
												containerStyle="h-[180px]"
												imageContainerStyle="relative h-full"
												imageStyle="rounded-t-[12px]"
											/>
										</a>
									) : (
										<a rel="noreferrer" href={partner?.website} target="_blank">
											<div className="w-full h-[180px] ">
												<Image
													alt="Placeholder"
													src="/placeholder-images/placeholder-1.png"
													layout="fill"
													className=" rounded-t-[12px]"
													objectFit="cover"
												/>
											</div>
										</a>
									)}
								</div>
							</div>
						))
					) : (
						<span></span>
					)}
				</div>
			</section>
			<Footer />
		</div>
	);
};

export default Partners;

export async function getServerSideProps(ctx) {
	const session = await getSession(ctx);
	const partners = await prisma.partner.findMany({
		include: {
			image: true,
		},
	});

	return {
		props: {
			partners,
			session,
		},
	};
}
