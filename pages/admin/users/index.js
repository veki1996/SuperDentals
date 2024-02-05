import { useRouter } from 'next/router';
import { useEffect, useMemo, useState } from 'react';
import { CSVLink } from 'react-csv';
import { FiEdit } from 'react-icons/fi';
import { RiDeleteBinLine } from 'react-icons/ri';
import { SideBar, Table, CreateUser, ColumnFilter } from '/components';
import { prisma } from '/utils/db';

const Users = ({ users }) => {
	// States
	const [toggleModal, setToggleModal] = useState(false);
	const [downloadUsers, setDownloadUsers] = useState([]);
	const [toggleClinicList, setToggleClinicList] = useState(false);
	const [userClinics, setUserClinics] = useState([]);

	const router = useRouter();
	const data = useMemo(
		() =>
			users.map((user) => {
				return {
					id: user.id,
					name: `${user.name} ${user.surname}`,
					email: user.email,
					clinics:
						user.clinics.length > 0 ? (
							user?.clinics?.length === 1 ? (
								<span>{user?.clinics[0]?.name}</span>
							) : (
								<div className="flex justify-start">
									<button
										onClick={() => handleUserClinicList(user?.clinics)}
										className="button text-[16px] bg-gray-300 border border-gray-500 hover:bg-gray-400 text-blue-900 px-3 py-2"
									>
										See All
									</button>
								</div>
							)
						) : (
							'No Clinics Found'
						),
					subscriber: user.subscriber ? 'Yes' : 'No',
					verified: user.verified === true ? 'Yes' : 'No',
					published: user.active === true ? 'Yes' : 'No',
					createdAt: user.createdAt,
					updatedAt: user.updatedAt,
				};
			}),
		[users],
	);

	const handleDelete = async (id) => {
		let confirmDelete = confirm('Are you sure you want to delete this user?');
		if (confirmDelete) {
			const response = await fetch('/api/admin/user/delete', {
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

	const handleUserClinicList = (clinics) => {
		setToggleClinicList(true);
		setUserClinics(clinics);
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
				Header: 'Email',
				accessor: 'email',
				Filter: ColumnFilter,
				disableFilters: true,
			},
			{
				Header: 'Clinics',
				accessor: 'clinics',
				Filter: ColumnFilter,
				disableFilters: true,
			},
			{
				Header: 'Subscriber',
				accessor: 'subscriber',
				Filter: ColumnFilter,
				disableFilters: true,
			},
			{
				Header: 'Email Verified',
				accessor: 'verified',
				Filter: ColumnFilter,

				disableFilters: true,
			},
			{
				Header: 'Published',
				accessor: 'published',
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
				disableFilters: true,
				disableSortBy: true,
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
							onClick={() => router.push(`/admin/users/${cell.row.values.id}`)}
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
		setDownloadUsers(
			users.map((user) => {
				return {
					name: user.name,
					surname: user.surname,
					phoneNumber: user.phoneNumber,
					verified: user.verified ? 'Yes' : 'No',
					active: user.active ? 'Yes' : 'No',
					onboardingComplete: user.onboardingComplete ? 'Yes' : 'No',
					referalCode: user.referalCode,
					role: user.role,
				};
			}),
		);
		router.replace(router.asPath);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);
	return (
		<div className="flex">
			<SideBar active="users" />
			<div className="flex flex-col flex-1 w-0 overflow-hidden">
				<main className="relative flex-1 overflow-y-auto focus:outline-none">
					<div className="py-6 overflow-x-hidden">
						<div className="px-4 w-min sm:px-6 md:px-8">
							<h1 className="text-4xl font-bold leading-normal mt-0 mb-2">Users</h1>
						</div>
						<div className="px-4 mx-auto sm:px-6 md:px-8">
							<div className="py-4">
								<div className="p-5 rounded-lg bg-gray-50 flex flex-col gap-5">
									<div className="flex items-center justify-between">
										<button
											className="btn btn-md w-[190px] bg-secondary hover:bg-secondary/80"
											onClick={() => setToggleModal(true)}
										>
											Add User
										</button>

										<CSVLink
											className="btn btn-md w-[190px] bg-secondary hover:bg-secondary/80"
											data={downloadUsers}
											filename={'users-data.csv'}
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
												<h3 className="font-bold text-lg">Add New User</h3>

												<div className="modal-action">
													<CreateUser modal={setToggleModal} />
												</div>
											</div>
										</div>
									) : (
										<></>
									)}
									{toggleClinicList && (
										<div className="modal opacity-100 visible pointer-events-auto">
											<div className="modal-box">
												<span
													onClick={() => setToggleClinicList(false)}
													className="btn btn-sm btn-circle absolute right-2 top-2"
												>
													✕
												</span>
												<h3 className="font-bold text-[22px]">Users Clinics</h3>

												<div className="modal-action justify-start">
													<div className="flex flex-col gap-1">
														{userClinics?.map((clinic) => (
															<p className="text-gray-700 font-[600] text-[18px]" key={clinic.id}>
																- {clinic?.name}
															</p>
														))}
													</div>
												</div>
											</div>
										</div>
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

export default Users;

export async function getServerSideProps() {
	const users = await prisma.user.findMany({
		include: {
			subscriber: true,
			clinics: true,
		},
	});

	users.map((user) => {
		user.updatedAt = new Date(user.updatedAt).toLocaleDateString('de-DE');
		user.createdAt = new Date(user.createdAt).toLocaleDateString('de-DE');
	});

	const airports = await prisma.airport.findMany();

	return {
		props: {
			users,
			airports,
		},
	};
}
