import { JotaColors } from "@/constants/JotaColors";
import { JotaLocation } from "@/utils/JotaLocation";
import { CameraView, useCameraPermissions } from "expo-camera";
import { File, Paths } from "expo-file-system";
import * as Location from "expo-location";
import { useRouter } from "expo-router";
import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import { StyleSheet, Text, View } from "react-native";
import JotaButton from "./JotaButton";

type Size = { width: number; height: number };
type Props = {
	size: Size;
};

export interface JotaCameraRef {
	takePicture: () => Promise<void>;
}

const JotaCameraView = forwardRef<JotaCameraRef, Props>((props, ref) => {
	const [permission, requestPermission] = useCameraPermissions();
	const [location, requestLocation] = Location.useForegroundPermissions();
	const cameraRef = useRef<CameraView>(null);
	const router = useRouter();

	useEffect(() => {
		if (!location?.granted) {
			requestLocation();
		}
	}, []);

	useImperativeHandle(ref, () => ({
		async takePicture() {
			if (cameraRef.current) {
				try {
					const photo = await cameraRef.current.takePictureAsync();
					const coords = await JotaLocation.getCurrentLocation();

					let cityName = "Local desconhecido";
					if (coords) {
						try {
							const geo = await Location.reverseGeocodeAsync({
								latitude: coords.latitude,
								longitude: coords.longitude,
							});

							if (geo.length > 0) {
								cityName =
									geo[0].city ||
									geo[0].subregion ||
									geo[0].district ||
									"Aracaju";
							}
						} catch (geoError) {
							console.log("Erro ao buscar cidade: ", geoError);
						}
					}

					if (photo && photo.uri) {
						const tempFileName = `temp_${Date.now()}.jpg`;
						const secureFile = new File(
							Paths.document,
							tempFileName,
						);

						const cacheFile = new File(photo.uri);
						await cacheFile.move(secureFile);

						router.push({
							pathname: "/pictureInfo",
							params: {
								imageUri: secureFile.uri,
								latitude: coords?.latitude.toString(),
								longitude: coords?.longitude.toString(),
								cityName: cityName,
							},
						});
					}
				} catch (e) {
					console.log("Erro ao tirar foto: ", e);
				}
			}
		},
	}));

	if (!permission) {
		return <View />;
	}

	if (!permission.granted) {
		return (
			<View>
				<Text style={styles.text}>
					É necessário a permissão para abrir a câmera.
				</Text>
				<JotaButton
					text="Conceder Permissão"
					onPressed={requestPermission}
				/>
			</View>
		);
	}

	return (
		<View style={[styles.container, props.size]}>
			<CameraView
				style={[styles.camera, props.size]}
				facing="back"
				ref={cameraRef}
			/>
		</View>
	);
});

const styles = StyleSheet.create({
	container: {
		borderRadius: 20,
		overflow: "hidden",
		alignItems: "center",
		justifyContent: "center",
		backgroundColor: JotaColors.background,
	},
	text: {
		color: JotaColors.text,
		fontSize: 16,
		userSelect: "none",
		marginBottom: 10,
	},
	camera: {
		flex: 1,
	},
});

export default JotaCameraView;
