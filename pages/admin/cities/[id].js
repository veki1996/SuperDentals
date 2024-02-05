import { SideBar, EditCity } from '/components';
import { prisma } from '/utils/db';

const City = ({ city }) => {
	return (
		<div className="flex">
			<SideBar active="cities" />
			<div className="flex flex-col flex-1 w-0 overflow-hidden">
				<main className="relative flex-1 overflow-y-auto focus:outline-none">
					<div className="py-6">
						<div className="px-4 mx-auto max-w-7xl sm:px-6 md:px-8">
							<h1 className="text-lg text-neutral-600">{city.cityName}</h1>
						</div>
						<div className="px-4 mx-auto max-w-7xl sm:px-6 md:px-8">
							<div className="py-4">
								<div className="p-5 rounded-lg bg-gray-50">
									<EditCity city={city} />
								</div>
							</div>
						</div>
					</div>
				</main>
			</div>
		</div>
	);
};

export default City;

export async function getServerSideProps(ctx) {
	const { id } = ctx.params;
	const city = await prisma.location.findUnique({
		where: {
			id: id,
		},
	});

	return {
		props: {
			city,
		},
	};
}
