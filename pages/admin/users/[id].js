import { SideBar, EditUser } from '/components';
import { prisma } from '/utils/db';

const Users = ({ user }) => {
	return (
		<div className="flex">
			<SideBar active="users" />
			<div className="flex flex-col flex-1 w-0 overflow-hidden">
				<main className="relative flex-1 overflow-y-auto focus:outline-none">
					<div className="py-6">
						<div className="px-4 mx-auto max-w-7xl sm:px-6 md:px-8">
							<h1 className="text-lg text-neutral-600">
								{user.name} {user.surname}
							</h1>
						</div>
						<div className="px-4 mx-auto max-w-7xl sm:px-6 md:px-8">
							<div className="py-4">
								<div className="p-5 rounded-lg bg-gray-50">
									<EditUser user={user} />
								</div>
							</div>
						</div>
					</div>
				</main>
			</div>
		</div>
	);
};

export default Users;

export async function getServerSideProps(ctx) {
	const { id } = ctx.params;
	const user = await prisma.user.findUnique({
		where: {
			id: id,
		},
		include: {
			subscriber: true,
			clinics: true,
		},
	});

	return {
		props: {
			user,
		},
	};
}
