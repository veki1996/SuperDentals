import { useAtom } from 'jotai';
import useTranslation from 'next-translate/useTranslation';
import { useRouter } from 'next/router';
import { AiOutlineCheck, AiOutlineClose } from 'react-icons/ai';
import { selectedPackageAtom } from '/store';

const PackageCard = ({ subPackage, selectedCountry }) => {
	const [, setSelectedPackage] = useAtom(selectedPackageAtom);

	const { t } = useTranslation('packages');

	const router = useRouter();

	const filteredPackagePrice = subPackage?.price?.find((price) => price?.country === selectedCountry);

	const filteredDiscount = subPackage?.discount?.find((discount) => discount?.country === selectedCountry);

	const filteredPackage = { ...subPackage, filteredPrice: filteredPackagePrice };

	const handleSelectPackage = (subPackage) => {
		setSelectedPackage(filteredPackage);
		if (subPackage?.accessor === 'PREMIUM+') {
			router.push('/contact');
			return;
		}
		router.push('/payment');
	};
	return (
		<div
			className={`h-[600px] flex flex-col gap-5 rounded-[12px]  shadow-packagesCard relative ${
				subPackage?.accessor === 'PREMIUM' && 'border-[4px]  border-primaryColor'
			} mt-6`}
		>
			{subPackage?.accessor === 'PREMIUM' && (
				<div className="uppercase absolute text-white bg-primaryColor  w-[70%] py-2 left-[15%] rounded-t-[8px] flex justify-center items-center font-[500] -top-10">
					Popularno
				</div>
			)}

			<div className="min-h-[106px] bg-[#21231E] flex justify-center items-end pb-2 rounded-t-[8px] ">
				<h1 className="text-white font-[700] text-[44px]">{subPackage?.name}</h1>
			</div>
			<div className="flex flex-col justify-between px-6 pb-6 gap-8 h-full">
				<div className="flex justify-center flex-col items-center">
					{filteredPackage?.filteredPrice?.price !== '0' && filteredDiscount?.value !== '0' && (
						<span className="text-[32px] font-[700] text-primaryColor">
							{(
								filteredPackage?.filteredPrice?.price -
								(Number(filteredPackage?.filteredPrice?.price) / 100) * Number(filteredDiscount?.value)
							).toFixed(2)}{' '}
							{filteredPackage?.filteredPrice?.currency}
						</span>
					)}
					<h2
						className={`${
							filteredPackage?.filteredPrice?.price !== '0' && filteredDiscount?.value !== '0'
								? 'text-[20px] font-[500] text-[#21231E] line-through'
								: 'text-[32px] font-[700] text-primaryColor'
						}`}
					>
						{filteredPackage?.filteredPrice?.price === '0'
							? 'Na upit'
							: `${filteredPackage?.filteredPrice?.price} ${filteredPackage?.filteredPrice?.currency}`}
					</h2>
					{selectedCountry === 'ba' && <span className="font-[600]">*Nije uračunat PDV.</span>}
					<span className="uppercase font-[500]">({t('main.text-4')})</span>
				</div>
				<div className="flex flex-col gap-1 max-h-[250px] overflow-y-scroll scrollbar">
					<div className="flex items-center gap-2">
						<div className="w-[18px] h-[18px] flex items-center justify-center">
							<AiOutlineCheck size={15} color="#FC5122" />
						</div>
						<span className="font-[600] text-[#21231E] text-[14px]">Osnovni profil (naziv, adresa, grad)</span>
					</div>
					<div className="flex items-center gap-2">
						<div className="w-[18px] h-[18px] flex items-center justify-center">
							<AiOutlineCheck size={15} color="#FC5122" />
						</div>
						<span className="font-[600] text-[#21231E] text-[14px]">Kontakt info (telefon, e-mail)</span>
					</div>
					<div className="flex items-center gap-2">
						<div className="w-[18px] h-[18px] flex items-center justify-center">
							<AiOutlineCheck size={15} color="#FC5122" />
						</div>
						<span className="font-[600] text-[#21231E] text-[14px]">Godine iskustva (rada)</span>
					</div>
					<div className="flex items-center gap-2">
						<div className="w-[18px] h-[18px] flex items-center justify-center">
							<AiOutlineCheck size={15} color="#FC5122" />
						</div>
						<span className="font-[600] text-[#21231E] text-[14px]">Broj ordinacija</span>
					</div>
					<div className="flex items-center gap-2">
						<div className="w-[18px] h-[18px] flex items-center justify-center">
							<AiOutlineCheck size={15} color="#FC5122" />
						</div>
						<span className="font-[600] text-[#21231E] text-[14px]">Broj ordinacija</span>
					</div>
					<div className="flex items-center gap-2">
						<div className="w-[18px] h-[18px] flex items-center justify-center">
							<AiOutlineCheck size={15} color="#FC5122" />
						</div>
						<span className="font-[600] text-[#21231E] text-[14px]">Broj osoblja (zaposlenih)</span>
					</div>
					<div className="flex items-center gap-2">
						<div className="w-[18px] h-[18px] flex items-center justify-center">
							<AiOutlineCheck size={15} color="#FC5122" />
						</div>
						<span className="font-[600] text-[#21231E] text-[14px]">Logo</span>
					</div>
					<div className="flex items-center gap-2">
						<div className="w-[18px] h-[18px] flex items-center justify-center">
							<AiOutlineCheck size={15} color="#FC5122" />
						</div>
						<span className="font-[600] text-[#21231E] text-[14px]">Fotografije zaposlenih doktora</span>
					</div>
					<div className="flex items-center gap-2">
						<div className="w-[18px] h-[18px] flex items-center justify-center">
							<AiOutlineCheck size={15} color="#FC5122" />
						</div>
						<span className="font-[600] text-[#21231E] text-[14px]">Fotografije zaposlenog osoblja</span>
					</div>
					<div className="flex items-center gap-2">
						<div className="w-[18px] h-[18px] flex items-center justify-center">
							<AiOutlineCheck size={15} color="#FC5122" />
						</div>
						<span className="font-[600] text-[#21231E] text-[14px] flex items-center gap-1">
							Fotografije:
							<span className="text-primaryColor">
								{subPackage?.accessor === 'START' ? '4' : subPackage?.accessor === 'STANDARD' ? '8' : '12'}
							</span>
						</span>
					</div>
					<div className="flex items-center gap-2">
						<div className="w-[18px] h-[18px] flex items-center justify-center">
							<AiOutlineCheck size={15} color="#FC5122" />
						</div>
						<span className="font-[600] text-[#21231E] text-[14px]">
							Broj prikazanih usluga:&nbsp;
							<span className="text-primaryColor">
								{subPackage?.accessor === 'START' ? '6' : subPackage?.accessor === 'STANDARD' ? '10' : 'neograničeno'}
							</span>
						</span>
					</div>
					<div className="flex items-center gap-2">
						<div className="w-[18px] h-[18px] flex items-center justify-center">
							<AiOutlineCheck size={15} color="#FC5122" />
						</div>
						<span className="font-[600] text-[#21231E] text-[14px]">
							Edukativni tekst:&nbsp;
							<span className="text-primaryColor">
								{subPackage?.accessor === 'START' ? '8' : subPackage?.accessor === 'STANDARD' ? '16' : 'neograničeno'}
							</span>
						</span>
					</div>
					<div className="flex items-center gap-2">
						<div className="w-[18px] h-[18px] flex items-center justify-center">
							<AiOutlineCheck size={15} color="#FC5122" />
						</div>
						<span className="font-[600] text-[#21231E] text-[14px]">Google map pozicija</span>
					</div>
					<div className="flex items-center gap-2">
						<div className="w-[18px] h-[18px] flex items-center justify-center">
							<AiOutlineCheck size={15} color="#FC5122" />
						</div>
						<span className="font-[600] text-[#21231E] text-[14px]">Web stranica - link</span>
					</div>
					<div className="flex items-center gap-2">
						<div className="w-[18px] h-[18px] flex items-center justify-center">
							<AiOutlineCheck size={15} color="#FC5122" />
						</div>
						<span className="font-[600] text-[#21231E] text-[14px]">Oznaka Wi-Fi u ordinaciji</span>
					</div>
					<div className="flex items-center gap-2">
						<div className="w-[18px] h-[18px] flex items-center justify-center">
							<AiOutlineCheck size={15} color="#FC5122" />
						</div>
						<span className="font-[600] text-[#21231E] text-[14px]">Oznaka za parking</span>
					</div>
					<div className="flex items-center gap-2">
						<div className="w-[18px] h-[18px] flex items-center justify-center">
							<AiOutlineCheck size={15} color="#FC5122" />
						</div>
						<span className="font-[600] text-[#21231E] text-[14px]">Oznaka plaćanja kreditnom karticom</span>
					</div>
					<div className="flex items-center gap-2">
						<div className="w-[18px] h-[18px] flex items-center justify-center">
							<AiOutlineCheck size={15} color="#FC5122" />
						</div>
						<span className="font-[600] text-[#21231E] text-[14px]">Oznaka - garancija na usluge</span>
					</div>
					<div className="flex items-center gap-2">
						<div className="w-[18px] h-[18px] flex items-center justify-center">
							<AiOutlineCheck size={15} color="#FC5122" />
						</div>
						<span className="font-[600] text-[#21231E] text-[14px]">Oznaka raspoloživosti 24h</span>
					</div>
					<div className="flex items-center gap-2">
						<div className="w-[18px] h-[18px] flex items-center justify-center">
							<AiOutlineCheck size={15} color="#FC5122" />
						</div>
						<span className="font-[600] text-[#21231E] text-[14px]">Oznaka besplatan prvi pregled</span>
					</div>
					<div className="flex items-center gap-2">
						<div className="w-[18px] h-[18px] flex items-center justify-center">
							<AiOutlineCheck size={15} color="#FC5122" />
						</div>
						<span className="font-[600] text-[#21231E] text-[14px]">Facebook stranica - link</span>
					</div>
					<div className="flex items-center gap-2">
						<div className="w-[18px] h-[18px] flex items-center justify-center">
							<AiOutlineCheck size={15} color="#FC5122" />
						</div>
						<span className="font-[600] text-[#21231E] text-[14px]">Instagram stranica - link</span>
					</div>
					<div className="flex items-center gap-2">
						<div className="w-[18px] h-[18px] flex items-center justify-center">
							<AiOutlineCheck size={15} color="#FC5122" />
						</div>
						<span className="font-[600] text-[#21231E] text-[14px]">TikTok stranica - link</span>
					</div>
					<div className="flex items-center gap-2">
						<div className="w-[18px] h-[18px] flex items-center justify-center">
							<AiOutlineCheck size={15} color="#FC5122" />
						</div>
						<span className="font-[600] text-[#21231E] text-[14px]">Istaknuto radno vrijeme</span>
					</div>
					<div className="flex items-center gap-2">
						<div className="w-[18px] h-[18px] flex items-center justify-center">
							<AiOutlineCheck size={15} color="#FC5122" />
						</div>
						<span className="font-[600] text-[#21231E] text-[14px]">
							Sponzorisani tekst:&nbsp;
							<span className="text-primaryColor">
								{subPackage?.accessor === 'START' ? '4x' : subPackage?.accessor === 'STANDARD' ? '8x' : '12x'}
							</span>
						</span>
					</div>
					<div className="flex items-center gap-2">
						<div className="w-[18px] h-[18px] flex items-center justify-center">
							<AiOutlineCheck size={15} color="#FC5122" />
						</div>
						<span className="font-[600] text-[#21231E] text-[14px]">
							Objava na FB i Instagram stranici superdentals.com :&nbsp;
							<span className="text-primaryColor">
								{subPackage?.accessor === 'START' ? '0' : subPackage?.accessor === 'STANDARD' ? '16' : '24'}
							</span>
						</span>
					</div>
					<div className="flex items-center gap-2">
						<div className="w-[18px] h-[18px] flex items-center justify-center">
							<AiOutlineCheck size={15} color="#FC5122" />
						</div>
						<span className="font-[600] text-[#21231E] text-[14px]">
							Objava na TikTok stranici superdentals.com:&nbsp;
							<span className="text-primaryColor">
								{subPackage?.accessor === 'START' ? '0' : subPackage?.accessor === 'STANDARD' ? '16' : '24'}
							</span>
						</span>
					</div>
					<div className="flex items-center gap-2">
						<div className="w-[18px] h-[18px] flex items-center justify-center">
							<AiOutlineCheck size={15} color="#FC5122" />
						</div>
						<span className="font-[600] text-[#21231E] text-[14px]">
							Udaljenost od aerodroma:&nbsp;
							<span className="text-primaryColor">
								{subPackage?.accessor === 'START' ? '0' : subPackage?.accessor === 'STANDARD' ? '3' : '6'}
							</span>
						</span>
					</div>
					<div className="flex items-center gap-2">
						<div className="w-[18px] h-[18px] flex items-center justify-center">
							{subPackage?.accessor === 'START' ? (
								<AiOutlineClose size={15} color="#FC5122" />
							) : (
								<AiOutlineCheck size={15} color="#FC5122" />
							)}
						</div>
						<span className="font-[600] text-[#21231E] text-[14px]">Dodatni opis usluga</span>
					</div>
					<div className="flex items-center gap-2">
						<div className="w-[18px] h-[18px] flex items-center justify-center">
							{subPackage?.accessor === 'START' ? (
								<AiOutlineClose size={15} color="#FC5122" />
							) : (
								<AiOutlineCheck size={15} color="#FC5122" />
							)}
						</div>
						<span className="font-[600] text-[#21231E] text-[14px]">Istaknute cijene usluga</span>
					</div>
					<div className="flex items-center gap-2">
						<div className="w-[18px] h-[18px] flex items-center justify-center">
							{subPackage?.accessor === 'START' ? (
								<AiOutlineClose size={15} color="#FC5122" />
							) : (
								<AiOutlineCheck size={15} color="#FC5122" />
							)}
						</div>
						<span className="font-[600] text-[#21231E] text-[14px]">Jezik koji se koristi u ordinaciji</span>
					</div>
					<div className="flex items-center gap-2">
						<div className="w-[18px] h-[18px] flex items-center justify-center">
							{subPackage?.accessor === 'START' ? (
								<AiOutlineClose size={15} color="#FC5122" />
							) : (
								<AiOutlineCheck size={15} color="#FC5122" />
							)}
						</div>
						<span className="font-[600] text-[#21231E] text-[14px]">Opcija zakazivanja</span>
					</div>
					<div className="flex items-center gap-2">
						<div className="w-[18px] h-[18px] flex items-center justify-center">
							{subPackage?.accessor === 'START' ? (
								<AiOutlineClose size={15} color="#FC5122" />
							) : (
								<AiOutlineCheck size={15} color="#FC5122" />
							)}
						</div>
						<span className="font-[600] text-[#21231E] text-[14px]">Promo film</span>
					</div>
					<div className="flex items-center gap-2">
						<div className="w-[18px] h-[18px] flex items-center justify-center">
							{subPackage?.accessor === 'START' || subPackage?.accessor === 'STANDARD' ? (
								<AiOutlineClose size={15} color="#FC5122" />
							) : (
								<AiOutlineCheck size={15} color="#FC5122" />
							)}
						</div>
						<span className="font-[600] text-[#21231E] text-[14px]">15% popusta na dodatne usluge</span>
					</div>
					<div className="flex items-center gap-2">
						<div className="w-[18px] h-[18px] flex items-center justify-center">
							{subPackage?.accessor === 'START' || subPackage?.accessor === 'STANDARD' ? (
								<AiOutlineClose size={15} color="#FC5122" />
							) : (
								<AiOutlineCheck size={15} color="#FC5122" />
							)}
						</div>
						<span className="font-[600] text-[#21231E] text-[14px]">Dentalni turizam</span>
					</div>
					<div className="flex items-center gap-2">
						<div className="w-[18px] h-[18px] flex items-center justify-center">
							{subPackage?.accessor === 'START' || subPackage?.accessor === 'STANDARD' ? (
								<AiOutlineClose size={15} color="#FC5122" />
							) : (
								<AiOutlineCheck size={15} color="#FC5122" />
							)}
						</div>
						<span className="font-[600] text-[#21231E] text-[14px]">Preporuka</span>
					</div>
					<div className="flex items-center gap-2">
						<div className="w-[18px] h-[18px] flex items-center justify-center">
							{subPackage?.accessor === 'PREMIUM+' ? (
								<AiOutlineCheck size={15} color="#FC5122" />
							) : (
								<AiOutlineClose size={15} color="#FC5122" />
							)}
						</div>
						<span className="font-[600] text-[#21231E] text-[14px]">Osiguranje</span>
					</div>
				</div>
				<div>
					<button
						className="button px-[24px] py-[8px] font-[500] text-[16px] w-full shadow-packagesCard"
						onClick={() => handleSelectPackage(subPackage)}
					>
						Izaberi paket
					</button>
				</div>
			</div>
		</div>
	);
};

export default PackageCard;
