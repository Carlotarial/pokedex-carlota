import React, { useEffect, useState } from "react";
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface PokemonSimple {
  id: number;
  name: string;
  types: string[];
  image: string;
  hp: number;
}

const TABLA_TIPOS: Record<string, Record<string, number>> = {
  fire: {
    grass: 2,
    ice: 2,
    bug: 2,
    steel: 2,
    water: 0.5,
    fire: 0.5,
    rock: 0.5,
    dragon: 0.5,
  },
  water: { fire: 2, ground: 2, rock: 2, water: 0.5, grass: 0.5, dragon: 0.5 },
  grass: {
    water: 2,
    ground: 2,
    rock: 2,
    fire: 0.5,
    grass: 0.5,
    poison: 0.5,
    flying: 0.5,
    bug: 0.5,
    dragon: 0.5,
    steel: 0.5,
  },
  electric: {
    water: 2,
    flying: 2,
    electric: 0.5,
    grass: 0.5,
    dragon: 0.5,
    ground: 0,
  },
  ice: {
    grass: 2,
    ground: 2,
    flying: 2,
    dragon: 2,
    fire: 0.5,
    water: 0.5,
    ice: 0.5,
    steel: 0.5,
  },
  fighting: {
    normal: 2,
    ice: 2,
    rock: 2,
    dark: 2,
    steel: 2,
    poison: 0.5,
    flying: 0.5,
    psychic: 0.5,
    bug: 0.5,
    fairy: 0.5,
    ghost: 0,
  },
  poison: {
    grass: 2,
    fairy: 2,
    poison: 0.5,
    ground: 0.5,
    rock: 0.5,
    ghost: 0.5,
    steel: 0,
  },
  ground: {
    fire: 2,
    electric: 2,
    poison: 2,
    rock: 2,
    steel: 2,
    grass: 0.5,
    bug: 0.5,
    flying: 0,
  },
  flying: {
    grass: 2,
    fighting: 2,
    bug: 2,
    electric: 0.5,
    rock: 0.5,
    steel: 0.5,
  },
  psychic: { fighting: 2, poison: 2, psychic: 0.5, steel: 0.5, dark: 0 },
  bug: {
    grass: 2,
    psychic: 2,
    dark: 2,
    fire: 0.5,
    fighting: 0.5,
    poison: 0.5,
    flying: 0.5,
    ghost: 0.5,
    steel: 0.5,
    fairy: 0.5,
  },
  rock: {
    fire: 2,
    ice: 2,
    flying: 2,
    bug: 2,
    fighting: 0.5,
    ground: 0.5,
    steel: 0.5,
  },
  ghost: { psychic: 2, ghost: 2, dark: 0.5, normal: 0 },
  dragon: { dragon: 2, steel: 0.5, fairy: 0 },
  dark: { psychic: 2, ghost: 2, fighting: 0.5, dark: 0.5, fairy: 0.5 },
  steel: {
    ice: 2,
    rock: 2,
    fairy: 2,
    fire: 0.5,
    water: 0.5,
    electric: 0.5,
    steel: 0.5,
  },
  fairy: {
    fighting: 2,
    dragon: 2,
    dark: 2,
    fire: 0.5,
    poison: 0.5,
    steel: 0.5,
  },
  normal: { rock: 0.5, steel: 0.5, ghost: 0 },
};

