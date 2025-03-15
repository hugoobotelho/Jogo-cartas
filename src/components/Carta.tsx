import React, { useState, useImperativeHandle, forwardRef, useEffect } from "react";
import { StyleSheet, View, Image, Dimensions, TouchableOpacity } from "react-native";
import FlipCard from "react-native-flip-card";
import Animated, { useSharedValue, useAnimatedStyle, withTiming, withSequence } from "react-native-reanimated";

const { width, height } = Dimensions.get("window");

const Carta = forwardRef(({ style, zIndex, frente, verso }, ref) => {  
    const translateX = useSharedValue(0);
    const translateY = useSharedValue(0);
    const rotation = useSharedValue(0);
    const [moved, setMoved] = useState(false);
    const [flipped, setFlipped] = useState(false);

    useImperativeHandle(ref, () => ({
        handleMoveAndFlipInternal() {
            if (!moved) {
                translateX.value = withTiming(-width / 2 + 100, { duration: 400 });
                translateY.value = withTiming(-height / 3, { duration: 400 });
                setMoved(true);
                setTimeout(() => setFlipped(true), 400);
            } else {
                setFlipped((prev) => !prev);
            }
        }
    }));

    useEffect(() => {
        if (moved) {
            const randomRotation = Math.floor(Math.random() * 60) - 40;
            rotation.value = withSequence(withTiming(randomRotation, { duration: 1000 }));
        }
    }, [moved]);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [
            { translateX: translateX.value },
            { translateY: translateY.value },
            { rotate: `${rotation.value}deg` },
        ],
        zIndex, 
    }));

    return (
        <TouchableOpacity activeOpacity={1} style={[styles.container, style]}>
            <Animated.View style={[animatedStyle]}>
                <FlipCard
                    flip={flipped}
                    clickable={false}
                    friction={6}
                    perspective={1000}
                    flipHorizontal={true}
                    flipVertical={true}
                >
                    <View style={styles.card}>
                        <Image source={verso} style={styles.image} />
                    </View>
                    <View style={styles.card}>
                        <Image source={frente} style={styles.image} />
                    </View>
                </FlipCard>
            </Animated.View>
        </TouchableOpacity>
    );
});

const styles = StyleSheet.create({
    container: {
        width: 150,
        height: 215,
        position: "absolute",
        right: 0,
        bottom: 0,
    },
    card: {
        width: 150,
        height: 215,
        justifyContent: "center",
        alignItems: "center",
    },
    image: {
        width: "100%",
        height: "100%",
        resizeMode: "contain",
    },
});

export default Carta;
