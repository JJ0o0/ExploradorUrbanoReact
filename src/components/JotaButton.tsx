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
	size?: { width: number; height: number };
	backgroundColor?: string;
	pressedBackgroundColor?: string;
	borderColor?: string;
};

const JotaButton = (props: Props) => {
	const adaptativeSize =
		props.size !== undefined
			? { width: props.size.width, height: props.size.height }
			: {};
	const customBG =
		props.backgroundColor !== undefined
			? { backgroundColor: props.backgroundColor }
			: {};
	const customPBG =
		props.pressedBackgroundColor !== undefined
			? { backgroundColor: props.pressedBackgroundColor }
			: {};
	const customBorderColor =
		props.borderColor !== undefined
			? { borderColor: props.borderColor }
			: {};

	return (
		<Pressable
			style={({ pressed }) => [
				styles.button,
				pressed ? styles.buttonPressed : styles.button,
				pressed ? customPBG : customBG,
				adaptativeSize,
				customBorderColor,
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
		borderColor: JotaColors.border,
		alignItems: "center",
	},
	buttonPressed: {
		paddingHorizontal: 28,
		paddingVertical: 8,
		borderWidth: 5,
		borderRadius: 20,
		borderColor: JotaColors.border,
		backgroundColor: JotaColors.border,
	},
});

export default JotaButton;
