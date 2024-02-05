import Image from 'next/image';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { ImageUpload } from '/components';
import { addNewImage, imageDimensions } from '/utils/image';

const Create = ({ modal }) => {
	const router = useRouter();
	const imageWidth = imageDimensions.banner[0];
	const imageHeight = imageDimensions.banner[1];

	// States
	const [uploadFile, setUploadFile] = useState(null);
	const [renderImage, setRenderImage] = useState('');

	// Use Form instance
	const {
		register,
		handleSubmit,
		setError,
		clearErrors,
		formState: { errors },
	} = useForm({
		defaultValues: {},
		mode: 'onChange',
		reValidateMode: 'onChange',
	});

	const handleSubmitBanner = async (data) => {
		if (uploadFile === null) {
			setError('image', { message: 'Image is required.' });
			return;
		}
		if (uploadFile !== null) {
			let id = await addNewImage(uploadFile, null, 'BANNER', imageWidth, imageHeight);
			data.imageId = id;
		}

		const response = await fetch('/api/admin/banner/create', {
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

	const handleClick = () => {
		clearErrors('image');
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
			<form className="max-w-[600px] m-auto" onSubmit={handleSubmit(handleSubmitBanner)}>
				<label className="label-text">Name</label>
				<input
					className="input input-bordered p-3 w-full mt-1 mb-3"
					name="title"
					{...register('title', { required: 'Title is required.' })}
					type="text"
					placeholder="Name..."
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
				<label className="label-text">Website</label>
				<input
					className="input input-bordered p-3 w-full mt-1 mb-3"
					name="website"
					{...register('website', {
						required: 'Website is required.',
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
				<label className="label-text">Select Position</label>
				<select
					className="select select-secondary w-full mt-1 mb-3"
					placeholder="Select Position"
					{...register('position', { required: 'Position is required.' })}
				>
					<option value="" className="invisible">
						Select Position
					</option>
					<option value="header">Header</option>
					<option value="footer">Footer</option>
				</select>
				{errors.position?.type === 'required' && (
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
						<span>{errors.position?.message}</span>
					</div>
				)}
				<label className="label-text">Select Country</label>
				<select
					className="select select-secondary w-full mt-1 mb-3"
					placeholder="Select Country"
					{...register('country', { required: 'Country is required.' })}
				>
					<option value="" className="invisible">
						Select Country
					</option>
					<option value="global">GLOBAL</option>
					<option value="ba">Bosnia and Hercegovina</option>
					<option value="rs">Serbia</option>
					<option value="hr">Croatia</option>
					<option value="si">Slovenia</option>
					<option value="me">Montenegro</option>
					<option value="de">Germany</option>
					<option value="it">Italy</option>
					<option value="gb">United Kingdom</option>
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
				<ImageUpload
					inputStyle="w-[0.1px] h-[0.1px] opacity-0 overflow-hidden absolute z-[-1]"
					labelId="addBannerImage"
					labelText={renderImage ? 'Change Banner Image' : 'Add Banner Image'}
					containerStyle="m-auto mb-2 flex flex-col"
					labelStyle="text-primary font-bold"
					inputLabelStyle="text-sm text-white mr-4 py-2 px-4 rounded-full border-0 text-sm font-semibold bg-primary text-white cursor-pointer w-32"
					callback={handleFile}
				/>
				{errors.image && (
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
						<span>{errors.image?.message}</span>
					</div>
				)}
				<p>Preporučene dimenzije su 1200 x 200 pixela</p>
				{renderImage ? (
					<div className="mt-2">
						<Image src={renderImage} alt="Banners logo" width={150} height={100} className="rounded-xl animate-pulse" />
					</div>
				) : (
					<></>
				)}
				<button onClick={handleClick} className="btn btn-block btn-primary mb-5 mt-2">
					Add Banner
				</button>
			</form>
		</div>
	);
};

export default Create;
