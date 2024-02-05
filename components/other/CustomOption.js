import PropType from 'prop-types';
import { components } from 'react-select';

const CustomOption = ({ children, ...props }) => {
	const { ...rest } = props.innerProps;
	const newProps = { ...props, innerProps: rest };
	return <components.Option {...newProps}>{children}</components.Option>;
};

CustomOption.propTypes = {
	innerProps: PropType.object.isRequired,
	children: PropType.node.isRequired,
};

export default CustomOption;
