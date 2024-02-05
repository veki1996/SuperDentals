/* Props explained:
        
            images=				Array of images or single image
            imageType=			Cooresponding imageUsage from DB
            imageFrom=			Decides if we need image for only 1 clinic,employee,partner... - if 'all' get all images for that imageType
            id=					Id depending on imageFrom: employeeId, clinicId, partnerId
            deleteButton=		If true show icon for deleting image
            width=				Image height
            height=				Image width
            containerStyle=		Styles for Images Container
            imageStyle=			Styles for next <Image />
            imageContainerStyle= Styles for container of image 
            deleteIconStyle=	 Styles for Delete Icon
			handleDeleteImage=	onClick function for deleting image
*/

import Image from 'next/image';
import { AiOutlineCloseCircle } from 'react-icons/ai';

const ImageDisplay = ({
	imageType,
	imageFrom,
	id,
	images,
	width,
	layout,
	height,
	containerStyle,
	imageStyle,
	imageContainerStyle,
	deleteIconStyle,
	deleteButton,
	handleDeleteImage,
}) => {
	const serveImagesFrom =
		process.env.NODE_ENV === 'development'
			? `${process.env.BASE_URL}/api/image`
			: `${process.env.PRODUCTION_BASE_URL}/api/image`;

	const filteredImages =
		images?.length &&
		images.filter((image) => {
			if (imageFrom === 'partner') {
				// Filter images based on imageUsage and partner id
				if (image.imageUsage === imageType && image.partner?.id === id) return true;
			}

			if (imageFrom === 'service') {
				// Filter images based on imageUsage and service id
				if (image.imageUsage === imageType && image.service?.id === id) return true;
			}

			if (imageFrom === 'employee') {
				// Filter images based on imageUsage and employee id
				if (image.imageUsage === imageType && image.employee?.id === id) return true;
			}

			if (imageFrom === 'clinic') {
				// Filter images based on imageUsage and clinic id
				if (image.imageUsage === imageType && image.clinicId === id) return true;
			}

			if (imageFrom === 'banner') {
				// Filter images based on imageUsage and clinic id
				if (image.imageUsage === imageType && image.banner?.id === id) return true;
			}

			if (imageFrom === 'all') {
				if (image.imageUsage === imageType) return true;
			}
		});

	const myLoader = ({ src, width, quality }) => {
		return `${serveImagesFrom}/${src}?w=${width}&q=${quality || 75}`;
	};

	return (
		<div className={containerStyle}>
			{images &&
				(Array.isArray(images) ? (
					filteredImages &&
					filteredImages?.map((image) => (
						<div className={imageContainerStyle} key={image.id}>
							<Image
								loader={myLoader}
								key={image.id}
								className={imageStyle}
								width={width}
								height={height}
								layout={layout}
								alt={image.name}
								src={`uploads/${image.name}`}
								objectFit="cover"
							/>
							{deleteButton && (
								<AiOutlineCloseCircle
									onClick={() => handleDeleteImage(image.id, image.name)}
									className={deleteIconStyle}
									size={30}
									color="#FC5122"
								/>
							)}
						</div>
					))
				) : images === null ? (
					<span></span>
				) : (
					images && (
						<div className={imageContainerStyle} key={images.id}>
							<Image
								className={imageStyle}
								loader={myLoader}
								width={width}
								height={height}
								layout={layout}
								key={images.id}
								alt={images.name}
								src={`uploads/${images.name}`}
								objectFit="cover"
							/>
							{deleteButton && (
								<AiOutlineCloseCircle
									onClick={handleDeleteImage}
									className={deleteIconStyle}
									size={30}
									color="#FC5122"
								/>
							)}
						</div>
					)
				))}
		</div>
	);
};

export default ImageDisplay;
