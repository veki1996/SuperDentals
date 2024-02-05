import { SideBar, EditService } from '/components';
import { prisma } from '/utils/db';

const Service = ({ service, categories }) => {
	const englishServiceName = service?.name?.find((el) => el?.county === 'gb');
	return (
		<div className="flex">
			<SideBar active="services" />
			<div className="flex flex-col flex-1 w-0 overflow-hidden">
				<main className="relative flex-1 overflow-y-auto focus:outline-none">
					<div className="py-6">
						<div className="px-4 mx-auto max-w-7xl sm:px-6 md:px-8">
							<h1 className="text-lg text-neutral-600">{englishServiceName?.name}</h1>
						</div>
						<div className="px-4 mx-auto max-w-7xl sm:px-6 md:px-8">
							<div className="py-4">
								<div className="p-5 rounded-lg bg-gray-50">
									<EditService service={service} categories={categories} />
								</div>
							</div>
						</div>
					</div>
				</main>
			</div>
		</div>
	);
};

export default Service;

export async function getServerSideProps(ctx) {
	const { id } = ctx.params;
	const service = await prisma.service.findUnique({
		where: {
			id: id,
		},
		include: {
			image: true,
		},
	});

	const categories = await prisma.serviceCategory.findMany();

	return {
		props: {
			service,
			categories,
		},
	};
}
