import { JotaColors } from "@/constants/JotaColors";
import { Stack } from "expo-router";
import { Platform } from "react-native";

export default function RootLayout() {
	return (
		<Stack
			screenOptions={{
				headerStyle: {
					backgroundColor: "transparent",
				},
				headerTitleStyle: {
					...Platform.select({
						web: {
							userSelect: "none",
						} as any,
						default: {},
					}),
				},
				headerTransparent: true,
				headerTintColor: JotaColors.text,
				headerTitleAlign: "center",
			}}
		/>
	);
}
