import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import Select, { createFilter } from 'react-select';
import { CustomOption } from '/components';

const Edit = ({ airport, cities }) => {
	const router = useRouter();

	// States
	const [success, setSuccess] = useState('');
	const [country, setCountry] = useState('');

	// Make React Select options for cities
	const cityOptions = cities
		?.sort((a, b) => {
			return a?.cityName[0].localeCompare(b?.cityName[0], 'sr-RS');
		})
		?.map((city) => {
			if (city?.country === country && (!city?.airport || city?.airport?.name === airport?.name)) {
				return {
					value: city.cityName.toLowerCase(),
					label: city.cityName,
					id: city.id,
				};
			}
		});

	// Filter and remove all undefined elements
	const filteredCities = cityOptions.filter((city) => city !== undefined);

	// Use Form instance
	const {
		register,
		handleSubmit,
		formState: { errors },
		control,
	} = useForm({
		mode: 'onChange',
		reValidateMode: 'onChange',
	});

	const handleSubmitAirport = async (data) => {
		data.airportId = airport.id;
		data.location = data.locationId.id;

		const response = await fetch('/api/admin/airport/edit', {
			body: JSON.stringify(data),
			method: 'POST',
			headers: {
				'Content-type': 'application/json',
			},
		});

		if (response.status === 200) {
			const resData = await response.json();
			const airport = resData.airport;
			setSuccess(`${airport.name} successfully updated`);
			router.reload();
		}
	};
	useEffect(() => {
		setCountry(airport.location?.country);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);
	return (
		<div>
			<form className="max-w-[600px] m-auto" onSubmit={handleSubmit(handleSubmitAirport)}>
				<label className="label-text">Name</label>
				<input
					className="input input-bordered p-3 w-full mt-1 mb-3"
					name="name"
					{...register('name', { required: 'Name is required.' })}
					type="text"
					defaultValue={airport?.name}
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
				<label className="label-text">Code</label>
				<input
					className="input input-bordered p-3 w-full mt-1 mb-3"
					name="code"
					{...register('code', { required: 'Code is required.' })}
					type="text"
					defaultValue={airport?.code}
					placeholder="Code..."
				/>
				{errors.code?.type === 'required' && (
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
						<span>{errors.code?.message}</span>
					</div>
				)}
				<label className="label-text">Map Coordinates</label>
				<input
					className="input input-bordered p-3 w-full mt-1 mb-3"
					name="code"
					{...register('mapCoords', {
						required: 'Map Coordinates are required.',
						pattern: {
							value: /^((\-?|\+?)?\d+(\.\d+)?),\s*((\-?|\+?)?\d+(\.\d+)?)$/gi,
							message: 'Not a valid format',
						},
					})}
					type="text"
					defaultValue={airport?.mapCoordinates}
					placeholder="Map Coordinates..."
				/>
				<span>
					Example: <span className="text-primary">43.8332551985,20.01973398927</span>
				</span>
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
				<label className="label-text flex flex-col py-1">Select Your Country</label>
				<select
					className="select select-secondary mt-1 mb-4 w-full"
					placeholder="Select Your Country"
					defaultValue={country !== '' ? country : airport.location?.country}
					{...register('country', {
						required: 'Country is required.',

						onChange: (e) => setCountry(e.target.value),
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
				<label className="label-text">Select Location</label>
				<Controller
					control={control}
					name="locationId"
					rules={{ required: 'City is required.' }}
					render={({ field: { onChange } }) => (
						<Select
							className="py-2"
							placeholder={`${airport.location?.cityName}`}
							options={filteredCities}
							instanceId="id"
							isDisabled={country === '' && true}
							onChange={onChange}
							filterOption={createFilter({ ignoreAccents: false })}
							components={{ Option: CustomOption }}
						/>
					)}
				/>
				{errors.locationId?.message && (
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
						<span>{errors.locationId?.message}</span>
					</div>
				)}
				<button className="btn btn-block btn-primary mb-5">Edit {airport.name}</button>
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
