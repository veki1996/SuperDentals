import { SideBar, Table, CreateCity, ColumnFilter } from '/components';
import { CSVLink } from 'react-csv';
import { FiEdit } from 'react-icons/fi';
import { RiDeleteBinLine } from 'react-icons/ri';
import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import { prisma } from '/utils/db';

const Cities = ({ cities }) => {
	// States
	const [toggleModal, setToggleModal] = useState(false);
	const [downloadCities, setDownloadCities] = useState([]);
	const [countryFilter, setCountryFilter] = useState('all');
	const [filteredCities, setFilteredCities] = useState([]);

	const router = useRouter();
	const data = useMemo(
		() =>
			filteredCities.map((city) => {
				return {
					id: city.id,
					name: city.cityName,
					zipCode: city.zipCode,
					country: city.country.toUpperCase(),
					createdAt: city.createdAt,
					updatedAt: city.updatedAt,
				};
			}),
		[filteredCities],
	);
	const handleDelete = async (id) => {
		const city = cities?.filter((city) => city?.id === id)[0];

		if (city?.clinics?.length !== 0) {
			alert(
				`You can't delete this city. These clinics are depending on it: ${city?.clinics?.map(
					(clinic) => clinic?.name,
				)}`,
			);
			return;
		}
		let confirmDelete = confirm('Are you sure you want to delete this city?');
		if (!confirmDelete) return;
		const response = await fetch('/api/admin/city/delete', {
			body: JSON.stringify({ id: id }),
			method: 'DELETE',
			headers: {
				'Content-type': 'application/json',
			},
		});

		if (response.status === 200) {
			router.replace(router.asPath);
		}
	};
	const columns = useMemo(
		() => [
			{
				Header: 'Id',
				accessor: 'id',
				show: false,
			},
			{
				Header: 'Name',
				accessor: 'name',
				Filter: ColumnFilter,
				disableFilters: true,
			},
			{
				Header: 'Zip Code',
				accessor: 'zipCode',
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
				Header: 'Actions',
				accessor: 'actions',
				disableSortBy: true,
				Filter: ColumnFilter,
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
							onClick={() => router.push(`/admin/cities/${cell.row.values.id}`)}
							className="btn px-3 py-2 btn-info tooltip"
							data-tip="Edit"
						>
							<FiEdit size={20} />
						</button>
					</div>
				),
			},
		],
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[],
	);

	useEffect(() => {
		setFilteredCities(
			cities.filter((city) => {
				if (countryFilter === 'all') return true;
				if (countryFilter === city.country) return true;
			}),
		);
	}, [countryFilter, cities]);

	useEffect(() => {
		setDownloadCities(
			cities.map((city) => {
				return {
					name: city.cityName,
					zipCode: city.zipCode,
					country: city.country.toUpperCase(),
					mapCoordinates: city.mapCoordinates,
				};
			}),
		);
		router.replace(router.asPath);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);
	return (
		<div className="flex">
			<SideBar active="cities" />
			<div className="flex flex-col flex-1 w-0 overflow-hidden">
				<main className="relative flex-1 overflow-y-auto focus:outline-none">
					<div className="py-6 overflow-x-hidden">
						<div className="px-4 max-w-7xl sm:px-6 md:px-8">
							<h1 className="text-4xl font-bold leading-normal mt-0 mb-2">Cities</h1>
						</div>
						<div className="px-4 mx-auto sm:px-6 md:px-8">
							<div className="py-4">
								<div className="p-5 rounded-lg bg-gray-50 flex flex-col gap-5">
									<div className="flex items-center justify-between">
										<button
											className="btn btn-md w-[190px] bg-secondary hover:bg-secondary/80"
											onClick={() => setToggleModal(true)}
										>
											Add City
										</button>
										<div className="flex flex-col items-center gap-1 basis-[25%]">
											<span className="font-semibold text-zinc-600">Search By Country:</span>
											<select
												className="select select-secondary select-sm w-full max-w-xs my-2"
												placeholder="Select Type"
												onChange={(e) => setCountryFilter(e.target.value)}
											>
												<option value="all">All Cities</option>
												<option value="rs">Serbia</option>
												<option value="ba">Bosnia And Hercegovina</option>
												<option value="cg">Montenegro</option>
											</select>
										</div>
										<CSVLink
											className="btn btn-md w-[190px] bg-secondary hover:bg-secondary/80"
											data={downloadCities}
											filename={'cities-data.csv'}
										>
											Download data
										</CSVLink>
									</div>
									{toggleModal ? (
										<div className="modal opacity-100 visible pointer-events-auto">
											<div className="modal-box">
												<span
													onClick={() => setToggleModal(false)}
													className="btn btn-sm btn-circle absolute right-2 top-2"
												>
													✕
												</span>
												<h3 className="font-bold text-lg">Add New City</h3>

												<div className="modal-action block">
													<CreateCity modal={setToggleModal} />
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

export default Cities;

export async function getServerSideProps() {
	const cities = await prisma.location.findMany({
		include: {
			clinics: true,
		},
	});

	cities.map((city) => {
		city.updatedAt = new Date(city.updatedAt).toLocaleDateString('de-DE');
		city.createdAt = new Date(city.createdAt).toLocaleDateString('de-DE');
	});

	return {
		props: {
			cities,
		},
	};
}
