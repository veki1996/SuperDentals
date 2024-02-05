import Head from 'next/head';

const HeadMeta = ({ description, link, title, content, image }) => {
	return (
		<Head>
			<title>{title}</title>
			<meta name="description" content={description} />
			<link rel="canonical" href={link} />
			<meta property="og:locale" content="en_US" />
			<meta property="og:type" content="website" />
			<meta property="og:title" content={title} />
			<meta property="og:description" content={description} />
			<meta property="og:url" content={link} />
			<meta property="og:site_name" content={content} />
			<meta property="og:image" content={image} />
			<meta property="og:image:width" content="1000" />
			<meta property="og:image:height" content="1000" />
			<meta property="og:image:type" content="image/png" />
		</Head>
	);
};

export default HeadMeta;
