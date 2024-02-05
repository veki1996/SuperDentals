import { useEffect } from 'react';
import { useFieldArray } from 'react-hook-form';
import { AiFillDelete } from 'react-icons/ai';

const PhoneNumbers = ({ register, control, errors }) => {
	// Connect dynamic fields array to data.phoneNumbers via name
	const {
		fields: numberFields,
		append: numberAppend,
		remove: numberRemove,
	} = useFieldArray({
		control,
		name: 'phoneNumbers',
	});

	useEffect(() => {
		numberAppend({ numberType: '', number: '' });
	}, [numberAppend]);

	const handleAppendPhoneNumbers = () => {
		if (numberFields.length > 8) return;
		numberAppend({ numberType: '', number: '' });
	};

	const handleRemovePhoneNumbers = (index) => {
		numberRemove(index);
	};

	return (
		<div>
			{/*header*/}
			<div className="flex items-center justify-between">
				<h2 className="text-[#282828] text-[24px] font-[700]">Brojevi telefona</h2>
				<span className="text-[13px] text-[#969494] font-[600]">
					<span className="text-primaryColor">*</span>jedan broj je obavezan
				</span>
			</div>
			{/*body*/}
			<div className="flex flex-col gap-12 sm:gap-7 mt-2">
				{numberFields.map((number, i) => (
					<div className="flex flex-col md:flex-row justify-between items-center gap-3" key={i}>
						<div className="flex flex-col gap-2 relative md:min-w-0 w-full">
							<select
								className="clinic-input placeholder:text-[16px] placeholder:text-center min-w-0 appearance-none py-[15px]"
								type="text"
								placeholder="Npr fiksni, viber..."
								{...register(`phoneNumbers.${i}.numberType`, {
									required: {
										value: true,
										message: 'Tip telefona je potreban.',
									},
								})}
							>
								<option value="" className="invisible">
									Fiksni ili Mobilni
								</option>
								<option value="Fiksni">Fiksni</option>
								<option value="Mobilni">Mobilni</option>
							</select>
							{errors.phoneNumbers?.[i]?.numberType && (
								<div className="flex items-center gap-1 absolute sm:bottom-[-25px] bottom-[-45px]">
									<span className="text-primaryColor font-[500]">{errors.phoneNumbers?.[i]?.numberType?.message}</span>
								</div>
							)}
						</div>
						<div className="flex flex-col gap-2 relative md:min-w-0 w-full">
							<input
								className="clinic-input placeholder:text-[16px] placeholder:text-center"
								type="text"
								placeholder="Broj telefona..."
								{...register(`phoneNumbers.${i}.number`, {
									required: {
										value: true,
										message: 'Broj telefona je potreban.',
									},
									pattern: {
										value: /^[+]*[(]{0,1}[0-9]{1,3}[)]{0,1}[-\s\./0-9]*$/g,
										message: 'Format nije validan.',
									},
								})}
							/>
							{errors.phoneNumbers?.[i]?.number && (
								<div className="flex items-center gap-1 absolute sm:bottom-[-25px] bottom-[-45px]">
									<span className="text-primaryColor font-[500]">{errors.phoneNumbers?.[i]?.number?.message}</span>
								</div>
							)}
						</div>
						<div
							className="bg-primaryColor rounded-[8px] min-h-[53px] md:min-w-[54px] flex justify-center items-center cursor-pointer w-full"
							onClick={() => handleRemovePhoneNumbers(i)}
						>
							<AiFillDelete color="white" size={25} />
						</div>
					</div>
				))}
				<button className="button font-[600]" type="button" onClick={() => handleAppendPhoneNumbers()}>
					Dodaj broj
				</button>
			</div>
		</div>
	);
};

export default PhoneNumbers;
