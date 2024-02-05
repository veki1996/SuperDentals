import Image from 'next/image';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { ImageUpload } from '/components';
import { addNewImage, imageDimensions } from '/utils/image';
import { filterNumberInput } from '/utils/utils';

const FinalStep = ({ modal, namesData, descriptionsData }) => {
	const router = useRouter();
	const imageWidth = imageDimensions.service[0];
	const imageHeight = imageDimensions.service[1];

	const [uploadFile, setUploadFile] = useState(null);
	const [renderImage, setRenderImage] = useState('');

	// Use Form instance
	const {
		register,
		handleSubmit,
		setError,
		formState: { errors },
	} = useForm({
		defaultValues: {},
		mode: 'onChange',
		reValidateMode: 'onChange',
	});

	const handleSubmitFinalStep = async (data) => {
		data.namesData = namesData;
		data.descriptionsData = descriptionsData;

		if (uploadFile !== null) {
			let id = await addNewImage(uploadFile, null, 'SERVICE', imageWidth, imageHeight);
			data.imageId = id;
		}
		const response = await fetch('/api/admin/service/create', {
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

		if (response.status === 400) {
			const { error } = await response.json();
			if (error?.code === 'P2002') {
				setError('order', { type: 'custom', message: 'Service with this order number already exists' });
			}
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
		<>
			<form
				className="relative flex flex-col w-full bg-white outline-none focus:outline-none"
				onSubmit={handleSubmit(handleSubmitFinalStep)}
			>
				<div className="relative p-6 flex-auto">
					<label className="label-text">URL friendly name</label>
					<input
						className="input input-bordered p-3 w-full my-2"
						name="name"
						{...register('simplifiedName', {
							required: 'URL friendly name is required',
							pattern: {
								value: /^[a-zA-Z0-9-]+$/,
								message: 'URL friendly name can only contain letters, numbers and dashes.',
							},
						})}
						type="text"
						placeholder="URL friendly name..."
					/>
					{errors.simplifiedName && (
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
							<span>{errors.simplifiedName?.message}</span>
						</div>
					)}

					<label className="label-text">Order number</label>
					<input
						className="input input-bordered p-3 w-full my-2"
						name="name"
						{...register('order', {
							required: 'Order number is required',
							pattern: {
								value: /^[a-zA-Z0-9-]+$/,
								message: 'Order number can only contain letters, numbers and dashes.',
							},
						})}
						type="number"
						placeholder="Order number..."
						onKeyDown={(e) => filterNumberInput(e)}
						min={0}
					/>
					{errors.order && (
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
							<span>{errors.order?.message}</span>
						</div>
					)}
					{/* <select className="my-2 select select-secondary w-full hidden" {...register('category')}>
						<option value="">Select Category</option>
						{categories.map((category) => (
							<option value={category.id} key={category.id}>
								{category.name}
							</option>
						))}
					</select> */}
					<ImageUpload
						inputStyle="w-[0.1px] h-[0.1px] opacity-0 overflow-hidden absolute z-[-1]"
						labelId="addServiceImage"
						labelText={renderImage ? 'Change Service Image' : 'Add Service Image'}
						containerStyle="m-auto mb-2 flex flex-col"
						labelStyle="text-primary font-bold"
						inputLabelStyle="text-sm text-white mr-4 py-2 px-4 rounded-full border-0 text-sm font-semibold bg-primary text-white cursor-pointer w-32"
						callback={handleFile}
					/>
					<p>Preporučene dimenzije su 500 x 500 pixela</p>
					{renderImage ? (
						<div className="mt-2">
							<Image
								src={renderImage}
								alt="Service Image"
								width={150}
								height={150}
								className="rounded-xl animate-pulse"
							/>
						</div>
					) : (
						<></>
					)}
				</div>

				<div className="flex items-center justify-end p-6">
					<button className="btn btn-block btn-primary mb-5">Add Service</button>
				</div>
			</form>
		</>
	);
};

export default FinalStep;
