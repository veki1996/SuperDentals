import { SideBar, CreateSubscriber, Table, ColumnFilter } from '/components';
import { CSVLink } from 'react-csv';
import { useEffect, useMemo, useState } from 'react';
import { RiDeleteBinLine } from 'react-icons/ri';
import { FiEdit } from 'react-icons/fi';

import { useRouter } from 'next/router';
import { prisma } from '/utils/db';

const Subscribers = ({ subscribers, users, packages, discountModifier }) => {
	const router = useRouter();

	// States
	const [toggleModal, setToggleModal] = useState(false);
	const [downloadSubscribers, setDownloadSubscribers] = useState([]);
	const [toggleClinicList, setToggleClinicList] = useState(false);
	const [userClinics, setUserClinics] = useState([]);

	const data = useMemo(
		() =>
			subscribers.map((subscriber) => {
				return {
					id: subscriber?.id,
					name: `${subscriber?.user?.name} ${subscriber?.user?.surname}`,
					subscriptionId: subscriber?.UID,
					package: subscriber?.package?.name,
					packagePrice:
						subscriber?.package?.accessor === 'PREMIUM+'
							? 'Na Upit'
							: subscriber?.package?.price?.map((el) => {
									return (
										<div key={el?.country} className="flex justify-between gap-2 w-1/2">
											<span>{el?.country === 'rs' ? 'Serbia' : el?.country === 'ba' ? 'Bosnia' : 'Montenegro'}:</span>
											<span>
												{el?.price} {el?.currency}
											</span>
										</div>
									);
							  }),
					discountedPackagePrice:
						subscriber?.discountedPackagePrice !== 'No Discount'
							? `${subscriber?.discountedPackagePrice}${subscriber?.user?.country === 'ba' ? 'BAM' : 'EUR'}`
							: subscriber?.discountedPackagePrice,
					clinics:
						subscriber?.user.clinics.length > 0 ? (
							subscriber?.user?.clinics?.length === 1 ? (
								<span>{subscriber?.user?.clinics[0]?.name}</span>
							) : (
								<div className="flex justify-start">
									<button
										onClick={() => handleUserClinicList(subscriber?.user?.clinics)}
										className="button text-[16px] bg-gray-300 border border-gray-500 hover:bg-gray-400 text-blue-900 px-3 py-2"
									>
										See All
									</button>
								</div>
							)
						) : (
							'No Clinics Found'
						),
					approved: subscriber?.approved ? 'Yes' : 'No',
					validToDate: subscriber?.validToDate,
					createdAt: subscriber.createdAt,
					updatedAt: subscriber.updatedAt,
				};
			}),
		[subscribers],
	);
	const handleDelete = async (id) => {
		let confirmDelete = confirm('Are you sure you want to delete this subscriber?');
		if (confirmDelete) {
			const response = await fetch('/api/admin/subscriber/delete', {
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
				Header: 'Subscription ID',
				accessor: 'subscriptionId',
				Filter: ColumnFilter,
				disableFilters: true,
			},
			{
				Header: 'Package',
				accessor: 'package',
				Filter: ColumnFilter,
				disableFilters: true,
			},
			{
				Header: 'Package Price',
				accessor: 'packagePrice',
				Filter: ColumnFilter,
				disableFilters: true,
			},
			{
				Header: 'Discounted Price',
				accessor: 'discountedPackagePrice',
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
				Header: 'Approved',
				accessor: 'approved',
				Filter: ColumnFilter,
				disableFilters: true,
			},
			{
				Header: 'Valid To Date',
				accessor: 'validToDate',
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
							onClick={() => router.push(`/admin/subscribers/${cell.row.values.id}`)}
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
		setDownloadSubscribers(
			subscribers.map((subscriber) => {
				return {
					name: `${subscriber?.user?.name} ${subscriber?.user?.surname}`,
					package: subscriber?.package?.name,
					packagePrice: subscriber?.package?.accessor === 'PREMIUM+' ? 'Na Upit' : `${subscriber?.package?.price}KM`,
					discountedPackagePrice:
						subscriber?.discountedPackagePrice !== 'No Discount'
							? `${subscriber?.discountedPackagePrice}KM`
							: subscriber?.discountedPackagePrice,
					approved: subscriber?.approved ? 'Yes' : 'No',
					validToDate: subscriber?.validToDate,
				};
			}),
		);
		router.replace(router.asPath);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);
	return (
		<div className="flex">
			<SideBar active="subscribers" />
			<div className="flex flex-col flex-1 w-0 overflow-hidden">
				<main className="relative flex-1 overflow-y-auto focus:outline-none">
					<div className="py-6 overflow-x-hidden">
						<div className="px-4 w-min sm:px-6 md:px-8">
							<h1 className="text-4xl font-bold leading-normal mt-0 mb-2">Subscribers</h1>
						</div>
						<div className="px-4 mx-auto  sm:px-6 md:px-8">
							<div className="py-4">
								<div className="p-5 rounded-lg bg-gray-50  flex flex-col gap-5">
									<div className="flex items-center justify-between">
										<button
											className="btn btn-md w-[190px] bg-secondary hover:bg-secondary/80"
											onClick={() => setToggleModal(true)}
										>
											Add Subscriber
										</button>

										<CSVLink
											className="btn btn-md w-[190px] bg-secondary hover:bg-secondary/80"
											data={downloadSubscribers}
											filename={'subscribers-data.csv'}
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
												<h3 className="font-bold text-lg">Add New Subscriber</h3>

												<div className="modal-action block">
													<CreateSubscriber
														packages={packages}
														users={users}
														modal={setToggleModal}
														discountModifier={discountModifier}
													/>
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

export default Subscribers;

export async function getServerSideProps() {
	const subscribers = await prisma.subscriber.findMany({
		include: {
			user: {
				include: {
					clinics: true,
				},
			},
			package: true,
		},
	});

	subscribers.map((subscriber) => {
		subscriber.updatedAt = new Date(subscriber.updatedAt).toLocaleDateString('de-DE');
		subscriber.createdAt = new Date(subscriber.createdAt).toLocaleDateString('de-DE');
	});

	const users = await prisma.user.findMany({
		include: {
			subscriber: true,
		},
	});
	const packages = await prisma.subscriptionPackage.findMany();

	const discountModifier = await prisma.setting.findMany({
		where: {
			name: {
				equals: 'Discount Modifier',
			},
		},
	});

	return {
		props: {
			subscribers,
			users,
			packages,
			discountModifier,
		},
	};
}
