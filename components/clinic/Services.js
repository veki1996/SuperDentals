import useTranslation from 'next-translate/useTranslation';
import { useRouter } from 'next/router';
import { filterNumberInput, getServiceName } from '/utils/utils';

const Services = ({ services, clinic, register, errors, onChangeService, onChangePrice, priceInputRefArray }) => {
	const { t } = useTranslation('create-edit-clinic');
	const router = useRouter();
	const { locale } = router;

	// Array of services names
	const filteredServices = clinic?.clinicServices?.map((clinicServices) =>
		getServiceName(clinicServices.service, locale, true),
	);
	return (
		<div className="flex flex-col gap-8">
			{services.map((service) => (
				<div key={service.id} className="flex flex-col xl:flex-row justify-between gap-4">
					<label className="clinic-input flex items-center justify-between basis-[70%]" htmlFor={service.id}>
						{getServiceName(service, locale, true)}

						<input
							className="h-[24px] w-[24px] checkbox checkbox-secondary"
							type="checkbox"
							id={service.id}
							value={service.id}
							defaultChecked={filteredServices.includes(getServiceName(service, locale, true))}
							{...register('service', {
								required: {
									value: true,
								},
							})}
							onChange={(e) => onChangeService(e, service)}
						/>
					</label>
					<input
						type="number"
						min="0"
						onKeyDown={(e) => filterNumberInput(e)}
						className="clinic-input basis-[0%]"
						placeholder={t('form.text-4')}
						defaultValue={clinic.clinicServices.find((s) => s?.service?.id === service?.id)?.price}
						onChange={(e) => onChangePrice(e, service)}
						ref={priceInputRefArray.current.find((ref) => ref.id === service.id).ref}
					/>
				</div>
			))}
			<div className="flex justify-between">
				{errors.service?.type === 'required' && (
					<span className="text-primaryColor font-[500]">Morate izabrati bar jednu uslugu.</span>
				)}
			</div>
		</div>
	);
};

export default Services;
