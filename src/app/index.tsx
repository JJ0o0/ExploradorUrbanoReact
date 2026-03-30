import JotaButton from "@/components/JotaButton";
import JotaIconButton from "@/components/JotaIconButton";
import { JotaColors } from "@/constants/JotaColors";
import { JotaCaptcha } from "@/utils/JotaCaptcha";
import { JotaLocation } from "@/utils/JotaLocation";
import { JotaStorage } from "@/utils/JotaStorage";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import {
	faArrowsRotate,
	faPlus,
	faShoePrints,
} from "@fortawesome/free-solid-svg-icons";
import { Stack, useIsFocused, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
	ActivityIndicator,
	Alert,
	Modal,
	Platform,
	StyleSheet,
	Text,
	TextInput,
	View,
} from "react-native";
import { WebView } from "react-native-webview";

export default function Index() {
	const [loading, setLoading] = useState(true);
	const [coords, setCoords] = useState<any>(null);
	const [photos, setPhotos] = useState<any[]>([]);
	const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
	const [captchaCode, setCaptchaCode] = useState("");
	const [userInput, setUserInput] = useState("");
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

	const openDeleteConfirmation = () => {
		const newCode = JotaCaptcha.generateCaptcha();
		setCaptchaCode(newCode);
		setUserInput("");
		setIsDeleteModalVisible(true);
	};

	const executeGlobalDelete = async () => {
		if (JotaCaptcha.validate(userInput, captchaCode)) {
			const success = await JotaStorage.clearPhotos();
			if (success) {
				setPhotos([]);
				setIsDeleteModalVisible(false);
				Alert.alert("Sucesso", "Todos os marcadores foram deletados.");
			}
		} else {
			Alert.alert(
				"Erro",
				"Código de segurança incorreto. Tente novamente.",
			);
			setCaptchaCode(JotaCaptcha.generateCaptcha());
			setUserInput("");
		}
	};

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
				.leaflet-popup-content-wrapper {
					background: #1E1E1E;
					color: #FFFFFF;
					border-radius: 16px;
					padding: 0;
					box-shadow: 0 4px 15px rgba(0,0,0,0.5);
					border: 1px solid rgba(255,255,255,0.1);
				}
				.leaflet-popup-content {
					margin: 0;
					line-height: 1;
				}

				.leaflet-popup-tip {
					background: #1E1E1E; /* Cor do "triângulo" inferior */
					border: 1px solid rgba(255,255,255,0.1);
				}

				.leaflet-popup-close-button {
					color: #888 !important;
					padding: 8px 10px 0 0 !important;
				}

				.popup-content {
					text-align: center;
					width: 180px;
					display: flex;
					flex-direction: column;
					align-items: center;
					overflow: hidden;
				}

				.popup-image {
					width: 100%;
					height: 140px;
					border-radius: 16px 16px 0 0;
					object-fit: cover;
					border-bottom: 2px solid #ff4444;
				}

				.popup-info-block {
					padding: 12px;
					width: 100%;
					box-sizing: border-box;
					display: flex;
					flex-direction: column; 
   					gap: 4px;
				}

				.popup-description {
					font-size: 14px;
					font-weight: bold;
					color: #FFFFFF;
					margin-bottom: 6px;
					display: block;
					white-space: normal;
					word-wrap: break-word;
					overflow-wrap: break-word; 
					line-height: 1.2;
				}

				.popup-city {
					font-size: 12px;
					color: #ff4444;
					display: flex;
					align-items: center;
					justify-content: center;
					gap: 4px;
					margin-bottom: 6px;
				}

				.popup-date {
					font-size: 11px;
					color: #AAAAAA;
					display: block;
					border-top: 1px solid rgba(255,255,255,0.1);
					padding-top: 6px;
					margin-bottom: 8px;
				}

				.btn-delete {
					background: transparent;
					color: #ff6666;
					border: 1px solid #ff6666;
					padding: 6px 12px;
					border-radius: 20px;
					font-size: 11px;
					font-weight: bold;
					cursor: pointer;
					width: auto;
					transition: background 0.2s;
					margin-top: 5px;
				}

				.btn-delete:active {
					background: rgba(255, 102, 102, 0.2);
				}
				
				.btn-edit {
					background: transparent;
					color: #66cfff;
					border: 1px solid #66cfff;
					padding: 6px 12px;
					border-radius: 20px;
					font-size: 11px;
					font-weight: bold;
					cursor: pointer;
					width: auto;
					transition: background 0.2s;
					margin-top: 5px;
				}

				.btn-edit:active {
					background: rgba(102, 255, 255, 0.2);
				}

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
				var map = L.map('map', { zoomControl: false, maxZoom: 22 }).setView([${coords.latitude}, ${coords.longitude}], 16);
				
				var cartoLight = L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
					maxZoom: 22,
    				maxNativeZoom: 20
				}).addTo(map);
				cartoLight.getContainer().style.filter = "brightness(1.2) contrast(0.8) grayscale(0.2)";
				
				L.circleMarker([${coords.latitude}, ${coords.longitude}], {
					radius: 12, fillColor: "#007AFF", color: "#fff", weight: 3, opacity: 1, fillOpacity: 0.8
				}).addTo(map);

				var markers = L.markerClusterGroup({
					spiderfyOnMaxZoom: true,
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

				function editMarker(photo) {
					window.ReactNativeWebView.postMessage(JSON.stringify({
						type: 'EDIT_PHOTO', 
						photo: photo 
					}));
				}

				function deleteMarker(id) {
					if (window.ReactNativeWebView) {
						window.ReactNativeWebView.postMessage(JSON.stringify({
							type: 'CONFIRM_DELETE', 
							id: id 
						}));
					}
				}

				var photoData = ${JSON.stringify(photos)};

				photoData.forEach(function(photo) {
					var lat = photo.location.latitude || -10.9472; 
					var lon = photo.location.longitude;

					if (lon) {
						var marker = L.circleMarker([lat, lon], {
							radius: 10, fillColor: "#ff4444", color: "#fff", weight: 2, opacity: 1, fillOpacity: 1
						});
						
						var dateObj = new Date(photo.date);
						var formattedDate = dateObj.toLocaleDateString('pt-BR') + ' ' + dateObj.toLocaleTimeString('pt-BR', {hour: '2-digit', minute:'2-digit'});

						var popupHtml = "<div class='popup-content'>";
						if (photo.imageUri) {
							popupHtml += "<img src='" + photo.imageUri + "' class='popup-image' />";
						}
						popupHtml += "<div class='popup-info-block'>";
						popupHtml += "<span class='popup-description'>" + (photo.description || "Sem descrição") + "</span>";
						popupHtml += "<span class='popup-city'>📍 " + (photo.cityName || "Aracaju") + "</span>";
						popupHtml += "<span class='popup-date'>" + formattedDate + "</span>";
						popupHtml += "<button class='btn-edit' onclick='editMarker(" + JSON.stringify(photo) + ")'>Editar</button>";
						popupHtml += "<button class='btn-delete' onclick='deleteMarker(" + photo.id + ")'>Excluir</button>";
						popupHtml += "</div>";
						popupHtml += "</div>";

						marker.bindPopup(popupHtml);
						
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
					headerTitle: "Explorador Urbano",
					headerLeft: () => null,
					headerBackVisible: false,
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
						onMessage={async (event) => {
							const data = JSON.parse(event.nativeEvent.data);

							if (data.type === "EDIT_PHOTO") {
								router.push({
									pathname: "/pictureInfo",
									params: {
										id: data.photo.id,
										description: data.photo.description,
										imageUri: data.photo.imageUri,
									},
								});
							} else if (data.type === "CONFIRM_DELETE") {
								Alert.alert(
									"Excluir Marcador",
									"Tem certeza que deseja apagar este marcador permanentemente?",
									[
										{
											text: "Cancelar",
											style: "cancel",
										},
										{
											text: "Sim, Excluir",
											style: "destructive",
											onPress: async () => {
												const ok =
													await JotaStorage.deletePhoto(
														data.id,
													);
												if (ok) {
													const savedPhotos =
														await JotaStorage.getAllPhotos();
													setPhotos(savedPhotos);
												}
											},
										},
									],
								);
							}
						}}
					/>
				</View>
			)}
			<View style={styles.buttonContainer}>
				<JotaIconButton
					icon={faPlus as IconDefinition}
					onPressed={() => router.navigate("/picture")}
					floating={false}
					roundness={35}
				/>
				<JotaIconButton
					icon={faShoePrints as IconDefinition}
					onPressed={() => router.navigate("/closest")}
					floating={false}
					roundness={35}
					rotate={-45}
				/>
				<JotaIconButton
					icon={faArrowsRotate as IconDefinition}
					onPressed={openDeleteConfirmation}
					floating={false}
					roundness={35}
				/>
			</View>
			<Modal
				visible={isDeleteModalVisible}
				transparent={true}
				animationType="fade"
				onRequestClose={() => setIsDeleteModalVisible(false)}
			>
				<View style={styles.modalOverlay}>
					<View style={styles.modalContent}>
						<Text style={styles.modalTitle}>Limpar Marcadores</Text>
						<Text style={styles.modalText}>
							Para apagar TODOS os marcadores, digite o código
							abaixo:
						</Text>

						<View style={styles.captchaContainer}>
							<Text style={styles.captchaText}>
								{captchaCode}
							</Text>
						</View>

						<TextInput
							style={styles.modalInput}
							value={userInput}
							onChangeText={(t) => setUserInput(t.toUpperCase())}
							placeholder="Digite o Código"
							placeholderTextColor={JotaColors.placeholder}
							autoFocus={true}
							autoCorrect={false}
							autoCapitalize="characters"
						/>

						<View style={styles.modalButtons}>
							<JotaButton
								text="Sair"
								onPressed={() => setIsDeleteModalVisible(false)}
								borderColor={JotaColors.foreground}
								size={{ width: 120, height: 50 }}
							/>

							<JotaButton
								text="Limpar"
								onPressed={executeGlobalDelete}
								borderColor="#dc3545"
								size={{ width: 120, height: 50 }}
							/>
						</View>
					</View>
				</View>
			</Modal>
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
	buttonContainer: {
		position: "absolute",
		bottom: 50,
		alignSelf: "center",
		justifyContent: "center",
		flexDirection: "row",
		gap: 15,
	},
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
	headerTitle: {
		...Platform.select({
			web: {
				userSelect: "none",
			} as any,
			default: {},
		}),
	},
	modalOverlay: {
		flex: 1,
		backgroundColor: "rgba(0,0,0,0.85)",
		justifyContent: "center",
		alignItems: "center",
	},
	modalContent: {
		width: "90%",
		backgroundColor: JotaColors.darkerBackground,
		borderRadius: 25,
		padding: 30,
		alignItems: "center",
		borderWidth: 2,
		borderColor: JotaColors.foreground,
	},
	modalTitle: {
		color: JotaColors.text,
		fontSize: 22,
		fontWeight: "bold",
		marginBottom: 10,
	},
	modalText: {
		color: JotaColors.placeholder,
		textAlign: "center",
		marginBottom: 25,
		lineHeight: 20,
	},
	captchaContainer: {
		backgroundColor: JotaColors.background,
		paddingHorizontal: 20,
		paddingVertical: 10,
		borderRadius: 15,
		marginBottom: 20,
		borderWidth: 2,
		borderColor: JotaColors.border,
		borderStyle: "dashed",
	},
	captchaText: {
		color: JotaColors.text,
		fontSize: 32,
		fontWeight: "bold",
		letterSpacing: 8,
	},
	modalInput: {
		width: "100%",
		backgroundColor: JotaColors.background,
		color: JotaColors.text,
		borderRadius: 15,
		padding: 15,
		fontSize: 18,
		textAlign: "center",
		marginBottom: 30,
		borderWidth: 2,
		borderColor: JotaColors.foreground,
	},
	modalButtons: {
		flexDirection: "row",
		gap: 15,
		justifyContent: "center",
		width: "100%",
	},
});
