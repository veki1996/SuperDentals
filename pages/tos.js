import { Nav, HeadMeta, Footer } from '/components';
import useTranslation from 'next-translate/useTranslation';

const TermsOfUse = () => {
	const { t } = useTranslation('tos');

	return (
		<div>
			<Nav />
			<HeadMeta
				title="Uslovi korišćenja"
				link={`${process.env.BASE_URL}/tos`}
				content={'superdentals.com'}
				description="Tražite stomatologa po svojoj mjeri? Na pravom ste mjestu."
				image={`${process.env.BASE_URL}/images/logo.jpg`}
			/>
			<section className="min-h-[calc(100vh-(181px*2))] container mx-auto px-6 md:px-16 py-12 flex flex-col gap-2 text-black">
				<h1 className="text-gray-700 font-bold text-center text-[20px] md:text-[26px] mb-5">{t('section.title')}</h1>
				<p>{t('section.rule-1')}</p>
				<p>{t('section.rule-2')}</p>
				<p>{t('section.rule-3')}</p>
				<p>{t('section.rule-4')}</p>
				<p>{t('section.rule-5')}</p>
				<p>{t('section.rule-6')}</p>
				<p>{t('section.rule-7')}</p>
				<p>{t('section.rule-8')}</p>
				<p>{t('section.rule-9')}</p>
				<p>{t('section.rule-10')}</p>
				<p>{t('section.rule-11')}</p>
				<p>{t('section.rule-12')}</p>
				<p>{t('section.rule-13')}</p>
				<p>{t('section.rule-14')}</p>
				<p>{t('section.rule-15')}</p>
				<p>{t('section.rule-16')}</p>
				<p>{t('section.rule-17')}</p>
				<p>{t('section.rule-18')}</p>
				<p>{t('section.rule-19')}</p>
				<p>{t('section.rule-20')}</p>
				<p>{t('section.rule-21')}</p>
				<p>{t('section.rule-22')}</p>
				<p>{t('section.rule-23')}</p>
				<p>{t('section.rule-24')}</p>
				<p>{t('section.rule-25')}</p>
				<p>{t('section.rule-26')}</p>
				<p>{t('section.rule-27')}</p>
				<p>{t('section.rule-28')}</p>
				<p>{t('section.rule-29')}</p>
				<p>{t('section.rule-30')}</p>
				<p>{t('section.rule-31')}</p>
				<p>{t('section.rule-32')}</p>
				<p>{t('section.rule-33')}</p>
				<p>{t('section.rule-34')}</p>
				<p>{t('section.rule-35')}</p>
				<p>{t('section.rule-36')}</p>
				<p>{t('section.rule-37')}</p>
				<p className="flex flex-col gap-2">
					<span>{t('section.rule-38')}</span>
					<span className="flex flex-col gap-2 ml-7">
						<span>{t('section.rule-38-a')}</span>
						<span>{t('section.rule-38-b')}</span>
						<span>{t('section.rule-38-c')}</span>
					</span>
				</p>
				<p>{t('section.rule-39')}</p>
				<p>{t('section.rule-40')}</p>
				<p>{t('section.rule-41')}</p>
				<p>{t('section.rule-42')}</p>
				<p>{t('section.rule-43')}</p>
				<p>{t('section.rule-44')}</p>
				<p>{t('section.rule-45')}</p>
				<p>{t('section.rule-46')}</p>
				<p>{t('section.rule-47')}</p>
				<p>{t('section.rule-48')}</p>
				<p>{t('section.rule-49')}</p>
				<p>{t('section.rule-50')}</p>
				<p>{t('section.rule-51')}</p>
				<p>{t('section.rule-52')}</p>
				<p>{t('section.rule-53')}</p>
				<p>{t('section.rule-54')}</p>
				<p>{t('section.rule-55')}</p>
				<p>{t('section.rule-56')}</p>
				<p>{t('section.rule-57')}</p>
				<p>{t('section.rule-58')}</p>
				<p>{t('section.rule-59')}</p>
				<p>{t('section.rule-60')}</p>
				<p>{t('section.rule-61')}</p>
				<p>{t('section.rule-62')}</p>
				<p>{t('section.rule-63')}</p>
				<p>{t('section.rule-64')}</p>
				<p className="mt-5">
					<b>{t('section.contact')}</b>
				</p>
				<p>{t('section.contact-p')}</p>
				<p className="flex flex-col gap-2 my-5">
					<span>{t('section.footer-1')}</span>
					<span>{t('section.footer-2')}</span>
					<span>{t('section.footer-3')}</span>
				</p>
				<p className="flex flex-col gap-2">
					<span>{t('section.footer-4')}</span>
					<span>{t('section.footer-5')}</span>
				</p>
			</section>

			<Footer />
		</div>
	);
};

export default TermsOfUse;
