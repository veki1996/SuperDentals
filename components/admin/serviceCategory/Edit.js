import { useRouter } from 'next/router';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

const Edit = ({ serviceCategory }) => {
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

	const handleSubmitServiceCategory = async (data) => {
		data.serviceCategoryId = serviceCategory.id;

		const response = await fetch('/api/admin/serviceCategory/edit', {
			body: JSON.stringify(data),
			method: 'POST',
			headers: {
				'Content-type': 'application/json',
			},
		});

		if (response.status === 200) {
			const resData = await response.json();
			const serviceCategory = resData.serviceCategory;
			setSuccess(`${serviceCategory.name} successfully updated`);
			router.reload();
		}
	};

	return (
		<div>
			<form className="max-w-[600px] m-auto" onSubmit={handleSubmit(handleSubmitServiceCategory)}>
				<label className="label-text">Name</label>
				<input
					className="input input-bordered p-3 w-full mt-1 mb-3"
					name="name"
					{...register('name', { required: 'Name is required.' })}
					type="text"
					defaultValue={serviceCategory?.name}
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

				<button className="btn btn-block btn-primary mb-5">Edit {serviceCategory.name}</button>
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
