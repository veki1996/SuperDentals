import { useState } from 'react';
import DescriptionModal from './DescriptionModal';
import { useAtom } from 'jotai';
import {
	rsDescriptionAtom,
	baDescriptionAtom,
	hrDescriptionAtom,
	meDescriptionAtom,
	siDescriptionAtom,
	gbDescriptionAtom,
	deDescriptionAtom,
	itDescriptionAtom,
} from '/store';
import Image from 'next/image';

const DescriptionModals = ({ type }) => {
	const [toggleModal, setToggleModal] = useState();
	const [rsDescription, setRsDescription] = useAtom(rsDescriptionAtom);
	const [baDescription, setBaDescription] = useAtom(baDescriptionAtom);
	const [hrDescription, setHrDescription] = useAtom(hrDescriptionAtom);
	const [meDescription, setMeDescription] = useAtom(meDescriptionAtom);
	const [siDescription, setSiDescription] = useAtom(siDescriptionAtom);
	const [gbDescription, setGbDescription] = useAtom(gbDescriptionAtom);
	const [deDescription, setDeDescription] = useAtom(deDescriptionAtom);
	const [itDescription, setItDescription] = useAtom(itDescriptionAtom);

	return (
		<div>
			<div className="flex justify-center">
				<div className="grid grid-cols-4 xl:grid-cols-8 gap-6 bg-slate-100 p-3 rounded-[8px]">
					<div
						onClick={() => setToggleModal('rs')}
						className={`h-[23px] w-[40px] relative cursor-pointer  hover:grayscale-0 hover:scale-110 transition-all ${
							rsDescription && rsDescription !== '<p><br></p>' ? 'grayscale-0 scale-110' : 'grayscale-[90%]'
						}`}
					>
						<Image src="/country-flags/srb.svg" alt="Srbija" objectFit="cover" layout="fill" />
					</div>
					<div
						onClick={() => setToggleModal('ba')}
						className={`h-[23px] w-[40px] relative cursor-pointer  hover:grayscale-0 hover:scale-110 transition-all ${
							baDescription && baDescription !== '<p><br></p>' ? 'grayscale-0 scale-110' : 'grayscale-[90%]'
						}`}
					>
						<Image src="/country-flags/bih.svg" alt="Bosna I Hercegovina" objectFit="cover" layout="fill" />
					</div>
					<div
						onClick={() => setToggleModal('hr')}
						className={`h-[23px] w-[40px] relative cursor-pointer  hover:grayscale-0 hover:scale-110 transition-all ${
							hrDescription && hrDescription !== '<p><br></p>' ? 'grayscale-0 scale-110' : 'grayscale-[90%]'
						}`}
					>
						<Image src="/country-flags/cro.svg" alt="Hrvatska" objectFit="cover" layout="fill" />
					</div>
					<div
						onClick={() => setToggleModal('me')}
						className={`h-[23px] w-[40px] relative cursor-pointer  hover:grayscale-0 hover:scale-110 transition-all ${
							meDescription && meDescription !== '<p><br></p>' ? 'grayscale-0 scale-110' : 'grayscale-[90%]'
						}`}
					>
						<Image src="/country-flags/mne.svg" alt="Crna Gora" objectFit="cover" layout="fill" />
					</div>
					<div
						onClick={() => setToggleModal('si')}
						className={`h-[23px] w-[40px] relative cursor-pointer  hover:grayscale-0 hover:scale-110 transition-all ${
							siDescription && siDescription !== '<p><br></p>' ? 'grayscale-0 scale-110' : 'grayscale-[90%]'
						}`}
					>
						<Image src="/country-flags/slo.svg" alt="Slovenija" objectFit="cover" layout="fill" />
					</div>
					<div
						onClick={() => setToggleModal('gb')}
						className={`h-[23px] w-[40px] relative cursor-pointer  hover:grayscale-0 hover:scale-110 transition-all ${
							gbDescription && gbDescription !== '<p><br></p>' ? 'grayscale-0 scale-110' : 'grayscale-[90%]'
						}`}
					>
						<Image src="/country-flags/uk.svg" alt="Engleska" objectFit="cover" layout="fill" />
					</div>
					<div
						onClick={() => setToggleModal('de')}
						className={`h-[23px] w-[40px] relative cursor-pointer  hover:grayscale-0 hover:scale-110 transition-all ${
							deDescription && deDescription !== '<p><br></p>' ? 'grayscale-0 scale-110' : 'grayscale-[90%]'
						}`}
					>
						<Image src="/country-flags/de.svg" alt="Njemačka" objectFit="cover" layout="fill" />
					</div>
					<div
						onClick={() => setToggleModal('it')}
						className={`h-[23px] w-[40px] relative cursor-pointer  hover:grayscale-0 hover:scale-110 transition-all ${
							itDescription && itDescription !== '<p><br></p>' ? 'grayscale-0 scale-110' : 'grayscale-[90%]'
						}`}
					>
						<Image src="/country-flags/it.svg" alt="Italija" objectFit="cover" layout="fill" />
					</div>
				</div>
			</div>
			{toggleModal === 'ba' && (
				<DescriptionModal
					toggleModal={toggleModal}
					setToggleModal={setToggleModal}
					description={baDescription}
					setDescription={setBaDescription}
					type={type}
				/>
			)}
			{toggleModal === 'rs' && (
				<DescriptionModal
					toggleModal={toggleModal}
					setToggleModal={setToggleModal}
					description={rsDescription}
					setDescription={setRsDescription}
					type={type}
				/>
			)}
			{toggleModal === 'hr' && (
				<DescriptionModal
					toggleModal={toggleModal}
					setToggleModal={setToggleModal}
					description={hrDescription}
					setDescription={setHrDescription}
					type={type}
				/>
			)}
			{toggleModal === 'me' && (
				<DescriptionModal
					toggleModal={toggleModal}
					setToggleModal={setToggleModal}
					description={meDescription}
					setDescription={setMeDescription}
					type={type}
				/>
			)}
			{toggleModal === 'si' && (
				<DescriptionModal
					toggleModal={toggleModal}
					setToggleModal={setToggleModal}
					description={siDescription}
					setDescription={setSiDescription}
					type={type}
				/>
			)}
			{toggleModal === 'gb' && (
				<DescriptionModal
					toggleModal={toggleModal}
					setToggleModal={setToggleModal}
					description={gbDescription}
					setDescription={setGbDescription}
					type={type}
				/>
			)}
			{toggleModal === 'de' && (
				<DescriptionModal
					toggleModal={toggleModal}
					setToggleModal={setToggleModal}
					description={deDescription}
					setDescription={setDeDescription}
					type={type}
				/>
			)}
			{toggleModal === 'it' && (
				<DescriptionModal
					toggleModal={toggleModal}
					setToggleModal={setToggleModal}
					description={itDescription}
					setDescription={setItDescription}
					type={type}
				/>
			)}
		</div>
	);
};

export default DescriptionModals;
