import { SessionProvider } from 'next-auth/react';
import { Provider } from 'jotai';
import Script from 'next/script';

import '../styles/globals.css';
import 'react-quill/dist/quill.snow.css';
import { FacebookPixel, GoogleTracker } from '/components';

function MyApp({ Component, pageProps }) {
	return (
		<SessionProvider>
			<Provider>
				<GoogleTracker />
				<FacebookPixel />
				<Component {...pageProps} />
			</Provider>
		</SessionProvider>
	);
}

export default MyApp;
