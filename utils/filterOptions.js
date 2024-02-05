import Image from 'next/image';
import { BsStarHalf, BsStar, BsStarFill } from 'react-icons/bs';

export const countryOptions = [
	{ value: 'ba', label: 'Bosna i Hercegovina' },
	{ value: 'rs', label: 'Srbija' },
	{ value: 'cg', label: 'Crna Gora' },
];

export const languageOptions = [
	{
		value: 'srb',
		label: 'RS',
		icon: (
			<div className="relative w-[20px] h-[20px]">
				<Image alt="Serbia" src="/country-flags/srb.svg" layout="fill" />
			</div>
		),
	},
	{
		value: 'cro',
		label: 'HR',
		icon: (
			<div className="relative w-[20px] h-[20px]">
				<Image alt="Croatia" src="/country-flags/cro.svg" layout="fill" />
			</div>
		),
	},
	{
		value: 'bih',
		label: 'BA',
		icon: (
			<div className="relative w-[20px] h-[20px]">
				<Image alt="Bosnia" src="/country-flags/bih.svg" layout="fill" />
			</div>
		),
	},
	{
		value: 'slo',
		label: 'SI',
		icon: (
			<div className="relative w-[20px] h-[20px]">
				<Image alt="Slovenia" src="/country-flags/slo.svg" layout="fill" />
			</div>
		),
	},
	{
		value: 'mne',
		label: 'ME',
		icon: (
			<div className="relative w-[20px] h-[20px]">
				<Image alt="Montenegro" src="/country-flags/mne.svg" layout="fill" />
			</div>
		),
	},
	{
		value: 'uk',
		label: 'GB',
		icon: (
			<div className="relative w-[20px] h-[20px]">
				<Image alt="UK" src="/country-flags/uk.svg" layout="fill" />
			</div>
		),
	},
	{
		value: 'it',
		label: 'IT',
		icon: (
			<div className="relative w-[20px] h-[20px]">
				<Image alt="Italia" src="/country-flags/it.svg" layout="fill" />
			</div>
		),
	},
	{
		value: 'de',
		label: 'DE',
		icon: (
			<div className="relative w-[20px] h-[20px]">
				<Image alt="Germany" src="/country-flags/de.svg" layout="fill" />
			</div>
		),
	},
];

export const distanceOptions = [
	{ value: '10,50', label: '10-50km' },
	{ value: '50,100', label: '50-100km' },
	{ value: '100,200', label: '100-200km' },
	{ value: '200', label: '200+' },
];

export const ratingOptions = [
	{
		value: '4,5',
		label: '4-5',
		icon: (
			<div className="flex gap-1">
				<BsStarFill color="#FFBF00" size={16} /> <BsStarFill color="#FFBF00" size={16} />
				<BsStarFill color="#FFBF00" size={16} /> <BsStarFill color="#FFBF00" size={16} />
				<BsStarHalf color="#FFBF00" size={16} />
			</div>
		),
	},
	{
		value: '3,3.9',
		label: '3-4',
		icon: (
			<div className="flex gap-1">
				<BsStarFill color="#FFBF00" size={16} /> <BsStarFill color="#FFBF00" size={16} />
				<BsStarFill color="#FFBF00" size={16} /> <BsStarHalf color="#FFBF00" size={16} />
				<BsStar color="#FFBF00" size={16} />
			</div>
		),
	},
	{
		value: '2,2.9',
		label: '2-3',
		icon: (
			<div className="flex gap-1">
				<BsStarFill color="#FFBF00" size={16} /> <BsStarFill color="#FFBF00" size={16} />{' '}
				<BsStarHalf color="#FFBF00" size={16} /> <BsStar color="#FFBF00" size={16} />{' '}
				<BsStar color="#FFBF00" size={16} />
			</div>
		),
	},
	{
		value: '1,1.9',
		label: '1-2',
		icon: (
			<div className="flex gap-1">
				<BsStarFill color="#FFBF00" size={16} /> <BsStarHalf color="#FFBF00" size={16} />{' '}
				<BsStar color="#FFBF00" size={16} /> <BsStar color="#FFBF00" size={16} /> <BsStar color="#FFBF00" size={16} />
			</div>
		),
	},
];
