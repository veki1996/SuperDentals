import { useRef, useEffect } from 'react';
import html2pdf from 'html2pdf.js';
import { selectedPackageAtom } from '/store';
import { useAtom } from 'jotai';
import { PDV_VALUE } from '/utils/consts';
import useTranslation from 'next-translate/useTranslation';

const PDFInvoiceContent = ({
	discount,
	calculatedPercentagePrice,
	finalPrice,
	clinics,
	transactionId,
	currency,
	setPdfAsString,
	downloadPDF,
}) => {
	const { t } = useTranslation('payment');
	// States
	const [selectedPackage] = useAtom(selectedPackageAtom);
	const PDF = useRef(null);
	const opt = {
		margin: 0.7,
		filename: 'predračun.pdf',
		image: { type: 'jpeg', quality: 0.98 },
		html2canvas: { dpi: 192, letterRendering: true, width: 1150, windowsWidth: 2200 },
		jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' },
	};

	// Calculations
	const priceOfPDV = ((finalPrice / 100) * (currency === 'EUR' ? 0 : PDV_VALUE)).toFixed(2);

	const finalPriceWithPDV = (Number(finalPrice) + Number(priceOfPDV))?.toFixed(2);

	const exportPDF = () => {
		html2pdf().set(opt).from(PDF.current).save();
	};

	useEffect(() => {
		html2pdf()
			.set(opt)
			.from(PDF.current)
			.toPdf()
			.output('datauristring')
			.then(async (pdfAsString) => {
				setPdfAsString(pdfAsString);
			});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const currentDate = new Date();
	currentDate.setDate(currentDate.getDate() + 7);
	const dateLimit = currentDate.toLocaleDateString('de-DE');

	return (
		<div className="mt-10">
			{selectedPackage && (
				<div className="relative">
					<div className="hidden xl:block">
						<div ref={PDF} className="min-w-[1100px]">
							{/* no-img-element lint disabled only for pdf generation, always use Image from next, html2pdf library doesn't play well with next Image */}
							{/* eslint-disable-next-line @next/next/no-img-element */}

							<div className="flex justify-between w-full">
								<div className="relative w-[300px] h-[120px]">
									<img alt="Publika Consulting" src="/images/publika.png" />
								</div>
								<div className="text-right text-black font-[500] ">
									<p className="font-[600]">PUBLIKA Consulting doo</p>
									<p>Karađorđeva 160, 78000 Banja Luka, BiH</p>
									<p>Tel: +387 65 85 84 85</p>
									<p>Tel/Fax: +387 51 32 09 82</p>
									<p>E-mail: info@publika.ba</p>
									<a href="http://www.publika.ba" className="text-blue-700 underline" target="_black">
										www.publika.ba
									</a>
									<p>PIB: 403712570000</p>
									<p>Žiro račun: 5620998119157544 (NLB Razvojna banka)</p>
								</div>
							</div>
							<div className="text-black font-[500] flex flex-col gap-16">
								<h1 className="text-center text-[24px] pt-12 font-[700]">PREDRAČUN br: {transactionId}</h1>
								<div className="flex gap-16">
									<div className="basis-1/2 flex flex-col gap-3 border border-black p-2">
										<h2>{clinics[0]?.name}</h2>
										<div>
											<p>
												{clinics[0]?.address}
												{clinics[0]?.address && ','} {clinics[0]?.location?.cityName}
											</p>
										</div>
										<p>ID: {clinics[0]?.jib}</p>
									</div>
									<div className="basis-1/2">
										<p>Datum izdavanja: {new Date().toLocaleDateString('de-DE')}</p>
										<p>{t('main.text-3')} izdavanja: Banja Luka</p>
										<p>Valuta plaćanja (rok): {dateLimit}</p>
										<p>Način plaćanja: bezgotovinsko</p>
										<p>Datum isporuke: {new Date().toLocaleDateString('de-DE')}</p>
										<p>
											{t('main.text-3')} isporuke: {clinics[0]?.location?.cityName}
										</p>
									</div>
								</div>
								<div>
									<table className="table">
										<thead className="text-center">
											<tr>
												<td>
													<div className="flex flex-col items-center">
														<span>R.</span>
														<span>br.</span>
													</div>
												</td>
												<td>Opis</td>
												<td>JM</td>
												<td>Kol</td>
												<td>{t('main.text-1')}</td>
												<td className="flex flex-col items-center">
													<div className="flex flex-col items-center">
														<span>Rabat</span>
														<span>%</span>
													</div>
												</td>
												<td>
													<div className="flex flex-col items-center">
														<span>Iznos</span>
														<span>rabata</span>
													</div>
												</td>
												<td>
													<div className="flex flex-col items-center">
														<span>Iznos sa</span>
														<span>rabatom</span>
													</div>
												</td>
												<td>% PDV</td>
												<td>
													<div className="flex flex-col items-center">
														<span>Iznos</span>
														<span>PDV-a</span>
													</div>
												</td>
												<td>
													<div className="flex flex-col items-center">
														<span>{t('main.text-2')}</span>
														<span>sa PDV-om</span>
													</div>
												</td>
											</tr>
										</thead>
										<tbody className="text-right">
											<tr className="border border-black">
												<td className="border-r border-black pr-1">1</td>
												<td className="border-r border-black pr-1 text-left">
													SuperDENTALS baza -{' '}
													{selectedPackage?.name?.toLowerCase().charAt(0).toUpperCase() +
														selectedPackage?.name?.substring(1).toLowerCase()}{' '}
													(12 mjeseci)
												</td>
												<td className="border-r border-black pr-1">kom</td>
												<td className="border-r border-black pr-1">1</td>
												<td className="border-r border-black pr-1">
													{Number(selectedPackage?.filteredPrice?.price)?.toFixed(2)}
												</td>
												<td className="border-r border-black pr-1">{discount?.toFixed(2)}</td>
												<td className="border-r border-black pr-1">{calculatedPercentagePrice}</td>
												<td className="border-r border-black pr-1">{finalPrice}</td>
												<td className="border-r border-black pr-1">{currency === 'EUR' ? '0.00' : '17.00'}</td>
												<td className="border-r border-black pr-1">{priceOfPDV}</td>
												<td className="pr-1">{finalPriceWithPDV}</td>
											</tr>
											<tr>
												<td></td>
												<td></td>
												<td></td>
												<td></td>
												<td></td>
												<td className="text-right p-0" colSpan={5}>
													Ukupna {t('main.text-2').toLowerCase()} ({currency}):
												</td>
												<td className="text-right p-0 font-[700]">
													{Number(selectedPackage?.filteredPrice?.price)?.toFixed(2)}
												</td>
											</tr>
											<tr>
												<td></td>
												<td></td>
												<td></td>
												<td></td>
												<td></td>
												<td className="text-right p-0" colSpan={5}>
													Odobreni rabat ({currency}):
												</td>
												<td className="text-right p-0 font-[700]">{calculatedPercentagePrice}</td>
											</tr>
											<tr>
												<td></td>
												<td></td>
												<td></td>
												<td></td>
												<td></td>
												<td className="text-right p-0" colSpan={5}>
													Ukupna {t('main.text-2').toLowerCase()} sa rabatom bez PDV-a ({currency}):
												</td>
												<td className="text-right p-0 font-[700]">{finalPrice}</td>
											</tr>
											<tr>
												<td></td>
												<td></td>
												<td></td>
												<td></td>
												<td></td>
												<td className="text-right p-0" colSpan={5}>
													PDV ({currency}):
												</td>
												<td className="text-right p-0 font-[700]">{priceOfPDV}</td>
											</tr>
											<tr>
												<td></td>
												<td></td>
												<td></td>
												<td></td>
												<td></td>
												<td className="text-right p-0" colSpan={5}>
													Ukupna {t('main.text-2').toLowerCase()} sa PDV-om ({currency}):
												</td>
												<td className="text-right p-0 font-[700]">{finalPriceWithPDV}</td>
											</tr>
										</tbody>
									</table>
								</div>
								{currency === 'EUR' ? (
									<div className="flex flex-col gap-4">
										<p className="pt-10">Plaćanje treba da se izvrši prema sledećim uputstvima:</p>
										<div className="flex flex-col ml-5">
											<div>
												<h3 className="font-bold">Polje 59: Korisnik (Beneficiary customer):</h3>
												<div className="flex gap-4">
													<p>IBAN:</p>
													<div className="flex flex-col">
														<p>BA395620998119157738</p>
														<p>PUBLIKA CONSULTING DOO BANJA LUKA</p>
														<p>KARAĐORĐEVA 160</p>
														<p>78000 BANJA LUKA</p>
													</div>
												</div>
											</div>
										</div>
										<div className="flex flex-col ml-5">
											<h3 className="font-bold">Polje 57: Račun kod institucije (Account with institution):</h3>
											<p>SWIFT BIC: RAZBBA22</p>
											<p>NLB Banka a.d.</p>
											<p>Milana Tepića br. 4, 78000 Banja Luka</p>
											<p>Bosnia and Herzegovina</p>
										</div>
										<div className="flex flex-col ml-5">
											<h3>
												<span className="font-bold">Naknade za plaćanje/transakcioni troškovi: OUR-NALOGODAVAC </span>
												(Nalogodavac (pošiljalac uplate) snosi sve naknade transakcije)
											</h3>
										</div>
										<div className="flex flex-col ml-5">
											<p>DODATNE INFORMACIJE</p>
											<h3 className="font-bold">Polje 56: Posrednička institucija (Intermediary institution):</h3>
											<p>Za sledeće valute: EUR, USD, AUD, CAD, CHF, DKK, GBP, HRK, HUF, JPY, NOK, SEK</p>
											<p>SWIFT BIC: LJBASI2X</p>
											<p>NOVA LJUBLJANSKA BANKA D.D.</p>
											<p>LJUBLJANA</p>
											<p>SLOVENIA</p>
										</div>
									</div>
								) : (
									<p className="py-10">Uplatu možete izvršiti na račun: 5620998119157544 (NLB Razvojna banka)</p>
								)}

								<p className="text-right pb-5 text-[14px]">
									Ovaj dokument je izrađen na računaru i validan je bez potpisa i pečata. Datum i {t('main.text-4')}{' '}
									izrade računa: {new Date().toLocaleString('de-DE')?.replace(',', ' /')}
								</p>
							</div>
						</div>
					</div>
					{downloadPDF && (
						<div className="w-full flex flex-col items-center justify-center mt-10">
							<button
								className={`px-6 py-2 font-[600] border-[3px] rounded-[8px] hover:bg-[#FCE77D]/10 hover:text-black flex  border-gray-300 xl:hidden`}
								onClick={() => exportPDF()}
							>
								Preuzmi PDF
							</button>
						</div>
					)}
				</div>
			)}
		</div>
	);
};

export default PDFInvoiceContent;
