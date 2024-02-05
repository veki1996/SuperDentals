import { useState } from 'react';
import { MdExpandMore } from 'react-icons/md';
import { QuillReader } from '/components';

const Accordion = ({ question, answer }) => {
	const [isActive, setIsActive] = useState(false);
	return (
		<div className="p-3 border border-[#818181] rounded-[8px]">
			<div className="flex items-center justify-between cursor-pointer" onClick={() => setIsActive(!isActive)}>
				<div className="text-[#282828] font-[700]">
					<QuillReader description={question} />
				</div>
				<div className={`bg-[#0D3082] rounded-full transition ${isActive && 'rotate-180'}`}>
					<MdExpandMore className="cursor-pointer" color="white" size={25} />
				</div>
			</div>
			<div
				className={` ${
					isActive
						? 'max-h-[1000px] transition-all duration-300 ease py-3'
						: 'max-h-0 overflow-hidden transition-all duration-150 ease'
				}`}
			>
				<QuillReader description={answer} />
			</div>
		</div>
	);
};

export default Accordion;
