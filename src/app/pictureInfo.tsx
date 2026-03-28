import JotaButton from "@/components/JotaButton";
import JotaTextInput from "@/components/JotaTextInput";
import { JotaColors } from "@/constants/JotaColors";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { Image, StyleSheet, View } from "react-native";

export default function PictureInfo() {
	const { imageUri } = useLocalSearchParams<{ imageUri: string }>();
	const decodedUri = decodeURIComponent(imageUri);

	const [description, setDescription] = useState("");
	const router = useRouter();

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
			<JotaButton text="Salvar" onPressed={() => console.log("oi")} />
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
		backgroundColor: "#343a40",
	},
	description: {
		color: "white",
		fontSize: 24,
	},
	image: {
		width: 300,
		height: 250,
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
