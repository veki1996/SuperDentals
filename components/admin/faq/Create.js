import { useAtom } from 'jotai';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import AnswerModal from './AnswerModal';
import QuestionModal from './QuestionModal';
import {
	rsQuestionAtom,
	baQuestionAtom,
	hrQuestionAtom,
	meQuestionAtom,
	siQuestionAtom,
	gbQuestionAtom,
	deQuestionAtom,
	itQuestionAtom,
	rsAnswerAtom,
	baAnswerAtom,
	hrAnswerAtom,
	meAnswerAtom,
	siAnswerAtom,
	gbAnswerAtom,
	deAnswerAtom,
	itAnswerAtom,
} from '/store';

const Create = ({ modal }) => {
	const router = useRouter();

	const [errorQuestion, setErrorQuestion] = useState();
	const [errorAnswer, setErrorAnswer] = useState();
	const [toggleModal, setToggleModal] = useState();

	// Atoms
	const [rsQuestion, setRsQuestion] = useAtom(rsQuestionAtom);
	const [baQuestion, setBaQuestion] = useAtom(baQuestionAtom);
	const [hrQuestion, setHrQuestion] = useAtom(hrQuestionAtom);
	const [meQuestion, setMeQuestion] = useAtom(meQuestionAtom);
	const [siQuestion, setSiQuestion] = useAtom(siQuestionAtom);
	const [gbQuestion, setGbQuestion] = useAtom(gbQuestionAtom);
	const [deQuestion, setDeQuestion] = useAtom(deQuestionAtom);
	const [itQuestion, setItQuestion] = useAtom(itQuestionAtom);

	const [rsAnswer, setRsAnswer] = useAtom(rsAnswerAtom);
	const [baAnswer, setBaAnswer] = useAtom(baAnswerAtom);
	const [hrAnswer, setHrAnswer] = useAtom(hrAnswerAtom);
	const [meAnswer, setMeAnswer] = useAtom(meAnswerAtom);
	const [siAnswer, setSiAnswer] = useAtom(siAnswerAtom);
	const [gbAnswer, setGbAnswer] = useAtom(gbAnswerAtom);
	const [deAnswer, setDeAnswer] = useAtom(deAnswerAtom);
	const [itAnswer, setItAnswer] = useAtom(itAnswerAtom);

	const flags = [
		{
			country: 'rs',
			image: 'srb',
			question: rsQuestion,
			setQuestion: setRsQuestion,
			answer: rsAnswer,
			setAnswer: setRsAnswer,
		},
		{
			country: 'ba',
			image: 'bih',
			question: baQuestion,
			setQuestion: setBaQuestion,
			answer: baAnswer,
			setAnswer: setBaAnswer,
		},
		{
			country: 'hr',
			image: 'cro',
			question: hrQuestion,
			setQuestion: setHrQuestion,
			answer: hrAnswer,
			setAnswer: setHrAnswer,
		},
		{
			country: 'me',
			image: 'mne',
			question: meQuestion,
			setQuestion: setMeQuestion,
			answer: meAnswer,
			setAnswer: setMeAnswer,
		},
		{
			country: 'si',
			image: 'slo',
			question: siQuestion,
			setQuestion: setSiQuestion,
			answer: siAnswer,
			setAnswer: setSiAnswer,
		},
		{
			country: 'gb',
			image: 'uk',
			question: gbQuestion,
			setQuestion: setGbQuestion,
			answer: gbAnswer,
			setAnswer: setGbAnswer,
		},
		{
			country: 'de',
			image: 'de',
			question: deQuestion,
			setQuestion: setDeQuestion,
			answer: deAnswer,
			setAnswer: setDeAnswer,
		},
		{
			country: 'it',
			image: 'it',
			question: itQuestion,
			setQuestion: setItQuestion,
			answer: itAnswer,
			setAnswer: setItAnswer,
		},
	];

	// Use Form instance
	const { handleSubmit } = useForm({
		defaultValues: {},
		mode: 'onChange',
		reValidateMode: 'onChange',
	});

	const handleSubmitFAQ = async (data) => {
		if (gbQuestion === '' || gbQuestion === '<p><br></p>') {
			setToggleModal('gb');
			setErrorQuestion('English Question is required.');
			return;
		}
		setErrorQuestion('');
		if (gbAnswer === '' || gbAnswer === '<p><br></p>') {
			setToggleModal('gb');
			setErrorAnswer('English Answer is required.');
			return;
		}
		setErrorAnswer('');
		data.questions = {
			rs: rsQuestion,
			ba: baQuestion,
			hr: hrQuestion,
			me: meQuestion,
			si: siQuestion,
			gb: gbQuestion,
			de: deQuestion,
			it: itQuestion,
		};
		data.answers = {
			rs: rsAnswer,
			ba: baAnswer,
			hr: hrAnswer,
			me: meAnswer,
			si: siAnswer,
			gb: gbAnswer,
			de: deAnswer,
			it: itAnswer,
		};

		const response = await fetch('/api/admin/faq/create', {
			body: JSON.stringify(data),
			method: 'POST',
			headers: {
				'Content-type': 'application/json',
			},
		});

		if (response.status === 201) {
			modal(false);
			router.replace(router.asPath);
		}
	};

	useEffect(() => {
		setRsQuestion('');
		setBaQuestion('');
		setHrQuestion('');
		setMeQuestion('');
		setSiQuestion('');
		setGbQuestion('');
		setDeQuestion('');
		setItQuestion('');
		setRsAnswer('');
		setBaAnswer('');
		setHrAnswer('');
		setMeAnswer('');
		setSiAnswer('');
		setGbAnswer('');
		setDeAnswer('');
		setItAnswer('');
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [modal]);
	return (
		<div>
			<form className="max-w-[600px] m-auto" onSubmit={handleSubmit(handleSubmitFAQ)}>
				<label className="label-text">Add questions and answers</label>
				<div className="flex justify-center">
					<div className="grid grid-cols-4 xl:grid-cols-8 gap-6 bg-slate-100 p-3 rounded-[8px]">
						{flags?.map((flag) => (
							<div
								key={flag?.country}
								onClick={() => setToggleModal(flag?.country)}
								className={`h-[20px] w-[37px] relative cursor-pointer  hover:grayscale-0 hover:scale-110 transition-all ${
									flag?.question && flag?.question !== '<p><br></p>' && flag?.answer && flag?.answer !== '<p><br></p>'
										? 'grayscale-0 scale-110'
										: 'grayscale-[90%]'
								}`}
							>
								<Image src={`/country-flags/${flag?.image}.svg`} alt={flag?.country} objectFit="cover" layout="fill" />
							</div>
						))}
					</div>
				</div>
				<div className="my-5">
					{flags?.map(
						(flag) =>
							toggleModal === flag?.country && (
								<QuestionModal
									key={flag?.country}
									toggleModal={toggleModal}
									question={flag?.question}
									setQuestion={flag?.setQuestion}
								/>
							),
					)}
				</div>
				{errorQuestion && (
					<div className="flex items-center gap-1">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							className="stroke-current flex-shrink-0 h-6 w-6 text-red-600"
							fill="none"
							viewBox="0 0 24 24"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth="2"
								d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
							/>
						</svg>
						<span>{errorQuestion}</span>
					</div>
				)}
				<div className="my-5">
					{flags?.map(
						(flag) =>
							toggleModal === flag?.country && (
								<AnswerModal
									key={flag?.country}
									toggleModal={toggleModal}
									answer={flag?.answer}
									setAnswer={flag?.setAnswer}
								/>
							),
					)}
				</div>
				{errorAnswer && (
					<div className="flex items-center gap-1 mb-2">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							className="stroke-current flex-shrink-0 h-6 w-6 text-red-600"
							fill="none"
							viewBox="0 0 24 24"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth="2"
								d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
							/>
						</svg>
						<span>{errorAnswer}</span>
					</div>
				)}
				<button className="btn btn-block btn-primary my-5">Add FAQ</button>
			</form>
		</div>
	);
};

export default Create;
