import { useRouter } from 'next/router';
import { getFAQ } from '/utils/utils';
import { Accordion } from '/components';

const AccordionAnswer = ({ faqs }) => {
	const router = useRouter();
	const { locale } = router;

	return (
		<div className="flex flex-col gap-5 container mx-auto md:p-10 rounded-[7px]">
			{faqs.map((faq) => (
				<Accordion
					key={faq?.id}
					question={getFAQ(faq?.question, locale, 'question', true)}
					answer={getFAQ(faq?.answer, locale, 'answer', true)}
				/>
			))}
		</div>
	);
};

export default AccordionAnswer;
