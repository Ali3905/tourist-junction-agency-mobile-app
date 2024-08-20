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
import { useGlobalContext } from "@/context/GlobalProvider";
import { Picker } from '@react-native-picker/picker';
import { State, City } from 'country-state-city';
import { router } from "expo-router";


type CityType = {
    countryCode: string;
    name: string;
    stateCode: string;
};

const AddEmployeeScreen: React.FC = () => {
    const [name, setName] = useState("");
    const [mobile, setMobile] = useState("");
    const [password, setPassword] = useState("");
    const [city, setCity] = useState("");
    const [state, setState] = useState("");
    const [employerType, setEmployerType] = useState("");
    const [selfie, setSelfie] = useState<ImagePicker.ImagePickerAsset | null>(null);
    const [aadharImage, setAadharImage] = useState<ImagePicker.ImagePickerAsset | null>(null);
    const [loading, setLoading] = useState(false);
    const [cityList, setCityList] = useState<CityType[]>([]);
    const { apiCaller, editData, setRefresh } = useGlobalContext(); // Ensure your global context provides an apiCaller

    useEffect(() => {
        if (state) {
            const stateData = State.getStatesOfCountry("IN").find(s => s.isoCode === state);
            if (stateData) {
                setCityList(City.getCitiesOfState("IN", stateData.isoCode));
            }
        }
    }, [state]);


    useEffect(() => {
        if (editData) {
            setName(editData.name);
            setMobile(editData.mobileNumber);
            setPassword(editData.password);
            setCity(editData.city);
            setState(editData.state);
            setAadharImage(editData.aadharCard);
            setEmployerType(editData.employeeType);
            setSelfie(editData.photo);
        }
    }, [editData])

    const handleAddEmployee = async () => {
        if (!name || !mobile || !password || !city || !state || !employerType || !selfie || !aadharImage) {
            Alert.alert("Please fill all fields and provide both images.");
            return;
        }
    
        if (mobile.length !== 10) {
            Alert.alert("Please enter a valid 10-digit phone number.");
            return;
        }
    
        const formData = new FormData();
        formData.append('name', name);
        formData.append('mobileNumber', mobile);
        formData.append('password', password);
        formData.append('city', city);
        formData.append('state', state);
        formData.append('employeeType', employerType);
    
        if (selfie) {
            formData.append('photo', {
                uri: selfie,
                type: 'image/jpeg',
                name: 'employee_selfie.jpg'
            } as any);
        }
    
        if (aadharImage) {
            formData.append('aadharCard', {
                uri: aadharImage,
                type: 'image/jpeg',
                name: 'aadhar_card.jpg'
            } as any);
        }
    
        setLoading(true);
        try {
            await apiCaller.patch(`/api/employee?employeeId=${editData._id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
            setLoading(false);
            setRefresh(prev=>!prev)
            resetForm();
            Alert.alert("Success", "Employee updated successfully!");
            router.back()
        } catch (error) {
            console.log(error);
            setLoading(false);
            Alert.alert("Error", "Failed to update employee. Please try again.");
        }
    };

    const handleImagePicker = async (type: "selfie" | "aadhar") => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: false,
            aspect: [1, 1],
            quality: 1,
        });

        if (!result.canceled) {
            if (type === "selfie") {
                setSelfie(result.assets[0]);
            } else {
                setAadharImage(result.assets[0]);
            }
        }
    };

    const resetForm = () => {
        setName("");
        setMobile("");
        setPassword("");
        setCity("");
        setState("");
        setEmployerType("");
        setSelfie(null);
        setAadharImage(null);
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView style={styles.scrollView}>
                <View style={styles.content}>
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Employee Name</Text>
                        <TextInput
                            style={styles.input}
                            value={name}
                            onChangeText={(text) => setName(text)}
                        />
                    </View>
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Mobile No.</Text>
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
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Employee Type</Text>
                        <View style={styles.pickerContainer}>
                            <Picker
                                selectedValue={employerType}
                                onValueChange={(itemValue) => setEmployerType(itemValue)}
                                style={styles.picker}
                            >
                                <Picker.Item style={{ color: Colors.secondary }} label="Select Employee Type" value="" />
                                <Picker.Item label="MANAGER" value="MANAGER" />
                                <Picker.Item label="CLEANER" value="CLEANER" />
                                <Picker.Item label="OFFICE-BOY" value="OFFICE-BOY" />
                                <Picker.Item label="ACCOUNTANT" value="ACCOUNTANT" />
                                <Picker.Item label="TELECALLER" value="TELECALLER" />
                            </Picker>
                        </View>
                    </View>

                    <TouchableOpacity style={styles.imagePicker} onPress={() => handleImagePicker("selfie")}>
                        <Text style={styles.imagePickerText}>Select Selfie</Text>
                    </TouchableOpacity>
                    {selfie && <Image source={{ uri: selfie.uri }} style={styles.previewImage} />}

                    <TouchableOpacity style={styles.imagePicker} onPress={() => handleImagePicker("aadhar")}>
                        <Text style={styles.imagePickerText}>Select Aadhar Card Image</Text>
                    </TouchableOpacity>
                    {aadharImage && <Image source={{ uri: aadharImage.uri }} style={styles.previewImage} />}

                    <View style={styles.buttonContainer}>
                        <TouchableOpacity
                            style={[styles.button, { backgroundColor: Colors.darkBlue }]}
                            onPress={handleAddEmployee}
                        >
                            {loading ? (
                                <ActivityIndicator color="#fff" />
                            ) : (
                                <Text style={[styles.buttonText, { color: "#fff" }]}>Update</Text>
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
        backgroundColor: "#ffffff",
    },
    scrollView: {
        flex: 1,
        paddingTop: Platform.OS === 'android' ? 20 : 0,
        paddingHorizontal: 20,
    },
    content: {
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
        width: "100%",
        marginVertical: -6,
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
    buttonContainer: {
        flexDirection: "row",
        justifyContent: "center",
        marginTop: 20,
    },
    button: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        marginHorizontal: 10,
        marginBottom: 40
    },
    buttonText: {
        fontSize: 16,
        fontWeight: "bold",
    },
});

export default AddEmployeeScreen;
