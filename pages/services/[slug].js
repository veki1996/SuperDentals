import { useEffect, useRef, useState } from 'react';
import { prisma } from '/utils/db';
import { useAtom } from 'jotai';
import { HeadMeta, CustomOption, Filtering, Footer, Nav, Card } from '/components';
import {
	filterCityAtom,
	filterCountryAtom,
	filterDistanceAtom,
	filterLanguageAtom,
	filterServiceAtom,
	filterRatingAtom,
} from '/store';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { BsSearch } from 'react-icons/bs';
import useTranslation from 'next-translate/useTranslation';

import { countryOptions, languageOptions, distanceOptions, ratingOptions } from '/utils/filterOptions';
import { getServiceName, getServiceDescription } from '/utils/utils';

const Service = ({ singleService, cities, services, settings, airports }) => {
	const router = useRouter();
	const { query, isReady, locale } = router;
	const scrollRef = useRef();
	const { t } = useTranslation('services');

	// States
	const [filteredClinics, setFilteredClinics] = useState();
	const [filterSettings] = useState(settings);
	const [activeSorting, setActiveSorting] = useState('');
	const [showResults, setShowResults] = useState(8);

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

	const [displaySortingAZ, setDisplaySortingAZ] = useState(true);
	const [displaySortingZA, setDisplaySortingZA] = useState(true);
	const [displaySortingRating, setDisplaySortingRating] = useState(true);
	const [displaySortingYearsInService, setDisplaySortingYearsInService] = useState(true);

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

		// Sorting
		const sortingAZ = filterSettings?.filter((filter) => filter.name === 'Sort A-Z')[0]?.active;
		setDisplaySortingAZ(sortingAZ != undefined ? sortingAZ : displaySortingAZ);

		const sortingZA = filterSettings?.filter((filter) => filter.name === 'Sort Z-A')[0]?.active;
		setDisplaySortingZA(sortingZA != undefined ? sortingZA : displaySortingZA);

		const sortingRating = filterSettings?.filter((filter) => filter.name === 'Sort Rating')[0]?.active;
		setDisplaySortingRating(sortingRating != undefined ? sortingRating : displaySortingRating);

		const sortingYearsInService = filterSettings?.filter((filter) => filter.name === 'Sort Years In Service')[0]
			?.active;
		setDisplaySortingYearsInService(
			sortingYearsInService != undefined ? sortingYearsInService : displaySortingYearsInService,
		);
	};

	// Make React Select options for cities
	const cityOptions = cities
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

	// Filter and remove all undefined elements
	const filteredCities = cityOptions.filter((city) => city !== undefined);

	// Make React Select options for services
	const serviceOptions = services.map((service) => {
		return {
			value: getServiceName(service, locale, true),
			label: getServiceName(service, locale, true),
		};
	});
	const defaultCountry =
		settings.find((setting) => setting.name === 'Default Country') &&
		settings.find((setting) => setting.name === 'Default Country').defaultValue
			? settings.find((setting) => setting.name === 'Default Country').defaultValue
			: 'ba';

	const applyFilter = async () => {
		let updatedClinics = [];

		const response = await fetch('/api/clinics/filter', {
			method: 'POST',
			body: JSON.stringify({
				country: query?.country,
				city: query?.city,
				service: query?.service,
				rating: query?.rating?.split(','),
				languages: query?.languages?.split(','),
				locale: locale,
			}),
			headers: {
				'Content-type': 'application/json',
			},
		});
		if (response.status === 200) {
			const { clinics } = await response.json();
			updatedClinics = clinics;
		}

		// Distance filter
		if (query.distance !== '' && query.distance !== undefined) {
			updatedClinics = updatedClinics.filter((clinic) => {
				return JSON.parse(clinic.distanceFromAirports)?.some((distances) => {
					const filteredDistances = query.distance.split(',');
					if (filteredDistances.length === 1 && Number(distances.distance) >= 200) {
						return true;
					}
					if (
						Number(distances.distance) <= Number(filteredDistances[1]) &&
						Number(distances.distance) >= Number(filteredDistances[0])
					) {
						return true;
					}
				});
			});
		}

		// Langauge filter
		if (query.languages?.split(',').length > 0 && query.languages !== '') {
			updatedClinics = updatedClinics.filter((clinic) => {
				if (clinic.languagesSpoken !== null) {
					// If lang is found in that clinic, some returnes true -> then filter answers to that true and returns clinic
					return JSON.parse(clinic.languagesSpoken).some((language) => {
						// Make an array of Labels from array of objects -> ['Serbian', 'Croatian','German'...]
						const languagesLabels = query.languages.split(',');

						// If language label that comes from clinic spoken langauges is found in array languageLabels return true
						return languagesLabels.includes(language.value);
					});
				}
			});
		}

		setFilteredClinics(
			updatedClinics?.sort((a, b) => {
				if (a.premium === b.premium) {
					if (!a.premium && Math.random() > 0.5) {
						return -1;
					} else if (!b.premium && Math.random() > 0.5) {
						return 1;
					}
					return 0;
				}
				if (a.premium) {
					return -1;
				}
				return 1;
			}),
		);

		setShowResults(8);
		scrollRef.current.scrollIntoView();
	};
	// This solves problem when you try to filter by country but you already have filter by city
	// On each filter country change, reset filterCity
	useEffect(() => {
		setFilterCity(null);

		filteredCities.map((option) => {
			if (option.value === query.city?.trim().split('-').join(' ')) {
				setFilterCity({ value: option.value, label: option.label });
			}
		});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [filterCountry]);

	useEffect(() => {
		applyFilter();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [query.country, query.city, query.service, query.languages, query.distance, query.rating]);

	useEffect(() => {
		if (!isReady) {
			setFilteredClinics(null);
		}
		countryOptions.map((option) => {
			if (option.value.trim() === query.country) {
				setFilterCountry(option.value);
			}
		});

		serviceOptions.map((option) => {
			if (option.value.trim() === query.service?.trim().split('_').join(' ')) {
				setFilterService({ value: option.value, label: option.label });
			}
		});

		languageOptions.map((option) => {
			if (query.languages?.trim().split(',').includes(option.value)) {
				setFilterLanguage((prev) => [
					...prev.filter((lang) => lang.value !== option.value),
					{ value: option.value, label: option.label, icon: option.icon },
				]);
			}
		});

		distanceOptions.map((option) => {
			if (option.value.trim() === query.distance) {
				setFilterDistance({ value: option.value, label: option.label });
			}
		});

		ratingOptions.map((option) => {
			if (option.value.trim() === query.rating) {
				setFilterRating({ value: option.value, label: option.label, icon: option.icon });
			}
		});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isReady]);

	useEffect(() => {
		setSettingDisplay();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const handleClick = () => {
		router.push(
			`/services/${singleService?.simplifiedName.trim()}?country=${
				filterCountry !== '' ? filterCountry : defaultCountry
			}&city=${
				filterCity !== undefined && filterCity !== null ? filterCity.value.trim().split(' ').join('-') : ''
			}&service=${filterService !== null ? filterService.value.trim().split(' ').join('_') : ''}&languages=${
				filterLanguage !== undefined ? filterLanguage.map((language) => language.value) : ''
			}&distance=${filterDistance !== null ? filterDistance.value : ''}&rating=${
				filterRating !== null ? filterRating.value : ''
			}`,
		);
		setActiveSorting('');
	};
	const handleSorting = (sortingType) => {
		if (sortingType === 'A-Z') {
			setFilteredClinics(
				filteredClinics.sort((a, b) => {
					const aName = a?.name?.toLowerCase();
					const bName = b?.name?.toLowerCase();

					if (aName < bName) {
						return -1;
					} else if (aName > bName) {
						return 1;
					} else return 0;
				}),
			);
			setActiveSorting('A-Z');
		}

		if (sortingType === 'Z-A') {
			setFilteredClinics(
				filteredClinics.sort((a, b) => {
					const aName = a?.name?.toLowerCase();
					const bName = b?.name?.toLowerCase();

					if (aName < bName) {
						return 1;
					} else if (aName > bName) {
						return -1;
					} else return 0;
				}),
			);
			setActiveSorting('Z-A');
		}

		if (sortingType === 'rating') {
			setFilteredClinics(
				filteredClinics.sort((a, b) => {
					const aRating = Number(a?.rating);
					const bRating = Number(b?.rating);

					if (aRating < bRating) {
						return 1;
					} else if (aRating > bRating) {
						return -1;
					} else return 0;
				}),
			);
			setActiveSorting('rating');
		}

		if (sortingType === 'yearsInService') {
			setFilteredClinics(
				filteredClinics.sort((a, b) => {
					const aRating = Number(a?.yearsInService);
					const bRating = Number(b?.yearsInService);

					if (aRating < bRating) {
						return 1;
					} else if (aRating > bRating) {
						return -1;
					} else return 0;
				}),
			);
			setActiveSorting('yearsInService');
		}
	};

	const handleCountryClick = (e) => {
		localStorage.setItem('selectedCountry', e?.target?.id);

		setFilterCountry(e.target.id);
	};

	const handlePaginate = () => {
		setShowResults(showResults + 8);
	};

	return (
		<div>
			<HeadMeta
				title={getServiceName(singleService, locale, true)}
				description={getServiceDescription(singleService, locale, true)}
				link={process.env.BASE_URL + router.asPath}
				content={'superdentals.com'}
				image={`${process.env.BASE_URL}/images/logo.jpg`}
			/>
			<Nav />

			<section className="min-h-[calc(100vh-(189px*2))]">
				<main className="container mx-auto px-6 md:px-16 relative">
					<section className="grid grid-cols-1 xl:grid-cols-4 xl:gap-5 pb-6 xl:py-6">
						<div className="flex flex-col">
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
										filterBy="Grad"
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
										filterBy="Usluga"
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
										filterBy="Jezik"
										filterOptions={languageOptions}
										isSearchable={false}
										isClearable={true}
										filterValue={filterLanguage}
										setFilterValue={setFilterLanguage}
										isMulti={true}
										instanceId="language"
									/>
								)}

								{displayFilterDistance && (
									<Filtering
										filterBy="Blizina Aerodroma"
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
										filterBy="Ocjena korisnika"
										filterOptions={ratingOptions}
										isSearchable={false}
										isClearable={true}
										filterValue={filterRating}
										setFilterValue={setFilterRating}
										instanceId="rating"
									/>
								)}
							</div>
							<button className="button w-full gap-2 mb-6" onClick={handleClick}>
								<span>Pretraži</span>
								<BsSearch size={30} />
							</button>
							<div className="flex flex-col items-center lg:items-start">
								<h2 className="text-[20px] font-[700] border-b border-[#818181] pb-4">{t('main.text-3')}</h2>
								<div className="flex flex-col pt-4 items-center lg:items-start">
									{displaySortingAZ && (
										<span
											className={`${
												activeSorting === 'A-Z' && 'text-black font-[600]'
											} text-[20px] text-[#727272] font-[500] cursor-pointer hover:text-[#272424] transition-colors duration-300`}
											onClick={() => handleSorting('A-Z')}
										>
											{t('main.text-4')}
										</span>
									)}
									{displaySortingZA && (
										<span
											className={`${
												activeSorting === 'Z-A' && 'text-black font-[600]'
											} text-[20px] text-[#727272] font-[500] cursor-pointer hover:text-[#272424] transition-colors duration-300`}
											onClick={() => handleSorting('Z-A')}
										>
											{t('main.text-5')}
										</span>
									)}
									{displaySortingYearsInService && (
										<span
											className={`${
												activeSorting === 'yearsInService' && 'text-black font-[600]'
											} text-[20px] text-[#727272] font-[500] cursor-pointer hover:text-[#272424] transition-colors duration-300`}
											onClick={() => handleSorting('yearsInService')}
										>
											{t('main.text-6')}
										</span>
									)}
									{displaySortingRating && (
										<span
											className={`${
												activeSorting === 'rating' && 'text-black font-[600]'
											} text-[20px] text-[#727272] font-[500] cursor-pointer hover:text-[#272424] transition-colors duration-300`}
											onClick={() => handleSorting('rating')}
										>
											{t('main.text-7')}
										</span>
									)}
								</div>
							</div>
						</div>
						<div className="col-span-3">
							<div
								ref={scrollRef}
								className="lg:p-6 bg-white/[0.57] backdrop-blur-[16.5px] rounded-[8px]  grid grid-cols-1 lg:grid-cols-2 gap-5 mt-5 lg:mt-0"
							>
								<div className="lg:col-span-2 mb-10 text-center lg:text-left flex flex-col gap-5">
									<div>
										<h1 className="text-[24px] md:text-[40px] text-primaryColor font-[700]">
											{getServiceName(singleService, locale, true)}
										</h1>
										<p className="text-[18px] md:text-[20px] text-[#21231E]">
											{getServiceDescription(singleService, locale, true)}
										</p>
									</div>
									{filteredClinics?.filter((clinic) => clinic?.user?.active)?.length === 0 && (
										<span className="text-primaryColor font-[600] text-[18px] md:text-[24px]">{t('main.text-2')}</span>
									)}
								</div>
								{filteredClinics?.length > 0 ? (
									filteredClinics
										?.filter((clinic) => clinic?.user?.active)
										?.slice(0, showResults)
										?.map((clinic) => <Card key={clinic.id} clinic={clinic} airports={airports} />)
								) : (
									<span></span>
								)}
							</div>
							{showResults < filteredClinics?.filter((clinic) => clinic?.user?.active).length && (
								<p
									className="button-outline py-2 w-full lg:w-[40%] cursor-pointer mt-6 lg:mt-6 lg:ml-6 hover:bg-primaryColor hover:text-white transition-all duration-300"
									onClick={handlePaginate}
								>
									Prikaži još ordinacija
								</p>
							)}
						</div>
					</section>
				</main>
			</section>
			<Footer />
		</div>
	);
};

export default Service;

export async function getServerSideProps(ctx) {
	const { slug } = ctx.params;

	const singleService = await prisma.service.findFirst({
		where: {
			simplifiedName: slug.trim(),
		},
		include: {
			clinics: {
				include: {
					location: true,
				},
			},
		},
	});

	if (!singleService)
		return {
			redirect: {
				destination: '/',
			},
		};

	const cities = await prisma.location.findMany({
		orderBy: [
			{
				cityName: 'asc',
			},
		],
	});

	const services = await prisma.service.findMany({
		orderBy: {
			order: 'asc',
		},
	});

	const airports = await prisma.airport.findMany();

	const settings = await prisma.setting.findMany();

	return {
		props: {
			singleService,
			cities,
			services,
			settings,
			airports,
		},
	};
}
