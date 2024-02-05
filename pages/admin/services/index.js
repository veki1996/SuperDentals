import { SideBar, CreateService, Table, ColumnFilter, ImageDisplay } from '/components';
import { CSVLink } from 'react-csv';
import { useEffect, useMemo, useState } from 'react';
import { RiDeleteBinLine } from 'react-icons/ri';
import { FiEdit } from 'react-icons/fi';
import { useRouter } from 'next/router';
import { prisma } from '/utils/db';

const Services = ({ services, categories, images }) => {
	const router = useRouter();
	// States
	const [toggleModal, setToggleModal] = useState(false);
	const [downloadServices, setDownloadServices] = useState([]);

	const data = useMemo(
		() =>
			services.map((service) => {
				return {
					id: service?.id,
					name: service?.name?.find((el) => el?.country === 'gb')?.name,
					order: service?.order,
					image: service?.imageId ? (
						<ImageDisplay
							images={images}
							imageType="SERVICE"
							imageFrom="service"
							id={service?.id}
							width={100}
							height={100}
							imageStyle="rounded-xl"
						/>
					) : (
						'Image Not Found'
					),
					category: service?.category?.name ? service?.category?.name : 'No category',
					createdAt: service.createdAt,
					updatedAt: service.updatedAt,
				};
			}),
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[services],
	);

	const handleDelete = async (id) => {
		let confirmDelete = confirm('Are you sure you want to delete this service?');
		if (confirmDelete) {
			const response = await fetch('/api/admin/service/delete', {
				body: JSON.stringify({ id: id }),
				method: 'DELETE',
				headers: {
					'Content-type': 'application/json',
				},
			});

			if (response.status === 200) {
				await response.json();
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
				Header: 'Order',
				accessor: 'order',
				Filter: ColumnFilter,
				disableFilters: true,
			},
			{
				Header: 'Image',
				accessor: 'image',
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
							onClick={() => router.push(`/admin/services/${cell.row.values.id}`)}
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
		setDownloadServices(
			services.map((service) => {
				return {
					name: service.name,
					description: service.description,
					order: service?.order,
				};
			}),
		);
		router.replace(router.asPath);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<div className="flex relative">
			<SideBar active="services" />
			<div className="flex flex-col flex-1 w-0 overflow-hidden">
				<main className="flex-1 overflow-y-auto focus:outline-none">
					<div className="py-6 overflow-x-hidden">
						<div className="px-4 w-min sm:px-6 md:px-8">
							<h1 className="text-4xl font-bold leading-normal mt-0 mb-2">Services</h1>
						</div>
						<div className="px-4 mx-auto sm:px-6 md:px-8">
							<div className="py-4">
								<div className="p-5 rounded-lg bg-gray-50  flex flex-col gap-5">
									<div className="flex items-center justify-between">
										<button
											className="btn btn-md w-[190px] bg-secondary hover:bg-secondary/80"
											onClick={() => setToggleModal(true)}
										>
											Add Service
										</button>

										<CSVLink
											className="btn btn-md w-[190px] bg-secondary hover:bg-secondary/80"
											data={downloadServices}
											filename={'services-data.csv'}
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
												<h3 className="font-bold text-lg">Add New Service</h3>

												<div className="modal-action block">
													<CreateService categories={categories} modal={setToggleModal} />
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

export default Services;

export async function getServerSideProps() {
	const services = await prisma.service.findMany({
		orderBy: {
			order: 'asc',
		},
		include: {
			category: true,
		},
	});

	services.map((service) => {
		service.updatedAt = new Date(service.updatedAt).toLocaleDateString('de-DE');
		service.createdAt = new Date(service.createdAt).toLocaleDateString('de-DE');
	});

	const images = await prisma.image.findMany({
		where: {
			imageUsage: {
				equals: 'SERVICE',
			},
		},
		include: {
			service: true,
		},
	});

	const categories = await prisma.serviceCategory.findMany();
	return {
		props: {
			services,
			categories,
			images,
		},
	};
}
