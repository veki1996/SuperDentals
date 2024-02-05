import React, { useRef } from 'react';
import { StandaloneSearchBox } from '@react-google-maps/api';

const AutoComplete = ({ setMapCoordinates, setRating }) => {
	const inputRef = useRef();

	const handlePlaceChanged = () => {
		const [place] = inputRef.current.getPlaces();
		if (place) {
			setMapCoordinates(
				JSON.stringify(new google.maps.LatLng(place.geometry.location.lat(), place.geometry.location.lng())),
			);
			setRating(place?.rating);
		}
	};

	return (
		<StandaloneSearchBox onLoad={(ref) => (inputRef.current = ref)} onPlacesChanged={handlePlaceChanged}>
			<input type="text" className="clinic-input py-2 mb-2 w-full" placeholder="Enter Location" />
		</StandaloneSearchBox>
	);
};

export default AutoComplete;
