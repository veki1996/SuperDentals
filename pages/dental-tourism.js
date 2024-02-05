import { Nav, Footer, HeadMeta } from '/components';
import Image from 'next/image';
import useTranslation from 'next-translate/useTranslation';
import Trans from 'next-translate/Trans';

const DentalTourism = () => {
	const { t } = useTranslation('dental-tourism');

	return (
		<div>
			<Nav />
			<HeadMeta
				title="Dentalni turizam"
				link={`${process.env.BASE_URL}/dental-tourism`}
				content={'superdentals.com'}
				description="Tražite stomatologa po svojoj mjeri? Na pravom ste mjestu."
				image={`${process.env.BASE_URL}/images/logo.jpg`}
			/>
			<section className="container mx-auto px-6 md:pl-16  py-16">
				<div className="flex flex-col xl:flex-row basis-1/2 justify-between">
					<div className="flex flex-col  basis-1/2 text-center lg:text-left">
						<h1 className="font-bold text-primaryColor xl:text-heading 2xl:text-heading lg:text-[40px] text-[32px]">
							{t('hero.title')}
						</h1>
						<p className="font-bold  md:text-paragraph text-[18px] py-5">{t('hero.text-1')}</p>
						<p className="md:text-paragraph text-[18px]">{t('hero.text-2')}</p>
					</div>
					<div className="xl:justify-end justify-center  ">
						<Image alt="aboutdental" width={721} height={600} src="/dental-tourism-page-assets/dentour.png" />
					</div>
				</div>
			</section>
			<div className="container mx-auto px-6 md:px-16 relative pb-16">
				<div className="bg-center bg-primaryColor   flex justify-center  ">
					<h1 className="text-white font-semibold xl:text-[24px] text-center flex justify-center py-6 :py-12 px-6">
						{t('hero.text-3')}
					</h1>
				</div>
			</div>
			<div className="container mx-auto px-6 md:px-16 relative pb-16 lg:text-[20px] text-[18px] text-center lg:text-left">
				<Trans
					i18nKey={t('hero.text-4')}
					components={[
						<span className="text-primaryColor font-bold" key="span-text-4" />,
						<span className="font-bold" key="bold-text-4" />,
					]}
				/>
			</div>
			<section className="container mx-auto px-6 md:px-16  py-10">
				<div className="flex flex-col xl:flex-row justify-between basis-1/2">
					<div className=" justify-center flex pb-12">
						<Image alt="zub" width={545} height={420} src="/dental-tourism-page-assets/zub.png" />
					</div>
					<div className="flex flex-col  basis-1/2 text-center lg:text-left gap-4">
						<p className="lg:text-[20px]   xl:ml-7 2xl:ml-0 text-[18px] ">{t('section-find.text-1')}</p>
						<div className="lg:text-[20px]  text-[18px] xl:ml-7 2xl:ml-0">
							{t('section-find.text-2')}{' '}
							<span className="font-bold text-primaryColor">
								<a href="mailto:dentaltourist@superdentals.com">dentaltourist@superdentals.com</a>
							</span>
							{t('section-find.text-3')}
						</div>
					</div>
				</div>
			</section>
			<div className="container mx-auto px-6 md:px-16  py-10">
				<p className="lg:text-[20px] text-[18px] text-center lg:text-left">
					{t('section-countries.text-1')}{' '}
					<span>
						<Trans
							i18nKey={t('section-countries.text-2')}
							components={[
								<span className="text-primaryColor font-bold" key="span-text-4" />,
								<span className="font-bold" key="bold-text-4" />,
							]}
						/>{' '}
					</span>
				</p>
				<p className="lg:text-[20px] text-[18px] py-10 text-center lg:text-left">{t('section-countries.text-3')}</p>
			</div>

			<section className="container mx-auto px-6 md:px-16 ">
				<div className="flex flex-col lg:flex-row basis-[50%] justify-between">
					<div className="flex flex-col basis-[50%] lg:justify-start lg:py-10 justify-center pb-5">
						<div className="flex flex-col gap-6 text-center md:text-left">
							<p className="xl:text-[20px] text-[16px] text-center lg:text-left">{t('section-countries.text-4')}</p>
							<p className="xl:text-[20px] text-[16px] font-bold text-center lg:text-left">
								{t('section-countries.text-5')}
							</p>
						</div>
					</div>
					<div className="flex justify-center lg:ml-24">
						<Image alt="zubi" width={550} height={376} src="/dental-tourism-page-assets/zubi.png" />
					</div>
				</div>
			</section>
			<div className="container mx-auto px-6 md:px-16 py-10 lg:text-[20px] text-center lg:text-left">
				{t('section-countries.text-6')}
			</div>
			<div className="container mx-auto px-6 md:px-16 py-16 ">
				<h1 className="lg:text-[30px] text-[24px] text-center font-medium pb-10">{t('contact.text-1')}</h1>
				<p className="text-center  lg:text-[26px] text-[19px]">
					{t('contact.text-2')}{' '}
					<span className="font-bold text-primaryColor">
						<a href="mailto:dentaltourist@superdentals.com">dentaltourist@superdentals.com</a>
					</span>{' '}
					{t('contact.text-3')}
				</p>
			</div>
			<Footer />
		</div>
	);
};

export default DentalTourism;
