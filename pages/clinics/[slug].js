import { useEffect, useState } from 'react';
import { prisma } from '/utils/db';
import {
	HeadMeta,
	QuillReader,
	ImageDisplay,
	AlbumDisplay,
	Contact,
	Footer,
	ClinicDetailsMenu,
	Nav,
} from '/components';
import Image from 'next/image';
import { GoogleMap, MarkerF, useJsApiLoader } from '@react-google-maps/api';
import { HiLocationMarker } from 'react-icons/hi';
import { AiFillStar } from 'react-icons/ai';
import { FaFacebookF, FaInstagram, FaEnvelope, FaTwitter, FaLinkedinIn, FaTiktok } from 'react-icons/fa';
import { BsFillTelephoneFill } from 'react-icons/bs';
import { TbWorld } from 'react-icons/tb';
import {
	startImages,
	premiumDistances,
	premiumImages,
	premiumPlusDistances,
	premiumPlusImages,
	premiumPlusServices,
	premiumServices,
	standardDistances,
	standardImages,
	standardServices,
	startServices,
} from '/utils/consts';
import useTranslation from 'next-translate/useTranslation';
import { getClinicDescription } from '/utils/utils';
import { useRouter } from 'next/router';

const Clinic = ({ clinic, airports }) => {
	const { t } = useTranslation('clinic');
	const router = useRouter();
	const { locale } = router;

	const [toggleModal, setToggleModal] = useState(false);

	const albumImages = clinic?.images?.filter((image) => image?.imageUsage === 'ALBUM');

	const subscriptionPackage = clinic?.user?.subscriber?.package;

	useEffect(() => {
		addNewView();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const addNewView = async () => {
		let data = {
			clinicId: clinic.id,
			date: new Date().toLocaleString('en-US').split(',')[0],
		};

		await fetch('/api/clinics/counter', {
			method: 'POST',
			body: JSON.stringify(data),
			headers: {
				'Content-type': 'application/json',
			},
		});
	};
	// Location for Map Marker
	const center = clinic.mapCoordinates && JSON.parse(clinic.mapCoordinates);

	const { isLoaded } = useJsApiLoader({
		googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
	});

	const calculateWorkingHours = (workingHours) => {
		const groupedWorkingHours = [];

		// Loop through each working hour in the input array
		workingHours?.forEach(({ day, from, to }) => {
			const shortenedDay = day.slice(0, 3);

			// Check if this working hour is already grouped with others
			let groupedIndex = -1;

			groupedWorkingHours.forEach((groupedWorkingHour, i) => {
				if (groupedWorkingHour.from === from && groupedWorkingHour.to === to) {
					groupedIndex = i;
				}
			});

			// If it's already grouped, add the current day to its days array
			if (groupedIndex !== -1) {
				groupedWorkingHours[groupedIndex].days.push(shortenedDay);
			}
			// If it's not grouped, create a new group with this working hour
			else {
				groupedWorkingHours.push({ days: [shortenedDay], from, to });
			}
		});

		// Format the grouped working hours into the desired output format
		const formattedWorkingHours = groupedWorkingHours.map(({ days, from, to }) => {
			const allDays = ['Pon', 'Uto', 'Sri', 'Čet', 'Pet', 'Sub', 'Ned'];
			const dayIndices = days.map((day) => {
				const dayIndex = allDays.findIndex((d) => d === day || (day === 'Sre' && d === 'Sri'));
				return dayIndex;
			});

			const groupedIndices = [[dayIndices[0]]];

			for (let i = 1; i < dayIndices.length; i++) {
				const currentGroup = groupedIndices[groupedIndices.length - 1];
				if (dayIndices[i] === currentGroup[currentGroup.length - 1] + 1) {
					currentGroup.push(dayIndices[i]);
				} else {
					groupedIndices.push([dayIndices[i]]);
				}
			}

			const translatedDays = [
				t('days.day-1')?.slice(0, 3),
				t('days.day-2')?.slice(0, 3),
				t('days.day-3')?.slice(0, 3),
				t('days.day-4')?.slice(0, 3),
				t('days.day-5')?.slice(0, 3),
				t('days.day-6')?.slice(0, 3),
				t('days.day-7')?.slice(0, 3),
			];
			const formattedDays = groupedIndices
				.map((indices) => {
					if (indices.length > 1) {
						return `${translatedDays[indices[0]]}-${translatedDays[indices[indices.length - 1]]}`;
					} else {
						return translatedDays[indices[0]];
					}
				})
				.join(', ');

			return { day: formattedDays, from, to };
		});

		return formattedWorkingHours;
	};

	return (
		<div>
			<HeadMeta
				title={`${clinic.name}`}
				description="Tražite stomatologa po svojoj mjeri? Na pravom ste mjestu."
				link={`${process.env.BASE_URL}/clinic/${clinic.name}`}
				content={'superdentals.com'}
				image={`${
					clinic?.images?.some((image) => image.imageUsage === 'LOGO')
						? `${process.env.BASE_URL}/uploads/${
								clinic?.images?.filter((image) => image?.imageUsage === 'LOGO')[0]?.name
						  }`
						: `${process.env.BASE_URL}/images/logo.jpg`
				}`}
			/>
			<Nav />
			<section className="min-h-[calc(100vh-(189px*2))]">
				<section className="container mx-auto px-[10px] grid grid-cols-1 xl:grid-cols-10 gap-5 py-12">
					<div className="xl:col-span-7 w-full flex flex-col gap-6">
						<div className="flex flex-col lg:flex-row justify-between items-center gap-6 lg:gap-4 text-center">
							<div className="flex flex-col lg:flex-row justify-between items-center gap-10">
								<div className="relative w-[100px] h-[100px] rounded-full border-[3px] border-[E0E0E0] drop-shadow-md">
									{clinic.images.filter((image) => image.imageUsage === 'LOGO').length > 0 ? (
										<ImageDisplay
											images={clinic.images}
											imageType="LOGO"
											imageFrom="clinic"
											id={clinic.id}
											containerStyle="grid grid-cols-3 gap-2"
											imageContainerStyle="flex"
											imageStyle="rounded-full"
											layout="fill"
										/>
									) : (
										<Image
											alt="Logo"
											src="/placeholder-images/logo-placeholder.png"
											layout="fill"
											className="rounded-full"
										/>
									)}
								</div>
								<div className="flex flex-col gap-2 sm:w-[600px] xl:w-[500px] 2xl:w-[650px]">
									<div className="flex flex-col gap-2 lg:flex-row lg:gap-0 justify-between items-center">
										<h1 className="text-primaryColor text-center md:text-left text-[22px] font-[600]">
											{clinic?.name}
										</h1>
										{clinic?.rating?.trim() !== '' && clinic?.rating?.trim() !== 'undefined' && (
											<div className="flex  items-center justify-center">
												<AiFillStar size={30} color="#EDB92E" />
												<span className="text-[#EDB92E] font-[700] text-[16px] ">{clinic?.rating}</span>
											</div>
										)}
									</div>
									<div className="flex flex-col gap-2 lg:flex-row lg:gap-0 justify-between items-center">
										<div className="flex items-center justify-start gap-2">
											<HiLocationMarker color="#21231E" size={25} />
											<span className="text-[#21231E] text-[16px]">
												{clinic?.location?.cityName}, {clinic?.location?.country?.toUpperCase()}
											</span>
										</div>
										{subscriptionPackage?.accessor !== 'START' && (
											<div className="flex items-center gap-1">
												{JSON.parse(clinic?.languagesSpoken)?.map((language) => (
													<div key={language.value} className="relative h-[20px] w-[20px]">
														<Image
															alt={language.label}
															src={`/country-flags/${language.value}.svg`}
															layout="fill"
															objectFit="cover"
															className="rounded-full"
														/>
													</div>
												))}
											</div>
										)}
									</div>
								</div>
							</div>

							{JSON.parse(clinic?.workHours).filter((workHour) => workHour.from !== '' && workHour.to !== '')?.length >
								0 && (
								<div className="flex flex-col gap-4">
									<h2 className="text-primaryColor text-[16px] font-[700] text-center lg:text-left">
										{t('main.text-1')}
									</h2>
									<div className="flex flex-col gap-2 2xl:gap-0  items-center lg:items-start justify-center lg:justify-start text-[14px]">
										{calculateWorkingHours(JSON.parse(clinic?.workHours)).map((workHour) => (
											<div key={workHour.day}>
												{workHour.from !== '' && workHour.to !== '' && (
													<span>
														{workHour.from}h - {workHour.to}h ({workHour.day})
													</span>
												)}
											</div>
										))}
									</div>
								</div>
							)}
						</div>
						{albumImages.length > 0 && (
							<div className="min-h-[430px] w-full mt-3">
								<AlbumDisplay
									images={
										subscriptionPackage?.accessor === 'START'
											? albumImages?.slice(0, startImages)
											: subscriptionPackage?.accessor === 'STANDARD'
											? albumImages?.slice(0, standardImages)
											: subscriptionPackage?.accessor === 'PREMIUM'
											? albumImages?.slice(0, premiumImages)
											: albumImages?.slice(0, premiumPlusImages)
									}
									swiperStyle1="w-full h-[350px] lg:h-[500px] mb-3"
									swiperStyle2="box-border h-[150.5px]"
								/>
							</div>
						)}

						<div className="flex flex-col gap-5 rounded-[4px] shadow-container p-6 text-[16px]  text-[#21231E]">
							<div className="flex items-center gap-3">
								<BsFillTelephoneFill color="#FC5122" size={20} />
								<div className="flex flex-col md:flex-row gap-3">
									{JSON.parse(clinic?.phoneNumbers).map((number) => (
										<span key={number?.numberType}>
											<span className="text-primaryColor font-[600]">
												{number?.numberType === 'Fiksni' ? t('main.text-3') : t('main.text-4')}
											</span>
											: {number?.number}
										</span>
									))}
								</div>
							</div>
							<div className="flex items-center gap-3">
								<FaEnvelope color="#FC5122" size={20} />
								<span>{clinic?.email}</span>
							</div>
							<div className="flex items-center gap-3">
								<HiLocationMarker color="#FC5122" size={23} />
								<span>
									{clinic?.address && `${clinic?.address}, `}
									{clinic?.location?.cityName},{' '}
									{clinic?.location?.country === 'ba'
										? 'Bosna i Hercegovina'
										: clinic?.location?.country === 'rs'
										? 'Srbija'
										: 'Crna Gora'}
								</span>
							</div>
						</div>

						<div className="grid grid-cols-1 place-items-center md:grid-cols-2 lg:place-items-stretch lg:grid-cols-3 gap-6">
							{clinic?.employees
								?.sort((a, b) => {
									if (a.type === 'doctor' && b.type !== 'doctor') return -1;
									if (a.type !== 'doctor' && b.type === 'doctor') return 1;

									const updatedAtA = new Date(a.updatedAt).getTime();
									const updatedAtB = new Date(b.updatedAt).getTime();
									return updatedAtA - updatedAtB;
								})
								?.map((employee) => (
									<div key={employee.id} className="w-full h-[380px] shadow-container p-3 rounded-[8px]">
										<div className="w-full h-[260px] relative">
											{employee?.images ? (
												<ImageDisplay
													images={employee?.images}
													imageType="EMPLOYEE"
													imageFrom="employee"
													layout="fill"
													imageContainerStyle="w-full h-full"
													imageStyle="rounded-[8px]"
												/>
											) : (
												<Image
													alt="Employee placeholder"
													src="/placeholder-images/employee-placeholder.png"
													className="rounded-[8px]"
													layout="fill"
													objectFit="cover"
												/>
											)}
										</div>
										<div className="p-4 text-center">
											<p className="font-[700] text-[#21231E]">
												{employee?.name} {employee?.surname}
											</p>
											<p className="text-[14px] text-primaryColor">{employee?.title}</p>
										</div>
									</div>
								))}
						</div>
						{getClinicDescription(clinic?.description, locale) && subscriptionPackage?.accessor !== 'START' && (
							<div className="shadow-container rounded-[4px] p-6">
								<QuillReader description={getClinicDescription(clinic?.description, locale)} />
							</div>
						)}
						{JSON.parse(clinic?.videoAlbum).length > 0 &&
							JSON.parse(clinic?.videoAlbum).map((video, i) => (
								<iframe
									key={i}
									src={video?.videoLink}
									title="YouTube video player"
									frameborder="0"
									allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
									allowfullscreen
									className="h-[300px] md:h-[523px] rounded-[11px]"
								></iframe>
							))}
					</div>
					<div className="xl:col-span-3 flex flex-col gap-8">
						<div className="flex flex-col gap-7">
							<div className="flex items-center justify-center gap-3">
								{clinic?.facebook && clinic?.facebook !== '' && (
									<a href={clinic?.facebook} target="_blank" rel="noreferrer">
										<FaFacebookF
											color="#FC5122"
											className="bg-white rounded-[5px] p-1 cursor-pointer hover:scale-125 hover:bg-white/80 transition"
											size={30}
										/>
									</a>
								)}
								{clinic?.instagram && clinic?.instagram !== '' && (
									<a href={clinic?.instagram} target="_blank" rel="noreferrer">
										<FaInstagram
											color="#FC5122"
											className="bg-white rounded-[5px] p-1 cursor-pointer hover:scale-125 hover:bg-white/80 transition"
											size={30}
										/>
									</a>
								)}
								{clinic?.tiktok && clinic?.tiktok !== '' && (
									<a href={clinic?.tiktok} target="_blank" rel="noreferrer">
										<FaTiktok
											color="#FC5122"
											className="bg-white rounded-[5px] p-1 cursor-pointer hover:scale-125 hover:bg-white/80 transition"
											size={30}
										/>
									</a>
								)}
								{clinic?.linkedin && clinic?.linkedin !== '' && (
									<a href={clinic?.linkedin} target="_blank" rel="noreferrer">
										<FaLinkedinIn
											color="#FC5122"
											className="bg-white rounded-[5px] p-1 cursor-pointer hover:scale-125 hover:bg-white/80 transition"
											size={30}
										/>
									</a>
								)}
								{clinic?.twitter && clinic?.twitter !== '' && (
									<a href={clinic?.twitter} target="_blank" rel="noreferrer">
										<FaTwitter
											color="#FC5122"
											className="bg-white rounded-[5px] p-1 cursor-pointer hover:scale-125 hover:bg-white/80 transition"
											size={30}
										/>
									</a>
								)}
								{clinic?.website && clinic?.website !== '' && (
									<a href={clinic?.website} target="_blank" rel="noreferrer">
										<TbWorld
											color="#FC5122"
											className="bg-white rounded-[5px] p-1 cursor-pointer hover:scale-125 hover:bg-white/80 transition"
											size={30}
										/>
									</a>
								)}
							</div>
							<button
								className="button-outline gap-2 hover:text-white hover:bg-primaryColor transition-colors mb-1 p-2 text-[16px]"
								onClick={() => setToggleModal(true)}
							>
								<FaEnvelope /> {t('main.text-2')}
							</button>
							{toggleModal ? (
								<div className="modal opacity-100 visible pointer-events-auto">
									<div className="modal-box py-10 md:px-14 md:min-w-[600px]">
										<div className="flex justify-between items-center">
											<h3 className="font-bold text-lg">
												{t('main.text-21')} {clinic.name}
											</h3>
											<span onClick={() => setToggleModal(false)} className="btn btn-sm btn-circle ">
												✕
											</span>
										</div>
										<div className="modal-action block">
											<Contact clinicEmail={clinic.email} />
										</div>
									</div>
								</div>
							) : (
								<></>
							)}
						</div>
						{clinic.mapCoordinates ? (
							isLoaded && (
								<div className="w-full h-[350px]">
									<GoogleMap center={center} zoom={15} mapContainerStyle={{ width: '100%', height: '350px' }}>
										<MarkerF position={center} />
									</GoogleMap>
								</div>
							)
						) : (
							<div className="w-full h-[350px] relative">
								<Image
									src="/placeholder-images/map_placeholder.png"
									layout="fill"
									alt="mapPlaceholder"
									objectFit="cover"
								/>
							</div>
						)}
						<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-1 gap-8">
							{JSON.parse(clinic?.distanceFromAirports) && subscriptionPackage?.accessor !== 'START' && (
								<ClinicDetailsMenu
									heading={t('main.text-5').toUpperCase()}
									airports={airports}
									airportsDistances={
										subscriptionPackage?.accessor === 'START'
											? JSON.parse(clinic?.distanceFromAirports)
													?.sort((a, b) => a.distance - b.distance)
													?.slice(0, 0)
											: subscriptionPackage?.accessor === 'STANDARD'
											? JSON.parse(clinic?.distanceFromAirports)
													?.sort((a, b) => a.distance - b.distance)
													?.slice(0, standardDistances)
											: subscriptionPackage?.accessor === 'PREMIUM'
											? JSON.parse(clinic?.distanceFromAirports)
													?.sort((a, b) => a.distance - b.distance)
													?.slice(0, premiumDistances)
											: JSON.parse(clinic?.distanceFromAirports)
													?.sort((a, b) => a.distance - b.distance)

													?.slice(0, premiumPlusDistances)
									}
								/>
							)}
							<ClinicDetailsMenu heading={t('main.text-6').toUpperCase()} details={clinic} />
							<ClinicDetailsMenu
								heading={t('main.text-7').toUpperCase()}
								services={
									subscriptionPackage?.accessor === 'START'
										? clinic?.clinicServices?.slice(0, startServices)
										: subscriptionPackage?.accessor === 'STANDARD'
										? clinic?.clinicServices?.slice(0, standardServices)
										: subscriptionPackage?.accessor === 'PREMIUM'
										? clinic?.clinicServices?.slice(0, premiumServices(clinic))
										: clinic?.clinicServices?.slice(0, premiumPlusServices(clinic))
								}
								subscriptionPackage={subscriptionPackage}
							/>
						</div>
					</div>
				</section>
			</section>
			<Footer />
		</div>
	);
};

export default Clinic;

export async function getStaticPaths({ locales }) {
	const clinics = await prisma.clinic.findMany();

	let paths = [];

	clinics.map((clinic) => {
		locales.map((locale) => {
			return paths.push({
				params: { slug: clinic.username.trim() },
				locale,
			});
		});
	});

	return {
		paths,
		fallback: 'blocking',
	};
}

export async function getStaticProps(ctx) {
	const { slug } = ctx.params;

	const clinic = await prisma.clinic.findFirst({
		where: {
			username: slug,
		},
		include: {
			location: true,
			clinicServices: {
				include: {
					service: true,
				},
			},
			employees: {
				include: {
					images: true,
				},
			},
			images: true,
			user: {
				include: {
					subscriber: {
						include: {
							package: true,
						},
					},
				},
			},
		},
	});

	const airports = await prisma.airport.findMany();

	if (!clinic)
		return {
			redirect: {
				destination: '/',
				permanent: false,
			},
		};

	return {
		props: {
			clinic,
			airports,
		},
		revalidate: 10,
	};
}
