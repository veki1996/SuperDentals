import Image from 'next/image';
import { Quill } from '/components';

const DescriptionModal = ({ toggleModal, setToggleModal, description, setDescription, type }) => {
	return (
		<>
			{type === 'admin' ? (
				<div className={`${toggleModal ? 'block' : 'hidden'}`}>
					<div className="mt-5 justify-center items-center flex">
						{/*content*/}
						<div className="relative flex flex-col w-full ">
							{/*header*/}
							<div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
								<h3 className="text-3xl font-semibold">
									Description on{' '}
									{toggleModal === 'rs'
										? 'serbian'
										: toggleModal === 'ba'
										? 'bosnian'
										: toggleModal === 'hr'
										? 'croatian'
										: toggleModal === 'me'
										? 'montenegrin'
										: toggleModal === 'si'
										? 'slovenian'
										: toggleModal === 'gb'
										? 'english'
										: toggleModal === 'de'
										? 'german'
										: 'italian'}
								</h3>
							</div>
							{/*body*/}
							<div className="relative p-6 flex-auto">
								<Quill styles="h-[350px]" value={description} setDescription={setDescription} />
							</div>
							{/*footer*/}
							<div className="flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b">
								<button
									className="text-primaryColor background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
									type="button"
									onClick={() => setToggleModal()}
								>
									Close description
								</button>
							</div>
						</div>
					</div>
				</div>
			) : (
				<div className={`${toggleModal ? 'block' : 'hidden'}`}>
					<div className="justify-center items-center  overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none flex">
						<div className="relative my-6 w-10/12 md:w-5/12 mx-auto max-w-3xl">
							{/*content*/}
							<div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
								{/*header*/}
								<div className="flex items-center gap-2 p-5 border-b border-solid border-slate-200 rounded-t">
									<h3 className="text-3xl font-semibold uppercase">{toggleModal}</h3>
									{toggleModal === 'rs' && (
										<div className={`h-[23px] w-[40px] relative`}>
											<Image src="/country-flags/srb.svg" alt="Srbija" objectFit="cover" layout="fill" />
										</div>
									)}
									{toggleModal === 'ba' && (
										<div className={`h-[23px] w-[40px] relative`}>
											<Image src="/country-flags/bih.svg" alt="Bosna I Hercegovina" objectFit="cover" layout="fill" />
										</div>
									)}
									{toggleModal === 'hr' && (
										<div className={`h-[23px] w-[40px] relative`}>
											<Image src="/country-flags/cro.svg" alt="Hrvatska" objectFit="cover" layout="fill" />
										</div>
									)}
									{toggleModal === 'me' && (
										<div className={`h-[23px] w-[40px] relative`}>
											<Image src="/country-flags/mne.svg" alt="Crna Gora" objectFit="cover" layout="fill" />
										</div>
									)}
									{toggleModal === 'gb' && (
										<div className={`h-[23px] w-[40px] relative`}>
											<Image src="/country-flags/uk.svg" alt="Engleska" objectFit="cover" layout="fill" />
										</div>
									)}
									{toggleModal === 'si' && (
										<div className={`h-[23px] w-[40px] relative`}>
											<Image src="/country-flags/slo.svg" alt="Slovenija" objectFit="cover" layout="fill" />
										</div>
									)}
									{toggleModal === 'de' && (
										<div className={`h-[23px] w-[40px] relative`}>
											<Image src="/country-flags/de.svg" alt="Njemačka" objectFit="cover" layout="fill" />
										</div>
									)}
									{toggleModal === 'it' && (
										<div className={`h-[23px] w-[40px] relative`}>
											<Image src="/country-flags/it.svg" alt="Italija" objectFit="cover" layout="fill" />
										</div>
									)}
								</div>
								{/*body*/}
								<div className="relative p-6 flex-auto">
									<Quill styles="h-[350px]" value={description} setDescription={setDescription} />
								</div>
								{/*footer*/}
								<div className="mt-12 sm:mt-4 lg:mt-0 flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b">
									<button
										className="text-primaryColor background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
										type="button"
										onClick={() => setToggleModal()}
									>
										Sačuvaj
									</button>
								</div>
							</div>
						</div>
					</div>
					<div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
				</div>
			)}
		</>
	);
};

export default DescriptionModal;
