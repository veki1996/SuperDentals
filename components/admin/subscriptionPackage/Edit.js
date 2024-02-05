import { useRouter } from 'next/router';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

const Edit = ({ subscriptionPackage }) => {
	const router = useRouter();
	// States
	const [success, setSuccess] = useState('');

	const priceSerbia = subscriptionPackage?.price?.find((price) => price?.country === 'rs');
	const priceMontenegro = subscriptionPackage?.price?.find((price) => price?.country === 'cg');
	const priceBosnia = subscriptionPackage?.price?.find((price) => price?.country === 'ba');

	const discountSerbia = subscriptionPackage?.discount?.find((discount) => discount?.country === 'rs');
	const discountMontenegro = subscriptionPackage?.discount?.find((discount) => discount?.country === 'cg');
	const discountBosnia = subscriptionPackage?.discount?.find((discount) => discount?.country === 'ba');

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

	const handleSubmitSubscriptionPackage = async (data) => {
		data.subscriptionPackageId = subscriptionPackage.id;

		const response = await fetch('/api/admin/subscriptionPackage/edit', {
			body: JSON.stringify(data),
			method: 'POST',
			headers: {
				'Content-type': 'application/json',
			},
		});

		if (response.status === 200) {
			const resData = await response.json();
			const subscriptionPackage = resData.subscriptionPackage;
			setSuccess(`${subscriptionPackage.name} successfully updated`);
			router.reload();
		}
	};

	return (
		<div>
			<form className="max-w-[600px] m-auto" onSubmit={handleSubmit(handleSubmitSubscriptionPackage)}>
				<label className="label-text">Name</label>
				<input
					className="input input-bordered p-3 w-full mt-1 mb-3"
					name="name"
					{...register('name', { required: 'Name is required.' })}
					type="text"
					defaultValue={subscriptionPackage?.name}
					placeholder="Name..."
				/>
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
				<div className="flex gap-5">
					<div>
						<label className="label-text">Price for Serbia(EUR)</label>
						<input
							className="input input-bordered p-3 w-full mt-1 mb-3"
							name="price"
							{...register('priceSerbia', {
								required: 'Price is required.',
								pattern: {
									value: /^[0-9]+$/,
									message: 'Only numbers are allowed.',
								},
							})}
							type="text"
							defaultValue={priceSerbia?.price}
							placeholder="Price for Serbia..."
						/>
					</div>
					<div>
						<label className="label-text">Discount for Serbia(%)</label>
						<input
							className="input input-bordered p-3 w-full mt-1 mb-3"
							name="discount"
							{...register('discountSerbia', {
								required: 'Discount is required.',
								pattern: {
									value: /^[0-9]+$/,
									message: 'Only numbers are allowed.',
								},
							})}
							type="text"
							defaultValue={discountSerbia?.value}
							placeholder="Discount for Serbia..."
						/>
					</div>
				</div>
				<div className="flex justify-between">
					<div>
						{errors?.priceSerbia && (
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
								<span>{errors.priceSerbia?.message}</span>
							</div>
						)}
					</div>
					<div>
						{errors?.discountSerbia && (
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
								<span>{errors.discountSerbia?.message}</span>
							</div>
						)}
					</div>
				</div>

				<div className="flex gap-5">
					<div>
						<label className="label-text">Price for Montenegro(EUR)</label>
						<input
							className="input input-bordered p-3 w-full mt-1 mb-3"
							name="price"
							{...register('priceMontenegro', {
								required: 'Price is required.',
								pattern: {
									value: /^[0-9]+$/,
									message: 'Only numbers are allowed.',
								},
							})}
							type="text"
							defaultValue={priceMontenegro?.price}
							placeholder="Price for Montenegro..."
						/>
					</div>
					<div>
						<label className="label-text">Discount for Montenegro(%)</label>
						<input
							className="input input-bordered p-3 w-full mt-1 mb-3"
							name="discount"
							{...register('discountMontenegro', {
								required: 'Discount is required.',
								pattern: {
									value: /^[0-9]+$/,
									message: 'Only numbers are allowed.',
								},
							})}
							type="text"
							defaultValue={discountMontenegro?.value}
							placeholder="Discount for Montenegro..."
						/>
					</div>
				</div>
				<div className="flex justify-between">
					<div>
						{errors?.priceMontenegro && (
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
								<span>{errors.priceMontenegro?.message}</span>
							</div>
						)}
					</div>
					<div>
						{errors?.discountMontenegro && (
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
								<span>{errors.discountMontenegro?.message}</span>
							</div>
						)}
					</div>
				</div>

				<div className="flex gap-5">
					<div>
						<label className="label-text">Price for Bosnia(BAM)</label>
						<input
							className="input input-bordered p-3 w-full mt-1 mb-3"
							name="price"
							{...register('priceBosnia', {
								required: 'Price is required.',
								pattern: {
									value: /^[0-9]+$/,
									message: 'Only numbers are allowed.',
								},
							})}
							type="text"
							defaultValue={priceBosnia?.price}
							placeholder="Price for Bosnia..."
						/>
					</div>
					<div>
						<label className="label-text">Discount for Bosnia(%)</label>
						<input
							className="input input-bordered p-3 w-full mt-1 mb-3"
							name="discount"
							{...register('discountBosnia', {
								required: 'Discount is required.',
								pattern: {
									value: /^[0-9]+$/,
									message: 'Only numbers are allowed.',
								},
							})}
							type="text"
							defaultValue={discountBosnia?.value}
							placeholder="Discount for Bosnia..."
						/>
					</div>
				</div>
				<div className="flex justify-between">
					<div>
						{errors?.priceBosnia && (
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
								<span>{errors.priceBosnia?.message}</span>
							</div>
						)}
					</div>
					<div>
						{errors?.discountBosnia && (
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
								<span>{errors.discountBosnia?.message}</span>
							</div>
						)}
					</div>
				</div>
				<button className="btn btn-block btn-primary mb-5">Edit {subscriptionPackage.name}</button>
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
