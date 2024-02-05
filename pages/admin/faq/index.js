import { SideBar, CreateFAQ, Table, ColumnFilter, QuillReader } from '/components';
import { CSVLink } from 'react-csv';
import { useEffect, useMemo, useState } from 'react';
import { RiDeleteBinLine } from 'react-icons/ri';
import { FiEdit } from 'react-icons/fi';
import { useRouter } from 'next/router';
import { prisma } from '/utils/db';
import { getFAQ } from '/utils/utils';

const Faqs = ({ faqs }) => {
	const router = useRouter();
	// States
	const [toggleModal, setToggleModal] = useState(false);
	const [downloadFAQ, setDownloadFAQ] = useState([]);

	const data = useMemo(
		() =>
			faqs.map((faq) => {
				return {
					id: faq?.id,
					question: (
						<div className="flex max-w-[450px]">
							<div className="truncate">
								<QuillReader description={getFAQ(faq.question, 'gb', 'question', true)} />
							</div>
							<span>...</span>
						</div>
					),
					answer: (
						<div className="flex max-w-[450px]">
							<div className="truncate">
								<QuillReader description={getFAQ(faq.answer, 'gb', 'answer', true)} />
							</div>
							<span>...</span>
						</div>
					),
					createdAt: faq.createdAt,
					updatedAt: faq.updatedAt,
				};
			}),
		[faqs],
	);

	const handleDelete = async (id) => {
		let confirmDelete = confirm('Are you sure you want to delete this FAQ?');
		if (confirmDelete) {
			const response = await fetch('/api/admin/faq/delete', {
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
				Header: 'Question',
				accessor: 'question',
				Filter: ColumnFilter,
				disableFilters: true,
			},
			{
				Header: 'Answer',
				accessor: 'answer',
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
							onClick={() => router.push(`/admin/faq/${cell.row.values.id}`)}
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
		setDownloadFAQ(
			faqs.map((faq) => {
				return {
					question: getFAQ(faq.question, 'gb', 'question', true),
					answer: getFAQ(faq.answer, 'gb', 'answer', true),
					createdAt: faq.createdAt,
					updatedAt: faq.updatedAt,
				};
			}),
		);
		router.replace(router.asPath);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);
	return (
		<div className="flex">
			<SideBar active="faq" />
			<div className="flex flex-col flex-1 w-0 overflow-hidden">
				<main className="relative flex-1 overflow-y-auto focus:outline-none">
					<div className="py-6 overflow-x-hidden">
						<div className="px-4 sm:px-6 md:px-8">
							<h1 className="text-4xl font-bold leading-normal mt-0 mb-2">FAQ</h1>
						</div>
						<div className="px-4 mx-auto sm:px-6 md:px-8">
							<div className="py-4">
								<div className="px-5 py-7 rounded-lg bg-gray-50  flex flex-col gap-5">
									<div className="flex items-center justify-between">
										<button
											className="btn btn-md w-[190px] bg-secondary hover:bg-secondary/80"
											onClick={() => setToggleModal(true)}
										>
											Add FAQ
										</button>

										<CSVLink
											className="btn btn-md w-[190px] bg-secondary hover:bg-secondary/80"
											data={downloadFAQ}
											filename={'faqs-data.csv'}
										>
											Download data
										</CSVLink>
									</div>
									{toggleModal ? (
										<div className="modal opacity-100 visible pointer-events-auto">
											<div className="modal-box lg:min-w-[700px]">
												<span
													onClick={() => setToggleModal(false)}
													className="btn btn-sm btn-circle absolute right-2 top-2"
												>
													✕
												</span>
												<h3 className="font-bold text-lg">Add New FAQ</h3>

												<div className="modal-action block">
													<CreateFAQ modal={setToggleModal} />
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

export default Faqs;

export async function getServerSideProps() {
	const faqs = await prisma.faq.findMany();

	faqs.map((faq) => {
		faq.updatedAt = new Date(faq.updatedAt).toLocaleDateString('de-DE');
		faq.createdAt = new Date(faq.createdAt).toLocaleDateString('de-DE');
	});

	return {
		props: {
			faqs,
		},
	};
}
