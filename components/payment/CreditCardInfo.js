import { selectedPackageAtom } from '/store';
import { useAtom } from 'jotai';
import useTranslation from 'next-translate/useTranslation';

const CreditCardInfo = ({ discount, calculatedPercentagePrice, finalPrice, priceOfPDV, finalPriceWithPDV }) => {
	const { t } = useTranslation('payment');
	// States
	const [selectedPackage] = useAtom(selectedPackageAtom);

	const currency = selectedPackage?.filteredPrice?.currency;

	return (
		<div className="w-full flex flex-col gap-1 mb-4">
			<p className="flex justify-between items-center text-[17px] font-[600]">
				<span>{t('main.text-1')}:</span>
				<span className="text-secondary">
					{Number(selectedPackage?.filteredPrice?.price)?.toFixed(2)} {currency}
				</span>
			</p>
			<p className="flex justify-between items-center text-[17px] font-[600]">
				<span>Rabat:</span> <span className="text-secondary">{discount?.toFixed(2)}%</span>
			</p>
			<p className="flex justify-between items-center text-[17px] font-[600]">
				<span>Iznos rabata:</span>{' '}
				<span className="text-secondary">
					{calculatedPercentagePrice} {currency}
				</span>
			</p>
			<p className="flex justify-between items-center text-[17px] font-[600]">
				<span>Iznos sa rabatom:</span>{' '}
				<span className="text-secondary">
					{finalPrice} {currency}
				</span>
			</p>
			<p className="flex justify-between items-center text-[17px] font-[600]">
				<span>PDV:</span> <span className="text-secondary">{currency === 'EUR' ? '0.00' : '17.00'}%</span>
			</p>
			<p className="flex justify-between items-center text-[17px] font-[600]">
				<span>Iznos PDV-a:</span>{' '}
				<span className="text-secondary">
					{priceOfPDV} {currency}
				</span>
			</p>
			<p className="flex justify-between items-center text-[17px] font-[600]">
				<span>{t('main.text-2')} sa PDV-om:</span>{' '}
				<span className="text-secondary">
					{finalPriceWithPDV} {currency}
				</span>
			</p>
		</div>
	);
};

export default CreditCardInfo;
