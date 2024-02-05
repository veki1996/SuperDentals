import { SideBar, Table, CreateAirport, ColumnFilter } from '/components';
import { CSVLink } from 'react-csv';
import { FiEdit } from 'react-icons/fi';
import { RiDeleteBinLine } from 'react-icons/ri';
import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import { prisma } from '/utils/db';

const Airports = ({ airports, cities }) => {
	// States
	const [toggleModal, setToggleModal] = useState(false);
	const [downloadAirports, setDownloadAirports] = useState([]);
	const [countryFilter, setCountryFilter] = useState('all');
	const [filteredAirports, setFilteredAirports] = useState([]);

	const router = useRouter();
	const data = useMemo(
		() =>
			filteredAirports.map((airport) => {
				return {
					id: airport.id,
					name: airport.name,
					code: airport.code,
					city: airport.location?.cityName,
					country: airport.location?.country.toUpperCase(),
					createdAt: airport?.createdAt,
					updatedAt: airport?.updatedAt,
				};
			}),
		[filteredAirports],
	);

	const handleDelete = async (id) => {
		let confirmDelete = confirm('Are you sure you want to delete this airport?');
		if (confirmDelete) {
			const response = await fetch('/api/admin/airport/delete', {
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
				Header: 'Code',
				accessor: 'code',
				Filter: ColumnFilter,
				disableFilters: true,
			},
			{
				Header: 'City',
				accessor: 'city',
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
							onClick={() => router.push(`/admin/airports/${cell.row.values.id}`)}
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
		setFilteredAirports(
			airports.filter((airport) => {
				if (countryFilter === 'all') return true;
				if (countryFilter === airport.location.country) return true;
			}),
		);
	}, [countryFilter, airports]);

	useEffect(() => {
		setDownloadAirports(
			airports.map((airport) => {
				return {
					name: airport.name,
					code: airport.code,
					city: airport.location?.cityName,
					country: airport.location?.country.toUpperCase(),
					mapCoordinates: airport.mapCoordinates,
				};
			}),
		);
		router.replace(router.asPath);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);
	return (
		<div className="flex">
			<SideBar active="airports" />
			<div className="flex flex-col flex-1 w-0 overflow-hidden">
				<main className="relative flex-1 overflow-y-auto focus:outline-none">
					<div className="py-6 overflow-x-hidden">
						<div className="px-4 max-w-7xl sm:px-6 md:px-8">
							<h1 className="text-4xl font-bold leading-normal mt-0 mb-2">Airports</h1>
						</div>
						<div className="px-4 mx-auto sm:px-6 md:px-8">
							<div className="py-4">
								<div className="p-5 rounded-lg bg-gray-50 flex flex-col gap-5">
									<div className="flex items-center justify-between">
										<button
											className="btn btn-md w-[190px] bg-secondary hover:bg-secondary/80"
											onClick={() => setToggleModal(true)}
										>
											Add Airport
										</button>
										<div className="flex flex-col items-center gap-1 basis-[25%]">
											<span className="font-semibold text-zinc-600">Search By Country:</span>
											<select
												className="select select-secondary select-sm w-full max-w-xs my-2"
												placeholder="Select Type"
												onChange={(e) => setCountryFilter(e.target.value)}
											>
												<option value="all">All Airports</option>
												<option value="rs">Serbia</option>
												<option value="ba">Bosnia And Hercegovina</option>
												<option value="cg">Montenegro</option>
											</select>
										</div>
										<CSVLink
											className="btn btn-md w-[190px] bg-secondary hover:bg-secondary/80"
											data={downloadAirports}
											filename={'airports-data.csv'}
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
												<h3 className="font-bold text-lg">Add New Airport</h3>

												<div className="modal-action block">
													<CreateAirport cities={cities} modal={setToggleModal} />
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

export default Airports;

export async function getServerSideProps() {
	const airports = await prisma.airport.findMany({
		include: {
			location: true,
		},
	});

	airports.map((airport) => {
		airport.updatedAt = new Date(airport.updatedAt).toLocaleDateString('de-DE');
		airport.createdAt = new Date(airport.createdAt).toLocaleDateString('de-DE');
	});

	const cities = await prisma.location.findMany({
		orderBy: [
			{
				cityName: 'asc',
			},
		],
		include: {
			airport: true,
		},
	});

	return {
		props: {
			airports,
			cities,
		},
	};
}
