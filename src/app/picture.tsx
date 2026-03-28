import JotaCameraView from "@/components/JotaCameraView";
import JotaEmptyButton from "@/components/JotaEmptyButton";
import { JotaColors } from "@/constants/JotaColors";
import { Stack, useRouter } from "expo-router";
import { Platform, StyleSheet, View } from "react-native";

export default function Index() {
	const router = useRouter();

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
			<JotaCameraView size={{ width: 300, height: 400 }} />
			<JotaEmptyButton
				size={{ width: 100, height: 100 }}
				roundness={50}
				floating={true}
				onPressed={() => console.log("oi")}
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
