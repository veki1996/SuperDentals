import { useForm } from 'react-hook-form';

const SecondStep = ({ setSecondStep, setThirdStep, setDescriptionsData }) => {
	// Use Form instance
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm({
		defaultValues: {},
		mode: 'onChange',
		reValidateMode: 'onChange',
	});

	const handleSubmitSecondStep = async (data) => {
		setDescriptionsData(data);
		setSecondStep(false);
		setThirdStep(true);
	};
	return (
		<>
			<form
				className="relative flex flex-col w-full bg-white outline-none focus:outline-none"
				onSubmit={handleSubmit(handleSubmitSecondStep)}
			>
				<div className="relative p-6 flex-auto">
					<label className="label-text">Serbian Description</label>
					<textarea
						className="input input-bordered p-3 w-full my-2 max-h-[250px] h-20"
						type="text"
						{...register('descriptionSerbia')}
						placeholder="Serbian Description..."
					/>

					<label className="label-text">Bosnian Description</label>
					<textarea
						className="input input-bordered p-3 w-full my-2 max-h-[250px] h-20"
						type="text"
						{...register('descriptionBosnia')}
						placeholder="Bosnian Description..."
					/>

					<label className="label-text">Croatian Description</label>
					<textarea
						className="input input-bordered p-3 w-full my-2 max-h-[250px] h-20"
						type="text"
						{...register('descriptionCroatia')}
						placeholder="Croatian Description..."
					/>

					<label className="label-text">Montenegrin Description</label>
					<textarea
						className="input input-bordered p-3 w-full my-2 max-h-[250px] h-20"
						type="text"
						{...register('descriptionMontenegro')}
						placeholder="Montenegrin Description..."
					/>

					<label className="label-text">Slovenian Description</label>
					<textarea
						className="input input-bordered p-3 w-full my-2 max-h-[250px] h-20"
						type="text"
						{...register('descriptionSlovenia')}
						placeholder="Slovenian Description..."
					/>

					<label className="label-text">English Description</label>
					<textarea
						className="input input-bordered p-3 w-full my-2 max-h-[250px] h-20"
						type="text"
						{...register('descriptionEnglish', {
							required: 'Description is required.',
						})}
						placeholder="English Description..."
					/>
					{errors.descriptionEnglish?.message && (
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
							<span>{errors.descriptionEnglish?.message}</span>
						</div>
					)}
					<label className="label-text">German Description</label>
					<textarea
						className="input input-bordered p-3 w-full my-2 max-h-[250px] h-20"
						type="text"
						{...register('descriptionGermany')}
						placeholder="German Description..."
					/>

					<label className="label-text">Italian Description</label>
					<textarea
						className="input input-bordered p-3 w-full my-2 max-h-[250px] h-20"
						type="text"
						{...register('descriptionItalia')}
						placeholder="Italian Description..."
					/>
				</div>

				<div className="flex items-center justify-end p-6">
					<button
						className="text-primaryColor background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
						type="submit"
					>
						Next step
					</button>
				</div>
			</form>
		</>
	);
};

export default SecondStep;
