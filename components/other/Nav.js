import { signIn, signOut, useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { FaFacebookF, FaInstagram, FaTiktok, FaLinkedinIn, FaTwitter, FaYoutube } from 'react-icons/fa';
import { BiUser, BiClinic, BiLogOut } from 'react-icons/bi';
import { MdPayment } from 'react-icons/md';
import { TiThMenu } from 'react-icons/ti';
import { FiChevronDown } from 'react-icons/fi';
import { RiAdminLine } from 'react-icons/ri';

import { LanguageDropdown } from '/components';
import { useAtom } from 'jotai';
import { socialLinksAtom } from '/store';
import useTranslation from 'next-translate/useTranslation';

const Nav = () => {
	const { t } = useTranslation('nav');

	const [nav, setNav] = useState(false);
	const [user, setUser] = useState(null);
	const [verifiedStatus, setVerifiedStatus] = useState(null);
	const [error, setErorr] = useState('');
	const router = useRouter();
	const { data: session } = useSession();

	const [socialSettings, setSocialSettings] = useAtom(socialLinksAtom);

	const facebook = socialSettings?.find((setting) => setting?.name === 'Social Facebook');
	const instagram = socialSettings?.find((setting) => setting?.name === 'Social Instagram');
	const tiktok = socialSettings?.find((setting) => setting?.name === 'Social Tiktok');
	const linkedin = socialSettings?.find((setting) => setting?.name === 'Social Linkedin');
	const youtube = socialSettings?.find((setting) => setting?.name === 'Social Youtube');
	const twitter = socialSettings?.find((setting) => setting?.name === 'Social Twitter');

	const {
		register,
		handleSubmit,
		formState: { errors },
		reset,
	} = useForm({
		defaultValues: {},
		mode: 'onChange',
		reValidateMode: 'onChange',
	});

	const {
		register: registerPhone,
		handleSubmit: handleSubmitPhone,
		formState: { errors: errorsPhone },
		reset: resetPhone,
	} = useForm({
		defaultValues: {},
		mode: 'onChange',
		reValidateMode: 'onChange',
	});

	const handleLogInDesktop = async (data) => {
		const email = data.email;
		const password = data.password;
		const res = await signIn('credentials', {
			email,
			password,
			redirect: false,
			callbackUrl: '/',
		});
		if (res?.error) {
			setErorr('Kredencijali nisu ispravni!');
		} else {
			localStorage.removeItem('user');
			localStorage.removeItem('verifiedStatus');
			router.push('/');
		}
	};

	const handleLogInMobile = async (data) => {
		const email = data.emailPhone;
		const password = data.passwordPhone;
		const res = await signIn('credentials', {
			email,
			password,
			redirect: false,
			callbackUrl: '/',
		});
		if (res?.error) {
			setErorr('Kredencijali nisu ispravni!');
		} else {
			localStorage.removeItem('user');
			localStorage.removeItem('verifiedStatus');
			router.push('/');
		}
	};
	const logOut = async () => {
		await signOut();
		localStorage.removeItem('user');
		localStorage.removeItem('verifiedStatus');
		reset();
		resetPhone();
	};

	const sendEmail = async (data) => {
		await fetch('/api/email/verify', {
			method: 'POST',
			body: JSON.stringify(data),
			headers: {
				'Content-type': 'application/json',
			},
		});
	};

	const handleSendVerifyEmail = () => {
		sendEmail({ email: session?.email, hash: session?.hash });
		router.push('/verify');
	};

	useEffect(() => {
		if (typeof window !== 'undefined') {
			setUser(JSON.parse(localStorage.getItem('user')));
			setVerifiedStatus(JSON.parse(localStorage.getItem('verifiedStatus')));
		}
		const fetchSocialSettings = async () => {
			const response = await fetch('/api/settings/getSettings');
			if (response.status === 200) {
				const { socials } = await response.json();
				setSocialSettings(socials);
			}
		};
		if (socialSettings?.length === 0) {
			fetchSocialSettings();
		}

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	// Get clinic Id if session.clinicId is not set
	const handleClinicId = async () => {
		if (session.clinicId !== '') {
			router.push(`/settings/clinic/${session?.clinicId}`);
			return;
		}

		const response = await fetch('/api/clinics/getId', {
			method: 'POST',
			body: JSON.stringify({ id: session?.id }),
			headers: {
				'Content-type': 'application/json',
			},
		});

		if (response.status === 200) {
			const { clinic } = await response.json();
			if (clinic) {
				router.push(`/settings/clinic/${clinic?.id}`);
			} else {
				router.push(`/create-clinic`);
			}
		}
	};

	return (
		<div>
			<nav className="w-full ease-in-out duration-300  h-[8vh] lg:h-auto shadow-nav backdrop-blur-[11.5px] relative z-50">
				<div className="w-full h-full flex items-center justify-between px-6 lg:hidden">
					<div className="basis-[20%]">
						<div className="block lg:hidden">
							<TiThMenu onClick={() => setNav(!nav)} size={30} color="#FC5122" />
						</div>
					</div>
					<Link href="/">
						<div className="w-[110px] h-[35px] relative basis-[60%] cursor-pointer">
							<Image alt="Logo" src="/nav-assets/logo.svg" layout="fill" />
						</div>
					</Link>

					<div className="w-[100px] h-[25px] flex justify-center relative basis[20%]">
						<LanguageDropdown />
					</div>
				</div>
				<div
					className={`${
						nav
							? 'lg:hidden absolute top-[8vh] left-0 right-0 bottom-0 w-full h-screen ease-in duration-300 bg-white z-100'
							: 'lg:hidden absolute top-[8vh] left-[-100%] right-0 bottom-0 w-full h-screen ease-in duration-300 bg-white z-100'
					} z-[100] p-5 flex flex-col gap-6 overflow-y-hidden`}
				>
					<div className="flex items-center justify-center gap-5">
						<FaFacebookF color="#FC5122" size={20} />
						<FaInstagram color="#FC5122" size={20} />
						<FaTwitter color="#FC5122" size={20} />
						<FaLinkedinIn color="#FC5122" size={20} />
						<FaYoutube color="#FC5122" size={20} />
						<FaTiktok color="#FC5122" size={20} />
					</div>
					<div className={`${session && 'flex justify-center'}`}>
						{session ? (
							<div className="flex flex-col items-center gap-2 bg-secondary py-4 px-6 rounded-3xl">
								<div className="w-[50px] h-[50px] bg-primaryColor drop-shadow-lg border-2 border-[#bcbcbc] rounded-full flex items-center justify-center cursor-pointer">
									<span className="text-white font-[700] text-[20px]">
										{user ? user?.name?.charAt(0)?.toUpperCase() : session?.name?.charAt(0)?.toUpperCase()}
										{user ? user?.surname?.charAt(0)?.toUpperCase() : session?.surname?.charAt(0)?.toUpperCase()}
									</span>
								</div>
								<div className="flex items-center gap-1 font-[600] text-white">
									<span>{user ? user?.name : session?.name}</span>
									<span>{user ? user?.surname : session?.surname}</span>
								</div>
								<div className="grid grid-cols-2 uppercase items-center gap-3 font-[700] text-[16px] text-white ">
									<Link href="/settings/profile">
										<span className="w-full flex flex-col justify-between items-center">
											<BiUser fontWeight="700" size={27} />
											{t('user-menu.item-1')}
										</span>
									</Link>

									<span onClick={() => handleClinicId()} className="w-full flex flex-col justify-between items-center">
										<BiClinic fontWeight="700" size={27} />
										{t('user-menu.item-2')}
									</span>

									<div onClick={() => router.push('/settings/billing')}>
										<span className="w-full flex flex-col justify-between items-center">
											<MdPayment fontWeight="700" size={27} />
											{t('user-menu.item-3')}
										</span>
									</div>
									<div onClick={() => logOut()}>
										<span className="w-full flex flex-col justify-between items-center">
											<BiLogOut fontWeight={700} size={27} />
											{t('user-menu.item-4')}
										</span>
									</div>
								</div>
								{session && session?.role === 'ADMIN' && (
									<Link href="/admin/dashboard">
										<span className="w-full flex flex-col justify-between items-center font-[700] text-[16px] text-white uppercase">
											<RiAdminLine color="white" fontWeight="700" size={27} />
											Admin
										</span>
									</Link>
								)}
							</div>
						) : (
							<form onSubmit={handleSubmit(handleLogInDesktop)} className="flex flex-col gap-3">
								<div className="grid grid-cols-1 gap-2">
									<input
										type="email"
										{...register('email', {
											required: t('login-register.text-5'),
										})}
										className="text-[14px] border border-[#D9D9D9] rounded-[8px] px-4 py-2"
										placeholder="Email"
									/>
									<p className="text-primaryColor text-[14px] font-[500]">{errors.email?.message}</p>
									<input
										type="password"
										{...register('password', {
											required: t('login-register.text-6'),
										})}
										className="text-[14px] border border-[#D9D9D9] rounded-[8px] px-4 py-2"
										placeholder={t('login-register.text-3')}
									/>
									<p className="text-primaryColor text-[14px] font-[500]">{errors.password?.message}</p>
									<div className="flex items-center justify-center">
										<p className="text-primaryColor text-[14px] font-[500]">{error}</p>
									</div>
								</div>
								<div className="w-full text-[#0093DD] text-[14px] text-center underline">
									<Link href="/forgotpassword" className="text-[12px] ">
										{t('login-register.text-4')}
									</Link>
								</div>
								<button className="button w-full py-2 text-[16px] font-[600]">{t('login-register.text-1')}</button>
								<Link href="/register">
									<h2 className="text-primaryColor text-[18px] font-[600] w-full text-center underline">
										{t('login-register.text-2')}
									</h2>
								</Link>
							</form>
						)}
					</div>
					<div className="flex flex-col items-center gap-1">
						<p className="text-[#10100F] text-[18px] uppercase font-[700]">
							<Link href="/">{t('nav-menu.item-1')}</Link>
						</p>
						<p className="text-[#10100F] text-[18px] uppercase font-[700]">
							<Link href="/about">{t('nav-menu.item-2')}</Link>
						</p>
						<p className="text-[#10100F] text-[18px] uppercase font-[700]">
							<a href="https://blog.superdentals.com/">{t('nav-menu.item-3')}</a>
						</p>
						<p className="text-[#10100F] text-[18px] uppercase font-[700]">
							<Link href="/learn-more">{t('nav-menu.item-4')}</Link>
						</p>
						<p className="text-[#10100F] text-[18px] uppercase font-[700]">
							<Link href="/dental-tourism">{t('nav-menu.item-5')}</Link>
						</p>
						<p className="text-[#10100F] text-[18px] uppercase font-[700]">
							<Link href="/partners">{t('nav-menu.item-6')}</Link>
						</p>
						<p className="text-[#10100F] text-[18px] uppercase font-[700]">
							<Link href="/marketing">{t('nav-menu.item-7')}</Link>
						</p>
						<p className="text-[#10100F] text-[18px] uppercase font-[700]">
							<Link href="/contact">{t('nav-menu.item-8')}</Link>
						</p>
					</div>
				</div>
				<div className="hidden lg:block px-16 pt-6 pb-[1rem]">
					<div className="flex justify-between">
						<Link href="/">
							<div className="w-[200px] h-[80px] xl:w-[250px] xl:h-[80px] relative cursor-pointer">
								<Image alt="Logo" src="/nav-assets/logo.svg" layout="fill" />
							</div>
						</Link>
						<div className="flex items-end gap-10">
							<div className={`flex gap-2 ${session ? 'mb-1' : 'mb-2'}`}>
								<div className="w-[100px] h-[25px] flex justify-center relative">
									<LanguageDropdown />
								</div>
							</div>
							<div className="relative">
								{socialSettings?.length > 0 && (
									<div className="flex items-center justify-center gap-5 absolute top-[-35px] right-0">
										{facebook && facebook?.defaultValue && (
											<a href={facebook?.defaultValue} target="_blank" rel="noreferrer">
												<FaFacebookF color="#FC5122" className="cursor-pointer" size={20} />
											</a>
										)}

										{instagram && instagram?.defaultValue && (
											<a href={instagram?.defaultValue} target="_blank" rel="noreferrer">
												<FaInstagram color="#FC5122" className="cursor-pointer" size={20} />
											</a>
										)}

										{twitter && twitter?.defaultValue && (
											<a href={twitter?.defaultValue} target="_blank" rel="noreferrer">
												<FaTwitter color="#FC5122" className="cursor-pointer" size={20} />
											</a>
										)}

										{linkedin && linkedin?.defaultValue && (
											<a href={linkedin?.defaultValue} target="_blank" rel="noreferrer">
												<FaLinkedinIn color="#FC5122" className="cursor-pointer" size={20} />
											</a>
										)}

										{youtube && youtube?.defaultValue && (
											<a href={youtube?.defaultValue} target="_blank" rel="noreferrer">
												<FaYoutube color="#FC5122" className="cursor-pointer" size={20} />
											</a>
										)}

										{tiktok && tiktok?.defaultValue && (
											<a href={tiktok?.defaultValue} target="_blank" rel="noreferrer">
												<FaTiktok color="#FC5122" className="cursor-pointer" size={20} />
											</a>
										)}
									</div>
								)}

								{session ? (
									<div className="flex items-center gap-2">
										<div className="dropdown dropdown-bottom">
											<label tabIndex={0} className="cursor-pointer">
												<div className="flex gap-2">
													<div className="w-[35px] h-[35px] bg-primaryColor drop-shadow-lg border-2 border-[#bcbcbc] rounded-full flex items-center justify-center  transition-colors duration-300 hover:bg-secondary">
														<span className="text-white font-[700] text-[15px]">
															{user ? user?.name?.charAt(0)?.toUpperCase() : session?.name?.charAt(0)?.toUpperCase()}
															{user
																? user?.surname?.charAt(0)?.toUpperCase()
																: session?.surname?.charAt(0)?.toUpperCase()}
														</span>
													</div>
													<div className="flex items-center gap-2 font-[600] text-[#727272]">
														<span>{user ? user?.name : session?.name}</span>
														<span>{user ? user?.surname : session?.surname}</span>
														<FiChevronDown size={25} />
													</div>
												</div>
												<ul
													tabIndex={0}
													className={`dropdown-content menu p-2 shadow rounded-box w-52 bg-secondary text-white font-[700] uppercase ${
														session?.role === 'ADMIN' ? 'bottom-[-275px]' : 'bottom-[-220px]'
													} `}
												>
													<li className="hover:bg-primaryColor transition-all duration-300">
														<Link href="/settings/profile">
															<span>
																<BiUser fontWeight="700" size={25} />
																{t('user-menu.item-1')}
															</span>
														</Link>
													</li>

													<li
														className="hover:bg-primaryColor transition-all duration-300"
														onClick={() => handleClinicId()}
													>
														<span>
															<BiClinic fontWeight="700" size={25} />
															{t('user-menu.item-2')}
														</span>
													</li>

													<li
														className="hover:bg-primaryColor transition-all duration-300"
														onClick={() => router.push('/settings/billing')}
													>
														<span>
															<MdPayment fontWeight={700} size={25} />
															{t('user-menu.item-3')}
														</span>
													</li>
													{session && session?.role === 'ADMIN' && (
														<li className="hover:bg-primaryColor transition-all duration-300">
															<Link href="/admin/dashboard">
																<span>
																	<RiAdminLine fontWeight={700} size={25} />
																	Admin
																</span>
															</Link>
														</li>
													)}
													<li className="hover:bg-primaryColor transition-all duration-300">
														<div onClick={() => logOut()}>
															<span className="flex items-center gap-3">
																<BiLogOut fontWeight={700} size={25} />
																{t('user-menu.item-4')}
															</span>
														</div>
													</li>
												</ul>
											</label>
										</div>
									</div>
								) : (
									<form onSubmit={handleSubmitPhone(handleLogInMobile)} className="flex gap-2 h-full">
										<div className="flex gap-2 h-full">
											<div>
												<input
													type="email"
													{...registerPhone('emailPhone', {
														required: t('login-register.text-5'),
													})}
													className="text-[14px] border border-[#21231E] rounded-[4px] px-4 py-2"
													placeholder="Email"
												/>

												<p className="text-primaryColor text-[14px] font-[500] absolute">
													{errorsPhone.emailPhone?.message}
												</p>
												<div
													className={`flex items-center justify-center absolute mt-0 ${
														errorsPhone.emailPhone && 'mt-5'
													}`}
												>
													<p className="text-primaryColor text-[14px] font-[500]">{error}</p>
												</div>
											</div>
											<div>
												<input
													type="password"
													{...registerPhone('passwordPhone', {
														required: t('login-register.text-6'),
													})}
													className="text-[14px] border border-[#21231E] rounded-[4px] px-4 py-2"
													placeholder={t('login-register.text-3')}
												/>
												<div className="absolute">
													<p className="text-primaryColor text-[14px] font-[500] ">
														{errorsPhone.passwordPhone?.message}
													</p>
													<div className="w-full text-[#0093DD] text-[12px] underline pt-1">
														<Link href="/forgotpassword" className="text-[12px] ">
															{t('login-register.text-4')}
														</Link>
													</div>
												</div>
											</div>
										</div>
										<div className="relative">
											<button className="button w-full py-2 text-[16px] font-[600] rounded-[4px] self-center">
												{t('login-register.text-1')}
											</button>
											<h2
												onClick={() => router.push('/register')}
												className="text-primaryColor text-[14px] font-[700] w-full underline absolute cursor-pointer pt-1"
											>
												{t('login-register.text-2')}
											</h2>
										</div>
									</form>
								)}
							</div>
						</div>
					</div>

					<div
						className={`flex justify-between  items-center pt-4 ${!session && 'mt-10'} mt-5 border-t border-[#B9B9B9]`}
					>
						<p className="text-[#21231E] text-[16px] uppercase font-[500] hover:text-primaryColor transition-colors">
							<Link href="/">{t('nav-menu.item-1')}</Link>
						</p>
						<p className="text-[#21231E] text-[16px] uppercase font-[500] hover:text-primaryColor transition-colors">
							<Link href="/about">{t('nav-menu.item-2')}</Link>
						</p>
						<p className="text-[#21231E] text-[16px] uppercase font-[500] hover:text-primaryColor transition-colors">
							<a href="https://blog.superdentals.com/">{t('nav-menu.item-3')}</a>
						</p>
						<p className="text-[#21231E] text-[16px] uppercase font-[500] hover:text-primaryColor transition-colors">
							<Link href="/learn-more">{t('nav-menu.item-4')}</Link>
						</p>
						<p className="text-[#21231E] text-[16px] uppercase font-[500] hover:text-primaryColor transition-colors">
							<Link href="/dental-tourism">{t('nav-menu.item-5')}</Link>
						</p>
						<p className="text-[#21231E] text-[16px] uppercase font-[500] hover:text-primaryColor transition-colors">
							<Link href="/partners">{t('nav-menu.item-6')}</Link>
						</p>
						<p className="text-[#21231E] text-[16px] uppercase font-[500] hover:text-primaryColor transition-colors">
							<Link href="/marketing">{t('nav-menu.item-7')}</Link>
						</p>
						<p className="text-[#21231E] text-[16px] uppercase font-[500] hover:text-primaryColor transition-colors">
							<Link href="/contact">{t('nav-menu.item-8')}</Link>
						</p>
					</div>
				</div>
			</nav>
			{session && !session?.verified && !verifiedStatus?.verified && (
				<div className="bg-yellow-300">
					<div className="w-full flex flex-col md:flex-row items-center gap-2 text-black font-[500] container mx-auto px-6 md:px-16 py-1">
						<div className="text-center md:text-left">{t('verify.text-1')} </div>
						<button onClick={handleSendVerifyEmail} className="border-2 border-black px-2 rounded-[10px] uppercase">
							{t('verify.text-2')}
						</button>
					</div>
				</div>
			)}
		</div>
	);
};

export default Nav;
