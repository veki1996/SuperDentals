// function responsible for adding new images, you just need to provide file, clinic id and type of image depending on what are you trying to import  EMPLOYEE, ALBUM, PROFILE
export const addNewImage = async (uploadFile, clinic_id, image_type, width, height) => {
	let metadata = await uploadImage(uploadFile, width, height);
	let image_id = await addImageToDb(metadata, clinic_id, image_type);

	return image_id;
};

const uploadImage = async (uploadFile, width, height) => {
	const formData = new FormData();
	formData.append('file', uploadFile);
	formData.append('clinicname', 'clinic-name');
	const response = await fetch(`/api/image/create?width=${width}&height=${height}`, {
		method: 'POST',
		body: formData,
		'Access-Control-Allow-Origin': '*',
		'Content-Type': 'multipart/form-data',
	});

	if (response.status === 200) {
		const data = await response.json();
		return data.metadata;
	}
};

const addImageToDb = async (meta, clinicId, imageType) => {
	const data = {
		clinicId: clinicId === null ? null : String(clinicId),
		...meta,
		imageType: imageType,
	};

	const responseApi = await fetch('/api/image/createdb', {
		method: 'POST',
		body: JSON.stringify(data),
		headers: {
			'Content-type': 'application/json',
		},
	});

	//return image id
	if (responseApi.status === 200) {
		const data = await responseApi.json();
		return data.id;
	}
};

export const imageDimensions = {
	album: [1000, 500],
	logo: [200, 200],
	featured: [1000, 500],
	employee: [500, 500],
	banner: [1200, 200],
	partner: [500, 500],
	service: [500, 500],
};