export default function ArenaScreen() {
  const insets = useSafeAreaInsets();

  const [listaFull, setListaFull] = useState([]);
  const [pokemonA, setPokemonA] = useState<PokemonSimple | null>(null);
  const [pokemonB, setPokemonB] = useState<PokemonSimple | null>(null);
  const [filtroA, setFiltroA] = useState("");
  const [filtroB, setFiltroB] = useState("");
  const [resultado, setResultado] = useState("");

  useEffect(() => {
    fetch("https://pokeapi.co/api/v2/pokemon?limit=151")
      .then((res) => res.json())
      .then((data) => setListaFull(data.results));
  }, []);

  const seleccionar = async (name: string, side: "A" | "B") => {
    const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
    const data = await res.json();
    const pData: PokemonSimple = {
      id: data.id,
      name: data.name,
      types: data.types.map((t: any) => t.type.name),
      image:
        data.sprites.other["official-artwork"].front_default ||
        data.sprites.front_default,
      hp: data.stats[0].base_stat,
    };
    if (side === "A") {
      setPokemonA(pData);
      setFiltroA("");
    } else {
      setPokemonB(pData);
      setFiltroB("");
    }
    setResultado("");
  };

  const getEfectividad = (tiposAtacante: string[], tiposDefensor: string[]) => {
    let maxEfectividad = 0;

    tiposAtacante.forEach((tipoA) => {
      let efectividadTipo = 1;
      tiposDefensor.forEach((tipoD) => {
        const multiplicador = TABLA_TIPOS[tipoA]?.[tipoD] ?? 1;
        efectividadTipo *= multiplicador;
      });
      if (efectividadTipo > maxEfectividad) maxEfectividad = efectividadTipo;
    });

    return maxEfectividad;
  };

  const combatir = () => {
    if (!pokemonA || !pokemonB) return;

    const ventajaA = getEfectividad(pokemonA.types, pokemonB.types);
    const ventajaB = getEfectividad(pokemonB.types, pokemonA.types);

    if (ventajaA > ventajaB)
      setResultado(`¡VICTORIA PARA ${pokemonA.name.toUpperCase()}!`);
    else if (ventajaB > ventajaA)
      setResultado(`¡VICTORIA PARA ${pokemonB.name.toUpperCase()}!`);
    else setResultado("¡EMPATE!");
  };

  const renderSearch = (
    val: string,
    setVal: Function,
    side: "A" | "B",
    label: string,
  ) => (
    <View style={styles.searchBox}>
      <Text style={styles.searchLabel}>{label}</Text>
      <TextInput
        style={styles.input}
        placeholder="Nombre..."
        value={val}
        onChangeText={(t) => setVal(t)}
      />
      {val.length > 1 && (
        <View style={styles.dropdown}>
          {listaFull
            .filter((p: any) => p.name.includes(val.toLowerCase()))
            .slice(0, 2)
            .map((p: any) => (
              <Pressable
                key={p.name}
                onPress={() => seleccionar(p.name, side)}
                style={styles.dropItem}
              >
                <Text style={styles.dropText}>{p.name.toUpperCase()}</Text>
              </Pressable>
            ))}
        </View>
      )}
    </View>
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.topBar}>
        {renderSearch(filtroA, setFiltroA, "A", "RIVAL")}
        {renderSearch(filtroB, setFiltroB, "B", "TU POKÉMON")}
      </View>

      <View style={styles.battleField}>
        <View style={styles.enemyPos}>
          {pokemonA && (
            <View style={styles.unitContainer}>
              <View style={styles.statusBoxLeft}>
                <Text style={styles.unitName}>
                  {pokemonA.name.toUpperCase()}
                </Text>
                <View style={styles.hpBarBg}>
                  <View style={[styles.hpBarFill, { width: "100%" }]} />
                </View>
                <Text style={styles.typeText}>
                  {pokemonA.types.join(" / ").toUpperCase()}
                </Text>
              </View>
              <Image
                source={{ uri: pokemonA.image }}
                style={styles.pokemonImg}
              />
            </View>
          )}
        </View>

        <View style={styles.playerPos}>
          {pokemonB && (
            <View style={styles.unitContainerReverse}>
              <Image
                source={{ uri: pokemonB.image }}
                style={[styles.pokemonImg, styles.playerImg]}
              />
              <View style={styles.statusBoxRight}>
                <Text style={styles.unitName}>
                  {pokemonB.name.toUpperCase()}
                </Text>
                <View style={styles.hpBarBg}>
                  <View
                    style={[
                      styles.hpBarFill,
                      { width: "100%", backgroundColor: "#4CAF50" },
                    ]}
                  />
                </View>
                <Text style={styles.typeText}>
                  {pokemonB.types.join(" / ").toUpperCase()}
                </Text>
              </View>
            </View>
          )}
        </View>
      </View>

      <View style={styles.menuArea}>
        {resultado !== "" ? (
          <View style={styles.msgBox}>
            <Text style={styles.msgText}>{resultado}</Text>
            <Pressable onPress={() => setResultado("")} style={styles.okBtn}>
              <Text style={styles.okText}>CONTINUAR</Text>
            </Pressable>
          </View>
        ) : (
          <View style={styles.commandMenu}>
            <Pressable style={styles.actionBtn} onPress={combatir}>
              <Text style={styles.actionText}>LUCHAR</Text>
            </Pressable>
            <Pressable
              style={[styles.actionBtn, { backgroundColor: "#585858" }]}
              onPress={() => {
                setPokemonA(null);
                setPokemonB(null);
              }}
            >
              <Text style={styles.actionText}>HUIR</Text>
            </Pressable>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#CC0000" },
  topBar: {
    flexDirection: "row",
    padding: 10,
    justifyContent: "space-between",
    zIndex: 100,
  },
  searchBox: { width: "48%" },
  searchLabel: {
    color: "#FFF",
    fontSize: 10,
    fontWeight: "bold",
    marginBottom: 2,
  },
  input: { backgroundColor: "#FFF", borderRadius: 5, padding: 8, fontSize: 12 },
  dropdown: {
    backgroundColor: "#EEE",
    position: "absolute",
    top: 50,
    width: "100%",
    borderRadius: 5,
    elevation: 5,
  },
  dropItem: { padding: 10, borderBottomWidth: 1, borderBottomColor: "#DDD" },
  dropText: { fontSize: 10, fontWeight: "bold" },
  battleField: {
    flex: 1,
    backgroundColor: "#92bc2c",
    margin: 10,
    borderRadius: 10,
    borderWidth: 5,
    borderColor: "#333",
    justifyContent: "center",
  },
  enemyPos: { alignItems: "flex-end", paddingRight: 20, marginBottom: 20 },
  playerPos: { alignItems: "flex-start", paddingLeft: 20 },
  unitContainer: { flexDirection: "row", alignItems: "center" },
  unitContainerReverse: { flexDirection: "row", alignItems: "center" },
  statusBoxLeft: {
    backgroundColor: "#f8f8d8",
    padding: 8,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#333",
    width: 140,
    marginRight: 10,
  },
  statusBoxRight: {
    backgroundColor: "#f8f8d8",
    padding: 8,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#333",
    width: 140,
    marginLeft: 10,
  },
  unitName: { fontWeight: "bold", fontSize: 12 },
  hpBarBg: {
    height: 6,
    backgroundColor: "#555",
    borderRadius: 3,
    marginVertical: 4,
  },
  hpBarFill: { height: "100%", backgroundColor: "#f04020", borderRadius: 3 },
  typeText: { fontSize: 9, color: "#666" },
  pokemonImg: { width: 120, height: 120 },
  playerImg: { transform: [{ scaleX: -1 }] },
  menuArea: {
    height: 150,
    backgroundColor: "#333",
    borderTopWidth: 4,
    borderColor: "#DEDEDE",
    padding: 15,
  },
  commandMenu: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  actionBtn: {
    width: "48%",
    height: "100%",
    backgroundColor: "#FFF",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "#999",
  },
  actionText: { fontWeight: "bold", fontSize: 20 },
  msgBox: { flex: 1, justifyContent: "center", alignItems: "center" },
  msgText: {
    color: "#00FF00",
    fontSize: 18,
    fontFamily: "monospace",
    textAlign: "center",
  },
  okBtn: {
    marginTop: 10,
    padding: 5,
    borderBottomWidth: 2,
    borderBottomColor: "#00FF00",
  },
  okText: { color: "#FFF", fontSize: 12 },
});
