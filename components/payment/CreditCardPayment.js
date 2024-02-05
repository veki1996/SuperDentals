import { SHA512 } from 'crypto-js';
import { useAtom } from 'jotai';
import { selectedPackageAtom } from '/store';

const CreditCardPayment = ({ price, subscriptionID, decrementReferral }) => {
	// States
	const [selectedPackage] = useAtom(selectedPackageAtom);

	const data = {
		ch_full_name: '',
		ch_address: '',
		ch_city: '',
		ch_zip: '',
		ch_country: '',
		ch_phone: '',
		ch_email: '',
		order_info: 'Plaćanje pretplate',
		order_number: subscriptionID,
		amount: Number(price?.replace('.', '')),
		currency: selectedPackage?.filteredPrice?.currency,
		language: 'en',
		transaction_type: 'purchase',
		authenticity_token: process.env.NEXT_PUBLIC_AUTHENTICITY_TOKEN,
		digest: '',
		custom_params: JSON.stringify({ decrementReferral: decrementReferral }),
	};

	const digest = SHA512(process.env.NEXT_PUBLIC_MONRI_KEY + data.order_number + data.amount + data.currency).toString();

	//add digest to data
	data.digest = digest;

	return (
		<form
			className="flex flex-col items-center gap-3 m-auto mt-10"
			action={process.env.NEXT_PUBLIC_MONRI_REQUEST_URL}
			method="post"
			target="_blank"
		>
			<input type="hidden" name="ch_full_name" value={data.ch_full_name} />
			<input type="hidden" name="ch_address" value={data.ch_address} />
			<input type="hidden" name="ch_city" value={data.ch_city} />
			<input type="hidden" name="ch_zip" value={data.ch_zip} />
			<input type="hidden" name="ch_country" value={data.ch_country} />
			<input type="hidden" name="ch_phone" value={data.ch_phone} />
			<input type="hidden" name="ch_email" value={data.ch_email} />
			<input type="hidden" name="order_info" value={data.order_info} />
			<input type="hidden" name="order_number" value={data.order_number} />
			<input type="hidden" name="amount" value={data.amount} />
			<input type="hidden" name="currency" value={data.currency} />
			<input type="hidden" name="language" value={data.language} />
			<input type="hidden" name="transaction_type" value={data.transaction_type} />
			<input type="hidden" name="authenticity_token" value={data.authenticity_token} />
			<input type="hidden" name="custom_params" value={data.custom_params} />
			<input type="hidden" name="digest" value={digest} />
			<input
				type="submit"
				className="uppercase text-[14px] font-[500] cursor-pointer bg-secondary text-white py-2 px-10 rounded-[8px] shadow-lexicon shadow-secondary"
				value="Plati"
			/>
		</form>
	);
};

export default CreditCardPayment;
