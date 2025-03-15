import React from "react";
import { StyleSheet, TouchableOpacity, View, Image } from "react-native";

const PausaScreen = ({ jogarNovamente, setIsPaused, vitoria, voltarInicio }) => {
    return (
        <View style={styles.container}>
            {/* Se alguém venceu, exibe a mensagem de vitória */}
            {vitoria ? (
                <Image source={require('../assets/vitoria.png')} />
            ) : (
                <Image source={require('../assets/pausado.png')} />
            )}

            <View style={styles.containerButton}>
                {/* Botão "Voltar para Menu" */}
                <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={voltarInicio}
                >
                <Image source={require('../assets/menuPrincipalBotao.png')} />
            </TouchableOpacity>

            {/* Botão "Jogar Novamente" */}
            <TouchableOpacity
                activeOpacity={0.8}
                onPress={jogarNovamente}
            >
                <Image source={require('../assets/jogarNovamenteBotao.png')} />
            </TouchableOpacity>

            {/* Botão "Continuar" só será exibido se ninguém tiver ganhado */}
            {!vitoria && (
                <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => setIsPaused(false)}
                >
                    <Image source={require('../assets/continuarBotao.png')} />
                </TouchableOpacity>
            )}
        </View>
        </View >
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '100%',
        position: 'absolute',
        zIndex: 300,
        gap: 70
    },
    containerButton: {
        alignItems: 'center',
        justifyContent: 'center',
        gap: 20
    }
});

export default PausaScreen;