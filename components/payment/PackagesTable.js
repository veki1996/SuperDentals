import { useAtom } from 'jotai';
import useTranslation from 'next-translate/useTranslation';
import Image from 'next/image';
import React from 'react';
import { selectedPackageAtom } from '/store';

const PackagesTable = ({ packages, setError, selectedCountry }) => {
	const { t } = useTranslation('packages');

	const [, setSelectedPackage] = useAtom(selectedPackageAtom);

	const handlePackageChange = (subPackage) => {
		if (subPackage) {
			setSelectedPackage(subPackage);
			setError('');
		}
	};

	return (
		<table className="min-w-full border-l-white text-left table-fixed">
			<thead className="border-b">
				<tr className="text-center border-collapse">
					<th scope="col" className="text-left px-6 py-4  relative">
						<h1 className="text-[60px] text-primaryColor font-[700] absolute left-0 -top-6">Paketi</h1>
					</th>

					{packages?.map((subPackage) => (
						<th key={subPackage?.id}>
							{subPackage.accessor === 'PREMIUM' ? (
								<div className="-mx-[5px] -mb-4 ">
									<div className="mx-12 border-b-8 border-t-8 pt-2 rounded-t-xl border-primaryColor bg-primaryColor text-white">
										POPULARNO
									</div>
									<div
										scope="col"
										className="text-[22px] font-[700] text-black px-14 py-6 border-t-8 border-l-8 border-r-8 rounded-t-xl border-primaryColor "
									>
										{subPackage?.name}
									</div>
								</div>
							) : (
								<div className="mt-[70px]">
									<div scope="col" className="text-[22px] font-[700]  text-black px-12 py-4  ">
										{subPackage?.name}
									</div>
								</div>
							)}
						</th>
					))}
				</tr>
			</thead>
			<tbody>
				<tr className="border-b">
					<td className="px-6 py-4  text-[18px] font-medium text-black border-r ">
						Osnovni profil (naziv, adresa, grad)
					</td>
					<td className="text-sm text-black font-light px-6 py-3 border-r">
						<div className="flex items-center justify-center">
							<Image alt="tooth" src="/packages-page-assets/solid-tooth.svg" width={26} height={30} />
						</div>
					</td>
					<td className="text-sm text-black font-light px-6 py-3 border-r">
						<div className="flex items-center justify-center">
							<Image alt="tooth" src="/packages-page-assets/solid-tooth.svg" width={26} height={30} />
						</div>
					</td>
					<td className="text-sm text-black font-light px-6 py-3  border-l-8 border-r-8 border-primaryColor">
						<div className="flex items-center justify-center ">
							<Image alt="tooth" src="/packages-page-assets/solid-tooth.svg" width={26} height={30} />
						</div>
					</td>
					<td className="text-sm text-black font-light px-6 py-3 border-r">
						<div className="flex items-center justify-center">
							<Image alt="tooth" src="/packages-page-assets/solid-tooth.svg" width={26} height={30} />
						</div>
					</td>
				</tr>
				<tr className="border-b">
					<td className="px-6 py-4  text-[18px] font-medium text-black border-r ">Kontakt info (telefon, e-mail)</td>
					<td className="text-sm text-black font-light px-6 py-3 border-r">
						<div className="flex items-center justify-center">
							<Image alt="tooth" src="/packages-page-assets/solid-tooth.svg" width={26} height={30} />
						</div>
					</td>
					<td className="text-sm text-black font-light px-6 py-3 border-r">
						<div className="flex items-center justify-center">
							<Image alt="tooth" src="/packages-page-assets/solid-tooth.svg" width={26} height={30} />
						</div>
					</td>
					<td className="text-sm text-black font-light px-6 py-3 border-l-8 border-r-8 border-primaryColor">
						<div className="flex items-center justify-center">
							<Image alt="tooth" src="/packages-page-assets/solid-tooth.svg" width={26} height={30} />
						</div>
					</td>
					<td className="text-sm text-black font-light px-6 py-3 border-r">
						<div className="flex items-center justify-center">
							<Image alt="tooth" src="/packages-page-assets/solid-tooth.svg" width={26} height={30} />
						</div>
					</td>
				</tr>
				<tr className="border-b">
					<td className="px-6 py-4  text-[18px] font-medium text-black border-r ">Godine iskustva (rada)</td>
					<td className="text-sm text-black font-light px-6 py-3 border-r">
						<div className="flex items-center justify-center">
							<Image alt="tooth" src="/packages-page-assets/solid-tooth.svg" width={26} height={30} />
						</div>
					</td>
					<td className="text-sm text-black font-light px-6 py-3 border-r">
						<div className="flex items-center justify-center">
							<Image alt="tooth" src="/packages-page-assets/solid-tooth.svg" width={26} height={30} />
						</div>
					</td>
					<td className="text-sm text-black font-light px-6 py-3 border-l-8 border-r-8 border-primaryColor">
						<div className="flex items-center justify-center">
							<Image alt="tooth" src="/packages-page-assets/solid-tooth.svg" width={26} height={30} />
						</div>
					</td>
					<td className="text-sm text-black font-light px-6 py-3 border-r">
						<div className="flex items-center justify-center">
							<Image alt="tooth" src="/packages-page-assets/solid-tooth.svg" width={26} height={30} />
						</div>
					</td>
				</tr>
				<tr className="border-b">
					<td className="px-6 py-4  text-[18px] font-medium text-black border-r ">Broj ordinacija</td>
					<td className="text-sm text-black font-light px-6 py-3 border-r">
						<div className="flex items-center justify-center">
							<Image alt="tooth" src="/packages-page-assets/solid-tooth.svg" width={26} height={30} />
						</div>
					</td>
					<td className="text-sm text-black font-light px-6 py-3 border-r">
						<div className="flex items-center justify-center">
							<Image alt="tooth" src="/packages-page-assets/solid-tooth.svg" width={26} height={30} />
						</div>
					</td>
					<td className="text-sm text-black font-light px-6 py-3 border-l-8 border-r-8 border-primaryColor">
						<div className="flex items-center justify-center">
							<Image alt="tooth" src="/packages-page-assets/solid-tooth.svg" width={26} height={30} />
						</div>
					</td>
					<td className="text-sm text-black font-light px-6 py-3 border-r">
						<div className="flex items-center justify-center">
							<Image alt="tooth" src="/packages-page-assets/solid-tooth.svg" width={26} height={30} />
						</div>
					</td>
				</tr>
				<tr className="border-b">
					<td className="px-6 py-4  text-[18px] font-medium text-black border-r ">Broj doktora (zaposlenih)</td>
					<td className="text-sm text-black font-light px-6 py-3 border-r">
						<div className="flex items-center justify-center">
							<Image alt="tooth" src="/packages-page-assets/solid-tooth.svg" width={26} height={30} />
						</div>
					</td>
					<td className="text-sm text-black font-light px-6 py-3 border-r">
						<div className="flex items-center justify-center">
							<Image alt="tooth" src="/packages-page-assets/solid-tooth.svg" width={26} height={30} />
						</div>
					</td>
					<td className="text-sm text-black font-light px-6 py-3 border-l-8 border-r-8 border-primaryColor">
						<div className="flex items-center justify-center">
							<Image alt="tooth" src="/packages-page-assets/solid-tooth.svg" width={26} height={30} />
						</div>
					</td>
					<td className="text-sm text-black font-light px-6 py-3 border-r">
						<div className="flex items-center justify-center">
							<Image alt="tooth" src="/packages-page-assets/solid-tooth.svg" width={26} height={30} />
						</div>
					</td>
				</tr>
				<tr className="border-b">
					<td className="px-6 py-4  text-[18px] font-medium text-black border-r ">Broj osoblja (zaposlenih)</td>
					<td className="text-sm text-black font-light px-6 py-3 border-r">
						<div className="flex items-center justify-center">
							<Image alt="tooth" src="/packages-page-assets/solid-tooth.svg" width={26} height={30} />
						</div>
					</td>
					<td className="text-sm text-black font-light px-6 py-3 border-r">
						<div className="flex items-center justify-center">
							<Image alt="tooth" src="/packages-page-assets/solid-tooth.svg" width={26} height={30} />
						</div>
					</td>
					<td className="text-sm text-black font-light px-6 py-3 border-l-8 border-r-8 border-primaryColor">
						<div className="flex items-center justify-center">
							<Image alt="tooth" src="/packages-page-assets/solid-tooth.svg" width={26} height={30} />
						</div>
					</td>
					<td className="text-sm text-black font-light px-6 py-3 border-r">
						<div className="flex items-center justify-center">
							<Image alt="tooth" src="/packages-page-assets/solid-tooth.svg" width={26} height={30} />
						</div>
					</td>
				</tr>
				<tr className="border-b">
					<td className="px-6 py-4  text-[18px] font-medium text-black border-r ">Logo</td>
					<td className="text-sm text-black font-light px-6 py-3 border-r">
						<div className="flex items-center justify-center">
							<Image alt="tooth" src="/packages-page-assets/solid-tooth.svg" width={26} height={30} />
						</div>
					</td>
					<td className="text-sm text-black font-light px-6 py-3 border-r">
						<div className="flex items-center justify-center">
							<Image alt="tooth" src="/packages-page-assets/solid-tooth.svg" width={26} height={30} />
						</div>
					</td>
					<td className="text-sm text-black font-light px-6 py-3 border-l-8 border-r-8 border-primaryColor">
						<div className="flex items-center justify-center">
							<Image alt="tooth" src="/packages-page-assets/solid-tooth.svg" width={26} height={30} />
						</div>
					</td>
					<td className="text-sm text-black font-light px-6 py-3 border-r">
						<div className="flex items-center justify-center">
							<Image alt="tooth" src="/packages-page-assets/solid-tooth.svg" width={26} height={30} />
						</div>
					</td>
				</tr>
				<tr className="border-b">
					<td className="px-6 py-4  text-[18px] font-medium text-black border-r ">Fotografije zaposlenih doktora</td>
					<td className="text-sm text-black font-light px-6 py-3 border-r">
						<div className="flex items-center justify-center">
							<Image alt="tooth" src="/packages-page-assets/solid-tooth.svg" width={26} height={30} />
						</div>
					</td>
					<td className="text-sm text-black font-light px-6 py-3 border-r">
						<div className="flex items-center justify-center">
							<Image alt="tooth" src="/packages-page-assets/solid-tooth.svg" width={26} height={30} />
						</div>
					</td>
					<td className="text-sm text-black font-light px-6 py-3 border-l-8 border-r-8 border-primaryColor">
						<div className="flex items-center justify-center">
							<Image alt="tooth" src="/packages-page-assets/solid-tooth.svg" width={26} height={30} />
						</div>
					</td>
					<td className="text-sm text-black font-light px-6 py-3 border-r">
						<div className="flex items-center justify-center">
							<Image alt="tooth" src="/packages-page-assets/solid-tooth.svg" width={26} height={30} />
						</div>
					</td>
				</tr>
				<tr className="border-b">
					<td className="px-6 py-4  text-[18px] font-medium text-black border-r ">Fotografije zaposlenog osoblja</td>
					<td className="text-sm text-black font-light px-6 py-3 border-r">
						<div className="flex items-center justify-center">
							<Image alt="tooth" src="/packages-page-assets/solid-tooth.svg" width={26} height={30} />
						</div>
					</td>
					<td className="text-sm text-black font-light px-6 py-3 border-r">
						<div className="flex items-center justify-center">
							<Image alt="tooth" src="/packages-page-assets/solid-tooth.svg" width={26} height={30} />
						</div>
					</td>
					<td className="text-sm text-black font-light px-6 py-3 border-l-8 border-r-8 border-primaryColor">
						<div className="flex items-center justify-center">
							<Image alt="tooth" src="/packages-page-assets/solid-tooth.svg" width={26} height={30} />
						</div>
					</td>
					<td className="text-sm text-black font-light px-6 py-3 border-r">
						<div className="flex items-center justify-center">
							<Image alt="tooth" src="/packages-page-assets/solid-tooth.svg" width={26} height={30} />
						</div>
					</td>
				</tr>
				<tr className="border-b">
					<td className="px-6 py-4  text-[18px] font-medium text-black border-r ">
						Fotografije (broj zavisi od paketa)
					</td>
					<td className="text-[20px] text-primaryColor font-[600] px-6 py-3 border-r">
						<div className="flex items-center justify-center">(4)</div>
					</td>
					<td className="text-[20px] text-primaryColor font-[600] px-6 py-3 border-r">
						<div className="flex items-center justify-center">(8)</div>
					</td>
					<td className="text-[20px] text-primaryColor font-[600] px-6 py-3 border-l-8 border-r-8 border-primaryColor">
						<div className="flex items-center justify-center">(12)</div>
					</td>
					<td className="text-[20px] text-primaryColor font-[600] px-6 py-3 border-r">
						<div className="flex items-center justify-center">(12)</div>
					</td>
				</tr>
				<tr className="border-b">
					<td className="px-6 py-4  text-[18px] font-medium text-black border-r ">
						Broj prikazanih usluga (broj zavisi od paketa)
					</td>
					<td className="text-[20px] text-primaryColor font-[600] px-6 py-3 border-r">
						<div className="flex items-center justify-center">(6)</div>
					</td>
					<td className="text-[20px] text-primaryColor font-[600] px-6 py-3 border-r">
						<div className="flex items-center justify-center">(10)</div>
					</td>
					<td className="text-[20px] text-primaryColor font-[600] px-6 py-3 border-l-8 border-r-8 border-primaryColor">
						<div className="flex items-center justify-center">(neograničeno)</div>
					</td>
					<td className="text-[20px] text-primaryColor font-[600] px-6 py-3 border-r">
						<div className="flex items-center justify-center">(neograničeno)</div>
					</td>
				</tr>
				<tr className="border-b">
					<td className="px-6 py-4  text-[18px] font-medium text-black border-r ">
						Edukativni tekst (broj zavisi od paketa)
					</td>
					<td className="text-[20px] text-primaryColor font-[600] px-6 py-3 border-r">
						<div className="flex items-center justify-center">(8x)</div>
					</td>
					<td className="text-[20px] text-primaryColor font-[600] px-6 py-3 border-r">
						<div className="flex items-center justify-center">(16x)</div>
					</td>
					<td className="text-[20px] text-primaryColor font-[600] px-6 py-3 border-l-8 border-r-8 border-primaryColor">
						<div className="flex items-center justify-center">(24x)</div>
					</td>
					<td className="text-[20px] text-primaryColor font-[600] px-6 py-3 border-r">
						<div className="flex items-center justify-center">(24x)</div>
					</td>
				</tr>
				<tr className="border-b">
					<td className="px-6 py-4  text-[18px] font-medium text-black border-r ">Google map pozicija</td>
					<td className="text-sm text-black font-light px-6 py-3 border-r">
						<div className="flex items-center justify-center">
							<Image alt="tooth" src="/packages-page-assets/solid-tooth.svg" width={26} height={30} />
						</div>
					</td>
					<td className="text-sm text-black font-light px-6 py-3 border-r">
						<div className="flex items-center justify-center">
							<Image alt="tooth" src="/packages-page-assets/solid-tooth.svg" width={26} height={30} />
						</div>
					</td>
					<td className="text-sm text-black font-light px-6 py-3 border-l-8 border-r-8 border-primaryColor">
						<div className="flex items-center justify-center">
							<Image alt="tooth" src="/packages-page-assets/solid-tooth.svg" width={26} height={30} />
						</div>
					</td>
					<td className="text-sm text-black font-light px-6 py-3 border-r">
						<div className="flex items-center justify-center">
							<Image alt="tooth" src="/packages-page-assets/solid-tooth.svg" width={26} height={30} />
						</div>
					</td>
				</tr>
				<tr className="border-b">
					<td className="px-6 py-4  text-[18px] font-medium text-black border-r ">Web stranica - link</td>
					<td className="text-sm text-black font-light px-6 py-3 border-r">
						<div className="flex items-center justify-center">
							<Image alt="tooth" src="/packages-page-assets/solid-tooth.svg" width={26} height={30} />
						</div>
					</td>
					<td className="text-sm text-black font-light px-6 py-3 border-r">
						<div className="flex items-center justify-center">
							<Image alt="tooth" src="/packages-page-assets/solid-tooth.svg" width={26} height={30} />
						</div>
					</td>
					<td className="text-sm text-black font-light px-6 py-3 border-l-8 border-r-8 border-primaryColor">
						<div className="flex items-center justify-center">
							<Image alt="tooth" src="/packages-page-assets/solid-tooth.svg" width={26} height={30} />
						</div>
					</td>
					<td className="text-sm text-black font-light px-6 py-3 border-r">
						<div className="flex items-center justify-center">
							<Image alt="tooth" src="/packages-page-assets/solid-tooth.svg" width={26} height={30} />
						</div>
					</td>
				</tr>
				<tr className="border-b">
					<td className="px-6 py-4  text-[18px] font-medium text-black border-r ">Oznaka Wi-Fi u ordinaciji</td>
					<td className="text-sm text-black font-light px-6 py-3 border-r">
						<div className="flex items-center justify-center">
							<Image alt="tooth" src="/packages-page-assets/solid-tooth.svg" width={26} height={30} />
						</div>
					</td>
					<td className="text-sm text-black font-light px-6 py-3 border-r">
						<div className="flex items-center justify-center">
							<Image alt="tooth" src="/packages-page-assets/solid-tooth.svg" width={26} height={30} />
						</div>
					</td>
					<td className="text-sm text-black font-light px-6 py-3 border-l-8 border-r-8 border-primaryColor">
						<div className="flex items-center justify-center">
							<Image alt="tooth" src="/packages-page-assets/solid-tooth.svg" width={26} height={30} />
						</div>
					</td>
					<td className="text-sm text-black font-light px-6 py-3 border-r">
						<div className="flex items-center justify-center">
							<Image alt="tooth" src="/packages-page-assets/solid-tooth.svg" width={26} height={30} />
						</div>
					</td>
				</tr>
				<tr className="border-b">
					<td className="px-6 py-4  text-[18px] font-medium text-black border-r ">Oznaka za parking</td>
					<td className="text-sm text-black font-light px-6 py-3 border-r">
						<div className="flex items-center justify-center">
							<Image alt="tooth" src="/packages-page-assets/solid-tooth.svg" width={26} height={30} />
						</div>
					</td>
					<td className="text-sm text-black font-light px-6 py-3 border-r">
						<div className="flex items-center justify-center">
							<Image alt="tooth" src="/packages-page-assets/solid-tooth.svg" width={26} height={30} />
						</div>
					</td>
					<td className="text-sm text-black font-light px-6 py-3 border-l-8 border-r-8 border-primaryColor">
						<div className="flex items-center justify-center">
							<Image alt="tooth" src="/packages-page-assets/solid-tooth.svg" width={26} height={30} />
						</div>
					</td>
					<td className="text-sm text-black font-light px-6 py-3 border-r">
						<div className="flex items-center justify-center">
							<Image alt="tooth" src="/packages-page-assets/solid-tooth.svg" width={26} height={30} />
						</div>
					</td>
				</tr>
				<tr className="border-b">
					<td className="px-6 py-4  text-[18px] font-medium text-black border-r ">
						Oznaka plaćanja kreditnom karticom
					</td>
					<td className="text-sm text-black font-light px-6 py-3 border-r">
						<div className="flex items-center justify-center">
							<Image alt="tooth" src="/packages-page-assets/solid-tooth.svg" width={26} height={30} />
						</div>
					</td>
					<td className="text-sm text-black font-light px-6 py-3 border-r">
						<div className="flex items-center justify-center">
							<Image alt="tooth" src="/packages-page-assets/solid-tooth.svg" width={26} height={30} />
						</div>
					</td>
					<td className="text-sm text-black font-light px-6 py-3 border-l-8 border-r-8 border-primaryColor">
						<div className="flex items-center justify-center">
							<Image alt="tooth" src="/packages-page-assets/solid-tooth.svg" width={26} height={30} />
						</div>
					</td>
					<td className="text-sm text-black font-light px-6 py-3 border-r">
						<div className="flex items-center justify-center">
							<Image alt="tooth" src="/packages-page-assets/solid-tooth.svg" width={26} height={30} />
						</div>
					</td>
				</tr>
				<tr className="border-b">
					<td className="px-6 py-4  text-[18px] font-medium text-black border-r ">Oznaka - garancija na usluge</td>
					<td className="text-sm text-black font-light px-6 py-3 border-r">
						<div className="flex items-center justify-center">
							<Image alt="tooth" src="/packages-page-assets/solid-tooth.svg" width={26} height={30} />
						</div>
					</td>
					<td className="text-sm text-black font-light px-6 py-3 border-r">
						<div className="flex items-center justify-center">
							<Image alt="tooth" src="/packages-page-assets/solid-tooth.svg" width={26} height={30} />
						</div>
					</td>
					<td className="text-sm text-black font-light px-6 py-3 border-l-8 border-r-8 border-primaryColor">
						<div className="flex items-center justify-center">
							<Image alt="tooth" src="/packages-page-assets/solid-tooth.svg" width={26} height={30} />
						</div>
					</td>
					<td className="text-sm text-black font-light px-6 py-3 border-r">
						<div className="flex items-center justify-center">
							<Image alt="tooth" src="/packages-page-assets/solid-tooth.svg" width={26} height={30} />
						</div>
					</td>
				</tr>
				<tr className="border-b">
					<td className="px-6 py-4  text-[18px] font-medium text-black border-r ">Oznaka raspoloživosti 24h</td>
					<td className="text-sm text-black font-light px-6 py-3 border-r">
						<div className="flex items-center justify-center">
							<Image alt="tooth" src="/packages-page-assets/solid-tooth.svg" width={26} height={30} />
						</div>
					</td>
					<td className="text-sm text-black font-light px-6 py-3 border-r">
						<div className="flex items-center justify-center">
							<Image alt="tooth" src="/packages-page-assets/solid-tooth.svg" width={26} height={30} />
						</div>
					</td>
					<td className="text-sm text-black font-light px-6 py-3 border-l-8 border-r-8 border-primaryColor">
						<div className="flex items-center justify-center">
							<Image alt="tooth" src="/packages-page-assets/solid-tooth.svg" width={26} height={30} />
						</div>
					</td>
					<td className="text-sm text-black font-light px-6 py-3 border-r">
						<div className="flex items-center justify-center">
							<Image alt="tooth" src="/packages-page-assets/solid-tooth.svg" width={26} height={30} />
						</div>
					</td>
				</tr>
				<tr className="border-b">
					<td className="px-6 py-4  text-[18px] font-medium text-black border-r ">Oznaka besplatan prvi pregled</td>
					<td className="text-sm text-black font-light px-6 py-3 border-r">
						<div className="flex items-center justify-center">
							<Image alt="tooth" src="/packages-page-assets/solid-tooth.svg" width={26} height={30} />
						</div>
					</td>
					<td className="text-sm text-black font-light px-6 py-3 border-r">
						<div className="flex items-center justify-center">
							<Image alt="tooth" src="/packages-page-assets/solid-tooth.svg" width={26} height={30} />
						</div>
					</td>
					<td className="text-sm text-black font-light px-6 py-3 border-l-8 border-r-8 border-primaryColor">
						<div className="flex items-center justify-center">
							<Image alt="tooth" src="/packages-page-assets/solid-tooth.svg" width={26} height={30} />
						</div>
					</td>
					<td className="text-sm text-black font-light px-6 py-3 border-r">
						<div className="flex items-center justify-center">
							<Image alt="tooth" src="/packages-page-assets/solid-tooth.svg" width={26} height={30} />
						</div>
					</td>
				</tr>
				<tr className="border-b">
					<td className="px-6 py-4  text-[18px] font-medium text-black border-r ">Facebook stranica - link</td>
					<td className="text-sm text-black font-light px-6 py-3 border-r">
						<div className="flex items-center justify-center">
							<Image alt="tooth" src="/packages-page-assets/solid-tooth.svg" width={26} height={30} />
						</div>
					</td>
					<td className="text-sm text-black font-light px-6 py-3 border-r">
						<div className="flex items-center justify-center">
							<Image alt="tooth" src="/packages-page-assets/solid-tooth.svg" width={26} height={30} />
						</div>
					</td>
					<td className="text-sm text-black font-light px-6 py-3 border-l-8 border-r-8 border-primaryColor">
						<div className="flex items-center justify-center">
							<Image alt="tooth" src="/packages-page-assets/solid-tooth.svg" width={26} height={30} />
						</div>
					</td>
					<td className="text-sm text-black font-light px-6 py-3 border-r">
						<div className="flex items-center justify-center">
							<Image alt="tooth" src="/packages-page-assets/solid-tooth.svg" width={26} height={30} />
						</div>
					</td>
				</tr>
				<tr className="border-b">
					<td className="px-6 py-4  text-[18px] font-medium text-black border-r ">Instagram stranica - link</td>
					<td className="text-sm text-black font-light px-6 py-3 border-r">
						<div className="flex items-center justify-center">
							<Image alt="tooth" src="/packages-page-assets/solid-tooth.svg" width={26} height={30} />
						</div>
					</td>
					<td className="text-sm text-black font-light px-6 py-3 border-r">
						<div className="flex items-center justify-center">
							<Image alt="tooth" src="/packages-page-assets/solid-tooth.svg" width={26} height={30} />
						</div>
					</td>
					<td className="text-sm text-black font-light px-6 py-3 border-l-8 border-r-8 border-primaryColor">
						<div className="flex items-center justify-center">
							<Image alt="tooth" src="/packages-page-assets/solid-tooth.svg" width={26} height={30} />
						</div>
					</td>
					<td className="text-sm text-black font-light px-6 py-3 border-r">
						<div className="flex items-center justify-center">
							<Image alt="tooth" src="/packages-page-assets/solid-tooth.svg" width={26} height={30} />
						</div>
					</td>
				</tr>
				<tr className="border-b">
					<td className="px-6 py-4  text-[18px] font-medium text-black border-r ">TikTok stranica - link</td>
					<td className="text-sm text-black font-light px-6 py-3 border-r">
						<div className="flex items-center justify-center">
							<Image alt="tooth" src="/packages-page-assets/solid-tooth.svg" width={26} height={30} />
						</div>
					</td>
					<td className="text-sm text-black font-light px-6 py-3 border-r">
						<div className="flex items-center justify-center">
							<Image alt="tooth" src="/packages-page-assets/solid-tooth.svg" width={26} height={30} />
						</div>
					</td>
					<td className="text-sm text-black font-light px-6 py-3 border-l-8 border-r-8 border-primaryColor">
						<div className="flex items-center justify-center">
							<Image alt="tooth" src="/packages-page-assets/solid-tooth.svg" width={26} height={30} />
						</div>
					</td>
					<td className="text-sm text-black font-light px-6 py-3 border-r">
						<div className="flex items-center justify-center">
							<Image alt="tooth" src="/packages-page-assets/solid-tooth.svg" width={26} height={30} />
						</div>
					</td>
				</tr>
				<tr className="border-b">
					<td className="px-6 py-4  text-[18px] font-medium text-black border-r ">
						Istaknuto radno {t('main.text-3')}
					</td>
					<td className="text-sm text-black font-light px-6 py-3 border-r">
						<div className="flex items-center justify-center">
							<Image alt="tooth" src="/packages-page-assets/solid-tooth.svg" width={26} height={30} />
						</div>
					</td>
					<td className="text-sm text-black font-light px-6 py-3 border-r">
						<div className="flex items-center justify-center">
							<Image alt="tooth" src="/packages-page-assets/solid-tooth.svg" width={26} height={30} />
						</div>
					</td>
					<td className="text-sm text-black font-light px-6 py-3 border-l-8 border-r-8 border-primaryColor">
						<div className="flex items-center justify-center">
							<Image alt="tooth" src="/packages-page-assets/solid-tooth.svg" width={26} height={30} />
						</div>
					</td>
					<td className="text-sm text-black font-light px-6 py-3 border-r">
						<div className="flex items-center justify-center">
							<Image alt="tooth" src="/packages-page-assets/solid-tooth.svg" width={26} height={30} />
						</div>
					</td>
				</tr>
				<tr className="border-b">
					<td className="px-6 py-4  text-[18px] font-medium text-black border-r ">
						Sponzorisani tekst (broj zavisi od paketa)
					</td>
					<td className="text-[20px] text-primaryColor font-[600] px-6 py-3 border-r">
						<div className="flex items-center justify-center">(4x)</div>
					</td>
					<td className="text-[20px] text-primaryColor font-[600] px-6 py-3 border-r">
						<div className="flex items-center justify-center">(8x)</div>
					</td>
					<td className="text-[20px] text-primaryColor font-[600] px-6 py-3 border-l-8 border-r-8 border-primaryColor">
						<div className="flex items-center justify-center">(12x)</div>
					</td>
					<td className="text-[20px] text-primaryColor font-[600] px-6 py-3 border-r">
						<div className="flex items-center justify-center">(12x)</div>
					</td>
				</tr>
				<tr className="border-b">
					<td className="px-6 py-4  text-[18px] font-medium text-black border-r ">
						<span>Objava na FB i Instagram stranici superdentals.com (broj zavisi od paketa)</span>
					</td>
					<td className="text-[20px] text-primaryColor font-[600] px-6 py-3 border-r">
						<div className="flex items-center justify-center">
							<Image alt="tooth" src="/packages-page-assets/outline-tooth.svg" width={26} height={30} />
						</div>
					</td>
					<td className="text-[20px] text-primaryColor font-[600] px-6 py-3 border-r">
						<div className="flex items-center justify-center">(16)</div>
					</td>
					<td className="text-[20px] text-primaryColor font-[600] px-6 py-3 border-l-8 border-r-8 border-primaryColor">
						<div className="flex items-center justify-center">(24)</div>
					</td>
					<td className="text-[20px] text-primaryColor font-[600] px-6 py-3 border-r">
						<div className="flex items-center justify-center">(24)</div>
					</td>
				</tr>
				<tr className="border-b">
					<td className="px-6 py-4  text-[18px] font-medium text-black border-r ">
						Objava na TikTok stranici superdentals.com (broj zavisi od paketa)
					</td>
					<td className="text-[20px] text-primaryColor font-[600] px-6 py-3 border-r">
						<div className="flex items-center justify-center">
							<Image alt="tooth" src="/packages-page-assets/outline-tooth.svg" width={26} height={30} />
						</div>
					</td>
					<td className="text-[20px] text-primaryColor font-[600] px-6 py-3 border-r">
						<div className="flex items-center justify-center">(16)</div>
					</td>
					<td className="text-[20px] text-primaryColor font-[600] px-6 py-3 border-l-8 border-r-8 border-primaryColor">
						<div className="flex items-center justify-center">(24)</div>
					</td>
					<td className="text-[20px] text-primaryColor font-[600] px-6 py-3 border-r">
						<div className="flex items-center justify-center">(24)</div>
					</td>
				</tr>
				<tr className="border-b">
					<td className="px-6 py-4  text-[18px] font-medium text-black border-r ">
						Udaljenost od aerodroma (broj zavisi od paketa)
					</td>
					<td className="text-[20px] text-primaryColor font-[600] px-6 py-3 border-r">
						<div className="flex items-center justify-center">
							<Image alt="tooth" src="/packages-page-assets/outline-tooth.svg" width={26} height={30} />
						</div>
					</td>
					<td className="text-[20px] text-primaryColor font-[600] px-6 py-3 border-r">
						<div className="flex items-center justify-center">(3)</div>
					</td>
					<td className="text-[20px] text-primaryColor font-[600] px-6 py-3 border-l-8 border-r-8 border-primaryColor">
						<div className="flex items-center justify-center">(6)</div>
					</td>
					<td className="text-[20px] text-primaryColor font-[600] px-6 py-3 border-r">
						<div className="flex items-center justify-center">(6)</div>
					</td>
				</tr>
				<tr className="border-b">
					<td className="px-6 py-4  text-[18px] font-medium text-black border-r ">Dodatni opis usluga</td>
					<td className="text-[20px] text-primaryColor font-[600] px-6 py-3 border-r">
						<div className="flex items-center justify-center">
							<Image alt="tooth" src="/packages-page-assets/outline-tooth.svg" width={26} height={30} />
						</div>
					</td>
					<td className="text-[20px] text-primaryColor font-[600] px-6 py-3 border-r">
						<div className="flex items-center justify-center">
							<Image alt="tooth" src="/packages-page-assets/solid-tooth.svg" width={26} height={30} />
						</div>
					</td>
					<td className="text-[20px] text-primaryColor font-[600] px-6 py-3 border-l-8 border-r-8 border-primaryColor">
						<div className="flex items-center justify-center">
							<Image alt="tooth" src="/packages-page-assets/solid-tooth.svg" width={26} height={30} />
						</div>
					</td>
					<td className="text-[20px] text-primaryColor font-[600] px-6 py-3 border-r">
						<div className="flex items-center justify-center">
							<Image alt="tooth" src="/packages-page-assets/solid-tooth.svg" width={26} height={30} />
						</div>
					</td>
				</tr>
				<tr className="border-b">
					<td className="px-6 py-4  text-[18px] font-medium text-black border-r ">
						Istaknute {t('main.text-2')} usluga
					</td>
					<td className="text-[20px] text-primaryColor font-[600] px-6 py-3 border-r">
						<div className="flex items-center justify-center">
							<Image alt="tooth" src="/packages-page-assets/outline-tooth.svg" width={26} height={30} />
						</div>
					</td>
					<td className="text-[20px] text-primaryColor font-[600] px-6 py-3 border-r">
						<div className="flex items-center justify-center">
							<Image alt="tooth" src="/packages-page-assets/solid-tooth.svg" width={26} height={30} />
						</div>
					</td>
					<td className="text-[20px] text-primaryColor font-[600] px-6 py-3 border-l-8 border-r-8 border-primaryColor">
						<div className="flex items-center justify-center">
							<Image alt="tooth" src="/packages-page-assets/solid-tooth.svg" width={26} height={30} />
						</div>
					</td>
					<td className="text-[20px] text-primaryColor font-[600] px-6 py-3 border-r">
						<div className="flex items-center justify-center">
							<Image alt="tooth" src="/packages-page-assets/solid-tooth.svg" width={26} height={30} />
						</div>
					</td>
				</tr>
				<tr className="border-b">
					<td className="px-6 py-4  text-[18px] font-medium text-black border-r ">
						Jezik koji se koristi u ordinaciji
					</td>
					<td className="text-[20px] text-primaryColor font-[600] px-6 py-3 border-r">
						<div className="flex items-center justify-center">
							<Image alt="tooth" src="/packages-page-assets/outline-tooth.svg" width={26} height={30} />
						</div>
					</td>
					<td className="text-[20px] text-primaryColor font-[600] px-6 py-3 border-r">
						<div className="flex items-center justify-center">
							<Image alt="tooth" src="/packages-page-assets/solid-tooth.svg" width={26} height={30} />
						</div>
					</td>
					<td className="text-[20px] text-primaryColor font-[600] px-6 py-3 border-l-8 border-r-8 border-primaryColor">
						<div className="flex items-center justify-center">
							<Image alt="tooth" src="/packages-page-assets/solid-tooth.svg" width={26} height={30} />
						</div>
					</td>
					<td className="text-[20px] text-primaryColor font-[600] px-6 py-3 border-r">
						<div className="flex items-center justify-center">
							<Image alt="tooth" src="/packages-page-assets/solid-tooth.svg" width={26} height={30} />
						</div>
					</td>
				</tr>
				<tr className="border-b">
					<td className="px-6 py-4  text-[18px] font-medium text-black border-r ">Promo film</td>
					<td className="text-[20px] text-primaryColor font-[600] px-6 py-3 border-r">
						<div className="flex items-center justify-center">
							<Image alt="tooth" src="/packages-page-assets/outline-tooth.svg" width={26} height={30} />
						</div>
					</td>
					<td className="text-[20px] text-primaryColor font-[600] px-6 py-3 border-r">
						<div className="flex items-center justify-center">
							<Image alt="tooth" src="/packages-page-assets/solid-tooth.svg" width={26} height={30} />
						</div>
					</td>
					<td className="text-[20px] text-primaryColor font-[600] px-6 py-3 border-l-8 border-r-8 border-primaryColor">
						<div className="flex items-center justify-center">
							<Image alt="tooth" src="/packages-page-assets/solid-tooth.svg" width={26} height={30} />
						</div>
					</td>
					<td className="text-[20px] text-primaryColor font-[600] px-6 py-3 border-r">
						<div className="flex items-center justify-center">
							<Image alt="tooth" src="/packages-page-assets/solid-tooth.svg" width={26} height={30} />
						</div>
					</td>
				</tr>
				<tr className="border-b">
					<td className="px-6 py-4  text-[18px] font-medium text-black border-r ">15% popusta na dodatne usluge</td>
					<td className="text-[20px] text-primaryColor font-[600] px-6 py-3 border-r">
						<div className="flex items-center justify-center">
							<Image alt="tooth" src="/packages-page-assets/outline-tooth.svg" width={26} height={30} />
						</div>
					</td>
					<td className="text-[20px] text-primaryColor font-[600] px-6 py-3 border-r">
						<div className="flex items-center justify-center">
							<Image alt="tooth" src="/packages-page-assets/outline-tooth.svg" width={26} height={30} />
						</div>
					</td>
					<td className="text-[20px] text-primaryColor font-[600] px-6 py-3 border-l-8 border-r-8 border-primaryColor">
						<div className="flex items-center justify-center">
							<Image alt="tooth" src="/packages-page-assets/solid-tooth.svg" width={26} height={30} />
						</div>
					</td>
					<td className="text-[20px] text-primaryColor font-[600] px-6 py-3 border-r">
						<div className="flex items-center justify-center">
							<Image alt="tooth" src="/packages-page-assets/solid-tooth.svg" width={26} height={30} />
						</div>
					</td>
				</tr>
				<tr className="border-b">
					<td className="px-6 py-4  text-[18px] font-medium text-black border-r ">Dentalni turizam</td>
					<td className="text-[20px] text-primaryColor font-[600] px-6 py-3 border-r">
						<div className="flex items-center justify-center">
							<Image alt="tooth" src="/packages-page-assets/outline-tooth.svg" width={26} height={30} />
						</div>
					</td>
					<td className="text-[20px] text-primaryColor font-[600] px-6 py-3 border-r">
						<div className="flex items-center justify-center">
							<Image alt="tooth" src="/packages-page-assets/outline-tooth.svg" width={26} height={30} />
						</div>
					</td>
					<td className="text-[20px] text-primaryColor font-[600] px-6 py-3 border-l-8 border-r-8 border-primaryColor">
						<div className="flex items-center justify-center">
							<Image alt="tooth" src="/packages-page-assets/solid-tooth.svg" width={26} height={30} />
						</div>
					</td>
					<td className="text-[20px] text-primaryColor font-[600] px-6 py-3 border-r">
						<div className="flex items-center justify-center">
							<Image alt="tooth" src="/packages-page-assets/solid-tooth.svg" width={26} height={30} />
						</div>
					</td>
				</tr>
				<tr className="border-b">
					<td className="px-6 py-4  text-[18px] font-medium text-black border-r ">Preporuka</td>
					<td className="text-[20px] text-primaryColor font-[600] px-6 py-3 border-r">
						<div className="flex items-center justify-center">
							<Image alt="tooth" src="/packages-page-assets/outline-tooth.svg" width={26} height={30} />
						</div>
					</td>
					<td className="text-[20px] text-primaryColor font-[600] px-6 py-3 border-r">
						<div className="flex items-center justify-center">
							<Image alt="tooth" src="/packages-page-assets/outline-tooth.svg" width={26} height={30} />
						</div>
					</td>
					<td className="text-[20px] text-primaryColor font-[600] px-6 py-3 border-l-8 border-r-8 border-primaryColor">
						<div className="flex items-center justify-center">
							<Image alt="tooth" src="/packages-page-assets/solid-tooth.svg" width={26} height={30} />
						</div>
					</td>
					<td className="text-[20px] text-primaryColor font-[600] px-6 py-3 border-r">
						<div className="flex items-center justify-center">
							<Image alt="tooth" src="/packages-page-assets/solid-tooth.svg" width={26} height={30} />
						</div>
					</td>
				</tr>
				<tr className="border-b">
					<td className="px-6 py-4  text-[18px] font-medium text-black border-r ">Osiguranje</td>
					<td className="text-[20px] text-primaryColor font-[600] px-6 py-3 border-r ">
						<div className="flex items-center justify-center">
							<Image alt="tooth" src="/packages-page-assets/outline-tooth.svg" width={26} height={30} />
						</div>
					</td>
					<td className="text-[20px] text-primaryColor font-[600] px-6 py-3 border-r">
						<div className="flex items-center justify-center">
							<Image alt="tooth" src="/packages-page-assets/outline-tooth.svg" width={26} height={30} />
						</div>
					</td>
					<td
						className="text-[20px] text-primaryColor font-[600] px-6 py-3 border-l-8 border-r-8  border-primaryColor"
						style={{ borderBottom: '8px solid #FC5122' }}
					>
						<div className="flex items-center justify-center">
							<Image alt="tooth" src="/packages-page-assets/outline-tooth.svg" width={26} height={30} />
						</div>
					</td>
					<td className="text-[20px] text-primaryColor font-[600] px-6 py-3 border-r">
						<div className="flex items-center justify-center">
							<Image alt="tooth" src="/packages-page-assets/solid-tooth.svg" width={26} height={30} />
						</div>
					</td>
				</tr>
				<tr>
					<td className="px-6 py-4 text-[22px] text-[#21231E] font-[700]">
						<div className="flex flex-col">
							<span>
								{t('main.text-1').toUpperCase()}{' '}
								{selectedCountry === 'ba'
									? '(BAM/godina)*'
									: selectedCountry === 'rs'
									? '(EUR/godina)'
									: selectedCountry === 'cg'
									? '(EUR/godina)'
									: '(EUR/godina)'}
							</span>
							{selectedCountry === 'ba' && <span className="text-[16px] ">*Nije uračunat PDV.</span>}
						</div>
					</td>
					{packages?.map((subPackage) => {
						const filteredPackage = subPackage?.price?.find((price) => price?.country === selectedCountry);
						const filteredDiscount = subPackage?.discount?.find((discount) => discount?.country === selectedCountry);

						if (filteredPackage) {
							return (
								<td key={subPackage?.id} className="text-[20px] text-primaryColor font-[600] px-6 py-3 text-center">
									<div className="flex flex-col">
										<span
											className={`${
												filteredDiscount?.value !== '0' && filteredPackage?.price !== '0'
													? 'text-[20px] font-[700] text-[#21231E] line-through'
													: 'text-[20px] font-[700] text-black'
											}`}
										>
											{filteredPackage?.price === '0' ? (
												<a href="mailto:info@superdentals.com">
													<span className="hover:text-primaryColor">NA UPIT</span>
												</a>
											) : (
												`${filteredPackage?.price} ${filteredPackage?.currency}`
											)}
										</span>
										{filteredDiscount?.value !== '0' && filteredPackage?.price !== '0' && (
											<span className="text-[20px] text-primaryColor font-[700] px-6 py-3 text-center flex gap-1">
												<span>
													{(
														Number(filteredPackage?.price) -
														(Number(filteredPackage?.price) / 100) * Number(filteredDiscount?.value)
													).toFixed(2)}
												</span>

												<span>{filteredPackage?.currency}</span>
											</span>
										)}
									</div>
								</td>
							);
						}
					})}
				</tr>
				<tr>
					<td className="px-6 py-4 text-[22px] text-[#21231E] font-[700]"></td>
					{packages
						?.filter(
							(subPackage) => subPackage?.price?.filter((packagePrice) => packagePrice?.price !== '0')?.length > 0,
						)
						?.map((subPackage) => {
							const filteredPackage = subPackage?.price?.find((price) => price?.country === selectedCountry);
							return (
								<td key={subPackage?.id} className="text-[20px] text-primaryColor font-[700] px-6 py-3 text-center">
									<input
										className="radio border-2 border-[#727272]"
										type="radio"
										id={subPackage?.id}
										name="packages"
										value={subPackage?.id}
										onChange={() => handlePackageChange({ ...subPackage, filteredPrice: filteredPackage })}
									/>
								</td>
							);
						})}
				</tr>
			</tbody>
		</table>
	);
};

export default PackagesTable;
