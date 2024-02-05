const ColumnFilter = ({ column }) => {
	const { filterValue, setFilter } = column;
	return (
		<span>
			<input
				className="input input-xs w-full max-w-xs input-bordered"
				placeholder="Search..."
				value={filterValue || ''}
				onChange={(e) => setFilter(e.target.value)}
			/>
		</span>
	);
};

export default ColumnFilter;
