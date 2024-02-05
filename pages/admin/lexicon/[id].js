import { SideBar, EditLexicon } from '/components';
import { prisma } from '/utils/db';

const Lexicon = ({ lexicon }) => {
	return (
		<div className="flex">
			<SideBar active="lexicon" />
			<div className="flex flex-col flex-1 w-0 overflow-hidden">
				<main className="relative flex-1 overflow-y-auto focus:outline-none">
					<div className="py-6">
						<div className="px-4 mx-auto max-w-7xl sm:px-6 md:px-8">
							<div className="py-4">
								<div className="p-5 rounded-lg bg-gray-50">
									<EditLexicon lexicon={lexicon} />
								</div>
							</div>
						</div>
					</div>
				</main>
			</div>
		</div>
	);
};

export default Lexicon;

export async function getServerSideProps(ctx) {
	const { id } = ctx.params;
	const lexicon = await prisma.lexicon.findUnique({
		where: {
			id: id,
		},
	});

	return {
		props: {
			lexicon,
		},
	};
}
