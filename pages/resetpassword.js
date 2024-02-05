import { useRouter } from 'next/router';
import { prisma } from '/utils/db';
import { checkUppercase, hasNumber, containsSpecialChars, atLeastEightChars } from '/utils';
import { useForm } from 'react-hook-form';
import { Nav, Footer, HeadMeta } from '/components';
import { useState } from 'react';
import { checkLowerCase } from '../utils';
const ResetPassword = ({ verified, error }) => {
	const router = useRouter();

	return (
		<div id="login container mx-auto px-6 md:px-16  ">
			<Nav />
			<HeadMeta
				title="Promjena lozinke"
				link={`${process.env.BASE_URL}/resetpassword`}
				content={'superdentals.com'}
				description="Tražite stomatologa po svojoj mjeri? Na pravom ste mjestu."
				image={`${process.env.BASE_URL}/images/logo.jpg`}
			/>
			<div className="py-16 px-6 md:px-16 min-h-[calc(100vh-(189px*2))]">
				<div className="max-w-[600px]m-auto">
					<h1 className="text-[32px] text-center text-primaryColor font-bold">Promjena lozinke</h1>
					{error ? (
						<ExpiredLink />
					) : verified ? (
						<ExpiredLink />
					) : (
						<ResetConfirm email={router.query.email} hash={router.query.hash} />
					)}
				</div>
			</div>

			<Footer />
		</div>
	);
};

export default ResetPassword;

export async function getServerSideProps(context) {
	const email = context.query.email;
	const hash = context.query.hash;
	let verified = false;

	const record = await prisma.forgotPasswordRequests.findFirst({
		where: {
			email: email,
			hash: hash,
		},
	});

	if (record) {
		if (record.verified) {
			return {
				props: { verified: verified, error: true },
			};
		} else {
			return {
				props: { verified: record.verified, error: false },
			};
		}
	} else {
		return {
			props: { error: true },
		};
	}
}

const ExpiredLink = () => {
	const router = useRouter();

	return (
		<div className="  px-6 md:px-16 ">
			<h1 className="text-primaryColor text-center text-[28px] pt-12 ">Greška</h1>
			<p className="text-center md:text-[20px] text-[18px] py-8">
				Link za promjenu šifre ističe poslije nekog vremena. <br></br>Ako želite da promijenite šifru, možete poslati
				zahtjev opet.
			</p>
			<div className="flex justify-center">
				<button
					onClick={() => router.push('forgotpassword')}
					className="border shadow-lg p-3 mt-2 bg-primaryColor rounded-[10px] py-4 text-[20px] text-white font-semibold"
				>
					Pokušajte ponovo
				</button>
			</div>
		</div>
	);
};

const ResetConfirm = (props) => {
	const router = useRouter();
	const [error, setError] = useState('');
	const [message, setMessage] = useState('');

	const {
		register,
		handleSubmit,
		watch,
		formState: { errors },
	} = useForm({
		defaultValues: {},
		mode: 'onChange',
		reValidateMode: 'onChange',
	});

	const changePassword = async (data) => {
		data.email = props.email;
		data.hash = props.hash;

		const response = await fetch('/api/user/resetpassword', {
			method: 'POST',
			body: JSON.stringify(data),
			headers: {
				'Content-type': 'application/json',
			},
		});

		if (response.status === 200) {
			setMessage('Lozinka je promijenjena!');
			setTimeout(() => {
				setMessage('');
			}, 3000);
			setTimeout(() => {
				router.push('/login');
			}, 3000);
		} else {
			setError('Greška');
		}
	};
	return (
		<div className="max-w-[600px]m-auto">
			<h2 className="text-center py-12 text-[20px]">Samo još jedan korak da resetujete svoju lozinku.</h2>
			<form
				className="max-w-[600px] m-auto"
				onSubmit={handleSubmit((data) => {
					changePassword(data);
				})}
			>
				<p className="text-center" style={{ color: 'red' }}>
					{error}
				</p>
				<div className="mb-4">
					<label className="text-[#818181] font-semibold">Lozinka</label>
					<input
						className="border shadow-lg p-3 w-full  rounded-[6px] bg-[#F3F3F3]"
						type="password"
						placeholder="Lozinka"
						{...register('password', {
							required: {
								value: true,
								message: 'Lozinka je potrebna.',
							},
							pattern: /(?=[A-Za-z0-9@#$%^&+!=]+$)^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[@#$%^&+!=])(?=.{8,}).*$/g,
						})}
					/>
					{errors.password?.type === 'required' && (
						<p className="text-primaryColor font-bold">{errors?.password?.message}</p>
					)}
				</div>

				<div className="flex-row ml-5">
					<ul>
						<label className="text-[#818181] font-bold ">Lozinka obavezno mora sadrzati:</label>
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
							<span className={hasNumber(watch('password')) ? 'text-green-500' : 'text-primaryColor'}>• 1 cifra</span>
						</li>
						<li>
							<span className={containsSpecialChars(watch('password')) ? 'text-green-500' : 'text-primaryColor'}>
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
				<div className="my-8">
					<label className="text-[#818181] font-semibold">Potvrdi lozinku</label>
					<input
						className="border shadow-lg p-3 w-full  rounded-[6px] bg-[#F3F3F3] "
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
				</div>
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
				<button className="border shadow-lg p-3 w-full mt-2 bg-primaryColor rounded-[10px] py-3 text-[20px] text-white font-semibold">
					Promijeni lozinku
				</button>
			</form>
		</div>
	);
};
