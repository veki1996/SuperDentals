import { useRouter } from 'next/router';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

const Edit = ({ subscriber, packages }) => {
	const router = useRouter();
	// States
	const [success, setSuccess] = useState('');

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
		data.subscriberId = subscriber.id;

		const filteredPackage = packages.filter((pack) => data.subPackage === pack.id && pack?.price !== '0')[0];
		if (!filteredPackage) {
			data.discountedPrice = '0';
		}

		const response = await fetch('/api/admin/subscriber/edit', {
			body: JSON.stringify(data),
			method: 'POST',
			headers: {
				'Content-type': 'application/json',
			},
		});

		if (response.status === 200) {
			const { subscriber } = await response.json();
			if (subscriber?.approved) {
				await fetch('/api/admin/payments/edit', {
					method: 'POST',
					body: JSON.stringify({ uid: subscriber?.UID }),
					headers: {
						'Content-type': 'application/json',
					},
				});
			}
			setSuccess(`Subscriber succesfully updated`);
			router.reload();
		}
	};
	return (
		<div>
			<form className="max-w-[600px] m-auto" onSubmit={handleSubmit(handleSubmitSubscriber)}>
				<label className="label-text">Select User</label>
				<select
					className="select select-secondary mt-1 mb-3 w-full"
					placeholder="Select User"
					{...register('subPackage', {
						required: 'Subscription Package is required.',
					})}
					defaultValue={subscriber.package.id}
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
					className="input input-bordered p-3 w-full mt-1 mb-3 disabled"
					name="referalCode"
					{...register('referalCode')}
					disabled
					defaultValue={subscriber?.referalCode}
					type="text"
					placeholder="Referral Code..."
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
						<span>{errors.name?.message}</span>
					</div>
				)}
				<label className="label cursor-pointer flex items-center gap-3 mb-3">
					<span className="label-text text-lg">Subscriber Approved</span>
					<input
						className="checkbox checkbox-primary"
						type="checkbox"
						defaultChecked={subscriber?.approved}
						{...register('approved')}
					/>
				</label>
				<label className="label-text">Valid To Date</label>
				<input
					className="input input-bordered p-3 w-full mt-1 mb-3"
					name="validDate"
					{...register('validDate')}
					type="date"
					defaultValue={subscriber?.validToDate}
					placeholder="Valid To Date..."
				/>
				<button className="btn btn-block btn-primary mb-5">Edit Subscriber</button>
				{success !== '' && (
					<div className="alert alert-success shadow-lg">
						<div>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								className="stroke-current flex-shrink-0 h-6 w-6"
								fill="none"
								viewBox="0 0 24 24"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth="2"
									d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
								/>
							</svg>
							<span>{success}</span>
						</div>
					</div>
				)}
			</form>
		</div>
	);
};

export default Edit;
