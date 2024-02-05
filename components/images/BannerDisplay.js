/* Props explained:
        
            images=				Array of all images
            position=           Banners that have position equals to this props value will be shown 
            swiperStyle=        Style of main Swiper component
            
*/

// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

// import required modules
import { Autoplay } from 'swiper';
import Image from 'next/image';

const BannerDisplay = ({ images, swiperStyle, position, locale }) => {
	const serveImagesFrom =
		process.env.NODE_ENV === 'development'
			? `${process.env.BASE_URL}/api/image`
			: `${process.env.PRODUCTION_BASE_URL}/api/image`;

	let filteredImages =
		images?.length > 0 &&
		images
			.filter((image) => {
				// Filter images based on imageUsage and partner id
				if (image.banner) {
					if (image?.banner?.position === position && image?.banner?.country === locale) return true;
				}
			})
			.sort(() => 0.5 - Math.random());

	if (filteredImages?.length === 0) {
		filteredImages =
			images?.length > 0 &&
			images
				.filter((image) => {
					// Filter images based on imageUsage and partner id
					if (image.banner) {
						if (image?.banner?.position === position && image?.banner?.country === 'global') return true;
					}
				})
				.sort(() => 0.5 - Math.random());
	}

	const myLoader = ({ src, width, quality }) => {
		return `${serveImagesFrom}/${src}?w=${width}&q=${quality || 75}`;
	};
	return (
		<>
			{filteredImages && (
				<Swiper
					centeredSlides={true}
					speed={600}
					autoplay={{
						delay: 3500,
						disableOnInteraction: false,
					}}
					modules={[Autoplay]}
					className={swiperStyle}
				>
					{filteredImages.length > 0 &&
						filteredImages?.map((image) => (
							<SwiperSlide
								key={image?.id}
								className="text-center text-xl flex justify-center items-center cursor-pointer"
							>
								<a href={image?.banner?.website} target="_blank" rel="noreferrer">
									<Image
										loader={myLoader}
										alt="Banner name"
										src={`uploads/${image?.name}`}
										layout="fill"
										objectFit="cover"
									/>
								</a>
							</SwiperSlide>
						))}
				</Swiper>
			)}
		</>
	);
};

export default BannerDisplay;
