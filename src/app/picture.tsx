import JotaCameraView, { JotaCameraRef } from "@/components/JotaCameraView";
import JotaEmptyButton from "@/components/JotaEmptyButton";
import { JotaColors } from "@/constants/JotaColors";
import { Stack } from "expo-router";
import { useRef, useState } from "react";
import { Platform, StyleSheet, View } from "react-native";

export default function Picture() {
	const [isTakingPicture, setIsTakingPicture] = useState(false);
	const jotaCameraRef = useRef<JotaCameraRef>(null);

	const handleTakePicture = async () => {
		if (isTakingPicture) return;

		setIsTakingPicture(true);

		try {
			await jotaCameraRef.current?.takePicture();
		} catch (error) {
			console.error(error);
			setIsTakingPicture(false);
		}
	};

	return (
		<View style={styles.container}>
			<Stack.Screen
				options={{
					headerShown: true,
					headerStyle: styles.header,
					headerTitleStyle: styles.headerTitle,
					headerTransparent: true,
					headerTintColor: JotaColors.text,
					headerTitle: "Voltar",
					headerBackTitle: "",
				}}
			/>
			<JotaCameraView
				ref={jotaCameraRef}
				size={{ width: 350, height: 500 }}
			/>
			<JotaEmptyButton
				size={{ width: 100, height: 100 }}
				roundness={50}
				floating={true}
				onPressed={handleTakePicture}
				style={isTakingPicture ? { opacity: 0.5 } : {}}
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
	header: {
		backgroundColor: "transparent",
	},
	headerTitle: {
		...Platform.select({
			web: {
				userSelect: "none",
			} as any,
			default: {},
		}),
	},
});
