import React, { useState } from "react";
import {
    View,
    Text,
    StatusBar,
    StyleSheet,
    TouchableOpacity,
    SafeAreaView,
    Image,
    ActivityIndicator,
} from "react-native";
import { router } from "expo-router";
import { Colors } from "@/constants/Colors";
import { FontAwesome } from '@expo/vector-icons';
import { useGlobalContext } from "@/context/GlobalProvider";
import * as SecureStore from "expo-secure-store";

const ProfileScreen = () => {
    const { userData, setToken, setIsLogged } = useGlobalContext();
    const [isLoading, setIsLoading] = useState(false);

    const handleEdit = () => {
        router.push('/edit_profile');
    };

    const handleLogout = async () => {
        setIsLoading(true);
        try {
            await SecureStore.deleteItemAsync("access_token");
            setIsLogged(false);
            setToken(null);
            router.push('/')
        } catch (error) {
            console.error("Error during logout:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" />
            <Image style={styles.wave_image} source={require('@/assets/images/wave.png')} />
            <View style={styles.contentContainer}>
                <Text style={styles.title}>My Profile</Text>
                <View style={styles.detailsContainer}>
                    <View style={styles.header}>
                        <Text style={styles.headerText}>Details</Text>
                        <TouchableOpacity style={styles.editButton} onPress={handleEdit}>
                            <FontAwesome name="pencil" size={24} color="white" />
                            <Text style={styles.editText}>Edit</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.detailContent}>
                        <Text style={styles.detailText}>{userData?.userName}</Text>
                        <Text style={styles.detailText}>{userData?.mobileNumber}</Text>
                        <Text style={styles.detailText}>{userData?.email}</Text>
                    </View>
                </View>
                <Text style={styles.galleryTitle}>Gallery</Text>
                <View style={styles.divider} />
                <TouchableOpacity onPress={() => router.push('all_photos')} style={styles.galleryContainer}>
                    <FontAwesome name="photo" size={24} color={Colors.primary} />
                    <Text style={styles.galleryText}>All Photos</Text>
                </TouchableOpacity>
                <View style={styles.divider} />
                <TouchableOpacity style={styles.logoutButton} onPress={handleLogout} disabled={isLoading}>
                    {isLoading ? (
                        <ActivityIndicator color="white" />
                    ) : (
                        <Text style={styles.logoutButtonText}>Logout</Text>
                    )}
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        justifyContent: "flex-start",
        alignItems: "center",
        marginTop: StatusBar.currentHeight,
        backgroundColor: 'white',
    },
    wave_image: {
        width: "110%",
        position: "absolute",
        height: 300,
        top: 0,
    },
    contentContainer: {
        marginTop: 100,
        width: '100%',
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: Colors.primary,
        marginVertical: 20,
    },
    detailsContainer: {
        width: '100%',
        borderRadius: 10,
        backgroundColor: 'white',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        marginBottom: 20,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: Colors.secondary,
        padding: 10,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
    },
    headerText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 18,
    },
    editButton: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    editText: {
        color: 'white',
        fontWeight: 'bold',
        marginLeft: 5,
    },
    detailContent: {
        padding: 10,
    },
    detailText: {
        fontSize: 16,
        marginBottom: 10,
    },
    galleryTitle: {
        fontSize: 20,
        fontWeight: '500',
        color: Colors.primary,
        alignSelf: 'flex-start',
        marginTop: 2,
    },
    galleryContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        width: '100%',
    },
    galleryText: {
        fontSize: 16,
        color: Colors.primary,
        marginLeft: 10,
    },
    divider: {
        width: '100%',
        height: 1,
        backgroundColor: '#E0E0E0',
        marginVertical: 20,
    },
    logoutButton: {
        width: '100%',
        paddingVertical: 15,
        alignItems: 'center',
        backgroundColor: Colors.primary,
        borderRadius: 30,
    },
    logoutButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default ProfileScreen;