import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';

const Create = ({ modal }) => {
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

	const handleSubmitUser = async (data) => {
		const response = await fetch('/api/admin/user/create', {
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

		if (response.status === 400) {
			const { message } = await response.json();
			alert(message);
		}
	};

	return (
		<div>
			<form className="max-w-[600px] m-auto" onSubmit={handleSubmit(handleSubmitUser)}>
				<div
					style={{
						display: 'flex',
						textAlign: 'center',
						justifyContent: 'center',
					}}
				></div>
				<div className="flex justify-between w-full ">
					<label className="label-text w-1/2">Name</label>
					<label className="label-text w-1/2 ml-4">Surname</label>
				</div>
				<div className="flex items-center gap-2 mb-2 mt-1">
					<input
						className="input input-bordered w-full max-w-xs"
						name="name"
						{...register('name', { required: 'Name is required.' })}
						type="text"
						placeholder="Name"
					/>
					<input
						className="input input-bordered w-full max-w-xs"
						type="text"
						{...register('surname', { required: 'Surname is required.' })}
						placeholder="Surname"
					/>
				</div>
				<div className="flex justify-between text-right">
					<div>
						{errors.name?.type === 'required' && (
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
								<span>{errors.name?.message}</span>
							</div>
						)}
					</div>
					{errors.surname?.type === 'required' && (
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
							<span>{errors.surname?.message}</span>
						</div>
					)}
				</div>
				<label className="label-text">Number</label>
				<input
					className="input input-bordered p-3 w-full mb-3 mt-1"
					type="text"
					{...register('phone', {
						required: 'Broj telefona je potreban.',
						minLength: {
							value: 8,
							message: 'Najmanje 8 cifara',
						},
					})}
					placeholder="Number"
				/>
				{errors.phone?.message && (
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
						<span>{errors.phone?.message}</span>
					</div>
				)}
				<label className="label-text">Email</label>
				<input
					className="input input-bordered p-3 w-full mb-4 mt-1"
					type="email"
					placeholder="Email"
					{...register('email', { required: 'Email is required.' })}
				/>
				{errors.email?.type === 'required' && (
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
						<span>{errors.email?.message}</span>
					</div>
				)}
				<label className="label-text">Password</label>
				<input
					className="input input-bordered p-3 w-full mb-4 mt-1"
					type="text"
					placeholder="Password..."
					{...register('password', {
						required: 'Password is required.',
						pattern: {
							value: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/i,
							message: 'Invalid password format (One Uppercase, one lowercase, and special character)',
						},
						minLength: {
							value: 8,
							message: 'Password must have at least 8 characters',
						},
					})}
				/>
				{errors.password?.message && (
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
						<span>{errors.password?.message}</span>
					</div>
				)}
				<label className="label-text">Referral Code</label>
				<input
					className="input input-bordered p-3 w-full mb-4 mt-1"
					type="text"
					placeholder="Referral Code..."
					{...register('referalCode', { required: 'Referal Code is required.' })}
				/>
				{errors.referalCode?.type === 'required' && (
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
						<span>{errors.referalCode?.message}</span>
					</div>
				)}

				<button className="btn btn-block btn-primary mb-5">Add User</button>
			</form>
		</div>
	);
};

export default Create;
