import { useForm } from 'react-hook-form';

const FirstStep = ({ setFirstStep, setSecondStep, setNamesData }) => {
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

	const handleSubmitFirstStep = async (data) => {
		setNamesData(data);
		setFirstStep(false);
		setSecondStep(true);
	};
	return (
		<>
			<form
				className="relative flex flex-col w-full bg-white outline-none focus:outline-none"
				onSubmit={handleSubmit(handleSubmitFirstStep)}
			>
				<div className="relative p-6 flex-auto">
					<label className="label-text">Serbian Name</label>
					<input
						className="input input-bordered p-3 w-full my-2"
						name="nameSerbia"
						{...register('nameSerbia')}
						type="text"
						placeholder="Serbian Name"
					/>

					<label className="label-text">Bosnian Name</label>
					<input
						className="input input-bordered p-3 w-full my-2"
						name="nameBosnia"
						{...register('nameBosnia')}
						type="text"
						placeholder="Bosnian Name"
					/>

					<label className="label-text">Croatian Name</label>
					<input
						className="input input-bordered p-3 w-full my-2"
						name="nameCroatia"
						{...register('nameCroatia')}
						type="text"
						placeholder="Croatian Name"
					/>

					<label className="label-text">Montenegrin Name</label>
					<input
						className="input input-bordered p-3 w-full my-2"
						name="nameMontenegro"
						{...register('nameMontenegro')}
						type="text"
						placeholder="Montenegrin Name"
					/>

					<label className="label-text">Slovenian Name</label>
					<input
						className="input input-bordered p-3 w-full my-2"
						name="nameSlovenia"
						{...register('nameSlovenia')}
						type="text"
						placeholder="Slovenian Name"
					/>

					<label className="label-text">English Name</label>
					<input
						className="input input-bordered p-3 w-full my-2"
						name="nameEnglish"
						{...register('nameEnglish', {
							required: 'Name is required.',
						})}
						type="text"
						placeholder="English Name"
					/>
					{errors.nameEnglish && (
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
							<span>{errors.nameEnglish?.message}</span>
						</div>
					)}
					<label className="label-text">German Name</label>
					<input
						className="input input-bordered p-3 w-full my-2"
						name="nameGermany"
						{...register('nameGermany')}
						type="text"
						placeholder="German Name"
					/>

					<label className="label-text">Italian Name</label>
					<input
						className="input input-bordered p-3 w-full my-2"
						name="nameItalia"
						{...register('nameItalia')}
						type="text"
						placeholder="Italian Name"
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

export default FirstStep;
