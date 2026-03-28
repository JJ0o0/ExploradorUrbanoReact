import React from "react";
import {
	GestureResponderEvent,
	Pressable,
	StyleSheet,
	Text,
} from "react-native";
import { JotaColors } from "../constants/JotaColors";

type Props = {
	text: string;
	onPressed: (event: GestureResponderEvent) => void;
};

const JotaButton = (props: Props) => {
	return (
		<Pressable
			style={({ pressed }) => [
				styles.button,
				pressed ? styles.buttonPressed : styles.button,
			]}
			onPress={props.onPressed}
		>
			{({ pressed }) => (
				<Text
					style={[
						styles.buttonText,
						pressed ? styles.buttonTextPressed : styles.buttonText,
					]}
				>
					{props.text}
				</Text>
			)}
		</Pressable>
	);
};

const styles = StyleSheet.create({
	buttonText: {
		color: JotaColors.text,
		fontSize: 16,
		userSelect: "none",
	},
	buttonTextPressed: {
		color: JotaColors.foreground,
		fontSize: 16,
		userSelect: "none",
	},
	button: {
		paddingHorizontal: 30,
		paddingVertical: 10,
		borderWidth: 3,
		borderRadius: 20,
		borderColor: "white",
		alignItems: "center",
	},
	buttonPressed: {
		paddingHorizontal: 28,
		paddingVertical: 8,
		borderWidth: 5,
		borderRadius: 20,
		borderColor: "white",
		backgroundColor: "white",
	},
});

export default JotaButton;
