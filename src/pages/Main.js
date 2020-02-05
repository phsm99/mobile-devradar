import React, { useState, useEffect } from 'react';
import { StyleSheet, Image, View, Text, TextInput, TouchableOpacity, ActivityIndicator, Alert } from "react-native";
import MapView, { Marker, Callout } from 'react-native-maps';
import { requestPermissionsAsync, getCurrentPositionAsync } from "expo-location";
import { MaterialIcons } from '@expo/vector-icons';
import * as LocalAuthentication from 'expo-local-authentication';

import api from "../services/api";
import { connect, disconnect, subscribeToNewDevs } from '../services/socket';

function Main({ navigation }) {
    const [devs, setDevs] = useState([]);
    const [logged, setLogged] = useState(false);
    const [currentRegion, setCurrentRegion] = useState(null);
    const [techs, setTechs] = useState('');
    const [load, setLoad] = useState(false);


    useEffect(() => {
        async function loadInitialPositiion() {
            const { granted } = await requestPermissionsAsync();

            if (granted) {
                const { coords } = await getCurrentPositionAsync({
                    enableHighAccuracy: true,
                });

                const { latitude, longitude } = coords;
                setCurrentRegion({
                    latitude,
                    longitude,
                    latitudeDelta: 0.04,
                    longitudeDelta: 0.04
                })

            }
        }

        loadInitialPositiion();
    }, []);

    useEffect(() => {
        subscribeToNewDevs(dev => setDevs([...devs, dev]));
    }, [devs]);

    function setupWebSocket() {
        disconnect();

        const { latitude, longitude } = currentRegion;
        connect(latitude, longitude, techs);
    }
    async function loadDevs() {
        setLoad(true);
        const { latitude, longitude } = currentRegion;
        const response = await api.get('/search', {
            params: {
                latitude,
                longitude,
                techs: techs.toLowerCase(),
            }
        });

        setDevs(response.data.devs);
        setupWebSocket();

        setLoad(false);
    }

    function autenticacao() {
        LocalAuthentication.hasHardwareAsync()
            .then(hasHardware => {
                if (hasHardware) {
                    LocalAuthentication.isEnrolledAsync()
                        .then(isEnrolled => {
                            if (isEnrolled) {
                                LocalAuthentication.supportedAuthenticationTypesAsync()
                                    .then(supportedAuthenticationTypes => {
                                        if (supportedAuthenticationTypes) {
                                            LocalAuthentication.authenticateAsync({
                                                promptMessage: "Desbloqueie para usar o app",
                                                fallbackLabel: ""
                                            })
                                                .then(authenticateAsync => {
                                                    if (authenticateAsync.success) {
                                                        setLogged(true);
                                                    }
                                                })
                                        }
                                    })
                            }
                        })
                }
            });
    }

    function handleRegionChanged(region) {
        setCurrentRegion(region);
    }

    if (!logged) {
        autenticacao();
        return (<View style={[styles.container, styles.horizontal]}>
            <Text style={{ flex: 1, justifyContent: "center", alignContent: "center" }}>Faça login para utilizar o app</Text>
            <TouchableOpacity onPress={() => { autenticacao() }} style={styles.loginButton}>
                <Text style={styles.textLogin}>Login</Text>
            </TouchableOpacity>
        </View>);
    }

    if (!currentRegion) {

        return (
            <View style={[styles.container, styles.horizontal]}>
                <ActivityIndicator size="large" color="#7D40E7" />
            </View>
        )
    }
    return (
        <>
            <MapView onRegionChangeComplete={handleRegionChanged} initialRegion={currentRegion} style={styles.map} >
                {devs.map(dev => (
                    <Marker key={dev._id} coordinate={{ latitude: dev.location.coordinates[1], longitude: dev.location.coordinates[0] }} >
                        <Image style={styles.avatar} source={{ uri: dev.avatar_url }} />
                        <Callout onPress={() => {
                            navigation.navigate('Profile', { github_username: dev.github_username })
                        }}>
                            <View style={styles.callout}>
                                <Text style={styles.devName}>{dev.name}</Text>
                                <Text style={styles.devBio}>{dev.bio}</Text>
                                <Text style={styles.devTechs}>{dev.techs.join(', ')}</Text>
                            </View>
                        </Callout>
                    </Marker>
                ))}
            </MapView>

            <View style={styles.searchForm}>
                <TextInput style={styles.searchInput}
                    placeholder="Buscar devs por techs..."
                    placeholderTextColor="#999"
                    autoCapitalize="words"
                    autoCorrect={false}
                    value={techs}
                    onChangeText={setTechs}
                />
                <TouchableOpacity onPress={loadDevs} style={styles.loadButton}>
                    <MaterialIcons name="send" size={25} color="#FFF" />
                </TouchableOpacity>
            </View>

            <View style={styles.buttons}>
                <TouchableOpacity onPress={() => {
                    navigation.navigate('CreateDev', { currentRegion: currentRegion })
                }} style={styles.loadButton}>
                    <MaterialIcons name="add" size={30} color="#FFF" />
                </TouchableOpacity>
            </View>

            <View style={[styles.loading, { opacity: load ? 0.6 : 0 }]}>
                <ActivityIndicator size="large" color="#7D40E7" />
            </View>
        </>
    )
}


const styles = StyleSheet.create({
    map: {
        flex: 1
    },
    avatar: {
        width: 54,
        height: 54,
        borderRadius: 4,
        borderWidth: 4,
        borderColor: '#FFF'
    },
    callout: {
        width: 260
    },
    devName: {
        fontWeight: 'bold',
        fontSize: 16
    },
    devBio: {
        color: '#666',
        marginTop: 5
    },
    devTechs: {
        marginTop: 5
    },
    searchForm: {
        position: 'absolute',
        top: 20,
        left: 20,
        right: 20,
        zIndex: 5,
        flexDirection: 'row'
    },

    searchInput: {
        flex: 1,
        height: 50,
        backgroundColor: '#FFF',
        color: '#333',
        borderRadius: 25,
        paddingHorizontal: 20,
        fontSize: 16,
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowOffset: {
            width: 4,
            height: 2,
        },
        elevation: 2,
    },
    loadButton: {
        width: 50,
        height: 50,
        backgroundColor: '#8e4Dff',
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 15,
    },
    loginButton: {
        flex: 1,
        height: 50,
        backgroundColor: '#8e4Dff',
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 15,
    },
    textLogin: {
        color: "#ffffff"
    },
    container: {
        flex: 1,
        justifyContent: 'center'
    },
    horizontal: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        padding: 10
    },
    buttons: {
        flexDirection: 'column',
        position: 'absolute',
        bottom: 20,
        right: 20
    },
    loading: {
        backgroundColor: '#9e9e9d',
        position: 'absolute',
        zIndex: 5,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
})

export default Main;