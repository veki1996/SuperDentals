import { useState } from 'react';
import { useForm } from 'react-hook-form';
import useTranslation from 'next-translate/useTranslation';

const Contact = ({ clinicEmail }) => {
	const { t } = useTranslation('contact');

	const [isMessage, setIsMessage] = useState('');
	const [errorMessage, setErrorMessage] = useState('');
	const {
		register,
		handleSubmit,
		formState: { errors },
		reset,
	} = useForm({
		defaultValues: {},
		mode: 'onChange',
		reValidateMode: 'onChange',
	});

	const clickSubmit = async (data, e) => {
		e.preventDefault();

		const send = {
			type: 'contact',
			email: data.email,
			clinicEmail: clinicEmail,
			message: data.message,
			subject: data.subject,
			mailFrom: data.email,
			name: data.name,
			number: data.number,
		};

		const response = await fetch('/api/email/contact', {
			method: 'POST',
			body: JSON.stringify(send),
			headers: {
				'Content-type': 'application/json',
			},
		});

		if (response.status === 200) {
			reset();
			setIsMessage(`Hvala Vam ${data.name}, Vaša poruka je poslana!`);
			setTimeout(() => {
				setIsMessage('');
			}, 5000);
		}

		if (response.status === 400) {
			setErrorMessage('Greška! Pokušajte opet kasnije.');
			setTimeout(() => {
				setErrorMessage('');
			}, 5000);
		}
	};

	return (
		<form
			onSubmit={handleSubmit((data, e) => {
				clickSubmit(data, e);
			})}
		>
			<div className="flex flex-col gap-4">
				<div className="flex flex-col">
					<div className="flex items-center justify-between">
						<label className="form-label">{t('contact.text-1')}</label>
						<span className="text-[13px] text-[#969494] font-[600]">
							<span className="text-primaryColor">*</span>
							{t('contact.text-6')}
						</span>
					</div>
					<input
						className="form-input"
						type="Name"
						{...register('name', {
							required: t('errors.text-1'),
						})}
						placeholder={t('contact.text-1')}
					/>
					<p className="text-primaryColor font-[600]">{errors.name?.message}</p>
				</div>
				<div className="flex flex-col">
					<div className="flex items-center justify-between">
						<label className="form-label">{t('contact.text-2')}</label>
						<span className="text-[13px] text-[#969494] font-[600]">
							<span className="text-primaryColor">*</span>
							{t('contact.text-6')}
						</span>
					</div>
					<input
						className="form-input"
						type="email"
						{...register('email', {
							required: t('errors.text-2'),
						})}
						placeholder={t('contact.text-2')}
					/>
					<p className="text-primaryColor font-[600]">{errors.email?.message}</p>
				</div>
				<div className="flex flex-col">
					<label className="form-label">{t('contact.text-3')}</label>
					<input className="form-input" type="text" {...register('number')} placeholder={t('contact.text-3')} />
				</div>
				<div className="flex flex-col">
					<div className="flex items-center justify-between">
						<label className="form-label">{t('contact.text-4')}</label>
						<span className="text-[13px] text-[#969494] font-[600]">
							<span className="text-primaryColor">*</span>
							{t('contact.text-6')}
						</span>
					</div>
					<input
						className="form-input"
						type="name"
						{...register('subject', {
							required: t('errors.text-3'),
						})}
						placeholder={t('contact.text-4')}
					/>
					<p className="text-primaryColor font-[600]">{errors.subject?.message}</p>
				</div>

				<div className="flex flex-col">
					<div className="flex items-center justify-between">
						<label className="form-label">{t('contact.text-5')}</label>
						<span className="text-[13px] text-[#969494] font-[600]">
							<span className="text-primaryColor">*</span>
							{t('contact.text-6')}
						</span>
					</div>
					<textarea
						className="max-h-[190px] min-h-[190px]  shadow-black/25 form-input"
						{...register('message', {
							required: t('errors.text-4'),
						})}
						placeholder={t('contact.text-5')}
					/>
					<p className="text-primaryColor font-[600]">{errors.message?.message}</p>
				</div>
			</div>
			{errorMessage ? (
				<div className="alert alert-error shadow-lg">
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
								d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
							/>
						</svg>
						<span>{errorMessage}</span>
					</div>
				</div>
			) : (
				''
			)}
			{isMessage ? (
				<div className="alert alert-success shadow-lg mt-5">
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
						<span>{isMessage}</span>
					</div>
				</div>
			) : (
				''
			)}

			<button className="button w-full mt-6">{t('contact.text-7')}</button>
		</form>
	);
};

export default Contact;
