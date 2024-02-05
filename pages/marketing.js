import { Footer, HeadMeta, Nav } from '/components';
import useTranslation from 'next-translate/useTranslation';
import Trans from 'next-translate/Trans';

const Marketing = () => {
	const { t } = useTranslation('marketing');

	return (
		<div>
			<Nav />
			<HeadMeta
				title="Marketing"
				link={`${process.env.BASE_URL}/marketing`}
				content={'superdentals.com'}
				description="Tražite stomatologa po svojoj mjeri? Na pravom ste mjestu."
				image={`${process.env.BASE_URL}/images/logo.jpg`}
			/>

			<div className="lg:bg-marketing-image lg:bg-no-repeat lg:bg-auto lg:bg-[right_-1rem_bottom_-6rem]">
				<section className="container mx-auto px-6 md:px-16 flex flex-col gap-8 lg:gap-20 lg:flex-row pb-16 lg:py-16">
					<div className="flex lg:basis-[50%] flex-col gap-5">
						<h1 className=" text-center md:text-left text-[32px] lg:text-heading font-bold text-primaryColor py-5 ">
							{t('hero.title')}
						</h1>
						<p className="md:text-[20px]">{t('hero.text-1')}</p>
						<p className="md:text-[20px]">
							<Trans
								i18nKey={t('hero.text-2')}
								components={[
									<span className="text-primaryColor font-bold" key="span" />,
									<a href="mailto:marketing@superdentals.com" key="link" />,
								]}
							/>
						</p>
						<p className="md:text-[20px]">{t('hero.text-3')}</p>
					</div>
				</section>

				<section className="px-8">
					<div className="container mx-auto py-[15px]  bg-primaryColor text-center rounded-[15px]  md:py-8 ">
						<p className="text-[20px] text-center lg:text-[24px] text-white">
							<Trans i18nKey={t('hero.text-4')} components={[<br key="break" />]} />
						</p>
					</div>
				</section>
			</div>
			<section className="py-14">
				<p className="text-center py-2 md:text-[23px]">
					<Trans i18nKey={t('hero.text-5')} components={[<br key="break-2" />]} />
				</p>
				<div className="text-[20px] text-center md:text-[32px]">
					<b>{t('hero.text-6')}</b>
				</div>
				<div className="text-primaryColor font-bold text-center text-[20px] md:text-[24px]">
					{' '}
					<a href="mailto:marketing@superdentals.com">marketing@superdentals.com</a>
				</div>
			</section>
			<Footer />
		</div>
	);
};

export default Marketing;
