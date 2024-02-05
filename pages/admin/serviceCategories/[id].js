import { SideBar, EditServiceCategory } from '/components';
import { prisma } from '/utils/db';

const ServiceCategory = ({ serviceCategory }) => {
	return (
		<div className="flex">
			<SideBar active="serviceCategories" />
			<div className="flex flex-col flex-1 w-0 overflow-hidden">
				<main className="relative flex-1 overflow-y-auto focus:outline-none">
					<div className="py-6">
						<div className="px-4 mx-auto max-w-7xl sm:px-6 md:px-8">
							<h1 className="text-lg text-neutral-600">{serviceCategory.name}</h1>
						</div>
						<div className="px-4 mx-auto max-w-7xl sm:px-6 md:px-8">
							<div className="py-4">
								<div className="p-5 rounded-lg bg-gray-50">
									<EditServiceCategory serviceCategory={serviceCategory} />
								</div>
							</div>
						</div>
					</div>
				</main>
			</div>
		</div>
	);
};

export default ServiceCategory;

export async function getServerSideProps(ctx) {
	const { id } = ctx.params;
	const serviceCategory = await prisma.serviceCategory.findUnique({
		where: {
			id: id,
		},
	});

	return {
		props: {
			serviceCategory,
		},
	};
}
