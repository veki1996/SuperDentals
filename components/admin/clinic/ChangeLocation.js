import { GoogleMap, MarkerF, useLoadScript } from '@react-google-maps/api';
import { AutoComplete } from '/components';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

const ChangeLocation = ({ clinic, modal }) => {
	const router = useRouter();
	// Load Google Apis
	const { isLoaded } = useLoadScript({
		googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
		libraries: ['places'],
	});

	//States
	const [country, setCountry] = useState('');
	const [mapCoordinates, setMapCoordinates] = useState('');
	const [center, setCenter] = useState();
	// const [, setDirectionsResponse] = useState(null);
	const [placeId, setPlaceId] = useState('');
	const [rating, setRating] = useState('');

	const { register, handleSubmit } = useForm({
		mode: 'onChange',
		reValidateMode: 'onChange',
	});

	// Use Effect for centering map cooresponding to the country selected
	useEffect(() => {
		if (country === 'rs') setCenter(new google.maps.LatLng(44.13364827818925, 20.83272227052961));
		if (country === 'ba') setCenter(new google.maps.LatLng(44.644030151937315, 17.721060995854913));
		if (country === 'cg') setCenter(new google.maps.LatLng(42.904187741444616, 19.264968828096578));

		// Reset mapCoords and cooresponding input field
		setMapCoordinates('');
		setRating('');
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [country]);

	useEffect(() => {
		const fetchDetails = async () => {
			if (placeId !== '') {
				const response = await fetch('/api/clinics/getReviews', {
					method: 'POST',
					body: JSON.stringify({ placeId: placeId }),
					headers: {
						'Content-type': 'application/json',
					},
				});

				const { result } = await response.json();

				setRating(result.rating);
			}
		};

		fetchDetails();
	}, [placeId]);

	const handleMapClick = (mapMouseEvent) => {
		setMapCoordinates(JSON.stringify(mapMouseEvent.latLng));
		setPlaceId(mapMouseEvent.placeId || '');
	};

	const handleSubmitCoordinates = async (data) => {
		data.clinicId = clinic;
		data.mapCoords = mapCoordinates;
		data.rating = rating;
		const response = await fetch('/api/admin/clinic/editCoords', {
			method: 'POST',
			body: JSON.stringify(data),
			headers: {
				'Content-type': 'application/json',
			},
		});

		if (response.status === 200) {
			// const resData = await response.json();
			// var currentClinic = resData.clinic;
			modal(false);
			router.reload();
		}
		// if (currentClinic.user.active) {
		// 	let confirmAction = confirm('Warning: You will recalculate distance from airports! Do you want to continue?');
		// 	if (confirmAction) {
		// 		// Converting origin string for LatLng object
		// 		const calculate = airports.map(async (airport) => {
		// 			const origin = airport.mapCoordinates.trim().split(',');
		// 			const originLat = parseFloat(origin[0]);
		// 			const originLong = parseFloat(origin[1]);
		// 			// Converting destination string for LatLng object
		// 			const destination = JSON.parse(currentClinic.mapCoordinates);
		// 			const directionsService = new google.maps.DirectionsService();

		// 			const results = await directionsService.route({
		// 				origin: new google.maps.LatLng(originLat, originLong),
		// 				destination: new google.maps.LatLng(destination),
		// 				travelMode: google.maps.TravelMode.DRIVING,
		// 			});
		// 			setDirectionsResponse(results);

		// 			return { distance: results.routes[0].legs[0].distance.text.split(' ')[0], airport: airport.name };
		// 		});

		// 		// Resolve array of promises and update distanceFromAirports column
		// 		Promise.all(calculate).then(async (values) => {
		// 			const response = await fetch('/api/admin/clinic/calculateDistances', {
		// 				body: JSON.stringify({ id: clinic, distances: values }),
		// 				method: 'POST',
		// 				headers: {
		// 					'Content-type': 'application/json',
		// 				},
		// 			});

		// 			if (response.status === 200) {
		// 				modal(false);
		// 				router.reload();
		// 			}
		// 		});
		// 	} else return;
		// } else {
		// 	modal(false);
		// 	router.reload();
		// }
	};

	return (
		<div>
			<div>
				<form className="flex items-center justify-between gap-2" onSubmit={handleSubmit(handleSubmitCoordinates)}>
					<select
						className="select select-secondary full-w mb-5"
						placeholder="Select Your Country"
						onChange={(e) => setCountry(e.target.value)}
					>
						<option value="" className="invisible">
							Select Your Country
						</option>
						<option value="ba">Bosna I Hercegovina</option>
						<option value="rs">Srbija</option>
						<option value="cg">Crna Gora</option>
					</select>
					<div className="flex gap-5">
						<div className="flex flex-col relative">
							<div className="flex gap-2">
								<input
									className="input input-bordered p-3 w-full max-w-xs"
									disabled={true}
									type="text"
									placeholder="Choose your location on map..."
									value={mapCoordinates}
									{...register('mapCoords')}
								/>

								<input
									className="input input-bordered p-3 w-full max-w-xs"
									disabled={true}
									type="text"
									placeholder="Rating..."
									value={rating}
									{...register('rating')}
								/>
							</div>
							<p className="absolute bottom-[-25px] left-0 text-secondary font-[500] text-[14px]">
								Note: (Rating will be populated if you click your clinic on the map)
							</p>
						</div>
						<button className="btn btn-wide bg-secondary hover:bg-secondary/80 mb-5">Submit</button>
					</div>
				</form>
			</div>
			<div className="mt-10">
				{isLoaded && country !== '' && (
					<>
						<AutoComplete setMapCoordinates={setMapCoordinates} setRating={setRating} />
						<GoogleMap
							center={mapCoordinates !== '' ? JSON.parse(mapCoordinates) : center}
							zoom={mapCoordinates !== '' ? 15 : 7}
							mapContainerStyle={{ width: '100%', height: '360px' }}
							onClick={(mapMouseEvent) => handleMapClick(mapMouseEvent)}
						>
							<MarkerF position={mapCoordinates !== '' && JSON.parse(mapCoordinates)} />
						</GoogleMap>
					</>
				)}
			</div>
		</div>
	);
};

export default ChangeLocation;
