import { SideBar, EditClinicAdmin } from '/components';
import { prisma } from '/utils/db';
const Clinics = ({ clinic, services, images }) => {
	return (
		<div className="flex">
			<SideBar active="clinics" />

			<div className="flex flex-col flex-1 w-0 overflow-hidden">
				<main className="relative flex-1 overflow-y-auto focus:outline-none">
					<div className="py-6">
						<div className="px-4 mx-auto max-w-7xl sm:px-6 md:px-8">
							<h1 className="text-lg text-neutral-600">{clinic.name}</h1>
						</div>
						<div className="px-4 mx-auto max-w-7xl sm:px-6 md:px-8">
							<div className="py-4">
								<div className=" p-5 rounded-lg bg-gray-50 ">
									<EditClinicAdmin allImages={images} clinic={clinic} services={services} />
								</div>
							</div>
						</div>
					</div>
				</main>
			</div>
		</div>
	);
};

export default Clinics;

export async function getServerSideProps(ctx) {
	const { id } = ctx.params;

	const clinic = await prisma.clinic.findUnique({
		where: {
			id: id,
		},
		include: {
			services: true,
			clinicServices: {
				include: {
					service: true,
				},
			},
			images: true,
		},
	});

	const services = await prisma.service.findMany({
		orderBy: {
			order: 'asc',
		},
	});

	const airports = await prisma.airport.findMany();

	const images = await prisma.image.findMany();

	return {
		props: {
			clinic,
			airports,
			services,
			images,
		},
	};
}
