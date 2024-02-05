import { SideBar, EditSubscriber } from '/components';
import { prisma } from '/utils/db';

const Subscriber = ({ subscriber, users, packages, discountModifier }) => {
	return (
		<div className="flex">
			<SideBar active="subscribers" />
			<div className="flex flex-col flex-1 w-0 overflow-hidden">
				<main className="relative flex-1 overflow-y-auto focus:outline-none">
					<div className="py-6">
						<div className="px-4 mx-auto max-w-7xl sm:px-6 md:px-8">
							<h1 className="text-lg text-neutral-600">
								Subscriber - {subscriber?.user?.name} {subscriber?.user?.surname}
							</h1>
						</div>
						<div className="px-4 mx-auto max-w-7xl sm:px-6 md:px-8">
							<div className="py-4">
								<div className="p-5 rounded-lg bg-gray-50">
									<EditSubscriber
										discountModifier={discountModifier}
										users={users}
										packages={packages}
										subscriber={subscriber}
									/>
								</div>
							</div>
						</div>
					</div>
				</main>
			</div>
		</div>
	);
};

export default Subscriber;

export async function getServerSideProps(ctx) {
	const { id } = ctx.params;
	const subscriber = await prisma.subscriber.findUnique({
		where: {
			id: id,
		},
		include: {
			package: true,
			user: true,
		},
	});

	const users = await prisma.user.findMany({
		include: {
			subscriber: true,
		},
	});

	const packages = await prisma.subscriptionPackage.findMany();

	const discountModifier = await prisma.setting.findMany({
		where: {
			name: {
				equals: 'Discount Modifier',
			},
		},
	});

	return {
		props: {
			subscriber,
			users,
			packages,
			discountModifier,
		},
	};
}
