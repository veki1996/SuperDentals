import { useRouter } from 'next/router';
import { useEffect, useMemo, useState } from 'react';
import { CSVLink } from 'react-csv';
import { GoLocation } from 'react-icons/go';
import Select, { createFilter } from 'react-select';
import { FiEdit } from 'react-icons/fi';
import { RiDeleteBinLine, RiPinDistanceFill } from 'react-icons/ri';
import { Table, SideBar, CreateClinicAdmin, ColumnFilter, ChangeClinicLocation } from '/components';
import { prisma } from '/utils/db';
import { useJsApiLoader } from '@react-google-maps/api';

export const countryOptions = [
	{ value: 'all', label: 'All Clinics' },
	{ value: 'ba', label: 'Bosnia and Hercegovina' },
	{ value: 'rs', label: 'Serbia' },
	{ value: 'cg', label: 'Montenegro' },
];

let distances = [];

const Clinics = ({ clinics, services, users, cities, airports }) => {
	// States
	const [toggleModal, setToggleModal] = useState(false);
	const [clinic, setClinic] = useState(null);
	const [isFinished, setIsFinished] = useState(true);
	const [toggleLocationModal, setToggleLocationModal] = useState(false);
	const [downloadClinics, setDownloadClinics] = useState([]);
	const [countryFilter, setCountryFilter] = useState('all');
	const [cityFilter, setCityFilter] = useState({ value: 'all', label: 'All Clinics' });
	const [filteredClinics, setFilteredClinics] = useState([]);

	// Load Apis through use
	const {} = useJsApiLoader({
		googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
	});

	const router = useRouter();

	const cityOptions = cities
		?.sort((a, b) => {
			return a?.cityName[0].localeCompare(b?.cityName[0], 'sr-RS');
		})
		?.map((city) => {
			if (city.country === countryFilter) {
				return {
					value: city.cityName,
					label: city.cityName,
				};
			}

			if (countryFilter === 'all') {
				return {
					value: city.cityName,
					label: city.cityName,
				};
			}
		});

	const filteredCities = cityOptions.filter((city) => city !== undefined);

	const handleDelete = async (id) => {
		let confirmDelete = confirm('Are you sure you want to delete this clinic?');
		if (confirmDelete) {
			const response = await fetch('/api/admin/clinic/delete', {
				body: JSON.stringify({ id: id }),
				method: 'DELETE',
				headers: {
					'Content-type': 'application/json',
				},
			});

			if (response.status === 200) {
				router.replace(router.asPath);
			}
		} else return;
	};

	const handlePremium = async (id, e) => {
		const premium = e.target.checked;
		const response = await fetch('/api/admin/clinic/premium', {
			body: JSON.stringify({ id: id, premium: premium }),
			method: 'POST',
			headers: {
				'Content-type': 'application/json',
			},
		});

		if (response.status === 200) {
			router.replace(router.asPath);
		}
	};
	const data = useMemo(
		() =>
			filteredClinics.map((clinic) => {
				return {
					id: clinic.id,
					prem: clinic?.premium,
					mapCoords: clinic?.mapCoordinates || '',
					published: clinic.user.active ? 'Yes' : 'No',
					name: clinic.name,
					country: clinic?.location?.country.toUpperCase(),
					location: clinic?.location?.cityName,
					owner: `${clinic.user.name} ${clinic.user.surname}`,
					jib: clinic.jib,
					pdv: clinic.pdv,
					createdAt: clinic.createdAt,
					updatedAt: clinic.updatedAt,
				};
			}),

		[filteredClinics],
	);

	const columns = useMemo(
		() => [
			{
				Header: 'Id',
				accessor: 'id',
				Filter: ColumnFilter,
				show: false,
			},
			{
				Header: 'Priority',
				accessor: 'prem',
				Filter: ColumnFilter,
				show: false,
			},
			{
				Header: 'Map Coordinates',
				accessor: 'mapCoords',
				Filter: ColumnFilter,
				show: false,
			},
			{
				Header: 'Published',
				accessor: 'published',
				Filter: ColumnFilter,
				show: false,
			},
			{
				Header: 'Name',
				accessor: 'name',
				Filter: ColumnFilter,
				disableFilters: true,
			},
			{
				Header: 'Country',
				accessor: 'country',
				Filter: ColumnFilter,
				disableFilters: true,
			},
			{
				Header: 'City',
				accessor: 'location',
				Filter: ColumnFilter,
				disableFilters: true,
			},
			{
				Header: 'Owner(user)',
				accessor: 'owner',
				Filter: ColumnFilter,
				disableFilters: true,
			},
			{
				Header: 'Jib',
				accessor: 'jib',
				Filter: ColumnFilter,
				disableFilters: true,
			},
			{
				Header: 'Pdv',
				accessor: 'pdv',
				Filter: ColumnFilter,
				disableFilters: true,
			},
			{
				Header: 'Created At',
				accessor: 'createdAt',
				Filter: ColumnFilter,
				disableFilters: true,
			},
			{
				Header: 'Updated At',
				accessor: 'updatedAt',
				Filter: ColumnFilter,
				disableFilters: true,
			},
			{
				Header: 'Priority',
				accessor: 'premium',
				Filter: ColumnFilter,
				disableSortBy: true,
				disableFilters: true,
				Cell: ({ cell }) => (
					<div className="flex items-center justify-center">
						<input
							defaultChecked={cell?.row?.values?.prem || false}
							type="checkbox"
							className="checkbox checkbox-primary"
							onChange={(e) => handlePremium(cell.row.values.id, e)}
						/>
					</div>
				),
			},
			{
				Header: 'Actions',
				accessor: 'actions',
				Filter: ColumnFilter,
				disableSortBy: true,
				disableFilters: true,
				Cell: ({ cell }) => (
					<div className="flex items-center gap-3">
						<button
							onClick={() => handleDelete(cell.row.values.id)}
							className="btn px-3 py-2 btn-error tooltip"
							data-tip="Delete"
						>
							<RiDeleteBinLine size={20} />
						</button>
						<button
							onClick={() => router.push(`/admin/clinics/${cell.row.values.id}`)}
							className="btn px-3 py-2 btn-info tooltip"
							data-tip="Edit"
						>
							<FiEdit size={20} />
						</button>
						<button
							onClick={() => {
								setToggleLocationModal(true);
								setClinic(cell.row.values.id);
							}}
							className="btn px-3 py-2 btn-warning tooltip"
							data-tip="Add & change Location"
						>
							<GoLocation size={20} />
						</button>
						{cell.row.values.published === 'Yes' && cell.row.values.mapCoords !== '' && (
							<button
								onClick={() => handleCalculateDistances(cell.row.values.id)}
								className="btn px-3 py-2 btn-accent tooltip"
								data-tip="Calculate Distances"
							>
								<RiPinDistanceFill size={20} />
							</button>
						)}
					</div>
				),
			},
		],
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[],
	);

	const filterClinics = () => {
		let updatedClinics = clinics;

		if (countryFilter === 'all') {
			updatedClinics = updatedClinics;
		}

		if (countryFilter !== 'all') {
			updatedClinics = updatedClinics?.filter((clinic) => clinic?.location?.country === countryFilter);
		}

		if (cityFilter?.value === 'all') {
			updatedClinics = updatedClinics;
		}

		if (cityFilter?.value !== 'all') {
			updatedClinics = updatedClinics?.filter((clinic) => clinic?.location?.cityName === cityFilter?.value);
		}

		setFilteredClinics(updatedClinics);
	};

	useEffect(() => {
		setCityFilter({ value: 'all', label: 'All Clinics' });
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [countryFilter]);

	useEffect(() => {
		filterClinics();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [countryFilter, cityFilter]);

	const handleCalculateDistances = async (id) => {
		const currentClinic = clinics.find((clinic) => clinic.id === id);
		let confirmAction = confirm(
			`Are you sure you want to calculate distances from airports for ${currentClinic.name}?`,
		);
		if (confirmAction) {
			setIsFinished(false);

			// Resolve array of promises and update distanceFromAirports column
			const writeToDb = async () => {
				const response = await fetch('/api/admin/clinic/calculateDistances', {
					body: JSON.stringify({ id: id, distances: distances }),
					method: 'POST',
					headers: {
						'Content-type': 'application/json',
					},
				});

				if (response.status === 200) {
					setIsFinished(true);
					router.reload();
				}
			};
			// Converting origin string for LatLng object

			airports?.map((airport, i) => {
				setTimeout(async () => {
					const origin = airport.mapCoordinates.trim().split(',');
					const originLat = parseFloat(origin[0]);
					const originLong = parseFloat(origin[1]);
					// Converting destination string for LatLng object
					const destination = JSON.parse(currentClinic.mapCoordinates);
					const directionsService = new google.maps.DirectionsService();

					const results = await directionsService.route({
						origin: new google.maps.LatLng(originLat, originLong),
						destination: new google.maps.LatLng(destination),
						travelMode: google.maps.TravelMode.DRIVING,
					});

					distances = [
						...distances,
						{
							distance: results.routes[0].legs[0].distance.text.split(' ')[0],
							airport: airport.id,
						},
					];

					if (airports?.length - 1 === i) {
						writeToDb();
					}
				}, 1000 * i);
			});
		} else return;
	};

	useEffect(() => {
		setDownloadClinics(
			clinics.map((clinic) => {
				return {
					name: clinic.name,
					username: clinic.username,
					location: clinic.location.cityName,
					owner: `${clinic.user.name} ${clinic.user.surname}`,
					jib: clinic.jib,
					pdv: clinic.pdv,
					email: clinic.email,
					address: clinic.address,
					phoneNumbers: JSON.parse(clinic.phoneNumbers)?.map(
						(phoneNumber) => `${phoneNumber.numberType}: ${phoneNumber.number}, `,
					),
					languagesSpoken: JSON.parse(clinic.languagesSpoken)?.map((language) => `${language.label}, `),
					videoAlbum: JSON.parse(clinic.videoAlbum)?.map((video) => `${video.videoLink}, `),
					workHours: JSON.parse(clinic.workHours)?.map(
						(workHour) => `${workHour.day}: ${workHour.from}-${workHour.to}, `,
					),
					numberOfOfficess: clinic.numberOfOffices,
					yearsInService: clinic.yearsInService,
					numberOfDoctors: clinic.numberOfDoctors,
					numberOfStaff: clinic.numberOfStaff,
					wifiAvailable: clinic.wifiAvailable ? 'Yes' : 'No',
					parkingAvailable: clinic.parkingAvailable ? 'Yes' : 'No',
					warrantyProvided: clinic.warrantyProvided ? 'Yes' : 'No',
					firstCheckupIsFree: clinic.firstCheckupIsFree ? 'Yes' : 'No',
					emergencyAvailability: clinic.emergencyAvailability ? 'Yes' : 'No',
					creditCardPaymentAvailable: clinic.creditCardPaymentAvailable ? 'Yes' : 'No',
					website: clinic.website,
					facebook: clinic.facebook,
					twitter: clinic.twitter,
					instagram: clinic.instagram,
				};
			}),
		);
		router.replace(router.asPath);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<div className="flex relative">
			{!isFinished && (
				<div className="absolute top-0 left-0 w-full h-full z-[9999] bg-black/30 flex items-center justify-center">
					<div className="flex items-center justify-center flex-col gap-2 py-2 px-3 bg-white rounded-lg">
						<div class="flex items-center justify-center">
							<div
								class="inline-block h-10 w-10 animate-spin rounded-full border-4 border-solid border-secondary border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
								role="status"
							>
								<span class="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
									Loading...
								</span>
							</div>
						</div>
						<h1 className="text-secondary [text-shadow:_0_1px_0_rgb(0_0_0_/_40%)] font-semibold">
							Please wait until we finish calculating distances. It may take up to 30 seconds...
						</h1>
					</div>
				</div>
			)}

			<SideBar active="clinics" />
			<div className="flex flex-col flex-1 w-0 overflow-hidden">
				<main className="relative flex-1 overflow-y-auto focus:outline-none">
					<div className="py-6 overflow-x-hidden">
						<div className="px-4 w-min sm:px-6 md:px-8">
							<h1 className="text-4xl font-bold leading-normal mt-0 mb-2">Clinics</h1>
						</div>
						<div className="px-4 mx-auto sm:px-6 md:px-8">
							<div className="py-4">
								<div className="p-5 rounded-lg bg-gray-50 flex flex-col gap-5">
									<div className="flex items-center justify-between">
										<button
											className="btn btn-md w-[190px] bg-secondary hover:bg-secondary/80"
											onClick={() => setToggleModal(true)}
										>
											Add Clinic
										</button>
										<div className="flex basis-[40%] gap-6">
											<div className="flex flex-col items-center gap-1 basis-[50%]">
												<span className="font-semibold text-zinc-600">Search By Country:</span>
												<Select
													placeholder="All Clinics"
													className="w-full"
													options={countryOptions}
													instanceId="selectCity"
													onChange={(e) => setCountryFilter(e?.value)}
													filterOption={createFilter({ ignoreAccents: false })}
													theme={(theme) => ({
														...theme,
														borderRadius: 8,
													})}
												/>
											</div>
											<div className="flex flex-col items-center gap-1 basis-[50%]">
												<span className="font-semibold text-zinc-600">Search By City:</span>
												<Select
													placeholder="All Clinics"
													className="w-full"
													options={[{ value: 'all', label: 'All Clinics' }, ...filteredCities]}
													instanceId="selectCity"
													value={cityFilter}
													onChange={(e) => setCityFilter(e)}
													filterOption={createFilter({ ignoreAccents: false })}
													theme={(theme) => ({
														...theme,
														borderRadius: 8,
													})}
												/>
											</div>
										</div>
										<CSVLink
											className="btn btn-md w-[190px] bg-secondary hover:bg-secondary/80"
											data={downloadClinics}
											filename={'clinics-data.csv'}
										>
											Download data
										</CSVLink>
									</div>
									{toggleModal ? (
										<div className="modal opacity-100 visible pointer-events-auto">
											<div className="modal-box w-11/12 max-w-5xl">
												<span
													onClick={() => setToggleModal(false)}
													className="btn btn-sm btn-circle absolute right-2 top-2"
												>
													✕
												</span>
												<h3 className="font-bold text-lg">Add New Clinic</h3>

												<div className="modal-action block">
													<CreateClinicAdmin services={services} users={users} cities={cities} modal={setToggleModal} />
												</div>
											</div>
										</div>
									) : (
										<></>
									)}
									{toggleLocationModal ? (
										<div className="modal opacity-100 visible pointer-events-auto">
											<div className="modal-box w-11/12 max-w-5xl">
												<span
													onClick={() => setToggleLocationModal(false)}
													className="btn btn-sm btn-circle absolute right-2 top-2"
												>
													✕
												</span>
												<h3 className="font-bold text-lg">Add or edit clinic coordinates</h3>

												<div className="modal-action block">
													<ChangeClinicLocation clinic={clinic} airports={airports} modal={setToggleLocationModal} />
												</div>
											</div>
										</div>
									) : (
										<></>
									)}
									<Table data={data} columns={columns} />
								</div>
							</div>
						</div>
					</div>
				</main>
			</div>
		</div>
	);
};

export default Clinics;

export async function getServerSideProps() {
	const clinics = await prisma.clinic.findMany({
		include: {
			user: true,
			location: true,
		},
	});

	clinics.map((clinic) => {
		clinic.updatedAt = new Date(clinic.updatedAt).toLocaleDateString('de-DE');
		clinic.createdAt = new Date(clinic.createdAt).toLocaleDateString('de-DE');
	});

	const services = await prisma.service.findMany({
		orderBy: {
			order: 'asc',
		},
	});

	const users = await prisma.user.findMany();

	const cities = await prisma.location.findMany({
		orderBy: [
			{
				cityName: 'asc',
			},
		],
	});

	const airports = await prisma.airport.findMany();

	return {
		props: {
			clinics,
			services,
			users,
			cities,
			airports,
		},
	};
}
