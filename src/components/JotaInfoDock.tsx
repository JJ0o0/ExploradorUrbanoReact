import { JotaColors } from "@/constants/JotaColors";
import { Image } from "expo-image";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

type Props = {
	imageUri: string;
	city: string;
	description: string;
	date: string;
};

const JotaInfoDock = (props: Props) => {
	return (
		<View style={styles.container}>
			<Image style={styles.image} source={{ uri: props.imageUri }} />
			<View style={styles.textContainer}>
				<Text style={styles.city}>{props.city}</Text>
				<Text style={styles.description} numberOfLines={2}>
					{props.description}
				</Text>
				<Text style={styles.date}>{props.date}</Text>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		minWidth: "95%",
		height: 160,
		padding: 20,
		borderWidth: 2,
		borderColor: JotaColors.border,
		borderRadius: 20,
		flexDirection: "row",
		backgroundColor: JotaColors.darkerBackground,
	},
	textContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "flex-end",
		marginLeft: 15,
	},
	image: {
		width: 120,
		borderWidth: 2,
		borderColor: JotaColors.border,
		borderRadius: 20,
	},
	city: {
		fontWeight: "bold",
		fontSize: 18,
		color: JotaColors.text,
		textAlign: "right",
	},
	description: {
		fontSize: 16,
		color: JotaColors.text,
		marginVertical: 3,
		textAlign: "right",
	},
	date: {
		fontSize: 14,
		color: JotaColors.text,
		textAlign: "right",
	},
});

export default JotaInfoDock;
