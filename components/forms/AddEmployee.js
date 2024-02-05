import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { ImageUpload } from '/components';
import { addNewImage, imageDimensions } from '/utils/image';
import Image from 'next/image';
import { employeesAtom } from '/store';
import { useAtom } from 'jotai';
import { AiOutlineCloseCircle } from 'react-icons/ai';
import useTranslation from 'next-translate/useTranslation';

const AddEmployee = ({ clinicId }) => {
	const { t } = useTranslation('create-edit-clinic');

	const [showModal, setShowModal] = useState(false);
	const [uploadFile, setUploadFile] = useState(null);
	const [renderImage, setRenderImage] = useState('');
	const [employees, setEmployees] = useAtom(employeesAtom);
	const router = useRouter();

	const imageWidth = imageDimensions.employee[0];
	const imageHeight = imageDimensions.employee[1];

	const {
		register,
		handleSubmit,
		formState: { errors },
		reset,
	} = useForm({
		mode: 'onChange',
		reValidateMode: 'onChange',
	});

	const handleAddEmployee = async (data) => {
		data.clinicId = clinicId;

		if (uploadFile !== null) {
			let id = await addNewImage(uploadFile, null, 'EMPLOYEE', imageWidth, imageHeight);

			data.imageId = id;
		}

		const response = await fetch('/api/employees/create', {
			method: 'POST',
			body: JSON.stringify(data),
			headers: {
				'Content-type': 'application/json',
			},
		});

		if (response.status === 201) {
			const { employee } = await response.json();
			setEmployees((prev) => [...prev, employee]);
			setUploadFile(null);
			setRenderImage('');
			reset();
			setShowModal(false);
			router.replace(router.asPath);
		}
	};

	const handleFile = (e) => {
		if (e.target.files) {
			const dataFile = e.target.files[0];
			setRenderImage(URL.createObjectURL(dataFile));
			setUploadFile(dataFile);
		}
	};

	const handleCloseModal = () => {
		setRenderImage('');
		setUploadFile(null);
		setShowModal(false);
	};

	useEffect(() => {
		reset();
	}, [showModal, reset]);

	return (
		<div className="mb-2 mt-6">
			<div className="flex flex-col items-center gap-3">
				<button
					className={`button px-16 font-[600] ${employees.length !== 0 && 'self-end'}`}
					type="button"
					onClick={() => setShowModal(true)}
				>
					{employees.length !== 0 ? <div>Dodaj još</div> : <div>Dodajte vaše zaposlene</div>}
				</button>
				{router.asPath === '/create-clinic' && (
					<p className="text-[#727272] font-[600]">
						Zaposlene ne morate dodati sada, {t('form.text-9').toLowerCase()} ih možete dodati ili ažurirati iz
						administrativnog panela vaše ordinacije
					</p>
				)}
			</div>

			{showModal ? (
				<>
					<div className="justify-center flex absolute inset-0 z-[70] outline-none focus:outline-none">
						<div className="relative w-auto my-20 mx-auto lg:min-w-[650px] ">
							{/*content*/}
							<div className="border-0 rounded-lg shadow-lg px-10 sm:px-20 py-6 pb-10 w-full bg-white">
								{/*header*/}
								<div className="mb-5">
									<h3 className="text-[32px] font-[700] text-primaryColor text-center">Dodaj zaposlenog</h3>
								</div>
								{/*body*/}
								<div className="relative pb-6 flex-auto">
									<form className="flex flex-col gap-5 m-auto" onSubmit={handleSubmit(handleAddEmployee)}>
										<div className="flex flex-col">
											<label className=" font-[600] text-[#818181]">Ime</label>
											<input
												className="bg-[#F3F3F3] p-4 py-3 rounded-[6px] shadow-md leading-none"
												type="text"
												placeholder="Ime"
												{...register('name', { required: true })}
											/>
											{errors.name?.type === 'required' && (
												<span className="text-primaryColor font-[500]">Ime je obavezno.</span>
											)}
										</div>
										<div className="flex flex-col">
											<label className=" font-[600] text-[#818181]">Prezime</label>
											<input
												className="bg-[#F3F3F3] p-4 py-3 rounded-[6px] shadow-md leading-none"
												type="text"
												placeholder="Prezime"
												{...register('surname', { required: true })}
											/>
											{errors.surname?.type === 'required' && (
												<span className="text-primaryColor font-[500]">Prezime je obavezno.</span>
											)}
										</div>
										<div className="flex flex-col">
											<label className=" font-[600] text-[#818181]">Titula</label>
											<input
												className="bg-[#F3F3F3] p-4 py-3 rounded-[6px] shadow-md leading-none"
												type="text"
												placeholder="Titula"
												{...register('title', { required: true })}
											/>
											{errors.title?.type === 'required' && (
												<span className="text-primaryColor font-[500]">Titula je obavezna.</span>
											)}
										</div>
										<select
											className="clinic-input p-3 py-2  text-[#727272]"
											placeholder="Tip"
											{...register('type', { required: true })}
										>
											<option value="" className="invisible">
												Tip
											</option>
											<option value="doctor">Doctor</option>
											<option value="staff">Staff</option>
										</select>
										{errors.type?.type === 'required' && (
											<span className="text-primaryColor font-[500]">Tip je obavezan.</span>
										)}

										<ImageUpload
											inputStyle="w-[0.1px] h-[0.1px] opacity-0 overflow-hidden absolute z-[-1]"
											labelId="addEmployeeImage"
											containerStyle="mb-2 flex flex-col"
											labelStyle="text-primary font-bold"
											inputLabelStyle="button-outline py-2 text-[18px] font-[600] cursor-pointer"
											inputLabelText="Dodaj fotografiju zaposlenog"
											callback={handleFile}
										/>
										<p className="text-[15px]">Preporučene dimenzije su 600 x 500 pixela</p>
										{renderImage ? (
											<div className="flex justify-center lg:justify-start">
												<Image
													src={renderImage}
													alt="Picture of the employee"
													width={150}
													height={150}
													className="rounded-[8px] animate-pulse"
												/>
												<AiOutlineCloseCircle
													onClick={() => {
														setRenderImage(null);
														setUploadFile(null);
													}}
													size={30}
													color="#FC5122"
													className="cursor-pointer"
												/>
											</div>
										) : (
											<p></p>
										)}
										<button className="button py-2 text-[18px] font-[600]">Dodaj zaposlenog</button>
									</form>
								</div>
								{/*footer*/}
								<div className="flex items-center justify-center">
									<button className="text-primaryColor text-[18px] font-[600]" type="button" onClick={handleCloseModal}>
										Zatvori
									</button>
								</div>
							</div>
						</div>
					</div>
					<div className="opacity-25 fixed inset-0 z-[60] bg-black"></div>
				</>
			) : null}
		</div>
	);
};

export default AddEmployee;
