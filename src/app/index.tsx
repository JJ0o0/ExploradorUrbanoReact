import JotaButton from "@/components/JotaButton";
import JotaIconButton from "@/components/JotaIconButton";
import { JotaColors } from "@/constants/JotaColors";
import { getMapHtml } from "@/constants/JotaMap";
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
						source={{
							html: getMapHtml(coords, photos),
						}}
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
