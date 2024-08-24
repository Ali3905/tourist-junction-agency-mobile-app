import React, { useState, useEffect  } from 'react';
import {
    View,
    Text,
    StatusBar,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    SafeAreaView,
    Image,
    Alert,
    ActivityIndicator,
} from "react-native";
import { router } from "expo-router";
import { Colors } from "@/constants/Colors";
import Checkbox from 'expo-checkbox';
import axios from 'axios';
import * as SecureStore from "expo-secure-store";
import { useGlobalContext } from '@/context/GlobalProvider';

const LoginScreen = () => {
    const [phoneNumber, setPhoneNumber] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const {setToken, setIsLogged} = useGlobalContext()
    const [notificationVisible, setNotificationVisible] = useState(true);
     
    useEffect(() => {
        const timer = setTimeout(() => {
            setNotificationVisible(false);
        }, 10000);

        return () => clearTimeout(timer);
    }, []);

    const handleNext = async () => {
        setIsLoading(true);
        let data = {
            'password': password,
            'mobileNumber': phoneNumber
        };
        try {
            const response = await axios.post(`https://api.touristsjunction.com/api/user/login`, data);
            await SecureStore.setItemAsync("access_token", response.data.authToken);
            await SecureStore.setItemAsync("driver_id", response.data.data._id);
            setToken(response.data.authToken)
            setIsLogged(true)
            router.push("/");
        } catch (error) {
            console.log(error);
            Alert.alert("Login Failed", "Please check your credentials and try again.");
        } finally {
            setIsLoading(false);
        }

        setTimeout(() => {
            setIsLoading(false);
        }, 2000);
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" />
            <Image style={styles.wave_image} source={require('@/assets/images/wave.png')} />
               
            {notificationVisible && (
                <View style={styles.notificationContainer}>
                    <Text style={styles.notificationText}>
                        Here you have to enter the ID and password given by the travel agency whose trips you want to view.
                    </Text>
                </View>
            )}
            <View style={{ marginTop: 150 }} >
                <Text style={styles.welcomeText}>Welcome</Text>
                <Text style={styles.welcomeText}>Back</Text>
            </View>
         

            <View style={styles.innerContainer} >
                <View style={styles.inputContainer}>
                    <TextInput
                        placeholder="Phone Number"
                        value={phoneNumber}
                        onChangeText={setPhoneNumber}
                        style={styles.input}
                        placeholderTextColor="#FFFFFF"
                        keyboardType="phone-pad"
                    />
                    <TextInput
                        placeholder="Password"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                        style={styles.input}
                        placeholderTextColor="#FFFFFF"
                    />
                    <View style={styles.optionsContainer}>
                        <View style={styles.rememberMeContainer}>
                            <Checkbox
                                value={rememberMe}
                                onValueChange={setRememberMe}
                            />
                            <Text style={styles.rememberMeText}>Remember Me</Text>
                        </View>
                        <TouchableOpacity onPress={() => router.push("/(modals)/forgotPassword")} >
                            <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <TouchableOpacity onPress={handleNext} style={styles.button} disabled={isLoading}>
                    {isLoading ? (
                        <ActivityIndicator color={Colors.primary} />
                    ) : (
                        <Text style={styles.buttonText}>Login</Text>
                    )}
                </TouchableOpacity>
            </View>

        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        marginTop: StatusBar.currentHeight,
        padding: 20,
    },
    notificationContainer: {
        marginVertical: 20,
        paddingHorizontal: 20,
        backgroundColor: '#51BEEE',
        borderRadius: 5,
        padding: 10,
    },
    notificationText: {
        color: '#ffffff',
        fontSize: 16,
        textAlign: 'center',
    },
    innerContainer: {
        justifyContent: "space-around",
        alignItems: "center",
        width: "100%",
        flex: 1,
    },
    welcomeText: {
        color: "#10354B",
        fontSize: 32,
        fontWeight: '600',
    },
    inputContainer: {
        width: "100%",
    },
    wave_image: {
        width: "110%",
        position: "absolute",
        height: 300,
    },
    input: {
        borderWidth: 1,
        borderColor: "#86D0FB",
        borderRadius: 20,
        padding: 10,
        marginVertical: 10,
        width: "100%",
        backgroundColor: "#86D0FB",
        color: "#FFFFFF",
        paddingHorizontal: 20,
    },
    optionsContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    rememberMeContainer: {
        flexDirection: "row",
        alignItems: "center",
    },
    rememberMeText: {
        marginLeft: 5,
    },
    forgotPasswordText: {
        color: Colors.primary,
    },
    button: {
        borderRadius: 30,
        borderWidth: 1,
        paddingVertical: 10,
        alignItems: "center",
        paddingHorizontal: 50,
        borderColor: Colors.primary,
        minWidth: 150,
    },
    buttonText: {
        fontSize: 21,
        color: Colors.primary,
    },
    dividerContainer: {
        flexDirection: "row",
        alignItems: "center",
        width: "100%",
        marginVertical: 20,
    },
    divider: {
        flex: 1,
        height: 1,
        backgroundColor: "#ccc",
    },
    dividerText: {
        marginHorizontal: 10,
        color: "#888",
    },
    socialContainer: {
        flexDirection: "row",
        justifyContent: "space-around",
        width: "100%",
    },
    socialButton: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 5,
        paddingVertical: 10,
        paddingHorizontal: 20,
        alignItems: "center",
    },
    socialButtonText: {
        fontSize: 16,
    },
    signUpContainer: {
        marginTop: 20,
        flexDirection: "row",
    },
    signUpText: {
        color: Colors.primary,
        fontSize: 14,
    },
});

export default LoginScreen;