import React from "react";
import { StyleSheet, TextInput } from "react-native";
import { JotaColors } from "../constants/JotaColors";

type Props = {
	placeholder: string;
	placeholderColor?: string;
	value: string;
	onChangeText: (text: string) => void;
};

const JotaTextInput = (props: Props) => {
	return (
		<TextInput
			style={styles.textInput}
			placeholder={props.placeholder}
			placeholderTextColor={props.placeholderColor}
			value={props.value}
			onChangeText={props.onChangeText}
			multiline={true}
			numberOfLines={4}
		/>
	);
};

const styles = StyleSheet.create({
	textInput: {
		width: 300,
		height: 100,
		padding: 10,
		marginVertical: 10,
		borderWidth: 2,
		borderColor: JotaColors.border,
		borderRadius: 4,
		color: JotaColors.text,
		fontSize: 14,
		textAlignVertical: "top",
	},
});

export default JotaTextInput;
