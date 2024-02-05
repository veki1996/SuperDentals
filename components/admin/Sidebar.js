import Link from 'next/link';

import {
	MdOutlineDashboard,
	MdOutlineMedicalServices,
	MdOutlineMapsHomeWork,
	MdOutlineLocalAirport,
	MdPayment,
} from 'react-icons/md';
import { ImList2 } from 'react-icons/im';
import { FiUsers, FiSettings } from 'react-icons/fi';
import { RiVipLine, RiAdvertisementLine } from 'react-icons/ri';
import { TbDental } from 'react-icons/tb';
import { BiClinic } from 'react-icons/bi';
import { RiVipCrown2Line } from 'react-icons/ri';
import { TbBusinessplan } from 'react-icons/tb';
import { TiSortAlphabetically } from 'react-icons/ti';
import { FaQuestionCircle } from 'react-icons/fa';
import Image from 'next/image';

const SideBar = ({ active }) => {
	return (
		<div>
			<div className="flex  overflow-hidden bg-white min-h-full h-screen">
				<div className="hidden md:flex md:flex-shrink-0 ">
					<div className="flex flex-col w-64">
						<div className="flex flex-col flex-grow pt-5 overflow-y-auto bg-secondary border-r">
							<div className="flex flex-col items-center flex-shrink-0 px-4 ">
								<Link href="/">
									<div className="inline-flex items-center w-full px-4 py-2 mt-1 text-base text-white cursor-pointer">
										<Image alt="Logo" src="/home-page-assets/footer-logo.svg" width={300} height={90} />
									</div>
								</Link>
							</div>
							<div className="flex flex-col flex-grow px-4 mt-5">
								<nav className="flex-1 space-y-1 bg-secondary">
									<ul>
										<li>
											<Link href="/admin/dashboard">
												<div
													className={`inline-flex items-center w-full px-4 py-2 mt-1 text-base text-white transition duration-500 ease-in-out transform border-primary rounded-lg hover:border-primary focus:shadow-outline hover:bg-primary cursor-pointer ${
														active === 'dashboard' && 'bg-primary'
													}`}
												>
													<MdOutlineDashboard size={20} />
													<span className="ml-4"> Dashboard</span>
												</div>
											</Link>
										</li>

										<li>
											<Link href="/admin/users">
												<div
													className={`inline-flex items-center w-full px-4 py-2 mt-1 text-base text-white transition duration-500 ease-in-out transform border-primary rounded-lg hover:border-primary focus:shadow-outline hover:bg-primary cursor-pointer ${
														active === 'users' && 'bg-primary'
													}`}
												>
													<FiUsers size={20} />
													<span className="ml-4">Users</span>
												</div>
											</Link>
										</li>
										<li>
											<Link href="/admin/clinics">
												<div
													className={`inline-flex items-center w-full px-4 py-2 mt-1 text-base text-white transition duration-500 ease-in-out transform border-primary rounded-lg hover:border-primary focus:shadow-outline hover:bg-primary cursor-pointer ${
														active === 'clinics' && 'bg-primary'
													}`}
												>
													<BiClinic size={20} />
													<span className="ml-4">Clinics</span>
												</div>
											</Link>
										</li>
										<li>
											<Link href="/admin/employees">
												<div
													className={`inline-flex items-center w-full px-4 py-2 mt-1 text-base text-white transition duration-500 ease-in-out transform border-primary rounded-lg hover:border-primary focus:shadow-outline hover:bg-primary cursor-pointer ${
														active === 'employees' && 'bg-primary'
													}`}
												>
													<TbDental size={20} />
													<span className="ml-4">Employees</span>
												</div>
											</Link>
										</li>
										<li>
											<Link href="/admin/subscribers">
												<div
													className={`inline-flex items-center w-full px-4 py-2 mt-1 text-base text-white transition duration-500 ease-in-out transform border-primary rounded-lg hover:border-primary focus:shadow-outline hover:bg-primary cursor-pointer ${
														active === 'subscribers' && 'bg-primary'
													}`}
												>
													<RiVipCrown2Line size={20} />
													<span className="ml-4"> Subscribers</span>
												</div>
											</Link>
										</li>

										<li>
											<Link href="/admin/services">
												<div
													className={`inline-flex items-center w-full px-4 py-2 mt-1 text-base text-white transition duration-500 ease-in-out transform border-primary rounded-lg hover:border-primary focus:shadow-outline hover:bg-primary cursor-pointer ${
														active === 'services' && 'bg-primary'
													}`}
												>
													<MdOutlineMedicalServices size={20} />
													<span className="ml-4"> Services</span>
												</div>
											</Link>
										</li>
										<li className="hidden">
											<Link href="/admin/serviceCategories">
												<div
													className={`inline-flex items-center w-full px-4 py-2 mt-1 text-base text-white transition duration-500 ease-in-out transform border-primary rounded-lg hover:border-primary focus:shadow-outline hover:bg-primary cursor-pointer ${
														active === 'serviceCategories' && 'bg-primary'
													}`}
												>
													<ImList2 size={20} />
													<span className="ml-4"> Service Categories</span>
												</div>
											</Link>
										</li>
										<li>
											<Link href="/admin/cities">
												<div
													className={`inline-flex items-center w-full px-4 py-2 mt-1 text-base text-white transition duration-500 ease-in-out transform border-primary rounded-lg hover:border-primary focus:shadow-outline hover:bg-primary cursor-pointer ${
														active === 'cities' && 'bg-primary'
													}`}
												>
													<MdOutlineMapsHomeWork size={20} />
													<span className="ml-4"> Cities</span>
												</div>
											</Link>
										</li>
										<li>
											<Link href="/admin/airports">
												<div
													className={`inline-flex items-center w-full px-4 py-2 mt-1 text-base text-white transition duration-500 ease-in-out transform border-primary rounded-lg hover:border-primary focus:shadow-outline hover:bg-primary cursor-pointer ${
														active === 'airports' && 'bg-primary'
													}`}
												>
													<MdOutlineLocalAirport size={20} />
													<span className="ml-4"> Airports</span>
												</div>
											</Link>
										</li>
										<li>
											<Link href="/admin/packages">
												<div
													className={`inline-flex items-center w-full px-4 py-2 mt-1 text-base text-white transition duration-500 ease-in-out transform border-primary rounded-lg hover:border-primary focus:shadow-outline hover:bg-primary cursor-pointer ${
														active === 'packages' && 'bg-primary'
													}`}
												>
													<TbBusinessplan size={20} />
													<span className="ml-4"> Packages</span>
												</div>
											</Link>
										</li>
										<li>
											<Link href="/admin/payments">
												<div
													className={`inline-flex items-center w-full px-4 py-2 mt-1 text-base text-white transition duration-500 ease-in-out transform border-primary rounded-lg hover:border-primary focus:shadow-outline hover:bg-primary cursor-pointer ${
														active === 'payments' && 'bg-primary'
													}`}
												>
													<MdPayment size={20} />
													<span className="ml-4"> Payments</span>
												</div>
											</Link>
										</li>
										<li>
											<Link href="/admin/partners">
												<div
													className={`inline-flex items-center w-full px-4 py-2 mt-1 text-base text-white transition duration-500 ease-in-out transform border-primary rounded-lg hover:border-primary focus:shadow-outline hover:bg-primary cursor-pointer ${
														active === 'partners' && 'bg-primary'
													}`}
												>
													<RiVipLine size={20} />
													<span className="ml-4"> Partners</span>
												</div>
											</Link>
										</li>

										<li>
											<Link href="/admin/banners">
												<div
													className={`inline-flex items-center w-full px-4 py-2 mt-1 text-base text-white transition duration-500 ease-in-out transform border-primary rounded-lg hover:border-primary focus:shadow-outline hover:bg-primary cursor-pointer ${
														active === 'banners' && 'bg-primary'
													}`}
												>
													<RiAdvertisementLine size={20} />
													<span className="ml-4"> Banners</span>
												</div>
											</Link>
										</li>
										<li>
											<Link href="/admin/faq">
												<div
													className={`inline-flex items-center w-full px-4 py-2 mt-1 text-base text-white transition duration-500 ease-in-out transform border-primary rounded-lg hover:border-primary focus:shadow-outline hover:bg-primary cursor-pointer ${
														active === 'faq' && 'bg-primary'
													}`}
												>
													<FaQuestionCircle size={20} />
													<span className="ml-4"> FAQ</span>
												</div>
											</Link>
										</li>
										<li>
											<Link href="/admin/lexicon">
												<div
													className={`inline-flex items-center w-full px-4 py-2 mt-1 text-base text-white transition duration-500 ease-in-out transform border-primary rounded-lg hover:border-primary focus:shadow-outline hover:bg-primary cursor-pointer ${
														active === 'lexicon' && 'bg-primary'
													}`}
												>
													<TiSortAlphabetically size={20} />
													<span className="ml-4"> Dental Lexicon</span>
												</div>
											</Link>
										</li>
										<li>
											<Link href="/admin/settings">
												<div
													className={`inline-flex items-center w-full px-4 py-2 mt-1 text-base text-white transition duration-500 ease-in-out transform border-primary rounded-lg hover:border-primary focus:shadow-outline hover:bg-primary cursor-pointer ${
														active === 'settings' && 'bg-primary'
													}`}
												>
													<FiSettings size={20} />
													<span className="ml-4"> Settings</span>
												</div>
											</Link>
										</li>
									</ul>
								</nav>
							</div>
							<div className="flex flex-shrink-0 p-4 px-4 bg-primary">
								<a href="#" className="flex-shrink-0 block w-full group">
									<div className="flex items-center">
										<div className="ml-3">
											<p className="text-sm font-medium text-white">SuperDENTALS</p>
										</div>
									</div>
								</a>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default SideBar;
