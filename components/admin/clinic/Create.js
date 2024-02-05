import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/router';
import Select, { createFilter } from 'react-select';
import { CustomOption, ImageUpload, ImageList, DescriptionModals } from '/components';

import { Controller, useFieldArray, useForm } from 'react-hook-form';
import { useAtom } from 'jotai';
import {
	imagesAtom,
	rsDescriptionAtom,
	baDescriptionAtom,
	hrDescriptionAtom,
	meDescriptionAtom,
	siDescriptionAtom,
	gbDescriptionAtom,
	deDescriptionAtom,
	itDescriptionAtom,
} from '/store';
import Image from 'next/image';
import { addNewImage, imageDimensions } from '/utils/image';

import { languageOptions } from '/utils/filterOptions';
import { filterNumberInput, getServiceName } from '/utils/utils';

const Create = ({ users, services, modal, cities }) => {
	// States
	const [toggleServices, setToggleServices] = useState(false);
	const [toggleWork, setToggleWork] = useState(false);
	const [country, setCountry] = useState('');
	const [selectedServices, setSelectedServices] = useState([]);
	const [uploadLogo, setUploadLogo] = useState(null);
	const [renderLogo, setRenderLogo] = useState('');
	const [renderImages, setRenderImages] = useState([]);
	const [uploadFeaturedImage, setUploadFeaturedImage] = useState(null);
	const [renderFeaturedImage, setRenderFeaturedImage] = useState('');
	const [images, setImages] = useAtom(imagesAtom);
	const router = useRouter();
	const { locale } = router;

	const imageWidthLogo = imageDimensions.logo[0];
	const imageHeightLogo = imageDimensions.logo[1];
	const imageWidthAlbum = imageDimensions.album[0];
	const imageHeightAlbum = imageDimensions.album[1];
	const imageWidthFeaturedImage = imageDimensions.featured[0];
	const imageHeightFeaturedImage = imageDimensions.featured[1];

	// Description Atoms
	const [rsDescription, setRsDescription] = useAtom(rsDescriptionAtom);
	const [hrDescription, setHrDescription] = useAtom(hrDescriptionAtom);
	const [baDescription, setBaDescription] = useAtom(baDescriptionAtom);
	const [meDescription, setMeDescription] = useAtom(meDescriptionAtom);
	const [siDescription, setSiDescription] = useAtom(siDescriptionAtom);
	const [gbDescription, setGbDescription] = useAtom(gbDescriptionAtom);
	const [deDescription, setDeDescription] = useAtom(deDescriptionAtom);
	const [itDescription, setItDescription] = useAtom(itDescriptionAtom);

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

	const workHoursDefaultDays = [
		{ day: 'Monday', from: '', to: '' },
		{ day: 'Tuesday', from: '', to: '' },
		{ day: 'Wednesday', from: '', to: '' },
		{ day: 'Thursday', from: '', to: '' },
		{ day: 'Friday', from: '', to: '' },
		{ day: 'Saturday', from: '', to: '' },
		{ day: 'Sunday', from: '', to: '' },
	];

	// User options
	const userOptions = users.map((user) => {
		return {
			value: user.id,
			label: `${user.name} ${user.surname}`,
		};
	});

	// Make React Select options for cities
	const cityOptions = cities
		?.sort((a, b) => {
			return a?.cityName[0].localeCompare(b?.cityName[0], 'sr-RS');
		})
		?.map((city) => {
			if (city.country === country) {
				return {
					value: city.cityName.toLowerCase(),
					label: city.cityName,
					id: city.id,
				};
			}
		});

	// Filter and remove all undefined elements
	const filteredCities = cityOptions.filter((city) => city !== undefined);

	const {
		register,
		handleSubmit,
		formState: { errors },
		setError,
		control,
		clearErrors,
		watch,
		setValue,
	} = useForm({
		defaultValues: {
			workHours: workHoursDefaultDays,
		},
		mode: 'onChange',
		reValidateMode: 'onChange',
	});

	const nameRef = watch('clinicName');
	const cleanUsername = nameRef
		?.toLowerCase()
		?.replaceAll('š', 's')
		?.replaceAll('č', 'c')
		?.replaceAll('ć', 'c')
		?.replaceAll('ž', 'z')
		?.replaceAll('đ', 'dj')
		?.replace(/[^a-zA-Z0-9 ]/g, '')
		?.trim()
		?.split(' ')
		?.join('-');
	setValue('username', cleanUsername);
	const randomNumber = Math.floor(Math.random() * (999 - 100 + 1) + 100);

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
		data.ownerId = data.userId.value;
		data.servicesPrices = selectedServices;
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
		data.username = await handleUsernameChange(data.username);

		data.languages = data.languages?.map((language) => {
			return {
				value: language.value,
				label: language.label,
			};
		});

		if (data.phoneNumbers.length === 0) {
			setError('phoneNumbers', {
				type: 'required',
				message: 'At least 1 phone number is required.',
			});
			return;
		}
		if (errors.unregistredUsername) return;

		const response = await fetch('/api/admin/clinic/create', {
			method: 'POST',
			body: JSON.stringify(data),
			headers: {
				'Content-type': 'application/json',
			},
		});

		if (response.status === 201) {
			const resData = await response.json();
			await uploadAllImages(resData.clinic.id);
			router.replace(router.asPath);
			modal(false);
		}
	};

	const handleUsernameChange = async (username) => {
		const response = await fetch(`/api/clinics/${username || 'username'}`);
		if (response.status === 200) {
			const resData = await response.json();

			if (resData.status === 400) {
				return `${username}-${randomNumber}`;
			} else return username;
		}
	};

	const handleClick = () => {
		clearErrors('phoneNumbers');
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
			await addNewImage(uploadLogo, clinicId, 'LOGO', imageWidthLogo, imageHeightLogo);
		}

		if (uploadFeaturedImage !== null) {
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

	useEffect(() => {
		setRsDescription('');
		setBaDescription('');
		setHrDescription('');
		setMeDescription('');
		setSiDescription('');
		setGbDescription('');
		setDeDescription('');
		setItDescription('');

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [modal]);

	return (
		<div>
			<div>
				<form className="flex flex-col max-w-[600px] gap-3 m-auto" onSubmit={handleSubmit(handleSubmitClinic)}>
					<label className="label-text">Select User</label>
					<Controller
						control={control}
						name="userId"
						rules={{ required: 'User is required.' }}
						render={({ field: { onChange } }) => (
							<Select placeholder="Select User" options={userOptions} instanceId="id" onChange={onChange} />
						)}
					/>
					{errors.userId?.type === 'required' && (
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
							<span>{errors.userId?.message}</span>
						</div>
					)}
					<div className="flex justify-between w-full mb--2 mt-5">
						<label className="label-text w-1/2">Clinic Name</label>
						<label className="label-text w-1/2 ml-4">Username</label>
					</div>
					<div className="flex items-center gap-2 mb-2">
						<input
							className="input input-bordered p-3 w-full max-w-xs"
							type="text"
							placeholder="Clinic Name..."
							{...register('clinicName', {
								required: { value: true, message: 'Clinic name is required.' },
								maxLength: { value: 32, message: 'Maksimalna dužina je 32 .' },
							})}
						/>

						<input
							className="input input-bordered w-full max-w-xs disabled"
							type="text"
							disabled
							placeholder="Username..."
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
						<div>
							{errors.username?.type === 'required' && (
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
									<span>{errors.username?.message}</span>
								</div>
							)}
							{errors.username?.type === 'pattern' && (
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
									<span>{errors.username?.message}</span>
								</div>
							)}
						</div>
					</div>
					<div className="flex justify-between w-full mb--2 mt-5">
						<label className="label-text w-1/2">Select Your Country</label>
						<label className="label-text ">Select Your City</label>
					</div>
					<div className="flex justify-between items-center gap-2 mb-2">
						<select
							className="select select-bordered select-secondary -w-xs"
							placeholder="Select Your Country"
							{...register('country', {
								required: 'Country is required.',

								onChange: (e) => setCountry(e.target.value),
							})}
						>
							<option value="" className="invisible">
								Select Your Country
							</option>
							<option value="ba">Bosna I Hercegovina</option>
							<option value="rs">Srbija</option>
							<option value="cg">Crna Gora</option>
						</select>

						<Controller
							control={control}
							name="city"
							rules={{ required: 'City is required.' }}
							render={({ field: { onChange } }) => (
								<Select
									placeholder="Select Your City"
									isDisabled={country === '' && true}
									options={filteredCities}
									instanceId="id"
									onChange={onChange}
									filterOption={createFilter({ ignoreAccents: false })}
									components={{ Option: CustomOption }}
								/>
							)}
						/>
					</div>
					<div className="flex items-center justify-between">
						<div>
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
									<span>{errors.country.message}</span>
								</div>
							)}
						</div>
						{errors.city?.type === 'required' && (
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
								<span>{errors.city.message}</span>
							</div>
						)}
					</div>
					<div className="flex justify-between w-full ">
						<label className="label-text w-1/2">JIB/PIB</label>
						<label className="label-text w-1/2 ml-4">PDV</label>
					</div>
					<div className="flex items-center gap-2 mb-2">
						<input
							className="input input-bordered w-full max-w-xs"
							type="text"
							placeholder="JIB/PIB..."
							{...register('jib', { required: 'JIB/PIB is required.' })}
						/>

						<input
							className="input input-bordered w-full max-w-xs"
							type="text"
							placeholder="PDV..."
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
					<div className="flex justify-between w-full ">
						<label className="label-text w-1/2">Email</label>
						<label className="label-text w-1/2 ml-4">Address</label>
					</div>
					<div className="flex items-center gap-2 mb-2">
						<input
							className="input input-bordered w-full max-w-xs"
							type="text"
							placeholder="Email..."
							{...register('email', { required: 'Email is required.' })}
						/>
						<input
							className="input input-bordered w-full max-w-xs"
							type="text"
							placeholder="Address..."
							{...register('address', { required: 'Address is required.' })}
						/>
					</div>
					<div className="flex justify-between">
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
							{...register('facebook')}
						/>
						<input
							className="input input-bordered w-full max-w-xs"
							type="text"
							placeholder="Instagram..."
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
							{...register('tiktok')}
						/>
						<input
							className="input input-bordered w-full max-w-xs"
							type="text"
							placeholder="LinkedIn..."
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
							{...register('twitter')}
						/>
						<input
							className="input input-bordered w-full max-w-xs"
							type="text"
							placeholder="Website..."
							{...register('website')}
						/>
					</div>
					<div className="flex justify-between w-full ">
						<label className="label-text w-1/2">Number Of Clinics</label>
						<label className="label-text w-1/2 ml-4">Years In Service</label>
					</div>
					<div className="flex items-center gap-2 mb-2">
						<input
							className="input input-bordered w-full max-w-xs"
							type="number"
							min="0"
							onKeyDown={(e) => filterNumberInput(e)}
							placeholder="Number Of Clinics..."
							{...register('clinicsNumber', { required: 'Number of Clinics is required.' })}
						/>

						<input
							className="input input-bordered w-full max-w-xs"
							type="number"
							min="0"
							onKeyDown={(e) => filterNumberInput(e)}
							placeholder="Years In Service..."
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
					<div className="flex justify-between w-full ">
						<label className="label-text w-1/2">Number Of Doctors</label>
						<label className="label-text w-1/2 ml-4">Number Of Staff</label>
					</div>
					<div className="flex items-center gap-2 mb-2">
						<input
							className="input input-bordered w-full max-w-xs"
							type="number"
							min="0"
							onKeyDown={(e) => filterNumberInput(e)}
							placeholder="Number of Doctors..."
							{...register('doctorsNumber')}
						/>
						<input
							className="input input-bordered w-full max-w-xs"
							type="number"
							min="0"
							onKeyDown={(e) => filterNumberInput(e)}
							placeholder="Number Of Staff..."
							{...register('staffNumber')}
						/>
					</div>
					<label className="label-text">Description</label>
					<DescriptionModals type="admin" />

					<div className="flex items-center gap-4 flex-wrap">
						<label className="label cursor-pointer flex items-center gap-3">
							<span className="label-text text-lg">Credit Card Payment</span>
							<input className="checkbox checkbox-primary" type="checkbox" {...register('creditCardPayment')} />
						</label>
						<label className="label cursor-pointer flex items-center gap-3">
							<span className="label-text text-lg">WiFI Available</span>
							<input className="checkbox checkbox-primary" type="checkbox" {...register('wifiAvailable')} />
						</label>
						<label className="label cursor-pointer flex items-center gap-3">
							<span className="label-text text-lg">Parking Available</span>
							<input className="checkbox checkbox-primary" type="checkbox" {...register('parkingAvailable')} />
						</label>
						<label className="label cursor-pointer flex items-center gap-3">
							<span className="label-text text-lg">Warranty Provided</span>
							<input className="checkbox checkbox-primary" type="checkbox" {...register('warrantyProvided')} />
						</label>
						<label className="label cursor-pointer flex items-center gap-3">
							<span className="label-text text-lg">Emergency Availability</span>
							<input className="checkbox checkbox-primary" type="checkbox" {...register('emergencyAvailability')} />
						</label>
						<label className="label cursor-pointer flex items-center gap-3">
							<span className="label-text text-lg">First Checkup is Free</span>
							<input className="checkbox checkbox-primary" type="checkbox" {...register('firstCheckupIsFree')} />
						</label>
					</div>
					<label className="label-text">Select Languages</label>
					<Controller
						control={control}
						name="languages"
						render={({ field: { onChange } }) => (
							<Select
								placeholder="Select Languages"
								options={languageOptions}
								instanceId="id"
								getOptionLabel={(e) => (
									<div className="flex items-center">
										{e.icon}
										<span className="ml-[5px]">{e.label}</span>
									</div>
								)}
								onChange={onChange}
								isMulti
							/>
						)}
					/>
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
											<span>{errors.phoneNumbers?.[i]?.numberType?.message}</span>
										</div>
									)}
								</div>
								<div className="flex flex-col gap-2 basis-full">
									<input
										className="input input-bordered w-full"
										type="text"
										placeholder="Enter Number..."
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
						<div className="flex items-center gap-3 mb-5 relative" key={i}>
							<input
								className="input input-bordered w-full"
								type="text"
								placeholder="Video Link..."
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
								<div className="flex flex-col gap-3">
									<label className="label-text ">Day:</label>
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
								</div>
								<div className=" flex justify-between w-1/4  mt-2">
									<label className="label-text ">From:</label>
									<label className="label-text">To:</label>
								</div>
								<div className="gap-5 my-3 flex items-center">
									<input className="input p-3" type="time" placeholder="From..." {...register(`workHours.${i}.from`)} />
									<input className="input p-3" type="time" placeholder="To..." {...register(`workHours.${i}.to`)} />
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

					<div className={`grid grid-cols-2 gap-x-3 bg-zinc-200 rounded-xl p-3 ${!toggleServices && 'hidden'}`}>
						{services.map((service) => (
							<div key={service.id} className="gap-4 flex-wrap">
								<div className="flex justify-between w-full mb-4 mt-5">
									<label className="label-text w-1/2">Service Name</label>
									<label className="label-text w-1/3">Price</label>
								</div>
								<label className="label cursor-pointer flex  gap-3 break-all items-start">
									<span className="label-text text-lg">{getServiceName(service, locale)}</span>
									<input
										className="checkbox checkbox-primary"
										type="checkbox"
										value={service.id}
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
										onChange={(e) => handlePriceChange(e, service)}
										ref={priceInputRefArray.current.find((ref) => ref.id === service.id).ref}
									/>
								</label>
							</div>
						))}
					</div>
					{country !== '' && (
						<span>(Your currency is {country === 'ba' ? 'EUR' : country === 'rs' ? 'EUR' : 'EUR'})</span>
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
					<div className="mt-5">
						<h2 className="text-primary text-xl">Add Album Images</h2>
						<div>
							<ImageUpload
								inputStyle="w-[0.1px] h-[0.1px] opacity-0 overflow-hidden absolute z-[-1]"
								labelId="addAlbumImage"
								containerStyle="m-auto mb-2 flex flex-col"
								labelStyle="text-primary font-bold"
								inputLabelStyle="text-sm text-white mr-4 py-2 px-4 rounded-full border-0 text-sm font-semibold bg-primary text-white cursor-pointer w-32"
								callback={handleAlbumImage}
							/>
							<p>Preporučene dimenzije su 1055 x 500 pixela</p>
						</div>

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
					</div>

					<div className="mt-5">
						<ImageUpload
							inputStyle="w-[0.1px] h-[0.1px] opacity-0 overflow-hidden absolute z-[-1]"
							labelId="addLogoImage"
							labelText={renderLogo ? 'Change Clinic Logo' : 'Add Clinic Logo'}
							containerStyle="m-auto mb-2 flex flex-col"
							labelStyle="text-primary font-bold"
							inputLabelStyle="text-sm text-white mr-4 py-2 px-4 rounded-full border-0 text-sm font-semibold bg-primary text-white cursor-pointer w-32"
							callback={handleLogo}
						/>
						<p>Preporučene dimenzije su 200 x 200 pixela</p>
						{renderLogo ? (
							<div>
								<Image src={renderLogo} alt="upload" width={100} height={100} className="rounded-xl animate-pulse" />
							</div>
						) : (
							<span></span>
						)}
					</div>

					<div className="mt-5">
						<ImageUpload
							inputStyle="w-[0.1px] h-[0.1px] opacity-0 overflow-hidden absolute z-[-1]"
							labelId="addFeatureImage"
							labelText={renderFeaturedImage ? 'Change Featured Image' : 'Add Featured Image'}
							containerStyle="m-auto mb-2 flex flex-col"
							labelStyle="text-primary font-bold"
							inputLabelStyle="text-sm text-white mr-4 py-2 px-4 rounded-full border-0 text-sm font-semibold bg-primary text-white cursor-pointer w-32"
							callback={handleFeaturedImage}
						/>
						<p>Preporučene dimenzije su 1055 x 500 pixela</p>
						{renderFeaturedImage ? (
							<div>
								<Image
									src={renderFeaturedImage}
									alt="upload"
									width={150}
									height={100}
									className="rounded-xl animate-pulse"
								/>
							</div>
						) : (
							<span></span>
						)}
					</div>
					<button onClick={() => handleClick()} className="btn btn-block bg-secondary hover:bg-secondary/80 mb-5">
						Add Clinic
					</button>
				</form>
			</div>
		</div>
	);
};

export default Create;
