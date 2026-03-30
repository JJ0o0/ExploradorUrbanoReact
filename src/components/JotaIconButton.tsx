import { JotaColors } from "@/constants/JotaColors";
import { IconDefinition, IconProp } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import React from "react";
import {
	GestureResponderEvent,
	Pressable,
	StyleProp,
	StyleSheet,
	ViewStyle,
} from "react-native";

type Props = {
	icon: IconDefinition;
	onPressed: (event: GestureResponderEvent) => void;
	floating?: boolean;
	roundness?: number;
	iconSize?: number;
	rotate?: number;
	style?: StyleProp<ViewStyle>;
};

const JotaIconButton = (props: Props) => {
	const dynamicRoundness =
		props.roundness !== undefined ? { borderRadius: props.roundness } : {};
	const dynamicIconSize = props.iconSize !== undefined ? props.iconSize : 40;
	const dynamicRotation = props.rotate !== undefined ? props.rotate : 0; // JoJo Reference

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
				dynamicRoundness,
				props.style,
			]}
			onPress={props.onPressed}
		>
			{({ pressed }) => (
				<FontAwesomeIcon
					icon={props.icon as IconProp}
					color={pressed ? JotaColors.foreground : "white"}
					size={dynamicIconSize}
					transform={{ rotate: dynamicRotation }}
				/>
			)}
		</Pressable>
	);
};

const styles = StyleSheet.create({
	button: {
		padding: 10,
		borderWidth: 3,
		borderRadius: 20,
		borderColor: JotaColors.border,
		backgroundColor: JotaColors.background,
		justifyContent: "center",
		alignItems: "center",
	},
	buttonPressed: {
		padding: 8,
		borderWidth: 5,
		borderRadius: 20,
		borderColor: JotaColors.border,
		backgroundColor: "white",
	},
	buttonFloating: {
		padding: 10,
		borderWidth: 3,
		borderRadius: 20,
		borderColor: JotaColors.border,
		backgroundColor: JotaColors.background,
		justifyContent: "center",
		alignItems: "center",
		position: "absolute",
		bottom: 60,
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
		borderColor: JotaColors.border,
		backgroundColor: "white",
		justifyContent: "center",
		alignItems: "center",
		position: "absolute",
		bottom: 60,
		elevation: 5,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.25,
		shadowRadius: 3.84,
		zIndex: 999,
	},
});

export default JotaIconButton;
