import React, { useRef, useState, useEffect } from "react";
import { StyleSheet, View, TouchableOpacity, Image, Alert } from "react-native";
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';

import Carta from "../components/Carta";
import Contador from "../components/Contador";
import PausaScreen from "../components/PausaScreen";

const GamePage = ({ navigateTo }) => {


    const [isPaused, setIsPaused] = useState(false);

    const totalCartas = 10;

    const cartasRef1 = useRef([]);
    const cartasRef2 = useRef([]);

    const [qtd1, setQtd1] = useState(totalCartas);
    const [qtd2, setQtd2] = useState(totalCartas);

    const [zIndexes1, setZIndexes1] = useState(Array.from({ length: totalCartas * 2 }, (_, index) => index));
    const [zIndexes2, setZIndexes2] = useState(Array.from({ length: totalCartas * 2 }, (_, index) => index));

    const [vezDoJogador, setVezDoJogador] = useState(null);
    const [firsTimeFlag, setFirstTimeFlag] = useState(true);
    const [jogadorInicial, setJogadorInicial] = useState(null);

    const [cartasJogador1, setCartasJogador1] = useState([]);
    const [cartasJogador2, setCartasJogador2] = useState([]);
    // const [indexVerso, setIndexVerso] = useState(0);

    const [boloDeCartas, setBoloDeCartas] = useState([]); // Bolo de cartas acumuladas
    const [areaClicada, setAreaClicada] = useState(null); // Para controlar onde foi clicado
    const [firstClick, setFirstClick] = useState(true);
    const [botoesAreasAtivos, setBotoesAreasAtivos] = useState(false);
    const [cartasJogadas, setCartasJogadas] = useState([]);


    const [jogarNovamenteFlag, setJogarNovamenteFlag] = useState(false); // Estado para controlar reinício

    const [vitoria, setVitoria] = useState(false); // Controle de vitória
    const [jogadorGanhador, setJogadorGanhador] = useState(null);

    const habilitarBotoes = () => setBotoesAreasAtivos(true);
    const desabilitarBotoes = () => setBotoesAreasAtivos(false);

    const imagensFrente = [
        { id: 1, frente: require("../assets/frenteGirafa.png") },
        { id: 2, frente: require("../assets/frenteCachorro.png") },
        { id: 3, frente: require("../assets/frenteGato.png") },
        { id: 4, frente: require("../assets/frenteTigre.png") },
        { id: 5, frente: require("../assets/frenteLeao.png") },
        { id: 6, frente: require("../assets/frenteElefante.png") },
    ];

    const imagensVerso = [
        { id: 1, verso: require("../assets/versoGirafa.png") },
        { id: 2, verso: require("../assets/versoCachorro.png") },
        { id: 3, verso: require("../assets/versoGato.png") },
        { id: 4, verso: require("../assets/versoTigre.png") },
        { id: 5, verso: require("../assets/versoLeao.png") },
        { id: 6, verso: require("../assets/versoElefante.png") },
    ];

    const [indexUltimoVerso, setIndexUltimoVerso] = useState(0);

    const voltarInicio = () => {
        navigateTo("InicialPage"); //volta para a pagina inicial
    }



    // Sorteia aleatoriamente quem começa
    useEffect(() => {
        setCartasJogador1(gerarCartasAleatorias());
        setCartasJogador2(gerarCartasAleatorias());
        const vez = Math.random() < 0.5 ? 1 : 2;
        setVezDoJogador(vez);
        setJogadorInicial(vez);
    }, [jogarNovamenteFlag]);

    useEffect(() => {
        if (cartasJogadas.length > 0) {
            if (cartasJogadas[cartasJogadas.length - 1].idFrente === cartasJogadas[cartasJogadas.length - 1].idVerso) {
                renderizaVersos();
            }
            else {
                atualizaProximoVerso();
            }
        }
    }, [cartasJogadas]); // Esse efeito vai ser chamado toda vez que cartasJogadas mudar


    useEffect(() => {
        verificarVitoria();
    }, [qtd1, qtd2]); // Esse efeito vai ser chamado toda vez que qtd1 ou qtd2 mudar

    const gerarCartasAleatorias = () => {
        let cartas = [];
        for (let i = 0; i < totalCartas; i++) {
            const indexAleatorio = Math.floor(Math.random() * imagensFrente.length);
            const cartaFrente = imagensFrente[indexAleatorio];
            let cartaVerso = imagensVerso[0]; //seta todo mundo com o versoGirafa
            cartas.unshift({
                idFrente: cartaFrente.id,
                idVerso: cartaVerso.id,
                frente: cartaFrente.frente,
                verso: cartaVerso.verso,
                id: uuidv4()  // Gera um ID único para cada carta
            });
        }
        return cartas;
    };

    const handleClickArea = (area) => {
        if (botoesAreasAtivos) {
            if (area === "jogador1") {
                pagarBolo(2);

            } else if (area === "jogador2") {
                pagarBolo(1);
            }
        }
        else { //se o jogador clicou em um momento que nao podia, ele pega o bolo
            if (area === "jogador1") {
                pagarBolo(1);

            } else if (area === "jogador2") {
                pagarBolo(2);
            }
            renderizaVersos();
        }

        desabilitarBotoes();
    };

    const pagarBolo = (jogadorPerdedor) => {
        if (cartasJogadas.length === 0) return;

        // cartasRef1.current = [];
        // cartasRef2.current = [];

        // setZIndexes1(Array.from({ length: totalCartas }, (_, index) => index));
        // setZIndexes2(Array.from({ length: totalCartas }, (_, index) => index));

        // console.log("Cartas jogadas:", cartasJogadas); // Imprime as cartas jogadas para debugar

        // Remover as cartas jogadas de ambos os jogadores antes de reorganizar o bolo
        let novasCartasJogador1 = [];
        let novasCartasJogador2 = [];

        // let cartas = [];
        // for (let i = 0; i < cartasJogadas.length; i++) {
        //     cartas.unshift({
        //         idFrente: cartasJogadas[i].id,
        //         idVerso: imagensVerso[0].id,
        //         frente: cartasJogadas[i].frente,
        //         verso: imagensVerso[0].verso,
        //     });
        // }

        if (jogadorPerdedor === 1) {
            // Se o jogador 1 perdeu, ele paga o bolo
            novasCartasJogador1 = cartasJogador1
                .filter((carta) => !cartasJogadas.includes(carta))  // Remove cartas jogadas
                .map((carta, index) => ({ ...carta, id: uuidv4() }));  // Novo ID único

            novasCartasJogador2 = cartasJogador2
                .filter((carta) => !cartasJogadas.includes(carta))  // Remove cartas jogadas de Jogador 2
                .map((carta, index) => ({ ...carta, id: uuidv4() }));

        } else {
            // Se o jogador 2 perdeu, ele paga o bolo
            novasCartasJogador2 = cartasJogador2
                .filter((carta) => !cartasJogadas.includes(carta))  // Remove cartas jogadas
                .map((carta, index) => ({ ...carta, id: uuidv4() }));

            novasCartasJogador1 = cartasJogador1
                .filter((carta) => !cartasJogadas.includes(carta))  // Remove cartas jogadas de Jogador 1
                .map((carta, index) => ({ ...carta, id: uuidv4() }));
        }


        // Atualizar o estado com as novas cartas de cada jogador
        setCartasJogador1(novasCartasJogador1);
        setCartasJogador2(novasCartasJogador2);

        // Limpar as cartas jogadas
        // setCartasJogadas([]);  // Limpar as cartas jogadas após o pagamento do bolo
        transferirBolo(jogadorPerdedor);

    };

    const transferirBolo = (perdedor) => {

        if (cartasJogadas.length === 0) return; // Evita executar se não houver cartas no bolo

        let cartas = [];
        for (let i = 0; i < cartasJogadas.length; i++) {
            cartas.unshift({
                idFrente: cartasJogadas[i].idFrente,
                idVerso: imagensVerso[0].idVerso,
                frente: cartasJogadas[i].frente,
                verso: imagensVerso[0].verso,
                id: uuidv4()
            });
        }

        if (perdedor === 1) {
            setCartasJogador1((prevCartas) => [...cartas, ...prevCartas]);  // Jogador 2 recebe as cartas jogadas
            setQtd1(qtd1 + cartas.length);
        } else if (perdedor === 2) {
            setCartasJogador2((prevCartas) => [...cartas, ...prevCartas]);
            setQtd2(qtd2 + cartas.length);
        }

        setCartasJogadas([]); // Limpa as cartas jogadas após transferência

        // Alert.alert("Bolo pago!", "As cartas acumuladas foram adicionadas.");
    };


    const atualizaProximoVerso = () => {

        setIndexUltimoVerso((prevIndex) => {
            let novoIndex = prevIndex === (imagensVerso.length - 1) ? 0 : prevIndex + 1;

            // Atualiza o verso das cartas do jogador 1 que não foram jogadas
            setCartasJogador1((prevCartasJogador1) => {
                return prevCartasJogador1.map((carta) => {
                    // Verifica se a carta não foi jogada
                    // console.log("Essa é a carta a ser comparada: " + carta);
                    if (!cartasJogadas.includes(carta)) {
                        return {
                            ...carta,
                            verso: imagensVerso[novoIndex].verso, // Usa o valor atualizado corretamente
                            idVerso: novoIndex + 1,
                        };
                    }
                    // else {
                    //     console.log("Carta do jogador 1 já foi jogada!");
                    // }
                    return carta; // Se a carta foi jogada, não faz alteração
                });
            });

            // Atualiza o verso das cartas do jogador 2 que não foram jogadas
            setCartasJogador2((prevCartasJogador2) => {
                return prevCartasJogador2.map((carta) => {
                    // Verifica se a carta não foi jogada
                    if (!cartasJogadas.includes(carta)) {
                        return {
                            ...carta,
                            verso: imagensVerso[novoIndex].verso, // Usa o valor atualizado corretamente
                            idVerso: novoIndex + 1,
                        };
                    }
                    // else {
                    //     console.log("Carta do jogador 2 já foi jogada!");
                    // }
                    return carta; // Se a carta foi jogada, não faz alteração
                });
            });

            return novoIndex; // Retorna o valor atualizado para o estado
        });
    };

    const renderizaVersos = () => {
        setIndexUltimoVerso(0);

        // Atualiza o verso das cartas do jogador 1 que não foram jogadas
        setCartasJogador1((prevCartasJogador1) => {
            return prevCartasJogador1.map((carta) => {
                // Verifica se a carta não foi jogada
                if (!cartasJogadas.includes(carta)) {
                    return {
                        ...carta,
                        verso: imagensVerso[0].verso, // Usa o valor atualizado corretamente
                        idVerso: 1, // Define o idVerso para o verso correto
                    };
                }
                return carta; // Se a carta foi jogada, não faz alteração
            });
        });

        // Atualiza o verso das cartas do jogador 2 que não foram jogadas
        setCartasJogador2((prevCartasJogador2) => {
            return prevCartasJogador2.map((carta) => {
                // Verifica se a carta não foi jogada
                if (!cartasJogadas.includes(carta)) {
                    return {
                        ...carta,
                        verso: imagensVerso[0].verso, // Usa o valor atualizado corretamente
                        idVerso: 1, // Define o idVerso para o verso correto
                    };
                }
                return carta; // Se a carta foi jogada, não faz alteração
            });
        });
    };



    const handleMoveAndFlip = (jogador) => {
        desabilitarBotoes();

        if (jogador !== vezDoJogador) return; // Impede que o outro jogador jogue fora da vez

        if (jogador === 1 && qtd1 > 0) {
            const topIndex = qtd1 - 1;
            setQtd1(qtd1 - 1);
            // console.log("Esse é o topIndex 1: " + topIndex + " e esse é o tamanho de cartasJogador1: " + cartasJogador1.length);
            const cartaJogada = cartasJogador1[topIndex];
            // console.log("Esse é o id da cartaJogada1: " + cartaJogada.id);

            const topCard = cartasRef1.current[cartaJogada.id];

            if (topCard) {
                // const cartaJogada = cartasJogador1[topIndex];

                setCartasJogadas((prev) => [...prev, cartaJogada]); // Move para cartasJogadas
                // setBoloDeCartas((prev) => [...prev, cartaJogada]); // Adiciona ao bolo
                // setBoloDeCartas((prevBolo) => [...prevBolo, cartasJogador1[topIndex]]);
                // setCartasJogador1((prevCartas) => prevCartas.slice(0, -1)); //ver depois isso
                topCard.handleMoveAndFlipInternal();
                setZIndexes1((prevZIndexes1) => {
                    const newZIndexes = [...prevZIndexes1];
                    newZIndexes[topIndex] = Math.max(...prevZIndexes1) + 1;
                    return newZIndexes;
                });
                // setZIndexes1((prevZIndexes1) =>
                //     prevZIndexes1.map((z, index) =>
                //         index === prevZIndexes1.length - 1 ? Math.max(...prevZIndexes1) + 1 : z
                //     )
                // );


                // Verifica se a frente e o verso são iguais
                if (cartaJogada.idFrente === cartaJogada.idVerso) {
                    console.log('entrou aqui')
                    habilitarBotoes();
                    // renderizaVersos();
                }
                else {
                    desabilitarBotoes();
                    // atualizaProximoVerso();

                }

                setVezDoJogador(2); // Alterna para o jogador 2
            }
        } else if (jogador === 2 && qtd2 > 0) {
            const topIndex = qtd2 - 1;
            setQtd2(qtd2 - 1);

            // console.log("Esse é o topIndex 2: " + topIndex + " e esse é o tamanho de cartasJogador2: " + cartasJogador2.length);
            const cartaJogada = cartasJogador2[topIndex];
            // console.log("Esse é o id da cartaJogada2: " + cartaJogada.id);

            const topCard = cartasRef2.current[cartaJogada.id];

            if (topCard) {
                // const cartaJogada = cartasJogador2[topIndex];

                setCartasJogadas((prev) => [...prev, cartaJogada]);
                // setBoloDeCartas((prev) => [...prev, cartaJogada]);

                // setBoloDeCartas((prevBolo) => [...prevBolo, cartasJogador2[topIndex]]);
                // setCartasJogador2((prevCartas) => prevCartas.slice(0, -1)); 
                topCard.handleMoveAndFlipInternal();

                setZIndexes2((prevZIndexes2) => {
                    const newZIndexes = [...prevZIndexes2];
                    if (firsTimeFlag && jogadorInicial == 1) {
                        newZIndexes[topIndex] = Math.max(...prevZIndexes2) + 2;
                        setFirstTimeFlag(false);
                    }
                    else {
                        newZIndexes[topIndex] = Math.max(...prevZIndexes2) + 1;
                    }
                    return newZIndexes;
                });

                // setZIndexes2((prevZIndexes2) => {
                //     const maxZ = Math.max(...prevZIndexes2);
                //     let newZIndex = maxZ + 1;

                //     if (firsTimeFlag && jogadorInicial === 1) {
                //         newZIndex = maxZ + 2;
                //         setFirstTimeFlag(false); // Chamamos fora da atualização do estado
                //     }

                //     return prevZIndexes2.map((z, index) =>
                //         index === prevZIndexes2.length - 1 ? newZIndex : z
                //     );
                // });



                // Verifica se a frente e o verso são iguais
                if (cartaJogada.idFrente === cartaJogada.idVerso) {
                    console.log('entrou aqui')
                    habilitarBotoes();
                    // renderizaVersos();
                }
                else {
                    desabilitarBotoes();
                    // atualizaProximoVerso();

                }

                setVezDoJogador(1); // Alterna para o jogador 1
            }
        }

    };

    const verificarVitoria = () => {
        if (qtd1 === 0) {
            setJogadorGanhador(1);
            setVitoria(true);
            setIsPaused(true);
        } else if (qtd2 === 0) {
            setJogadorGanhador(2);
            setVitoria(true);
            setIsPaused(true);
        }
    };

    // Função para resetar o jogo
    const jogarNovamente = () => {

        setIsPaused(false);
        cartasRef1.current = [];
        cartasRef2.current = [];
        setQtd1(totalCartas);
        setQtd2(totalCartas);

        // Resetando os zIndexes
        setZIndexes1(Array.from({ length: totalCartas * 2 }, (_, index) => index));
        setZIndexes2(Array.from({ length: totalCartas * 2 }, (_, index) => index));

        setVezDoJogador(null);
        setFirstTimeFlag(true);
        setJogadorInicial(null);

        setCartasJogador1([]);
        setCartasJogador2([]);

        setBoloDeCartas([]);
        setAreaClicada(null);
        setFirstClick(true);
        setBotoesAreasAtivos(false);
        setCartasJogadas([]);

        setIndexUltimoVerso(0);

        setVitoria(false);
        setJogadorGanhador(null);

        setJogarNovamenteFlag(prevFlag => !prevFlag); // Alterna o estado para disparar o useEffect novamente


    };


    return (
        <View style={style.container}>
            <Image source={require('../assets/fundo.png')} style={style.backgroundImage} />

            {/* Mesa */}
            <View style={style.mesa}>
                <Image source={require('../assets/sombra.png')} style={style.sombra} />
                <Image source={require('../assets/mesa.png')} />
            </View>

            {/* Jogador 2 (Metade superior) */}
            <TouchableOpacity
                style={style.areaJogador2}
                onPressIn={() => handleClickArea("jogador2")}
            // disabled={!botoesAreasAtivos} // Desativa o botão quando botoesAtivos for falso
            ></TouchableOpacity>
            {/* Jogador 1 (Metade inferior) */}
            <TouchableOpacity
                style={style.areaJogador1}
                onPressIn={() => handleClickArea("jogador1")}
            // disabled={!botoesAreasAtivos} // Desativa o botão quando botoesAtivos for falso
            ></TouchableOpacity>

            {/* Jogadores */}
            <View style={style.jogadores}>
                <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => handleMoveAndFlip(2)}
                    style={[style.buttonVirar, style.button2, vezDoJogador !== 2 && style.buttonDesativado]} // Bloqueia o botão se não for a vez do jogador
                    disabled={vezDoJogador !== 2}
                >
                    <Image source={require('../assets/virar.png')} />
                </TouchableOpacity>
                {cartasJogador2.map((carta, index) => (
                    <Carta
                        key={carta.id}  // Usando um ID único para cada carta
                        ref={(el) => (cartasRef2.current[carta.id] = el)}
                        frente={carta.frente}
                        verso={carta.verso}
                        style={[style.carta2, { top: index * 4 + 20, zIndex: zIndexes2[index] }]}
                    />
                ))}


                <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => handleMoveAndFlip(1)}
                    style={[style.buttonVirar, style.button1, vezDoJogador !== 1 && style.buttonDesativado]} // Bloqueia o botão se não for a vez do jogador
                    disabled={vezDoJogador !== 1}
                >
                    <Image source={require('../assets/virar.png')} />
                </TouchableOpacity>
                {cartasJogador1.map((carta, index) => (
                    <Carta
                        key={carta.id}  // Usando um ID único para cada carta
                        ref={(el) => (cartasRef1.current[carta.id] = el)}
                        frente={carta.frente}
                        verso={carta.verso}
                        style={[style.carta1, { bottom: index * 4 + 20, zIndex: zIndexes1[index] }]}
                    />
                ))}

            </View>
            <View style={style.componenteContador}>
                <Contador qtd1={qtd1} qtd2={qtd2} />
            </View>
            <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => setIsPaused(true)}
                style={style.pausaButton}
            >
                <Image source={require('../assets/pausa.png')} />
            </TouchableOpacity>
            {/* Exibir tela de pausa se isPaused for true */}
            {isPaused && (
                <View style={[style.overlay, jogadorGanhador === 2 && style.jogador2Ganhou]}>
                    <TouchableOpacity
                        style={style.backgroundTouchable}
                        activeOpacity={1}
                        onPress={() => setIsPaused(false)} // Clicar fora fecha o menu
                    >
                        <PausaScreen setIsPaused={setIsPaused} jogarNovamente={jogarNovamente} vitoria={vitoria} voltarInicio={voltarInicio}
                        />
                    </TouchableOpacity>

                </View>
            )}

        </View>
    );
};

