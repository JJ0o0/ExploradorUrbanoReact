import * as Location from "expo-location";

export const JotaLocation = {
	async getCurrentLocation() {
		try {
			const { status } =
				await Location.requestForegroundPermissionsAsync();

			if (status !== "granted") {
				console.warn("Permissão de localização não habilitada!");

				return null;
			}

			const location = await Location.getCurrentPositionAsync({
				accuracy: Location.Accuracy.Balanced,
			});

			return {
				latitude: location.coords.latitude,
				longitude: location.coords.longitude,
				latitudeDelta: 0.01,
				longitudeDelta: 0.01,
			};
		} catch (error) {
			console.error("Erro ao obter localização: ", error);
			return null;
		}
	},
};
