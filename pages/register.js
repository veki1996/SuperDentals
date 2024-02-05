import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/router';

import {
	isValidEmail,
	checkUppercase,
	checkLowerCase,
	hasNumber,
	containsSpecialChars,
	atLeastEightChars,
} from '/utils';
import { signIn } from 'next-auth/react';
import { Nav, Footer, HeadMeta } from '/components';
import { ErrorMessage } from '@hookform/error-message';
import Dropdown from '../components/Dropdown';
import Link from 'next/link';
import { selectedCountryAtom } from '/store';
import Image from 'next/image';
import { useAtom } from 'jotai';

const projects = [
	{ id: 1, photo: '/country-flags/bih.svg', text: '+387', code: 'ba' },
	{
		id: 2,
		photo: '/country-flags/srb.svg',
		text: '+381',
		code: 'rs',
	},
	{
		id: 3,
		photo: '/country-flags/mne.svg',
		text: '+382',
		code: 'cg',
	},
	{
		id: 4,
		photo: '/country-flags/cro.svg',
		text: '+385',
		code: 'hr',
	},
	{
		id: 5,
		photo: '/country-flags/uk.svg',
		text: '+44',
		code: 'gb',
	},
	{
		id: 6,
		photo: '/country-flags/it.svg',
		text: '+39',
		code: 'it',
	},
	{
		id: 7,
		photo: '/country-flags/de.svg',
		text: '+49',
		code: 'de',
	},
	{
		id: 8,
		photo: '/country-flags/slo.svg',
		text: '+420',
		code: 'si',
	},
];

