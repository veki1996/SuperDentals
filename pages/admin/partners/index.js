import { SideBar, CreatePartner, Table, ColumnFilter, ImageDisplay } from '/components';
import { CSVLink } from 'react-csv';
import { useEffect, useMemo, useState } from 'react';
import { RiDeleteBinLine } from 'react-icons/ri';
import { FiEdit } from 'react-icons/fi';
import { useRouter } from 'next/router';
import { prisma } from '/utils/db';

const Partners = ({ partners, images }) => {
	const router = useRouter();

	// States
	const [toggleModal, setToggleModal] = useState(false);
	const [downloadPartners, setDownloadPartners] = useState([]);

	const data = useMemo(
		() =>
			partners.map((partner) => {
				return {
					id: partner?.id,
					name: partner?.name,
					logo: partner?.imageId ? (
						<ImageDisplay
							images={images}
							imageType="PARTNER"
							imageFrom="partner"
							id={partner?.id}
							width={100}
							height={100}
							imageStyle="rounded-xl"
						/>
					) : (
						'Logo Not Found'
					),

					website: partner?.website,
					createdAt: partner.createdAt,
					updatedAt: partner.updatedAt,
				};
			}),
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[partners],
	);
	const handleDelete = async (id) => {
		let confirmDelete = confirm('Are you sure you want to delete this partner?');
		if (confirmDelete) {
			const response = await fetch('/api/admin/partner/delete', {
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
				Header: 'Logo',
				accessor: 'logo',
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
							onClick={() => router.push(`/admin/partners/${cell.row.values.id}`)}
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
		setDownloadPartners(
			partners.map((partner) => {
				return {
					name: partner?.name,
					website: partner?.website,
				};
			}),
		);
		router.replace(router.asPath);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);
	return (
		<div className="flex">
			<SideBar active="partners" />
			<div className="flex flex-col flex-1 w-0 overflow-hidden">
				<main className="relative flex-1 overflow-y-auto focus:outline-none">
					<div className="py-6 overflow-x-hidden">
						<div className="px-4 w-min sm:px-6 md:px-8">
							<h1 className="text-4xl font-bold leading-normal mt-0 mb-2">Partners</h1>
						</div>
						<div className="px-4 mx-auto sm:px-6 md:px-8">
							<div className="py-4">
								<div className="p-5 rounded-lg bg-gray-50  flex flex-col gap-5">
									<div className="flex items-center justify-between">
										<button
											className="btn btn-md w-[190px] bg-secondary hover:bg-secondary/80"
											onClick={() => setToggleModal(true)}
										>
											Add Partner
										</button>

										<CSVLink
											className="btn btn-md w-[190px] bg-secondary hover:bg-secondary/80"
											data={downloadPartners}
											filename={'partners-data.csv'}
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
												<h3 className="font-bold text-lg">Add New Partner</h3>

												<div className="modal-action block">
													<CreatePartner modal={setToggleModal} />
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

export default Partners;

export async function getServerSideProps() {
	const partners = await prisma.partner.findMany();

	partners.map((partner) => {
		partner.updatedAt = new Date(partner.updatedAt).toLocaleDateString('de-DE');
		partner.createdAt = new Date(partner.createdAt).toLocaleDateString('de-DE');
	});

	const images = await prisma.image.findMany({
		where: {
			imageUsage: {
				equals: 'PARTNER',
			},
		},
		include: {
			employee: true,
			partner: true,
		},
	});

	return {
		props: {
			partners,
			images,
		},
	};
}
