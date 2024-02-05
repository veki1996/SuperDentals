import Image from 'next/image';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { ImageUpload } from '/components';
import { addNewImage, imageDimensions } from '/utils/image';

const Create = ({ modal }) => {
	const router = useRouter();
	const imageWidth = imageDimensions.partner[0];
	const imageHeight = imageDimensions.partner[1];

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

	const handleSubmitPartner = async (data) => {
		if (uploadFile !== null) {
			let id = await addNewImage(uploadFile, null, 'PARTNER', imageWidth, imageHeight);
			data.imageId = id;
		}
		const response = await fetch('/api/admin/partner/create', {
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
			<form className="max-w-[600px] m-auto" onSubmit={handleSubmit(handleSubmitPartner)}>
				<label className="label-text">Name</label>
				<input
					className="input input-bordered p-3 w-full mt-1 mb-3"
					name="name"
					{...register('name', { required: 'Name is required.' })}
					type="text"
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
				<label className="label-text">Website</label>
				<input
					className="input input-bordered p-3 w-full mt-1 mb-3"
					name="website"
					{...register('website', {
						pattern: {
							message: 'Not a valid format. (https://www.example.com/)',
							value:
								/^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*)$/,
						},
					})}
					type="text"
					placeholder="Website..."
				/>
				{errors.website && (
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
						<span>{errors.website?.message}</span>
					</div>
				)}
				<label className="label-text">Description</label>
				<textarea
					className="input input-bordered p-3 w-full mt-1 mb-3 max-h-[250px] h-20"
					type="text"
					{...register('description')}
					placeholder="Description..."
				/>
				<ImageUpload
					inputStyle="w-[0.1px] h-[0.1px] opacity-0 overflow-hidden absolute z-[-1]"
					labelId="addPartnerImage"
					labelText={renderImage ? 'Change Partner Logo' : 'Add Partner Logo'}
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
							alt="Partners logo"
							width={150}
							height={150}
							className="rounded-xl animate-pulse"
						/>
					</div>
				) : (
					<></>
				)}
				<button className="btn btn-block btn-primary mb-5 mt-2">Add Partner</button>
			</form>
		</div>
	);
};

export default Create;
