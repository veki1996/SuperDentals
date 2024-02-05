import { SideBar, EditAirport } from '/components';
import { prisma } from '/utils/db';

const Airport = ({ airport, cities }) => {
	return (
		<div className="flex">
			<SideBar active="airports" />
			<div className="flex flex-col flex-1 w-0 overflow-hidden">
				<main className="relative flex-1 overflow-y-auto focus:outline-none">
					<div className="py-6">
						<div className="px-4 mx-auto max-w-7xl sm:px-6 md:px-8">
							<h1 className="text-lg text-neutral-600">{airport.name}</h1>
						</div>
						<div className="px-4 mx-auto max-w-7xl sm:px-6 md:px-8">
							<div className="py-4">
								<div className="p-5 rounded-lg bg-gray-50">
									<EditAirport airport={airport} cities={cities} />
								</div>
							</div>
						</div>
					</div>
				</main>
			</div>
		</div>
	);
};

export default Airport;

export async function getServerSideProps(ctx) {
	const { id } = ctx.params;
	const airport = await prisma.airport.findUnique({
		where: {
			id: id,
		},
		include: {
			location: true,
		},
	});

	const cities = await prisma.location.findMany({
		include: {
			airport: true,
		},
	});

	return {
		props: {
			airport,
			cities,
		},
	};
}
