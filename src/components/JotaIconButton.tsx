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
  style?: StyleProp<ViewStyle>;
};

const JotaIconButton = (props: Props) => {
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
      ]}
      onPress={props.onPressed}
    >
      <FontAwesomeIcon
        style={{ userSelect: "none" }}
        icon={props.icon as IconProp}
        color="white"
        size={40}
      />
    </Pressable>
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

export default JotaIconButton;
