import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, Text, ActivityIndicator, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import api from "../services/api";

function CreateDev({ navigation }) {
    const region = navigation.getParam('currentRegion');
    const [gitUser, setgitUser] = useState('');
    const [techs, setTechs] = useState('');
    const [load, setLoad] = useState(false);

    async function storeDev() {

        try {

            if (!gitUser || !techs) {
                Alert.alert(
                    'CADASTRAR DEV',
                    'Favor preencher todos os campos!',
                    [
                        { text: 'OK' },
                    ],
                    { cancelable: false },
                );
                return;
            }
            const body = JSON.stringify({
                github_username: gitUser,
                techs: techs,
                latitude: region.latitude,
                longitude: region.longitude
            })
            setLoad(true);
            const res = await api.post('/devs', body, {
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if (res.status == 200) {
                alertSucesso();
            }
            else {
                alertFalha();
            }
        } catch (error) {
            alertFalha();
        }
        finally {
            setLoad(false);
        }

    }

    function alertSucesso() {
        Alert.alert(
            'CADASTRAR DEV',
            'Sucesso ao cadastrar DEV ',
            [
                { text: 'OK' },
            ],
            { cancelable: false },
        );
    }

    function alertFalha() {
        Alert.alert(
            'CADASTRAR DEV',
            'Erro ao cadastrar DEV ',
            [
                { text: 'OK' },
            ],
            { cancelable: false },
        );
    }
    return (
        <>
            <View style={styles.container}>
                <View style={styles.row}>
                    <Text>GitHub Username</Text>
                </View>

                <View style={styles.row}>

                    <TextInput style={[styles.Input]}
                        placeholder="GitHub Username"
                        placeholderTextColor="#999"
                        autoCapitalize="none"
                        autoCorrect={false}
                        value={gitUser}
                        onChangeText={setgitUser}
                    />

                </View>

                <View style={styles.row}>
                    <Text>Techs</Text>
                </View>

                <View style={styles.row}>

                    <TextInput style={[styles.Input]}
                        placeholder="Tecnologias"
                        placeholderTextColor="#999"
                        autoCapitalize="none"
                        autoCorrect={false}
                        value={techs}
                        onChangeText={setTechs}
                    />

                </View>

                <View style={styles.row}>
                    <Text>Latitude</Text>
                </View>

                <View style={styles.row}>

                    <TextInput style={[styles.Input, { color: '#999999' }]}
                        placeholder="Latitude"
                        placeholderTextColor="#999"
                        autoCapitalize="none"
                        autoCorrect={false}
                        value={region.latitude.toString()}
                        editable={false}
                    />

                </View>

                <View style={styles.row}>
                    <Text>Longitude</Text>
                </View>

                <View style={styles.row}>

                    <TextInput style={[styles.Input, { color: '#999999' }]}
                        placeholder="Longitude"
                        placeholderTextColor="#999"
                        autoCapitalize="none"
                        autoCorrect={false}
                        value={region.longitude.toString()}
                        editable={false}
                    />

                </View>

                <TouchableOpacity onPress={storeDev} style={styles.sendButton}>
                    <MaterialIcons name="send" size={20} color="#FFF" />
                </TouchableOpacity>

            </View>

            <View style={[styles.loading, { opacity: load ? 0.6 : 0 }]}>
                <ActivityIndicator size="large" color="#7D40E7" />
            </View>

        </>
    )
}


const styles = StyleSheet.create({
    row: {
        flex: 1,
        flexWrap: 'wrap',
        flexDirection: 'row',
        justifyContent: 'space-between'

    },

    Input: {
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
    sendButton: {
        width: 50,
        height: 50,
        backgroundColor: '#8e4Dff',
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        right: 20,
        bottom: 20
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        flexDirection: 'column',
        padding: 20
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
    }
})

export default CreateDev;