import { getSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { prisma } from '/utils/db';
import dynamic from 'next/dynamic';
import { selectedPackageAtom } from '/store';
import { useAtom } from 'jotai';
import { Nav, Footer, HeadMeta, CreditCardPayment, CreditCardInfo } from '/components';
import { useEffect, useState } from 'react';
import { BsCreditCard2Front } from 'react-icons/bs';
import { TbFileInvoice } from 'react-icons/tb';
import { PROMO_VALUE, PDV_VALUE } from '/utils/consts';
import Image from 'next/image';
import useTranslation from 'next-translate/useTranslation';

const PDFInvoice = dynamic(() => import('/components/payment/PDFInvoiceContent'), {
	ssr: false,
});

const Payment = ({ user }) => {
	const { t } = useTranslation('payment');

	// States
	const [isActive, setIsActive] = useState(false);
	const [isActivePdf, setIsActivePdf] = useState(false);
	const [pdfAsString, setPdfAsString] = useState('');
	const [emailSent, setEmailSent] = useState('');
	const [isActiveCC, setIsActiveCC] = useState(false);
	const [confirmedCCPayment, setConfirmedCCPayment] = useState(false);
	const [isActivePromo, setIsActivePromo] = useState(true);
	const [isActivePrice, setIsActivePrice] = useState(true);
	const [type, setType] = useState();
	const [status, setStatus] = useState();
	const [subscriberUID, setSubscriberUID] = useState('');
	const [transactionId] = useState(
		`${new Date().getDate()}-${new Date().getMonth() + 1}/${new Date()
			.getFullYear()
			.toString()
			.substring(2)}-${Math.floor(Math.random() * (999 - 100 + 1) + 100)}`,
	);
	const [selectedPackage] = useAtom(selectedPackageAtom);
	const router = useRouter();
	const { subscription, referral, uid, discount } = router.query;
	const {
		register,
		handleSubmit,
		reset,
		watch,
		setError,
		clearErrors,
		formState: { errors },
	} = useForm({
		mode: 'onChange',
		reValidateMode: 'onChange',
	});

	const promoCode = watch('referalCode');
	const selectedCountry = user?.country;

	// Global discount
	const filteredDiscount = selectedPackage?.discount?.find((discount) => discount?.country === selectedCountry);

	const discountGlobal = selectedPackage?.filteredPrice?.price !== '0' ? Number(filteredDiscount?.value) : 0;

	// Promo Code discount
	const promoDiscount = type === 'with' ? PROMO_VALUE : 0;

	// Referral Code discount
	const referralDiscount = Number(referral) || 0;
	let referralCodesArray = [];
	if (referral) {
		for (let index = 0; index < referral / 5; index++) {
			referralCodesArray[index] = user?.referalCode;
		}
	}

	// Discounts Array for Payment Table
	const discounts = [
		discountGlobal > 0 && { type: 'GlobalDiscount', discountValue: discountGlobal, code: null },
		promoDiscount > 0 && { type: 'PromoCode', discountValue: PROMO_VALUE, code: promoCode },
		referral > 0 && { type: 'ReferralCode', discountValue: Number(referral), code: referralCodesArray },
	];

	// Combined discount
	const finalDiscount = Number(discount) || discountGlobal + promoDiscount + referralDiscount;

	// Calculations
	const calculatedPercentagePrice =
		finalDiscount !== 0
			? ((Number(selectedPackage?.filteredPrice?.price) / 100) * finalDiscount)?.toFixed(2)
			: 0?.toFixed(2);

	const finalPrice = (Number(selectedPackage?.filteredPrice?.price) - calculatedPercentagePrice)?.toFixed(2);

	const priceOfPDV = ((finalPrice / 100) * (selectedCountry === 'ba' ? PDV_VALUE : 0)).toFixed(2);

	const finalPriceWithPDV = (Number(finalPrice) + Number(priceOfPDV))?.toFixed(2);

	// Reusable function for creating payment row
	const createPayment = async ({
		transactionId,
		subscriptionId,
		subPackage,
		status,
		paymentMethod,
		userId,
		discounts,
	}) => {
		const paymentResponse = await fetch('/api/payments/create', {
			method: 'POST',
			body: JSON.stringify({
				transactionId: transactionId,
				subscriptionId: subscriptionId,
				amount: finalPrice,
				package: subPackage,
				status: status,
				paymentMethod: paymentMethod,
				userId: userId,
				discounts: discounts,
			}),
			headers: {
				'Content-type': 'application/json',
			},
		});

		return paymentResponse;
	};

	// Submit Subscriber func
	const handleSubmitSubscription = async (data) => {
		if (user?.subscriber && !subscription) {
			router.push('/');
			return;
		}

		if (!selectedPackage) {
			router.push('/packages');
			return;
		}
		data.userId = user.id;
		data.subPackage = selectedPackage;
		data.discountedPrice = finalDiscount > 0 ? finalPrice : 0;
		data.discountPercentage = finalDiscount;

		// If CreditCard selected, create subscriber and payment row
		if (confirmedCCPayment) {
			// Renew, update subscriber and create payment row for that subscriber
			if (subscription && subscription === 'renewal') {
				data.paymentMethod = 'CC';

				const response = await fetch('/api/subscribers/edit', {
					method: 'POST',
					body: JSON.stringify(data),
					headers: {
						'Content-type': 'application/json',
					},
				});

				if (response.status === 200) {
					const { subscriber } = await response.json();

					const paymentResponse = await createPayment({
						transactionId: transactionId,
						subscriptionId: subscriber?.UID,
						subPackage: subscriber?.package?.name,
						status: 'PENDING',
						paymentMethod: 'CC',
						userId: subscriber?.userId,
						discounts: discounts?.filter((discount) => discount),
					});

					if (paymentResponse.status === 201) {
						reset();
						setIsActive(true);
						setSubscriberUID(subscriber?.UID);
					}
				}
				return;
			}

			const response = await fetch('/api/subscribers/create', {
				method: 'POST',
				body: JSON.stringify(data),
				headers: {
					'Content-type': 'application/json',
				},
			});

			if (response.status === 201) {
				const { subscriber } = await response.json();

				const paymentResponse = await createPayment({
					transactionId: transactionId,
					subscriptionId: subscriber?.UID,
					subPackage: subscriber?.package?.name,
					status: 'PENDING',
					paymentMethod: 'CC',
					userId: subscriber?.userId,
					discounts: discounts?.filter((discount) => discount),
				});

				if (paymentResponse.status === 201) {
					reset();
					setIsActive(true);
					setSubscriberUID(subscriber?.UID);
				}
			}
			return;
		}
		// Renew, update subscriber and create payment row for that subscriber
		if (subscription && subscription === 'renewal') {
			data.paymentMethod = 'INVOICE';
			data.decrementReferral = referralDiscount;
			const response = await fetch('/api/subscribers/edit', {
				method: 'POST',
				body: JSON.stringify(data),
				headers: {
					'Content-type': 'application/json',
				},
			});

			if (response.status === 200) {
				const { subscriber } = await response.json();

				const paymentResponse = await createPayment({
					transactionId: transactionId,
					subscriptionId: subscriber?.UID,
					subPackage: subscriber?.package?.name,
					status: 'PENDING',
					paymentMethod: 'INVOICE',
					userId: subscriber?.userId,
					discounts: discounts?.filter((discount) => discount),
				});

				if (paymentResponse.status === 201) {
					reset();
					setIsActive(true);
					router.push('/success');
				}
			}
			return;
		}

		// Create subscriber and payment row for that subscriber
		const response = await fetch('/api/subscribers/create', {
			method: 'POST',
			body: JSON.stringify(data),
			headers: {
				'Content-type': 'application/json',
			},
		});

		if (response.status === 201) {
			const { subscriber } = await response.json();

			const paymentResponse = await createPayment({
				transactionId: transactionId,
				subscriptionId: subscriber?.UID,
				subPackage: subscriber?.package?.name,
				status: 'PENDING',
				paymentMethod: 'INVOICE',
				userId: subscriber?.userId,
				discounts: discounts?.filter((discount) => discount),
			});

			if (paymentResponse.status === 201) {
				reset();
				setIsActive(true);
				router.push('/success');
			}
		}
	};

	const handlePromoCode = async (type) => {
		if (type === 'with') {
			if (!promoCode) {
				setIsActive(false);
				setError('referalCode', { type: 'custom', message: 'Molimo unesite kod za popust.' });
				return;
			}

			if (user?.referalCode === promoCode) {
				setError('referalCode', { type: 'custom', message: 'Ne možete upotrijebiti svoj kod!' });
				return;
			}

			clearErrors('referalCode');

			const response = await fetch('/api/subscribers/checkPromoCode', {
				method: 'POST',
				body: JSON.stringify({ promoCode }),
				headers: {
					'Content-type': 'application/json',
				},
			});

			if (response.status === 200) {
				const { status } = await response.json();
				if (status === 200) {
					setType('with');
					setIsActive(true);
				}
				setStatus(status);
			}
		}

		if (type === 'without') {
			setIsActive(true);
			setType('without');
		}
	};

	const handleCashPayment = () => {
		if (!selectedPackage) {
			router.push('/packages');
			return;
		}
		setIsActivePrice(false);
		setIsActivePdf(true);
		setIsActivePromo(false);
	};

	const handleCreditCardPayment = () => {
		if (!selectedPackage) {
			router.push('/packages');
			return;
		}
		setIsActivePrice(false);
		setIsActiveCC(true);
		setIsActivePromo(false);
	};

	const canceledCCPayment = () => {
		setConfirmedCCPayment(false);
		setIsActivePrice(true);
		setIsActive(true);
		setIsActiveCC(false);
		setIsActivePdf(false);
		setIsActivePromo(true);
	};

	useEffect(() => {
		if (subscription === 'continue') {
			setConfirmedCCPayment(true);
			setIsActivePrice(false);
			setIsActivePromo(false);
		}
	}, [router.isReady, subscription]);

	const sendMail = async () => {
		const response = await fetch('/api/email/invoice', {
			method: 'POST',
			body: JSON.stringify({ invoice: pdfAsString, email: user?.email }),
			headers: {
				'Content-type': 'application/json',
			},
		});

		if (response.status === 200) {
			setEmailSent('Poslali smo Vam email sa predračunom');
			setTimeout(() => {
				setEmailSent('');
			}, 3000);
		}
	};

	return (
		<div>
			<Nav />
			<HeadMeta
				title="Plaćanje"
				link={`${process.env.BASE_URL}/payment`}
				content={'superdentals.com'}
				description="Tražite stomatologa po svojoj mjeri? Na pravom ste mjestu."
				image={`${process.env.BASE_URL}/images/logo.jpg`}
			/>
			<section className="min-h-[calc(100vh-(181px*2))] container mx-auto px-6 md:px-16 py-12">
				<h1 className="text-center text-primaryColor font-[700] text-[20px] md:text-[32px]">Plaćanje</h1>
				{isActivePdf && (
					<div className="">
						<PDFInvoice
							calculatedPercentagePrice={calculatedPercentagePrice}
							finalPrice={finalPrice}
							discount={finalDiscount}
							email={user?.email}
							clinics={user?.clinics}
							transactionId={transactionId}
							setPdfAsString={setPdfAsString}
							currency={selectedPackage?.filteredPrice?.currency}
							downloadPDF={true}
						/>
					</div>
				)}
				{confirmedCCPayment && (
					<div className="flex flex-col items-center justify-center mt-5">
						<div className="w-[80%] md:w-[50%] lg:w-[40%] xl:w-[25%]">
							<CreditCardInfo
								calculatedPercentagePrice={calculatedPercentagePrice}
								finalPrice={finalPrice}
								priceOfPDV={priceOfPDV}
								finalPriceWithPDV={finalPriceWithPDV}
								discount={finalDiscount}
							/>
							<CreditCardPayment
								user={user}
								price={finalPriceWithPDV}
								subscriptionID={uid || subscriberUID}
								decrementReferral={referralDiscount === 0 ? referralDiscount : referralDiscount / 5}
							/>
						</div>
						<div className="flex justify-center items-center">
							<div className="relative h-[85px] sm:h-[110px] w-[300px] sm:w-[400px] mt-5">
								<Image src="/images/monri.png" alt="Monri Payment" layout="fill" objectFit="cover" />
							</div>
						</div>
						<div className="flex justify-between items-center gap-3 my-4">
							<a href="https://www.mastercard.com" target="_blank" rel="noreferrer" className="flex items-center">
								<Image src="/images/mastercard.png" alt="Mastercard" width={70} height={50} />
							</a>
							<a
								href="https://brand.mastercard.com/brandcenter/more-about-our-brands.html"
								target="_blank"
								rel="noreferrer"
								className="flex items-center"
							>
								<Image src="/images/maestro.png" alt="Maestro" width={70} height={50} />
							</a>
							<a href="https://www.visaeurope.com" target="_blank" rel="noreferrer" className="flex items-center">
								<Image src="/images/visa.gif" alt="Visa" width={70} height={50} />
							</a>
							<Image src="/images/mc-id.png" alt="Visa" width={70} height={50} />
							<Image src="/images/visa-secure.jpg" alt="Visa" width={70} height={50} />
						</div>
					</div>
				)}
				<form
					className="flex flex-col items-center gap-3 m-auto mt-10"
					onSubmit={handleSubmit(handleSubmitSubscription)}
				>
					{isActivePrice && (
						<div>
							<div className=" w-[300px] md:w-[450px] flex flex-col border-[4px] border-primaryColor bg-secondary px-6 py-3 rounded-[16px]">
								<div className="flex justify-between items-center">
									<h2 className="text-white font-[600] md:text-[20px]">Izabrani paket:</h2>
									<span className="text-white md:text-[20px] font-[600]">{selectedPackage?.name}</span>
								</div>
								<div className="flex justify-between items-center">
									<h2 className="text-white font-[600] md:text-[20px]">{t('main.text-1')}:</h2>
									<div className="flex gap-1">
										{finalDiscount > 0 && selectedPackage && (
											<span className="md:text-[20px] font-[700] text-[#ff8a42]">
												{finalPrice} {selectedPackage?.filteredPrice?.currency}
											</span>
										)}
										<span
											className={`${
												finalDiscount > 0
													? 'md:text-[20px] font-[600] text-white line-through'
													: 'md:text-[20px] font-[600] text-white'
											}`}
										>
											{selectedPackage !== null &&
												`${Number(selectedPackage?.filteredPrice?.price)} ${selectedPackage?.filteredPrice?.currency}`}
										</span>
									</div>
								</div>
							</div>

							<div className="flex flex-col  w-[300px] md:w-[450px]">
								<label className="text-[20px] text-[#818181] font-[600]">Unesi kod za popust</label>
								<input
									className="clinic-input"
									type="text"
									placeholder="Kod za popust..."
									{...register('referalCode')}
								/>
								{errors?.referalCode && (
									<span className="text-primaryColor font-[500]">{errors?.referalCode?.message}</span>
								)}
							</div>
						</div>
					)}

					{isActivePromo && (
						<div className=" w-[300px] md:w-[450px] flex flex-col gap-6 md:gap-0 md:flex-row md:items-center md:justify-between mb-4 justify-between">
							<div className="flex flex-col">
								<button
									type="button"
									onClick={() => handlePromoCode('with')}
									className="bg-gray-100/50 px-3 py-2 font-[600] border-[3px] rounded-[8px] hover:bg-[#8eb1ff]/10 border-gray-300 hover:border-[#578cff] text-secondary"
								>
									Imam kod za popust
								</button>
								{status === 400 ? (
									<span className="font-[500] text-primaryColor">Kod nije validan</span>
								) : status === 200 ? (
									<span className="font-[500] text-green-500">Uspješno ste aktivirali kod</span>
								) : (
									<span></span>
								)}
							</div>
							<button
								type="button"
								className="bg-gray-100/50 px-3 py-2 font-[600] border-[3px] rounded-[8px] hover:bg-[#8eb1ff]/10 border-gray-300 hover:border-[#578cff] text-secondary md:self-start"
								onClick={() => handlePromoCode('without')}
							>
								Nemam kod za popust
							</button>
						</div>
					)}
					{isActive && !isActivePdf && !isActiveCC && (
						<div>
							<div className="flex flex-col items-center mt-5">
								<h2 className="text-[20px] text-zinc-700 font-[600]">Odaberite način plaćanja</h2>
								<div className="flex flex-col md:flex-row items-center gap-10 mt-5">
									<div
										onClick={handleCashPayment}
										className="flex flex-col items-center justify-center bg-gray-100/50 w-[300px] h-[160px] border-[3px] rounded-[16px] hover:bg-[#8eb1ff]/10 border-gray-300 hover:border-[#578cff] hover:translate-x-1 hover:-translate-y-1 hover:scale-105 transition-all duration-300 cursor-pointer"
									>
										<TbFileInvoice size={70} color="#0D3082" />
										<h3 className="uppercase text-[14px] text-lightBlack font-[500]">Predračun</h3>
									</div>
									<div
										className="flex flex-col justify-center items-center bg-gray-100/50 w-[300px] h-[160px] border-[3px] rounded-[16px] hover:bg-[#8eb1ff]/10  border-gray-300 hover:border-[#578cff] hover:translate-x-1 hover:-translate-y-1 hover:scale-105 transition-all duration-300 cursor-pointer"
										onClick={handleCreditCardPayment}
									>
										<BsCreditCard2Front size={70} color="#0D3082" />
										<h1 className="uppercase text-[14px] text-lightBlack font-[500] cursor-pointer">
											Kartično plaćanje
										</h1>
									</div>
								</div>
							</div>
						</div>
					)}
					{isActivePdf && (
						<div className="flex flex-col justify-center items-center">
							<button
								className="button font-[500] mt-2 py-2 text-[18px] w-full md:w-auto"
								onClick={async () => await sendMail()}
							>
								Završi registraciju
							</button>
							{emailSent !== '' && <p className="mt-2 text-green-500 font-[600]">{emailSent}</p>}

							<p className="text-zinc-600 font-[500]">
								<span className="text-primaryColor">*</span>Kontaktiraćemo vas uskoro.
							</p>
						</div>
					)}
					{isActiveCC && !subscriberUID && (
						<div className="flex flex-col justify-center items-center">
							<CreditCardInfo
								calculatedPercentagePrice={calculatedPercentagePrice}
								finalPrice={finalPrice}
								priceOfPDV={priceOfPDV}
								finalPriceWithPDV={finalPriceWithPDV}
								discount={finalDiscount}
							/>
							<p className="text-[18px] font-[500]">Da li želite da nastavite platiti sa karticom?</p>
							<div className="flex items-center gap-3">
								<button
									className="button bg-secondary font-[500] mt-2 py-2 text-[16px] w-full md:w-auto"
									onClick={() => setConfirmedCCPayment(true)}
								>
									Da
								</button>
								<button
									type="button"
									onClick={canceledCCPayment}
									className="button bg-secondary font-[500] mt-2 py-2 text-[16px] w-full md:w-auto"
								>
									Ne
								</button>
							</div>
						</div>
					)}
				</form>
			</section>
			<Footer />
		</div>
	);
};

export default Payment;

// Must go with getServerSideProps cuz on each request we need to find unique user
export async function getServerSideProps(ctx) {
	const session = await getSession(ctx);

	const user = await prisma.user.findUnique({
		where: {
			id: session.id,
		},
		include: {
			subscriber: true,
			clinics: {
				include: {
					location: true,
				},
			},
		},
	});

	if (!user) {
		return {
			redirect: {
				destination: '/',
				permanent: false,
			},
		};
	}

	const packages = await prisma.subscriptionPackage.findMany();
	return {
		props: {
			packages,
			user,
		},
	};
}
