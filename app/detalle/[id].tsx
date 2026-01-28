import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

interface PokemonDetail {
  id: number;
  name: string;
  height: number;
  weight: number;
  sprites: {
    front_default: string;
  };
  types: {
    type: { name: string };
  }[];
  stats: {
    base_stat: number;
    stat: { name: string };
  }[];
}

const COLOR_STATS: any = {
  hp: "#FF0000",
  attack: "#F08030",
  defense: "#F8D030",
  "special-attack": "#6890F0",
  "special-defense": "#78C850",
  speed: "#F85888",
};

export default function DetalleScreen() {
  const { id } = useLocalSearchParams();
  const [pokemon, setPokemon] = useState<PokemonDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setPokemon(data);
        checkIfFavorite(data.id);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  const checkIfFavorite = async (pokemonId: number) => {
    try {
      const favorites = await AsyncStorage.getItem("favoritos");
      if (favorites) {
        const favsArray = JSON.parse(favorites);
        setIsFavorite(favsArray.some((fav: any) => fav.id === pokemonId));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const toggleFavorite = async () => {
    if (!pokemon) return;
    try {
      const favorites = await AsyncStorage.getItem("favoritos");
      let favsArray = favorites ? JSON.parse(favorites) : [];

      if (isFavorite) {
        favsArray = favsArray.filter((fav: any) => fav.id !== pokemon.id);
      } else {
        favsArray.push({
          id: pokemon.id,
          name: pokemon.name,
          image: pokemon.sprites.front_default,
        });
      }

      await AsyncStorage.setItem("favoritos", JSON.stringify(favsArray));
      setIsFavorite(!isFavorite);
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#FFCB05" />
      </View>
    );
  }

  if (!pokemon) return null;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.imageBg}>
          <Image
            source={{ uri: pokemon.sprites.front_default }}
            style={styles.image}
          />
        </View>
        <Text style={styles.name}>{pokemon.name.toUpperCase()}</Text>

        <Pressable
          onPress={toggleFavorite}
          style={[styles.favBtn, isFavorite && styles.favBtnActive]}
        >
          <Text style={styles.favBtnText}>
            {isFavorite ? "⭐ EN FAVORITOS" : "☆ AÑADIR A FAVORITOS"}
          </Text>
        </Pressable>

        <View style={styles.row}>
          {pokemon.types.map((t) => (
            <View key={t.type.name} style={styles.typeBadge}>
              <Text style={styles.typeText}>{t.type.name.toUpperCase()}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.statsCard}>
        <View style={styles.physicalInfo}>
          <View style={styles.infoBox}>
            <Text style={styles.infoVal}>{pokemon.weight / 10}kg</Text>
            <Text style={styles.infoLab}>PESO</Text>
          </View>
          <View style={styles.infoBox}>
            <Text style={styles.infoVal}>{pokemon.height / 10}m</Text>
            <Text style={styles.infoLab}>ALTURA</Text>
          </View>
        </View>

        <Text style={styles.statsTitle}>ESTADÍSTICAS BASE</Text>

        {pokemon.stats.map((s) => (
          <View key={s.stat.name} style={styles.statLine}>
            <View style={styles.statInfo}>
              <Text style={styles.statName}>
                {s.stat.name.replace("-", " ").toUpperCase()}
              </Text>
              <Text style={styles.statNumber}>{s.base_stat}</Text>
            </View>
            <View style={styles.barBackground}>
              <View
                style={[
                  styles.barFill,
                  {
                    width: `${Math.min((s.base_stat / 150) * 100, 100)}%`,
                    backgroundColor: COLOR_STATS[s.stat.name] || "#777",
                  },
                ]}
              />
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#CC0000" },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#CC0000",
  },
  header: { alignItems: "center", padding: 20 },
  imageBg: {
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 100,
    padding: 10,
    marginBottom: 10,
  },
  image: { width: 180, height: 180 },
  name: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#FFF",
    marginBottom: 15,
    fontFamily: "monospace",
  },
  favBtn: {
    backgroundColor: "#FFCB05",
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 25,
    marginBottom: 20,
    elevation: 5,
  },
  favBtnActive: { backgroundColor: "#333" },
  favBtnText: { fontWeight: "bold", color: "#FFF", fontSize: 14 },
  row: { flexDirection: "row" },
  typeBadge: {
    backgroundColor: "#FFF",
    paddingHorizontal: 18,
    paddingVertical: 6,
    borderRadius: 12,
    marginHorizontal: 6,
    borderWidth: 1,
    borderColor: "#DDD",
  },
  typeText: { color: "#333", fontWeight: "bold", fontSize: 12 },
  statsCard: {
    backgroundColor: "#FFF",
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    padding: 30,
    flex: 1,
    marginTop: 10,
    minHeight: 500,
  },
  physicalInfo: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 30,
  },
  infoBox: { alignItems: "center" },
  infoVal: { fontSize: 20, fontWeight: "bold", color: "#222" },
  infoLab: { fontSize: 11, color: "#999", fontWeight: "bold", marginTop: 4 },
  statsTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#222",
    marginBottom: 25,
    textAlign: "center",
  },
  statLine: { marginBottom: 15 },
  statInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  statName: { fontSize: 12, fontWeight: "bold", color: "#555" },
  statNumber: { fontSize: 12, fontWeight: "bold", color: "#222" },
  barBackground: {
    height: 10,
    backgroundColor: "#F0F0F0",
    borderRadius: 5,
    overflow: "hidden",
  },
  barFill: { height: "100%", borderRadius: 5 },
});
