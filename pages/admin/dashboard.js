import { SideBar } from '/components';
import { prisma } from '/utils/db';
import { groupDataByDate, getServiceName } from '/utils/utils';
import { FiUsers, FiUserPlus } from 'react-icons/fi';
import { FaClinicMedical } from 'react-icons/fa';
import { useEffect, useState, useMemo } from 'react';
import 'react-datepicker/dist/react-datepicker.css';
import { Table } from '/components';
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
import { useRouter } from 'next/router';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const Dashboard = ({
	clinics,
	users,
	subscribers,
	services,
	clinicViews,
	cities,
	filteredUsers,
	filteredSubscribers,
	filteredClinics,
	filteredClinicViews,
}) => {
	const [activePer, setActivePer] = useState(0);
	const [verifiedPer, setVerifiedPer] = useState(0);
	const [servicesCount] = useState(services);
	const [clinicsByCity] = useState(cities);
	const [selectedViewsFilter, setSelectedViewsFilter] = useState('allTime');
	const [usersCount, setUsersCount] = useState(filteredUsers);
	const [subscribersCount, setSubscribersCount] = useState(filteredSubscribers);
	const [clinicsCount, setClinicsCount] = useState(filteredClinics);
	const [viewsCount, setViewsCount] = useState(filteredClinicViews);
	const [clinicViewsCount, setClinicViewsCount] = useState([]);
	const [startDate, setStartDate] = useState('');
	const [endDate, setEndDate] = useState('');
	const [clinicId, setClinicId] = useState('');
	const [clinicDateRange, setClinicDateRange] = useState('allTime');
	const [startDateClinic, setStartDateClinic] = useState('');
	const [endDateClinic, setEndDateClinic] = useState('');
	const [clinicTotalViews, setClinicTotalViews] = useState(0);
	useEffect(() => {
		calculateUsersStats();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);
	const router = useRouter();

	const handleClinicChartData = (data, label) => {
		return {
			labels: data
				.sort((a, b) => {
					const parsedDateA = a.date.split('.');
					const parsedDateB = b.date.split('.');

					return (
						new Date(parsedDateA[2], parsedDateA[1], parsedDateA[0]) -
						new Date(parsedDateB[2], parsedDateB[1], parsedDateB[0])
					);
				})
				.map((view) => {
					return view.date;
				}),
			datasets: [
				{
					label: label,
					data: data.map((cliniView) => cliniView.arrays.reduce((a, b) => a + b), 0),
					borderColor: '#FC5122',
					backgroundColor: 'rgba(255, 99, 132, 0.5)',
				},
			],
		};
	};

	const handleChartData = (data, label) => {
		return {
			labels: data
				.sort((a, b) => {
					const parsedDateA = a.date.split('.');
					const parsedDateB = b.date.split('.');

					return (
						new Date(parsedDateA[2], parsedDateA[1] - 1, parsedDateA[0]) -
						new Date(parsedDateB[2], parsedDateB[1] - 1, parsedDateB[0])
					);
				})
				.map((user) => {
					return user.date;
				}),
			datasets: [
				{
					label: label,
					data: data.map((user) => user.arrays.length),
					borderColor: '#FC5122',
					backgroundColor: 'rgba(255, 99, 132, 0.5)',
				},
			],
		};
	};
	const handleChartOptions = (label) => {
		return {
			responsive: true,
			plugins: {
				title: {
					display: true,
					text: label,
				},
			},
		};
	};

	const changeViewsData = async (e) => {
		const dateRange = e.target.value;
		setStartDate('');
		setEndDate('');
		setSelectedViewsFilter(e.target.value);

		const usersResponse = await fetch('/api/admin/dashboard/users/getUsers', {
			method: 'POST',
			body: JSON.stringify({ dateRange: dateRange }),
			headers: {
				'Content-Type': 'application/json',
			},
		});

		if (usersResponse.status === 200) {
			const { users } = await usersResponse.json();
			setUsersCount(groupDataByDate(users));
		}

		const subscribersResponse = await fetch('/api/admin/dashboard/subscribers/getSubscribers', {
			method: 'POST',
			body: JSON.stringify({ dateRange: dateRange }),
			headers: {
				'Content-Type': 'application/json',
			},
		});

		if (subscribersResponse.status === 200) {
			const { subscribers } = await subscribersResponse.json();
			setSubscribersCount(groupDataByDate(subscribers));
		}

		const clinicsResponse = await fetch('/api/admin/dashboard/clinics/getClinics', {
			method: 'POST',
			body: JSON.stringify({ dateRange: dateRange }),
			headers: {
				'Content-Type': 'application/json',
			},
		});

		if (clinicsResponse.status === 200) {
			const { clinics } = await clinicsResponse.json();
			setClinicsCount(groupDataByDate(clinics));
		}

		const totalViewsResponse = await fetch('/api/admin/dashboard/views/getViews', {
			method: 'POST',
			body: JSON.stringify({ dateRange: dateRange }),
			headers: {
				'Content-Type': 'application/json',
			},
		});

		if (totalViewsResponse.status === 200) {
			const { views } = await totalViewsResponse.json();
			setViewsCount(groupDataByDate(views));
		}
	};

	const handleCustomDate = async () => {
		if (startDate !== '' && endDate !== '') {
			const usersResponse = await fetch('/api/admin/dashboard/users/customRangeUsers', {
				method: 'POST',
				body: JSON.stringify({ startDate: startDate, endDate: endDate }),
				headers: {
					'Content-Type': 'application/json',
				},
			});

			if (usersResponse.status === 200) {
				const { users } = await usersResponse.json();
				setUsersCount(groupDataByDate(users));
			}

			const subscribersResponse = await fetch('/api/admin/dashboard/subscribers/customRangeSubscribers', {
				method: 'POST',
				body: JSON.stringify({ startDate: startDate, endDate: endDate }),
				headers: {
					'Content-Type': 'application/json',
				},
			});

			if (subscribersResponse.status === 200) {
				const { subscribers } = await subscribersResponse.json();
				setSubscribersCount(groupDataByDate(subscribers));
			}

			const clinicsResponse = await fetch('/api/admin/dashboard/clinics/customRangeClinics', {
				method: 'POST',
				body: JSON.stringify({ startDate: startDate, endDate: endDate }),
				headers: {
					'Content-Type': 'application/json',
				},
			});

			if (clinicsResponse.status === 200) {
				const { clinics } = await clinicsResponse.json();
				setClinicsCount(groupDataByDate(clinics));
			}

			const totalViewsResponse = await fetch('/api/admin/dashboard/views/customRangeViews', {
				method: 'POST',
				body: JSON.stringify({ startDate: startDate, endDate: endDate }),
				headers: {
					'Content-Type': 'application/json',
				},
			});

			if (totalViewsResponse.status === 200) {
				const { views } = await totalViewsResponse.json();
				setViewsCount(groupDataByDate(views));
			}
		} else {
			alert('Morate izabrati početni i krajnji datum!');
		}
	};

	const changeClinicData = async (e, type) => {
		setEndDateClinic('');
		setStartDateClinic('');
		if (type === 'selectedClinic') {
			const clinicId = e?.target?.value;
			setClinicId(clinicId);
			const clinicViewsResponse = await fetch('/api/admin/dashboard/views/getClinicViews', {
				method: 'POST',
				body: JSON.stringify({ dateRange: clinicDateRange, clinicId: clinicId }),
				headers: {
					'Content-Type': 'application/json',
				},
			});

			if (clinicViewsResponse.status === 200) {
				const { views } = await clinicViewsResponse.json();
				setClinicViewsCount(groupDataByDate(views));
			}
		}

		if (type === 'predefinedRange') {
			const dateRange = e?.target?.value;
			setClinicDateRange(dateRange);
			const clinicViewsResponse = await fetch('/api/admin/dashboard/views/getClinicViews', {
				method: 'POST',
				body: JSON.stringify({ dateRange: dateRange, clinicId: clinicId }),
				headers: {
					'Content-Type': 'application/json',
				},
			});

			if (clinicViewsResponse.status === 200) {
				const { views } = await clinicViewsResponse.json();
				setClinicViewsCount(groupDataByDate(views));
			}
		}
	};

	const handleClinicCustomDate = async () => {
		if (startDateClinic !== '' && endDateClinic !== '') {
			const clinicViewsResponse = await fetch('/api/admin/dashboard/views/customRangeClinicViews', {
				method: 'POST',
				body: JSON.stringify({ startDate: startDateClinic, endDate: endDateClinic, clinicId: clinicId }),
				headers: {
					'Content-Type': 'application/json',
				},
			});

			if (clinicViewsResponse.status === 200) {
				const { views } = await clinicViewsResponse.json();
				setClinicViewsCount(groupDataByDate(views));
			}
		} else {
			alert('You must choose start and end date!');
		}
	};

	const calculateUsersStats = () => {
		let verified = 0;
		let active = 0;

		users.map((user) => {
			user.verified ? (verified += 1) : null;
			user.active ? (active += 1) : null;
		});
		setActivePer(active);
		setVerifiedPer(verified);
	};
	const servicesTableData = useMemo(
		() =>
			servicesCount.map((service, index) => {
				return {
					id: index + 1,
					name: getServiceName(service, 'gb', true),
					total: service?.clinics?.length,
				};
			}),
		[servicesCount],
	);

	const columnsServices = useMemo(
		() => [
			{
				Header: 'Id',
				accessor: 'id',
				Filter: false,
			},
			{
				Header: 'Service',
				accessor: 'name',
				Filter: false,
			},
			{
				Header: 'Number of clinics by service',
				accessor: 'total',
				Filter: false,
			},
		],
		[],
	);

	const clinicsTableData = useMemo(
		() =>
			clinicsByCity.map((city, index) => {
				return {
					id: index + 1,
					name: city?.cityName,
					total: city?.clinics?.length,
				};
			}),
		[clinicsByCity],
	);
	const clinicsCountryTableData = useMemo(
		() =>
			clinicsByCity.map((country, index) => {
				return {
					id: index + 1,
					name: country?.country,
					total: country?.clinics?.length,
				};
			}),
		[clinicsByCity],
	);

	function calculateTotalClinicsPerCountry(arr) {
		const nameMapping = {
			ba: 'Bosnia and Herzegovina',
			hr: 'Croatia',
			me: 'Montenegro',
			rs: 'Serbia',
			si: 'Slovenia',
		};

		const totalsByName = {};

		// Calculate the total for each name
		for (const obj of arr) {
			const { name, total } = obj;
			if (totalsByName[name]) {
				totalsByName[name].total += total;
			} else {
				totalsByName[name] = { name, total };
			}
		}

		// Create a new array of objects with the calculated totals, new names, and new ids
		const result = Object.values(totalsByName).map((item, index) => ({
			id: index + 1,
			name: nameMapping[item.name] || item.name, // Use the mapping or original name if not found
			total: item.total,
		}));

		return result;
	}
	const clinicsByCountry = calculateTotalClinicsPerCountry(clinicsCountryTableData);

	const columnsCountry = useMemo(
		() => [
			{
				Header: 'Id',
				accessor: 'id',
				Filter: false,
			},
			{
				Header: 'Country',
				accessor: 'name',
				Filter: false,
			},
			{
				Header: 'Total clinics per country',
				accessor: 'total',
				Filter: false,
			},
		],
		[],
	);
	const columnsCity = useMemo(
		() => [
			{
				Header: 'Id',
				accessor: 'id',
				Filter: false,
			},
			{
				Header: 'City',
				accessor: 'name',
				Filter: false,
			},
			{
				Header: 'Total clinics per city',
				accessor: 'total',
				Filter: false,
			},
		],
		[],
	);

	const totalViews =
		clinicViews.length > 0
			? clinicViews?.reduce((acc, value) => {
					return acc + value.views;
			  }, 0)
			: '0';

	useEffect(() => {
		if (clinicViewsCount?.length > 0) {
			setClinicTotalViews(
				clinicViewsCount.map((cliniView) => cliniView.arrays.reduce((a, b) => a + b), 0)?.reduce((a, b) => a + b),
				0,
			);
		} else setClinicTotalViews(0);
	}, [clinicViewsCount]);

	const clinicViewsData = useMemo(
		() =>
			clinics.map((clinic, index) => {
				const now = new Date();
				let totalClinicViews;
				if (selectedViewsFilter === 'allTime') {
					totalClinicViews = clinic?.clinicViewsPerDay.reduce((acc, value) => {
						return acc + value.views;
					}, 0);
				} else if (selectedViewsFilter === 'currentYear') {
					const filteredClinicViews = clinic?.clinicViewsPerDay?.filter((clinicViews) => {
						if (clinicViews?.createdAt <= now && clinicViews?.createdAt >= new Date(now.getFullYear(), 0, 1))
							return true;
					});

					totalClinicViews = filteredClinicViews.reduce((acc, value) => {
						return acc + value.views;
					}, 0);
				} else if (selectedViewsFilter === 'currentMonth') {
					const filteredClinicViews = clinic?.clinicViewsPerDay?.filter((clinicViews) => {
						if (
							clinicViews?.createdAt <= now &&
							clinicViews?.createdAt >= new Date(now.getFullYear(), now.getMonth(), 1)
						)
							return true;
					});

					totalClinicViews = filteredClinicViews.reduce((acc, value) => {
						return acc + value.views;
					}, 0);
				} else if (selectedViewsFilter === 'currentDay') {
					const getPreviousDay = () => {
						const prev = new Date(now.getTime());
						prev.setDate(now.getDate() - 1);

						return prev;
					};
					const filteredClinicViews = clinic?.clinicViewsPerDay?.filter((clinicViews) => {
						if (clinicViews?.createdAt <= now && clinicViews?.createdAt > getPreviousDay(now)) return true;
					});

					totalClinicViews = filteredClinicViews.reduce((acc, value) => {
						return acc + value.views;
					}, 0);
				} else if (selectedViewsFilter === 'lastMonth') {
					const filteredClinicViews = clinic?.clinicViewsPerDay?.filter((clinicViews) => {
						if (
							clinicViews?.createdAt <= new Date(now.getFullYear(), now.getMonth(), 0) &&
							clinicViews?.createdAt >= new Date(now.getFullYear(), now.getMonth() - 1, 1)
						)
							return true;
					});

					totalClinicViews = filteredClinicViews.reduce((acc, value) => {
						return acc + value.views;
					}, 0);
				} else if (selectedViewsFilter === 'lastWeek') {
					const filteredClinicViews = clinic?.clinicViewsPerDay?.filter((clinicViews) => {
						if (
							clinicViews?.createdAt <= now &&
							clinicViews?.createdAt >= new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7)
						)
							return true;
					});

					totalClinicViews = filteredClinicViews.reduce((acc, value) => {
						return acc + value.views;
					}, 0);
				}

				return {
					id: index + 1,
					clinic: clinic?.name,
					totalViews: clinic?.clinicViewsPerDay.length > 0 ? totalClinicViews : '0',
				};
			}),
		[clinics, selectedViewsFilter],
	);
	const clinicViewsColumns = useMemo(
		() => [
			{
				Header: 'Id',
				accessor: 'id',
				Filter: false,
			},
			{
				Header: 'Clinic',
				accessor: 'clinic',
				Filter: false,
			},
			{
				Header: 'Views',
				accessor: 'totalViews',
				Filter: false,
			},
		],
		[],
	);

	return (
		<div className="flex  ">
			<SideBar active="dashboard" />

			<div className="flex flex-col flex-1    w-0 overflow-hidden">
				<main className="relative flex-1    overflow-y-auto focus:outline-none">
					<div className="p-6 w-full    bg-white">
						<h1 className="text-4xl font-bold leading-normal mt-0 mb-2 textsecondary">Dashboard</h1>

						<h2 className="text-2xl font-[600] leading-normal mt-0 mb-2 text-secondary">Analytics page</h2>
						<div className="w-full">
							<div className="rounded-[1rem] bg-secondary text-secondary-content overflow-hidden grid 2xl:grid-cols-6 lg:grid-cols-3 md:grid-cols-2 ">
								<div className="stat">
									<div className="stat-title">Number of Users</div>
									<div className="stat-value flex items-center gap-3">
										{users.length} <FiUsers size={30} />
									</div>
									<div className="stat-actions">
										<button className="btn btn-sm btn-primary" onClick={() => router.push('/admin/users')}>
											Go to Users
										</button>
									</div>
								</div>
								<div className="stat">
									<div className="stat-title">Number of Subscribers</div>
									<div className="stat-value flex items-center gap-3">
										{subscribers.length} <FiUserPlus size={30} />
									</div>
									<div className="stat-actions">
										<button className="btn btn-sm btn-primary" onClick={() => router.push('/admin/subscribers')}>
											Go to Subscribers
										</button>
									</div>
								</div>
								<div className="stat">
									<div className="stat-title">Number of Clinics</div>
									<div className="stat-value flex items-center gap-3">
										{clinics.length} <FaClinicMedical size={30} />
									</div>
									<div className="stat-actions">
										<button className="btn btn-sm btn-primary" onClick={() => router.push('/admin/clinics')}>
											Go to Clinics
										</button>
									</div>
								</div>
								<div className="stat">
									<div className="stat-title">Total Views of Clinics</div>
									<div className="stat-value flex items-center gap-3">
										{totalViews} <FaClinicMedical size={30} />
									</div>
									<div className="stat-actions">
										<button className="btn btn-sm btn-primary" onClick={() => router.push('/admin/clinics')}>
											Go to Clinics
										</button>
									</div>
								</div>
								<div className="stat">
									<div className="stat-title">Verified Users</div>

									<div className="flex-row  ">
										<div className="stat-value">
											<progress
												className="progress    bg-white progress-primary"
												value={(verifiedPer / users.length) * 100}
												max="100"
											></progress>
										</div>
										<div className="stat-desc">
											<span className="lg:text-base">
												{verifiedPer} of {users.length} users
											</span>
										</div>
									</div>
								</div>
								<div className="stat">
									<div className="stat-title">Published Users</div>

									<div className="flex-row  ">
										<div className="stat-value ">
											<div className="stat-value">
												<progress
													className="progress  bg-white progress-primary"
													value={(activePer / users.length) * 100}
													max="100"
												></progress>
											</div>
										</div>
										<div className="stat-desc">
											<span className="lg:text-base">
												{activePer} of {users.length} users
											</span>
										</div>
									</div>
								</div>
							</div>
						</div>
						<div>
							<div className="mt-6 flex items-center justify-between flex-wrap">
								<div>
									<h1 className="text-[#727272] font-[600] text-[18px]">Predefined range</h1>
									<select onChange={(e) => changeViewsData(e)} id="countries" className="clinic-input w-full py-2 mt-2">
										<option value="" className="invisible">
											Predefined range
										</option>
										<option value="allTime">All time</option>
										<option value="lastWeek">Last week</option>
										<option value="lastMonth">Last month</option>
										<option value="currentDay">Today</option>
										<option value="currentMonth">Current month</option>
										<option value="currentYear">Current year</option>
									</select>
								</div>
								<div className="mt-3">
									<h1 className="text-[#727272] font-[600] text-[18px]">Date range</h1>
									<div className="flex flex-col gap-3">
										<div className="flex flex-col md:flex-row gap-3">
											<div className="flex flex-col">
												<label className="text-[#727272] font-[600]">From:</label>
												<input
													className="clinic-input py-2"
													type="date"
													value={startDate}
													onChange={(e) => setStartDate(e?.target?.value)}
												/>
											</div>

											<div className="flex flex-col">
												<label className="text-[#727272] font-[600]">To:</label>
												<input
													className="clinic-input py-2"
													type="date"
													value={endDate}
													onChange={(e) => setEndDate(e?.target?.value)}
												/>
											</div>
										</div>
										<button type="button" onClick={handleCustomDate} className="button py-1 w-[40%]">
											Apply
										</button>
									</div>
								</div>
							</div>

							<div className="flex flex-col mt-5">
								<div className="flex flex-col lg:flex-row">
									<div className="basis-1/2">
										<Line
											width="full"
											options={handleChartOptions('Registered users')}
											data={handleChartData(usersCount, 'Registered Users')}
										/>
									</div>
									<div className="basis-1/2">
										<Line
											width="full"
											options={handleChartOptions('Subscribers')}
											data={handleChartData(subscribersCount, 'Subscribers')}
										/>
									</div>
								</div>
								<div className="flex flex-col lg:flex-row">
									<div className="basis-1/2">
										<Line
											width="full"
											options={handleChartOptions('Clinics')}
											data={handleChartData(clinicsCount, 'Clinics')}
										/>
									</div>
									<div className="basis-1/2">
										<Line
											width="full"
											options={handleChartOptions('Total Views')}
											data={handleClinicChartData(viewsCount, 'Total Views')}
										/>
									</div>
								</div>
							</div>
						</div>
						<div className="xl:pr-10 mt-10">
							<h1 className="text-xl font-bold leading-normal mt-0 mb-2 text-secondary">Clinic Views</h1>
							<div className="mt-6 flex flex-col lg:flex-row gap-14">
								<div className="basis-[40%] mt-6">
									<div className="flex flex-col">
										<label className="text-[#727272] font-[600] text-[18px]">Select Clinic</label>
										<select
											className="clinic-input py-2 mt-2 mb-2"
											onChange={(e) => changeClinicData(e, 'selectedClinic')}
										>
											<option value="" className="invisible">
												Select Clinic
											</option>
											{clinics?.map((clinic) => (
												<option value={clinic?.id} key={clinic?.id}>
													{clinic?.name}
												</option>
											))}
										</select>
									</div>
									<div className="flex flex-col">
										<label className="text-[#727272] font-[600] text-[18px]">Predefined Range</label>
										<select
											onChange={(e) => changeClinicData(e, 'predefinedRange')}
											id="countries"
											className="clinic-input py-2 mt-2"
										>
											<option value="" className="invisible">
												Predefined Range
											</option>
											<option value="allTime">All time</option>
											<option value="lastWeek">Last week</option>
											<option value="lastMonth">Last month</option>
											<option value="currentDay">Today</option>
											<option value="currentMonth">Current month</option>
											<option value="currentYear">Current year</option>
										</select>
									</div>

									<div className="mt-3">
										<h1 className="text-[#727272] font-[600] text-[18px]">Date Range</h1>
										<div className="flex flex-col gap-3">
											<div className="flex flex-col md:flex-row gap-3">
												<div className="flex flex-col">
													<label className="text-[#727272] font-[600]">From:</label>
													<input
														className="clinic-input py-2"
														type="date"
														value={startDateClinic}
														onChange={(e) => setStartDateClinic(e?.target?.value)}
													/>
												</div>

												<div className="flex flex-col">
													<label className="text-[#727272] font-[600]">To:</label>
													<input
														className="clinic-input py-2"
														type="date"
														value={endDateClinic}
														onChange={(e) => setEndDateClinic(e?.target?.value)}
													/>
												</div>
											</div>
											<button type="button" onClick={handleClinicCustomDate} className="button py-1 w-[40%]">
												Apply
											</button>
										</div>
									</div>
								</div>
								<div className="basis-[60%]">
									<div className="text-black text-[26px] font-[700] mt-4">
										Views: <span className="text-primaryColor">{clinicTotalViews}</span>
									</div>
									<Line
										className="w-full"
										options={handleChartOptions('Clinic Views')}
										data={handleClinicChartData(clinicViewsCount, 'Clinic Views')}
									/>
								</div>
							</div>
							<h1 className="text-xl font-bold leading-normal mt-20 mb-2 text-black-800 text-secondary">
								Total views per clinic
							</h1>
							<Table data={clinicViewsData} columns={clinicViewsColumns} />
						</div>
						<div className="xl:pr-10 mt-10">
							<div className="xl:pr-10 mt-0">
								<h1 className="text-xl font-bold leading-normal mt-0 mb-2 text-black-800 text-secondary">
									Number of clinics by country
								</h1>
								<Table data={clinicsByCountry} columns={columnsCountry} />
							</div>
							<div className="xl:pr-10 mt-0">
								<h1 className="text-xl font-bold leading-normal mt-0 mb-2 text-black-800 text-secondary">
									Number of clinics per city
								</h1>
								<Table data={clinicsTableData} columns={columnsCity} />
							</div>
							<div className="xl:pr-10 mt-10">
								<h1 className="text-xl font-bold leading-normal mt-0 mb-2 text-black-800 text-secondary">
									Number of clinics per service
								</h1>

								<Table data={servicesTableData} columns={columnsServices} />
							</div>
						</div>
					</div>
				</main>
			</div>
		</div>
	);
};

export default Dashboard;

export async function getServerSideProps() {
	const clinics = await prisma.clinic.findMany({
		include: {
			services: true,
			location: true,
			clinicViewsPerDay: true,
		},
	});
	const filteredClinics = groupDataByDate(clinics);

	const cities = await prisma.location.findMany({
		where: {
			clinics: {
				some: {},
			},
		},
		include: {
			clinics: true,
		},
	});

	const services = await prisma.service.findMany({
		orderBy: {
			order: 'asc',
		},
		where: {
			clinics: {
				some: {},
			},
		},
		include: {
			clinics: {
				select: {
					id: true,
				},
			},
		},
	});

	const users = await prisma.user.findMany();
	const filteredUsers = groupDataByDate(users);

	const subscribers = await prisma.subscriber.findMany();
	const filteredSubscribers = groupDataByDate(subscribers);

	const clinicViews = await prisma.viewsCounter.findMany();
	const filteredClinicViews = groupDataByDate(clinicViews);

	return {
		props: {
			clinics,
			users,
			subscribers,
			services,
			clinicViews,
			cities,
			filteredUsers,
			filteredSubscribers,
			filteredClinics,
			filteredClinicViews,
		},
	};
}
