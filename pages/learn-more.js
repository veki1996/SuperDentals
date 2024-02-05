import { useState } from 'react';
import { HeadMeta, Nav, Footer, AccordionAnswer, QuillReader } from '/components';
import useTranslation from 'next-translate/useTranslation';
import { prisma } from '/utils/db';
import { getLexicon } from '/utils/utils';
import { useRouter } from 'next/router';

const letters = [
	'A',
	'B',
	'C',
	'D',
	'E',
	'F',
	'G',
	'H',
	'I',
	'J',
	'K',
	'L',
	'M',
	'N',
	'O',
	'P',
	'R',
	'S',
	'T',
	'U',
	'V',
	'W',
	'X',
	'Y',
	'Z',
	'#',
];

const LearnMore = ({ faqs, lexicon }) => {
	const { t } = useTranslation('learn-more');
	const router = useRouter();
	const { locale } = router;

	const [lexiconLetter, setLexiconLetter] = useState('A');
	const [currentOpen, setCurrentOpen] = useState('Lexicon');

	return (
		<div>
			<HeadMeta
				title="Saznajte Više"
				link={`${process.env.BASE_URL}/learn-more`}
				content={'superdentals.com'}
				description="Tražite stomatologa po svojoj mjeri? Na pravom ste mjestu."
				image={`${process.env.BASE_URL}/images/logo.jpg`}
			/>
			<Nav />
			<section className="min-h-[calc(100vh-(181px*2))] container mx-auto px-6 md:px-16 py-10 flex flex-col lg:flex-row gap-10">
				<div className="basis-[25%]">
					<div className="flex flex-col gap-4 mb-5">
						<h1
							className={`cursor-pointer font-[700] text-[24px] ${
								currentOpen === 'FAQ' ? 'text-primaryColor' : 'text-[#21231E]'
							}`}
							onClick={() => setCurrentOpen('FAQ')}
						>
							FAQ
						</h1>
					</div>
					<div className="flex flex-col gap-6">
						<h1
							className={`cursor-pointer font-[700]  text-[24px] ${
								currentOpen === 'Lexicon' ? 'text-primaryColor' : 'text-[#21231E]'
							}`}
							onClick={() => setCurrentOpen('Lexicon')}
						>
							{t('dental-lexicon.heading')}
						</h1>
						{currentOpen === 'Lexicon' && (
							<div className="flex flex-col gap-6">
								<div className="flex flex-wrap justify-center lg:grid  lg:grid-cols-lexicon bg-[#F1F1F1] px p-2 lg:p-8 rounded-[16px] shadow-lexicon gap-4">
									{letters?.map((letter) => (
										<div
											key={letter}
											onClick={() => setLexiconLetter(letter)}
											className={`bg-white cursor-pointer rounded-[8px] w-[48px] h-[48px] font-[700] text-[21231E] flex justify-center items-center text-[24px] ${
												lexiconLetter === letter ? 'text-primaryColor' : 'text-black'
											}`}
										>
											{letter}
										</div>
									))}
								</div>
							</div>
						)}
					</div>
				</div>
				<div className="basis-[75%]">
					{currentOpen === 'FAQ' && (
						<p className="md:px-10 mb-5 md:mb-0 font-bold text-center">
							{t('faq.text-1')}{' '}
							<a className="text-primaryColor font-bold" href="mailto:info@superdentals.com">
								info@superdentals.com
							</a>
							. {t('faq.text-2')}
						</p>
					)}
					{currentOpen === 'FAQ' && (
						<div className="flex flex-col gap-5">
							<AccordionAnswer faqs={faqs} />
						</div>
					)}
					{currentOpen === 'Lexicon' && (
						<div>
							<div className="mb-5 font-bold text-center">
								<p className="text-[#21231E]">{t('dental-lexicon.text-1')}</p>
								<p className="text-[#21231E]">
									{t('dental-lexicon.text-2')}{' '}
									<a className="text-primaryColor font-bold" href="mailto:info@superdentals.com">
										info@superdentals.com
									</a>{' '}
									{t('dental-lexicon.text-3')}
								</p>
							</div>
							{lexicon
								?.filter((el) => getLexicon(el?.position, locale, 'position', true) === lexiconLetter)
								?.map((el) => (
									<div className="flex flex-col" key={el?.id}>
										<h1 className="text-[#21231E] font-[700] text-[24px] mt-10">
											<QuillReader description={getLexicon(el?.heading, locale, 'heading', true)} />
										</h1>
										<div className="text-[20px]">
											<QuillReader description={getLexicon(el?.description, locale, 'description', true)} />
										</div>
									</div>
								))}
						</div>
					)}
				</div>
			</section>
			<Footer />
		</div>
	);
};

export default LearnMore;

export async function getServerSideProps() {
	const faqs = await prisma.faq.findMany({
		orderBy: {
			createdAt: 'asc',
		},
	});

	const lexicon = await prisma.lexicon.findMany({
		orderBy: {
			createdAt: 'desc',
		},
	});

	return {
		props: {
			faqs,
			lexicon,
		},
	};
}
