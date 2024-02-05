import { useRouter } from 'next/router';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

const Edit = ({ city }) => {
	const router = useRouter();
	// States
	const [success, setSuccess] = useState('');

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
		data.cityId = city.id;

		const response = await fetch('/api/admin/city/edit', {
			body: JSON.stringify(data),
			method: 'POST',
			headers: {
				'Content-type': 'application/json',
			},
		});

		if (response.status === 200) {
			const resData = await response.json();
			const city = resData.city;
			setSuccess(`${city.cityName} successfully updated`);
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
					defaultValue={city?.cityName}
					placeholder="Name..."
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
					defaultValue={city?.mapCoordinates}
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
					className="input input-bordered p-3 w-full mb-3 mt-1"
					name="zipCode"
					{...register('zipCode', { required: 'Zip Code is required.' })}
					type="text"
					defaultValue={city?.zipCode}
					placeholder="Zip Code..."
				/>
				{errors.zipCode?.type === 'required' && (
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
				<label className="label-text">Select Your Country</label>
				<select
					className="select select-secondary mt-1 mb-3 w-full"
					placeholder="Select Your Country"
					defaultValue={city.country}
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
				{errors.country?.type === 'required' && (
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
				<button className="btn btn-block btn-primary mb-5">Edit {city.cityName}</button>
				{success !== '' && (
					<div className="alert alert-success shadow-lg">
						<div>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								className="stroke-current flex-shrink-0 h-6 w-6"
								fill="none"
								viewBox="0 0 24 24"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth="2"
									d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
								/>
							</svg>
							<span>{success}</span>
						</div>
					</div>
				)}
			</form>
		</div>
	);
};

export default Edit;
