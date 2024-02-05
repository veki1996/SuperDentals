import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/router';
import { Nav, Footer, HeadMeta } from '/components';
import Link from 'next/link';
const Login = () => {
	const [error, setErorr] = useState('');
	const router = useRouter();

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm({
		defaultValues: {},
		mode: 'onChange',
		reValidateMode: 'onChange',
	});

	const clickSubmit = async (data) => {
		const email = data.email;
		const password = data.password;
		const res = await signIn('credentials', {
			email,
			password,
			redirect: false,
			callbackUrl: '/',
		});
		if (res?.error) {
			setErorr('Netačan email ili lozinka!');
		} else {
			router.push('/');
		}
	};

	return (
		<div id="login">
			<Nav />
			<HeadMeta
				title="Prijava"
				link={`${process.env.BASE_URL}/login`}
				content={'superdentals.com'}
				description="Tražite stomatologa po svojoj mjeri? Na pravom ste mjestu."
				image={`${process.env.BASE_URL}/images/logo.jpg`}
			/>
			<section className="min-h-[calc(100vh-(189px*2))]">
				<div className="container mx-auto px-6 md:px-16 py-16">
					<h1 className="font-bold text-center p-4 text-primaryColor text-[32px]">Prijava</h1>

					<form className="max-w-[600px] m-auto" onSubmit={handleSubmit(clickSubmit)}>
						<div
							style={{
								display: 'flex',
								textAlign: 'center',
								justifyContent: 'center',
							}}
						>
							<p className="text-primaryColor font-bold">{error}</p>
						</div>
						<div className="py-6">
							<div className="flex flex-col">
								<div className="flex items-center justify-between">
									<label className="text-[#818181] font-semibold">Email</label>
									<span className="text-[13px] text-[#969494] font-[600]">
										<span className="text-primaryColor">*</span>ovo polje je obavezno
									</span>
								</div>

								<input
									type="email"
									{...register('email', {
										required: 'Email je potreban.',
									})}
									className="border shadow-lg p-3 w-full  rounded-[6px] bg-[#F3F3F3]"
									placeholder="Email"
								/>
								<p className="text-primaryColor font-bold">{errors.email?.message}</p>
							</div>
						</div>
						<div className="flex flex-col">
							<div className="flex items-center justify-between">
								<label className="text-[#818181] font-semibold">Lozinka</label>
								<span className="text-[13px] text-[#969494] font-[600]">
									<span className="text-primaryColor">*</span>ovo polje je obavezno
								</span>
							</div>
							<input
								type="password"
								{...register('password', {
									required: 'Lozinka je potrebna.',
									minLength: {
										value: 8,
										message: 'Najmanje 8 cifara.',
									},
								})}
								className="border shadow-lg p-3 w-full  rounded-[6px] bg-[#F3F3F3]"
								placeholder="Lozinka"
							/>
							<p className="text-primaryColor font-bold">{errors.password?.message}</p>
						</div>
						<div className="flex justify-end py-3">
							<Link href="/forgotpassword">
								<a className="underline text-blue-400">Zaboravili ste lozinku?</a>
							</Link>
						</div>

						<button className="border shadow-lg p-3 w-full mt-2 bg-primaryColor rounded-[10px] py-4 text-[20px] text-white font-semibold">
							Pošalji
						</button>
					</form>
				</div>
			</section>
			<Footer />
		</div>
	);
};

export default Login;
