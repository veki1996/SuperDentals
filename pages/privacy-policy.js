import Link from 'next/link';
import { Nav, HeadMeta, Footer } from '/components';
import useTranslation from 'next-translate/useTranslation';

const TermsOfUse = () => {
	const { t } = useTranslation('privacy-policy');
	return (
		<div>
			<Nav />
			<HeadMeta
				title="Politika Privatnosti"
				link={`${process.env.BASE_URL}/privacy-policy`}
				content={'superdentals.com'}
				description="Tražite stomatologa po svojoj mjeri? Na pravom ste mjestu."
				image={`${process.env.BASE_URL}/images/logo.jpg`}
			/>
			<section className="min-h-[calc(100vh-(181px*2))] container mx-auto px-6 md:px-16 py-12 flex flex-col gap-4 text-black">
				<h1 className="text-gray-700 font-bold text-center text-[20px] md:text-[26px] mb-5">{t('section.title')}</h1>
				<p>{t('section.text-1')}</p>
				<p>{t('section.text-2')}</p>
				<p>{t('section.text-3')}</p>
				<p>
					{t('section.link-text-1')}{' '}
					<Link href="/tos" passHref>
						<a target="_blank">
							<span className="text-blue-600 underline font-[500]"> www.superdentals.com/tos </span>
						</a>
					</Link>
					{t('section.link-text-2')}
				</p>
				<p className="flex flex-col gap-1">
					<span className="font-[600]">{t('section.title-2')}</span>
					<span>{t('section.text-5')}</span>
				</p>

				<p className="flex flex-col gap-1">
					<span className="font-[600]">{t('section.title-3')}</span>
					<span>{t('section.text-6')}</span>
				</p>
				<p className="flex flex-col gap-1">
					<span className="font-[600]">{t('section.title-4')}</span>
					<span>{t('section.text-7')}</span>
				</p>
				<p className="flex flex-col gap-1">
					<span className="font-[600]">{t('section.title-5')}</span>
					<span>{t('section.text-8')}</span>
				</p>
				<p>{t('section.text-9')}</p>
				<p>{t('section.text-10')}</p>
				<div className="flex flex-col gap-1">
					<span className="font-[600]">{t('section.title-6')}</span>
					<div className="flex flex-col gap-1 ml-6">
						<span>-{t('section.text-11')}</span>
						<span>{t('section.reason-1')}</span>
						<span>{t('section.reason-2')}</span>
						<span>{t('section.reason-3')}</span>
						<span>{t('section.reason-4')}</span>
					</div>
					<span>{t('section.text-12')}</span>
				</div>
				<p className="flex flex-col gap-1">
					<span className="font-[600]">{t('section.title-7')}</span>
					<span>{t('section.text-13')}</span>
				</p>
				<p className="flex flex-col gap-1">
					<span className="font-[600]">{t('section.title-8')}</span>
					<span>{t('section.text-14')}</span>
				</p>
				<p className="flex flex-col gap-1">
					<span className="font-[600]">{t('section.title-9')}</span>
					<span>{t('section.text-15')}</span>
				</p>

				<p className="flex flex-col gap-1">
					<span className="font-[600]">{t('section.title-10')}</span>
					<span>{t('section.text-16')}</span>
				</p>
				<p className="flex flex-col gap-1">
					<span className="font-[600]">{t('section.contact')}</span>
					<span>{t('section.contactus')}</span>
				</p>
				<p className="flex flex-col gap-1">
					<span>{t('section.footer-1')}</span>
					<span>{t('section.footer-2')}</span>
					<span>{t('section.footer-3')}</span>
				</p>
				<p className="flex flex-col gap-1">
					<span>{t('section.footer-4')}</span>
					<span>{t('section.footer-5')}</span>
				</p>
			</section>

			<Footer />
		</div>
	);
};

export default TermsOfUse;
