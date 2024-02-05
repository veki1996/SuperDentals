import useTranslation from 'next-translate/useTranslation';
import { useFieldArray } from 'react-hook-form';

const WorkHours = ({ register, control }) => {
	const { t } = useTranslation('create-edit-clinic');

	// Connect dynamic fields array to data.phoneNumbers via name
	const { fields: workFields } = useFieldArray({
		control,
		name: 'workHours',
	});

	return (
		<div className="mb-2 mt-6">
			<h2 className="text-[#282828] text-[24px] font-[700]">Radno {t('form.text-5')}</h2>
			{/*body*/}
			<div className="flex flex-col gap-3 mt-4">
				{workFields.map((workHour, i) => (
					<div key={i}>
						<input
							className="disabled: bg-white disabled:text-[#727272] disabled:font-[700] disabled:text-[18px]"
							type="text"
							placeholder="Day..."
							{...register(`workHours.${i}.day`, {
								required: true,
							})}
							disabled
							value={workHour.day}
						/>

						<div className="gap-5 mb-3 mt-1 grid grid-cols-2">
							<input
								className="clinic-input"
								type="time"
								placeholder="From..."
								defaultValue={workHour.from}
								{...register(`workHours.${i}.from`)}
							/>
							<input
								className="clinic-input"
								type="time"
								placeholder="To..."
								defaultValue={workHour.to}
								{...register(`workHours.${i}.to`)}
							/>
						</div>
					</div>
				))}
			</div>
		</div>
	);
};

export default WorkHours;
