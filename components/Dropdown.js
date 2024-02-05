import { useState } from 'react';
import Image from 'next/image';

const Dropdown = ({ selected, setSelected, projects }) => {
	const [isActive, setIsActive] = useState(false);

	return (
		<div className="absolute bg-white  p-2 ">
			<div onClick={() => setIsActive(!isActive)}>
				<div className="flex justify-center pb-2">
					{selected ? (
						<div className="flex items-center gap-1">
							<div className="relative w-[25px] h-[16px]">
								<Image alt="bih" src={selected.photo} layout="fill" objectFit="cover" />
							</div>
							<span>{selected.text}</span>
							<Image alt="dole" width={21} height={16} src="/register-page-assets/dole.svg" />
						</div>
					) : (
						<span>Pozivni broj</span>
					)}
				</div>
			</div>

			{isActive && (
				<div>
					{projects
						.filter((option) => option.text !== selected.text)
						.map((option) => (
							<div
								className="text-[16px] flex py-2"
								key={option.id}
								onClick={() => {
									setSelected(option);
									setIsActive(false);
								}}
							>
								<div className="flex  gap-2">
									<div className="relative w-[25px] h-[16px]">
										<Image alt="srb" src={option.photo} layout="fill" objectFit="cover" />
									</div>
									<span>{option.text}</span>
								</div>
							</div>
						))}
				</div>
			)}
		</div>
	);
};

export default Dropdown;
