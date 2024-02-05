import { useRouter } from 'next/router';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { ImageDisplay, ImageUpload } from '/components';
import { addNewImage, imageDimensions } from '/utils/image';
import { filterNumberInput, getServiceName, getServiceDescription } from '/utils/utils';
import Image from 'next/image';

const Edit = ({ service }) => {
	const router = useRouter();
	// States
	const [success, setSuccess] = useState('');
	const imageWidth = imageDimensions.service[0];
	const imageHeight = imageDimensions.service[1];

	// States
	const [uploadFile, setUploadFile] = useState(null);
	const [renderImage, setRenderImage] = useState('');
	const [showServiceNames, setShowServiceNames] = useState(false);
	const [showServiceDescriptions, setShowServiceDescriptions] = useState(false);

	// Service names
	const nameBosnia = getServiceName(service, 'ba', false);
	const nameSerbia = getServiceName(service, 'rs', false);
	const nameCroatia = getServiceName(service, 'hr', false);
	const nameMontenegro = getServiceName(service, 'me', false);
	const nameSlovenia = getServiceName(service, 'si', false);
	const nameEnglish = getServiceName(service, 'gb', false);
	const nameGermany = getServiceName(service, 'de', false);
	const nameItalia = getServiceName(service, 'it', false);

	// Description names
	const descriptionBosnia = getServiceDescription(service, 'ba', false);
	const descriptionSerbia = getServiceDescription(service, 'rs', false);
	const descriptionCroatia = getServiceDescription(service, 'hr', false);
	const descriptionMontenegro = getServiceDescription(service, 'me', false);
	const descriptionSlovenia = getServiceDescription(service, 'si', false);
	const descriptionEnglish = getServiceDescription(service, 'gb', false);
	const descriptionGermany = getServiceDescription(service, 'de', false);
	const descriptionItalia = getServiceDescription(service, 'it', false);

	// Use Form instance
	const {
		register,
		handleSubmit,
		formState: { errors },
		setError,
	} = useForm({
		defaultValues: {},
		mode: 'onChange',
		reValidateMode: 'onChange',
	});

	const handleSubmitService = async (data) => {
		if (uploadFile !== null) {
			const response = await fetch('/api/image/delete', {
				body: JSON.stringify({ name: service.image.name, id: service.imageId }),
				method: 'POST',
				headers: {
					'Content-type': 'application/json',
				},
			});

			if (response.status === 200) {
				router.replace(router.asPath);
			}
			let id = await addNewImage(uploadFile, null, 'SERVICE', imageWidth, imageHeight);

			data.imageId = id;
		}
		data.serviceId = service.id;

		const response = await fetch('/api/admin/service/edit', {
			body: JSON.stringify(data),
			method: 'POST',
			headers: {
				'Content-type': 'application/json',
			},
		});

		if (response.status === 200) {
			await response.json();
			setSuccess(`Successfully updated`);
			router.reload();
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

	const handleDelete = async () => {
		let confirmDelete = confirm('Are you sure you want to delete current image?');
		if (confirmDelete === false) return;

		const response = await fetch('/api/image/delete', {
			body: JSON.stringify({ name: service.image.name, id: service.imageId }),
			method: 'POST',
			headers: {
				'Content-type': 'application/json',
			},
		});

		if (response.status === 200) {
			router.replace(router.asPath);
		}
	};
	return (
		<div>
			<form className="max-w-[600px] m-auto" onSubmit={handleSubmit(handleSubmitService)}>
				<div className="flex justify-between gap-5">
					<button
						className="bg-primaryColor text-white font-bold uppercase text-sm px-6 py-3 rounded-[6px] shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150 basis-[50%]"
						type="button"
						onClick={() => setShowServiceNames(true)}
					>
						Edit service names
					</button>
					<button
						className="bg-primaryColor text-white font-bold uppercase text-sm px-6 py-3 rounded-[6px] shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150 basis-[50%]"
						type="button"
						onClick={() => setShowServiceDescriptions(true)}
					>
						Edit service descriptions
					</button>
				</div>

				<div className={`${showServiceNames ? 'block' : 'hidden'}`}>
					<div className="justify-center items-center  overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none flex">
						<div className="relative w-5/12 my-6 mx-auto max-w-3xl">
							{/*content*/}
							<div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
								{/*header*/}
								<div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
									<h3 className="text-3xl font-semibold">Service names</h3>
								</div>
								{/*body*/}
								<div className="relative p-6 flex-auto">
									<div className="flex justify-between gap-3">
										<div className="flex flex-col basis-[50%]">
											<label className="label-text">Serbian Name</label>
											<input
												className="input input-bordered p-3 w-full my-2"
												name="nameSerbia"
												{...register('nameSerbia')}
												type="text"
												defaultValue={nameSerbia}
												placeholder="Serbian Name"
											/>
										</div>
										<div className="flex flex-col basis-[50%]">
											<label className="label-text">Bosnian Name</label>
											<input
												className="input input-bordered p-3 w-full my-2"
												name="nameBosnia"
												{...register('nameBosnia')}
												type="text"
												defaultValue={nameBosnia}
												placeholder="Bosnian Name"
											/>
										</div>
									</div>
									<div className="flex justify-between gap-3">
										<div className="flex flex-col basis-[50%]">
											<label className="label-text">Croatian Name</label>
											<input
												className="input input-bordered p-3 w-full my-2"
												name="nameCroatia"
												{...register('nameCroatia')}
												type="text"
												defaultValue={nameCroatia}
												placeholder="Croatian Name"
											/>
										</div>
										<div className="flex flex-col basis-[50%]">
											<label className="label-text">Montenegrin Name</label>
											<input
												className="input input-bordered p-3 w-full my-2"
												name="nameMontenegro"
												{...register('nameMontenegro')}
												type="text"
												defaultValue={nameMontenegro}
												placeholder="Montenegrin Name"
											/>
										</div>
									</div>
									<div className="flex justify-between gap-3">
										<div className="flex flex-col basis-[50%]">
											<label className="label-text">Slovenian Name</label>
											<input
												className="input input-bordered p-3 w-full my-2"
												name="nameSlovenia"
												{...register('nameSlovenia')}
												type="text"
												defaultValue={nameSlovenia}
												placeholder="Slovenian Name"
											/>
										</div>
										<div className="flex flex-col basis-[50%]">
											<label className="label-text">English Name</label>
											<input
												className="input input-bordered p-3 w-full my-2"
												name="nameEnglish"
												{...register('nameEnglish', {
													required: 'Name is required.',
												})}
												type="text"
												defaultValue={nameEnglish}
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
										</div>
									</div>
									<div className="flex justify-between gap-3">
										<div className="flex flex-col basis-[50%]">
											<label className="label-text">German Name</label>
											<input
												className="input input-bordered p-3 w-full my-2"
												name="nameGermany"
												{...register('nameGermany')}
												type="text"
												defaultValue={nameGermany}
												placeholder="German Name"
											/>
										</div>
										<div className="flex flex-col basis-[50%]">
											<label className="label-text">Italian Name</label>
											<input
												className="input input-bordered p-3 w-full my-2"
												name="nameItalia"
												{...register('nameItalia')}
												type="text"
												defaultValue={nameItalia}
												placeholder="Italian Name"
											/>
										</div>
									</div>
								</div>
								{/*footer*/}
								<div className="flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b">
									<button
										className="text-primaryColor background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
										type="button"
										onClick={() => setShowServiceNames(false)}
									>
										Save
									</button>
								</div>
							</div>
						</div>
					</div>
					<div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
				</div>

				<div className={`${showServiceDescriptions ? 'block' : 'hidden'}`}>
					<div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
						<div className="relative w-7/12 my-6 mx-auto">
							{/*content*/}
							<div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
								{/*header*/}
								<div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
									<h3 className="text-3xl font-semibold">Service descriptions</h3>
								</div>
								{/*body*/}
								<div className="relative p-6 flex-auto">
									<div className="flex justify-between gap-3">
										<div className="flex flex-col basis-[50%]">
											<label className="label-text">Serbian Description</label>
											<textarea
												className="input input-bordered p-3 w-full my-2 max-h-[250px] h-20"
												type="text"
												{...register('descriptionSerbia')}
												defaultValue={descriptionSerbia}
												placeholder="Serbian Description..."
											/>
										</div>
										<div className="flex flex-col basis-[50%]">
											<label className="label-text">Bosnian Description</label>
											<textarea
												className="input input-bordered p-3 w-full my-2 max-h-[250px] h-20"
												type="text"
												{...register('descriptionBosnia')}
												defaultValue={descriptionBosnia}
												placeholder="Bosnian Description..."
											/>
										</div>
									</div>
									<div className="flex justify-between gap-3">
										<div className="flex flex-col basis-[50%]">
											<label className="label-text">Croatian Description</label>
											<textarea
												className="input input-bordered p-3 w-full my-2 max-h-[250px] h-20"
												type="text"
												{...register('descriptionCroatia')}
												defaultValue={descriptionCroatia}
												placeholder="Croatian Description..."
											/>
										</div>

										<div className="flex flex-col basis-[50%]">
											<label className="label-text">Montenegrin Description</label>
											<textarea
												className="input input-bordered p-3 w-full my-2 max-h-[250px] h-20"
												type="text"
												{...register('descriptionMontenegro')}
												defaultValue={descriptionMontenegro}
												placeholder="Montenegrin Description..."
											/>
										</div>
									</div>
									<div className="flex justify-between gap-3">
										<div className="flex flex-col basis-[50%]">
											<label className="label-text">Slovenian Description</label>
											<textarea
												className="input input-bordered p-3 w-full my-2 max-h-[250px] h-20"
												type="text"
												{...register('descriptionSlovenia')}
												defaultValue={descriptionSlovenia}
												placeholder="Slovenian Description..."
											/>
										</div>
										<div className="flex flex-col basis-[50%]">
											<label className="label-text">English Description</label>
											<textarea
												className="input input-bordered p-3 w-full my-2 max-h-[250px] h-20"
												type="text"
												{...register('descriptionEnglish', {
													required: 'Description is required.',
												})}
												defaultValue={descriptionEnglish}
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
										</div>
									</div>
									<div className="flex justify-between gap-3">
										<div className="flex flex-col basis-[50%]">
											<label className="label-text">German Description</label>
											<textarea
												className="input input-bordered p-3 w-full my-2 max-h-[250px] h-20"
												type="text"
												{...register('descriptionGermany')}
												defaultValue={descriptionGermany}
												placeholder="German Description..."
											/>
										</div>
										<div className="flex flex-col basis-[50%]">
											<label className="label-text">Italian Description</label>
											<textarea
												className="input input-bordered p-3 w-full my-2 max-h-[250px] h-20"
												type="text"
												{...register('descriptionItalia')}
												defaultValue={descriptionItalia}
												placeholder="Italian Description..."
											/>
										</div>
									</div>
								</div>
								{/*footer*/}
								<div className="flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b">
									<button
										className="text-primaryColor background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
										type="button"
										onClick={() => setShowServiceDescriptions(false)}
									>
										Save
									</button>
								</div>
							</div>
						</div>
					</div>
					<div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
				</div>

				<label className="label-text">URL friendly name</label>
				<input
					className="input input-bordered p-3 w-full my-2"
					name="name"
					defaultValue={service?.simplifiedName}
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
					defaultValue={service?.order}
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

				<ImageDisplay
					images={service.image}
					imageType="SERVICE"
					imageFrom="service"
					id={service?.id}
					width={150}
					height={150}
					containerStyle="mt-3"
					imageStyle="rounded-xl"
					imageContainerStyle="flex mb-2"
					deleteIconStyle="cursor-pointer"
					deleteButton={true}
					handleDeleteImage={handleDelete}
				/>
				<ImageUpload
					inputStyle="w-[0.1px] h-[0.1px] opacity-0 overflow-hidden absolute z-[-1]"
					labelId="editServiceImage"
					labelText={
						service.image ? 'Change Service Image' : renderImage ? 'Change Service Image' : 'Add Service Image'
					}
					containerStyle="m-auto mb-2 flex flex-col"
					labelStyle="text-primary font-bold"
					inputLabelStyle="text-sm text-white mr-4 py-2 px-4 rounded-full border-0 text-sm font-semibold bg-primary text-white cursor-pointer w-32"
					callback={handleFile}
				/>
				<p className="pb-5">Preporučene dimenzije su 500 x 500 pixela</p>
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
				<button className="btn btn-block btn-primary mb-5">Edit</button>
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
