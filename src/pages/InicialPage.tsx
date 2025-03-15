import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image } from "react-native";

const InicialPage = ({ navigateTo }) => {
    return (
        <View style={style.container}>
            <Image source={require('../assets/fundo.png')} style={style.backgroundImage} />

            <View style={style.content}>
                <View>
                    <Image source={require('../assets/sombra.png')} style={style.sombra} />
                    <Image source={require('../assets/animals.png')} />
                </View>
                <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => navigateTo('GamePage')} // Navegar para a página do jogo
                    style={style.buttonJogar}
                >
                    <Image source={require('../assets/jogar.png')} />
                </TouchableOpacity>
            </View>
        </View>
    );
};

const style = StyleSheet.create({
    container: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        flex: 1,
        paddingBottom: 25,
        backgroundColor: "#F02487"
    },
    content: {
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '70%'
    },
    buttonJogar: {
        backgroundColor: "#F0D924",
        justifyContent: 'center',
        alignItems: 'center',
        width: 310,
        padding: 10,
        borderRadius: 20,
        borderWidth: 3,
        borderColor: "#FFFFFF"
    },
    sombra: {
        position: 'absolute',
        right: 7,
        top: 7
    },
    backgroundImage: {
        position: 'absolute',
        flex: 1,
        resizeMode: 'cover',
    },
});

export default InicialPage;