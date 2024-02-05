import { SideBar, CreateEmployeeAdmin, Table, ColumnFilter } from '/components';
import { CSVLink } from 'react-csv';
import { useEffect, useMemo, useState } from 'react';
import { RiDeleteBinLine } from 'react-icons/ri';
import { FiEdit } from 'react-icons/fi';
import { useRouter } from 'next/router';
import { prisma } from '/utils/db';

const Employees = ({ employees, clinics }) => {
	const router = useRouter();

	// States
	const [toggleModal, setToggleModal] = useState(false);
	const [downloadEmployees, setDownloadEmployees] = useState([]);
	const [clinicFilter, setClinicFilter] = useState('all');
	const [filteredEmployees, setFilteredEmployees] = useState([]);

	const data = useMemo(
		() =>
			filteredEmployees.map((employee) => {
				return {
					id: employee?.id,
					name: `${employee?.name} ${employee?.surname}`,
					title: employee?.title?.toUpperCase(),
					type: employee?.type?.toUpperCase(),
					clinic: employee?.clinic?.name,
					createdAt: employee.createdAt,
					updatedAt: employee.updatedAt,
				};
			}),
		[filteredEmployees],
	);
	const handleDelete = async (id) => {
		let confirmDelete = confirm('Are you sure you want to delete this employee?');
		if (confirmDelete) {
			const response = await fetch('/api/admin/employee/delete', {
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
				Header: 'Title',
				accessor: 'title',
				Filter: ColumnFilter,
				disableFilters: true,
			},
			{
				Header: 'Type',
				accessor: 'type',
				Filter: ColumnFilter,
				disableFilters: true,
			},
			{
				Header: 'Clinic',
				accessor: 'clinic',
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
							onClick={() => router.push(`/admin/employees/${cell.row.values.id}`)}
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
		setFilteredEmployees(
			employees.filter((employee) => {
				if (clinicFilter === 'all') return true;
				if (clinicFilter === employee.clinicId) return true;
			}),
		);
	}, [clinicFilter, employees]);

	useEffect(() => {
		setDownloadEmployees(
			employees.map((employee) => {
				return {
					name: `${employee?.name} ${employee?.surname}`,
					title: employee?.title?.toUpperCase(),
					type: employee?.type?.toUpperCase(),
					clinic: employee?.clinic?.name,
				};
			}),
		);
		router.replace(router.asPath);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);
	return (
		<div className="flex">
			<SideBar active="employees" />
			<div className="flex flex-col flex-1 w-0 overflow-hidden">
				<main className="relative flex-1 overflow-y-auto focus:outline-none">
					<div className="py-6 overflow-x-hidden">
						<div className="px-4 w-min sm:px-6 md:px-8">
							<h1 className="text-4xl font-bold leading-normal mt-0 mb-2">Employees</h1>
						</div>
						<div className="px-4 mx-auto sm:px-6 md:px-8">
							<div className="py-4">
								<div className="p-5 rounded-lg bg-gray-50  flex flex-col gap-5">
									<div className="flex items-center justify-between">
										<button
											className="btn btn-md w-[190px] bg-secondary hover:bg-secondary/80"
											onClick={() => setToggleModal(true)}
										>
											Add Employee
										</button>
										<div className="flex flex-col items-center gap-1 basis-[25%]">
											<span className="font-semibold text-zinc-600">Search By Clinic:</span>
											<select
												className="select select-secondary select-sm w-full max-w-xs my-2"
												placeholder="Select Type"
												onChange={(e) => setClinicFilter(e.target.value)}
											>
												<option value="all">All Employees</option>
												{clinics.map((clinic) => (
													<option key={clinic.id} value={clinic.id}>
														{clinic.name}
													</option>
												))}
											</select>
										</div>
										<CSVLink
											className="btn btn-md w-[190px] bg-secondary hover:bg-secondary/80"
											data={downloadEmployees}
											filename={'employees-data.csv'}
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
												<h3 className="font-bold text-lg">Add New Employee</h3>

												<div className="modal-action block">
													<CreateEmployeeAdmin clinics={clinics} modal={setToggleModal} />
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

export default Employees;

export async function getServerSideProps() {
	const employees = await prisma.employee.findMany({
		include: {
			clinic: true,
		},
	});

	employees.map((employee) => {
		employee.updatedAt = new Date(employee.updatedAt).toLocaleDateString('de-DE');
		employee.createdAt = new Date(employee.createdAt).toLocaleDateString('de-DE');
	});

	const clinics = await prisma.clinic.findMany();

	return {
		props: {
			employees,
			clinics,
		},
	};
}
