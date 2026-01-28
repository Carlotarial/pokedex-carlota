import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { Link } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import {
    Dimensions,
    FlatList,
    Image,
    Keyboard,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width } = Dimensions.get("window");
const POKEBALL_IMG = 'https://www.pngall.com/wp-content/uploads/4/Pokeball-PNG-Free-Download.png';

interface FavPokemon {
    id: number;
    name: string;
    image: string;
}

export default function FavoritosScreen() {
    const insets = useSafeAreaInsets();
    const [favorites, setFavorites] = useState<FavPokemon[]>([]);
    const [search, setSearch] = useState("");
    const [suggestions, setSuggestions] = useState<any[]>([]);
    const [listaFull, setListaFull] = useState([]);

    useEffect(() => {
        fetch('https://pokeapi.co/api/v2/pokemon?limit=151')
            .then(res => res.json())
            .then(data => setListaFull(data.results));
    }, []);

    useFocusEffect(
        useCallback(() => {
            cargarFavoritos();
        }, [])
    );

    const cargarFavoritos = async () => {
        const stored = await AsyncStorage.getItem('favoritos');
        if (stored) setFavorites(JSON.parse(stored));
    };

    const añadirRapido = async (name: string) => {
        try {
            const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${name.toLowerCase()}`);
            const data = await res.json();

            const nuevoFav = {
                id: data.id,
                name: data.name,
                image: data.sprites.front_default
            };

            const existe = favorites.some(p => p.id === nuevoFav.id);
            if (!existe) {
                const nuevosFavs = [nuevoFav, ...favorites];
                setFavorites(nuevosFavs);
                await AsyncStorage.setItem('favoritos', JSON.stringify(nuevosFavs));
            }

            setSearch("");
            setSuggestions([]);
            Keyboard.dismiss();
        } catch (e) {
            console.error(e);
        }
    };

    const eliminarDeFavoritos = async (id: number) => {
        const updated = favorites.filter(p => p.id !== id);
        setFavorites(updated);
        await AsyncStorage.setItem('favoritos', JSON.stringify(updated));
    };

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            <View style={styles.header}>
                <View style={styles.screenFrame}>
                    <View style={styles.screenInner}>
                        <Text style={styles.pokedexTitle}>MI EQUIPO</Text>
                        <View style={styles.glassGlow} />
                    </View>
                </View>

                <View style={styles.searchSection}>
                    <TextInput
                        style={styles.input}
                        placeholder="Añadir Pokémon..."
                        placeholderTextColor="#999"
                        value={search}
                        onChangeText={(t) => {
                            setSearch(t);
                            if (t.length > 1) {
                                setSuggestions(listaFull.filter((p: any) => p.name.includes(t.toLowerCase())).slice(0, 3));
                            } else {
                                setSuggestions([]);
                            }
                        }}
                    />
                    {suggestions.length > 0 && (
                        <View style={styles.suggestions}>
                            {suggestions.map(p => (
                                <Pressable key={p.name} style={styles.suggItem} onPress={() => añadirRapido(p.name)}>
                                    <Text style={styles.suggText}>+ {p.name.toUpperCase()}</Text>
                                </Pressable>
                            ))}
                        </View>
                    )}
                </View>
            </View>

            {favorites.length === 0 ? (
                <View style={styles.empty}>
                    <Image source={{ uri: POKEBALL_IMG }} style={styles.emptyPokeBall} resizeMode="contain" />
                    <Text style={styles.emptyText}>BUSCA UN POKÉMON PARA AÑADIRLO A TU EQUIPO</Text>
                </View>
            ) : (
                <FlatList
                    data={favorites}
                    keyExtractor={(item) => item.id.toString()}
                    numColumns={2}
                    contentContainerStyle={styles.grid}
                    renderItem={({ item }) => (
                        <View style={styles.cardWrapper}>
                            <View style={styles.card}>
                                <Link
                                    href={{
                                        pathname: "/detalle/[id]",
                                        params: { id: item.id.toString() },
                                    }}
                                    asChild
                                >
                                    <Pressable style={styles.cardContent}>
                                        <Text style={styles.idText}>#{item.id}</Text>
                                        <Image source={{ uri: item.image }} style={styles.image} />
                                        <Text style={styles.name}>{item.name.toUpperCase()}</Text>
                                    </Pressable>
                                </Link>
                                <Pressable style={styles.removeBtn} onPress={() => eliminarDeFavoritos(item.id)}>
                                    <Text style={styles.removeBtnText}>SOLTAR</Text>
                                </Pressable>
                            </View>
                        </View>
                    )}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#CC0000' },
    header: { padding: 20, zIndex: 100 },
    
    screenFrame: {
        backgroundColor: '#DEDEDE',
        padding: 10,
        borderRadius: 10,
        borderBottomLeftRadius: 30,
        borderWidth: 4,
        borderColor: '#B0B0B0',
        marginBottom: 20,
        elevation: 10,
    },
    screenInner: {
        backgroundColor: '#222',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 15,
        borderRadius: 5,
        borderWidth: 2,
        borderColor: '#111',
        overflow: 'hidden',
    },
    glassGlow: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '50%',
        backgroundColor: 'rgba(255,255,255,0.05)',
    },
    pokedexTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#00FF00', 
        fontFamily: 'monospace',
        textShadowColor: 'rgba(0, 255, 0, 0.5)',
        textShadowRadius: 5,
    },
    titleIcon: { width: 25, height: 25, marginHorizontal: 12 },

    searchSection: { position: 'relative' },
    input: { 
        backgroundColor: '#FFF', 
        borderRadius: 10, 
        padding: 12, 
        fontWeight: 'bold',
        borderWidth: 2,
        borderColor: '#333'
    },
    suggestions: { 
        backgroundColor: '#333', 
        position: 'absolute', 
        top: 55, 
        width: '100%', 
        borderRadius: 10, 
        elevation: 10, 
        zIndex: 999,
        borderWidth: 2,
        borderColor: '#00FF00'
    },
    suggItem: { padding: 15, borderBottomWidth: 1, borderBottomColor: '#444' },
    suggText: { color: '#00ff00', fontWeight: 'bold', fontSize: 12, fontFamily: 'monospace' },
    
    grid: { padding: 8 },
    cardWrapper: { flex: 0.5, padding: 8 },
    card: { 
        backgroundColor: '#FFF', 
        borderRadius: 20, 
        padding: 10, 
        alignItems: 'center', 
        borderWidth: 3, 
        borderColor: '#333',
        elevation: 5 
    },
    cardContent: { alignItems: 'center' },
    idText: { fontSize: 10, color: '#999', fontWeight: 'bold' },
    image: { width: 90, height: 90 },
    name: { fontSize: 13, fontWeight: 'bold', color: '#333', marginBottom: 8 },
    removeBtn: { backgroundColor: '#CC0000', paddingVertical: 4, paddingHorizontal: 12, borderRadius: 8 },
    removeBtnText: { color: '#FFF', fontSize: 9, fontWeight: 'bold' },
    
    empty: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 40 },
    emptyPokeBall: { width: 120, height: 120, marginBottom: 20, opacity: 0.4 },
    emptyText: { color: '#ffffff', textAlign: 'center', fontWeight: 'bold', fontFamily: 'monospace' }
});