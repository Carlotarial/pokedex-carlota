import { Link } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const COLORES_TIPOS: Record<string, string> = {
  all: "#585858",
  fire: "#F08030",
  water: "#6890F0",
  grass: "#78C850",
  electric: "#F8D030",
  bug: "#A8B820",
  normal: "#A8A878",
  poison: "#A040A0",
  psychic: "#F85888",
  rock: "#B8A038",
  ground: "#E0C068",
  ghost: "#705898",
  dragon: "#7038F8",
};

const TIPOS = Object.keys(COLORES_TIPOS);
const LIMIT = 20;

interface PokemonListItem {
  name: string;
  url: string;
  types: string[];
}

export default function ListadoScreen() {
  const insets = useSafeAreaInsets();

  const [pokemon, setPokemon] = useState<any[]>([]);
  const [allPokemon, setAllPokemon] = useState<PokemonListItem[]>([]);
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    cargarPokemonInitial();
    cargarListaMaestra();
  }, []);

  const cargarListaMaestra = async () => {
    try {
      const res = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=151`);
      const data = await res.json();
      const detallesCompletos = await Promise.all(
        data.results.map(async (p: any) => {
          const r = await fetch(p.url);
          const d = await r.json();
          return {
            name: p.name,
            url: p.url,
            types: d.types.map((t: any) => t.type.name),
          };
        }),
      );
      setAllPokemon(detallesCompletos);
    } catch (e) {
      console.error(e);
    }
  };

  const cargarPokemonInitial = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `https://pokeapi.co/api/v2/pokemon?limit=${LIMIT}&offset=0`,
      );
      const data = await res.json();
      setPokemon(data.results);
      setOffset(LIMIT);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const cargarMasPokemon = async () => {
    if (
      loadingMore ||
      selectedTypes.length > 0 ||
      search !== "" ||
      offset >= 151
    )
      return;
    setLoadingMore(true);
    try {
      const res = await fetch(
        `https://pokeapi.co/api/v2/pokemon?limit=${LIMIT}&offset=${offset}`,
      );
      const data = await res.json();
      setPokemon((prev) => [...prev, ...data.results]);
      setOffset((prev) => prev + LIMIT);
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingMore(false);
    }
  };

  const manejarFiltroTipo = (tipo: string) => {
    if (tipo === "all") {
      setSelectedTypes([]);
      return;
    }
    setSelectedTypes((prev) => {
      if (prev.includes(tipo)) return prev.filter((t) => t !== tipo);
      return [...prev, tipo].slice(-2);
    });
  };

  const dataFiltrada =
    allPokemon.length > 0
      ? allPokemon.filter((p) => {
          const cumpleNombre = p.name.includes(search.toLowerCase());
          const cumpleTipo =
            selectedTypes.length === 0
              ? true
              : selectedTypes.every((t) => p.types.includes(t));
          return cumpleNombre && cumpleTipo;
        })
      : search === "" && selectedTypes.length === 0
        ? pokemon
        : [];

  const esTipoValido = (tipo: string) => {
    if (tipo === "all" || allPokemon.length === 0) return true;
    if (selectedTypes.includes(tipo)) return true;
    const nuevaSeleccion = [...selectedTypes, tipo].slice(-2);
    return allPokemon.some((p) => {
      const cumpleNombre = p.name.includes(search.toLowerCase());
      const cumpleTipo = nuevaSeleccion.every((t) => p.types.includes(t));
      return cumpleNombre && cumpleTipo;
    });
  };

  const renderFooter = () => {
    if (!loadingMore || search !== "" || selectedTypes.length > 0) return null;
    return (
      <ActivityIndicator
        size="small"
        color="#FFCB05"
        style={{ marginVertical: 20 }}
      />
    );
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TextInput
          style={styles.searchInput}
          placeholder="BUSCAR POKÉMON..."
          placeholderTextColor="#666"
          value={search}
          onChangeText={setSearch}
        />

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.scrollFilters}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ paddingVertical: 10 }}
        >
          {TIPOS.map((tipo) => {
            const valido = esTipoValido(tipo);
            const activo =
              selectedTypes.includes(tipo) ||
              (tipo === "all" && selectedTypes.length === 0);

            return (
              <Pressable
                key={tipo}
                disabled={!valido}
                onPress={() => manejarFiltroTipo(tipo)}
                hitSlop={{ top: 10, bottom: 10, left: 5, right: 5 }}
                style={[
                  styles.typeBadge,
                  { backgroundColor: COLORES_TIPOS[tipo] },
                  activo && styles.activeBadge,
                  !valido && styles.disabledBadge,
                ]}
              >
                <Text style={[styles.typeText, !valido && { color: "#999" }]}>
                  {tipo.toUpperCase()}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      {loading && allPokemon.length === 0 ? (
        <ActivityIndicator
          size="large"
          color="#FFCB05"
          style={{ marginTop: 20 }}
        />
      ) : (
        <FlatList
          data={dataFiltrada}
          keyExtractor={(item) => item.name}
          onEndReached={cargarMasPokemon}
          onEndReachedThreshold={0.5}
          ListFooterComponent={renderFooter}
          renderItem={({ item }) => {
            const id = item.url.split("/")[6];
            return (
              <Link
                href={{ pathname: "/detalle/[id]", params: { id } }}
                asChild
              >
                <Pressable style={styles.pokeCard}>
                  <Image
                    source={{
                      uri: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`,
                    }}
                    style={styles.pokeImg}
                  />
                  <View>
                    <Text style={styles.idLabel}>Nº {id.padStart(3, "0")}</Text>
                    <Text style={styles.pokeName}>
                      {item.name.toUpperCase()}
                    </Text>
                  </View>
                </Pressable>
              </Link>
            );
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#CC0000" },
  header: { backgroundColor: "#CC0000", paddingBottom: 5 },
  searchInput: {
    backgroundColor: "#333",
    color: "#00FF00",
    borderRadius: 5,
    padding: 12,
    marginHorizontal: 15,
    marginTop: 15,
    marginBottom: 5,
    fontFamily: "monospace",
    borderWidth: 2,
    borderColor: "#DEDEDE",
  },
  scrollFilters: { paddingHorizontal: 15 },
  typeBadge: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 4,
    marginRight: 10,
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.3)",
    minWidth: 80,
    alignItems: "center",
  },
  activeBadge: {
    borderColor: "#FFF",
    transform: [{ scale: 1.05 }],
    borderWidth: 3,
  },
  disabledBadge: { backgroundColor: "#444", borderColor: "#222", opacity: 0.3 },
  typeText: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 10,
    fontFamily: "monospace",
  },
  pokeCard: {
    flexDirection: "row",
    backgroundColor: "#FFF",
    marginHorizontal: 15,
    marginVertical: 5,
    padding: 10,
    alignItems: "center",
    borderLeftWidth: 8,
    borderLeftColor: "#333",
    borderRadius: 5,
    elevation: 2,
  },
  pokeImg: { width: 60, height: 60 },
  idLabel: { fontSize: 10, color: "#888", fontFamily: "monospace" },
  pokeName: { fontSize: 16, fontWeight: "bold", color: "#222" },
});
