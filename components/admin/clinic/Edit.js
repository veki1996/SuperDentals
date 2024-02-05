import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import Select from 'react-select';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import { useAtom } from 'jotai';
import { DescriptionModals, ImageDisplay, ImageUpload, ImageList } from '/components';
import { addNewImage, imageDimensions } from '/utils/image';
import {
	rsDescriptionAtom,
	baDescriptionAtom,
	hrDescriptionAtom,
	meDescriptionAtom,
	siDescriptionAtom,
	gbDescriptionAtom,
	deDescriptionAtom,
	itDescriptionAtom,
	imagesAtom,
} from '/store';
import Image from 'next/image';

import { languageOptions } from '/utils/filterOptions';
import { filterNumberInput, getServiceName, getClinicDescription } from '/utils/utils';

const Edit = ({ clinic, services, allImages }) => {
	const router = useRouter();
	const { locale } = router;

	// States
	const [toggleServices, setToggleServices] = useState(false);
	const [toggleWork, setToggleWork] = useState(false);
	const [success, setSuccess] = useState('');
	const [selectedServices, setSelectedServices] = useState([]);
	const [uploadLogo, setUploadLogo] = useState(null);
	const [renderLogo, setRenderLogo] = useState('');
	const [renderImages, setRenderImages] = useState([]);
	const [uploadFeaturedImage, setUploadFeaturedImage] = useState(null);
	const [renderFeaturedImage, setRenderFeaturedImage] = useState('');
	const [images, setImages] = useAtom(imagesAtom);

	const priceInputRefArray = useRef([]);

	//create array of refs based on services array ids and store them in priceInputRefArray
	//ids are used as keys for refs so that we can access them later and they are strings
	priceInputRefArray.current = services.map((service) => {
		return { id: service.id, ref: React.createRef() };
	});

	const handleSelectService = (e, service) => {
		//get price from input field related to service but react way of doing it
		//use refs to get input field value
		const price = priceInputRefArray.current.find((ref) => ref.id === service.id).ref.current.value;

		const selectedService = { id: service.id, name: getServiceName(service, locale, true), price };
		if (e.target.checked) {
			setSelectedServices([...selectedServices, selectedService]);
		} else {
			setSelectedServices(selectedServices.filter((s) => s.id !== service.id));
		}
	};
	const handlePriceChange = (e, service) => {
		const price = e.target.value;
		const selectedService = { id: service.id, name: getServiceName(service, locale, true), price };
		//if service is already selected, update the price
		if (selectedServices.find((s) => s.id === service.id)) {
			setSelectedServices(selectedServices.map((s) => (s.id === service.id ? selectedService : s)));
		}
	};

	const currentLogo = allImages.filter((image) => {
		if (image.imageUsage === 'LOGO' && image.clinicId === clinic.id) return true;
	});

	const currentFeaturedImage = allImages.filter((image) => {
		if (image.imageUsage === 'FEATURED' && image.clinicId === clinic.id) return true;
	});

	// Array of services names
	const filteredServices = clinic?.clinicServices?.map((clinicServices) =>
		getServiceName(clinicServices.service, locale, true),
	);

	const imageWidthLogo = imageDimensions.logo[0];
	const imageHeightLogo = imageDimensions.logo[1];
	const imageWidthAlbum = imageDimensions.album[0];
	const imageHeightAlbum = imageDimensions.album[1];
	const imageWidthFeaturedImage = imageDimensions.featured[0];
	const imageHeightFeaturedImage = imageDimensions.featured[1];

	// Description Atoms
	const [rsDescription, setRsDescription] = useAtom(rsDescriptionAtom);
	const [baDescription, setBaDescription] = useAtom(baDescriptionAtom);
	const [hrDescription, setHrDescription] = useAtom(hrDescriptionAtom);
	const [meDescription, setMeDescription] = useAtom(meDescriptionAtom);
	const [siDescription, setSiDescription] = useAtom(siDescriptionAtom);
	const [gbDescription, setGbDescription] = useAtom(gbDescriptionAtom);
	const [deDescription, setDeDescription] = useAtom(deDescriptionAtom);
	const [itDescription, setItDescription] = useAtom(itDescriptionAtom);

	const {
		register,
		handleSubmit,
		formState: { errors },
		setError,
		control,
		clearErrors,
	} = useForm({
		// This will make default array for data.videoLinks & data.phoneNumbers & data.workHours
		defaultValues: {
			videoLinks: JSON.parse(clinic.videoAlbum).map((video) => video),
			phoneNumbers: JSON.parse(clinic.phoneNumbers).map((number) => number),
			workHours: JSON.parse(clinic.workHours).map((workHour) => workHour),
		},
		criteriaMode: 'all',
		mode: 'onChange',
		reValidateMode: 'onChange',
	});
	// Connect dynamic fields array to data.videoLinks via name
	const {
		fields: videoFields,
		append: videoAppend,
		remove: videoRemove,
	} = useFieldArray({
		control,
		name: 'videoLinks',
	});

	const handleAppendVideo = () => {
		if (videoFields.length > 8) return;
		videoAppend({ videoLink: '' });
	};

	const handleRemoveVideo = (index) => {
		videoRemove(index);
	};

	// Connect dynamic fields array to data.phoneNumbers via name
	const {
		fields: numberFields,
		append: numberAppend,
		remove: numberRemove,
	} = useFieldArray({
		control,
		name: 'phoneNumbers',
	});

	const handleAppendNumber = () => {
		if (numberFields.length > 8) return;
		numberAppend({ numberType: '', number: '' });
	};

	const handleRemoveNumber = (index) => {
		numberRemove(index);
	};

	// Connect dynamic fields array to data.phoneNumbers via name
	const { fields: workFields } = useFieldArray({
		control,
		name: 'workHours',
	});

	const handleSubmitClinic = async (data) => {
		data.clinicId = clinic.id;
		data.servicesIds = services.map((service) => service.id);
		data.description = {
			rs: rsDescription,
			ba: baDescription,
			hr: hrDescription,
			me: meDescription,
			si: siDescription,
			gb: gbDescription,
			de: deDescription,
			it: itDescription,
		};
		data.servicesPrices = selectedServices;

		data.languages = data.languages?.map((language) => {
			return {
				value: language.value,
				label: language.label,
			};
		});

		await uploadAllImages(data.clinicId);

		if (data.phoneNumbers.length === 0) {
			setError('phoneNumbers', {
				type: 'required',
				message: 'At least 1 phone number is required.',
			});
			return;
		}

		if (errors.unregistredUsername) return;

		const response = await fetch('/api/admin/clinic/edit', {
			method: 'POST',
			body: JSON.stringify(data),
			headers: {
				'Content-type': 'application/json',
			},
		});

		if (response.status === 200) {
			const resData = await response.json();
			setSuccess(`${resData.clinic.name}  successfully updated`);
			router.reload();
		}
	};

	const handleDeleteImage = async (imageId, imageName) => {
		let confirmDelete = confirm('Are you sure you want to delete this image?');
		if (confirmDelete === false) return;

		const response = await fetch('/api/image/delete', {
			body: JSON.stringify({ name: imageName, id: imageId }),
			method: 'POST',
			headers: {
				'Content-type': 'application/json',
			},
		});

		if (response.status === 200) {
			router.replace(router.asPath, undefined, { scroll: false });
		}
	};

	const handleAlbumImage = (e) => {
		if (e.target.files) {
			const dataFile = e.target.files[0];
			setRenderImages([...renderImages, URL.createObjectURL(dataFile)]);
			setImages([...images, { imageType: 'ALBUM', file: dataFile }]);
		}
	};
	const removeAlbumImage = (id) => {
		let updated = renderImages.filter((item, index) => index !== id);
		let updatePhotos = images.filter((item, index) => index !== id);
		setRenderImages(updated);
		setImages(updatePhotos);
	};
	const handleLogo = (e) => {
		if (e.target.files) {
			const dataFile = e.target.files[0];
			setRenderLogo(URL.createObjectURL(dataFile));
			setUploadLogo(dataFile);
		}
	};

	const handleFeaturedImage = (e) => {
		if (e.target.files) {
			const dataFile = e.target.files[0];
			setRenderFeaturedImage(URL.createObjectURL(dataFile));
			setUploadFeaturedImage(dataFile);
		}
	};

	const uploadAllImages = async (clinicId) => {
		if (uploadLogo !== null) {
			await fetch('/api/image/delete', {
				body: JSON.stringify({ name: currentLogo[0]?.name, id: currentLogo[0]?.id }),
				method: 'POST',
				headers: {
					'Content-type': 'application/json',
				},
			});

			await addNewImage(uploadLogo, clinicId, 'LOGO', imageWidthLogo, imageHeightLogo);
		}

		if (uploadFeaturedImage !== null) {
			await fetch('/api/image/delete', {
				body: JSON.stringify({ name: currentFeaturedImage[0]?.name, id: currentFeaturedImage[0]?.id }),
				method: 'POST',
				headers: {
					'Content-type': 'application/json',
				},
			});

			await addNewImage(uploadFeaturedImage, clinicId, 'FEATURED', imageWidthFeaturedImage, imageHeightFeaturedImage);
		}

		if (images.length > 0) {
			await Promise.all(
				images.map(async (image) => {
					await addNewImage(image.file, clinicId, image.imageType, imageWidthAlbum, imageHeightAlbum);
				}),
			);
		}
	};

	const handleClick = () => {
		clearErrors('phoneNumbers');
	};

	useEffect(() => {
		setRsDescription(getClinicDescription(clinic?.description, 'rs'));
		setBaDescription(getClinicDescription(clinic?.description, 'ba'));
		setHrDescription(getClinicDescription(clinic?.description, 'hr'));
		setMeDescription(getClinicDescription(clinic?.description, 'me'));
		setSiDescription(getClinicDescription(clinic?.description, 'si'));
		setGbDescription(getClinicDescription(clinic?.description, 'gb'));
		setDeDescription(getClinicDescription(clinic?.description, 'de'));
		setItDescription(getClinicDescription(clinic?.description, 'it'));
		setSelectedServices(
			clinic.clinicServices.map((s) => {
				return {
					id: s.service.id,
					name: getServiceName(s.service, locale, true),
					price: s.price,
				};
			}),
		);
		setToggleWork(true);
		setToggleServices(true);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<div>
			<div>
				<form className="flex flex-col gap-3 max-w-[600px] m-auto" onSubmit={handleSubmit(handleSubmitClinic)}>
					<div className="flex justify-between w-full mt-2 -mb-2">
						<label className="label-text w-1/2">Clinic Name</label>
						<label className="label-text w-1/2 ml-4">Username</label>
					</div>
					<div className="flex items-center gap-2 mb-2">
						<input
							className="input input-bordered p-3 w-full max-w-xs"
							type="text"
							placeholder="Clinic Name..."
							defaultValue={clinic.name}
							{...register('clinicName', {
								required: { value: true, message: 'Ime klinike je obavezno.' },
								maxLength: { value: 32, message: 'Maksimalna dužina je 32 karaktera.' },
							})}
						/>

						<input
							className="input input-bordered w-full max-w-xs disabled"
							type="text"
							disabled
							placeholder="Username..."
							defaultValue={clinic.username}
							{...register('username')}
						/>
					</div>

					<div className="flex justify-between text-right">
						<div>
							{errors.clinicName && (
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
									<span>{errors.clinicName?.message}</span>
								</div>
							)}
						</div>
					</div>
					<div className="flex justify-between w-full -mb-2">
						<label className="label-text w-1/2">JIB/PIB</label>
						<label className="label-text w-1/2 ml-4">PDV</label>
					</div>
					<div className="flex items-center gap-2 mb-2">
						<input
							className="input input-bordered w-full max-w-xs"
							type="text"
							placeholder="JIB/PIB..."
							defaultValue={clinic?.jib}
							{...register('jib', { required: 'JIB/PIB is required.' })}
						/>

						<input
							className="input input-bordered w-full max-w-xs"
							type="text"
							placeholder="PDV..."
							defaultValue={clinic.pdv}
							{...register('pdv')}
						/>
					</div>
					{errors.jib?.type === 'required' && (
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
							<span>{errors.jib?.message}</span>
						</div>
					)}
					<div className="flex justify-between w-full -mb-2">
						<label className="label-text w-1/2">Address</label>
						<label className="label-text w-1/2 ml-4">Email</label>
					</div>
					<div className="flex items-center gap-2 mb-2">
						<input
							className="input input-bordered w-full max-w-xs"
							type="text"
							placeholder="Address..."
							defaultValue={clinic?.address}
							{...register('address', { required: 'Address is required.' })}
						/>
						<input
							className="input input-bordered w-full max-w-xs"
							type="text"
							placeholder="Email..."
							defaultValue={clinic?.email}
							{...register('email', { required: 'Email is required.' })}
						/>
					</div>
					<div className="flex justify-between">
						<div>
							{errors.address?.type === 'required' && (
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
									<span>{errors.address?.message}</span>
								</div>
							)}
						</div>
						<div>
							{errors.email?.type === 'required' && (
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
									<span>{errors.email?.message}</span>
								</div>
							)}
						</div>
					</div>
					<div className="flex justify-between w-full ">
						<label className="label-text w-1/2">Facebook</label>
						<label className="label-text w-1/2 ml-4">Instagram</label>
					</div>
					<div className="flex items-center gap-2 mb-2">
						<input
							className="input input-bordered w-full max-w-xs"
							type="text"
							placeholder="Facebook..."
							defaultValue={clinic?.facebook}
							{...register('facebook')}
						/>
						<input
							className="input input-bordered w-full max-w-xs"
							type="text"
							placeholder="Instagram..."
							defaultValue={clinic?.instagram}
							{...register('instagram')}
						/>
					</div>
					<div className="flex justify-between w-full ">
						<label className="label-text w-1/2">TikTok</label>
						<label className="label-text w-1/2 ml-4">LinkedIn</label>
					</div>
					<div className="flex items-center gap-2 mb-2">
						<input
							className="input input-bordered w-full max-w-xs"
							type="text"
							placeholder="TikTok..."
							defaultValue={clinic?.tiktok}
							{...register('tiktok')}
						/>
						<input
							className="input input-bordered w-full max-w-xs"
							type="text"
							placeholder="LinkedIn..."
							defaultValue={clinic?.linkedin}
							{...register('linkedin')}
						/>
					</div>
					<div className="flex justify-between w-full ">
						<label className="label-text w-1/2">Twitter</label>
						<label className="label-text w-1/2 ml-4">Website</label>
					</div>
					<div className="flex items-center gap-2 mb-2">
						<input
							className="input input-bordered w-full max-w-xs"
							type="text"
							placeholder="Twitter..."
							defaultValue={clinic?.twitter}
							{...register('twitter')}
						/>
						<input
							className="input input-bordered w-full max-w-xs"
							type="text"
							placeholder="Website..."
							defaultValue={clinic?.website}
							{...register('website')}
						/>
					</div>
					<div className="flex justify-between w-full -mb-2">
						<label className="label-text w-1/2">Number of Clinics</label>
						<label className="label-text w-1/2 ml-4">Years In Service</label>
					</div>
					<div className="flex items-center gap-2 mb-2">
						<input
							className="input input-bordered w-full max-w-xs"
							type="number"
							min="0"
							onKeyDown={(e) => filterNumberInput(e)}
							placeholder="Number Of Clinics..."
							defaultValue={clinic?.numberOfOffices}
							{...register('clinicsNumber', { required: 'Number of Clinics is required.' })}
						/>

						<input
							className="input input-bordered w-full max-w-xs"
							type="number"
							min="0"
							onKeyDown={(e) => filterNumberInput(e)}
							placeholder="Years In Service..."
							defaultValue={clinic?.yearsInService}
							{...register('yearsInService')}
						/>
					</div>
					{errors.clinicsNumber?.type === 'required' && (
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
							<span>{errors.clinicsNumber?.message}</span>
						</div>
					)}
					<div className="flex justify-between w-full -mb-2">
						<label className="label-text w-1/2">Number of Doctors</label>
						<label className="label-text w-1/2 ml-4">Number of Staff</label>
					</div>
					<div className="flex items-center gap-2 mb-2">
						<input
							className="input input-bordered w-full max-w-xs"
							type="number"
							min="0"
							onKeyDown={(e) => filterNumberInput(e)}
							placeholder="Number of Doctors..."
							defaultValue={clinic?.numberOfDoctors}
							{...register('doctorsNumber')}
						/>
						<input
							className="input input-bordered w-full max-w-xs"
							type="number"
							min="0"
							onKeyDown={(e) => filterNumberInput(e)}
							placeholder="Number Of Staff..."
							defaultValue={clinic?.numberOfStaff}
							{...register('staffNumber')}
						/>
					</div>

					<div className="flex items-center gap-4 flex-wrap">
						<label className="label cursor-pointer flex items-center gap-3">
							<span className="label-text text-lg">Credit Card Payment</span>
							<input
								className="checkbox checkbox-primary"
								type="checkbox"
								defaultChecked={clinic?.creditCardPaymentAvailable}
								{...register('creditCardPayment')}
							/>
						</label>
						<label className="label cursor-pointer flex items-center gap-3">
							<span className="label-text text-lg">WiFI Available</span>
							<input
								className="checkbox checkbox-primary"
								type="checkbox"
								defaultChecked={clinic?.wifiAvailable}
								{...register('wifiAvailable')}
							/>
						</label>
						<label className="label cursor-pointer flex items-center gap-3">
							<span className="label-text text-lg">Parking Available</span>
							<input
								className="checkbox checkbox-primary"
								type="checkbox"
								defaultChecked={clinic?.parkingAvailable}
								{...register('parkingAvailable')}
							/>
						</label>
						<label className="label cursor-pointer flex items-center gap-3">
							<span className="label-text text-lg">Warranty Provided</span>
							<input
								className="checkbox checkbox-primary"
								type="checkbox"
								defaultChecked={clinic?.warrantyProvided}
								{...register('warrantyProvided')}
							/>
						</label>
						<label className="label cursor-pointer flex items-center gap-3">
							<span className="label-text text-lg">Emergency Availability</span>
							<input
								className="checkbox checkbox-primary"
								type="checkbox"
								defaultChecked={clinic?.emergencyAvailability}
								{...register('emergencyAvailability')}
							/>
						</label>
						<label className="label cursor-pointer flex items-center gap-3">
							<span className="label-text text-lg">First Checkup is Free</span>
							<input
								className="checkbox checkbox-primary"
								type="checkbox"
								defaultChecked={clinic?.firstCheckupIsFree}
								{...register('firstCheckupIsFree')}
							/>
						</label>
					</div>

					<label className="label-text ">Select Languages</label>

					<Controller
						control={control}
						name="languages"
						render={({ field: { onChange } }) => (
							<Select
								placeholder="Select Languages"
								options={languageOptions}
								instanceId="id"
								onChange={onChange}
								getOptionLabel={(e) => (
									<div className="flex items-center">
										{e.icon}
										<span className="ml-[5px]">{e.label}</span>
									</div>
								)}
								isMulti
								defaultValue={JSON.parse(clinic.languagesSpoken)?.map((lang) => {
									return languageOptions?.find((language) => {
										if (language.value === lang.value) {
											return language;
										}
									});
								})}
							/>
						)}
					/>
					<label className="label-text mt-3">Description</label>
					<DescriptionModals type="admin" />
					<h2 className="text-primary text-xl">Numbers</h2>
					{numberFields.map((number, i) => (
						<div key={i}>
							<div className="flex justify-between w-full ">
								<label className="label-text basis-1/2 mb-2">Number Type</label>
								<label className="label-text basis-1/2 mb-2">Enter Number</label>
							</div>
							<div className="flex items-start justify-center gap-3">
								<div className="flex flex-col gap-2 basis-full">
									<select
										className="select select-secondary"
										type="text"
										placeholder="Npr fiksni, viber..."
										defaultValue={number.numberType}
										{...register(`phoneNumbers.${i}.numberType`, {
											required: {
												value: true,
												message: 'Tip telefona je potreban.',
											},
										})}
									>
										<option value="" className="invisible">
											Fiksni ili Mobilni
										</option>
										<option value="Fiksni">Fiksni</option>
										<option value="Mobilni">Mobilni</option>
									</select>
									{errors.phoneNumbers?.[i]?.numberType && (
										<div className="flex items-center gap-1 ">
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
											<span>{errors.phoneNumbers?.[i]?.numberType?.message}</span>
										</div>
									)}
								</div>
								<div className="flex flex-col gap-2 basis-full">
									<input
										className="input input-bordered w-full"
										type="text"
										placeholder="Enter Number..."
										defaultValue={number.number}
										{...register(`phoneNumbers.${i}.number`, {
											required: {
												value: true,
												message: 'Broj telefona je potreban.',
											},
											pattern: {
												value: /^[+]*[(]{0,1}[0-9]{1,3}[)]{0,1}[-\s\./0-9]*$/g,
												message: 'Format nije validan.',
											},
										})}
									/>

									{errors.phoneNumbers?.[i]?.number && (
										<div className="flex items-center gap-1 ">
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
											<span>{errors.phoneNumbers?.[i]?.number?.message}</span>
										</div>
									)}
								</div>

								<button
									className="btn btn-md  bg-secondary hover:bg-secondary/80"
									type="button"
									onClick={() => handleRemoveNumber(i)}
								>
									Delete
								</button>
							</div>
						</div>
					))}
					<button
						className="btn btn-wide  bg-secondary hover:bg-secondary/80"
						type="button"
						onClick={() => handleAppendNumber()}
					>
						Add Number
					</button>
					{errors.phoneNumbers?.type === 'required' && (
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
							<span>{errors.phoneNumbers?.message}</span>
						</div>
					)}
					<h2 className="text-primary text-xl">Video Links</h2>

					{videoFields.map((item, i) => (
						<div className="flex items-center gap-3 relative mb-5" key={i}>
							<input
								className="input input-bordered w-full"
								type="text"
								placeholder="Video Link..."
								defaultValue={item.videoLink}
								{...register(`videoLinks.${i}.videoLink`, {
									required: true,
									pattern: {
										message: 'Only youtube embed links are allowed',
										value: /^(https?\:\/\/)?(www\.youtube\.com\/embed)\/.+$/,
									},
								})}
							/>
							{errors.videoLinks?.[i]?.videoLink?.type === 'pattern' && (
								<div className="flex items-center gap-1 absolute bottom-[-30px]">
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
									<span>{errors.videoLinks?.[i]?.videoLink?.message}</span>
								</div>
							)}
							<button
								className="btn btn-md  bg-secondary hover:bg-secondary/80"
								type="button"
								onClick={() => handleRemoveVideo(i)}
							>
								Delete
							</button>
						</div>
					))}
					<button
						className="btn btn-wide  bg-secondary hover:bg-secondary/80"
						type="button"
						onClick={() => handleAppendVideo()}
					>
						Add Video
					</button>

					<h2 className="text-primary text-xl">Work Schedule</h2>

					<button
						className="btn btn-wide  bg-secondary hover:bg-secondary/80"
						onClick={() => setToggleWork(!toggleWork)}
						type="button"
					>
						Open & Edit Work Schedule
					</button>
					<div
						className={`relative p-6 flex-auto flex flex-col gap-3 bg-zinc-200 rounded-xl ${!toggleWork && 'hidden'}`}
					>
						{workFields.map((workHour, i) => (
							<div key={i}>
								<input
									className="input p-3 disabled:bg-violet-100"
									type="text"
									placeholder="Day..."
									{...register(`workHours.${i}.day`, {
										required: true,
									})}
									disabled
									value={workHour.day}
								/>

								<div className=" gap-5 my-3 flex items-center">
									<input
										className="input p-3"
										type="time"
										placeholder="From..."
										defaultValue={workHour.from}
										{...register(`workHours.${i}.from`)}
									/>
									<input
										className="input p-3"
										type="time"
										placeholder="To..."
										defaultValue={workHour.to}
										{...register(`workHours.${i}.to`)}
									/>
								</div>
							</div>
						))}
					</div>
					<h2 className="text-primary text-xl">Services</h2>

					<button
						className="btn btn-wide  bg-secondary hover:bg-secondary/80"
						onClick={() => setToggleServices(!toggleServices)}
						type="button"
					>
						Open & Edit Services
					</button>
					{toggleServices && (
						<div className={`grid grid-cols-2 gap-x-3 bg-zinc-200 rounded-xl p-3`}>
							{services.map((service) => (
								<div key={service.id} className="gap-4 flex-wrap">
									<div className="flex justify-between w-full mb-4 mt-5">
										<label className="label-text w-1/2">Service Name</label>
										<label className="label-text w-1/3">Price</label>
									</div>
									<label className="label cursor-pointer flex  gap-3 content-between break-all">
										<span className="label-text text-lg">{getServiceName(service, locale, true)}</span>
										<input
											className="checkbox checkbox-primary"
											type="checkbox"
											value={service.id}
											defaultChecked={filteredServices.includes(getServiceName(service, locale, true))}
											{...register('service', {
												required: {
													value: true,
												},
											})}
											onChange={(e) => handleSelectService(e, service)}
										/>
										<input
											type="number"
											min="0"
											onKeyDown={(e) => filterNumberInput(e)}
											className="input input-bordered w-[100px] input-sml"
											placeholder="Price"
											defaultValue={clinic.clinicServices
												.map((s) => {
													if (s.service.id === service.id) {
														return s.price;
													}
												})
												.toString()
												.replaceAll(',', '')}
											onChange={(e) => handlePriceChange(e, service)}
											ref={priceInputRefArray.current.find((ref) => ref.id === service.id).ref}
										/>
									</label>
								</div>
							))}
						</div>
					)}

					{errors.service?.type === 'required' && (
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
							<span>{errors.service?.message}At least 1 service is required.</span>
						</div>
					)}
					{clinic.images?.length > 0 && clinic.images?.some((image) => image.imageUsage === 'ALBUM') && (
						<div>
							<h2 className="text-primary text-xl">Current Album Images</h2>
							<ImageDisplay
								images={allImages}
								imageType="ALBUM"
								imageFrom="clinic"
								id={clinic.id}
								width={200}
								height={125}
								containerStyle="grid grid-cols-3 gap-2"
								imageContainerStyle="flex"
								imageStyle="rounded-xl"
								deleteIconStyle="cursor-pointer"
								deleteButton={true}
								handleDeleteImage={handleDeleteImage}
							/>
						</div>
					)}
					<ImageUpload
						inputStyle="w-[0.1px] h-[0.1px] opacity-0 overflow-hidden absolute z-[-1]"
						labelId="addAlbumImage"
						labelText="Add Album Images"
						containerStyle="mb-2 flex flex-col"
						labelStyle="text-primary font-bold"
						inputLabelStyle="text-sm text-white mr-4 py-2 px-4 rounded-full border-0 text-sm font-semibold bg-primary text-white cursor-pointer w-32"
						callback={handleAlbumImage}
					/>
					<p>Preporučene dimenzije za Album su 1055 x 500 pixela</p>
					<div className="w-full">
						<ImageList
							images={renderImages}
							remove={removeAlbumImage}
							width={150}
							height={100}
							imageStyle="rounded-xl animate-pulse"
							imageContainerStyle="flex mb-2"
							deleteIconStyle="cursor-pointer"
						/>
					</div>

					{clinic.images?.length > 0 && clinic.images?.some((image) => image.imageUsage === 'LOGO') && (
						<div>
							<h2 className="text-primary text-xl">Current Clinic Logo</h2>
							<ImageDisplay
								images={allImages}
								imageType="LOGO"
								imageFrom="clinic"
								id={clinic.id}
								width={125}
								height={125}
								containerStyle="flex gap-3 flex-wrap mt-2"
								imageContainerStyle="flex"
								imageStyle="rounded-xl"
								deleteIconStyle="cursor-pointer"
								deleteButton={true}
								handleDeleteImage={handleDeleteImage}
							/>
						</div>
					)}
					<ImageUpload
						inputStyle="w-[0.1px] h-[0.1px] opacity-0 overflow-hidden absolute z-[-1]"
						labelId="editPartnerImage"
						labelText={
							clinic.images?.some((image) => image.imageUsage === 'LOGO') ? 'Change Clinic Logo' : 'Add Clinic Logo'
						}
						containerStyle=" mb-2 flex flex-col"
						labelStyle="text-primary font-bold"
						inputLabelStyle="text-sm text-white mr-4 py-2 px-4 rounded-full border-0 text-sm font-semibold bg-primary text-white cursor-pointer w-32"
						callback={handleLogo}
					/>
					<p>Preporučene dimenzije za Logo su 200 x 200 pixela</p>
					{renderLogo ? (
						<div className="mt-2">
							<Image
								src={renderLogo}
								alt="Partners logo"
								width={125}
								height={125}
								className="rounded-xl animate-pulse"
							/>
						</div>
					) : (
						<></>
					)}
					{clinic.images?.length > 0 && clinic.images?.some((image) => image.imageUsage === 'FEATURED') && (
						<div>
							<h2 className="text-primary text-xl">Current Featured Image</h2>
							<ImageDisplay
								images={allImages}
								imageType="FEATURED"
								imageFrom="clinic"
								id={clinic.id}
								width={250}
								height={150}
								containerStyle="flex gap-3 flex-wrap mt-2"
								imageContainerStyle="flex"
								imageStyle="rounded-xl"
								deleteIconStyle="cursor-pointer"
								deleteButton={true}
								handleDeleteImage={handleDeleteImage}
							/>
						</div>
					)}

					<ImageUpload
						inputStyle="w-[0.1px] h-[0.1px] opacity-0 overflow-hidden absolute z-[-1]"
						labelId="addFeaturedImage"
						labelText={
							clinic.images?.some((image) => image.imageUsage === 'FEATURED')
								? 'Change Featured Image'
								: 'Add Featured Image'
						}
						containerStyle="mb-2 flex flex-col"
						labelStyle="text-primary font-bold"
						inputLabelStyle="text-sm text-white mr-4 py-2 px-4 rounded-full border-0 text-sm font-semibold bg-primary text-white cursor-pointer w-32"
						callback={handleFeaturedImage}
					/>
					<p>Preporučene dimenzije za Featured Slike su 1055 x 500 pixela</p>
					{renderFeaturedImage ? (
						<div className="mt-2">
							<Image
								src={renderFeaturedImage}
								alt="Partners logo"
								width={250}
								height={150}
								className="rounded-xl animate-pulse"
							/>
						</div>
					) : (
						<></>
					)}
					<button onClick={() => handleClick()} className="btn btn-block bg-secondary hover:bg-secondary/80 mb-5">
						Edit Clinic
					</button>
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
		</div>
	);
};

export default Edit;
