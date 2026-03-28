import JotaButton from "@/components/JotaButton";
import JotaTextInput from "@/components/JotaTextInput";
import { JotaColors } from "@/constants/JotaColors";
import { JotaStorage } from "@/utils/JotaStorage";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { Alert, Image, StyleSheet, View } from "react-native";

export default function PictureInfo() {
	const { imageUri, latitude, longitude, cityName } = useLocalSearchParams<{
		imageUri: string;
		latitude: string;
		longitude: string;
		cityName: string;
	}>();
	const decodedUri = decodeURIComponent(imageUri);

	const [description, setDescription] = useState("");
	const [isSaving, setIsSaving] = useState(false);
	const router = useRouter();

	const handleSave = async () => {
		if (!description.trim()) {
			Alert.alert("Erro", "Escreva uma descrição válida!");
			return;
		}

		if (!imageUri) {
			return;
		}

		setIsSaving(true);

		try {
			const coords = {
				latitude: parseFloat(latitude),
				longitude: parseFloat(longitude),
			};
			const success = await JotaStorage.savePhoto(
				imageUri,
				description,
				coords,
				cityName,
			);

			console.log(coords);

			if (success) {
				if (router.canDismiss()) {
					router.dismiss(2);
				} else {
					router.back();
					router.back();
				}

				Alert.alert("Sucesso!", "Adicionado seu registro ao mapa!");
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
			<Image
				source={{ uri: decodedUri }}
				style={styles.image}
				resizeMode="cover"
				onLoad={() => console.log("Imagem carregada com sucesso!")}
				onError={(e) =>
					console.log("Erro no carregamento:", e.nativeEvent.error)
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
		height: 500,
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
