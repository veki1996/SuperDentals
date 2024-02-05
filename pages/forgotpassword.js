import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Nav, Footer, HeadMeta } from '/components';

const ForgotPassword = () => {
	const [error, setErorr] = useState('');
	const [message, setMessage] = useState('');

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

	const checkUserEmail = async (data) => {
		const response = await fetch('/api/auth/forgotpass', {
			method: 'POST',
			body: JSON.stringify(data),
			headers: {
				'Content-type': 'application/json',
			},
		});

		if (response.status === 200) {
			reset();
			setMessage('Poslali smo Vam link za resetovanje lozinke, otidjite na Email za sljedeci korak.');
			setTimeout(() => {
				setMessage('');
			}, 5000);
		} else {
			setErorr('Email ' + data.email + ' ne postoji u našoj bazi');
		}
	};

	return (
		<div id="login">
			<Nav />
			<HeadMeta
				title="Zaboravljena lozinka"
				link={`${process.env.BASE_URL}/forgotpassword`}
				content={'superdentals.com'}
				description="Tražite stomatologa po svojoj mjeri? Na pravom ste mjestu."
				image={`${process.env.BASE_URL}/images/logo.jpg`}
			/>
			<section className="min-h-[calc(100vh-(189px*2))]">
				<div className="py-24 px-6 md:px-16">
					<h1 className="text-primaryColor font-bold text-center p-4 text-[32px]">Zaboravljena lozinka</h1>

					<form
						className="max-w-[600px] m-auto"
						onSubmit={handleSubmit((data) => {
							checkUserEmail(data);
						})}
					>
						<div
							style={{
								display: 'flex',
								textAlign: 'center',
								justifyContent: 'center',
							}}
						>
							<p className="text-primaryColor font-[500]">{error}</p>
						</div>
						<div className="grid grid-cols-1 gap-2 py-6">
							<label className="text-[12px]">Unesite Vaš email kako bismo pronašli Vaš nalog</label>
							<input
								type="email"
								{...register('email', {
									required: 'Email je potreban.',
								})}
								className="border shadow-lg p-3 w-full  rounded-[6px] bg-[#F3F3F3]"
								placeholder="Email"
							/>
							<p className="text-primaryColor font-bold">{errors.email?.message}</p>
							{message ? (
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
										<span>{message}</span>
									</div>
								</div>
							) : (
								''
							)}
						</div>

						<button className="border shadow-lg p-3 w-full mt-2 bg-primaryColor rounded-[10px] py-3 text-[20px] text-white font-semibold">
							Pošalji
						</button>
					</form>
				</div>
			</section>
			<Footer />
		</div>
	);
};

export default ForgotPassword;
