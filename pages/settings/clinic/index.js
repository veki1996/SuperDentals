import { getSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { Nav, Footer } from '/components';
import { prisma } from '/utils/db';

const Clinic = ({ user }) => {
	return (
		<div>
			<Nav />
			<section className="min-h-[calc(100vh-(189px*2))]">
				<section className=" container mx-auto px-6 md:px-16 py-16 flex flex-col items-center gap-16">
					<h1 className="text-center text-primaryColor text-[32px] font-[700]">Izmijeni ordinacije</h1>
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
						{user?.clinics?.map((clinic) => (
							<Link key={clinic.id} href={`/settings/clinic/${clinic.id}`}>
								<div className="h-[210px] w-[210px] shadow-container hover:shadow-nav transition-shadow duration-300 rounded-[8px] flex flex-col gap-2 cursor-pointer">
									<div className="relative h-[120px] flex justify-center mt-4">
										<Image alt={clinic.name} src="/settings-clinic-page-assets/clinic.svg" layout="fill" />
									</div>
									<div className="w-full flex justify-center items-center h-[55px]">
										<h2 className="uppercase text-[#21231E] font-[700] w-full text-center">{clinic?.name}</h2>
									</div>
								</div>
							</Link>
						))}
						<Link href={`/create-clinic`}>
							<div className="h-[210px] w-[210px] shadow-container hover:shadow-nav transition-shadow duration-300 rounded-[8px] flex flex-col gap-2 cursor-pointer">
								<div className="relative h-[120px] flex justify-center mt-4">
									<Image alt="Dodaj kliniku" src="/settings-clinic-page-assets/add-clinic.svg" layout="fill" />
								</div>
								<div className="w-full flex justify-center items-center h-[55px]">
									<h2 className="uppercase text-[#21231E] font-[700] w-full text-center">Dodaj kliniku</h2>
								</div>
							</div>
						</Link>
					</div>
				</section>
			</section>
			<Footer />
		</div>
	);
};

export default Clinic;

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

	if (user?.clinics?.length === 0) {
		return {
			redirect: {
				destination: '/create-clinic',
				permanent: false,
			},
		};
	}

	return {
		props: {
			user,
		},
	};
}
