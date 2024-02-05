import { getSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { Nav, Footer, HeadMeta } from '/components';
import dynamic from 'next/dynamic';
import { useAtom } from 'jotai';
import { selectedPackageAtom } from '/store';
import { prisma } from '/utils/db';
import { useRouter } from 'next/router';
import useTranslation from 'next-translate/useTranslation';

const PDFInvoice = dynamic(() => import('/components/payment/PDFInvoiceContent'), {
	ssr: false,
});

const Billing = ({ user, promoCount, pendingPayment }) => {
	const { t } = useTranslation('billing');

	const router = useRouter();
	const [showInvoice, setShowInvoice] = useState(false);
	const [alignment] = useState('center');
	const [, setSelectedPackage] = useAtom(selectedPackageAtom);

	const country = user?.country;

	// Continue CC Payment
	const CCDiscount =
		JSON.parse(pendingPayment?.discounts)?.length > 0 &&
		JSON.parse(pendingPayment?.discounts)?.reduce((a, b) => {
			return a + b?.discountValue;
		}, 0);

	const subPackage = user?.subscriber?.package;

	const filteredPackagePrice = subPackage?.price?.find((price) => price?.country === country);

	const filteredPackage = { ...subPackage, filteredPrice: filteredPackagePrice };

	const subscriptionExpireDate = user?.subscriber?.validToDate;

	const discount = user?.subscriber?.discountPercentage;

	const notActiveRefferalCount = promoCount?.filter((subscriber) => !subscriber?.approved).length;

	const usedReferralCount = user?.usedReferralCount - notActiveRefferalCount;

	const finalReferralDiscount = usedReferralCount > 20 ? 100 : usedReferralCount * 5;
	// Calculations
	const calculatedPercentagePrice =
		discount !== 0 ? ((Number(filteredPackage?.filteredPrice?.price) / 100) * discount)?.toFixed(2) : 0?.toFixed(2);

	// Functions
	const handleExpirationDate = () => {
		const now = new Date().getTime();
		const expirationDateInMs = new Date(subscriptionExpireDate).getTime();
		const differenceInMs = expirationDateInMs - now;
		const differenceInDays = Math.round(differenceInMs / (1000 * 3600 * 24));
		return differenceInDays;
	};

	useEffect(() => {
		setSelectedPackage(filteredPackage);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [setSelectedPackage]);

	return (
		<div>
			<Nav />
			<HeadMeta
				title="Finansije"
				link={`${process.env.BASE_URL}/settings/billing`}
				content={'superdentals.com'}
				description="Tražite stomatologa po svojoj mjeri? Na pravom ste mjestu."
				image={`${process.env.BASE_URL}/images/logo.jpg`}
			/>
			<section className="min-h-[calc(100vh-(181px*2))] container mx-auto px-6 md:px-16 py-12">
				<div>
					<h1 className="text-[24px] md:text-[30px] font-[500] border-b border-gray-300">Finansije</h1>
				</div>
				<div className="flex flex-col gap-2 mt-2">
					<h2 className="text-[20px] font-[500]">Informacije o trenutnom paketu pretplate</h2>
					{user?.subscriber?.approved ? (
						<div className="flex flex-col gap-1 border border-gray-300 p-4 max-w-fit font-[500]">
							<p>Trenutni paket pretplate: {subPackage?.name}</p>
							<p>
								{t('main.text-1')} trenutnog paketa: {Number(filteredPackage?.filteredPrice?.price)?.toFixed(2)}{' '}
								{filteredPackage?.filteredPrice?.currency}
							</p>
							{user?.subscriber?.discountedPackagePrice !== 'No Discount' && (
								<p>
									{t('main.text-1')} trenutnog paketa sa popustom: {user?.subscriber?.discountedPackagePrice}{' '}
									{filteredPackage?.filteredPrice?.currency}
								</p>
							)}
							{subscriptionExpireDate && (
								<p>
									Datum isteka paketa:{' '}
									{new Date(
										subscriptionExpireDate?.split('-')[0],
										subscriptionExpireDate?.split('-')[1] - 1,
										subscriptionExpireDate?.split('-')[2],
									).toLocaleDateString('de-DE')}
								</p>
							)}

							<p>
								Vaš kod za preporuku je iskorišten {usedReferralCount} {usedReferralCount === 1 ? 'put' : 'puta'}
							</p>

							<p> U narednom obračunskom periodu vaša pretplata će biti umanjena za {finalReferralDiscount}%</p>

							{subscriptionExpireDate && handleExpirationDate() <= 14 && (
								<button
									onClick={() => router.push(`/packages?subscription=renewal&referral=${finalReferralDiscount}`)}
									className="button w-full sm:w-1/2 md:w-[60%] py-2 text-[16px]"
								>
									Obnovite pretplatu
								</button>
							)}
						</div>
					) : (
						<div className="flex flex-col gap-2 items-start">
							<p className="font-[500]">Sačekajte odobrenje administratora</p>
							{pendingPayment && pendingPayment?.status === 'PENDING' && pendingPayment?.paymentMethod === 'CC' && (
								<button
									onClick={() =>
										router.push(
											`/payment?subscription=continue${pendingPayment ? `&uid=${pendingPayment?.subscriptionId}` : ''}${
												CCDiscount ? `&discount=${CCDiscount}` : ''
											}`,
										)
									}
									className="button py-2 text-[16px]"
								>
									Nastavi sa plaćanjem
								</button>
							)}
						</div>
					)}
				</div>

				<div>
					{pendingPayment && pendingPayment?.status === 'PENDING' && pendingPayment?.paymentMethod === 'CC' ? (
						<></>
					) : (
						<>
							<button className="button py-2 font-[500] mt-4" onClick={() => setShowInvoice(!showInvoice)}>
								{!showInvoice ? 'Prikaži predračun' : 'Sakrij predračun'}
							</button>
							{showInvoice && (
								<PDFInvoice
									discount={discount}
									calculatedPercentagePrice={calculatedPercentagePrice}
									finalPrice={
										user?.subscriber?.discountedPackagePrice === 'No Discount'
											? Number(filteredPackage?.filteredPrice?.price)?.toFixed(2)
											: user?.subscriber?.discountedPackagePrice
									}
									email={user?.email}
									clinics={user?.clinics}
									currency={filteredPackage?.filteredPrice?.currency}
									transactionId={pendingPayment?.transactionId}
									alignment={alignment}
									downloadPDF={true}
								/>
							)}
						</>
					)}
				</div>
			</section>
			<Footer />
		</div>
	);
};

export default Billing;

export async function getServerSideProps(ctx) {
	const session = await getSession(ctx);
	const { locale } = ctx;

	const user = await prisma.user.findUnique({
		where: {
			id: session.id,
		},
		include: {
			subscriber: {
				include: {
					package: true,
				},
			},
			clinics: {
				include: {
					location: true,
				},
			},
		},
	});

	if (!user?.subscriber) {
		return {
			redirect: {
				destination: `/${locale}/packages`,
				permanent: false,
			},
		};
	}

	const promoCount = await prisma.subscriber.findMany({
		where: {
			referalCode: {
				equals: user?.referalCode,
			},
		},
	});

	const pendingPayment = await prisma.payment.findUnique({
		where: {
			subscriptionId: user?.subscriber?.UID,
		},
	});

	return {
		props: {
			user,
			promoCount,
			pendingPayment,
		},
	};
}
