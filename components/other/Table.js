import { useTable, useGlobalFilter, useFilters, useSortBy, usePagination } from 'react-table';
import { GlobalFilter } from '/components';
import { filterNumberInput } from '/utils/utils';

const Table = ({ columns, data }) => {
	const tableInstance = useTable(
		{
			columns,
			data,
			initialState: {
				hiddenColumns: columns.map((column) => {
					if (column.show === false) return column.accessor;
				}),
			},
		},
		useFilters,
		useGlobalFilter,
		useSortBy,
		usePagination,
	);

	const {
		getTableProps,
		getTableBodyProps,
		headerGroups,
		page,
		prepareRow,
		state,
		setGlobalFilter,
		nextPage,
		canNextPage,
		canPreviousPage,
		previousPage,
		pageOptions,
		gotoPage,
		pageCount,
	} = tableInstance;

	const { globalFilter, pageIndex } = state;
	return (
		<div>
			<GlobalFilter filter={globalFilter} setFilter={setGlobalFilter} />
			<div className="max-w-full overflow-auto">
				<table className="table table-zebra w-full border-collapse" {...getTableProps()}>
					<thead>
						{headerGroups.map((headerGroup) => (
							<tr key={headerGroup.getHeaderProps} {...headerGroup.getHeaderGroupProps()}>
								{
									// Loop over the headers in each row
									headerGroup.headers.map((column, i) => (
										// Apply the header cell props
										<th key={i} {...column.getHeaderProps(column.getSortByToggleProps())} className="static px-[2px]">
											{
												// Render the header
												column.render('Header')
											}
											<span>{column.isSorted ? (column.isSortedDesc ? ' 🔽' : ' 🔼') : ''}</span>
											<div>{column.canFilter ? column.render('Filter') : null}</div>
										</th>
									))
								}
							</tr>
						))}
					</thead>
					<tbody {...getTableBodyProps()}>
						{page.map((row, i) => {
							prepareRow(row);
							return (
								<tr key={i} {...row.getRowProps()}>
									{row.cells.map((cell, i) => {
										return (
											<td className="py-1 px-[5px] text-[14px]" key={i} {...cell.getCellProps()}>
												{cell.render('Cell')}
											</td>
										);
									})}
								</tr>
							);
						})}
					</tbody>
				</table>
			</div>
			<div className="flex justify-between w-full">
				<span className="mr-1">
					Page{' '}
					<strong>
						{pageIndex + 1} of {pageOptions.length}
					</strong>
				</span>
				<span>
					Go to page:
					<input
						type="number"
						min="0"
						onKeyDown={(e) => filterNumberInput(e)}
						className="input input-secondary input-xs ml-1"
						defaultValue={pageIndex + 1}
						onChange={(e) => {
							const pageNumber = e.target.value ? Number(e.target.value) - 1 : 0;
							gotoPage(pageNumber);
						}}
					/>
				</span>
			</div>
			<div className="flex items-center mt-5 w-full">
				<button onClick={() => gotoPage(0)} className="btn btn-secondary btn-outline" disabled={!canPreviousPage}>
					{'<<'}
				</button>

				<button
					onClick={() => previousPage()}
					className="btn btn-secondary btn-outline w-36"
					disabled={!canPreviousPage}
				>
					Previous
				</button>
				<button onClick={() => nextPage()} className="btn btn-secondary btn-outline w-36" disabled={!canNextPage}>
					Next
				</button>
				<button
					onClick={() => gotoPage(pageCount - 1)}
					className="btn btn-secondary btn-outline"
					disabled={!canNextPage}
				>
					{'>>'}
				</button>
			</div>
		</div>
	);
};

export default Table;