const style = StyleSheet.create({
    container: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flex: 1,
        // padding: 25,
        width: '100%',
        backgroundColor: '#F02487'
    },
    backgroundImage: {
        position: 'absolute',
        flex: 1,
        resizeMode: 'cover',
    },
    mesa: {
        position: 'absolute',
        top: '31%'
    },
    buttonVirar: {
        backgroundColor: "#F0D924",
        justifyContent: 'center',
        alignItems: 'center',
        width: 170,
        padding: 10,
        borderRadius: 20,
        borderWidth: 3,
        borderColor: "#FFFFFF",
    },
    buttonDesativado: {
        opacity: 0.5 // Deixa o botão mais transparente quando desativado
    },
    sombra: {
        position: 'absolute',
        right: 7,
        top: 7,
    },
    jogadores: {
        width: '100%',
        height: '100%',
        alignItems: 'flex-start',
        zIndex: 1,
    },
    button1: {
        position: 'absolute',
        bottom: 20,
        left: 10
    },
    button2: {
        transform: [{ scaleX: -1 }, { scaleY: -1 }],
        position: 'absolute',
        top: 20,
        right: 10
    },
    carta1: {
        position: 'absolute',
        bottom: 20,
        right: 10
    },
    carta2: {
        position: 'absolute',
        transform: [{ scaleX: -1 }, { scaleY: -1 }],
        top: 10,
        left: 20
    },
    areaJogador1: {
        position: 'absolute',
        bottom: 90,
        width: '100%',
        height: '40%',
        // backgroundColor: 'rgba(0, 0, 255, 0.1)', // Cor para identificar a área do jogador 1
        zIndex: 100
    },
    areaJogador2: {
        position: 'absolute',
        top: 90,
        width: '100%',
        height: '40%',
        // backgroundColor: 'rgba(255, 0, 0, 0.1)', // Cor para identificar a área do jogador 2
        zIndex: 100
    },
    componenteContador: {
        position: 'absolute',
        left: -15,
        top: '50%',
        zIndex: 200
    },
    pausaButton: {
        position: 'absolute',
        top: '48%',
        right: -25,
        zIndex: 200
    },
    overlay: {
        position: "absolute",
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0, 0, 0, 0.5)", // Fundo escurecido
        alignItems: "center",
        justifyContent: "center",
        zIndex: 300
    },
    backgroundTouchable: {
        position: "absolute",
        width: "100%",
        height: "100%",
        zIndex: 300
    },
    jogador2Ganhou: {
        transform: [{ scaleX: -1 }, { scaleY: -1 }],
    }
});

export default GamePage;
