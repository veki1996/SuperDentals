import { SideBar, CreateSubscriptionPackage, Table, ColumnFilter } from '/components';
import { CSVLink } from 'react-csv';
import { useEffect, useMemo, useState } from 'react';
import { FiEdit } from 'react-icons/fi';
import { useRouter } from 'next/router';
import { prisma } from '/utils/db';

const SubscriberPackages = ({ subscriptionPackages }) => {
	const router = useRouter();
	// States
	const [toggleModal, setToggleModal] = useState(false);
	const [downloadSubscriptionPackages, setDownloadSubscriptionPackages] = useState([]);

	const data = useMemo(
		() =>
			subscriptionPackages.map((subscriptionPackage) => {
				return {
					id: subscriptionPackage?.id,
					name: subscriptionPackage?.name,
					price: subscriptionPackage?.price?.map((el) => {
						return (
							<div key={el?.country} className="flex justify-between gap-2 w-[70%]">
								<span>{el?.country === 'rs' ? 'Serbia' : el?.country === 'ba' ? 'Bosnia' : 'Montenegro'}:</span>
								<span>
									{el?.price} {el?.currency}
								</span>
							</div>
						);
					}),
					discount: subscriptionPackage?.discount?.map((el) => {
						return (
							<div key={el?.country} className="flex justify-between gap-2 w-[70%]">
								<span>{el?.country === 'rs' ? 'Serbia' : el?.country === 'ba' ? 'Bosnia' : 'Montenegro'}:</span>
								<span>{el?.value}%</span>
							</div>
						);
					}),
					createdAt: subscriptionPackage.createdAt,
					updatedAt: subscriptionPackage.updatedAt,
				};
			}),
		[subscriptionPackages],
	);

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
				Header: 'Price',
				accessor: 'price',
				Filter: ColumnFilter,
				disableFilters: true,
			},
			{
				Header: 'Discount',
				accessor: 'discount',
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
							onClick={() => router.push(`/admin/packages/${cell.row.values.id}`)}
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

	const fetchPackages = async () => {
		const response = await fetch('/api/admin/subscriptionPackage/populatePackages');

		if (response.status === 200) {
			router.replace(router.asPath);
		}
	};

	useEffect(() => {
		fetchPackages();
		setDownloadSubscriptionPackages(
			subscriptionPackages.map((subscriptionPackage) => {
				return {
					name: subscriptionPackage.name,
					price: subscriptionPackage.price,
				};
			}),
		);
		router.replace(router.asPath);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);
	return (
		<div className="flex">
			<SideBar active="packages" />
			<div className="flex flex-col flex-1 w-0 overflow-hidden">
				<main className="relative flex-1 overflow-y-auto focus:outline-none">
					<div className="py-6 overflow-x-hidden">
						<div className="px-4 sm:px-6 md:px-8">
							<h1 className="text-4xl font-bold leading-normal mt-0 mb-2">Subscription Packages</h1>
						</div>
						<div className="px-4 mx-auto sm:px-6 md:px-8">
							<div className="py-4">
								<div className="px-5 py-7 rounded-lg bg-gray-50  flex flex-col gap-5">
									<div className="flex items-center justify-between">
										{/* <button
											className="btn btn-md w-[190px] bg-secondary hover:bg-secondary/80"
											onClick={() => setToggleModal(true)}
										>
											Add Package
										</button> */}

										<CSVLink
											className="btn btn-md w-[190px] bg-secondary hover:bg-secondary/80"
											data={downloadSubscriptionPackages}
											filename={'subscriptionPackages-data.csv'}
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
												<h3 className="font-bold text-lg">Add New Package</h3>

												<div className="modal-action block">
													<CreateSubscriptionPackage modal={setToggleModal} />
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

export default SubscriberPackages;

export async function getServerSideProps() {
	const subscriptionPackages = await prisma.subscriptionPackage.findMany();

	subscriptionPackages.map((subscriptionPackage) => {
		subscriptionPackage.updatedAt = new Date(subscriptionPackage.updatedAt).toLocaleDateString('de-DE');
		subscriptionPackage.createdAt = new Date(subscriptionPackage.createdAt).toLocaleDateString('de-DE');
	});

	return {
		props: {
			subscriptionPackages,
		},
	};
}
