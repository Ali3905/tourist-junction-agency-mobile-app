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
import axios from 'axios';
import { useGlobalContext } from '@/context/GlobalProvider';

const ForgotPasswordScreen: React.FC = () => {
    const [phoneNumber, setPhoneNumber] = useState<string>('');
    const [otpSent, setOtpSent] = useState<boolean>(false);
    const [otp, setOtp] = useState<string>('');
    const { setMobileNumber } = useGlobalContext()

    const handleSendOTP = async (): Promise<void> => {
        try {
            const response = await axios.post(`${process.env.EXPO_PUBLIC_URL}api/user/reset/sendOtp`, {
                mobileNumber: `91${phoneNumber}`
            });
            if (response.data.success) {
                setOtpSent(true);
                Alert.alert("Success", "OTP sent successfully!");
            } else {
                Alert.alert("Error", "Failed to send OTP. Please try again.");
            }
        } catch (error) {
            console.error("Error sending OTP:", error);
            Alert.alert("Error", "An error occurred. Please try again later.");
        }
    };

    const handleVerifyOTP = async (): Promise<void> => {
        try {
            const response = await axios.post(`${process.env.EXPO_PUBLIC_URL}api/user/reset/verifyOtp`, {
                mobileNumber: `91${phoneNumber}`,
                otp: otp
            });
            if (response.data.success) {
                setMobileNumber(`91${phoneNumber}`)
                Alert.alert("Success", "OTP verified successfully!");
                router.push("/(modals)/resetPassword");
            } else {
                Alert.alert("Error", "Invalid OTP. Please try again.");
            }
        } catch (error) {
            console.error("Error verifying OTP:", error);
            Alert.alert("Error", "An error occurred. Please try again later.");
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" />
            <Image style={styles.wave_image} source={require('@/assets/images/wave.png')} />

            <View style={styles.marginTop150}>
                <Text style={styles.headingText}>Forgot</Text>
                <Text style={styles.headingText}>Password?</Text>
            </View>

            <Text style={styles.descriptionText}>
                {otpSent
                    ? "Enter the OTP sent to your phone number."
                    : "Enter your phone number and we will send an OTP to reset your password."}
            </Text>

            <View style={styles.innerContainer}>
                {!otpSent ? (
                    <>
                        <View style={styles.inputContainer}>
                            <TextInput
                                placeholder="Phone Number"
                                value={phoneNumber}
                                onChangeText={setPhoneNumber}
                                style={styles.input}
                                placeholderTextColor="#FFFFFF"
                                keyboardType="phone-pad"
                            />
                        </View>

                        <View style={styles.sendOTPButton}>
                            <Text style={styles.sendOTPText}>
                                Send OTP
                            </Text>
                            <TouchableOpacity onPress={handleSendOTP} style={styles.arrowButton}>
                                <View style={styles.circle}>
                                    <AntDesign name="arrowright" size={24} color="white" />
                                </View>
                            </TouchableOpacity>
                        </View>
                    </>
                ) : (
                    <>
                        <View style={styles.inputContainer}>
                            <TextInput
                                placeholder="Enter OTP"
                                value={otp}
                                onChangeText={setOtp}
                                style={styles.input}
                                placeholderTextColor="#FFFFFF"
                                keyboardType="numeric"
                                maxLength={4}
                            />
                        </View>

                        <TouchableOpacity onPress={handleVerifyOTP} style={styles.verifyButton}>
                            <Text style={styles.verifyButtonText}>Verify OTP</Text>
                        </TouchableOpacity>
                    </>
                )}
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
        marginTop: 100,
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
        width: "100%",
        backgroundColor: "#86D0FB",
        color: "#FFFFFF",
        paddingHorizontal: 20,
        height: 50
    },
    sendOTPButton: {
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
    descriptionText: {
        color: Colors.primary,
        paddingRight: 10,
        marginTop: 40,
    },
    sendOTPText: {
        color: Colors.primary,
        fontSize: 24,
        fontWeight: '700',
    },
    verifyButton: {
        backgroundColor: Colors.primary,
        paddingHorizontal: 40,
        paddingVertical: 15,
        borderRadius: 25,
    },
    verifyButtonText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: '600',
    },
});

export default ForgotPasswordScreen;