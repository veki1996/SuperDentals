import { prisma } from '/utils/db';
import { EditClinic, Nav, Footer } from '/components';

const Clinic = ({ clinic, services, images, clinicViews }) => {
	return (
		<div>
			<Nav />
			<section className="min-h-[calc(100vh-(189px*2))]">
				<EditClinic clinicViews={clinicViews} clinic={clinic} services={services} allImages={images} />
			</section>
			<Footer />
		</div>
	);
};
export default Clinic;

export async function getServerSideProps(ctx) {
	const { id } = ctx.query;

	const clinic = await prisma.clinic.findUnique({
		where: {
			id: id,
		},
		include: {
			employees: {
				include: {
					images: true,
				},
			},
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
		include: {
			clinicServices: {
				include: {
					service: true,
				},
			},
		},
	});

	const images = await prisma.image.findMany();

	const clinicViews = await prisma.viewsCounter.findMany({
		where: {
			clinicId: {
				equals: clinic?.id,
			},
		},
	});

	return {
		props: {
			clinic,
			services,
			images,
			clinicViews,
		},
	};
}
