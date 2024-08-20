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

const AddDriverScreen: React.FC = () => {
    const [name, setName] = useState("");
    const [mobile, setMobile] = useState("");
    const [password, setPassword] = useState("");
    const [city, setCity] = useState("");
    const [state, setState] = useState("");
    const [vehicleType, setVehicleType] = useState("");
    const [driverImage, setDriverImage] = useState<ImagePicker.ImagePickerAsset | string>("");
    const [aadharImage, setAadharImage] = useState<ImagePicker.ImagePickerAsset | string>("");
    const [licenseImage, setLicenseImage] = useState<ImagePicker.ImagePickerAsset | string>("");

    const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false)
    const [loading, setLoading] = useState(false);
    const [cityList, setCityList] = useState<CityType[]>([]);
    const { apiCaller, editData, setRefresh } = useGlobalContext();

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
            setDriverImage(editData.photo);
            setAadharImage(editData.aadharCard);
            setLicenseImage(editData.license);
            setVehicleType(editData.vehicleType);
        }
    }, [editData])

    const handleAddDriver = async () => {
        if (!name || !mobile || !password || !city || !state || !vehicleType) {
            Alert.alert("Error","Please fill all fields and provide images.");
            return;
        }

        if (mobile.length < 10 || mobile.length > 12) {
            Alert.alert("Error","Please provide a valid mobile number");
            return;
        }

        if (password.length < 5) {
            Alert.alert("Error","Password must contain atleast 5 characters");
            return;
        }

        const formData = new FormData();
        formData.append('name', name);
        formData.append('mobileNumber', mobile);
        formData.append('password', password);
        formData.append('city', city);
        formData.append('state', state);
        formData.append('vehicleType', vehicleType);
    
        if (driverImage && driverImage.uri) {
            formData.append('photo', {
                uri: driverImage.uri,
                type: 'image/jpeg',
                name: 'driver_photo.jpg'
            } as any);
        }
    
        if (aadharImage && aadharImage.uri) {
            formData.append('aadharCard', {
                uri: aadharImage.uri,
                type: 'image/jpeg',
                name: 'aadhar_card.jpg'
            } as any);
        }
    
        if (licenseImage && licenseImage.uri) {
            formData.append('license', {
                uri: licenseImage.uri,
                type: 'image/jpeg',
                name: 'driver_license.jpg'
            } as any);
        }

        setLoading(true);
        try {
            await apiCaller.patch(`/api/driver?driverId=${editData._id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
            setLoading(false);
            setRefresh(prev=>!prev)
            resetForm();
            Alert.alert("Success", "Driver updated successfully!");
            router.back()
        } catch (error) {
            console.log(error);
            setLoading(false);
            Alert.alert("Error", "Failed to add driver. Please try again.");
        }
    };

    const handleImagePicker = async (type: "driver" | "aadhar" | "license") => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: false,
            aspect: type === "driver" ? [1, 1] : [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            if (type === "driver") {
                setDriverImage(result.assets[0]);
            } else if (type === "aadhar") {
                setAadharImage(result.assets[0]);
            } else {
                setLicenseImage(result.assets[0]);
            }
        }
    };

    const resetForm = () => {
        setName("");
        setMobile("");
        setPassword("");
        setCity("");
        setState("");
        setVehicleType("");
        setDriverImage(null);
        setAadharImage(null);
        setLicenseImage(null);
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView style={styles.scrollView}>
                <View style={styles.content}>
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
                        <View style={{ ...styles.input, flexDirection: "row", alignItems: "center" }}>
                            <TextInput
                                style={{ flex: 1 }}
                                value={password}
                                onChangeText={(text) => setPassword(text)}
                                secureTextEntry={isPasswordVisible ? false : true}
                            />
                            <TouchableOpacity onPress={() => setIsPasswordVisible(prev => !prev)} style={{ backgroundColor: Colors.darkBlue, padding: 4, borderRadius: 5 }} ><Text style={[{ color: "#fff" }]}>{isPasswordVisible ? "Hide" : "Show"}</Text></TouchableOpacity>
                        </View>
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
                        <Text style={styles.label}>Vehicle Type</Text>
                        <View style={styles.pickerContainer}>
                            <Picker
                                selectedValue={vehicleType}
                                onValueChange={(itemValue) => setVehicleType(itemValue)}
                                style={styles.picker}
                            >
                                <Picker.Item style={{ color: Colors.secondary }} label="Select Vehicle Type" value="" />
                                <Picker.Item label="CAR" value="CAR" />
                                <Picker.Item label="ALL" value="ALL" />
                                <Picker.Item label="TRUCK" value="TRUCK" />
                                <Picker.Item label="BUS" value="BUS" />
                                <Picker.Item label="TAMPO" value="TAMPO" />
                            </Picker>
                        </View>
                    </View>

                    <TouchableOpacity style={styles.imagePicker} onPress={() => handleImagePicker("driver")}>
                        <Text style={styles.imagePickerText}>Select Driver Image</Text>
                    </TouchableOpacity>
                    {driverImage && <Image source={{ uri: driverImage.uri || driverImage }} style={styles.previewImage} />}

                    <TouchableOpacity style={styles.imagePicker} onPress={() => handleImagePicker("aadhar")}>
                        <Text style={styles.imagePickerText}>Select Aadhar Card Image</Text>
                    </TouchableOpacity>
                    {aadharImage && <Image source={{ uri: aadharImage.uri || aadharImage }} style={styles.previewImage} />}

                    <TouchableOpacity style={styles.imagePicker} onPress={() => handleImagePicker("license")}>
                        <Text style={styles.imagePickerText}>Select Driver License Image</Text>
                    </TouchableOpacity>
                    {licenseImage && <Image source={{ uri: licenseImage.uri || licenseImage }} style={styles.previewImage} />}

                    <View style={styles.buttonContainer}>
                        <TouchableOpacity
                            style={[styles.button, { backgroundColor: Colors.darkBlue }]}
                            onPress={handleAddDriver}
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
        fontSize: 16,
    },
    previewImage: {
        width: 100,
        height: 100,
        marginVertical: 10,
        alignSelf: "center",
        borderRadius: 10,
    },
    buttonContainer: {
        flexDirection: "row",
        justifyContent: "center",
    },
    button: {
        borderRadius: 10,
        paddingVertical: 10,
        paddingHorizontal: 20,
        alignItems: "center",
        marginBottom: 40

    },
    buttonText: {
        fontSize: 16,
    },
});

export default AddDriverScreen;
