import JotaIconButton from "@/components/JotaIconButton";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { faAngleUp } from "@fortawesome/free-solid-svg-icons";
import { Stack, useRouter } from "expo-router";
import { StyleSheet, View } from "react-native";

export default function Index() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: true }} />
      <JotaIconButton
        icon={faAngleUp as IconDefinition}
        onPressed={() => console.log("oi")}
        floating={true}
      />
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
  title: {
    color: "white",
    fontSize: 24,
    userSelect: "none",
  },
  image: {
    width: 200,
    height: 200,
    backgroundColor: "transparent",
    userSelect: "none",
  },
});
