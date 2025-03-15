import React from "react";
import { StyleSheet, View, Text } from "react-native";

const Contador = (props) => {
    return (
        <View style={styles.container}>
            <Text style={[styles.jogador2, styles.texto]}>{`${props.qtd2}`}</Text>
            <View style={styles.linha} /> 
            <Text style={styles.texto}>{`${props.qtd1}`}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: 55,
        alignItems: 'center', // Centraliza os itens no eixo horizontal
        justifyContent: 'center',
        backgroundColor: "#F0D924",
        borderRadius: 20,
        borderStyle: 'solid',
        borderColor: "#F02487",
        borderWidth: 3,
        gap: 3,
        padding: 10, // Adicionando um padding para melhor aparência
    },
    jogador2: {
        transform: [{ scaleX: -1 }, { scaleY: -1 }],
    },
    texto: {
        fontSize: 18, // Aumentando o tamanho da fonte
        fontWeight: 'bold', // Deixando o texto em negrito
    },
    linha: {
        width: '80%', // Definindo a largura da linha
        height: 3, // Altura da linha
        backgroundColor: '#F02487', // Cor da linha
        marginVertical: 4, // Espaçamento entre os textos
    }
});

export default Contador;
