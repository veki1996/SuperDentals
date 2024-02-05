import { useAtom } from 'jotai';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import TextModal from './TextModal';
import PositionModal from './PositionModal';
import HeadingModal from './HeadingModal';
import {
	rsHeadingAtom,
	baHeadingAtom,
	hrHeadingAtom,
	meHeadingAtom,
	siHeadingAtom,
	gbHeadingAtom,
	deHeadingAtom,
	itHeadingAtom,
	rsTextAtom,
	baTextAtom,
	hrTextAtom,
	meTextAtom,
	siTextAtom,
	gbTextAtom,
	deTextAtom,
	itTextAtom,
	rsPositionAtom,
	baPositionAtom,
	hrPositionAtom,
	mePositionAtom,
	siPositionAtom,
	gbPositionAtom,
	dePositionAtom,
	itPositionAtom,
} from '/store';
import Image from 'next/image';

const Create = ({ modal }) => {
	const router = useRouter();

	const [errorHeading, setErrorHeading] = useState();
	const [errorText, setErrorText] = useState();
	const [errorPosition, setErrorPosition] = useState();
	const [toggleModal, setToggleModal] = useState();

	// Atoms
	const [rsHeading, setRsHeading] = useAtom(rsHeadingAtom);
	const [baHeading, setBaHeading] = useAtom(baHeadingAtom);
	const [hrHeading, setHrHeading] = useAtom(hrHeadingAtom);
	const [meHeading, setMeHeading] = useAtom(meHeadingAtom);
	const [siHeading, setSiHeading] = useAtom(siHeadingAtom);
	const [gbHeading, setGbHeading] = useAtom(gbHeadingAtom);
	const [deHeading, setDeHeading] = useAtom(deHeadingAtom);
	const [itHeading, setItHeading] = useAtom(itHeadingAtom);

	const [rsText, setRsText] = useAtom(rsTextAtom);
	const [baText, setBaText] = useAtom(baTextAtom);
	const [hrText, setHrText] = useAtom(hrTextAtom);
	const [meText, setMeText] = useAtom(meTextAtom);
	const [siText, setSiText] = useAtom(siTextAtom);
	const [gbText, setGbText] = useAtom(gbTextAtom);
	const [deText, setDeText] = useAtom(deTextAtom);
	const [itText, setItText] = useAtom(itTextAtom);

	const [rsPosition, setRsPosition] = useAtom(rsPositionAtom);
	const [baPosition, setBaPosition] = useAtom(baPositionAtom);
	const [hrPosition, setHrPosition] = useAtom(hrPositionAtom);
	const [mePosition, setMePosition] = useAtom(mePositionAtom);
	const [siPosition, setSiPosition] = useAtom(siPositionAtom);
	const [gbPosition, setGbPosition] = useAtom(gbPositionAtom);
	const [dePosition, setDePosition] = useAtom(dePositionAtom);
	const [itPosition, setItPosition] = useAtom(itPositionAtom);

	const flags = [
		{
			country: 'rs',
			image: 'srb',
			heading: rsHeading,
			setHeading: setRsHeading,
			text: rsText,
			setText: setRsText,
			position: rsPosition,
			setPosition: setRsPosition,
		},
		{
			country: 'ba',
			image: 'bih',
			heading: baHeading,
			setHeading: setBaHeading,
			text: baText,
			setText: setBaText,
			position: baPosition,
			setPosition: setBaPosition,
		},
		{
			country: 'hr',
			image: 'cro',
			heading: hrHeading,
			setHeading: setHrHeading,
			text: hrText,
			setText: setHrText,
			position: hrPosition,
			setPosition: setHrPosition,
		},
		{
			country: 'me',
			image: 'mne',
			heading: meHeading,
			setHeading: setMeHeading,
			text: meText,
			setText: setMeText,
			position: mePosition,
			setPosition: setMePosition,
		},
		{
			country: 'si',
			image: 'slo',
			heading: siHeading,
			setHeading: setSiHeading,
			text: siText,
			setText: setSiText,
			position: siPosition,
			setPosition: setSiPosition,
		},
		{
			country: 'gb',
			image: 'uk',
			heading: gbHeading,
			setHeading: setGbHeading,
			text: gbText,
			setText: setGbText,
			position: gbPosition,
			setPosition: setGbPosition,
		},
		{
			country: 'de',
			image: 'de',
			heading: deHeading,
			setHeading: setDeHeading,
			text: deText,
			setText: setDeText,
			position: dePosition,
			setPosition: setDePosition,
		},
		{
			country: 'it',
			image: 'it',
			heading: itHeading,
			setHeading: setItHeading,
			text: itText,
			setText: setItText,
			position: itPosition,
			setPosition: setItPosition,
		},
	];

	// Use Form instance
	const { handleSubmit } = useForm({
		mode: 'onChange',
		reValidateMode: 'onChange',
	});

	const handleSubmitFAQ = async (data) => {
		if (gbHeading === '' || gbHeading === '<p><br></p>') {
			setToggleModal('gb');
			setErrorHeading('English Heading is required.');
			return;
		}
		setErrorHeading('');
		if (gbText === '' || gbText === '<p><br></p>') {
			setToggleModal('gb');

			setErrorText('English Text is required.');
			return;
		}
		setErrorText('');
		if (gbPosition === '' || gbPosition === '<p><br></p>') {
			setToggleModal('gb');

			setErrorPosition('English Position is required.');
			return;
		}
		setErrorPosition('');
		data.headings = {
			rs: rsHeading,
			ba: baHeading,
			hr: hrHeading,
			me: meHeading,
			si: siHeading,
			gb: gbHeading,
			de: deHeading,
			it: itHeading,
		};
		data.descriptions = {
			rs: rsText,
			ba: baText,
			hr: hrText,
			me: meText,
			si: siText,
			gb: gbText,
			de: deText,
			it: itText,
		};
		data.positions = {
			rs: rsPosition,
			ba: baPosition,
			hr: hrPosition,
			me: mePosition,
			si: siPosition,
			gb: gbPosition,
			de: dePosition,
			it: itPosition,
		};

		const response = await fetch('/api/admin/lexicon/create', {
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
		setRsHeading('');
		setBaHeading('');
		setHrHeading('');
		setMeHeading('');
		setSiHeading('');
		setGbHeading('');
		setDeHeading('');
		setItHeading('');
		setRsText('');
		setBaText('');
		setHrText('');
		setMeText('');
		setSiText('');
		setGbText('');
		setDeText('');
		setItText('');
		setRsPosition('');
		setBaPosition('');
		setHrPosition('');
		setMePosition('');
		setSiPosition('');
		setGbPosition('');
		setDePosition('');
		setItPosition('');
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [modal]);
	return (
		<div>
			<form className="max-w-[600px] m-auto" onSubmit={handleSubmit(handleSubmitFAQ)}>
				<label className="label-text">Add Headings & Descriptions & Position</label>
				<div className="flex justify-center">
					<div className="grid grid-cols-4 xl:grid-cols-8 gap-6 bg-slate-100 p-3 rounded-[8px]">
						{flags?.map((flag) => (
							<div
								key={flag?.country}
								onClick={() => setToggleModal(flag?.country)}
								className={`h-[20px] w-[37px] relative cursor-pointer  hover:grayscale-0 hover:scale-110 transition-all ${
									flag?.heading &&
									flag?.heading !== '<p><br></p>' &&
									flag?.text &&
									flag?.text !== '<p><br></p>' &&
									flag?.position &&
									flag?.position !== '<p><br></p>'
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
								<HeadingModal
									key={flag?.country}
									toggleModal={toggleModal}
									heading={flag?.heading}
									setHeading={flag?.setHeading}
								/>
							),
					)}
				</div>
				{errorHeading && (
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
						<span>{errorHeading}</span>
					</div>
				)}
				{flags?.map(
					(flag) =>
						toggleModal === flag?.country && (
							<TextModal key={flag?.country} toggleModal={toggleModal} text={flag?.text} setText={flag?.setText} />
						),
				)}

				{errorText && (
					<div className="flex items-center gap-1 mb-2 mt-6">
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
						<span>{errorText}</span>
					</div>
				)}
				{flags?.map(
					(flag) =>
						toggleModal === flag?.country && (
							<PositionModal
								key={flag?.country}
								toggleModal={toggleModal}
								position={flag?.position}
								setPosition={flag?.setPosition}
							/>
						),
				)}

				{errorPosition && (
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
						<span>{errorPosition}</span>
					</div>
				)}
				<button className="btn btn-block btn-primary mb-5">Add Lexicon element</button>
			</form>
		</div>
	);
};

export default Create;
