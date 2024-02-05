import { useRouter } from 'next/router';

import { useForm } from 'react-hook-form';

const Create = ({ modal }) => {
	const router = useRouter();
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

	const handleSubmitCity = async (data) => {
		const response = await fetch('/api/admin/city/create', {
			body: JSON.stringify(data),
			method: 'POST',
			headers: {
				'Content-type': 'application/json',
			},
		});

		if (response.status === 201) {
			modal(false);
			router.reload();
		}
	};
	return (
		<div>
			<form className="max-w-[600px] m-auto" onSubmit={handleSubmit(handleSubmitCity)}>
				<label className="label-text">Name</label>
				<input
					className="input input-bordered p-3 w-full mt-1 mb-3"
					name="name"
					{...register('name', { required: 'Name is required.' })}
					type="text"
					placeholder="Name"
				/>

				{errors.name?.type === 'required' && (
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
						<span>{errors.name?.message}</span>
					</div>
				)}
				<label className="label-text">Map Coordinates</label>
				<input
					className="input input-bordered p-3 w-full mt-1 mb-1"
					type="text"
					{...register('mapCoords', {
						required: 'Map Coordinates are required.',
						pattern: {
							value: /^((\-?|\+?)?\d+(\.\d+)?),\s*((\-?|\+?)?\d+(\.\d+)?)$/gi,
							message: 'Not a valid format',
						},
					})}
					placeholder="Map Coordinates"
				/>
				<div className="mb-4">
					<span>
						Example: <span className="text-primary">43.8332551985,20.01973398927</span>
					</span>
				</div>
				{errors.mapCoords?.message && (
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
						<span>{errors.mapCoords?.message}</span>
					</div>
				)}
				<label className="label-text">Zip Code</label>
				<input
					className="input input-bordered p-3 w-full mt-1 mb-3"
					type="text"
					{...register('zipCode', {
						required: 'Zip Code is required.',
					})}
					placeholder="Zip Code"
				/>
				{errors.zipCode?.message && (
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
						<span>{errors.zipCode?.message}</span>
					</div>
				)}
				<label className="label-text">Select Country</label>
				<select
					className="select select-secondary mt-1 mb-3 w-full"
					placeholder="Select Your Country"
					{...register('country', {
						required: 'Country is required.',
					})}
				>
					<option value="" className="invisible">
						Select Country
					</option>
					<option value="ba">Bosna I Hercegovina</option>
					<option value="rs">Srbija</option>
					<option value="cg">Crna Gora</option>
				</select>
				{errors.country?.message && (
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
						<span>{errors.country?.message}</span>
					</div>
				)}
				<button className="btn btn-block btn-primary mb-5">Add City</button>
			</form>
		</div>
	);
};

export default Create;
