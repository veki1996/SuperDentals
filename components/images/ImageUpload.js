/* 
	Props explained: 
		containerStyle: style of container div
		labelStyle: 	style of label
		inputStyle: 	style of input type file
		labelId:		unique id that connects input to his label
		inputLabelStyle:style of inputs label		
*/

import { useRef, useState } from 'react';

const ImageUpload = ({
	callback,
	containerStyle,
	labelStyle,
	inputStyle,
	labelText,
	labelId,
	inputLabelStyle,
	inputLabelText,
}) => {
	const [inputKey, setInputKey] = useState(1);

	function thatResetsTheFileInput() {
		let randomString = Math.random().toString(36);

		setInputKey(randomString);
	}

	const imageRef = useRef();

	const validateFile = (e) => {
		thatResetsTheFileInput();
		let fileInput = imageRef;

		let filePath = fileInput.current.value;

		// Allowing file type
		let allowedExtensions = /(\.jpg|\.jpeg|\.png)$/i;

		if (!allowedExtensions.exec(filePath)) {
			alert('Invalid file type, only .jpg, .jpeg and .png files are allowed');
			fileInput.value = '';

			return false;
		} else {
			callback(e);
			if (!allowedExtensions.exec(filePath)) {
				alert('Invalid file type, only .jpg, .jpeg and .png files are allowed');
				fileInput.value = '';
				return false;
			}
		}
	};

	return (
		<div id="login" className={containerStyle}>
			<label className={labelStyle} htmlFor="logo">
				{labelText}
			</label>

			<input
				type="file"
				key={inputKey || ''}
				id={labelId}
				className={inputStyle}
				ref={imageRef}
				onChange={(e) => validateFile(e)}
			/>
			<label htmlFor={labelId} className={inputLabelStyle}>
				{inputLabelText || 'Choose a file'}
			</label>
			<div id="imagePreview"></div>
		</div>
	);
};

export default ImageUpload;
