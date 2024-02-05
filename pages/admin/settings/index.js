import { SideBar } from '/components';
import { BiShow, BiHide } from 'react-icons/bi';
import { useRouter } from 'next/router';
import { prisma } from '/utils/db';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

const Settings = ({ settings }) => {
	const adminEmailSetting = settings?.find((setting) => setting.name === 'Admin Email');
	const [adminEmail, setAdminEmail] = useState(adminEmailSetting?.defaultValue);

	const router = useRouter();

	const filteredSettings = settings.filter((setting) => setting?.name.includes('Filter'));

	const sortingSettings = settings.filter((setting) => setting?.name.includes('Sort'));

	const socialLinksSettings = settings.filter((setting) => setting?.name.includes('Social'));

	const contactSettings = settings.filter((setting) => setting?.name.includes('Contact'));

	const { register, handleSubmit } = useForm({
		mode: 'onChange',
		reValidateMode: 'onChange',
	});

	const { register: contactRegister, handleSubmit: contactHandleSubmit } = useForm({
		mode: 'onChange',
		reValidateMode: 'onChange',
	});

	const handleFilterActive = async (setting) => {
		const response = await fetch('/api/admin/settings/edit', {
			method: 'POST',
			body: JSON.stringify(setting),
			headers: {
				'Content-type': 'application/json',
			},
		});

		if (response.status === 200) {
			await response.json();
			router.replace(router.asPath, undefined, { scroll: false });
		}
	};

	const handleChangeDefaultCountry = async (e) => {
		const defaultCountry = e.target.value;
		const response = await fetch('/api/admin/settings/editDefaultCountry', {
			method: 'POST',
			body: JSON.stringify({
				defaultCountry: defaultCountry,
				id: settings.filter((setting) => setting.name === 'Default Country')[0].id,
			}),
			headers: {
				'Content-type': 'application/json',
			},
		});

		if (response.status === 200) {
			await response.json();
			router.replace(router.asPath, undefined, { scroll: false });
		}
	};

	const handleSubmitEmail = async () => {
		const response = await fetch('/api/admin/settings/editAdminEmail', {
			method: 'POST',
			body: JSON.stringify({
				adminEmail: adminEmail,
				id: adminEmailSetting.id,
			}),
			headers: {
				'Content-type': 'application/json',
			},
		});

		if (response.status === 200) {
			await response.json();
			router.replace(router.asPath, undefined, { scroll: false });
		}
	};

	const handleSocialLinks = async (data) => {
		const response = await fetch('/api/admin/settings/editSocials', {
			method: 'POST',
			body: JSON.stringify(data),
			headers: {
				'Content-type': 'application/json',
			},
		});

		if (response.status === 200) {
			router.replace(router.asPath);
		}
	};

	const handleContactSettings = async (data) => {
		const response = await fetch('/api/admin/settings/editContactSettings', {
			method: 'POST',
			body: JSON.stringify(data),
			headers: {
				'Content-type': 'application/json',
			},
		});

		if (response.status === 200) {
			router.reload();
		}
	};
	const fetchSettings = async () => {
		const response = await fetch('/api/admin/settings/populateSettings');

		if (response.status === 200) {
			router.replace(router.asPath);
		}
	};

	useEffect(() => {
		fetchSettings();
		if (!adminEmailSetting?.defaultValue) alert('Please set up admin email!');
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<div className="flex">
			<SideBar active="settings" />
			<div className="flex flex-col flex-1 w-0 overflow-hidden">
				<main className="relative flex-1 overflow-y-auto focus:outline-none">
					<div className="py-6">
						<div className="px-4 w-min sm:px-6 md:px-8">
							<h1 className="text-4xl font-bold leading-normal mt-0 mb-2">Settings</h1>
						</div>
						<div className="px-4 mx-auto  w-min sm:px-6 md:px-8">
							<div className="py-4">
								<div className="p-5 rounded-lg bg-gray-50 flex flex-col gap-5 min-w-[800px]">
									<div className="flex items-center justify-between">
										{settings?.filter((setting) => setting.name !== 'Discount Modifier')?.length > 0 && (
											<div className="flex flex-col">
												{filteredSettings.length > 0 && (
													<div>
														<h2 className="text-2xl leading-normal mt-0 mb-2 text-secondary font-[600]">
															Turn on/off filters
														</h2>
														<div className="grid grid-cols-2 gap-x-3">
															{filteredSettings?.map((setting) =>
																setting.active ? (
																	<div key={setting.id} className="flex items-center justify-between">
																		<span>{setting.name}</span>
																		<BiShow
																			className="cursor-pointer text-primary"
																			size={30}
																			onClick={() => handleFilterActive(setting)}
																		/>
																	</div>
																) : (
																	<div key={setting.id} className="flex items-center justify-between">
																		<span>{setting.name}</span>
																		<BiHide
																			className="cursor-pointer text-primary"
																			size={30}
																			onClick={() => handleFilterActive(setting)}
																		/>
																	</div>
																),
															)}
														</div>
													</div>
												)}

												{sortingSettings.length > 0 && (
													<div>
														<h2 className="text-2xl leading-normal mt-0 mb-2 text-secondary font-[600]">
															Turn on/off sorting
														</h2>
														<div className="grid grid-cols-2 gap-x-3">
															{sortingSettings?.map((setting) =>
																setting.active ? (
																	<div key={setting.id} className="flex items-center justify-between">
																		<span>{setting.name}</span>
																		<BiShow
																			className="cursor-pointer text-primary"
																			size={30}
																			onClick={() => handleFilterActive(setting)}
																		/>
																	</div>
																) : (
																	<div key={setting.id} className="flex items-center justify-between">
																		<span>{setting.name}</span>
																		<BiHide
																			className="cursor-pointer text-primary"
																			size={30}
																			onClick={() => handleFilterActive(setting)}
																		/>
																	</div>
																),
															)}
														</div>
													</div>
												)}

												<div className="flex flex-col mt-5">
													{settings?.filter((setting) => setting?.name === 'Default Country')?.length > 0 && (
														<div>
															<h2 className="text-2xl font-[600] leading-normal mt-0 mb-2 text-secondary">
																Change default country filter
															</h2>
															<div className="flex">
																<div className="">
																	{settings?.map(
																		(setting) =>
																			setting.name === 'Default Country' && (
																				<select
																					key={setting.id}
																					className="select select-secondary w-full max-w-xs"
																					defaultValue={setting.defaultValue}
																					onChange={(e) => handleChangeDefaultCountry(e)}
																				>
																					<option value="ba">Bosna I Hercegovina</option>
																					<option value="rs">Srbija</option>
																					<option value="cg">Crna Gora</option>
																				</select>
																			),
																	)}
																</div>
															</div>
														</div>
													)}

													{settings?.filter((setting) => setting?.name === 'Admin Email')?.length > 0 && (
														<div className="flex flex-col mt-5">
															<h2 className="text-2xl font-[600] leading-normal mt-0 mb-2 text-secondary">
																Change admin email
															</h2>
															<div className="grid grid-cols-2 gap-x-3">
																{settings?.map(
																	(setting) =>
																		setting.name === 'Admin Email' && (
																			<div className="flex gap-3" key={setting.id}>
																				<input
																					type="text"
																					placeholder="Type here"
																					className="input input-bordered input-secondary w-full max-w-xs"
																					defaultValue={adminEmail}
																					onChange={(e) => setAdminEmail(e.target.value)}
																				/>
																				<button onClick={handleSubmitEmail} className="btn btn-active btn-primary">
																					Submit email
																				</button>
																			</div>
																		),
																)}
															</div>
														</div>
													)}
												</div>
												{socialLinksSettings?.length > 0 && (
													<div className="mt-2">
														<h2 className="text-2xl font-[600] leading-normal mt-0 mb-2 text-secondary">
															Change social links
														</h2>
														<form onSubmit={handleSubmit(handleSocialLinks)}>
															<div className="flex flex-wrap gap-3">
																{socialLinksSettings?.map((setting) => (
																	<div key={setting?.id} className="flex flex-col">
																		<label className="text-[#727272] font-[500]">{setting?.name?.split(' ')[1]}</label>
																		<input
																			className="input input-secondary"
																			type="text"
																			defaultValue={setting?.defaultValue}
																			placeholder={setting?.name?.split(' ')[1]}
																			{...register(setting?.name?.split(' ')[1].toLowerCase())}
																		/>
																	</div>
																))}
															</div>
															<button className="button py-[5px] text-[18px] font-[600] mt-2">Submit</button>
														</form>
													</div>
												)}
												{contactSettings?.length > 0 && (
													<div className="mt-2">
														<h2 className="text-2xl font-[600] leading-normal mt-0 mb-2 text-secondary">
															Change contact settings
														</h2>
														<form onSubmit={contactHandleSubmit(handleContactSettings)}>
															<div className="flex flex-wrap gap-3">
																{contactSettings?.map((setting) => (
																	<div key={setting?.id} className="flex flex-col">
																		<label className="text-[#727272] font-[500]">{setting?.name}</label>
																		<input
																			className="input input-secondary"
																			type="text"
																			defaultValue={setting?.defaultValue}
																			placeholder={setting?.name}
																			{...contactRegister(setting?.name?.split(' ').join(''))}
																		/>
																	</div>
																))}
															</div>
															<button className="button py-[5px] text-[18px] font-[600] mt-2">Submit</button>
														</form>
													</div>
												)}
											</div>
										)}
									</div>
								</div>
							</div>
						</div>
					</div>
				</main>
			</div>
		</div>
	);
};

export default Settings;

export async function getServerSideProps() {
	const settings = await prisma.setting.findMany();

	return {
		props: {
			settings,
		},
	};
}
