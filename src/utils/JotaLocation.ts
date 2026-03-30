import * as Location from "expo-location";
import { JotaStorage } from "./JotaStorage";

export const JotaLocation = {
	// Cálculo da BESTA FERA
	// Esse cálculo é a Fórmula de Haversine. Margem de erro: quase nula.
	calculateDistance(lat0: number, lon0: number, lat1: number, lon1: number) {
		const R = 6371; // LITERALMENTE, o Raio aproximado da Terra.

		// Convertendo valores para Radianos
		const dLat = (lat1 - lat0) * (Math.PI / 180);
		const dLon = (lon1 - lon0) * (Math.PI / 180);

		// Calculando o quadrado da metade da corda entre os pontos
		// sen(dLat/2)^2
		// + cos(lat0 * (PI / 180))
		// * cos(lat1 * (PI / 180))
		// + sen(dLon/2)^2
		const a =
			Math.sin(dLat / 2) * Math.sin(dLat / 2) +
			Math.cos(lat0 * (Math.PI / 180)) *
				Math.cos(lat1 * (Math.PI / 180)) *
				Math.sin(dLon / 2) *
				Math.sin(dLon / 2);

		// Pegando o distância angular em radianos.
		const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

		// Finalmente, multiplicando ao raio da Terra.
		return R * c;
	},
	async requestPermissions() {
		try {
			const { status } =
				await Location.requestForegroundPermissionsAsync();
			return status === "granted";
		} catch (e) {
			console.error("Erro ao pedir permissão de GPS:", e);
			return false;
		}
	},
	async getNearestsLocations() {
		const userCoords = await this.getCurrentLocation();

		if (!userCoords) {
			return [];
		}

		try {
			const photos = await JotaStorage.getAllPhotos();
			const listWithDistance = photos
				.filter((p) => p.location && p.location.latitude)
				.map((photo) => {
					const distance = this.calculateDistance(
						userCoords.latitude,
						userCoords.longitude,
						photo.location.latitude,
						photo.location.longitude,
					);

					return {
						...photo,
						distance: distance,
						distanceLabel:
							distance < 1
								? `${(distance * 1000).toFixed(0)}m`
								: `${distance.toFixed(1)}km`,
					};
				});

			return listWithDistance.sort((a, b) => a.distance - b.distance);
		} catch (error) {
			console.error("Erro ao processar locais próximos: ", error);

			return [];
		}
	},
	async getCurrentLocation() {
		try {
			const { granted } = await Location.getForegroundPermissionsAsync();

			if (!granted) {
				const ok = await this.requestPermissions();

				if (!ok) return null;
			}

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
