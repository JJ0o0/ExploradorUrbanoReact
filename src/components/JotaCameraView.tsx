import { JotaColors } from "@/constants/JotaColors";
import { CameraView, useCameraPermissions } from "expo-camera";
import { useRef } from "react";
import { StyleSheet, Text, View } from "react-native";
import JotaButton from "./JotaButton";

type Size = { width: number; height: number };
type Props = {
	size: Size;
};

const JotaCameraView = (props: Props) => {
	const [permission, requestPermission] = useCameraPermissions();
	const cameraRef = useRef<CameraView>(null);

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

	const takePicture = async () => {
		if (cameraRef.current) {
			const photo = await cameraRef.current.takePictureAsync();
		}
	};

	return (
		<View style={[styles.container, props.size]}>
			<CameraView
				style={[styles.camera, props.size]}
				facing="back"
				ref={cameraRef}
			/>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		borderRadius: 20,
		overflow: "hidden",
		alignItems: "center",
		justifyContent: "center",
		backgroundColor: "#343a40",
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
