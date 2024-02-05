import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { getSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { checkUppercase, hasNumber, checkLowerCase, containsSpecialChars, atLeastEightChars } from '/utils';
import { prisma } from '/utils/db';
import { Nav, Footer, HeadMeta } from '/components';
import useTranslation from 'next-translate/useTranslation';
import { AiOutlineCopy } from 'react-icons/ai';

const Profile = ({ user }) => {
	const { t } = useTranslation('profile');

	const router = useRouter();
	// States
	const [error, setError] = useState('');
	const [success, setSuccess] = useState('');
	const [successPassword, setSuccessPassword] = useState('');
	const [appear, setAppear] = useState(false);

	// Use Form instance
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm({
		mode: 'onChange',
		reValidateMode: 'onChange',
	});

	// Use Form instance for password
	const {
		register: register2,
		handleSubmit: handleSubmit2,
		watch: watch2,
		reset,
		formState: { errors: errors2 },
		resetField: resetField2,
	} = useForm({
		mode: 'onChange',
		reValidateMode: 'onChange',
	});
	const handleSubmitUser = async (data) => {
		data.userId = user.id;
		data.userPass = user.password;
		data.changePassword = false;

		const response = await fetch('/api/user/edit', {
			body: JSON.stringify(data),
			method: 'POST',
			headers: {
				'Content-type': 'application/json',
			},
		});

		if (response.status === 200) {
			const resData = await response.json();
			const user = resData.editedUser;
			setSuccess(`${user.name} ${user.surname} uspješno ažuriran!`);
			setTimeout(() => {
				setSuccess('');
			}, 5000);
			router.replace(router.asPath);
			localStorage.setItem('user', JSON.stringify({ name: user.name, surname: user.surname }));
		}
	};

	const handleSubmitPassword = async (data) => {
		data.userId = user.id;
		data.userPass = user.password;
		data.changePassword = true;

		const response = await fetch('/api/user/edit', {
			body: JSON.stringify(data),
			method: 'POST',
			headers: {
				'Content-type': 'application/json',
			},
		});

		if (response.status === 200) {
			await response.json();
			setSuccessPassword(`Lozinka uspješno promijenjena!`);
			setTimeout(() => {
				setSuccessPassword('');
			}, 5000);
			router.replace(router.asPath);
			reset();
		} else if (response.status === 400) {
			resetField2('oldPassword');
			resetField2('password');
			setError('Netačna stara lozinka');
			setSuccessPassword(``);
		}
	};

	useEffect(() => {
		if (!appear) return;
		setTimeout(() => {
			setAppear(false);
		}, 1000);
	}, [appear]);

	return (
		<div>
			<Nav />
			<HeadMeta
				title="Uredi nalog"
				link={`${process.env.BASE_URL}/settings/profile`}
				content={'superdentals.com'}
				description="Tražite stomatologa po svojoj mjeri? Na pravom ste mjestu."
				image={`${process.env.BASE_URL}/images/logo.jpg`}
			/>
			<section className="min-h-[calc(100vh-(189px*2))]">
				<div id="editProfile" className="pb-16 lg:py-16 px-6 md:px-16">
					<h1 className="text-primaryColor text-[32px] font-bold text-center py-5 lg:pt-0">Uredi nalog</h1>
					<form className="max-w-[600px] m-auto" onSubmit={handleSubmit(handleSubmitUser)}>
						<div
							style={{
								display: 'flex',
								textAlign: 'center',
								justifyContent: 'center',
							}}
						></div>
						<div className="flex flex-col">
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
								defaultValue={user?.name}
							/>
							<p className="text-primaryColor font-bold">{errors.name?.message}</p>
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
								defaultValue={user?.surname}
							/>
							<p className="text-primaryColor font-bold">{errors.surname?.message}</p>
						</div>
						<div className="pt-5 flex flex-col">
							<div className="flex items-center justify-between">
								<label className="text-[#818181] font-semibold">Broj telefona</label>
								<span className="text-[13px] text-[#969494] font-[600]">
									<span className="text-primaryColor">*</span>ovo polje je obavezno
								</span>
							</div>
							<input
								className="border shadow-lg p-3 rounded-[6px] bg-[#F3F3F3]"
								type="text"
								{...register('phone', {
									required: 'Broj telefona je potreban.',
									minLength: {
										value: 8,
										message: 'Najmanje 8 cifara',
									},
								})}
								placeholder="Broj telefona"
								defaultValue={user?.phoneNumber}
							/>
							<p className="text-primaryColor font-bold">{errors.phone?.message}</p>
						</div>
						<div className="py-5 flex flex-col">
							<label className="text-[#818181] font-semibold">Email</label>
							<input
								className="border shadow-lg p-3 rounded-[6px] bg-[#F3F3F3] disabled:bg-slate-200"
								type="email"
								disabled
								placeholder="Email"
								defaultValue={user?.email}
							/>
						</div>
						<p className="text-primaryColor font-bold">{errors.email?.message}</p>

						<div className="pt-3 pb-5 flex flex-col">
							<label className="text-[#818181] font-semibold">Kod za popust</label>
							<div className="flex items-center relative">
								<input
									className="border shadow-lg p-3 rounded-[6px] bg-[#F3F3F3] disabled:bg-slate-200 w-full"
									type=" referalCode "
									disabled
									placeholder="Kod za popust"
									defaultValue={user?.referalCode}
								/>
								<div className="absolute right-2">
									<AiOutlineCopy
										size={35}
										className="text-gray-600 cursor-pointer hover:text-primaryColor transition-colors duration-300 "
										onClick={() => {
											navigator?.clipboard?.writeText(user?.referalCode);
											setAppear(true);
										}}
									/>
									<span
										className={`${
											appear ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-[10px]'
										} transition-all duration-300 absolute top-[40px] left-[-30px] bg-secondary py-[10px] px-[15px] flex justify-center text-white rounded-lg uppercase text-[14px] font-semibold`}
									>
										Kopirano
									</span>
								</div>
							</div>
						</div>
						<p className="text-primaryColor font-bold">{errors.referalCode?.message}</p>
						<p className="mb-2 font-[500]">
							Pošaljite <span className="font-[600]">PROMO</span> kod partnerskim ordinacijama, te za svaki aktivirani{' '}
							<span className="font-[600]">PROMO</span> kod ostvarite 5% kredita na svom računu (za {t('main.text-1')}{' '}
							obračunski period) od iznosa paketa koji partner odabere, a oni odmah dobijaju 5% popusta na odabrani
							paket.
						</p>
						<button className="button w-full">Uredi nalog</button>
						{success ? (
							<div className="alert alert-success shadow-lg mt-5">
								<div>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										className="stroke-current flex-shrink-0 h-6 w-6"
										fill="none"
										viewBox="0 0 24 24"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth="2"
											d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
										/>
									</svg>
									<span>{success}</span>
								</div>
							</div>
						) : (
							''
						)}
					</form>
					<div className="py-8">
						<h1 className="text-primaryColor text-[32px] font-bold text-center pb-6">{t('main.text-2')} lozinke</h1>
						<form className="max-w-[600px] m-auto" onSubmit={handleSubmit2(handleSubmitPassword)}>
							<div className="flex flex-col">
								{error !== '' && successPassword === '' ? (
									<span className="text-primaryColor font-semibold flex items-center justify-center pt-6">{error}</span>
								) : (
									<></>
								)}

								<div className="flex items-center justify-between">
									<label className="text-[#818181] font-semibold">Stara lozinka</label>
									<span className="text-[13px] text-[#969494] font-[600]">
										<span className="text-primaryColor">*</span>ovo polje je obavezno
									</span>
								</div>
								<input
									className="border shadow-lg p-3 rounded-[6px] bg-[#F3F3F3]"
									type="password"
									name="oldPassword"
									{...register2('oldPassword', {
										required: true,
									})}
									placeholder="Stara lozinka"
								/>
								{errors2.oldPassword?.type === 'required' && (
									<p className="text-primaryColor font-bold">Stara lozinka je potrebna</p>
								)}
							</div>
							<div className="flex flex-col py-5">
								<div className="flex items-center justify-between">
									<label className="text-[#818181] font-semibold">Nova lozinka</label>
									<span className="text-[13px] text-[#969494] font-[600]">
										<span className="text-primaryColor">*</span>ovo polje je obavezno
									</span>
								</div>
								<input
									className="border shadow-lg p-3 rounded-[6px] bg-[#F3F3F3]"
									type="password"
									{...register2('password', {
										required: {
											value: true,
											message: 'Lozinka je potrebna.',
										},
										pattern:
											/(?=[A-Za-z0-9@#$%^&+!=]+$)^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[@#$%^&+!=])(?=.{8,}).*$/g,
									})}
									placeholder="Nova lozinka"
								/>
								{errors2.password?.type === 'required' && (
									<p className="text-primaryColor font-bold">{errors2?.password?.message}</p>
								)}
							</div>
							<div className="flex-row ml-5 mb-2">
								<ul>
									<label className="text-[#818181] font-bold ">Lozinka obavezno mora sadrzati:</label>
									<li>
										<span
											className={
												checkUppercase(watch2('password')) && checkLowerCase(watch2('password'))
													? 'text-green-500'
													: 'text-primaryColor'
											}
										>
											• 1 malo slovo i 1 veliko slovo
										</span>
									</li>
									<li>
										<span className={hasNumber(watch2('password')) ? 'text-green-500' : 'text-primaryColor'}>
											• 1 cifra
										</span>
									</li>
									<li>
										<span className={containsSpecialChars(watch2('password')) ? 'text-green-500' : 'text-primaryColor'}>
											• 1 specijalni znak (!@#$%^&*).
										</span>
									</li>
									<li>
										<span className={atLeastEightChars(watch2('password')) ? 'text-green-500' : 'text-primaryColor'}>
											• najmanje 8 znakova.
										</span>
									</li>
								</ul>
							</div>

							<div className="flex items-center justify-between">
								<label className="text-[#818181] font-semibold mt-2">Potvrdi lozinku</label>
								<span className="text-[13px] text-[#969494] font-[600]">
									<span className="text-primaryColor">*</span>ovo polje je obavezno
								</span>
							</div>
							<input
								className="border shadow-lg p-3 w-full  rounded-[6px] bg-[#F3F3F3]"
								type="password"
								{...register2('confirmPassword', {
									required: 'Morate potvrditi lozinku.',
									validate: (value) => {
										if (watch2('password') != value) {
											return 'Lozinke se ne poklapaju.';
										}
									},
								})}
								placeholder="Potvrda lozinke"
							/>
							<p className="text-primaryColor font-bold">{errors2.confirmPassword?.message}</p>
							<button className="button w-full mt-4">Promijeni lozinku</button>
							{successPassword ? (
								<div className="alert alert-success shadow-lg mt-5">
									<div>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											className="stroke-current flex-shrink-0 h-6 w-6"
											fill="none"
											viewBox="0 0 24 24"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth="2"
												d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
											/>
										</svg>
										<span>{successPassword}</span>
									</div>
								</div>
							) : (
								''
							)}
						</form>
					</div>
				</div>
			</section>
			<Footer />
		</div>
	);
};

export default Profile;

export async function getServerSideProps(ctx) {
	const session = await getSession(ctx);

	const user = await prisma.user.findUnique({
		where: {
			id: session.id,
		},
		include: {
			clinics: true,
		},
	});

	return {
		props: {
			user,
		},
	};
}
