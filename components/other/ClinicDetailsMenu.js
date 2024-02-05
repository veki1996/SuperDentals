import useTranslation from 'next-translate/useTranslation';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { AiFillCaretDown } from 'react-icons/ai';
import { getServiceName } from '/utils/utils';

const ClinicDetailsMenu = ({ heading, services, details, airportsDistances, subscriptionPackage, airports }) => {
	const { t } = useTranslation('clinic');
	const router = useRouter();
	const { locale } = router;
	const [isActive, setIsActive] = useState(true);
	return (
		<div className="p-2 shadow-container rounded-[4px]" onClick={() => setIsActive(!isActive)}>
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-2 cursor-pointer">
					<div className={`transition-transform ${isActive && 'rotate-180'}`}>
						<AiFillCaretDown color="#FC5122" size={30} />
					</div>
					<p className="text-[18px] text-primaryColor font-[700]">{heading}:</p>
				</div>
				{services && isActive && <p className="text-[18px] text-primaryColor font-[700]">{t('main.text-18')}</p>}
			</div>

			<div
				className={` ${
					isActive
						? 'max-h-[1000px] transition-all duration-300 ease py-3'
						: 'max-h-0 overflow-hidden transition-all duration-150 ease'
				} flex flex-col gap-2 px-3`}
			>
				{services &&
					services
						?.sort((a, b) => (Number(a?.service?.order) > Number(b?.service?.order) ? 1 : -1))
						?.map((s) => (
							<div className="flex items-center justify-between" key={s?.service?.id}>
								<span>{getServiceName(s?.service, locale, true)?.trim()}:</span>
								{subscriptionPackage?.accessor !== 'START' && (
									<>
										{s?.price ? (
											<span className="text-primaryColor font-[700]">
												{s?.price} {s?.currency}
											</span>
										) : (
											<span className="text-primaryColor font-[700]">-</span>
										)}
									</>
								)}
							</div>
						))}

				{details && (
					<div className="text-[#21231E]">
						{details.numberOfOffices !== 0 && (
							<p>
								{t('main.text-8')}: {details.numberOfOffices}
							</p>
						)}
						{details.yearsInService !== 0 && (
							<p>
								{t('main.text-9')}: {details.yearsInService}
							</p>
						)}
						{details.numberOfDoctors !== 0 && (
							<p>
								{t('main.text-10')}: {details.numberOfDoctors}
							</p>
						)}
						{details.numberOfStaff !== 0 && (
							<p>
								{t('main.text-11')}: {details.numberOfStaff}
							</p>
						)}
						<p>
							{t('main.text-12')}: {details.creditCardPaymentAvailable ? t('main.text-19') : t('main.text-20')}
						</p>
						<p>
							{t('main.text-13')}: {details.wifiAvailable ? t('main.text-19') : t('main.text-20')}
						</p>
						<p>
							{t('main.text-14')}: {details.parkingAvailable ? t('main.text-19') : t('main.text-20')}
						</p>
						<p>
							{t('main.text-15')}: {details.warrantyProvided ? t('main.text-19') : t('main.text-20')}
						</p>
						<p>
							{t('main.text-16')}: {details.emergencyAvailability ? t('main.text-19') : t('main.text-20')}
						</p>
						<p>
							{t('main.text-17')}: {details.firstCheckupIsFree ? t('main.text-19') : t('main.text-20')}
						</p>
					</div>
				)}

				{airportsDistances &&
					airportsDistances.map((airportDistance) => (
						<div className="flex items-center justify-between" key={airportDistance.distance}>
							<span>{airports?.find((airport) => airport?.id === airportDistance?.airport)?.name?.trim()}:</span>
							<span className="font-[700] text-primaryColor">{airportDistance?.distance}km</span>
						</div>
					))}
			</div>
		</div>
	);
};

export default ClinicDetailsMenu;
