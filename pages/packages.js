import Image from 'next/image';
import { Nav, Footer, HeadMeta, PackageCard, PackagesTable } from '/components';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Navigation } from 'swiper';
import { prisma } from '/utils/db';
import { FaChevronRight } from 'react-icons/fa';
import { BiError } from 'react-icons/bi';
import { selectedPackageAtom } from '/store';
import useTranslation from 'next-translate/useTranslation';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { useRouter } from 'next/router';
import { useAtom } from 'jotai';
import { useState } from 'react';
import { getSession } from 'next-auth/react';

const Packages = ({ packages, user }) => {
	const router = useRouter();
	const { t } = useTranslation('packages');
	const { subscription, referral } = router.query;

	const [error, setError] = useState('');
	const [selectedPackage] = useAtom(selectedPackageAtom);

	const selectedCountry = user?.country;

	const handleContinue = () => {
		if (!selectedPackage) {
			setError('Morate izabrati paket.');
			return;
		}
		router.push(
			`/payment${subscription ? `?subscription=${subscription}` : ''}${referral ? `&referral=${referral}` : ''}`,
		);
	};

	return (
		<div>
			<Nav />
			<HeadMeta
				title="Paketi Pretplate"
				link={`${process.env.BASE_URL}/packages`}
				content={'superdentals.com'}
				description="Tražite stomatologa po svojoj mjeri? Na pravom ste mjestu."
				image={`${process.env.BASE_URL}/images/logo.jpg`}
			/>

			<section className="container mx-auto px-6 md:px-16 flex flex-col lg:flex-row py-10 gap-10">
				<div className="flex flex-col gap-3 basis-[65%]">
					<div className="flex flex-col gap-3">
						<h1 className="text-[20px] md:text-[32px] font-[700] text-primaryColor">
							Još jedan korak do novih pacijenata...
						</h1>
						<p className="text-[18px] text-black">
							<span className=" font-[700]">PREDNOSTI</span> koje ostvarujete učlanjenjem u jedinstvenu bazu stomatologa
							su sljedeće:
						</p>
					</div>
					<div className="text-[18px] flex flex-col gap-4 text-black">
						<p>
							<span className="font-[700]">Javno dostupne kontakt informacije stomatologa</span> – portal je BESPLATNO
							dostupan svim korisnicima 24/7;
						</p>
						<p>
							<span className="font-[700]">Bez gubljenja vremena</span> - pacijenti uslugu biraju shodno svojim
							preferencijama, tako da Vas kontaktiraju samo oni kojima odgovarate i nema bespotrebnog gubljenja vremena
							i komplikacije;
						</p>
						<p>
							<span className="font-[700]">Nema posrednika</span> – sve direktno dogovarate sa pacijentom kojem Vaša
							usluga treba;
						</p>
						<p>
							<span className="font-[700]">Bez provizije</span> – za urađene usluge ne plaćate nikakvu proviziju i
							kompletan naplaćeni iznos je Vaš;
						</p>
						<p>
							<span className="font-[700]">Nema ograničenja</span> – mogu Vas pronaći pacijenti širom Evrope, gdje se
							portal aktivno promoviše;
						</p>
						<p>
							<span className="font-[700]">Jednostavnost</span> – pretraga stomatologa je izuzetno jednostavna i
							olakšana sa ciljem povećanja broja korisnika i pacijenata;
						</p>
						<p>
							Prepoznajte i Vi svoju priliku i šansu da se na ovakav način predstavite i da tako povećate svoju
							prisutnost na tržištu, broj poslova i vlastite prihode.
						</p>
						<p className="font-[700]">Na Vama je samo da odaberete paket koji Vam odgovara!</p>
					</div>
				</div>
				<div className="flex justify-center items-center basis-[35%]">
					<div className="relative w-[200px] md:w-[350px] xl:w-[400px] h-[200px]">
						<Image alt="logo" src="/packages-page-assets/logo.svg" layout="fill" />
					</div>
				</div>
			</section>
			<section className="container mx-auto px-6 md:px-16 pb-10">
				<div className="lg:hidden">
					<Swiper
						centeredSlides={true}
						speed={600}
						modules={[Pagination, Navigation]}
						pagination={{ clickable: true }}
						spaceBetween={50}
					>
						{packages?.map((subPackage) => (
							<SwiperSlide key={subPackage.id} className="p-3">
								<PackageCard selectedCountry={selectedCountry} subPackage={subPackage} />
							</SwiperSlide>
						))}
					</Swiper>
				</div>
				<div className="hidden lg:block mt-20">
					<PackagesTable selectedCountry={selectedCountry} packages={packages} setError={setError} />
					<div className="flex flex-row justify-between items-center gap-12">
						<div>
							<h1 className="font-bold xl:text-[20px] text-[16px] pl-5">
								Nakon aktivacije {t('main.text-4')} od dana aktiviranja.
							</h1>
						</div>
						<div></div>
						<div className="flex flex-col">
							<button className="button font-[600] px-16 flex items-center gap-2" onClick={handleContinue}>
								<span>Nastavi</span> <FaChevronRight fontWeight={700} />
							</button>
							{error !== '' && (
								<p className="font-[600] text-secondary flex items-center gap-1">
									<BiError size={25} color="red" /> <span>{error}</span>
								</p>
							)}
						</div>
					</div>
				</div>
			</section>

			<Footer />
		</div>
	);
};

export default Packages;

export async function getServerSideProps(ctx) {
	const packages = await prisma.subscriptionPackage.findMany({
		orderBy: {
			createdAt: 'asc',
		},
	});

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
			packages,

			user,
		},
	};
}
