import * as Location from "expo-location";

export const JotaLocation = {
	async getCurrentLocation() {
		try {
			let location = await Location.getLastKnownPositionAsync({});

			if (!location) {
				location = await Location.getCurrentPositionAsync({
					accuracy: Location.Accuracy.Low,
				});
			}

			return location.coords;
		} catch (e) {
			return null;
		}
	},
};
