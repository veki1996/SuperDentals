import { useForm } from 'react-hook-form';

const Newsletter = () => {
	const {
		register,
		handleSubmit,
		formState: { errors },
		reset,
	} = useForm({
		mode: 'onChange',
		reValidateMode: 'onChange',
	});

	const handleNewsletter = async (data) => {
		const response = await fetch('/api/newsletter/create', {
			method: 'POST',
			body: JSON.stringify(data),
			headers: {
				'Content-type': 'application/json',
			},
		});

		if (response.status === 201) {
			alert('You successfully subscribed to our NewsLetter');
			reset();
		}

		if (response.status === 400) {
			const { message } = await response.json();
			alert(message);
			reset();
		}
	};
	return (
		<div className="flex flex-col gap-5">
			<h1 className="text-xl text-cyan-600">Subscribe to our Newsletter for FREE !</h1>
			<form className="flex flex-col gap-3" onSubmit={handleSubmit(handleNewsletter)}>
				<input
					className="border shadow-lg p-3"
					type="email"
					placeholder="Email..."
					{...register('email', { required: true })}
				/>
				{errors.email?.type === 'required' && <span className="text-red-500">Email is required.</span>}

				<button className="border shadow-lg p-3 w-full mt-2 bg-slate-500 text-white font-bold">Subscribe</button>
			</form>
		</div>
	);
};

export default Newsletter;
