import { Nav, Footer, HeadMeta } from '/components';
import Image from 'next/image';
import Link from 'next/link';
import useTranslation from 'next-translate/useTranslation';

const About = () => {
	const { t } = useTranslation('about');
	return (
		<div>
			<Nav />
			<HeadMeta
				title="O nama"
				link={`${process.env.BASE_URL}/about`}
				content={'superdentals.com'}
				description="Tražite stomatologa po svojoj mjeri? Na pravom ste mjestu."
				image={`${process.env.BASE_URL}/images/logo.jpg`}
			/>
			<section className="min-h-[calc(100vh-(189px*2))]">
				<section className="container mx-auto px-6 md:px-16 relative ">
					<div className="flex flex-col lg:flex-row basis-[50%]">
						<Image alt="aboutdental" width={600} height={680} src="/about-page-assets/glavnaslika.png" />

						<div className="flex flex-col basis-[50%] lg:justify-start lg:py-10 justify-center pb-5">
							<h1 className="text-primaryColor font-bold text-[40px]  lg:text-heading pb-10 text-center md:text-left">
								{t('hero.title')}
							</h1>
							<div className="flex flex-col gap-6 text-center md:text-left">
								<div className="xl:text-[20px]">
									{t('hero.text-1')} <span className="font-bold">SuperDENTALS.com</span> {t('hero.text-2')}
								</div>
								<div className="xl:text-[20px]">
									<span className="font-bold">SuperDENTALS.com</span> {t('hero.text-3')}
								</div>
								<div className="xl:text-[20px]">
									{t('hero.text-4')}{' '}
									<Link href="/">
										<span className="text-secondary font-[600] cursor-pointer">{t('hero.text-5')}</span>
									</Link>{' '}
									{t('hero.text-6')}
								</div>
							</div>
						</div>
					</div>
				</section>
				<section className="container mx-auto px-6 md:px-16 relative py-10">
					<div className="flex flex-col md:flex-row gap-8 justify-center">
						<div className="basis-[50%] text-center px-[15px]">
							<Image alt="vizija" width={141} height={146} src="/about-page-assets/ikonica1.svg" />
							<h1 className="font-bold md:text-[36px]  text-[28px] md:pt-10 pb-4">{t('vission.title')}</h1>
							<div className="md:text-[18px] text-[16px]">
								<span className="font-bold">SuperDENTALS.com </span> {t('vission.text-1')}
							</div>
						</div>
						<div className="basis-[50%] text-center py-10 md:py-0">
							<Image alt="misija" width={185} height={158} src="/about-page-assets/ikonica2.svg" />
							<h1 className="font-bold md:text-[36px]  text-[28px] md:pt-8 pb-4">{t('mission.title')}</h1>
							<div className="md:text-[18px] text-[16px]">
								<span className="font-bold">SuperDENTALS.com </span> {t('mission.text-1')}{' '}
							</div>
						</div>
					</div>
				</section>
				<section className="container mx-auto px-6 md:px-16 relative py-10">
					<div className="bg-center bg-primaryColor  rounded-[10px] flex justify-center">
						<p className="mx-5 text-[15px] text-center md:text-[22px] py-8  text-white">{t('offer.text-1')}</p>
					</div>
				</section>
				<section className="container mx-auto px-6 md:px-16  ">
					<div className="w-full flex flex-col justify-center items-center gap-10  pt-10 pb-20 ">
						<h1 className="md:text-[32px] text-[18px] text-center  font-semibold py-10">{t('partners.title')}</h1>
						<div className="flex flex-col lg:flex-row  gap-10 text-[16px]  ">
							<div className="flex flex-col justify-center items-center text-center ">
								<div className="w-[126px] h-[122px] relative">
									<Image alt="preporuka1" src="/about-page-assets/prep1.svg" layout="fill" />
								</div>

								<div className="w-full flex items-center justify-center py-2 pt-8">
									<h2>{t('partners.text-1')}</h2>
								</div>
							</div>

							<div className="flex flex-col justify-center items-center text-center ">
								<div className="w-[126px] h-[122px] relative">
									<Image alt="preporuka2" src="/about-page-assets/prep2.svg" layout="fill" />
								</div>

								<div className="w-full flex items-center justify-center py-2 pt-8">
									<h2>{t('partners.text-2')}</h2>
								</div>
							</div>
							<div className="flex flex-col justify-center items-center text-center ">
								<div className="w-[126px] h-[122px] relative">
									<Image alt="preporuka3" src="/about-page-assets/prep3.svg" layout="fill" />
								</div>

								<div className="w-full flex items-center justify-center py-2 pt-8">
									<h2>{t('partners.text-3')}</h2>
								</div>
							</div>

							<div className="flex flex-col justify-center items-center text-center  lg:mt-7 xl:mt-0">
								<div className="w-[126px] h-[122px] relative">
									<Image alt="preporuka4" src="/about-page-assets/prep4.svg" layout="fill" />
								</div>

								<div className="w-full flex items-center justify-center py-2 pt-8">
									<h2>{t('partners.text-4')}</h2>
								</div>
							</div>
						</div>
					</div>
				</section>
				<section className="py-10">
					<div className="bg-[#F1F1F1]  flex flex-col justify-center w-full py-10 items-center">
						<h1 className="px-6 font-bold xl:text-[28px] text-center md:px-16 lg:px-60 items-center flex text-[20px] py-20">
							{t('quality.title')}
						</h1>

						<div className="container px-6 mx-auto w-full flex flex-col lg:flex-row justify-center items-center gap-10 lg:gap-20  pt-10 pb-16 xl:text-[16px]  ">
							<div className="w-[190px] h-[190px] flex flex-col justify-center items-center text-center rounded-[8px]  gap-5">
								<div className="h-[120px] items-center flex">
									<div className="w-[70px] h-[70px] relative">
										<Image alt="alt" src="/about-page-assets/usl1.svg" layout="fill" />
									</div>
								</div>
								<div className="w-full h-[80px]">
									<h2 className="font-[500]">{t('quality.text-1')}</h2>
								</div>
							</div>

							<div className="w-[190px] h-[190px] flex flex-col justify-center items-center text-center rounded-[8px]  gap-5">
								<div className="h-[120px] items-center flex">
									<div className="w-[105px] h-[85px] relative">
										<Image alt="alt" src="/about-page-assets/usl2.svg" layout="fill" />
									</div>
								</div>

								<div className="w-[80%] h-[80px]">
									<h2 className="font-[500]">{t('quality.text-2')}</h2>
								</div>
							</div>

							<div className="w-[190px] h-[190px] flex flex-col justify-center items-center text-center rounded-[8px]  gap-5">
								<div className="h-[120px] items-center flex">
									<div className="w-[90px] h-[75px] relative">
										<Image alt="alt" src="/about-page-assets/usl3.svg" layout="fill" />
									</div>
								</div>
								<div className="w-full h-[80px]">
									<h2 className="font-[500]">{t('quality.text-3')}</h2>
								</div>
							</div>

							<div className="w-[190px] h-[190px] flex flex-col justify-center items-center text-center rounded-[8px]  gap-5">
								<div className="h-[120px] items-center flex ml-10">
									<div className="w-[90px] h-[90px] relative">
										<Image alt="alt" src="/about-page-assets/usl4.svg" layout="fill" />
									</div>
								</div>
								<div className="w-[80%] h-[80px]">
									<h2 className="font-[500]">{t('quality.text-4')}</h2>
								</div>
							</div>

							<div className="w-[230px] h-[190px] flex flex-col justify-center items-center text-center rounded-[8px]  gap-5">
								<div className="h-[120px] items-center flex">
									<div className="w-[80px] h-[109px] relative">
										<Image alt="alt" src="/about-page-assets/usl5.svg" layout="fill" />
									</div>
								</div>
								<div className="w-full h-[80px]">
									<h2 className="font-[500]">{t('quality.text-5')}</h2>
								</div>
							</div>
						</div>
					</div>
				</section>
				<div className="container px-6  mx-auto text-center text-[16px] md:text-[22px] lg:text-[28px] py-14">
					<h1 className="font-semibold">{t('contact.text-1')}</h1>
					<h1 className="pt-3 text-primaryColor font-bold">
						<a href="mailto:info@superdentals.com">info@superdentals.com</a>
					</h1>
				</div>
			</section>
			<Footer />
		</div>
	);
};

export default About;
