import JotaButton from "@/components/JotaButton";
import { Image } from "expo-image";
import { Stack, useRouter } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

export default function Index() {
	const mainImage = require("../../assets/images/user/main_logo.png");
	const router = useRouter();

	return (
		<View style={styles.container}>
			<Stack.Screen options={{ headerShown: false }} />
			<Text style={styles.title}>Navegador Urbano</Text>
			<Image style={styles.image} source={mainImage} contentFit="fill" />
			<JotaButton
				text="Explorar"
				onPressed={() => router.navigate("/map")}
			/>
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
	title: {
		color: "white",
		fontSize: 24,
		userSelect: "none",
	},
	image: {
		width: 200,
		height: 200,
		backgroundColor: "transparent",
		userSelect: "none",
	},
});
