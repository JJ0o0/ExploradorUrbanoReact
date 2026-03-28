import JotaIconButton from "@/components/JotaIconButton";
import { JotaColors } from "@/constants/JotaColors";
import { JotaLocation } from "@/utils/JotaLocation";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { faAngleUp } from "@fortawesome/free-solid-svg-icons";
import { Stack, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import MapView, { PROVIDER_GOOGLE } from "react-native-maps";

export default function Map() {
	const [loading, setLoading] = useState(true);
	const [initialRegion, setInitialRegion] = useState<any>(null);
	const router = useRouter();

	useEffect(() => {
		async function setupMap() {
			const coords = await JotaLocation.getCurrentLocation();

			if (coords) {
				setInitialRegion(coords);
			}

			setLoading(false);
		}

		setupMap();
	}, []);

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
			{loading ? (
				<ActivityIndicator size={"large"} color={JotaColors.text} />
			) : (
				<MapView
					provider={PROVIDER_GOOGLE}
					style={styles.map}
					showsUserLocation={true}
					initialRegion={
						initialRegion || {
							latitude: -10.9472,
							longitude: -37.0731,
							latitudeDelta: 0.05,
							longitudeDelta: 0.05,
						}
					}
				/>
			)}
			<View style={styles.buttonContainer}>
				<JotaIconButton
					icon={faAngleUp as IconDefinition}
					onPressed={() => router.navigate("/picture")}
					floating={true}
					roundness={35}
				/>
			</View>
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
	buttonContainer: { position: "absolute", bottom: 50, alignSelf: "center" },
	title: {
		color: "white",
		fontSize: 24,
		userSelect: "none",
	},
	map: {
		...StyleSheet.absoluteFill,
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
});
