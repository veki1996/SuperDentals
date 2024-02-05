import { useRouter } from 'next/router';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { FiChevronDown } from 'react-icons/fi';

const LanguageDropdown = () => {
	const router = useRouter();
	const { locale } = router;
	const [isActive, setIsActive] = useState(false);
	const [selected, setSelected] = useState({
		id: 1,
		text: locale.toUpperCase(),
		image: `/country-flags/${
			locale === 'ba'
				? 'bih'
				: locale === 'hr'
				? 'cro'
				: locale === 'rs'
				? 'srb'
				: locale === 'de'
				? 'de'
				: locale === 'it'
				? 'it'
				: locale === 'gb'
				? 'uk'
				: locale === 'si'
				? 'slo'
				: 'mne'
		}.svg`,
	});

	const languages = router.locales?.map((locale, i) => {
		return {
			id: i + 1,
			text: locale?.toUpperCase(),
			image:
				locale === 'ba'
					? '/country-flags/bih.svg'
					: locale === 'hr'
					? '/country-flags/cro.svg'
					: locale === 'rs'
					? '/country-flags/srb.svg'
					: locale === 'de'
					? '/country-flags/de.svg'
					: locale === 'gb'
					? '/country-flags/uk.svg'
					: locale === 'si'
					? '/country-flags/slo.svg'
					: locale === 'it'
					? '/country-flags/it.svg'
					: '/country-flags/mne.svg',
		};
	});

	const deutschIndex = languages.findIndex((language) => language.text === 'DE');

	if (deutschIndex > -1) {
		const deutsch = languages.splice(deutschIndex, 1)[0];
		languages.splice(5, 0, deutsch);
	}

	const handleClick = (option) => {
		localStorage?.setItem('selectedLanguage', option?.text?.toLowerCase());
		setSelected(option);
		setIsActive(false);
	};

	useEffect(() => {
		setSelected({
			id: 1,
			text: locale.toUpperCase(),
			image: `/country-flags/${
				locale === 'ba'
					? 'bih'
					: locale === 'hr'
					? 'cro'
					: locale === 'rs'
					? 'srb'
					: locale === 'de'
					? 'de'
					: locale === 'gb'
					? 'uk'
					: locale === 'si'
					? 'slo'
					: locale === 'it'
					? 'it'
					: 'mne'
			}.svg`,
		});
	}, [locale]);

	useEffect(() => {
		localStorage.setItem('selectedLanguage', locale);
	}, [locale]);

	useEffect(() => {
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [selected]);

	useEffect(() => {
		const getIpAddress = async () => {
			const manualLocale = localStorage.getItem('selectedLanguage');
			if (manualLocale) {
				router.push(router.asPath, undefined, { locale: manualLocale, shallow: true });
				return;
			}
			const response = await fetch('/api/user/getIp');

			if (response.status === 200) {
				const { ip } = await response.json();

				const responseApi = await fetch(`/api/user/getUsersLocale?ip=${ip}`);

				if (responseApi.status === 200) {
					const { country } = await responseApi.json();
					await handleLocale(country);
				} else {
					router.push(router.asPath, undefined, { locale: 'gb', shallow: false });
				}
			}
		};

		const handleLocale = async (country) => {
			if (country && router.locales.find((locale) => locale === country?.toLowerCase())) {
				router.push(router.asPath, undefined, { locale: country?.toLowerCase(), shallow: false });
			} else {
				router.push(router.asPath, undefined, { locale: 'gb', shallow: false });
			}
		};

		getIpAddress();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<div className="absolute  rounded-[6px]">
			<div onClick={() => setIsActive(!isActive)}>
				<div className="flex justify-center">
					{selected && (
						<div className="flex items-center gap-1 cursor-pointer">
							<div className="relative w-[24px] h-[16px]">
								<Image alt="bih" layout="fill" objectFit="cover" src={selected.image} />
							</div>
							<span>{selected.text}</span>
							<FiChevronDown size={25} color="#727272" />
						</div>
					)}
				</div>
			</div>

			{isActive && (
				<div className="bg-white mt-2 p-3 shadow-container rounded-[6px]">
					{languages
						.filter((option) => option.text !== selected.text)
						.map((option) => (
							<Link href={router.asPath} locale={option.text.toLowerCase()} key={option.id}>
								<div className="text-[16px] flex py-2 cursor-pointer" onClick={() => handleClick(option)}>
									<div className="flex items-center gap-2">
										<div className="relative w-[24px] h-[16px]">
											<Image alt="srb" layout="fill" objectFit="cover" src={option.image} />
										</div>
										<span>{option.text}</span>
									</div>
								</div>
							</Link>
						))}
				</div>
			)}
		</div>
	);
};

export default LanguageDropdown;
