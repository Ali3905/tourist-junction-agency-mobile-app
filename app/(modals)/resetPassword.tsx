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
} from "react-native";
import { router } from "expo-router";
import { Colors } from "@/constants/Colors";
import { AntDesign } from '@expo/vector-icons';
import { useGlobalContext } from '@/context/GlobalProvider';
import axios from 'axios';

const ResetPasswordScreen: React.FC = () => {
    const [newPassword, setNewPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');
    const { mobileNumber } = useGlobalContext();

    const handleResetPassword = async (): Promise<void> => {
        if (newPassword !== confirmPassword) {
            Alert.alert("Error", "Passwords do not match. Please try again.");
            return;
        }

        if (newPassword.length < 5) {
            Alert.alert("Error", "Password should be at least 5 characters long.");
            return;
        }

        try {
            const response = await axios.post(`${process.env.EXPO_PUBLIC_URL}api/user/reset/`, {
                mobileNumber: mobileNumber,
                newPassword: newPassword
            });

            if (response.data.success) {
                Alert.alert("Success", "Password reset successfully!");
                router.push('/(modals)/resetPasswordDone');
            } else {
                Alert.alert("Error", "Failed to reset password. Please try again.");
            }
        } catch (error) {
            console.error("Error resetting password:", error);
            Alert.alert("Error", "An error occurred. Please try again later.");
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" />
            <Image style={styles.wave_image} source={require('@/assets/images/wave.png')} />

            <View style={styles.marginTop150}>
                <Text style={styles.headingText}>Reset</Text>
                <Text style={styles.headingText}>Password</Text>
            </View>

            <View style={styles.innerContainer}>
                <View style={styles.inputContainer}>
                    <TextInput
                        placeholder="New Password"
                        value={newPassword}
                        onChangeText={setNewPassword}
                        secureTextEntry
                        style={styles.input}
                        placeholderTextColor="#FFFFFF"
                    />
                    <TextInput
                        placeholder="Confirm Password"
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                        secureTextEntry
                        style={styles.input}
                        placeholderTextColor="#FFFFFF"
                    />
                </View>

                <View style={styles.resetButton}>
                    <Text style={styles.resetText}>
                        Reset
                    </Text>
                    <TouchableOpacity onPress={handleResetPassword} style={styles.arrowButton}>
                        <View style={styles.circle}>
                            <AntDesign name="arrowright" size={24} color="white" />
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FAF9F6",
        marginTop: StatusBar.currentHeight || 0,
        padding: 20,
    },
    innerContainer: {
        alignItems: "center",
        width: "100%",
        flex: 1,
        marginTop: 50,
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
    inputContainer: {
        width: "100%",
        marginBottom: 30,
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
    resetButton: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 20,
        justifyContent: "space-around",
        width: "100%",
    },
    arrowButton: {
        alignItems: "center",
        justifyContent: "center",
    },
    circle: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: "#2AA4D5",
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 1,
        borderColor: "#2AA4D5",
    },
    marginTop150: {
        marginTop: 150,
    },
    resetText: {
        color: Colors.primary,
        fontSize: 24,
        fontWeight: '700',
    },
});

export default ResetPasswordScreen;