const Register = () => {
	const [error, setErorr] = useState('');
	const [email, setEmail] = useState('');
	const [terms, setTerms] = useState(false);
	const [status, setStatus] = useState();
	const [selected, setSelected] = useState({ id: 1, photo: '/country-flags/bih.svg', text: '+387' });

	const router = useRouter();
	const { pathname, query, asPath } = router;

	const [selectedCountry, setSelectedCountry] = useAtom(selectedCountryAtom);

	const {
		register,
		handleSubmit,
		watch,
		setError,
		clearErrors,
		formState: { errors },
	} = useForm({
		defaultValues: {},
		mode: 'onChange',
		reValidateMode: 'onChange',
	});

	const handleEmailValidation = (email) => {
		const isValid = isValidEmail(email);
		return isValid;
	};

	//function that send verifying email after succeessfull registration
	const sendEmail = async (data) => {
		await fetch('/api/email/verify', {
			method: 'POST',
			body: JSON.stringify(data),
			headers: {
				'Content-type': 'application/json',
			},
		});
	};

	const registerUser = async (data) => {
		data.phone = selected.text + data.phone;
		data.country = selectedCountry;
		if (errors.unregisteredEmail) return;
		const response = await fetch('/api/auth/register', {
			method: 'POST',
			body: JSON.stringify(data),
			headers: {
				'Content-type': 'application/json',
			},
		});

		if (response.status === 200) {
			const resdata = await response.json();

			let data = {
				email: resdata.email,
				hash: resdata.hash,
			};

			sendEmail(data);
			let email = resdata.email;
			let password = resdata.password;

			await signIn('credentials', {
				email,
				password,
				redirect: false,
				callbackUrl: '/',
			});
			router.push('/verify');
		} else {
			setErorr('Greška.... EMAIL: ' + data.email + ' već postoji!');
		}
	};

	const handleEmailChange = async (e) => {
		const email = e.target.value;
		const response = await fetch(`/api/email/${email || 'email'}`);
		if (response.status === 200) {
			const resData = await response.json();
			setStatus(resData.status);
			setEmail(e.target.value);
			setError('unregisteredEmail', {
				type: 'onChange',
				message: resData.message,
			});
		}
	};
	const handleClick = () => {
		if (status === 200) {
			clearErrors('unregisteredEmail');
		}
	};

	// Handling locale and first select country
	const handleCountryClick = (e) => {
		setSelectedCountry(e.target.id);
		localStorage.setItem('selectedLanguage', e?.target?.id === 'cg' ? 'me' : e?.target?.id);
	};

	const handleLocale = () => {
		router.push({ pathname, query }, asPath, { locale: selectedCountry === 'cg' ? 'me' : selectedCountry });
	};

	useEffect(() => {
		if (!selectedCountry) return;
		handleLocale();
		setSelected(projects.find((project) => project.code === selectedCountry));
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [selectedCountry]);

	return (
		<div>
			<Nav />
			<HeadMeta
				title="Registracija"
				link={`${process.env.BASE_URL}/register`}
				content={'superdentals.com'}
				description="Tražite stomatologa po svojoj mjeri? Na pravom ste mjestu."
				image={`${process.env.BASE_URL}/images/logo.jpg`}
			/>
			<section className="min-h-[calc(100vh-(189px*2))]">
				<div className="container mx-auto px-6 md:px-16 py-16 lg:py-10">
					<h1 className="text-primaryColor  xl:text-[32px] text-[22px] font-[700] text-center mb-4">
						Molimo izaberite vašu državu
					</h1>
					<div className="flex items-center justify-center gap-7 ">
						<div className="rounded-full border-[3px] hover:border-secondary transition-all w-[54px] h-[54px] relative">
							<Image
								onClick={(e) => handleCountryClick(e)}
								alt="Serbian flag"
								id="rs"
								src="/home-page-assets/srb-flag.svg"
								width={54}
								height={54}
								className={`cursor-pointer  ${
									selectedCountry === 'rs' ? 'grayscale-0' : 'grayscale'
								} hover:grayscale-0 transition-all`}
							/>
						</div>
						<div className="rounded-full border-[3px] hover:border-secondary transition-all w-[54px] h-[54px] relative">
							<Image
								onClick={(e) => handleCountryClick(e)}
								alt="Bosnian flag"
								id="ba"
								src="/home-page-assets/bih-flag.svg"
								width={54}
								height={54}
								className={`cursor-pointer  ${
									selectedCountry === 'ba' ? 'grayscale-0' : 'grayscale'
								} hover:grayscale-0 transition-all`}
							/>
						</div>
						<div className="rounded-full border-[3px] hover:border-secondary transition-all w-[54px] h-[54px] relative">
							<Image
								onClick={(e) => handleCountryClick(e)}
								alt="Montenegrot flag"
								id="cg"
								src="/home-page-assets/cg-flag.svg"
								width={54}
								height={54}
								className={`cursor-pointer  ${
									selectedCountry === 'cg' ? 'grayscale-0' : 'grayscale'
								} hover:grayscale-0 transition-all`}
							/>
						</div>
					</div>
				</div>

				{selectedCountry && (
					<div id="register" className="max-w-[1240px] m-auto px-6 md:px-16 py-16">
						<h1 className=" font-bold text-center p-4 text-primaryColor text-[24px] md:text-[32px]">
							Registracija novog naloga
						</h1>
						<form
							className="max-w-[600px] m-auto"
							onSubmit={handleSubmit((data) => {
								registerUser(data);
							})}
						>
							<div
								style={{
									display: 'flex',
									textAlign: 'center',
									justifyContent: 'center',
								}}
							>
								<p style={{ color: 'red' }}>{error}</p>
							</div>
							<div className="flex flex-col pt-5">
								<div className="flex items-center justify-between">
									<label className="text-[#818181] font-semibold">Ime</label>
									<span className="text-[13px] text-[#969494] font-[600]">
										<span className="text-primaryColor">*</span>ovo polje je obavezno
									</span>
								</div>
								<input
									className="border shadow-lg p-3 rounded-[6px] bg-[#F3F3F3]"
									name="name"
									{...register('name', { required: 'Ime je potrebno.' })}
									type="text"
									placeholder="Ime"
								/>
								<p className="text-primaryColor font-[600]">{errors.name?.message}</p>
							</div>
							<div className="flex flex-col pt-5">
								<div className="flex items-center justify-between">
									<label className="text-[#818181] font-semibold">Prezime</label>
									<span className="text-[13px] text-[#969494] font-[600]">
										<span className="text-primaryColor">*</span>ovo polje je obavezno
									</span>
								</div>
								<input
									className="border shadow-lg p-3 rounded-[6px] bg-[#F3F3F3]"
									type="text"
									{...register('surname', { required: 'Prezime je potrebno.' })}
									placeholder="Prezime"
								/>
								<p className="text-primaryColor font-[600]">{errors.surname?.message}</p>
							</div>
							<div className="flex flex-col py-5 ">
								<div className="flex items-center justify-between">
									<label className="text-[#818181] font-semibold">Broj telefona</label>
									<span className="text-[13px] text-[#969494] font-[600]">
										<span className="text-primaryColor">*</span>ovo polje je obavezno
									</span>
								</div>
								<div className="flex  gap-2 relative">
									<div className="relative">
										<div className="w-[100px] py-2  flex justify-center relative">
											<Dropdown projects={projects} selected={selected} setSelected={setSelected} />
										</div>
									</div>
									<div className="h-px w-full">
										<input
											className="border shadow-lg p-3 w-full  rounded-[6px] bg-[#F3F3F3]"
											type="text"
											{...register('phone', {
												required: 'Broj telefona je potreban.',
												pattern: {
													value: /^[0-9]+$/,
													message: 'Molimo Vas unesite broj telefona',
												},
												minLength: {
													value: 8,
													message: 'Najmanje 8 cifara',
												},
											})}
											placeholder="Broj telefona"
										/>
										{errors.phone?.message ? (
											<p className="text-primaryColor font-[600]">Unesite broj telefona.</p>
										) : null}
									</div>
								</div>
							</div>

							<div className="pt-10">
								<div className="flex items-center justify-between">
									<label className="text-[#818181] font-semibold">Email</label>
									<span className="text-[13px] text-[#969494] font-[600]">
										<span className="text-primaryColor">*</span>ovo polje je obavezno
									</span>
								</div>
								<input
									className="border shadow-lg p-3 w-full  rounded-[6px] bg-[#F3F3F3]"
									type="email"
									{...register('email', {
										required: 'Email je potreban.',
										validate: handleEmailValidation,
										onChange: (e) => handleEmailChange(e),
									})}
									placeholder="Email"
								/>
								<ErrorMessage
									errors={errors}
									name="email"
									render={({ messages }) => {
										return (
											messages &&
											Object.entries(messages).map(([type, message]) => (
												<p className="text-primaryColor font-bold" key={type}>
													{message}
												</p>
											))
										);
									}}
								/>
								{email !== '' && (
									<ErrorMessage
										errors={errors}
										name="unregisteredEmail"
										render={({ message }) => (
											<p className={`${status === 400 ? 'text-primaryColor' : 'text-green-600'} font-[500]`}>
												{message}
											</p>
										)}
									/>
								)}
								<p className="text-primaryColor font-[600] ">{errors.email?.message}</p>
							</div>
							<div className="pt-5">
								<div className="flex items-center justify-between">
									<label className="text-[#818181] font-semibold">Lozinka</label>
									<span className="text-[13px] text-[#969494] font-[600]">
										<span className="text-primaryColor">*</span>ovo polje je obavezno
									</span>
								</div>
								<input
									className="border shadow-lg p-3 w-full  rounded-[6px] bg-[#F3F3F3]"
									type="password"
									placeholder="Lozinka"
									{...register('password', {
										required: {
											value: true,
											message: 'Lozinka je potrebna.',
										},
										pattern:
											/(?=[A-Za-z0-9@#$%^&+!=]+$)^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[@#$%^&+!=])(?=.{8,}).*$/g,
									})}
								/>
								{errors.password?.type === 'required' && (
									<p className="text-primaryColor font-bold">{errors?.password?.message}</p>
								)}
								<div className="flex-row my-5">
									<ul>
										<label className="text-[#818181] font-bold ">Lozinka obavezno mora sadržati:</label>
										<li>
											<span
												className={
													checkUppercase(watch('password')) && checkLowerCase(watch('password'))
														? 'text-green-500'
														: 'text-primaryColor'
												}
											>
												• 1 malo slovo i 1 veliko slovo
											</span>
										</li>
										<li>
											<span className={hasNumber(watch('password')) ? 'text-green-500' : 'text-primaryColor'}>
												• 1 cifra
											</span>
										</li>
										<li>
											<span
												className={containsSpecialChars(watch('password')) ? 'text-green-500' : 'text-primaryColor'}
											>
												• 1 specijalni znak (!@#$%^&*).
											</span>
										</li>
										<li>
											<span className={atLeastEightChars(watch('password')) ? 'text-green-500' : 'text-primaryColor'}>
												• najmanje 8 znakova.
											</span>
										</li>
									</ul>
								</div>
							</div>

							<div className="flex items-center justify-between">
								<label className="text-[#818181] font-semibold">Potvrdi lozinku</label>
								<span className="text-[13px] text-[#969494] font-[600]">
									<span className="text-primaryColor">*</span>ovo polje je obavezno
								</span>
							</div>
							<input
								className="border shadow-lg p-3 w-full  rounded-[6px] bg-[#F3F3F3]"
								type="password"
								{...register('confirmPassword', {
									required: 'Morate potvrditi lozinku.',
									validate: (value) => {
										if (watch('password') != value) {
											return 'Lozinke se ne poklapaju.';
										}
									},
								})}
								placeholder="Potvrda lozinke"
							/>
							<p className="text-primaryColor font-bold">{errors.confirmPassword?.message}</p>

							<div className="form-group form-check py-5 rounded-[6px]">
								<input
									name="acceptTerms"
									type="checkbox"
									{...register('acceptTerms', {
										required: 'Morate prihvatiti uslove i odredbe.',
										onChange: () => setTerms(!terms),
									})}
									id="acceptTerms"
								/>
								<Link href="/tos" passHref>
									<a target="_blank">
										<label className="cursor-pointer form-check-label pl-2 text-[#818181] underline">
											Slažem se sa uslovima i odredbama
										</label>
									</a>
								</Link>

								<p className="text-primaryColor font-[600]">{errors.acceptTerms?.message}</p>
							</div>
							<button
								onClick={handleClick}
								className="border shadow-lg p-3 w-full mt-2 bg-primaryColor rounded-[10px] py-4 text-[20px] text-white font-semibold"
							>
								Registracija
							</button>
						</form>
					</div>
				)}
			</section>
			<Footer />
		</div>
	);
};

export default Register;
