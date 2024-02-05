import Select, { createFilter, components } from 'react-select';
import { AiFillCaretDown } from 'react-icons/ai';

const customStyles = {
	control: (provided) => ({
		...provided,
		borderColor: '#818181',
		padding: '5px',
	}),
	placeholder: (provided) => ({
		...provided,
		color: '#818181',
		fontFamily: 'Noto Sans, Montserrat',
	}),
};

const CaretDownIcon = () => {
	return <AiFillCaretDown size={20} color="#818181" />;
};

const DropdownIndicator = (props) => {
	return (
		<components.DropdownIndicator {...props}>
			<CaretDownIcon />
		</components.DropdownIndicator>
	);
};

const Filtering = ({
	filterOptions,
	filterBy,
	isSearchable,
	filterValue,
	setFilterValue,
	isMulti,
	customOption,
	isClearable,
	instanceId,
}) => {
	return (
		<div className="">
			<Select
				styles={customStyles}
				placeholder={filterBy}
				options={filterOptions}
				isSearchable={isSearchable}
				value={filterValue}
				onChange={(data) => setFilterValue(data)}
				getOptionLabel={(e) => (
					<div className="flex items-center">
						{e.icon}
						<span className="ml-[5px]">{e.label}</span>
					</div>
				)}
				instanceId={instanceId}
				isClearable={isClearable}
				isMulti={isMulti}
				filterOption={createFilter({ ignoreAccents: false })}
				components={{ customOption, DropdownIndicator }}
				theme={(theme) => ({
					...theme,
					borderRadius: 8,
				})}
			/>
		</div>
	);
};

export default Filtering;
