import { AiOutlineCloseCircle } from 'react-icons/ai';
import Image from 'next/image';

const ImageList = ({ images, remove, width, height, imageStyle, deleteIconStyle, imageContainerStyle }) => {
	return (
		<div className="min-w-full flex flex-wrap gap-3 justify-center md:justify-start">
			{images.map((image, index) => (
				<div className={imageContainerStyle} key={index}>
					<Image className={imageStyle} src={image} alt="Album photos" width={width} height={height} />
					<AiOutlineCloseCircle onClick={() => remove(index)} className={deleteIconStyle} size={30} color="#FC5122" />
				</div>
			))}
		</div>
	);
};

export default ImageList;
