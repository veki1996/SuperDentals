const GlobalFilter = ({ filter, setFilter }) => {
	return (
		<span>
			Search:
			<input
				className="input-xs w-full max-w-xs input-bordered input p-4 ml-2 mb-2 text-sm"
				placeholder="Search all columns..."
				value={filter || ''}
				onChange={(e) => setFilter(e.target.value)}
			/>
		</span>
	);
};

export default GlobalFilter;
