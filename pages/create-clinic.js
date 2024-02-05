import React, { useEffect, useState } from 'react';
import { useAtom } from 'jotai';
import { prisma } from '/utils/db';
import { getSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { Controller, useForm } from 'react-hook-form';
import Select, { createFilter, components } from 'react-select';
import { GoogleMap, MarkerF, useLoadScript } from '@react-google-maps/api';
import {
	imagesAtom,
	employeesAtom,
	rsDescriptionAtom,
	baDescriptionAtom,
	hrDescriptionAtom,
	meDescriptionAtom,
	siDescriptionAtom,
	gbDescriptionAtom,
	deDescriptionAtom,
	itDescriptionAtom,
} from '/store';
import { addNewImage, imageDimensions } from '/utils/image';
import Image from 'next/image';
import {
	PhoneNumbers,
	WorkHours,
	CustomOption,
	AddEmployee,
	ImageUpload,
	ImageDisplay,
	ImageList,
	Nav,
	Footer,
	HeadMeta,
	DescriptionModals,
	AutoComplete,
} from '/components';
import { useRef } from 'react';
import { AiFillCaretDown, AiOutlineCloseCircle, AiFillDelete } from 'react-icons/ai';
import { FiChevronRight } from 'react-icons/fi';

import { languageOptions } from '/utils/filterOptions';
import { filterNumberInput, getServiceName } from '/utils/utils';
import useTranslation from 'next-translate/useTranslation';

const Welcome = ({ user, services, cities }) => {
	const { t } = useTranslation('create-edit-clinic');

	// Load Google Apis
	const { isLoaded } = useLoadScript({
		googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
		libraries: ['places'],
	});

	const router = useRouter();
	const { locale } = router;

	const imageWidthLogo = imageDimensions.logo[0];
	const imageHeightLogo = imageDimensions.logo[1];

	const imageWidthAlbum = imageDimensions.album[0];
	const imageHeightAlbum = imageDimensions.album[1];

	const imageWidthFeaturedImage = imageDimensions.featured[0];
	const imageHeightFeaturedImage = imageDimensions.featured[1];

	// States
	const [clinic, setClinic] = useState(false);
	const [country, setCountry] = useState('');
	const [mapCoordinates, setMapCoordinates] = useState('');
	const [center, setCenter] = useState();
	const [employees, setEmployees] = useAtom(employeesAtom);
	const [placeId, setPlaceId] = useState('');
	const [rating, setRating] = useState('');

	const [city, setCity] = useState('');

	const [uploadLogo, setUploadLogo] = useState(null);
	const [renderLogo, setRenderLogo] = useState('');

	const [uploadFeaturedImage, setUploadFeaturedImage] = useState(null);
	const [renderFeaturedImage, setRenderFeaturedImage] = useState('');

	const [isSubmitting, setIsSubmitting] = useState(false);

	const [renderImages, setRenderImages] = useState([]);
	const [images, setImages] = useAtom(imagesAtom);
	const [selectedServices, setSelectedServices] = useState([]);

	// Description Atoms
	const [rsDescription] = useAtom(rsDescriptionAtom);
	const [baDescription] = useAtom(baDescriptionAtom);
	const [hrDescription] = useAtom(hrDescriptionAtom);
	const [meDescription] = useAtom(meDescriptionAtom);
	const [siDescription] = useAtom(siDescriptionAtom);
	const [gbDescription] = useAtom(gbDescriptionAtom);
	const [deDescription] = useAtom(deDescriptionAtom);
	const [itDescription] = useAtom(itDescriptionAtom);

	const priceInputRefArray = useRef([]);

	const selectedCountry = user?.country;

	//create array of refs based on services array ids and store them in priceInputRefArray
	//ids are used as keys for refs so that we can access them later and they are strings
	priceInputRefArray.current = services.map((service) => {
		return { id: service.id, ref: React.createRef() };
	});

	const handleSelectService = (e, service) => {
		//get price from input field related to service but react way of doing it
		//use refs to get input field value
		const price = priceInputRefArray.current.find((ref) => ref.id === service.id)?.ref?.current?.value;

		const selectedService = { ...service, price };
		if (e.target.checked) {
			setSelectedServices([...selectedServices, selectedService]);
		} else {
			setSelectedServices(selectedServices.filter((s) => s.id !== service.id));
		}
	};

	const handlePriceChange = (e, service) => {
		const price = e.target.value;
		const selectedService = { ...service, price };

		//if service is already selected, update the price
		if (selectedServices.find((s) => s.id === service.id)) {
			setSelectedServices(selectedServices.map((s) => (s.id === service.id ? selectedService : s)));
		}
	};

	const workHoursDefaultDays = [
		{ day: 'Ponedeljak', from: '', to: '' },
		{ day: 'Utorak', from: '', to: '' },
		{ day: t('form.text-6'), from: '', to: '' },
		{ day: 'Četvrtak', from: '', to: '' },
		{ day: 'Petak', from: '', to: '' },
		{ day: 'Subota', from: '', to: '' },
		{ day: 'Nedelja', from: '', to: '' },
	];
	// Make React Select options for cities
	const cityOptions = cities
		?.sort((a, b) => {
			return a?.cityName[0].localeCompare(b?.cityName[0], 'sr-RS');
		})
		?.map((city) => {
			if (city.country === selectedCountry) {
				return {
					value: city.cityName.toLowerCase(),
					label: city.cityName,
					mapCoords: city.mapCoordinates,
					id: city.id,
				};
			}
		});

	// Filter and remove all undefined elements
	const filteredCities = cityOptions.filter((city) => city !== undefined);

	// Use form instance for Add Clinic Form
	const {
		register,
		handleSubmit,
		reset,
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
		criteriaMode: 'all',
		reValidateMode: 'onChange',
		mode: 'onChange',
	});

	const cityRef = watch('city');
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

	useEffect(() => {
		if (cityRef)
			setCity(
				cityRef?.mapCoords && cityRef?.mapCoords !== ''
					? cityRef?.mapCoords
					: country === 'ba'
					? '44.54990044043689, 17.69163403154159'
					: country === 'rs'
					? '44.12577373375703, 20.732876141690323'
					: '42.88478683886908, 19.18008346633613',
			);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [cityRef, city]);

	// Use Effect for centering map cooresponding to the country selected
	useEffect(() => {
		const lat = Number(city?.split(',')[0]);
		const lng = Number(city?.split(',')[1]);
		if (city !== '') {
			setCenter(new google.maps.LatLng(lat, lng));
		}

		// Reset mapCoords and cooresponding input field
		setMapCoordinates('');
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [city]);

	// Add Clinic
	const handleSubmitClinic = async (data) => {
		data.userId = user.id;
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
		data.mapCoords = mapCoordinates;
		data.rating = rating;
		data.servicesPrices = selectedServices;

		data.username = await handleUsernameChange(data.username);
		data.languages = data.languages?.map((language) => {
			return {
				value: language.value,
				label: language.label,
			};
		});
		setIsSubmitting(true);
		if (data.phoneNumbers.length === 0) {
			setError('phoneNumbers', {
				type: 'required',
				message: 'Najmanje 1 broj je obavezan.',
			});
			return;
		}

		const response = await fetch('/api/clinics/create', {
			method: 'POST',
			body: JSON.stringify(data),
			headers: {
				'Content-type': 'application/json',
			},
		});

		if (response.status === 201) {
			const resData = await response.json();
			await uploadAllImages(resData.clinic.id);
			setClinic(resData.clinic);
			reset();
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
	const deleteEmployee = async (id) => {
		const response = await fetch('/api/employees/delete', {
			method: 'DELETE',
			body: JSON.stringify({
				id: id,
			}),
			headers: {
				'Content-type': 'application/json',
			},
		});

		if (response.status === 200) {
			const { employee } = await response.json();
			setEmployees(employees.filter((el) => el.name !== employee.name));
			router.replace(router.asPath);
		}
	};

	const handleClick = () => {
		clearErrors('phoneNumbers');
	};

	const handlePayment = () => {
		router.push('/packages');
	};

	const handleMapClick = (mapMouseEvent) => {
		setMapCoordinates(JSON.stringify(mapMouseEvent.latLng));
		setPlaceId(mapMouseEvent.placeId || '');
	};
	useEffect(() => {
		const fetchDetails = async () => {
			if (placeId !== '') {
				const response = await fetch('/api/clinics/getReviews', {
					method: 'POST',
					body: JSON.stringify({ placeId: placeId }),
					headers: {
						'Content-type': 'application/json',
					},
				});

				const { result } = await response.json();

				setRating(result.rating);
			}
		};

		fetchDetails();
		if (placeId === '') setRating('');
	}, [placeId]);

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

	const CaretDownIcon = () => {
		return <AiFillCaretDown size={25} color="#282828" />;
	};

	const DropdownIndicator = (props) => {
		return (
			<components.DropdownIndicator {...props}>
				<CaretDownIcon />
			</components.DropdownIndicator>
		);
	};

	const customStyles = {
		control: (provided, { isDisabled }) => ({
			...provided,
			borderColor: '#727272',
			padding: '4px 16px',
			backgroundColor: isDisabled ? 'rgba(239, 239, 239, 0.3)' : 'white',
		}),
		placeholder: (provided) => ({
			...provided,
			color: '#727272',
			fontSize: '18px',
			fontFamily: 'inherit',
		}),
	};

	//Prevent the form submitting when you click enter
	const preventSubmit = (event) => {
		if (event.keyCode === 13) {
			event.preventDefault();
		}
	};

	return (
		<div>
			<Nav />
			<HeadMeta
				title="Kreiranje ordinacije"
				link={`${process.env.BASE_URL}/create-clinic`}
				content={'superdentals.com'}
				description="Tražite stomatologa po svojoj mjeri? Na pravom ste mjestu."
				image={`${process.env.BASE_URL}/images/logo.jpg`}
			/>

			<section className="min-h-[calc(100vh-(189px*2))]">
				{selectedCountry && (
					<form
						className={`${
							clinic && 'hidden'
						} container mx-auto px-6 md:px-16 min-h-screen py-16 lg:py-10 grid grid-cols-1 lg:grid-cols-2 gap-16`}
						onSubmit={handleSubmit(handleSubmitClinic)}
						onKeyDown={preventSubmit}
					>
						<div className="flex flex-col gap-10">
							<h1 className="text-primaryColor  xl:text-heading text-[32px] font-[700]">Dodaj ordinaciju</h1>
							<div className="flex flex-col gap-16">
								<div className="flex flex-col gap-5">
									<div className="flex flex-col">
										<div className="flex items-center justify-between">
											<label className="text-[#818181] font-semibold text-[18px]">Naziv ordinacije</label>
											<span className="text-[13px] text-[#969494] font-[600]">
												<span className="text-primaryColor">*</span>ovo polje je obavezno
											</span>
										</div>
										<input
											className="clinic-input"
											type="text"
											placeholder="Naziv ordinacije"
											{...register('clinicName', {
												required: { value: true, message: 'Naziv ordinacije je obavezno.' },
												maxLength: { value: 32, message: 'Maksimalna dužina je 32 karaktera.' },
											})}
										/>
										{errors.clinicName && (
											<span className="text-primaryColor font-[500]">{errors.clinicName?.message}</span>
										)}
									</div>
									<div className="flex flex-col">
										<div className="flex items-center justify-between">
											<label className="text-[#818181] font-semibold text-[18px]">Korisničko ime</label>
											<span className="text-[13px] text-[#969494] font-[600]">
												<span className="text-primaryColor">*</span>ovo polje je obavezno
											</span>
										</div>

										<input
											type="text"
											className="clinic-input disabled cursor-not-allowed"
											disabled
											placeholder="Korisničko ime"
											{...register('username')}
										/>
									</div>
									<div className="flex flex-col">
										<div className="flex items-center justify-between">
											<label className="text-[#818181] font-semibold text-[18px]">JIB/PIB</label>
											<span className="text-[13px] text-[#969494] font-[600]">
												<span className="text-primaryColor">*</span>ovo polje je obavezno
											</span>
										</div>
										<input
											className="clinic-input"
											type="text"
											placeholder="JIB/PIB"
											{...register('jib', { required: true })}
										/>
										{errors.jib?.type === 'required' && (
											<span className="text-primaryColor font-[500]">JIB/PIB je obavezan.</span>
										)}
									</div>
									<div className="flex flex-col">
										<label className="text-[#818181] font-semibold text-[18px]">PDV</label>
										<input className="clinic-input" type="text" placeholder="PDV" {...register('pdv')} />
									</div>

									<div className="flex flex-col">
										<div className="flex items-center justify-between">
											<label className="text-[#818181] font-semibold text-[18px]">Adresa</label>
											<span className="text-[13px] text-[#969494] font-[600]">
												<span className="text-primaryColor">*</span>ovo polje je obavezno
											</span>
										</div>
										<input
											className="clinic-input"
											type="text"
											placeholder="Adresa"
											{...register('address', { required: true })}
										/>
										{errors.address?.type === 'required' && (
											<span className="text-primaryColor font-[500]">Adresa je obavezna.</span>
										)}
									</div>
									<div className="flex flex-col">
										<div className="flex items-center justify-between">
											<label className="text-[#818181] font-semibold text-[18px]">Izaberite državu</label>
											<span className="text-[13px] text-[#969494] font-[600]">
												<span className="text-primaryColor">*</span>ovo polje je obavezno
											</span>
										</div>
										<select
											disabled={true}
											placeholder="Izaberite državu"
											className="clinic-input py-[15px] text-[#727272] appearance-none disabled:text-black disabled:border-black disabled:bg-gray-100"
											{...register('country', {
												required: true,
												value: selectedCountry,
												onChange: (e) => setCountry(e.target.value),
											})}
										>
											<option value="" className="invisible">
												Izaberite državu
											</option>
											<option value="ba">Bosna i Hercegovina</option>
											<option value="rs">Srbija</option>
											<option value="cg">Crna Gora</option>
										</select>
										{errors.country?.type === 'required' && (
											<span className="text-primaryColor font-[500]">Država je obavezna.</span>
										)}
									</div>
									<div className="flex flex-col">
										<div className="flex items-center justify-between">
											<label className="text-[#818181] font-semibold text-[18px]">Izaberite grad</label>
											<span className="text-[13px] text-[#969494] font-[600]">
												<span className="text-primaryColor">*</span>ovo polje je obavezno
											</span>
										</div>
										<Controller
											control={control}
											name="city"
											rules={{ required: true }}
											render={({ field: { onChange } }) => (
												<Select
													styles={customStyles}
													placeholder="Izaberite grad"
													options={filteredCities}
													isDisabled={selectedCountry === '' && true}
													instanceId="selectCity"
													onChange={onChange}
													filterOption={createFilter({ ignoreAccents: false })}
													components={{ Option: CustomOption, DropdownIndicator }}
													theme={(theme) => ({
														...theme,
														borderRadius: 8,
													})}
												/>
											)}
										/>
										{errors.city?.type === 'required' && (
											<span className="text-primaryColor font-[500]">Grad je obavezan.</span>
										)}
									</div>
									<div className="flex flex-col">
										<label className="text-[#818181] font-semibold text-[18px]">Izaberite vašu lokaciju na mapi</label>
										<input
											disabled={true}
											className="clinic-input"
											type="text"
											placeholder="Izaberite vašu lokaciju na mapi"
											value={mapCoordinates}
											{...register('mapCoords')}
										/>
									</div>
									<div className="flex flex-col">
										<label className="text-[#818181] font-semibold text-[18px]">
											Google {t('form.text-1')} ordinacije
										</label>
										<input
											className="clinic-input w-full"
											disabled={true}
											type="text"
											placeholder="Google Rating"
											value={rating}
											{...register('rating')}
										/>
										<p className="font-[500]">
											Kako bismo popunili ovaj podatak označite tačnu lokaciju vaše ordinacije na mapi
										</p>
									</div>
								</div>
								<div className="flex flex-col gap-5">
									<div className="flex flex-col">
										<div className="flex items-center justify-between">
											<label className="text-[#818181] font-semibold text-[18px]">Email</label>
											<span className="text-[13px] text-[#969494] font-[600]">
												<span className="text-primaryColor">*</span>ovo polje je obavezno
											</span>
										</div>

										<input
											className="clinic-input"
											type="text"
											placeholder="Email"
											{...register('email', { required: true })}
										/>
										{errors.email?.type === 'required' && (
											<span className="text-primaryColor font-[500]">Email je obavezan.</span>
										)}
									</div>
									<div className="flex flex-col">
										<label className="text-[#818181] font-semibold text-[18px]">Facebook</label>
										<input className="clinic-input" type="text" placeholder="Facebook" {...register('facebook')} />
									</div>
									<div className="flex flex-col">
										<label className="text-[#818181] font-semibold text-[18px]">Instagram</label>
										<input className="clinic-input" type="text" placeholder="Instagram" {...register('instagram')} />
									</div>
									<div className="flex flex-col">
										<label className="text-[#818181] font-semibold text-[18px]">TikTok</label>
										<input className="clinic-input" type="text" placeholder="TikTok" {...register('tiktok')} />
									</div>
									<div className="flex flex-col">
										<label className="text-[#818181] font-semibold text-[18px]">LinkedIn</label>
										<input className="clinic-input" type="text" placeholder="LinkedIn" {...register('linkedin')} />
									</div>
									<div className="flex flex-col">
										<label className="text-[#818181] font-semibold text-[18px]">Twitter</label>
										<input className="clinic-input" type="text" placeholder="Twitter" {...register('twitter')} />
									</div>
									<div className="flex flex-col">
										<label className="text-[#818181] font-semibold text-[18px]">Website</label>
										<input className="clinic-input" type="text" placeholder="Website" {...register('website')} />
									</div>
								</div>

								<div className="flex flex-col gap-3">
									<div className="flex items-center justify-between">
										<h2 className="text-[#282828] text-[24px] font-[700]">Usluge</h2>
										<span className="text-[13px] text-[#969494] font-[600]">
											<span className="text-primaryColor">*</span>minimalno jedna usluga je obavezna
										</span>
									</div>
									<div className="flex flex-col">
										<p className="font-[500]">
											Unos {t('form.text-2')} (valuta EUR) nije obavezan, ali će se u slučaju unosa prikazivati na vašem
											profilu kao neobavezujuća, {t('form.text-3')}, informacija za vaše potencijalne pacijente.
											Preporučujemo da unesete najnižu {t('form.text-10')} iz definisane oblasti.
										</p>
										<div className="self-end">
											<span className="text-right">(Vaša valuta je EUR)</span>
										</div>
									</div>

									<div className="flex flex-col gap-8">
										{services.map((service) => (
											<div key={service.id} className="flex flex-col xl:flex-row justify-between gap-4">
												<label
													className="clinic-input flex items-center justify-between basis-[70%]"
													htmlFor={service.id}
												>
													{getServiceName(service, locale, true)}
													<input
														className="h-[24px] w-[24px] checkbox checkbox-secondary"
														type="checkbox"
														id={service.id}
														value={service.id}
														{...register('service', {
															required: {
																value: true,
															},
														})}
														onChange={(e) => handleSelectService(e, service)}
													/>
												</label>

												<input
													type="number"
													min="0"
													onKeyDown={(e) => filterNumberInput(e)}
													className="clinic-input basis-[0%]"
													placeholder={t('form.text-4')}
													onChange={(e) => handlePriceChange(e, service)}
													ref={priceInputRefArray.current.find((ref) => ref.id === service.id).ref}
												/>
											</div>
										))}
									</div>
									<div className="flex justify-between">
										<div>
											{errors.service?.type === 'required' && (
												<span className="text-primaryColor font-[500]">Morate izabrati bar jednu uslugu.</span>
											)}
										</div>
									</div>
								</div>
								<div className="flex flex-col gap-5">
									<div className="flex flex-col">
										<div className="flex items-center justify-between">
											<label className="text-[#818181] font-semibold text-[18px]">Broj ordinacija</label>
											<span className="text-[13px] text-[#969494] font-[600]">
												<span className="text-primaryColor">*</span>ovo polje je obavezno
											</span>
										</div>
										<input
											className="clinic-input"
											type="number"
											min="0"
											onKeyDown={(e) => filterNumberInput(e)}
											placeholder="Broj ordinacija"
											{...register('clinicsNumber', { required: true })}
										/>
										{errors.clinicsNumber?.type === 'required' && (
											<span className="text-primaryColor font-[500]">Broj ordinacija je obavezan.</span>
										)}
									</div>
									<div className="flex flex-col">
										<label className="text-[#818181] font-semibold text-[18px]">Godine poslovanja</label>
										<input
											className="clinic-input"
											type="number"
											min="0"
											onKeyDown={(e) => filterNumberInput(e)}
											placeholder="Godine poslovanja"
											{...register('yearsInService')}
										/>
									</div>
									<div className="flex flex-col">
										<label className="text-[#818181] font-semibold text-[18px]">Broj doktora</label>
										<input
											className="clinic-input"
											type="number"
											min="0"
											onKeyDown={(e) => filterNumberInput(e)}
											placeholder="Broj doktora"
											{...register('doctorsNumber')}
										/>
									</div>
									<div className="flex flex-col">
										<label className="text-[#818181] font-semibold text-[18px]">Broj osoblja</label>
										<input
											className="clinic-input"
											type="number"
											min="0"
											onKeyDown={(e) => filterNumberInput(e)}
											placeholder="Broj osoblja"
											{...register('staffNumber')}
										/>
									</div>
								</div>
								<div className="flex flex-col gap-5">
									<div className="flex flex-col">
										<label className="text-[#818181] font-semibold text-[18px]">
											Izaberite jezike koje koristite (označite sve opcije koje vam odgovaraju):
										</label>
										<Controller
											control={control}
											name="languages"
											render={({ field: { onChange } }) => (
												<Select
													styles={customStyles}
													placeholder="Izaberite jezike"
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
													components={{ DropdownIndicator }}
													theme={(theme) => ({
														...theme,
														borderRadius: 8,
													})}
												/>
											)}
										/>
									</div>
									<div className="flex flex-col gap-5">
										<h2 className="text-[#282828] text-[22px] font-[700]">
											Označite šta je dostupno u vašoj ordinaciji:
										</h2>
										<div className="flex flex-col">
											<label className="text-[#818181] font-semibold text-[18px]">Plaćanje karticom</label>
											<div className="flex gap-2 items-center justify-center">
												<label
													className="clinic-input  w-full flex items-center justify-between"
													htmlFor="creditCardPayment"
												>
													<span className="text-[18px] text-[#727272]">Plaćanje karticom</span>
													<input
														className="w-[22px] h-[22px] checkbox checkbox-secondary"
														type="checkbox"
														id="creditCardPayment"
														{...register('creditCardPayment')}
													/>
												</label>
											</div>
										</div>
										<div className="flex flex-col">
											<label className="text-[#818181] font-semibold text-[18px]">WiFi</label>
											<div className="flex gap-2 items-center justify-center">
												<label
													className="clinic-input  w-full flex items-center justify-between"
													htmlFor="wifiAvailable"
												>
													<span className="text-[18px] text-[#727272]">WiFi</span>
													<input
														className="w-[22px] h-[22px] checkbox checkbox-secondary"
														type="checkbox"
														id="wifiAvailable"
														{...register('wifiAvailable')}
													/>
												</label>
											</div>
										</div>
										<div className="flex flex-col">
											<label className="text-[#818181] font-semibold text-[18px]">Parking</label>
											<div className="flex gap-2 items-center justify-center">
												<label
													className="clinic-input  w-full flex items-center justify-between"
													htmlFor="parkingAvailable"
												>
													<span className="text-[18px] text-[#727272]">Parking</span>
													<input
														className="w-[22px] h-[22px] checkbox checkbox-secondary"
														type="checkbox"
														id="parkingAvailable"
														{...register('parkingAvailable')}
													/>
												</label>
											</div>
										</div>
										<div className="flex flex-col">
											<label className="text-[#818181] font-semibold text-[18px]">Garancija na usluge</label>
											<div className="flex gap-2 items-center justify-center">
												<label
													className="clinic-input  w-full flex items-center justify-between"
													htmlFor="warrantyProvided"
												>
													<span className="text-[18px] text-[#727272]">Garancija na usluge</span>
													<input
														className="w-[22px] h-[22px] checkbox checkbox-secondary"
														type="checkbox"
														id="warrantyProvided"
														{...register('warrantyProvided')}
													/>
												</label>
											</div>
										</div>
										<div className="flex flex-col">
											<label className="text-[#818181] font-semibold text-[18px]">Dostupnost za hitne slučajeve</label>
											<div className="flex gap-2 items-center justify-center">
												<label
													className="clinic-input w-full  flex items-center justify-between"
													htmlFor="emergencyAvailability"
												>
													<span className="text-[18px] text-[#727272]">Dostupnost za hitne slučajeve</span>
													<input
														className="w-[22px] h-[22px] checkbox checkbox-secondary"
														type="checkbox"
														id="emergencyAvailability"
														{...register('emergencyAvailability')}
													/>
												</label>
											</div>
										</div>
										<div className="flex flex-col">
											<label className="text-[#818181] font-semibold text-[18px]">Prvi pregled besplatan</label>
											<div className="flex gap-2 items-center justify-center">
												<label
													className="clinic-input w-full  flex items-center justify-between"
													htmlFor="firstCheckupIsFree"
												>
													<span className="text-[18px] text-[#727272]">Prvi pregled besplatan</span>
													<input
														className="w-[22px] h-[22px] checkbox checkbox-secondary"
														type="checkbox"
														id="firstCheckupIsFree"
														{...register('firstCheckupIsFree')}
													/>
												</label>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
						<div className="mt-5 flex flex-col lg:gap-14 gap-10">
							<div>
								{isLoaded && city !== '' && (
									<>
										<AutoComplete setMapCoordinates={setMapCoordinates} setRating={setRating} />
										<GoogleMap
											center={center}
											zoom={13}
											mapContainerStyle={{ width: '100%', height: '360px' }}
											onClick={(mapMouseEvent) => handleMapClick(mapMouseEvent)}
										>
											<MarkerF position={mapCoordinates !== '' && JSON.parse(mapCoordinates)} />
										</GoogleMap>
									</>
								)}
							</div>

							<div>
								<PhoneNumbers control={control} register={register} errors={errors} />
								{errors.phoneNumbers?.type === 'required' && (
									<span className="text-primaryColor font-[500]">{errors.phoneNumbers.message}</span>
								)}
							</div>
							<div>
								<WorkHours control={control} register={register} errors={errors} />
							</div>
							<div className="flex flex-col gap-5">
								<div>
									<ImageUpload
										inputStyle="w-[0.1px] h-[0.1px] opacity-0 overflow-hidden absolute z-[-1]"
										labelId="addAlbumImage"
										containerStyle="mb-2 flex flex-col"
										labelStyle="text-primary font-bold"
										inputLabelStyle="button font-[600] cursor-pointer"
										inputLabelText="Dodaj album sa fotografijama"
										callback={handleAlbumImage}
									/>
									<p className="text-[15px]">Preporučene dimenzije za Album su 1055 x 500 pixela</p>
									<div className="w-full">
										<ImageList
											images={renderImages}
											remove={removeAlbumImage}
											width={190}
											height={120}
											imageStyle="rounded-[8px] animate-pulse"
											imageContainerStyle="flex"
										/>
									</div>
								</div>
								<div>
									<ImageUpload
										inputStyle="w-[0.1px] h-[0.1px] opacity-0 overflow-hidden absolute z-[-1]"
										labelId="addLogoImage"
										containerStyle="mb-2 flex flex-col"
										labelStyle="text-primary font-bold"
										inputLabelStyle="button font-[600] cursor-pointer"
										inputLabelText="Dodaj logo ordinacije"
										callback={handleLogo}
									/>
									<p className="text-[15px]">Preporučene dimenzije za Logo su 200 x 200 pixela</p>
									{renderLogo ? (
										<div className="flex justify-center lg:justify-start">
											<Image
												className="rounded-[8px] animate-pulse"
												src={renderLogo}
												alt="upload logo"
												width={120}
												height={120}
											/>
											<AiOutlineCloseCircle
												onClick={() => {
													setRenderLogo(null);
													setUploadLogo(null);
												}}
												size={30}
												color="#FC5122"
											/>
										</div>
									) : (
										<p></p>
									)}
								</div>
								<div>
									<ImageUpload
										inputStyle="w-[0.1px] h-[0.1px] opacity-0 overflow-hidden absolute z-[-1]"
										labelId="addFeaturedImage"
										containerStyle="mb-2 flex flex-col"
										labelStyle="text-primary font-bold"
										inputLabelStyle="button font-[600] cursor-pointer"
										inputLabelText="Dodaj naslovnu fotografiju"
										callback={handleFeaturedImage}
									/>
									<p className="text-[15px]">Preporučene dimenzije za Naslovnu su 1055 x 500 pixela</p>
									{renderFeaturedImage ? (
										<div className="flex justify-center lg:justify-start">
											<Image
												className="rounded-[8px] animate-pulse"
												src={renderFeaturedImage}
												alt="upload featured image"
												width={250}
												height={150}
											/>
											<AiOutlineCloseCircle
												onClick={() => {
													setRenderFeaturedImage(null);
													setUploadFeaturedImage(null);
												}}
												size={30}
												color="#FC5122"
											/>
										</div>
									) : (
										<></>
									)}
								</div>
								<div className="flex flex-col gap-2">
									<p className="button gap-1 disabled cursor-not-allowed">Dodaj video</p>
									<span className="text-secondary text-[16px] md:text-[18px] font-[600]">
										Video materijale pošaljite na{' '}
										<a href="mailto:info@superdentals.com">
											<span className="underline cursor-pointer font-bold text-primaryColor">
												info@superdentals.com
											</span>
										</a>{' '}
										sa nazivom ordinacije u predmetu maila, a administrator će isti postaviti na profil vaše ordinacije
									</span>
								</div>
							</div>
							<div>
								<h2 className="text-[282828] font-[700] text-[20px] text-center mb-5">Dodajte opise</h2>
								<p className="mb-4">
									(Preporučujemo da dodatni opis o ordinaciji postavite na više jezika, a izbor vršite klikom na
									zastavicu.)
								</p>
								<DescriptionModals />
							</div>
						</div>
						<div></div>
						<div className="flex lg:justify-end">
							<button onClick={handleClick} className="button font-[600] px-10 lg:w-[60%]" disabled={isSubmitting}>
								Dodaj ordinaciju
								<FiChevronRight color="white" size={30} fontWeight={700} />
							</button>
						</div>
					</form>
				)}
				{clinic && (
					<div>
						<div className="flex flex-col container mx-auto px-6 md:px-16 pt-10">
							{employees.length === 0 ? (
								<span></span>
							) : (
								<h1 className="text-primaryColor text-[32px]  font-bold">Zaposleni</h1>
							)}
							{employees?.length > 0 && (
								<table className="w-full flex flex-row flex-no-wrap lg:bg-white rounded-lg overflow-hidden lg:shadow-lg my-5">
									<thead className="text-white text-[20px]">
										{employees
											?.sort((a) => (a?.type === 'doctor' ? -1 : 1))
											?.map((employee) => (
												<tr
													key={employee.id}
													className="bg-primaryColor flex flex-col flex-no wrap lg:table-row rounded-l-lg lg:rounded-none mb-2 lg:mb-0"
												>
													<th className="p-3 text-left h-[55px] lg:h-auto">Ime</th>
													<th className="p-3 text-left h-[55px] lg:h-auto">Prezime</th>
													<th className="p-3 text-left h-[55px] lg:h-auto">Titula</th>

													<th className="p-3 text-left h-[55px] lg:h-auto">Tip</th>
													<th className="p-3 text-left h-[105px] lg:h-auto">Slika</th>
													<th className="p-3 text-left h-[76px] lg:h-auto">Akcija</th>
												</tr>
											))}
									</thead>

									<tbody className="text-[20px] text-[#727272] font-[600] flex-1 lg:flex-none">
										{employees?.map((employee, i) => (
											<tr key={i} className="flex flex-col flex-no wrap lg:table-row mb-2 lg:mb-0">
												<td className="border-grey-light border hover:bg-gray-100 p-3">{employee.name}</td>
												<td className="border-grey-light border hover:bg-gray-100 p-3 truncate">{employee.surname}</td>
												<td className="border-grey-light border hover:bg-gray-100 p-3 truncate">{employee.title}</td>
												<td className="border-grey-light border hover:bg-gray-100 p-3 truncate">{employee.type}</td>
												<td className="border-grey-light border hover:bg-gray-100 p-3 truncate">
													{employee?.images ? (
														<ImageDisplay
															images={employee.images}
															imageType="EMPLOYEE"
															imageFrom="employee"
															id={employee?.id}
															layout="fill"
															imageStyle="rounded-xl"
															imageContainerStyle="relative w-[80px] h-[80px]"
														/>
													) : (
														<div className="relative h-[80px] w-[80px]">
															<Image
																src="/placeholder-images/employee-placeholder.png"
																alt="Employee Placeholder"
																layout="fill"
																className="rounded-[8px]"
															/>
														</div>
													)}
												</td>

												<td className="border-grey-light border hover:bg-gray-100 p-3 truncate">
													<div className="flex items-center gap-2">
														<div
															className="bg-primaryColor rounded-[8px] min-h-[50px] min-w-[50px] flex justify-center items-center cursor-pointer"
															onClick={() => deleteEmployee(employee.id)}
														>
															<AiFillDelete color="white" size={25} />
														</div>
													</div>
												</td>
											</tr>
										))}
									</tbody>
								</table>
							)}

							{employees.length !== 0 ? (
								<div className="flex justify-end">
									<AddEmployee clinicId={clinic.id} />
								</div>
							) : (
								<div className="flex justify-center">
									<AddEmployee clinicId={clinic.id} />
								</div>
							)}
						</div>
						<div className="container mx-auto px-6 md:px-16 flex justify-end mt-5 pb-10">
							<button onClick={handlePayment} className="button  font-[600]">
								Nastavi
								<FiChevronRight color="white" size={30} fontWeight={700} />
							</button>
						</div>
					</div>
				)}
			</section>
			<Footer />
		</div>
	);
};

export default Welcome;

export async function getServerSideProps(ctx) {
	const session = await getSession(ctx);

	const user = await prisma.user.findUnique({
		where: {
			id: session.id,
		},
		include: {
			clinics: true,
		},
	});

	if (user?.onboardingComplete && user?.clinics?.length !== 0) {
		return {
			redirect: {
				destination: '/',
				permanent: false,
			},
		};
	}

	// Get all services
	const services = await prisma.service.findMany({
		orderBy: {
			order: 'asc',
		},
	});

	// Get all cities
	const cities = await prisma.location.findMany({
		orderBy: [
			{
				cityName: 'asc',
			},
		],
	});

	return {
		props: {
			user,
			services,
			cities,
			session,
		},
	};
}
