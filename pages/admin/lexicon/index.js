import { SideBar, CreateLexicon, Table, ColumnFilter, QuillReader } from '/components';
import { CSVLink } from 'react-csv';
import { useEffect, useMemo, useState } from 'react';
import { RiDeleteBinLine } from 'react-icons/ri';
import { FiEdit } from 'react-icons/fi';
import { useRouter } from 'next/router';
import { prisma } from '/utils/db';
import { getLexicon } from '/utils/utils';

const Lexicon = ({ lexicon }) => {
	const router = useRouter();
	// States
	const [toggleModal, setToggleModal] = useState(false);
	const [downloadLexicon, setDownloadLexicon] = useState([]);

	const data = useMemo(
		() =>
			lexicon.map((el) => {
				return {
					id: el?.id,
					heading: (
						<div className="flex max-w-[450px]">
							<div className="truncate">
								<QuillReader description={getLexicon(el.heading, 'gb', 'heading', true)} />
							</div>
							<span>...</span>
						</div>
					),
					description: (
						<div className="flex max-w-[450px]">
							<div className="truncate">
								<QuillReader description={getLexicon(el.description, 'gb', 'description', true)} />
							</div>
							<span>...</span>
						</div>
					),
					position: (
						<div className="flex">
							<QuillReader description={getLexicon(el.position, 'gb', 'position', true)} />
						</div>
					),
					createdAt: el.createdAt,
					updatedAt: el.updatedAt,
				};
			}),
		[lexicon],
	);

	const handleDelete = async (id) => {
		let confirmDelete = confirm('Are you sure you want to delete this text from Lexicon?');
		if (confirmDelete) {
			const response = await fetch('/api/admin/lexicon/delete', {
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
				Header: 'Heading',
				accessor: 'heading',
				Filter: ColumnFilter,
				disableFilters: true,
			},
			{
				Header: 'Description',
				accessor: 'description',
				Filter: ColumnFilter,
				disableFilters: true,
			},
			{
				Header: 'Position',
				accessor: 'position',
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
							onClick={() => router.push(`/admin/lexicon/${cell.row.values.id}`)}
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
		setDownloadLexicon(
			lexicon.map((el) => {
				return {
					heading: getLexicon(el.heading, 'gb', 'heading', true),
					description: getLexicon(el.description, 'gb', 'description', true),
					position: getLexicon(el.position, 'gb', 'position', true),
					createdAt: el.createdAt,
					updatedAt: el.updatedAt,
				};
			}),
		);
		router.replace(router.asPath);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);
	return (
		<div className="flex">
			<SideBar active="lexicon" />
			<div className="flex flex-col flex-1 w-0 overflow-hidden">
				<main className="relative flex-1 overflow-y-auto focus:outline-none">
					<div className="py-6 overflow-x-hidden">
						<div className="px-4 sm:px-6 md:px-8">
							<h1 className="text-4xl font-bold leading-normal mt-0 mb-2">Lexicon</h1>
						</div>
						<div className="px-4 mx-auto sm:px-6 md:px-8">
							<div className="py-4">
								<div className="px-5 py-7 rounded-lg bg-gray-50  flex flex-col gap-5">
									<div className="flex items-center justify-between">
										<button
											className="btn btn-md w-[210px] bg-secondary hover:bg-secondary/80"
											onClick={() => setToggleModal(true)}
										>
											Add Lexicon Element
										</button>

										<CSVLink
											className="btn btn-md w-[190px] bg-secondary hover:bg-secondary/80"
											data={downloadLexicon}
											filename={'lexicon-data.csv'}
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
												<h3 className="font-bold text-lg">Add New Lexicon Element</h3>

												<div className="modal-action block">
													<CreateLexicon modal={setToggleModal} />
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

export default Lexicon;

export async function getServerSideProps() {
	const lexicon = await prisma.lexicon.findMany();

	lexicon.map((el) => {
		el.updatedAt = new Date(el.updatedAt).toLocaleDateString('de-DE');
		el.createdAt = new Date(el.createdAt).toLocaleDateString('de-DE');
	});

	return {
		props: {
			lexicon,
		},
	};
}
