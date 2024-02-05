import { useRouter } from 'next/router';
import { Nav, Footer, HeadMeta } from '/components';
import { BsLinkedin, BsFacebook, BsInstagram } from 'react-icons/bs';
import { useAtom } from 'jotai';
import { socialLinksAtom } from '/store';
import { useEffect, useState } from 'react';
import useTranslation from 'next-translate/useTranslation';

const Success = () => {
	const { t } = useTranslation('success');

	const router = useRouter();
	const { response_code, order_number, currency, cc_type, decrementReferral } = router.query;
	const [socialSettings] = useAtom(socialLinksAtom);
	const [showModal, setShowModal] = useState(false);
	const [payment, setPayment] = useState(null);

	const facebook = socialSettings?.find((setting) => setting?.name === 'Social Facebook');
	const instagram = socialSettings?.find((setting) => setting?.name === 'Social Instagram');
	const linkedin = socialSettings?.find((setting) => setting?.name === 'Social Linkedin');

	const handleCCPayment = async () => {
		if (!response_code && !order_number) return;

		if (response_code !== '0000') {
			router.push('/settings/billing');
			return;
		}

		await fetch('/api/payments/edit', {
			method: 'POST',
			body: JSON.stringify({ subscriptionID: order_number, responseCode: response_code }),
			headers: {
				'Content-type': 'application/json',
			},
		});

		if (response_code === '0000') {
			const response = await fetch('/api/subscribers/successPayment', {
				method: 'POST',
				body: JSON.stringify({ subscriptionID: order_number, decrementReferral: Number(decrementReferral) }),
				headers: {
					'Content-type': 'application/json',
				},
			});

			const { payment } = await response.json();
			setPayment(payment);
			setShowModal(true);
		}
	};

	useEffect(() => {
		handleCCPayment();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [router.isReady]);

	return (
		<div>
			<Nav />
			<HeadMeta
				title="Ordinacija kreirana"
				link={`${process.env.BASE_URL}/payment`}
				content={'superdentals.com'}
				description="Tražite stomatologa po svojoj mjeri? Na pravom ste mjestu."
				image={`${process.env.BASE_URL}/images/logo.jpg`}
			/>
			<section className="min-h-[calc(100vh-(181px*2))] container mx-auto px-6 md:px-16 py-6 lg:py-12 flex flex-col items-center">
				<h1 className="text-center text-black font-[700] text-[20px] md:text-[30px]">
					Zahvaljujemo Vam se na {t('main.text-3')}, te Vas pozivamo da označite sa{' '}
					<span className="text-primaryColor">&quot;Sviđa mi se&quot;</span> naše stranice na društvenim mrežama:
				</h1>
				{socialSettings?.length > 0 && (
					<div className="flex flex-col md:flex-row items-center gap-6 mt-2">
						{facebook && facebook?.defaultValue && (
							<a
								className="flex items-center justify-between gap-2 w-full"
								href={facebook?.defaultValue}
								target="_blank"
								rel="noreferrer"
							>
								<BsFacebook size={30} color="#0D3082" />
								<p className="text-[20px] font-[600]">Facebook</p>
							</a>
						)}
						{instagram && instagram?.defaultValue && (
							<a
								className="flex items-center justify-between gap-2 w-full"
								href={instagram?.defaultValue}
								target="_blank"
								rel="noreferrer"
							>
								<BsInstagram size={30} color="#0D3082" />

								<p className="text-[20px] font-[600]">Instagram</p>
							</a>
						)}
						{linkedin && linkedin?.defaultValue && (
							<a
								className="flex items-center justify-between gap-2 w-full"
								href={linkedin?.defaultValue}
								target="_blank"
								rel="noreferrer"
							>
								<BsLinkedin size={30} color="#0D3082" />
								<p className="text-[20px] font-[600]">LinkedIn</p>
							</a>
						)}
					</div>
				)}

				<button className="button font-[500] mt-10 py-2" onClick={() => router.push('/')}>
					Idi na naslovnu
				</button>

				{showModal ? (
					<>
						<div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-[10000] outline-none focus:outline-none">
							<div className="relative w-auto my-6 mx-auto max-w-3xl">
								{/*content*/}
								<div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
									{/*header*/}
									<div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
										<h3 className="text-3xl font-semibold">Detalji transakcije</h3>
										<button
											className="p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
											onClick={() => setShowModal(false)}
										>
											<span className="bg-transparent text-black opacity-5 h-6 w-6 text-2xl block outline-none focus:outline-none">
												×
											</span>
										</button>
									</div>
									<div className="relative p-6 flex-auto">
										<div className="flex justify-between">
											<p className="font-bold">Broj narudžbine: </p>
											<p>#{order_number}</p>
										</div>
										<div className="flex justify-between">
											<p className="font-bold">Datum: </p>
											<p>{new Date().toLocaleDateString('de-DE')}</p>
										</div>
										<div className="flex justify-between">
											<p className="font-bold">Paket: </p>
											<p>{payment?.package}</p>
										</div>
										<div className="flex justify-between">
											<p className="font-bold">{t('main.text-1')}(bez PDV-a): </p>
											<p>
												{payment?.amount} {currency}
											</p>
										</div>
										<div className="flex justify-between">
											<p className="font-bold">Tip kartice: </p>
											<p>{cc_type.toUpperCase()}</p>
										</div>
										<div className="flex justify-between">
											<p className="font-bold">Status: </p>
											<p>{t('main.text-2')} transakcija</p>
										</div>
									</div>
									<div className="flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b">
										<button
											className="text-primary background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
											type="button"
											onClick={() => setShowModal(false)}
										>
											Zatvori
										</button>
									</div>
								</div>
							</div>
						</div>
						<div className="opacity-25 fixed inset-0 z-50 bg-black"></div>
					</>
				) : null}
			</section>
			<Footer />
		</div>
	);
};

export default Success;
