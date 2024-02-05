import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';

const Create = ({ modal, users, packages, discountModifier }) => {
	const router = useRouter();

	// Use Form instance
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm({
		defaultValues: {},
		mode: 'onChange',
		reValidateMode: 'onChange',
	});

	const handleSubmitSubscriber = async (data) => {
		const filteredPackage = packages.filter((pack) => data.subPackage === pack.id && pack?.price !== '0')[0];
		if (filteredPackage) {
			data.discountedPrice =
				discountModifier?.length > 0 &&
				discountModifier[0]?.defaultValue !== '0' &&
				discountModifier[0]?.defaultValue !== '' &&
				(
					filteredPackage?.price -
					(Number(filteredPackage?.price) / 100) * Number(discountModifier[0]?.defaultValue)
				).toFixed(2);
		}

		const response = await fetch('/api/admin/subscriber/create', {
			body: JSON.stringify(data),
			method: 'POST',
			headers: {
				'Content-type': 'application/json',
			},
		});

		if (response.status === 201) {
			modal(false);
			router.replace(router.asPath);
		}
	};

	return (
		<div>
			<form className="max-w-[600px] m-auto" onSubmit={handleSubmit(handleSubmitSubscriber)}>
				<label className="label-text">Select User</label>
				<select
					className="select select-secondary mt-1 mb-3 w-full"
					placeholder="Select User"
					{...register('user', {
						required: 'User is required.',
					})}
				>
					<option value="" className="invisible">
						Select User
					</option>
					{users.map((user) => {
						if (!user.subscriber) {
							return (
								<option key={user.id} value={user.id}>
									{user.name} {user.surname}
								</option>
							);
						}
					})}
				</select>
				{errors.user?.message && (
					<div className="flex items-center gap-1">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							className="stroke-current flex-shrink-0 h-6 w-6 text-red-600"
							fill="none"
							viewBox="0 0 24 24"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth="2"
								d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
							/>
						</svg>
						<span>{errors.user?.message}</span>
					</div>
				)}
				<label className="label-text">Select Package</label>
				<select
					className="select select-secondary mt-1 mb-3 w-full"
					placeholder="Select Package"
					{...register('subPackage', {
						required: 'Subscription Package is required.',
					})}
				>
					<option value="" className="invisible">
						Select Package
					</option>
					{packages.map((pack) => (
						<option key={pack.id} value={pack.id}>
							{pack.name}
						</option>
					))}
				</select>
				{errors.subPackage?.message && (
					<div className="flex items-center gap-1">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							className="stroke-current flex-shrink-0 h-6 w-6 text-red-600"
							fill="none"
							viewBox="0 0 24 24"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth="2"
								d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
							/>
						</svg>
						<span>{errors.subPackage?.message}</span>
					</div>
				)}
				<label className="label-text">Referral Code</label>
				<input
					className="input input-bordered p-3 w-full mt-1 mb-3"
					name="referalCode"
					{...register('referalCode')}
					type="text"
					placeholder="Referral Code..."
				/>
				<button className="btn btn-block btn-primary mb-5">Add Subscriber</button>
			</form>
		</div>
	);
};

export default Create;
