import React, { useState } from 'react';
import {
    View,
    Text,
    StatusBar,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    Image,
    Platform,
    Alert,
} from "react-native";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { router } from "expo-router";
import { Colors } from "@/constants/Colors";
import axios from 'axios';
import * as SecureStore from "expo-secure-store";
import { useGlobalContext } from '@/context/GlobalProvider';

const SignUpScreen = () => {
    const [ownerName, setOwnerName] = useState('');
    const [companyName, setCompanyName] = useState('');
    const [contact, setContact] = useState('');
    const [whatsapp, setWhatsapp] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const {setMobileNumber} = useGlobalContext()

    const validateInputs = () => {
        if (!ownerName || !companyName || !contact || !whatsapp || !city || !state || !email || !password) {
            Alert.alert("Error", "All fields are required.");
            return false;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            Alert.alert("Error", "Please enter a valid email address.");
            return false;
        }

        const phoneRegex = /^\d{10}$/;
        if (!phoneRegex.test(contact) || !phoneRegex.test(whatsapp)) {
            Alert.alert("Error", "Please enter valid 10-digit phone numbers.");
            return false;
        }

        if (password.length < 6) {
            Alert.alert("Error", "Password must be at least 6 characters long.");
            return false;
        }

        return true;
    };

    const handleSignUp = async () => {
        if (!validateInputs()) {
            return;
        }

        setIsLoading(true);
        let data = {
            userName: ownerName,
            companyName: companyName,
            mobileNumber: `91${contact}`,
            whatsappNumber: whatsapp,
            state: state,
            city: city,
            email: email,
            password: password,
            type: 'AGENCY'
        };
        try {
            const response = await axios.post(`${process.env.EXPO_PUBLIC_URL}api/user/`, data);
            if (response.data.success) {
                setMobileNumber(data.mobileNumber)
                router.push("/verify");
            }
            
        } catch (error) {
            console.error(error);
            Alert.alert("Sign Up Failed", "Please check your information and try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" />
            <Image style={styles.wave_image} source={require('@/assets/images/wave.png')} />

            <View style={styles.headerContainer}>
                <Text style={styles.headingText}>Create</Text>
                <Text style={styles.headingText}>Account</Text>
            </View>

            <KeyboardAwareScrollView 
                style={styles.scrollView}
                contentContainerStyle={styles.scrollViewContent}
                keyboardShouldPersistTaps="handled"
            >
                <View style={styles.inputContainer}>
                    <TextInput
                        placeholder="Owner Name"
                        value={ownerName}
                        onChangeText={setOwnerName}
                        style={styles.input}
                        placeholderTextColor="#FFFFFF"
                    />
                    <TextInput
                        placeholder="Company Name"
                        value={companyName}
                        onChangeText={setCompanyName}
                        style={styles.input}
                        placeholderTextColor="#FFFFFF"
                    />
                    <TextInput
                        placeholder="Contact"
                        value={contact}
                        onChangeText={setContact}
                        style={styles.input}
                        placeholderTextColor="#FFFFFF"
                        keyboardType="phone-pad"
                    />
                    <TextInput
                        placeholder="WhatsApp Number"
                        value={whatsapp}
                        onChangeText={setWhatsapp}
                        style={styles.input}
                        placeholderTextColor="#FFFFFF"
                        keyboardType="phone-pad"
                    />
                    <TextInput
                        placeholder="City"
                        value={city}
                        onChangeText={setCity}
                        style={styles.input}
                        placeholderTextColor="#FFFFFF"
                    />
                    <TextInput
                        placeholder="State"
                        value={state}
                        onChangeText={setState}
                        style={styles.input}
                        placeholderTextColor="#FFFFFF"
                    />
                    <TextInput
                        placeholder="Email"
                        value={email}
                        onChangeText={setEmail}
                        style={styles.input}
                        placeholderTextColor="#FFFFFF"
                        keyboardType="email-address"
                    />
                    <TextInput
                        placeholder="Password"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                        style={styles.input}
                        placeholderTextColor="#FFFFFF"
                    />
                </View>

                <View style={styles.buttonContainer}>
                    <TouchableOpacity onPress={handleSignUp} style={styles.button} disabled={isLoading}>
                        <Text style={styles.buttonText}>{isLoading ? "Signing Up..." : "Sign Up"}</Text>
                    </TouchableOpacity>

                    <View style={styles.loginContainer}>
                        <Text style={styles.loginText}>Already have an account? </Text>
                        <TouchableOpacity onPress={()=>router.push("(modals)/login")}>
                            <Text style={styles.loginLinkText}>Login</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </KeyboardAwareScrollView>
        </View>
    );
};
 
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FAF9F6",
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    },
    headerContainer: {
        marginTop: 150,
        paddingHorizontal: 20,
    },
    scrollView: {
        flex: 1,
    },
    scrollViewContent: {
        flexGrow: 1,
        justifyContent: 'space-between',
        paddingBottom: 20,
    },
    headingText: {
        color: "#10354B",
        fontSize: 32,
        fontWeight: '600',
    },
    inputContainer: {
        width: "100%",
        paddingHorizontal: 20,
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
    buttonContainer: {
        alignItems: 'center',
        marginTop: 20,
    },
    button: {
        borderRadius: 30,
        borderWidth: 1,
        paddingVertical: 10,
        alignItems: "center",
        paddingHorizontal: 50,
        borderColor: Colors.primary,
    },
    buttonText: {
        fontSize: 21,
        color: Colors.primary,
    },
    loginContainer: {
        marginTop: 20,
        flexDirection: "row",
    },
    loginText: {
        color: Colors.primary,
        fontSize: 14,
    },
    loginLinkText: {
        fontWeight: "800",
        color: Colors.primary,
        fontSize: 40,
    },
});

export default SignUpScreen;