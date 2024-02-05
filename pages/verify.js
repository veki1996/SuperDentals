import { useRouter } from 'next/router';
import { prisma } from '/utils/db';
import { getSession } from 'next-auth/react';
import { Nav, Footer, HeadMeta } from '/components';
import Image from 'next/image';
import useTranslation from 'next-translate/useTranslation';

const Verify = ({ session }) => {
	const router = useRouter();
	//if user is already verifeid go to login page
	const verifyUser = async () => {
		const data = {
			email: router.query.email,
			hash: router.query.hash,
		};

		const response = await fetch('/api/auth/verify', {
			method: 'POST',
			body: JSON.stringify(data),
			headers: {
				'Content-type': 'application/json',
			},
		});

		if (response.status === 200 || response.status === 202) {
			router.push('/create-clinic');
			localStorage.setItem('verifiedStatus', JSON.stringify({ verified: true }));
		}
	};

	return (
		<div id="login" className="">
			<HeadMeta
				title="Verifikacija"
				link={`${process.env.BASE_URL}/verify`}
				content={'superdentals.com'}
				description="Tražite stomatologa po svojoj mjeri? Na pravom ste mjestu."
				image={`${process.env.BASE_URL}/images/logo.jpg`}
			/>
			<Nav />
			<section className="min-h-[calc(100vh-(189px*2))]">
				<div className="container mx-auto px-4 md:px-16 py-16">
					<div className="max-w-[600px] m-auto">
						<h1 className=" text-center md:text-[32px] text-[26px] text-primaryColor font-bold pt-16">
							Verifikacija naloga
						</h1>
						{router.query.email && router.query.hash ? (
							<VerifyConfirm email={router.query.email} callback={verifyUser} />
						) : (
							<VerifyLanding email={session?.user?.email} />
						)}
					</div>
					<div className={`${router.query.email && router.query.hash ? 'hidden' : 'block'}`}>
						<div className="flex justify-center text-[20px] ">
							<button
								onClick={() => router.push('/create-clinic')}
								className="bg-primaryColor  text-white font-bold py-3 px-28 border  rounded-[10px] mt-10 items-center flex flex-row gap-1"
							>
								Nastavi <Image alt="dugme" src="/register-page-assets/dugme.svg" width={17} height={17} />
							</button>
						</div>
					</div>
				</div>
			</section>
			<Footer />
		</div>
	);
};

export default Verify;

const VerifyLanding = ({ email }) => {
	const { t } = useTranslation('verify');

	return (
		<div className="container mx-auto px-6 md:px-16 text-center text-[20px] py-12">
			<h2 className="font-bold pb-5 ">Vaša registracija je {t('main.text-1')}.</h2>
			<p className="md:text-[20px] text-[16px]">
				Poslali smo vam konfirmacijski e-mail na: <span className="font-bold">{email}</span>. {t('main.text-2')} Vaš
				inbox, da biste verifikovali Vašu registraciju.
			</p>
		</div>
	);
};

const VerifyConfirm = ({ email, callback }) => {
	return (
		<div className="max-w-[600px] m-auto text-center text-[20px] pt-8 pb-12">
			<h2>
				Pozdrav <span className="font-bold">{email}.</span>{' '}
			</h2>
			<h2 className="text-[20px]">Samo još jedan korak.</h2>
			<p>Kliknite na dugme ispod da verifikujete Vašu registraciju.</p>

			<div className="flex justify-center pt-12">
				<button
					onClick={() => callback()}
					className="bg-primaryColor  text-white font-bold py-3 px-28 border  rounded-[10px] mt-10 items-center flex flex-row gap-1"
				>
					Potvrdi <Image alt="dugme" src="/register-page-assets/dugme.svg" width={17} height={17} />
				</button>
			</div>
		</div>
	);
};

export async function getServerSideProps(context) {
	//Check if the user already verified the account
	const session = await getSession(context);
	const email = context.query.email;

	if (email) {
		const user = await prisma.user.findUnique({
			where: {
				email: email,
			},
		});

		if (user) {
			let verified = user.verified;

			//redirect user if he is already verified

			if (verified) {
				return {
					redirect: {
						destination: '/create-clinic',
						permanent: false,
					},
				};
			} else {
				return {
					props: {
						message: 'Message',
					},
				};
			}
		}

		return {
			props: {
				message: 'Message',
			},
		};
	} else {
		return {
			props: { session },
		};
	}
}
