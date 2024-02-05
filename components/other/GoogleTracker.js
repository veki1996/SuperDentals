import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Script from 'next/script';

const handleRouteChange = () => {
	pageview();
};

const pageview = () => {
	window.fbq('track', 'PageView');
};

const GoogleTracker = () => {
	const router = useRouter();

	useEffect(() => {
		// the below will only fire on route changes (not initial load - that is handled in the script below)
		router.events.on('routeChangeComplete', handleRouteChange);
		return () => {
			router.events.off('routeChangeComplete', handleRouteChange);
		};
	}, [router.events]);

	return (
		<>
			<Script src="https://www.googletagmanager.com/gtag/js?id=G-5R7VPDX71T" strategy="afterInteractive" />
			<Script id="google-analytics" strategy="afterInteractive">
				{`
          				window.dataLayer = window.dataLayer || [];
          				function gtag(){window.dataLayer.push(arguments);}
          				gtag('js', new Date());
          				gtag('config', 'G-5R7VPDX71T');
        			`}
			</Script>
		</>
	);
};

export default GoogleTracker;
