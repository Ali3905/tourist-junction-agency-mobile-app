import React, { useState } from 'react';
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
    Switch,
    ScrollView
} from "react-native";
import { router } from "expo-router";
import { Colors } from "@/constants/Colors";
import Checkbox from 'expo-checkbox';
import axios from 'axios';
import * as SecureStore from "expo-secure-store";
import { useGlobalContext } from '@/context/GlobalProvider';

const LoginScreen = () => {
    const [isManager, setIsManager] = useState(false);
    const [usernameOrMobile, setUsernameOrMobile] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const {setToken, setIsLogged} = useGlobalContext()

    const handleNext = async () => {
        setIsLoading(true);
        let data = {
            'password': password,
            [isManager ? 'mobileNumber' : 'userName']: usernameOrMobile
        };
        try {
            const response = await axios.post(`${process.env.EXPO_PUBLIC_URL}api/user/login`, data);
            await SecureStore.setItemAsync("access_token", response.data.authToken);
            setToken(response.data.authToken)
            setIsLogged(true)
            router.push("/");
        } catch (error) {
            console.log(error);
            Alert.alert("Login Failed", "Please check your credentials and try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <ScrollView style={styles.container}>
            <StatusBar barStyle="dark-content" />
            <Image style={styles.wave_image} source={require('@/assets/images/wave.png')} />

            <View style={{ marginTop: 150 }} >
                <Text style={styles.welcomeText}>Welcome</Text>
                <Text style={styles.welcomeText}>Back</Text>
            </View>

            <View style={styles.innerContainer} >
                <View style={styles.inputContainer}>
                    <View style={styles.toggleContainer}>
                        <Text>Acency</Text>
                        <Switch
                            value={isManager}
                            onValueChange={setIsManager}
                            trackColor={{ false: "#767577", true: Colors.darkBlue }}
                            thumbColor={isManager ? Colors.secondary : "#f4f3f4"}
                            style={styles.switch}
                        />
                        <Text>Manager</Text>
                    </View>
                    <TextInput
                        placeholder={isManager ? "Mobile Number" : "Username"}
                        value={usernameOrMobile}
                        onChangeText={setUsernameOrMobile}
                        style={styles.input}
                        placeholderTextColor="#FFFFFF"
                        keyboardType={isManager ? "phone-pad" : "default"}
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

        </ScrollView>
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
        fontSize:40
    },
    button: {
        borderRadius: 30,
        borderWidth: 1,
        paddingVertical: 10,
        alignItems: "center",
        paddingHorizontal: 50,
        borderColor: Colors.primary,
        minWidth: 150,
        marginTop:20
    },
    buttonText: {
        fontSize: 21,
        color: Colors.primary,
    },
    toggleContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
        gap:10
    },
    switch: {
        transform: [{ scaleX: 2 }, { scaleY: 2 }],
    },
});

export default LoginScreen;