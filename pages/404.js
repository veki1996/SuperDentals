import Image from 'next/image';
import { useRouter } from 'next/router';
import { HeadMeta } from '/components';

const ErrorPage = () => {
	const router = useRouter();
	return (
		<div>
			<HeadMeta
				title="404-Stranica niije pronađena"
				content={'superdentals.com'}
				description="Tražite stomatologa po svojoj mjeri? Na pravom ste mjestu."
				image={`${process.env.BASE_URL}/images/logo.jpg`}
			/>
			<section className="min-h-[100vh] container mx-auto px-6 md:px-16 flex flex-col justify-center items-center">
				<div className="relative w-[200px] h-[100px] sm:w-[350px] sm:h-[150px]">
					<Image alt="logo" src="/home-page-assets/blog-logo.svg" layout="fill" />
				</div>
				<h1 className="font-[700] text-[#727272] text-[40px] md:text-[70px]">404</h1>

				<p className="font-[700] text-secondary text-[20px] md:text-[30px] text-center">
					Oops! Ova stranica nije pronađena.
				</p>
				<button className="button mt-5 py-2" onClick={() => router.push('/')}>
					Idi na naslovnu
				</button>
			</section>
		</div>
	);
};

export default ErrorPage;
