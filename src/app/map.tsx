import JotaIconButton from "@/components/JotaIconButton";
import { JotaColors } from "@/constants/JotaColors";
import { JotaLocation } from "@/utils/JotaLocation";
import { JotaStorage } from "@/utils/JotaStorage";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { faAngleUp } from "@fortawesome/free-solid-svg-icons";
import { Stack, useIsFocused, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { WebView } from "react-native-webview";

export default function Map() {
	const [loading, setLoading] = useState(true);
	const [coords, setCoords] = useState<any>(null);
	const [photos, setPhotos] = useState<any[]>([]);
	const isFocused = useIsFocused();
	const router = useRouter();

	useEffect(() => {
		async function setupMap() {
			if (photos.length === 0) setLoading(true);

			const current = await JotaLocation.getCurrentLocation();
			setCoords(current || { latitude: -10.9472, longitude: -37.0731 });

			try {
				const savedPhotos = await JotaStorage.getAllPhotos();
				const validPhotos = savedPhotos.filter(
					(p) => p.location && p.location.longitude != null,
				);

				setPhotos(validPhotos);
			} catch (e) {
				console.error("ERRO NO STORAGE:", e);
			}

			setLoading(false);
		}

		if (isFocused) {
			setupMap();
		}
	}, [isFocused]);

	const mapHtml = coords
		? `
		<!DOCTYPE html>
		<html>
		<head>
			<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
			<link rel="stylesheet" href="https://unpkg.com/leaflet/dist/leaflet.css" />
			<link rel="stylesheet" href="https://unpkg.com/leaflet.markercluster/dist/MarkerCluster.css" />
			<link rel="stylesheet" href="https://unpkg.com/leaflet.markercluster/dist/MarkerCluster.Default.css" />
			
			<script src="https://unpkg.com/leaflet/dist/leaflet.js"></script>
			<script src="https://unpkg.com/leaflet.markercluster/dist/leaflet.markercluster.js"></script>

			<style>
				body { margin: 0; padding: 0; background-color: #343a40; overflow: hidden; font-family: sans-serif; }
				#map { height: 100vh; width: 100vw; background: #343a40; }
				.leaflet-control-attribution { display: none !important; }
				.popup-content { text-align: center; color: #333; min-width: 140px; }
				.popup-image { width: 130px; height: 130px; border-radius: 8px; object-fit: cover; margin-bottom: 8px; border: 1px solid #ddd; }
				.popup-city { font-size: 11px; font-weight: bold; color: #ff4444; display: block; }
				.popup-date { font-size: 10px; color: #888; display: block; margin-top: 4px; border-top: 1px solid #eee; padding-top: 4px; }
				
				/* Estilo customizado para a bolinha do Cluster (o grupo de fotos) */
				.my-cluster {
					background: #ff4444;
					color: white;
					border-radius: 50%;
					display: flex;
					align-items: center;
					justify-content: center;
					font-weight: bold;
					border: 3px solid rgba(255,255,255,0.6);
					box-shadow: 0 0 10px rgba(0,0,0,0.5);
				}
			</style>
		</head>
		<body>
			<div id="map"></div>
			<script>
				var map = L.map('map', { zoomControl: false }).setView([${coords.latitude}, ${coords.longitude}], 16);
				
				L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png').addTo(map);
				
				// Marcador do Usuário
				L.circleMarker([${coords.latitude}, ${coords.longitude}], {
					radius: 12, fillColor: "#007AFF", color: "#fff", weight: 3, opacity: 1, fillOpacity: 0.8
				}).addTo(map);

				// --- INICIALIZAÇÃO DO CLUSTER ---
				var markers = L.markerClusterGroup({
					spiderfyOnMaxZoom: true, // Abre as "perninhas" no zoom máximo
					showCoverageOnHover: false,
					zoomToBoundsOnClick: true,
					iconCreateFunction: function(cluster) {
						return L.divIcon({ 
							html: '<div>' + cluster.getChildCount() + '</div>', 
							className: 'my-cluster', 
							iconSize: L.point(35, 35) 
						});
					}
				});

				var photoData = ${JSON.stringify(photos)};

				photoData.forEach(function(photo) {
					var lat = photo.location.latitude || -10.9472; 
					var lon = photo.location.longitude;

					if (lon) {
						// Criamos o marcador de cada foto
						var marker = L.circleMarker([lat, lon], {
							radius: 10, fillColor: "#ff4444", color: "#fff", weight: 2, opacity: 1, fillOpacity: 1
						});
						
						var dateObj = new Date(photo.date);
						var formattedDate = dateObj.toLocaleDateString('pt-BR') + ' ' + dateObj.toLocaleTimeString('pt-BR', {hour: '2-digit', minute:'2-digit'});

						var popupHtml = "<div class='popup-content'>";
						if (photo.imageUri) {
							popupHtml += "<img src='" + photo.imageUri + "' class='popup-image' />";
						}
						popupHtml += "<br><b>" + (photo.description || "Sem descrição") + "</b>";
						popupHtml += "<span class='popup-city'>📍 " + (photo.cityName || "Aracaju") + "</span>";
						popupHtml += "<span class='popup-date'>" + formattedDate + "</span>";
						popupHtml += "</div>";

						marker.bindPopup(popupHtml);
						
						// ADICIONAMOS O MARCADOR AO GRUPO DE CLUSTER
						markers.addLayer(marker);
					}
				});

				map.addLayer(markers);
			</script>
		</body>
		</html>
		`
		: "";

	return (
		<View style={styles.container}>
			<Stack.Screen
				options={{
					headerShown: true,
					headerStyle: styles.header,
					headerTransparent: true,
					headerTintColor: JotaColors.text,
					headerTitle: "Voltar",
					headerBackTitle: "",
				}}
			/>
			{loading ? (
				<ActivityIndicator size={"large"} color={JotaColors.text} />
			) : (
				<View style={styles.mapContainer}>
					<WebView
						originWhitelist={["*"]}
						source={{ html: mapHtml }}
						style={styles.map}
						androidLayerType="hardware"
						domStorageEnabled={true}
						javaScriptEnabled={true}
						allowFileAccess={true}
						allowFileAccessFromFileURLs={true}
						allowUniversalAccessFromFileURLs={true}
					/>
				</View>
			)}
			<JotaIconButton
				icon={faAngleUp as IconDefinition}
				onPressed={() => router.navigate("/picture")}
				floating={true}
				roundness={35}
			/>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
		backgroundColor: JotaColors.background,
	},
	buttonContainer: { position: "absolute", bottom: 50, alignSelf: "center" },
	mapContainer: { ...StyleSheet.absoluteFill },
	title: {
		color: "white",
		fontSize: 24,
		userSelect: "none",
	},
	map: {
		flex: 1,
		backgroundColor: "transparent",
	},
	image: {
		width: 200,
		height: 200,
		backgroundColor: "transparent",
		userSelect: "none",
	},
	header: {
		backgroundColor: "transparent",
		userSelect: "none",
	},
});
