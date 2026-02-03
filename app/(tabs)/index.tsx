import { Link } from "expo-router";
import {
  Dimensions,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");

export default function HomeScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={{
        ...styles.container,
        paddingTop: insets.top + 20,
      }}
    >
      <View style={styles.topLights}>
        <View style={styles.cameraLens}>
          <View style={styles.lensReflex} />
        </View>
        <View style={{ ...styles.smallLight, backgroundColor: "#FF0000" }} />
        <View style={{ ...styles.smallLight, backgroundColor: "#FFCB05" }} />
        <View style={{ ...styles.smallLight, backgroundColor: "#32CD32" }} />
      </View>

      <View style={styles.screenOuterFrame}>
        <View style={styles.screenInnerFrame}>
          <Text style={styles.welcomeText}>SISTEMA POKÉDEX</Text>
          <Text style={styles.subText}>ENCUENTRA AQUÍ TODA LA INFORMACIÓN</Text>
          <View style={styles.scanLine} />
        </View>

        <View style={styles.screenDecor}>
          <View style={styles.redDot} />
          <View style={styles.speakerGrill}>
            <View style={styles.grillLine} />
            <View style={styles.grillLine} />
            <View style={styles.grillLine} />
          </View>
        </View>
      </View>

      <View style={styles.controlsRow}>
        <View style={styles.dPad}>
          <View style={styles.dPadVertical} />
          <View style={styles.dPadHorizontal} />
        </View>

        <View style={styles.actionButtons}>
          <Link href="/listado" asChild>
            <Pressable style={styles.pokeButton}>
              <Text style={styles.buttonText}>LISTA</Text>
            </Pressable>
          </Link>

          <Link href="/explore" asChild>
            <Pressable
              style={{ ...styles.pokeButton, backgroundColor: "#3B4CCA" }}
            >
              <Text style={{ ...styles.buttonText, color: "#FFFFFF" }}>
                ARENA
              </Text>
            </Pressable>
          </Link>

          <Link href="/favoritos" asChild>
            <Pressable
              style={{ ...styles.pokeButton, backgroundColor: "#585858" }}
            >
              <Text style={{ ...styles.buttonText, color: "#FFFFFF" }}>
                EQUIPO
              </Text>
            </Pressable>
          </Link>
        </View>
      </View>

      <View style={styles.bottomDecor} />

      <Image
        source={require("../../assets/images/pokemon-magnemite-animated-custom-cursor-ezgif.com-crop.gif")}
        style={[styles.magnemite, { bottom: insets.bottom + 20 }]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#CC0000", alignItems: "center" },
  topLights: {
    flexDirection: "row",
    alignSelf: "flex-start",
    paddingLeft: 30,
    alignItems: "center",
    marginBottom: 20,
  },
  cameraLens: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#51ADFE",
    borderWidth: 6,
    borderColor: "white",
    elevation: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  lensReflex: {
    width: 20,
    height: 10,
    backgroundColor: "rgba(255,255,255,0.4)",
    borderRadius: 10,
    position: "absolute",
    top: 10,
    left: 10,
  },
  smallLight: {
    width: 15,
    height: 15,
    borderRadius: 10,
    marginLeft: 15,
    borderWidth: 2,
    borderColor: "#333",
  },
  screenOuterFrame: {
    width: "85%",
    height: width * 0.6,
    backgroundColor: "#DEDEDE",
    borderRadius: 10,
    borderBottomLeftRadius: 40,
    padding: 20,
    elevation: 5,
    marginBottom: 30,
  },
  screenInnerFrame: {
    flex: 1,
    backgroundColor: "#333",
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    borderWidth: 3,
    borderColor: "#111",
  },
  scanLine: {
    position: "absolute",
    width: "100%",
    height: 2,
    backgroundColor: "rgba(0,255,0,0.1)",
    top: "50%",
  },
  welcomeText: {
    color: "#00FF00",
    fontSize: 20,
    fontWeight: "bold",
    fontFamily: "monospace",
  },
  subText: {
    color: "#00FF00",
    fontSize: 12,
    marginTop: 5,
    fontFamily: "monospace",
  },
  screenDecor: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
  },
  redDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#CC0000",
    borderWidth: 1,
  },
  speakerGrill: { width: 40 },
  grillLine: {
    height: 3,
    backgroundColor: "#333",
    marginVertical: 1,
    borderRadius: 2,
  },
  controlsRow: {
    flexDirection: "row",
    width: "85%",
    justifyContent: "space-between",
    alignItems: "center",
  },
  dPad: {
    width: 100,
    height: 100,
    justifyContent: "center",
    alignItems: "center",
  },
  dPadVertical: {
    width: 30,
    height: 90,
    backgroundColor: "#333",
    borderRadius: 5,
    position: "absolute",
  },
  dPadHorizontal: {
    width: 90,
    height: 30,
    backgroundColor: "#333",
    borderRadius: 5,
    position: "absolute",
  },
  actionButtons: { flex: 1, marginLeft: 20 },
  pokeButton: {
    backgroundColor: "#FFCB05",
    paddingVertical: 12,
    borderRadius: 10,
    marginBottom: 10,
    alignItems: "center",
    elevation: 4,
    borderBottomWidth: 4,
    borderBottomColor: "rgba(0,0,0,0.3)",
  },
  buttonText: {
    color: "#3B4CCA",
    fontWeight: "bold",
    fontSize: 14,
    fontFamily: "monospace",
  },
  bottomDecor: {
    width: 60,
    height: 10,
    backgroundColor: "#333",
    borderRadius: 5,
    marginTop: 40,
    opacity: 0.3,
  },
  magnemite: {
    position: "absolute",
    left: 20,
    width: 125,
    height: 125,
    resizeMode: "contain",
  },
});
