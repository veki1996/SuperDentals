import Image from 'next/image';
import Link from 'next/link';
import { ImageDisplay } from '/components';
import { HiLocationMarker } from 'react-icons/hi';
import { AiFillStar } from 'react-icons/ai';
import { MdAirplanemodeActive } from 'react-icons/md';
import { Swiper, SwiperSlide } from 'swiper/react';
import { premiumPlusServices, premiumServices, standardServices, startServices } from '/utils/consts';
import { getServiceName } from '/utils/utils';
import useTranslation from 'next-translate/useTranslation';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

// import required modules
import { Autoplay } from 'swiper';
import { useRouter } from 'next/router';

const Card = ({ clinic, airports }) => {
	const subscriptionPackage = clinic?.user?.subscriber?.package;
	const router = useRouter();
	const { locale } = router;
	const { t } = useTranslation('card');

	return (
		<Link key={clinic.id} href={`/clinics/${clinic.username.trim()}`}>
			<div
				className={`bg-white rounded-[8px] cursor-pointer shadow-md shadow-black/30 xl:h-[480px] ${
					clinic?.premium && 'border-[2px] border-[#EDB92E] bg-[#fffcf5]'
				}`}
			>
				{clinic.images.filter((image) => {
					if (image.imageUsage === 'FEATURED') return true;
				}).length > 0 ? (
					<ImageDisplay
						images={clinic.images}
						imageType="FEATURED"
						imageFrom="clinic"
						id={clinic.id}
						layout="fill"
						containerStyle="h-[180px]"
						imageContainerStyle="relative h-full"
						imageStyle="rounded-t-[8px] "
					/>
				) : (
					<div className="relative h-[180px]">
						{clinic?.images?.filter((image) => image?.imageUsage !== 'LOGO')?.length > 0 ? (
							<ImageDisplay
								images={clinic.images[0]}
								imageType="ALBUM"
								imageFrom="clinic"
								id={clinic.id}
								layout="fill"
								imageContainerStyle="h-[180px] relative h-full"
								containerStyle="h-full"
								imageStyle="rounded-t-[8px]"
							/>
						) : (
							<Image
								alt="Placeholder"
								src="/placeholder-images/placeholder-1.png"
								layout="fill"
								className=" rounded-t-[8px]"
								objectFit="cover"
							/>
						)}
					</div>
				)}
				<div>
					<div className="flex flex-col justify-between gap-4 p-4 h-[230px]">
						<div>
							<h1 className="text-[#FC5122] lg:h-[60px] xl:h-auto font-[700] text-[20px]">{clinic?.name}</h1>
						</div>
						<div className="flex justify-between">
							<div className="flex items-center gap-2">
								<Image alt="translate" src="/country-flags/translate.svg" height={25} width={25} />
								{subscriptionPackage?.accessor !== 'START' &&
									JSON.parse(clinic?.languagesSpoken)?.map((language) => (
										<div key={language.value} className="relative h-[24px] w-[24px]">
											<Image
												alt={language.label}
												src={`/country-flags/${language.value}.svg`}
												layout="fill"
												objectFit="cover"
												className="rounded-full"
											/>
										</div>
									))}
							</div>
							{clinic?.rating?.trim() !== '' && clinic?.rating?.trim() !== 'undefined' ? (
								<div className="flex items-center">
									<AiFillStar size={25} color="#EDB92E" />
									<span className="text-[#EDB92E] font-[700] text-[16px] md:text-[20px]">{clinic?.rating}</span>
								</div>
							) : (
								<div>
									<AiFillStar size={25} color="#EDB92E" />
								</div>
							)}
						</div>

						<div className="flex items-center gap-2 basis-[15%]">
							<HiLocationMarker color="black" size={25} />
							<span className="text-black">
								{clinic?.location?.cityName}, {clinic?.location?.country.toUpperCase()}
							</span>
						</div>

						{JSON.parse(clinic?.distanceFromAirports) && subscriptionPackage?.accessor !== 'START' && (
							<div className="flex items-center gap-2">
								<MdAirplanemodeActive size={25} color="#21231E" />
								<span>
									{
										airports?.find(
											(airport) =>
												airport?.id ===
												JSON.parse(clinic?.distanceFromAirports).sort((a, b) => a.distance - b.distance)[0]?.airport,
										)?.name
									}
								</span>
								<span className="font-[700]">
									{JSON.parse(clinic?.distanceFromAirports).sort((a, b) => a.distance - b.distance)[0]?.distance}km
								</span>
							</div>
						)}
						<div
							data-tip={
								subscriptionPackage?.accessor === 'START'
									? clinic?.clinicServices
											?.map((s) => getServiceName(s?.service, locale, true))
											?.slice(0, startServices)
											.join(', ')
									: subscriptionPackage?.accessor === 'STANDARD'
									? clinic?.clinicServices
											?.map((s) => getServiceName(s?.service, locale, true))
											?.slice(0, standardServices)
											.join(', ')
									: subscriptionPackage?.accessor === 'PREMIUM'
									? clinic?.clinicServices
											?.map((s) => getServiceName(s?.service, locale, true))
											?.slice(0, premiumServices(clinic))
											.join(', ')
									: clinic?.clinicServices
											?.map((s) => getServiceName(s?.service, locale, true))
											?.slice(0, premiumPlusServices(clinic))
											.join(', ')
							}
							className="flex items-center  tooltip tooltip-secondary"
						>
							<p className="text-[14px] text-[#21231E]text-left truncate">
								<span className="font-[700]">{t('main.service')}</span>:{' '}
								{clinic?.clinicServices
									?.map((s) => getServiceName(s?.service, locale))
									?.join(', ')
									?.trim()
									?.toLowerCase()}
							</p>
						</div>
					</div>
					<div className="p-4 gap-3 h-[70px] flex flex-col justify-between">
						<div className="bg-gray-400/80 w-full h-[1px]"></div>
						<Swiper
							centeredSlides={true}
							speed={600}
							autoplay={{
								delay: 3500,
								disableOnInteraction: false,
							}}
							modules={[Autoplay]}
							className="w-[95%]"
						>
							{clinic?.clinicServices?.some((s) => s.price !== '') && subscriptionPackage?.accessor !== 'START' ? (
								clinic?.clinicServices
									?.filter((s) => s.price !== '')
									?.map((s) => (
										<SwiperSlide key={s.id}>
											{getServiceName(s?.service, locale)}:{' '}
											<span className="font-[700] text-primaryColor">
												{s?.price} {s?.currency}
											</span>
										</SwiperSlide>
									))
							) : (
								<SwiperSlide>
									<span>{t('main.text-1')}</span>
								</SwiperSlide>
							)}
						</Swiper>
					</div>
				</div>
			</div>
		</Link>
	);
};

export default Card;
