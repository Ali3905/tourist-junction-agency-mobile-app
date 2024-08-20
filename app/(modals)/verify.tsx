import React, { useRef, useState } from 'react';
import {
    View,
    Text,
    StatusBar,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    SafeAreaView,
    Animated,
    Image,
    Vibration,
} from "react-native";
import { router } from "expo-router";
import { Colors } from "@/constants/Colors";
import axios from 'axios';
import { useGlobalContext } from '@/context/GlobalProvider';
import * as SecureStore from "expo-secure-store";

const EnterOTPScreen = () => {
    const [otpInputs, setOTPInputs] = useState(Array(4).fill(""));
    const inputRefs = useRef(Array(4).fill(null));
    const [shakeAnimation] = useState(new Animated.Value(0));
    const [isShaking, setIsShaking] = useState(false);
    const [focus, setFocus] = useState(0);
    const {mobileNumber, setToken, setIsLogged} = useGlobalContext()

    const handleVerifyOTP = async () => {
        const otp = otpInputs.join("");

        try {
            const response = await axios.post(`${process.env.EXPO_PUBLIC_URL}api/user/verify`, {
                mobileNumber: mobileNumber,
                otp: otp
            });

            if (response.data.authToken && response.data.data._id) {
                await SecureStore.setItemAsync("access_token", response.data.authToken);
                setToken(response.data.authToken)
                setIsLogged(true)
                router.replace("/"); 
            } else {
                throw new Error("OTP verification failed");
            }
        } catch (error) {
            console.error("Error verifying OTP:", error);
            setIsShaking(true);
            Animated.sequence([
                Animated.timing(shakeAnimation, { toValue: 10, duration: 50, useNativeDriver: true }),
                Animated.timing(shakeAnimation, { toValue: -10, duration: 50, useNativeDriver: true }),
                Animated.timing(shakeAnimation, { toValue: 10, duration: 50, useNativeDriver: true }),
                Animated.timing(shakeAnimation, { toValue: 0, duration: 50, useNativeDriver: true }),
            ]).start();
            Vibration.vibrate([0, 100]);
            setTimeout(() => {
                setIsShaking(false);
            }, 400);
            setOTPInputs(Array(4).fill(""));
            const ref = inputRefs.current[0];
            if (ref) {
                ref.focus();
            }
        }
    };
    
    const handleOTPTyped = (index: number, value: string) => {
        if (value.length > 1) {
            return;
        }
        const newOTPInputs = [...otpInputs];
        newOTPInputs[index] = value;
        setOTPInputs(newOTPInputs);

        if (!value && index > 0) {
            const previousInputRef = inputRefs.current[index - 1];
            if (previousInputRef) {
                previousInputRef.focus();
            }
        }

        if (value && index < otpInputs.length - 1) {
            const nextInputRef = inputRefs.current[index + 1];
            if (nextInputRef) {
                nextInputRef.focus();
            }
        }


    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" />
            <Image style={styles.wave_image} source={require('@/assets/images/wave.png')} />

            <View style={{ marginTop: 150 }} >
                <Text style={styles.headingText}>Enter</Text>
                <Text style={styles.headingText}>the OTP</Text>
            </View>

            <View style={styles.innerContainer} >
                <Text style={styles.descriptionText} >
                    Enter the OTP we just sent to your Phone number.
                </Text>
                <Animated.View
                    style={[
                        styles.otpInputContainer,
                        { transform: [{ translateX: shakeAnimation }] },
                    ]}
                >
                    {otpInputs.map((value, index) => (
                        <TextInput
                            key={index}
                            ref={(ref) => (inputRefs.current[index] = ref)}
                            style={
                                isShaking
                                    ? {
                                        ...styles.otpInput,
                                        color: "#f23535",
                                        borderColor: "#f23535",
                                    }
                                    : [
                                        styles.otpInput,
                                        {
                                            borderColor:
                                                focus === index ? Colors.secondary : "#000",
                                        },
                                    ]
                            }
                            placeholder="__"
                            placeholderTextColor={Colors.light.text}
                            caretHidden
                            maxLength={1}
                            onFocus={() => {
                                setFocus(index);
                            }}
                            keyboardType="numeric"
                            value={value}
                            onChangeText={(text) => handleOTPTyped(index, text)}
                            onKeyPress={(e) => {
                                if (e.nativeEvent.key === "Backspace" && !value) {
                                    const previousInputRef = inputRefs.current[index - 1];
                                    if (previousInputRef) {
                                        previousInputRef.focus();
                                    }
                                } else if (value && e.nativeEvent.key !== "Backspace") {
                                    handleOTPTyped(index, e.nativeEvent.key.valueOf());
                                }
                            }}
                        />
                    ))}
                </Animated.View>

                <TouchableOpacity onPress={handleVerifyOTP} style={styles.button}>
                    <Text style={styles.buttonText}>Verify OTP</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FAF9F6",
        marginTop: StatusBar.currentHeight,
        padding: 20,
    },
    innerContainer: {
        alignItems: "center",
        width: "100%",
        flex: 1,
        marginTop:50
    },
    headingText: {
        color: "#10354B",
        fontSize: 32,
        fontWeight: '600',
    },
    wave_image: {
        width: "110%",
        position: "absolute",
        height: 300,
    },
    button: {
        borderColor: Colors.primary,
        borderRadius: 30,
        paddingVertical: 10,
        alignItems: "center",
        paddingHorizontal: 50,
        marginTop: 40,
        borderWidth: 1
    },
    buttonText: {
        fontSize: 18,
    },
    otpInputContainer: {
        width: '100%',
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
    },
    otpInput: {
        height: 45,
        width: 55,
        borderWidth: 1,
        backgroundColor: Colors.secondary,
        borderRadius: 10,
        paddingHorizontal: 10,
        marginRight: 15,
        textAlign: "center",
        fontWeight: "bold",
    },
    descriptionText: {
        color: Colors.primary,
        paddingRight: 10,
        marginTop: 10,
        marginBottom:40,
        letterSpacing:1,
        fontSize:16
    },
});

export default EnterOTPScreen;
