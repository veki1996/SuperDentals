import { SideBar, EditFAQ } from '/components';
import { prisma } from '/utils/db';

const FAQ = ({ faq }) => {
	return (
		<div className="flex">
			<SideBar active="faq" />
			<div className="flex flex-col flex-1 w-0 overflow-hidden">
				<main className="relative flex-1 overflow-y-auto focus:outline-none">
					<div className="py-6">
						<div className="px-4 mx-auto max-w-7xl sm:px-6 md:px-8">
							<div className="py-4">
								<div className="p-5 rounded-lg bg-gray-50">
									<EditFAQ faq={faq} />
								</div>
							</div>
						</div>
					</div>
				</main>
			</div>
		</div>
	);
};

export default FAQ;

export async function getServerSideProps(ctx) {
	const { id } = ctx.params;
	const faq = await prisma.faq.findUnique({
		where: {
			id: id,
		},
	});

	return {
		props: {
			faq,
		},
	};
}
