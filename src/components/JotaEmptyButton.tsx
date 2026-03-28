import { JotaColors } from "@/constants/JotaColors";
import React from "react";
import {
	GestureResponderEvent,
	Pressable,
	StyleProp,
	StyleSheet,
	ViewStyle,
} from "react-native";

type Size = { width: number; height: number };
type Props = {
	onPressed: (event: GestureResponderEvent) => void;
	size?: Size;
	roundness?: number;
	floating?: boolean;
	style?: StyleProp<ViewStyle>;
};

const JotaEmptyButton = (props: Props) => {
	const dynamicRoundness =
		props.roundness !== undefined ? { borderRadius: props.roundness } : {};
	const dynamicSize =
		props.size !== undefined
			? { width: props.size.width, height: props.size.height }
			: {};

	return (
		<Pressable
			style={({ pressed }) => [
				styles.button,
				props.floating
					? pressed
						? styles.buttonFloatingPressed
						: styles.buttonFloating
					: pressed
						? styles.buttonPressed
						: styles.button,
				dynamicSize,
				dynamicRoundness,
				props.style,
			]}
			onPress={props.onPressed}
		></Pressable>
	);
};

const styles = StyleSheet.create({
	button: {
		padding: 10,
		borderWidth: 3,
		borderRadius: 20,
		borderColor: "white",
		backgroundColor: JotaColors.background,
		justifyContent: "center",
		alignItems: "center",
	},
	buttonPressed: {
		padding: 8,
		borderWidth: 5,
		borderRadius: 20,
		borderColor: "white",
		backgroundColor: "white",
	},
	buttonFloating: {
		padding: 10,
		borderWidth: 3,
		borderRadius: 20,
		borderColor: "white",
		backgroundColor: JotaColors.background,
		justifyContent: "center",
		alignItems: "center",
		position: "absolute",
		bottom: 30,
		elevation: 5,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.25,
		shadowRadius: 3.84,
		zIndex: 999,
	},
	buttonFloatingPressed: {
		padding: 8,
		borderWidth: 5,
		borderRadius: 20,
		borderColor: "white",
		backgroundColor: "white",
		justifyContent: "center",
		alignItems: "center",
		position: "absolute",
		bottom: 30,
		elevation: 5,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.25,
		shadowRadius: 3.84,
		zIndex: 999,
	},
});

export default JotaEmptyButton;
