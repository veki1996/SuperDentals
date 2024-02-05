import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import Select, { components } from 'react-select';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import { Services, WorkHours } from '../clinic';
import { ImageDisplay, ImageUpload, ImageList, EditEmployee, AddEmployee, DescriptionModals } from '/components';
import { addNewImage, imageDimensions } from '/utils/image';
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
import { AiFillCaretDown, AiOutlineCloseCircle, AiFillDelete } from 'react-icons/ai';
import { BsCheckLg } from 'react-icons/bs';
import {
	Chart as ChartJS,
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Title,
	Tooltip,
	Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

import { languageOptions } from '/utils/filterOptions';
import { filterNumberInput, getClinicDescription } from '/utils/utils';
import useTranslation from 'next-translate/useTranslation';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const EditClinic = ({ clinic, services, allImages, clinicViews }) => {
	const { t } = useTranslation('create-edit-clinic');

	const router = useRouter();

	const imageWidthLogo = imageDimensions.logo[0];
	const imageHeightLogo = imageDimensions.logo[1];
	const imageWidthAlbum = imageDimensions.album[0];
	const imageHeightAlbum = imageDimensions.album[1];
	const imageWidthFeaturedImage = imageDimensions.featured[0];
	const imageHeightFeaturedImage = imageDimensions.featured[1];

	// States
	const [success, setSuccess] = useState('');
	const [selectedServices, setSelectedServices] = useState([]);
	const [uploadLogo, setUploadLogo] = useState(null);
	const [renderLogo, setRenderLogo] = useState('');
	const [renderImages, setRenderImages] = useState([]);
	const [uploadFeaturedImage, setUploadFeaturedImage] = useState(null);
	const [renderFeaturedImage, setRenderFeaturedImage] = useState('');
	const [selectedViewsFilter, setSelectedViewsFilter] = useState('allTime');
	const [filteredClinicViews, setFilteredClinicViews] = useState(clinicViews);
	const [startDate, setStartDate] = useState('');
	const [endDate, setEndDate] = useState('');
	const [images, setImages] = useAtom(imagesAtom);

	// Description Atoms
	const [rsDescription, setRsDescription] = useAtom(rsDescriptionAtom);
	const [baDescription, setBaDescription] = useAtom(baDescriptionAtom);
	const [hrDescription, setHrDescription] = useAtom(hrDescriptionAtom);
	const [meDescription, setMeDescription] = useAtom(meDescriptionAtom);
	const [siDescription, setSiDescription] = useAtom(siDescriptionAtom);
	const [gbDescription, setGbDescription] = useAtom(gbDescriptionAtom);
	const [deDescription, setDeDescription] = useAtom(deDescriptionAtom);
	const [itDescription, setItDescription] = useAtom(itDescriptionAtom);

	const currentLogo = allImages.filter((image) => {
		if (image.imageUsage === 'LOGO' && image.clinicId === clinic.id) return true;
	});

	const currentFeaturedImage = allImages.filter((image) => {
		if (image.imageUsage === 'FEATURED' && image.clinicId === clinic.id) return true;
	});

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

		const selectedService = { id: service.id, name: service.name, price };
		if (e.target.checked) {
			setSelectedServices([...selectedServices, selectedService]);
		} else {
			setSelectedServices(selectedServices.filter((s) => s.id !== service.id));
		}
	};
	const handlePriceChange = (e, service) => {
		const price = e.target.value;
		const selectedService = { id: service.id, name: service.name, price };
		//if service is already selected, update the price
		if (selectedServices.find((s) => s.id === service.id)) {
			setSelectedServices(selectedServices.map((s) => (s.id === service.id ? selectedService : s)));
		}
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
					name: s.service.name,
					price: s.price,
				};
			}),
		);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

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
		if (numberFields.length >= 8) return;
		numberAppend({ numberType: '', number: '' });
	};

	const handleRemoveNumber = (index) => {
		numberRemove(index);
	};

	const handleSubmitClinic = async (data) => {
		data.clinicId = clinic.id;
		data.userId = clinic.userId;
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
		const response = await fetch('/api/clinics/edit', {
			method: 'POST',
			body: JSON.stringify(data),
			headers: {
				'Content-type': 'application/json',
			},
		});
		if (response.status === 200) {
			setImages([]);
			setUploadLogo(null);
			setRenderImages([]);
			setRenderLogo('');
			setRenderFeaturedImage('');
			setSuccess('Uspješno ste uredili ordinaciju');
			router.replace(router.asPath, undefined, { scroll: false });

			setTimeout(() => {
				setSuccess('');
			}, 2000);
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
			padding: '4px',
			backgroundColor: isDisabled ? 'rgba(239, 239, 239, 0.3)' : 'white',
		}),
		placeholder: (provided) => ({
			...provided,
			color: '#727272',
			fontSize: '18px',
			fontFamily: 'inherit',
		}),
	};

	const totalViews =
		clinicViews.length > 0
			? filteredClinicViews?.reduce((acc, value) => {
					return acc + value.views;
			  }, 0)
			: '0';

	const data = {
		labels: filteredClinicViews
			.sort((a, b) => {
				return new Date(a.createdAt) - new Date(b.createdAt);
			})
			.map((clinicView) => {
				const date = new Date(clinicView?.createdAt);
				return date?.toLocaleDateString('de-DE');
			}),
		datasets: [
			{
				label: 'Pregledi',
				data: filteredClinicViews.map((cliniView) => cliniView.views),
				borderColor: '#FC5122',
				backgroundColor: 'rgba(255, 99, 132, 0.5)',
			},
		],
	};

	const options = {
		responsive: true,
		plugins: {
			title: {
				display: true,
				text:
					selectedViewsFilter === 'lastWeek'
						? 'Pregledi prošle sedmice'
						: selectedViewsFilter === 'lastMonth'
						? `Pregledi prošlog ${t('form.text-8')}a`
						: selectedViewsFilter === 'currentDay'
						? 'Pregledi danas'
						: selectedViewsFilter === 'currentMonth'
						? `Pregledi ovaj ${t('form.text-8')}`
						: selectedViewsFilter === 'allTime'
						? `Pregledi sve ${t('form.text-7')}`
						: 'Pregledi ove godine',
			},
		},
	};

	const changeViewsData = async (e) => {
		const dateRange = e.target.value;
		setSelectedViewsFilter(e.target.value);

		const response = await fetch('/api/clinics/getViews', {
			method: 'POST',
			body: JSON.stringify({ dateRange: dateRange, clinicId: clinic?.id }),
			headers: {
				'Content-Type': 'application/json',
			},
		});

		if (response.status === 200) {
			const { views } = await response.json();
			setFilteredClinicViews(views);
		}
	};

	const handleCustomDate = async () => {
		if (startDate !== '' && endDate !== '') {
			const response = await fetch('/api/clinics/customRangeViews', {
				method: 'POST',
				body: JSON.stringify({ startDate: startDate, endDate: endDate, clinicId: clinic?.id }),
				headers: {
					'Content-Type': 'application/json',
				},
			});

			if (response.status === 200) {
				const { views } = await response.json();
				setFilteredClinicViews(views);
			}
		} else {
			alert('Morate izabrati početni i krajnji datum!');
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
			await response.json();
			router.replace(router.asPath);
		}
	};

	return (
		<div>
			<div className="container mx-auto px-6 md:px-16 mt-10">
				<h1 className="text-primaryColor text-[32px] md:text-heading font-[700]">Uredi ordinaciju</h1>
				{clinic.employees.length === 0 ? (
					<span></span>
				) : (
					<h2 className="text-[#282828] text-[24px] font-[700]">Zaposleni</h2>
				)}
				<table className="w-full flex flex-row flex-no-wrap lg:bg-white rounded-lg overflow-hidden lg:shadow-lg mb-5">
					<thead className="text-white text-[18px]">
						{clinic?.employees
							?.sort((a, b) => {
								if (a.type === 'doctor' && b.type !== 'doctor') return -1;
								if (a.type !== 'doctor' && b.type === 'doctor') return 1;

								const updatedAtA = new Date(a.updatedAt).getTime();
								const updatedAtB = new Date(b.updatedAt).getTime();
								return updatedAtA - updatedAtB;
							})
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

					<tbody className="text-[18px] text-[#727272] font-[600] flex-1 lg:flex-none">
						{clinic?.employees?.map((employee, i) => (
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
										<EditEmployee employee={employee} clinicId={clinic?.id} />

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
				<div></div>
				{clinic.employees.length !== 0 ? (
					<div className="flex justify-end">
						<AddEmployee clinicId={clinic.id} />
					</div>
				) : (
					<AddEmployee clinicId={clinic.id} />
				)}
			</div>
			<form
				className="container mx-auto px-6 md:px-16 min-h-screen py-16 lg:py-10 grid grid-cols-1 lg:grid-cols-2 gap-16"
				onSubmit={handleSubmit(handleSubmitClinic)}
			>
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
								defaultValue={clinic?.name}
								{...register('clinicName', {
									required: { value: true, message: 'Naziv ordinacije je obavezno.' },
									maxLength: { value: 32, message: 'Maksimalna dužina je 32 karaktera.' },
								})}
							/>
							{errors.clinicName && <span className="text-primaryColor font-[500]">{errors?.clinicName?.message}</span>}
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
								placeholder="Korisničko ime"
								disabled
								defaultValue={clinic?.username}
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
								defaultValue={clinic?.jib}
								{...register('jib', { required: true })}
							/>
							{errors.jib?.type === 'required' && (
								<span className="text-primaryColor font-[500]">JIB/PIB je obavezan.</span>
							)}
						</div>
						<div className="flex flex-col">
							<label className="text-[#818181] font-semibold text-[18px]">PDV</label>
							<input
								className="clinic-input"
								type="text"
								placeholder="PDV"
								defaultValue={clinic?.pdv}
								{...register('pdv')}
							/>
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
								defaultValue={clinic?.address}
								{...register('address', { required: true })}
							/>
							{errors.address?.type === 'required' && (
								<span className="text-primaryColor font-[500]">Adresa je obavezna.</span>
							)}
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
								defaultValue={clinic?.email}
								{...register('email', { required: true })}
							/>
							{errors.email?.type === 'required' && (
								<span className="text-primaryColor font-[500]">Email je obavezan.</span>
							)}
						</div>

						<div className="flex flex-col">
							<label className="text-[#818181] font-semibold text-[18px]">Facebook</label>
							<input
								className="clinic-input"
								type="text"
								placeholder="Facebook"
								defaultValue={clinic?.facebook}
								{...register('facebook')}
							/>
						</div>
						<div className="flex flex-col">
							<label className="text-[#818181] font-semibold text-[18px]">Instagram</label>
							<input
								className="clinic-input"
								type="text"
								placeholder="Instagram"
								defaultValue={clinic?.instagram}
								{...register('instagram')}
							/>
						</div>
						<div className="flex flex-col">
							<label className="text-[#818181] font-semibold text-[18px]">TikTok</label>
							<input
								className="clinic-input"
								type="text"
								placeholder="TikTok"
								defaultValue={clinic?.tiktok}
								{...register('tiktok')}
							/>
						</div>
						<div className="flex flex-col">
							<label className="text-[#818181] font-semibold text-[18px]">LinkedIn</label>
							<input
								className="clinic-input"
								type="text"
								placeholder="LinkedIn"
								defaultValue={clinic?.linkedin}
								{...register('linkedin')}
							/>
						</div>
						<div className="flex flex-col">
							<label className="text-[#818181] font-semibold text-[18px]">Twitter</label>
							<input
								className="clinic-input"
								type="text"
								placeholder="Twitter"
								defaultValue={clinic?.twitter}
								{...register('twitter')}
							/>
						</div>
						<div className="flex flex-col">
							<label className="text-[#818181] font-semibold text-[18px]">Website</label>
							<input
								className="clinic-input"
								type="text"
								placeholder="Website"
								defaultValue={clinic?.website}
								{...register('website')}
							/>
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
								profilu kao neobavezujuća, {t('form.text-3')}, informacija za vaše potencijalne pacijente. Preporučujemo
								da unesete najnižu {t('form.text-10')} iz definisane oblasti.
							</p>
							<div className="self-end">
								<span className="text-right">(Vaša valuta je EUR)</span>
							</div>
						</div>
						<Services
							services={services}
							clinic={clinic}
							onChangeService={handleSelectService}
							onChangePrice={handlePriceChange}
							priceInputRefArray={priceInputRefArray}
							errors={errors}
							register={register}
						/>
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
								defaultValue={clinic?.numberOfOffices}
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
								defaultValue={clinic?.yearsInService}
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
								defaultValue={clinic?.numberOfDoctors}
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
								defaultValue={clinic?.numberOfStaff}
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
										defaultValue={JSON.parse(clinic.languagesSpoken)?.map((lang) => {
											return languageOptions?.find((language) => {
												if (language.value === lang.value) {
													return language;
												}
											});
										})}
										theme={(theme) => ({
											...theme,
											borderRadius: 8,
										})}
									/>
								)}
							/>
						</div>

						<div className="flex flex-col gap-5">
							<h2 className="text-[#282828] text-[22px] font-[700]">Označite šta je dostupno u vašoj ordinaciji:</h2>
							<div className="flex flex-col">
								<label className="text-[#818181] font-semibold text-[18px]">Plaćanje karticom</label>
								<div className="flex gap-2  justify-center flex-col">
									<label className="clinic-input w-full flex items-center justify-between" htmlFor="creditCardPayment">
										<span className="text-[18px] text-[#727272]">Plaćanje karticom</span>
										<input
											className="w-[22px] h-[22px] checkbox checkbox-secondary"
											type="checkbox"
											id="creditCardPayment"
											defaultChecked={clinic?.creditCardPaymentAvailable}
											{...register('creditCardPayment')}
										/>
									</label>
								</div>
							</div>
							<div className="flex flex-col">
								<label className="text-[#818181] font-semibold text-[18px]">WiFi</label>
								<div className="flex gap-2 flex-col justify-center">
									<label className="clinic-input w-full flex items-center justify-between" htmlFor="wifiAvailable">
										<span className="text-[18px] text-[#727272]">WiFi</span>
										<input
											className="w-[22px] h-[22px] checkbox checkbox-secondary"
											type="checkbox"
											id="wifiAvailable"
											defaultChecked={clinic?.wifiAvailable}
											{...register('wifiAvailable')}
										/>
									</label>
								</div>
							</div>
							<div className="flex flex-col">
								<label className="text-[#818181] font-semibold text-[18px]">Parking</label>
								<div className="flex gap-2  justify-center flex-col">
									<label className="clinic-input w-full flex items-center justify-between" htmlFor="parkingAvailable">
										<span className="text-[18px] text-[#727272]">Parking</span>
										<input
											className="w-[22px] h-[22px] checkbox checkbox-secondary"
											type="checkbox"
											id="parkingAvailable"
											defaultChecked={clinic?.parkingAvailable}
											{...register('parkingAvailable')}
										/>
									</label>
								</div>
							</div>
							<div className="flex flex-col">
								<label className="text-[#818181] font-semibold text-[18px]">Garancija na usluge</label>
								<div className="flex gap-2 items-center justify-center">
									<label className="clinic-input w-full flex items-center justify-between" htmlFor="warrantyProvided">
										<span className="text-[18px] text-[#727272]">Garancija na usluge</span>
										<input
											className="w-[22px] h-[22px] checkbox checkbox-secondary"
											type="checkbox"
											id="warrantyProvided"
											defaultChecked={clinic?.warrantyProvided}
											{...register('warrantyProvided')}
										/>
									</label>
								</div>
							</div>
							<div className="flex flex-col">
								<label className="text-[#818181] font-semibold text-[18px]">Dostupnost za hitne slučajeve</label>
								<div className="flex gap-2 items-center justify-center">
									<label
										className="clinic-input w-full flex items-center justify-between"
										htmlFor="emergencyAvailability"
									>
										<span className="text-[18px] text-[#727272]">Dostupnost za hitne slučajeve</span>
										<input
											className="w-[22px] h-[22px] checkbox checkbox-secondary"
											type="checkbox"
											id="emergencyAvailability"
											defaultChecked={clinic?.emergencyAvailability}
											{...register('emergencyAvailability')}
										/>
									</label>
								</div>
							</div>
							<div className="flex flex-col">
								<label className="text-[#818181] font-semibold text-[18px]">Prvi pregled besplatan</label>
								<div className="flex gap-2 items-center justify-center">
									<label className="clinic-input w-full flex items-center justify-between" htmlFor="firstCheckupIsFree">
										<span className="text-[18px] text-[#727272]">Prvi pregled besplatan</span>
										<input
											className="w-[22px] h-[22px] checkbox checkbox-secondary"
											type="checkbox"
											id="firstCheckupIsFree"
											defaultChecked={clinic?.firstCheckupIsFree}
											{...register('firstCheckupIsFree')}
										/>
									</label>
								</div>
							</div>
						</div>
					</div>
					<div className="mt-6 flex flex-col justify-center">
						<select onChange={(e) => changeViewsData(e)} id="countries" className="clinic-input md:w-[40%] py-2 mt-2">
							<option value="" className="invisible">
								Izaberite filter
							</option>
							<option value="allTime">Sve {t('form.text-7')}</option>
							<option value="lastWeek">Prošle sedmice</option>
							<option value="lastMonth">Prošli {t('form.text-8')}</option>
							<option value="currentDay">Ovaj dan</option>
							<option value="currentMonth">Ovaj {t('form.text-8')}</option>
							<option value="currentYear">Ova godina</option>
						</select>
						<div className="mt-3">
							<h1 className="text-[#727272] font-[600] text-[18px]">Izaberite opseg</h1>
							<div className="flex flex-col gap-3">
								<div className="flex flex-col md:flex-row gap-3">
									<div className="flex flex-col">
										<label className="text-[#727272] font-[600]">Od:</label>
										<input
											className="clinic-input py-2"
											type="date"
											value={startDate}
											onChange={(e) => setStartDate(e?.target?.value)}
										/>
									</div>

									<div className="flex flex-col">
										<label className="text-[#727272] font-[600]">Do:</label>
										<input
											className="clinic-input py-2"
											type="date"
											value={endDate}
											onChange={(e) => setEndDate(e?.target?.value)}
										/>
									</div>
								</div>
								<button type="button" onClick={handleCustomDate} className="button py-1 w-[40%]">
									Primjeni
								</button>
							</div>
						</div>
						<div className="text-black text-[26px] font-[700] mt-4">
							Broj pregleda: <span className="text-primaryColor">{totalViews}</span>
						</div>
						<Line options={options} data={data} />
					</div>
				</div>

				<div className="flex flex-col gap-10">
					<div>
						<div className="flex items-center justify-between">
							<h2 className="text-[#282828] text-[24px] font-[700]">Brojevi telefona</h2>
							<span className="text-[13px] text-[#969494] font-[600]">
								<span className="text-primaryColor">*</span>jedan broj je obavezan
							</span>
						</div>
						<div className="flex flex-col gap-12 sm:gap-7 mt-2">
							{numberFields.map((number, i) => (
								<div className="flex flex-col md:flex-row justify-between items-center gap-3" key={i}>
									<div className="flex flex-col gap-2 relative md:min-w-0 w-full">
										<select
											className="clinic-input py-[15px] placeholder:text-[16px] placeholder:text-center min-w-0 appearance-none"
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
											<div className="flex items-center gap-1 absolute sm:bottom-[-25px] bottom-[-45px]">
												<span className="text-primaryColor font-[500]">
													{errors.phoneNumbers?.[i]?.numberType?.message}
												</span>
											</div>
										)}
									</div>
									<div className="flex flex-col gap-2 relative md:min-w-0 w-full">
										<input
											className="clinic-input placeholder:text-[16px] placeholder:text-center"
											type="text"
											placeholder="Broj telefona..."
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
											<div className="flex items-center gap-1 absolute sm:bottom-[-25px] bottom-[-45px]">
												<span className="text-primaryColor font-[500]">
													{errors.phoneNumbers?.[i]?.number?.message}
												</span>
											</div>
										)}
									</div>

									<div
										className="bg-primaryColor rounded-[8px] min-h-[53px] md:min-w-[54px] flex justify-center items-center cursor-pointer  w-full"
										onClick={() => handleRemoveNumber(i)}
									>
										<AiFillDelete color="white" size={25} />
									</div>
								</div>
							))}
							<button className="button font-[600]" type="button" onClick={() => handleAppendNumber()}>
								Dodaj broj
							</button>
							{errors.phoneNumbers?.type === 'required' && (
								<span className="text-red-500">{errors.phoneNumbers.message}</span>
							)}
						</div>
					</div>
					<div>
						<WorkHours control={control} register={register} errors={errors} />
					</div>
					<div className="flex flex-col gap-5">
						{clinic.images?.length > 0 && clinic.images?.some((image) => image.imageUsage === 'ALBUM') && (
							<div className="text-center lg:text-left">
								<span className="text-[20px] font-[700] text-[#727272]">Trenutne album fotografije</span>
								<ImageDisplay
									images={allImages}
									imageType="ALBUM"
									imageFrom="clinic"
									id={clinic.id}
									width={200}
									height={125}
									containerStyle="flex justify-center lg:justify-start gap-3 flex-wrap mt-2"
									imageContainerStyle="flex"
									imageStyle="rounded-[8px]"
									deleteIconStyle="cursor-pointer"
									deleteButton={true}
									handleDeleteImage={handleDeleteImage}
								/>
							</div>
						)}
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
							{clinic.images?.length > 0 && clinic.images?.some((image) => image.imageUsage === 'LOGO') && (
								<div className="mb-5 text-center lg:text-left">
									<span className="text-[20px] font-[700] text-[#727272]">Trenutni logo ordinacije</span>
									<ImageDisplay
										images={allImages}
										imageType="LOGO"
										imageFrom="clinic"
										id={clinic.id}
										width={125}
										height={125}
										containerStyle="flex justify-center lg:justify-start gap-3 flex-wrap mt-2"
										imageContainerStyle="flex"
										imageStyle="rounded-[8px]"
										deleteIconStyle="cursor-pointer"
										deleteButton={true}
										handleDeleteImage={handleDeleteImage}
									/>
								</div>
							)}
							<ImageUpload
								inputStyle="w-[0.1px] h-[0.1px] opacity-0 overflow-hidden absolute z-[-1]"
								labelId="addLogoImage"
								containerStyle="mb-2 flex flex-col"
								labelStyle="text-primary font-bold"
								inputLabelStyle="button font-[600] cursor-pointer"
								inputLabelText={
									clinic?.images?.some((image) => image?.imageUsage === 'LOGO') ? 'Zamijeni logo' : 'Dodaj logo'
								}
								callback={handleLogo}
							/>
							<p className="text-[15px]">Preporučene dimenzije za Logo su 200 x 200 pixela</p>
							{renderLogo ? (
								<div className="flex justify-center lg:justify-start">
									<Image
										className="rounded-[8px] animate-pulse"
										src={renderLogo}
										alt="upload logo"
										width={125}
										height={125}
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
						{clinic.images?.length > 0 && clinic.images?.some((image) => image.imageUsage === 'FEATURED') && (
							<div className="text-center lg:text-left">
								<span className="text-[20px] font-[700] text-[#727272]">Trenutna naslovna fotografija</span>
								<ImageDisplay
									images={allImages}
									imageType="FEATURED"
									imageFrom="clinic"
									id={clinic.id}
									width={200}
									height={125}
									containerStyle="flex justify-center lg:justify-start gap-3 flex-wrap mt-2"
									imageContainerStyle="flex"
									imageStyle="rounded-[8px]"
									deleteIconStyle="cursor-pointer"
									deleteButton={true}
									handleDeleteImage={handleDeleteImage}
								/>
							</div>
						)}
						<div>
							<ImageUpload
								inputStyle="w-[0.1px] h-[0.1px] opacity-0 overflow-hidden absolute z-[-1]"
								labelId="addFeaturedImage"
								containerStyle="mb-2 flex flex-col"
								labelStyle="text-primary font-bold"
								inputLabelStyle="button font-[600] cursor-pointer"
								inputLabelText={
									clinic?.images?.some((image) => image?.imageUsage === 'FEATURED')
										? 'Zamijeni naslovnu fotografiju'
										: 'Dodaj naslovnu fotografiju'
								}
								callback={handleFeaturedImage}
							/>
							<p className="text-[15px]">Preporučene dimenzije za Naslovnu su 1055 x 500 pixela</p>
							{renderFeaturedImage ? (
								<div className="flex justify-center lg:justify-start">
									<div className="w-[250px] h-[125px] relative">
										<Image
											className="rounded-[8px] animate-pulse"
											src={renderFeaturedImage}
											alt="upload featured image"
											layout="fill"
										/>
									</div>
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
									<span className="underline text-primaryColor font-bold cursor-pointer">info@superdentals.com</span>
								</a>{' '}
								sa nazivom ordinacije u predmetu maila, a administrator će isti postaviti na profil vaše ordinacije
							</span>
						</div>
					</div>
					<div>
						<h2 className="text-[282828] font-[700] text-[20px] text-center mb-5">Dodajte opise</h2>
						<p className="mb-4">
							(Preporučujemo da dodatni opis o ordinaciji postavite na više jezika, a izbor vršite klikom na zastavicu.)
						</p>
						<DescriptionModals />
					</div>
				</div>
				<div></div>
				<div className="flex flex-col lg:items-end gap-3">
					<button onClick={handleClick} className="button font-[600] px-10 lg:w-[60%]">
						Uredi ordinaciju
					</button>
					{success !== '' && (
						<span className="text-green-500 font-[600] flex items-center justify-center gap-2">
							<BsCheckLg /> {success}
						</span>
					)}
				</div>
			</form>
		</div>
	);
};

export default EditClinic;
