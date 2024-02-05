import { Quill } from '/components';

const TextModal = ({ toggleModal, text, setText }) => {
	return (
		<>
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
							<Quill styles="h-[350px]" value={text} setDescription={setText} />
						</div>
						{/*footer*/}
					</div>
				</div>
			</div>
		</>
	);
};

export default TextModal;
