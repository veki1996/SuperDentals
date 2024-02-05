import { useEffect, useMemo, useState } from 'react';
import { getSession, useSession } from 'next-auth/react';
import { prisma } from '/utils/db';
import { useAtom } from 'jotai';
import {
	HeadMeta,
	CustomOption,
	Filtering,
	BannerDisplay,
	Card,
	AccordionAnswer,
	Contact,
	Footer,
	Nav,
	ImageDisplay,
} from '/components';
import {
	filterCityAtom,
	filterCountryAtom,
	filterDistanceAtom,
	filterLanguageAtom,
	filterServiceAtom,
	filterRatingAtom,
} from '../store';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { BsSearch } from 'react-icons/bs';
import Link from 'next/link';
import useTranslation from 'next-translate/useTranslation';

import { countryOptions, languageOptions, distanceOptions, ratingOptions } from '/utils/filterOptions';
import { getServiceName } from '/utils/utils';

const Home = ({ cities, services, images, settings, faqs, airports }) => {
	const router = useRouter();
	const { data: session } = useSession();
	const { query, isReady, locale } = router;
	const { t } = useTranslation('home');

	// States
	const [, setFilteredClinics] = useState();
	const [filterSettings] = useState(settings);
	const [sortedClinics, setSortedClinics] = useState([]);

	// Atom
	const [filterCountry, setFilterCountry] = useAtom(filterCountryAtom);
	const [filterCity, setFilterCity] = useAtom(filterCityAtom);
	const [filterService, setFilterService] = useAtom(filterServiceAtom);
	const [filterLanguage, setFilterLanguage] = useAtom(filterLanguageAtom);
	const [filterDistance, setFilterDistance] = useAtom(filterDistanceAtom);
	const [filterRating, setFilterRating] = useAtom(filterRatingAtom);

	const [displayFilterCountry, setDisplayFilterCountry] = useState(true);
	const [displayFilterCity, setDisplayFilterCity] = useState(true);
	const [displayFilterLanguage, setDisplayFilterLanguage] = useState(true);
	const [displayFilterService, setDisplayFilterService] = useState(true);
	const [displayFilterDistance, setDisplayFilterDistance] = useState(true);
	const [displayFilterRating, setDisplayFilterRating] = useState(true);

	const setSettingDisplay = () => {
		const countryFilter = filterSettings?.filter((filter) => filter.name === 'Filter By Country')[0]?.active;
		setDisplayFilterCountry(countryFilter != undefined ? countryFilter : displayFilterCountry);

		const cityFilter = filterSettings?.filter((filter) => filter.name === 'Filter By City')[0]?.active;
		setDisplayFilterCity(cityFilter != undefined ? cityFilter : displayFilterCity);

		const serviceFilter = filterSettings?.filter((filter) => filter.name === 'Filter By Service')[0]?.active;
		setDisplayFilterService(serviceFilter != undefined ? serviceFilter : displayFilterService);

		const languageFilter = filterSettings?.filter((filter) => filter.name === 'Filter By Language')[0]?.active;
		setDisplayFilterLanguage(languageFilter != undefined ? languageFilter : displayFilterLanguage);

		const distanceFilter = filterSettings?.filter((filter) => filter.name === 'Filter By Distance')[0]?.active;
		setDisplayFilterDistance(distanceFilter != undefined ? distanceFilter : displayFilterDistance);

		const ratingFilter = filterSettings?.filter((filter) => filter.name === 'Filter By Rating')[0]?.active;
		setDisplayFilterRating(ratingFilter != undefined ? ratingFilter : displayFilterRating);
	};

	// Make React Select options for cities

	const cityOptions = useMemo(() => {
		return cities
			?.sort((a, b) => {
				return a?.cityName[0].localeCompare(b?.cityName[0], 'sr-RS');
			})
			?.map((city) => {
				if (city.country === filterCountry) {
					return {
						value: city.cityName,
						label: city.cityName,
					};
				}
			});
	}, [cities, filterCountry]);

	// Filter and remove all undefined elements
	const filteredCities = cityOptions.filter((city) => city !== undefined);

	// Make React Select options for services
	const serviceOptions = useMemo(() => {
		return services?.map((service) => {
			return {
				value: getServiceName(service, locale, true),
				label: getServiceName(service, locale, true),
			};
		});
	}, [services, locale]);

	const defaultCountry =
		settings.find((setting) => setting.name === 'Default Country') &&
		settings.find((setting) => setting.name === 'Default Country').defaultValue
			? settings.find((setting) => setting.name === 'Default Country').defaultValue
			: 'ba';

	// This solves problem when you try to filter by country but you already have filter by city
	// On each filter country change, reset filterCity
	useEffect(() => {
		setFilterCity(null);

		filteredCities?.map((option) => {
			if (option.value === query.city?.trim().split('-').join(' ')) {
				setFilterCity({ value: option.value, label: option.label });
			}
		});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [filterCountry]);

	useEffect(() => {
		countryOptions?.map((option) => {
			if (option.value.trim() === query.country) {
				setFilterCountry(option.value);
			}
		});

		serviceOptions?.map((option) => {
			if (option.value.trim() === query.service?.trim().split('_').join(' ')) {
				setFilterService({ value: option.value, label: option.label });
			}
		});

		languageOptions?.map((option) => {
			if (query.languages?.trim().split(',').includes(option.value)) {
				setFilterLanguage((prev) => [
					...prev.filter((lang) => lang.value !== option.value),
					{ value: option.value, label: option.label, icon: option.icon },
				]);
			}
		});

		distanceOptions?.map((option) => {
			if (option.value.trim() === query.distance) {
				setFilterDistance({ value: option.value, label: option.label });
			}
		});

		ratingOptions?.map((option) => {
			if (option.value.trim() === query.rating) {
				setFilterRating({ value: option.value, label: option.label, icon: option.icon });
			}
		});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isReady]);

	useEffect(() => {
		if (!query.country) {
			const manualCountry = localStorage.getItem('selectedCountry');

			if (manualCountry) {
				setFilterCountry(countryOptions.filter((option) => option.value === manualCountry)[0].value);
			} else {
				setFilterCountry(countryOptions.filter((option) => option.value === defaultCountry)[0].value);
			}
		}
		if (!query.languages) setFilterLanguage([]);
		if (!query.service) setFilterService(null);
		if (!query.distance) setFilterDistance(null);
		if (!query.rating) setFilterRating(null);
		setSettingDisplay();

		fetchClinics();

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const fetchClinics = async () => {
		try {
			const response = await fetch('/api/clinics/filter/sorted', {
				method: 'GET',
			});

			if (response.status === 200) {
				const { clinics } = await response.json();
				setSortedClinics([...clinics]);
			}
		} catch (error) {
			console.log(error);
		}
	};

	const handleClick = () => {
		router.push(
			`/clinics?country=${filterCountry !== '' ? filterCountry : defaultCountry}&city=${
				filterCity !== undefined && filterCity !== null ? filterCity.value.trim().split(' ').join('-') : ''
			}&service=${filterService !== null ? filterService.value.trim().split(' ').join('_') : ''}&languages=${
				filterLanguage !== undefined ? filterLanguage?.map((language) => language.value) : ''
			}&distance=${filterDistance !== null ? filterDistance.value : ''}&rating=${
				filterRating !== null ? filterRating.value : ''
			}`,
		);
	};
	const handleCountryClick = (e) => {
		localStorage.setItem('selectedCountry', e?.target?.id);
		setFilterCountry(e.target.id);
	};

	return (
		<div>
			<Nav />
			<div className="md:bg-hero-image bg-cover bg-center bg-no-repeat shadow-lg shadow-white">
				<main className="min-h-[calc(100vh-(189px*2))] container mx-auto px-6 md:px-16 relative">
					<HeadMeta
						title="SuperDENTALS.com"
						description="Tražite stomatologa po svojoj mjeri? Na pravom ste mjestu."
						link={`${process.env.BASE_URL}/`}
						content={'superdentals.com'}
						image={`${process.env.BASE_URL}/images/logo.jpg`}
					/>
					<section className="grid grid-cols-1 lg:grid-cols-2 gap-5 lg:max-w-3xl pb-6 lg:py-6">
						<div className="pb-6 lg:py-6 md:pr-6 flex flex-col justify-between">
							<div className="flex flex-col gap-5 mt-8 mb-5">
								{displayFilterCountry && (
									<div className="flex items-center justify-center gap-7 ">
										<div className="rounded-full border-[3px] hover:border-secondary transition-all w-[54px] h-[54px] relative">
											<Image
												onClick={(e) => handleCountryClick(e)}
												alt="Serbian flag"
												id="rs"
												src="/home-page-assets/srb-flag.svg"
												width={54}
												height={54}
												className={`cursor-pointer  ${
													filterCountry === 'rs' ? 'grayscale-0' : 'grayscale'
												} hover:grayscale-0 transition-all`}
											/>
										</div>
										<div className="rounded-full border-[3px] hover:border-secondary transition-all w-[54px] h-[54px] relative">
											<Image
												onClick={(e) => handleCountryClick(e)}
												alt="Bosnian flag"
												id="ba"
												src="/home-page-assets/bih-flag.svg"
												width={54}
												height={54}
												className={`cursor-pointer  ${
													filterCountry === 'ba' ? 'grayscale-0' : 'grayscale'
												} hover:grayscale-0 transition-all`}
											/>
										</div>
										<div className="rounded-full border-[3px] hover:border-secondary transition-all w-[54px] h-[54px] relative">
											<Image
												onClick={(e) => handleCountryClick(e)}
												alt="Montenegrot flag"
												id="cg"
												src="/home-page-assets/cg-flag.svg"
												width={54}
												height={54}
												className={`cursor-pointer  ${
													filterCountry === 'cg' ? 'grayscale-0' : 'grayscale'
												} hover:grayscale-0 transition-all`}
											/>
										</div>
									</div>
								)}

								{displayFilterCity && (
									<Filtering
										filterBy={t('filters.filter-1')}
										filterOptions={filteredCities}
										isSearchable={true}
										isClearable={true}
										filterValue={filterCity}
										setFilterValue={setFilterCity}
										isMulti={false}
										customOption={{ Option: CustomOption }}
										instanceId="city"
									/>
								)}

								{displayFilterService && (
									<Filtering
										filterBy={t('filters.filter-2')}
										filterOptions={serviceOptions}
										isSearchable={false}
										isClearable={true}
										filterValue={filterService}
										setFilterValue={setFilterService}
										isMulti={false}
										instanceId="service"
									/>
								)}

								{displayFilterLanguage && (
									<Filtering
										filterBy={t('filters.filter-3')}
										filterOptions={languageOptions}
										isSearchable={false}
										isClearable={true}
										filterValue={filterLanguage}
										setFilterValue={setFilterLanguage}
										isMulti={true}
										instanceId="langauge"
									/>
								)}

								{displayFilterDistance && (
									<Filtering
										filterBy={t('filters.filter-4')}
										filterOptions={distanceOptions}
										isSearchable={false}
										isClearable={true}
										filterValue={filterDistance}
										setFilterValue={setFilterDistance}
										instanceId="distance"
									/>
								)}

								{displayFilterRating && (
									<Filtering
										filterBy={t('filters.filter-5')}
										filterOptions={ratingOptions}
										isSearchable={false}
										isClearable={true}
										filterValue={filterRating}
										setFilterValue={setFilterRating}
										instanceId="rating"
									/>
								)}
							</div>
							<button className="button w-full gap-2" onClick={handleClick}>
								<span>{t('hero.text-6')}</span>
								<BsSearch size={30} />
							</button>
						</div>
						<div className="flex flex-col justify-between gap-3 p-6 bg-white/[0.57] backdrop-blur-[16.5px] rounded-[16px]">
							<h1 className="text-[24px] font-bold text-lightBlack">
								<span className="text-primaryColor">{t('hero.text-1')}</span> {t('hero.text-2')}{' '}
							</h1>
							<p className="text-lightBlack">
								<span className="font-bold">{t('hero.text-3')}</span> {t('hero.text-4')}
							</p>
							<p className="text-lightBlack">{t('hero.text-5')}</p>
							<button
								onClick={session ? () => router.push('/create-clinic') : () => router.push('/register')}
								className="button-outline hover:bg-primaryColor hover:text-white transition-colors w-full"
							>
								{t('hero.text-7')}
							</button>
						</div>
					</section>
					<div className="w-full flex justify-center translate-y-[50%]">
						<div className="min-h-[100px] lg:min-h-[144px] w-[80%]">
							<BannerDisplay
								images={images}
								swiperStyle="w-full h-[100px] lg:h-[144px] rounded-[8px]"
								position="header"
								locale={locale}
							/>
						</div>
					</div>
				</main>
			</div>
			<section className="container px-6 md:px-16 mx-auto  mt-36">
				<div className="bg-[#F1F1F1] w-full flex flex-col justify-center items-center gap-10 rounded-[16px] pt-10 pb-28 ">
					<h1 className="text-[#21231E] font-[700] text-[30px] md:text-[40px]">{t('services.heading')}</h1>
					<div className="grid gird-cols-1 md:grid-cols-2  xl:grid-cols-4 gap-10 text-[#21231E] font-[700]">
						{services?.slice(0, 7)?.map((service) => (
							<div
								key={service?.id}
								onClick={() => {
									router.push(
										`/services/${service?.simplifiedName.trim().split(' ').join('-')}?country=${
											localStorage?.getItem('selectedCountry') || defaultCountry
										}&service=${getServiceName(service, locale)?.trim().split(' ').join('_')}`,
									);
								}}
								className="w-[210px] h-[210px] bg-white flex flex-col justify-center items-center text-center rounded-[8px] shadow-md shadow-black/20 gap-2 cursor-pointer hover:shadow-container hover:scale-105 hover:-translate-y-1 hover:translate-x-1 transition-all duration-300"
							>
								<div className="h-[120px] w-full justify-center items-center flex">
									{service?.image ? (
										<ImageDisplay
											images={service?.image}
											imageType="SERVICE"
											imageFrom="service"
											id={service?.id}
											layout="fill"
											imageStyle="rounded-xl"
											imageContainerStyle="relative w-[105px] h-[100px] mt-2"
											containerStyle="h-full"
										/>
									) : (
										<div className="relative items-center w-[100px] h-[100px]">
											<Image
												alt={getServiceName(service, locale, true)}
												src="/placeholder-images/placeholder-1.png"
												layout="fill"
												objectFit="cover"
												className="rounded-xl"
											/>
										</div>
									)}
								</div>

								<div className="w-full h-[55px] flex items-center justify-center px-2">
									<h2>{getServiceName(service, locale, true)?.toUpperCase()}</h2>
								</div>
							</div>
						))}

						<Link href={`/services`}>
							<div className="w-[210px] h-[210px] bg-white flex flex-col justify-center items-center text-center rounded-[8px] shadow-md shadow-black/20 gap-2 cursor-pointer hover:shadow-container hover:scale-105 hover:-translate-y-1 hover:translate-x-1 transition-all duration-300">
								<div className="h-[120px] items-center flex">
									<div className="w-[100px] h-[100px] relative">
										<Image alt="alt" src="/home-page-assets/ostalo.svg" layout="fill" />
									</div>
								</div>
								<div className="w-full h-[55px] flex items-center justify-center">
									<h2>{t('services.text')}</h2>
								</div>
							</div>
						</Link>
					</div>
				</div>
				<div className="w-full flex justify-center mt-20 relative">
					<div className="min-h-[100px] lg:min-h-[144px] w-[83%]">
						<BannerDisplay
							images={images}
							swiperStyle="w-full h-[100px] lg:h-[144px] rounded-[8px]"
							position="footer"
							locale={locale}
						/>
					</div>
				</div>
			</section>
			<section className="container mx-auto px-6 md:px-16 my-24">
				<div className="flex flex-col gap-7">
					<h1 className="text-center text-primaryColor font-[700] text-[30px] md:text-[40px]">
						{t('clinics.heading')}
					</h1>
					<div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:px-16">
						{sortedClinics?.filter((clinic) => clinic?.user?.active)?.length > 0 ? (
							sortedClinics?.map((clinic) => <Card key={clinic.id} clinic={clinic} airports={airports} />)
						) : (
							<span className="text-gray-700 text-[600] text-paragraph">
								Žao nam je, još uvijek nemamo najpopularnijih ordinacija
							</span>
						)}
					</div>
				</div>
				<div className="w-full text-right mt-5 px-6 md:px-16">
					<Link href="/clinics">
						<span className="text-primaryColor font-[600] md:text-[20px] cursor-pointer">{t('clinics.text')}</span>
					</Link>
				</div>
			</section>
			<section className="container mx-auto flex flex-col items-center mb-24">
				<h1 className="text-primaryColor text-[24px] md:text-[48px]">
					<span className="font-[700]">SuperDENTALS</span> <span className="text-[20px] md:text-[40px]">Blog</span>
				</h1>
				<a href="https://blog.superdentals.com/">
					<div className="container bg-mobile-blog-image md:bg-blog-image bg-cover bg-center bg-no-repeat p-7 max-w-[1440px] rounded-[8px] mt-10">
						<div className="lg:w-[40%] md:w-[50%] flex flex-col gap-5">
							<div className="flex items-center">
								<Image src="/home-page-assets/blog.png" alt="Blog logo" width={550} height={180} />
							</div>
							<div className="text-black flex flex-col gap-5 font-[500] lg:text-[18px] pl-3">
								<p>{t('blog.text-1')}</p>
								<p>
									{t('blog.text-2')} <span className="font-[700] text-primaryColor">blog@superdentals.com</span>{' '}
									{t('blog.text-3')}{' '}
								</p>
							</div>
							<h2 className="text-black text-[26px] font-[700] pl-3">blog.superdentals.com</h2>
						</div>
					</div>
				</a>
			</section>
			<section className="bg-[#F1F1F1]">
				<div className="container mx-auto md:px-16 py-16">
					<div className="bg-white p-8 md:p-14">
						<h1 className="text-center heading mb-10">FAQ</h1>
						<div className="flex flex-col gap-5 container mx-auto md:p-10 md:border-[4px] md:border-[F4F4F4] rounded-[7px]">
							<AccordionAnswer faqs={faqs} />
						</div>
					</div>
				</div>
			</section>
			<div className="lg:bg-contact-image lg:bg-no-repeat lg:bg-auto lg:bg-[right_bottom_-9rem]">
				<section className="container mx-auto px-6 md:px-16 flex flex-col md:flex-row md:justify-between py-12 ">
					<div className="xl:basis-[40%]">
						<h1 className="heading md:text-[30px] lg:text-[48px] mb-4">{t('contact.heading')}</h1>
						<Contact />
					</div>
					<div className="mt-8 xl:basis-[60%] md:flex justify-center md:justify-end items-start hidden ">
						<Image alt="Logo" src="/home-page-assets/contact-logo.svg" width={460} height={142} />
					</div>
				</section>
			</div>
			<Footer />
		</div>
	);
};

export default Home;

export async function getStaticProps(ctx) {
	const session = await getSession(ctx);

	const cities = await prisma.location.findMany({
		orderBy: [
			{
				cityName: 'asc',
			},
		],
	});

	const airports = await prisma.airport.findMany();

	const services = await prisma.service.findMany({
		orderBy: {
			order: 'asc',
		},
		include: {
			image: true,
		},
	});

	const settings = await prisma.setting.findMany({});

	const images = await prisma.image.findMany({
		where: {
			imageUsage: {
				equals: 'BANNER',
			},
		},
		include: {
			banner: true,
		},
	});

	const faqs = await prisma.faq.findMany({
		orderBy: {
			createdAt: 'asc',
		},
	});

	return {
		props: {
			cities,
			airports,
			services,
			images,
			settings,
			session,
			faqs,
		},
		revalidate: 30,
	};
}
