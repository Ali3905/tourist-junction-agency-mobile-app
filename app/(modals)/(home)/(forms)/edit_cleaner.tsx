import React, { useState, useEffect } from "react";
import {
    View,
    StyleSheet,
    TouchableOpacity,
    Text,
    Image,
    TextInput,
    SafeAreaView,
    ScrollView,
    Platform,
    Alert,
    ActivityIndicator 
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Colors } from "@/constants/Colors";
import { useGlobalContext } from "@/context/GlobalProvider"; // Import the global context
import { Picker } from '@react-native-picker/picker';
import { State, City } from 'country-state-city';
import { router } from "expo-router";

type CityType = {
    countryCode: string;
    name: string;
    stateCode: string;
};


const AddCleanerScreen: React.FC = () => {
    const [name, setName] = useState("");
    const [mobile, setMobile] = useState("");
    const [city, setCity] = useState("");
    const [state, setState] = useState("");
    const [password, setPassword] = useState("");
    const [cleanerImage, setCleanerImage] = useState<ImagePicker.ImagePickerAsset | null>(null);
    const [aadharImage, setAadharImage] = useState<ImagePicker.ImagePickerAsset | null>(null);
    const [loading, setLoading] = useState(false);
    const [cityList, setCityList] = useState<CityType[]>([]);
    const { apiCaller, editData, setRefresh } = useGlobalContext();

    useEffect(() => {
        if (state) {
            const stateData = State.getStatesOfCountry("IN").find(s => s.isoCode === state);
            if (stateData) {
                setCityList(City.getCitiesOfState("IN", stateData.isoCode) as CityType[]);
            }
        }
    }, [state]);


    useEffect(() => {
        if (editData) {
            setName(editData.name);
            setMobile(editData.mobileNumber);
            setCity(editData.city);
            setState(editData.state);
            setPassword(editData.password);
            setCleanerImage(editData.photo);
            setAadharImage(editData.aadharCard);
        }
    }, [editData])

    const handleAddCleaner = async () => {
        if (!name || !mobile || !city || !state || !password || !cleanerImage || !aadharImage) {
            Alert.alert("Please fill all fields and provide images.");
            return;
        }


        const formData = new FormData();
        formData.append('name', name);
        formData.append('mobileNumber', mobile);
        formData.append('city', city);
        formData.append('state', state);
        formData.append('password', password);
    
        if (cleanerImage) {
            formData.append('photo', {
                uri: cleanerImage.uri,
                type: 'image/jpeg',
                name: `cleaner.jpg`
            } as any);
        }
    
        if (aadharImage) {
            formData.append('aadharCard', {
                uri: aadharImage.uri,
                type: 'image/jpeg',
                name: `aadhar.jpg`
            } as any);
        }
    

        setLoading(true);
        try {
            await apiCaller.patch(`/api/cleaner?cleanerId=${editData._id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
            setLoading(false);
            setRefresh(prev=>!prev)
            resetForm();
            Alert.alert("Success", "Cleaner updated successfully!");
            router.back()
        } catch (error) {
            console.log(error);
            setLoading(false);
            Alert.alert("Error", "Failed to update cleaner. Please try again.");
        }
    };

    const handleImagePicker = async (type: "cleaner" | "aadhar") => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: false,
            aspect: type === "cleaner" ? [1, 1] : [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            if (type === "cleaner") {
                setCleanerImage(result.assets[0]);
            } else {
                setAadharImage(result.assets[0]);
            }
        }
    };

    const resetForm = () => {
        setName("");
        setMobile("");
        setCity("");
        setState("");
        setPassword("");
        setCleanerImage(null);
        setAadharImage(null);
    };

    return (
        <SafeAreaView style={styles.container}>
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
                        <Text style={styles.label}>Mobile</Text>
                        <TextInput
                            style={styles.input}
                            value={mobile}
                            onChangeText={(text) => setMobile(text)}
                            keyboardType="phone-pad"
                        />
                    </View>
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Password</Text>
                        <TextInput
                            style={styles.input}
                            value={password}
                            onChangeText={(text) => setPassword(text)}
                            secureTextEntry
                        />
                    </View>
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>State</Text>
                        <View style={styles.pickerContainer}>
                            <Picker
                                selectedValue={state}
                                onValueChange={(itemValue) => setState(itemValue)}
                                style={styles.picker}
                            >
                                <Picker.Item style={{ color: Colors.secondary }} label="Select State" value="" />
                                {State.getStatesOfCountry("IN").map((s) => (
                                    <Picker.Item key={s.isoCode} label={s.name} value={s.isoCode} />
                                ))}
                            </Picker>
                        </View>
                    </View>
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>City</Text>
                        <View style={styles.pickerContainer}>
                            <Picker
                                selectedValue={city}
                                onValueChange={(itemValue) => setCity(itemValue)}
                                style={styles.picker}
                                enabled={!!state}
                            >
                                <Picker.Item style={{ color: Colors.secondary }} label="Select City" value="" />
                                {cityList.map((c) => (
                                    <Picker.Item key={c.name} label={c.name} value={c.name} />
                                ))}
                            </Picker>
                        </View>
                    </View>
                    <TouchableOpacity style={styles.imagePicker} onPress={() => handleImagePicker("cleaner")}>
                        <Text style={styles.imagePickerText}>Select Cleaner Image</Text>
                    </TouchableOpacity>
                    {cleanerImage && <Image source={{ uri: cleanerImage.uri }} style={styles.previewImage} />}

                    <TouchableOpacity style={styles.imagePicker} onPress={() => handleImagePicker("aadhar")}>
                        <Text style={styles.imagePickerText}>Select Aadhar Card Image</Text>
                    </TouchableOpacity>
                    {aadharImage && <Image source={{ uri: aadharImage.uri }} style={styles.previewImage} />}

                    <View style={styles.modalButtons}>
                        <TouchableOpacity
                            style={[styles.modalButton, { backgroundColor: Colors.darkBlue }]}
                            onPress={handleAddCleaner}
                        >
                            {loading ? (
                                <ActivityIndicator color="#fff" />
                            ) : (
                                <Text style={[styles.modalButtonText, { color: "#fff" }]}>Update</Text>
                            )}
                        </TouchableOpacity>
                    </View>
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
    },
    modalContainer: {
        flex: 1,
        paddingTop: Platform.OS === 'android' ? 20 : 0,
        paddingHorizontal: 20,
    },
    modalContent: {
        backgroundColor: "#fff",
        borderRadius: 10,
        elevation: 5,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 20,
        textAlign: "center",
    },
    inputGroup: {
        marginBottom: 15,
    },
    label: {
        marginBottom: 5,
        fontSize: 13,
        color: Colors.secondary,
        fontWeight: "500"
    },
    input: {
        borderColor: Colors.secondary,
        borderWidth: 1,
        borderRadius: 10,
        paddingHorizontal: 10,
        height: 40,
    },
    pickerContainer: {
        borderColor: Colors.secondary,
        borderWidth: 1,
        borderRadius: 10,
    },
    picker: {
        color: Colors.secondary,
        marginVertical: -6
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
        justifyContent: "center",
        marginTop: 20,
    },
    modalButton: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        marginHorizontal: 10,
        marginBottom: 40
    },
    modalButtonText: {
        fontSize: 16,
        fontWeight: "bold",
    },
});

export default AddCleanerScreen;
