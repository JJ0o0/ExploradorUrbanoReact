import JotaInfoDock from "@/components/JotaInfoDock";
import { JotaColors } from "@/constants/JotaColors";
import { JotaLocation } from "@/utils/JotaLocation";
import { Stack } from "expo-router";
import { useEffect, useState } from "react";
import {
	ActivityIndicator,
	FlatList,
	Platform,
	StyleSheet,
	Text,
	View,
} from "react-native";

export default function Closest() {
	const [locations, setLocations] = useState<any[]>();
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		async function loadData() {
			setLoading(true);

			const data = await JotaLocation.getNearestsLocations();
			setLocations(data || []);

			setLoading(false);
		}

		loadData();
	}, []);

	return (
		<View style={styles.container}>
			<Stack.Screen
				options={{
					headerShown: true,
					headerTitle: "Marcadores Perto de Você",
					headerBackTitle: "",
				}}
			/>
			{loading ? (
				<ActivityIndicator size={"large"} color={JotaColors.text} />
			) : (
				<FlatList
					style={{ marginTop: 80 }}
					showsVerticalScrollIndicator={false}
					data={locations}
					keyExtractor={(item) => item.id.toString()}
					contentContainerStyle={styles.listContent}
					renderItem={({ item }) => (
						<JotaInfoDock
							imageUri={item.imageUri}
							city={item.cityName || "Aracaju"}
							description={item.description}
							date={`${new Date(item.date).toLocaleDateString()}`}
						/>
					)}
					ListEmptyComponent={
						<Text style={styles.emptyText}>
							Nenhum marcador encontrado por perto
						</Text>
					}
				/>
			)}
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: JotaColors.background,
	},
	listContent: {
		paddingVertical: 20,
		paddingBottom: 20,
		alignItems: "center",
		gap: 15,
	},
	emptyText: {
		color: JotaColors.placeholder,
		marginTop: 50,
		textAlign: "center",
	},
	title: {
		color: "white",
		fontSize: 24,
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
