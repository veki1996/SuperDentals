import { SideBar, CreateServiceCategory, Table, ColumnFilter } from '/components';
import { CSVLink } from 'react-csv';
import { useEffect, useMemo, useState } from 'react';
import { RiDeleteBinLine } from 'react-icons/ri';
import { FiEdit } from 'react-icons/fi';
import { useRouter } from 'next/router';
import { prisma } from '/utils/db';

const ServiceCategories = ({ serviceCategories }) => {
	const router = useRouter();
	// States
	const [toggleModal, setToggleModal] = useState(false);
	const [downloadServiceCategories, setDownloadserviceCategories] = useState([]);
	const data = useMemo(
		() =>
			serviceCategories.map((category) => {
				return {
					id: category?.id,
					name: category?.name,
					createdAt: category.createdAt,
					updatedAt: category.updatedAt,
				};
			}),
		[serviceCategories],
	);

	const handleDelete = async (id) => {
		let confirmDelete = confirm('Are you sure you want to delete this category?');
		if (confirmDelete) {
			const response = await fetch('/api/admin/serviceCategory/delete', {
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
							onClick={() => router.push(`/admin/serviceCategories/${cell.row.values.id}`)}
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
		setDownloadserviceCategories(
			serviceCategories.map((category) => {
				return {
					name: category.name,
				};
			}),
		);
		router.replace(router.asPath);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<div className="flex">
			<SideBar active="serviceCategories" />
			<div className="flex flex-col flex-1 w-0 overflow-hidden">
				<main className="relative flex-1 overflow-y-auto focus:outline-none">
					<div className="py-6">
						<div className="px-4 w-min sm:px-6 md:px-8">
							<h1 className="text-4xl font-bold leading-normal mt-0 mb-2">Service Categories</h1>
						</div>
						<div className="px-4 mx-auto  w-min sm:px-6 md:px-8">
							<div className="py-4">
								<div className="p-5 rounded-lg bg-gray-50  flex flex-col gap-5">
									<div className="flex items-center justify-between">
										<button
											className="btn btn-md w-[190px] bg-secondary hover:bg-secondary/80"
											onClick={() => setToggleModal(true)}
										>
											Add Category
										</button>

										<CSVLink
											className="btn btn-md w-[190px] bg-secondary hover:bg-secondary/80"
											data={downloadServiceCategories}
											filename={'servicesCategories-data.csv'}
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
												<h3 className="font-bold text-lg">Add New Category</h3>

												<div className="modal-action block">
													<CreateServiceCategory modal={setToggleModal} />
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

export default ServiceCategories;

export async function getServerSideProps() {
	const serviceCategories = await prisma.serviceCategory.findMany({
		include: {
			services: true,
		},
	});

	serviceCategories.map((serviceCategorie) => {
		serviceCategorie.updatedAt = new Date(serviceCategorie.updatedAt).toLocaleDateString('de-DE');
		serviceCategorie.createdAt = new Date(serviceCategorie.createdAt).toLocaleDateString('de-DE');
	});

	return {
		props: {
			serviceCategories,
		},
	};
}
