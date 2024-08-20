import React, { useEffect, useState } from "react";
import {
    View,
    StyleSheet,
    TouchableOpacity,
    Text,
    Image,
    TextInput,
    SafeAreaView,
    ScrollView,
    Alert,
    ActivityIndicator,
    StatusBar
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useGlobalContext } from "@/context/GlobalProvider";

const EditProfileScreen: React.FC = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [contactNumber, setContactNumber] = useState("");
    const [companyName, setCompanyName] = useState("");
    const [state, setState] = useState("");
    const [city, setCity] = useState("");
    const [whatsappNumber, setWhatsappNumber] = useState("");
    const [userImage, setUserImage] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const { userData, apiCaller } = useGlobalContext();
    
    useEffect(() => {
        if (userData) {
            setName(userData.userName);
            setEmail(userData.email);
            setContactNumber(userData.mobileNumber);
            setCompanyName(userData.companyName);
            setState(userData.state);
            setCity(userData.city);
            setWhatsappNumber(userData.whatsappNumber);
            setUserImage(null);
        }
    }, [userData])
    

    const handleAddData = async() => {
        if (!name || !email || !contactNumber || !companyName || !city || !state || !whatsappNumber || !userImage) {
            Alert.alert("Please fill all fields and provide an image.");
            return;
        }

        const newData = {
            userName:name,
            email,
            mobileNumber:contactNumber,
            companyName,
            state,
            city,
            whatsappNumber,
            // userImage,
        };


        setLoading(true);
        try {
            const res = await apiCaller.patch(`/api/user/`, newData, { headers: { 'Content-Type': 'multipart/form-data' } });
            console.log(res);
            
            setLoading(false);
            Alert.alert("Success", "Profile updated successfully!");
          } catch (error) {
            console.log(error);
            setLoading(false);
            Alert.alert("Error", "Failed to update profile. Please try again.");
          }
    };

    const handleImagePicker = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: false,
            aspect: [1, 1],
            quality: 1,
        });

        if (!result.canceled) {
            setUserImage(result.assets[0].uri);
        }
    };


    return (
        <SafeAreaView style={styles.container}>
            <Image style={styles.wave_image} source={require('@/assets/images/wave.png')} />
            <TouchableOpacity onPress={() => router.back()} >
                <Ionicons name="chevron-back" size={28} color="black" />
            </TouchableOpacity>

            <Text style={styles.title}>Edit Profile</Text>


            <ScrollView style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Name</Text>
                        <TextInput
                            style={styles.input}
                            value={name}
                            onChangeText={(text) => setName(text)}
                        />
                    </View>
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Email</Text>
                        <TextInput
                            style={styles.input}
                            value={email}
                            onChangeText={(text) => setEmail(text)}
                            keyboardType="email-address"
                        />
                    </View>
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Contact Number</Text>
                        <TextInput
                            style={styles.input}
                            value={contactNumber}
                            onChangeText={(text) => setContactNumber(text)}
                            keyboardType="phone-pad"
                        />
                    </View>
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Company Name</Text>
                        <TextInput
                            style={styles.input}
                            value={companyName}
                            onChangeText={(text) => setCompanyName(text)}
                        />
                    </View>
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>State</Text>
                        <TextInput
                            style={styles.input}
                            value={state}
                            onChangeText={(text) => setState(text)}
                        />
                    </View>
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>City</Text>
                        <TextInput
                            style={styles.input}
                            value={city}
                            onChangeText={(text) => setCity(text)}
                        />
                    </View>
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>WhatsApp Number</Text>
                        <TextInput
                            style={styles.input}
                            value={whatsappNumber}
                            onChangeText={(text) => setWhatsappNumber(text)}
                            keyboardType="phone-pad"
                        />
                    </View>

                    <TouchableOpacity style={styles.imagePicker} onPress={() => handleImagePicker()}>
                        <Text style={styles.imagePickerText}>Select User Image</Text>
                    </TouchableOpacity>
                    {userImage && <Image source={{ uri: userImage }} style={styles.previewImage} />}

                    <View style={styles.modalButtons}>
                        <TouchableOpacity style={[styles.modalButton, { borderColor: "red", borderWidth: 1 }]}>
                            <Text style={[styles.modalButtonText, { color: "red" }]}>Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.modalButton, { borderColor: Colors.secondary, borderWidth: 1 }]}
                            onPress={handleAddData}
                        >
                            {loading ? (
                                <ActivityIndicator color={Colors.secondary} />
                            ) : (
                                <Text style={[styles.modalButtonText, { color: Colors.secondary }]}>Update</Text>
                            )}
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity style={{ alignItems: "center", marginTop: 20 }} >
                        <Text style={{ color: "red", fontWeight: "semibold", fontSize: 14 }} >Delete my account</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: "#ffffff",
        marginTop: StatusBar.currentHeight,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: Colors.primary,
        marginTop: 100,
        textAlign: "center"
    },
    wave_image: {
        width: "110%",
        position: "absolute",
        height: 300,
        top: 0,
    },
    modalContainer: {
        flex: 1,
    },
    modalContent: {
        backgroundColor: "#fff",
        borderRadius: 10,
        elevation: 5,
        padding: 20,
    },
    inputGroup: {
        marginBottom: 15,
    },
    label: {
        marginBottom: 5,
        fontSize: 13,
        color: Colors.secondary,
        fontWeight: "500",
    },
    input: {
        borderColor: Colors.secondary,
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        height: 40,
    },
    imagePicker: {
        backgroundColor: Colors.darkBlue,
        padding: 15,
        borderRadius: 5,
        alignItems: "center",
        marginBottom: 15,
    },
    imagePickerText: {
        color: "#fff",
        fontWeight: "bold",
    },
    previewImage: {
        width: "100%",
        height: 200,
        borderRadius: 10,
        marginBottom: 15,
    },
    modalButtons: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 20,
    },
    modalButton: {
        paddingVertical: 10,
        paddingHorizontal: 30,
        borderRadius: 20,
        marginHorizontal: 10,
    },
    modalButtonText: {
        fontSize: 16,
        fontWeight: "medium",
    },
});

export default EditProfileScreen;
