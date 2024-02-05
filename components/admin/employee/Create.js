import Image from 'next/image';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { ImageUpload } from '/components';
import { addNewImage, imageDimensions } from '/utils/image';

const Create = ({ modal, clinics }) => {
	const router = useRouter();
	const imageWidth = imageDimensions.employee[0];
	const imageHeight = imageDimensions.employee[1];

	// States
	const [uploadFile, setUploadFile] = useState(null);
	const [renderImage, setRenderImage] = useState('');

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

	const handleSubmitEmployee = async (data) => {
		if (uploadFile !== null) {
			let id = await addNewImage(uploadFile, null, 'EMPLOYEE', imageWidth, imageHeight);
			data.imageId = id;
		}
		const response = await fetch('/api/admin/employee/create', {
			body: JSON.stringify(data),
			method: 'POST',
			headers: {
				'Content-type': 'application/json',
			},
		});

		if (response.status === 201) {
			setUploadFile(null);
			setRenderImage('');
			modal(false);
			router.replace(router.asPath);
		}
	};

	const handleFile = (e) => {
		if (e.target.files) {
			const dataFile = e.target.files[0];
			setRenderImage(URL.createObjectURL(dataFile));
			setUploadFile(dataFile);
		}
	};
	return (
		<div>
			<form className="max-w-[600px] m-auto" onSubmit={handleSubmit(handleSubmitEmployee)}>
				<div className="flex justify-between w-full">
					<label className="label-text w-1/2 mb-1">Name</label>
					<label className="label-text w-1/2 mb-1">Surname</label>
				</div>
				<div className="flex items-center gap-2 mb-2">
					<input
						className="input input-bordered w-full max-w-xs"
						name="name"
						{...register('name', { required: 'Name is required.' })}
						type="text"
						placeholder="Name"
					/>
					<input
						className="input input-bordered w-full max-w-xs"
						type="text"
						{...register('surname', { required: 'Surname is required.' })}
						placeholder="Surname"
					/>
				</div>
				<div className="flex justify-between text-right mb-1">
					<div>
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
					</div>
					{errors.surname?.type === 'required' && (
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
							<span>{errors.surname?.message}</span>
						</div>
					)}
				</div>
				<label className="label-text">Title</label>
				<input
					className="input input-bordered w-full my-2"
					name="title"
					{...register('title', { required: 'Title is required.' })}
					type="text"
					placeholder="Title"
				/>
				{errors.title?.type === 'required' && (
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
						<span>{errors.title?.message}</span>
					</div>
				)}
				<label className="label-text">Select Type</label>
				<select
					className="select select-secondary w-full mb-3 mt-1"
					placeholder="Select Type"
					{...register('type', { required: 'Type is required.' })}
				>
					<option value="" className="invisible">
						Select Type
					</option>
					<option value="doctor">Doctor</option>
					<option value="staff">Staff</option>
				</select>
				{errors.type?.type === 'required' && (
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
						<span>{errors.type?.message}</span>
					</div>
				)}
				<label className="label-text">Select Clinic</label>
				<select
					className="select select-secondary w-full mt-1 mb-3"
					placeholder="Select Type"
					{...register('clinicId', { required: 'Clinic is required.' })}
				>
					<option value="" className="invisible">
						Select Clinic
					</option>
					{clinics.map((clinic) => (
						<option key={clinic.id} value={clinic.id}>
							{clinic.name}
						</option>
					))}
				</select>
				{errors.clinicId?.type === 'required' && (
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
						<span>{errors.clinicId?.message}</span>
					</div>
				)}
				<ImageUpload
					inputStyle="w-[0.1px] h-[0.1px] opacity-0 overflow-hidden absolute z-[-1]"
					labelId="addEmployeeImage"
					labelText={renderImage ? 'Change Employee Image' : 'Add Employee Image'}
					containerStyle="m-auto mb-2 flex flex-col"
					labelStyle="text-primary font-bold"
					inputLabelStyle="text-sm text-white mr-4 py-2 px-4 rounded-full border-0 text-sm font-semibold bg-primary text-white cursor-pointer w-32"
					callback={handleFile}
				/>
				<p className="text-[15px]">Preporučene dimenzije su 600 x 500 pixela</p>
				{renderImage ? (
					<div className="mt-2">
						<Image
							src={renderImage}
							alt="Partners logo"
							width={150}
							height={150}
							className="rounded-xl animate-pulse"
						/>
					</div>
				) : (
					<></>
				)}
				<button className="btn btn-block btn-primary mb-5 mt-2">Add Employee</button>
			</form>
		</div>
	);
};

export default Create;
