import JotaButton from "@/components/JotaButton";
import JotaTextInput from "@/components/JotaTextInput";
import { JotaColors } from "@/constants/JotaColors";
import { JotaStorage } from "@/utils/JotaStorage";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import {
	Alert,
	Image,
	Keyboard,
	KeyboardAvoidingView,
	Platform,
	StyleSheet,
	TouchableWithoutFeedback,
	View,
} from "react-native";

export default function PictureInfo() {
	const params = useLocalSearchParams<{
		id?: string;
		imageUri: string;
		latitude: string;
		longitude: string;
		cityName: string;
	}>();
	const decodedUri = decodeURIComponent(params.imageUri);

	const [description, setDescription] = useState("");
	const [isSaving, setIsSaving] = useState(false);
	const isEditing = !!params.id;
	const router = useRouter();

	const handleSave = async () => {
		if (!description.trim()) {
			Alert.alert("Erro", "Escreva uma descrição válida!");
			return;
		}

		if (!params.imageUri) {
			return;
		}

		setIsSaving(true);

		try {
			let success = false;

			if (isEditing) {
				success = await JotaStorage.updatePhoto(
					Number(params.id),
					description,
				);
			} else {
				const coords = {
					latitude: parseFloat(params.latitude),
					longitude: parseFloat(params.longitude),
				};

				success = await JotaStorage.savePhoto(
					params.imageUri,
					description,
					coords,
					params.cityName,
				);
			}

			if (success) {
				Alert.alert(
					"Sucesso!",
					isEditing
						? "Registro editado com sucesso!"
						: "Adicionado seu registro ao mapa!",
					[
						{
							text: "OK",
							onPress: () => router.replace("/"),
						},
					],
				);
			} else {
				Alert.alert("Erro", "Não foi possível armazenar os dados");
			}
		} catch (error) {
			console.error(error);
			Alert.alert("Erro", "Erro Crítico!");
		} finally {
			setIsSaving(false);
		}
	};
	return (
		<KeyboardAvoidingView
			style={{ flex: 1 }}
			behavior={Platform.OS === "ios" ? "padding" : "height"}
		>
			<TouchableWithoutFeedback onPress={Keyboard.dismiss}>
				<View style={styles.container}>
					<Stack.Screen
						options={{
							headerShown: true,
							headerTitle: isEditing
								? "Editar Local"
								: "Novo Local",
							headerBackTitle: "",
						}}
					/>
					<Image
						source={{ uri: decodedUri }}
						style={styles.image}
						resizeMode="cover"
						onLoad={() =>
							console.log("Imagem carregada com sucesso!")
						}
						onError={(e) =>
							console.log(
								"Erro no carregamento:",
								e.nativeEvent.error,
							)
						}
					/>
					<JotaTextInput
						value={description}
						onChangeText={setDescription}
						placeholder="Descrição"
						placeholderColor={JotaColors.placeholder}
					/>
					<JotaButton
						text={isSaving ? "Guardando..." : "Salvar"}
						onPressed={handleSave}
					/>
				</View>
			</TouchableWithoutFeedback>
		</KeyboardAvoidingView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
		backgroundColor: JotaColors.background,
	},
	description: {
		color: "white",
		fontSize: 24,
	},
	image: {
		width: 300,
		height: 300,
		backgroundColor: "transparent",
		userSelect: "none",
		borderWidth: 2,
		borderRadius: 10,
		borderColor: "white",
	},
	header: {
		backgroundColor: "transparent",
		userSelect: "none",
	},
});
