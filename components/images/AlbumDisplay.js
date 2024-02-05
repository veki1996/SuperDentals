/* Props explained:

            images=				Array of all images
            position=           Banners that have position equals to this props value will be shown
            swiperStyle1=        Style of main Swiper component
            swiperStyle2=        Style of second Swiper component


*/

// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';

// import required modules
import { FreeMode, Navigation, Thumbs } from 'swiper';
import Image from 'next/image';
import { useState } from 'react';

const AlbumDisplay = ({ images, swiperStyle1, swiperStyle2 }) => {
	const serveImagesFrom =
		process.env.NODE_ENV === 'development'
			? `${process.env.BASE_URL}/api/image`
			: `${process.env.PRODUCTION_BASE_URL}/api/image`;

	const [thumbsSwiper, setThumbsSwiper] = useState(null);

	const filterImages = images.filter((image) => {
		if (image.imageUsage === 'ALBUM') return true;
	});

	const myLoader = ({ src, width, quality }) => {
		return `${serveImagesFrom}/${src}?w=${width}&q=${quality || 75}`;
	};
	return (
		<>
			{filterImages && (
				<>
					<Swiper
						style={{
							'--swiper-navigation-color': '#fff',
							'--swiper-pagination-color': '#fff',
						}}
						spaceBetween={10}
						navigation={true}
						thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
						modules={[FreeMode, Navigation, Thumbs]}
						className={swiperStyle1}
					>
						{filterImages.map((image) => (
							<SwiperSlide
								key={image.id}
								className="text-center text-xl flex justify-center items-center cursor-pointer relative w-full h-full"
							>
								<Image
									loader={myLoader}
									alt={image.name}
									src={`uploads/${image.name}`}
									layout="fill"
									objectFit="cover"
								/>
							</SwiperSlide>
						))}
					</Swiper>
					<Swiper
						onSwiper={setThumbsSwiper}
						spaceBetween={10}
						slidesPerView="3"
						freeMode={true}
						watchSlidesProgress={true}
						modules={[FreeMode, Navigation, Thumbs]}
						className={swiperStyle2}
					>
						{filterImages.map((image) => (
							<SwiperSlide
								key={image.id}
								className="text-center text-xl flex justify-center items-center cursor-pointer relative w-full h-full"
							>
								<Image
									loader={myLoader}
									alt={image.name}
									src={`uploads/${image.name}`}
									layout="fill"
									objectFit="cover"
								/>
							</SwiperSlide>
						))}
					</Swiper>
				</>
			)}
		</>
	);
};

export default AlbumDisplay;
