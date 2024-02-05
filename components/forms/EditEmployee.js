import Image from 'next/image';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { ImageDisplay, ImageUpload } from '/components';
import { addNewImage, imageDimensions } from '/utils/image';
import { AiFillEdit, AiOutlineCloseCircle } from 'react-icons/ai';

const EditEmployee = ({ employee, clinicId }) => {
	const [showModal, setShowModal] = useState(false);
	const [uploadFile, setUploadFile] = useState(null);
	const [renderImage, setRenderImage] = useState('');

	const router = useRouter();

	const imageWidth = imageDimensions.employee[0];
	const imageHeight = imageDimensions.employee[1];

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm({
		mode: 'onChange',
		reValidateMode: 'onChange',
	});

	const handleEditEmployee = async (data) => {
		if (uploadFile !== null) {
			const response = await fetch('/api/image/delete', {
				body: JSON.stringify({ name: employee.images?.name, id: employee.images?.imageId }),
				method: 'POST',
				headers: {
					'Content-type': 'application/json',
				},
			});

			if (response.status === 200) {
				router.replace(router.asPath);
			}
			let id = await addNewImage(uploadFile, null, 'EMPLOYEE', imageWidth, imageHeight);

			data.imageId = id;
		}
		data.clinicId = clinicId;
		data.employeeId = employee.id;

		const response = await fetch('/api/employees/edit', {
			method: 'POST',
			body: JSON.stringify(data),
			headers: {
				'Content-type': 'application/json',
			},
		});

		if (response.status === 200) {
			setUploadFile(null);
			setShowModal(false);
			setRenderImage('');
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

	const handleDeleteImage = async () => {
		let confirmDelete = confirm('Are you sure you want to delete this image?');
		if (confirmDelete === false) return;

		const response = await fetch('/api/image/delete', {
			body: JSON.stringify({ name: employee.images?.name, id: employee.images?.id }),
			method: 'POST',
			headers: {
				'Content-type': 'application/json',
			},
		});

		if (response.status === 200) {
			router.replace(router.asPath);
		}
	};

	return (
		<div>
			<div
				className="bg-primaryColor rounded-[8px] min-h-[50px] min-w-[50px] flex justify-center items-center cursor-pointer"
				onClick={() => setShowModal(true)}
			>
				<AiFillEdit color="white" size={25} />
			</div>
			{showModal ? (
				<>
					<div className="justify-center flex absolute inset-0 z-50 outline-none focus:outline-none">
						<div className="relative w-auto my-20 mx-auto lg:min-w-[790px] ">
							{/*content*/}
							<div className="border-0 rounded-lg shadow-lg px-10 sm:px-40 py-6 pb-10 w-full bg-white">
								{/*header*/}
								<div className="mb-5">
									<h3 className="text-[32px] font-[700] text-primaryColor text-center">Edit {employee?.name}</h3>
								</div>
								{/*body*/}
								<div className="relative pb-6 flex-auto">
									<form className="flex flex-col gap-5 m-auto" onSubmit={handleSubmit(handleEditEmployee)}>
										<div className="flex flex-col">
											<label className="text-[20px] font-[600] text-[#818181]">Ime</label>
											<input
												className="bg-[#F3F3F3] p-4 rounded-[6px] shadow-md placeholder:text-[20px] leading-none"
												type="text"
												placeholder="Ime"
												defaultValue={employee?.name}
												{...register('name', { required: true })}
											/>
											{errors.name?.type === 'required' && (
												<span className="text-primaryColor font-[500]">Ime je obavezno.</span>
											)}
										</div>
										<div className="flex flex-col">
											<label className="text-[20px] font-[600] text-[#818181]">Prezime</label>
											<input
												className="bg-[#F3F3F3] p-4 rounded-[6px] shadow-md placeholder:text-[20px] leading-none"
												type="text"
												placeholder="Prezime"
												defaultValue={employee?.surname}
												{...register('surname', { required: true })}
											/>
											{errors.surname?.type === 'required' && (
												<span className="text-primaryColor font-[500]">Ime je obavezno.</span>
											)}
										</div>
										<div className="flex flex-col">
											<label className="text-[20px] font-[600] text-[#818181]">Titula</label>
											<input
												type="text"
												className="bg-[#F3F3F3] p-4 rounded-[6px] shadow-md placeholder:text-[20px] leading-none"
												placeholder="Title..."
												defaultValue={employee?.title}
												{...register(`title`, { required: true })}
											/>
											{errors.title?.type === 'required' && (
												<span className="text-primaryColor font-[500]">Ime je obavezno.</span>
											)}
										</div>
										<select
											className="clinic-input p-3  text-[20px] text-[#727272]"
											placeholder="Tip"
											defaultValue={employee.type}
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
										{employee?.images && (
											<div>
												<span className="text-[#727272] text-[20px] font-[700]">Trenutna slika zaposlenog</span>
												<ImageDisplay
													images={employee.images}
													imageType="EMPLOYEE"
													width={125}
													height={125}
													containerStyle="flex gap-3 flex-wrap mt-2"
													imageContainerStyle="flex"
													deleteIconStyle="cursor-pointer"
													imageStyle="rounded-[8px]"
													deleteButton={true}
													handleDeleteImage={handleDeleteImage}
												/>
											</div>
										)}
										<ImageUpload
											inputStyle="w-[0.1px] h-[0.1px] opacity-0 overflow-hidden absolute z-[-1]"
											labelId="addEmployeeImage"
											containerStyle="mb-2 flex flex-col"
											labelStyle="text-primary font-bold"
											inputLabelStyle="button-outline font-[600] cursor-pointer"
											inputLabelText={
												employee?.images
													? 'Zamijeni sliku zaposlenog'
													: renderImage
													? 'Zamijeni sliku zaposlenog'
													: 'Dodaj fotografiju zaposlenog'
											}
											callback={handleFile}
										/>
										<p className="pb-5">Preporučene dimenzije su 600 x 500 pixela</p>
										{renderImage ? (
											<div className="flex justify-center lg:justify-start">
												<Image
													src={renderImage}
													alt="Partners logo"
													width={125}
													height={125}
													className="animate-pulse"
												/>
												<AiOutlineCloseCircle
													onClick={() => {
														setRenderImage(null);
														setUploadFile(null);
													}}
													size={30}
													color="#FC5122"
												/>
											</div>
										) : (
											<></>
										)}
										<button className="button font-[600]">Submit</button>
									</form>
								</div>
								{/*footer*/}
								<div className="flex items-center justify-center">
									<button
										className="text-primaryColor text-[20px] font-[600]"
										type="button"
										onClick={() => setShowModal(false)}
									>
										Zatvori
									</button>
								</div>
							</div>
						</div>
					</div>
					<div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
				</>
			) : null}
		</div>
	);
};

export default EditEmployee;
