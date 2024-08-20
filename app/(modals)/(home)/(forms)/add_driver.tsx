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
    ActivityIndicator,
    Pressable
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Colors } from "@/constants/Colors";
import { useGlobalContext } from "@/context/GlobalProvider";
import { Dropdown } from 'react-native-element-dropdown';
import { State, City } from 'country-state-city';
import { router } from "expo-router";

type CityType = {
    countryCode: string;
    name: string;
    stateCode: string;
};

type StateType = {
    countryCode: string;
    isoCode: string;
    name: string;
};

type DropdownItem = {
    label: string;
    value: string;
};

const AddDriverScreen: React.FC = () => {
    const [name, setName] = useState("");
    const [mobile, setMobile] = useState("");
    const [password, setPassword] = useState("");
    const [city, setCity] = useState("");
    const [state, setState] = useState("");
    const [vehicleType, setVehicleType] = useState("");
    const [driverImage, setDriverImage] = useState<ImagePicker.ImagePickerAsset | null>(null);
    const [aadharImage, setAadharImage] = useState<ImagePicker.ImagePickerAsset | null>(null);
    const [licenseImage, setLicenseImage] = useState<ImagePicker.ImagePickerAsset | null>(null);

    const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false)
    const [loading, setLoading] = useState(false);
    const [stateList, setStateList] = useState<StateType[]>([]);
    const [cityList, setCityList] = useState<CityType[]>([]);
    const [stateDropdownData, setStateDropdownData] = useState<DropdownItem[]>([]);
    const [cityDropdownData, setCityDropdownData] = useState<DropdownItem[]>([]);
    const { apiCaller, setRefresh } = useGlobalContext();

    useEffect(() => {
        const states = State.getStatesOfCountry("IN");
        setStateList(states);
        setStateDropdownData(states.map(state => ({
            label: state.name,
            value: state.isoCode
        })));
    }, []);

    useEffect(() => {
        if (state) {
            const cities = City.getCitiesOfState("IN", state);
            setCityList(cities);
            setCityDropdownData(cities.map(city => ({
                label: city.name,
                value: city.name
            })));
        }
    }, [state]);

    const handleAddDriver = async () => {
        if (!name || !mobile || !password || !city || !state || !vehicleType) {
            Alert.alert("Please fill all fields and provide images.");
            return;
        }

        if (mobile.length < 10 || mobile.length > 12) {
            Alert.alert("Please provide a valid mobile number");
            return;
        }

        if (mobile.length < 5) {
            Alert.alert("Password must contain atleast 5 characters");
            return;
        }

        const formData = new FormData();
        formData.append('name', name);
        formData.append('mobileNumber', mobile);
        formData.append('password', password);
        formData.append('city', city);
        formData.append('state', state);
        formData.append('vehicleType', vehicleType);

        if (driverImage) {
            formData.append('photo', {
                uri: driverImage.uri,
                type: 'image/jpeg',
                name: 'driver_photo.jpg'
            } as any);
        }

        if (aadharImage) {
            formData.append('aadharCard', {
                uri: aadharImage.uri,
                type: 'image/jpeg',
                name: 'aadhar_card.jpg'
            } as any);
        }

        if (licenseImage) {
            formData.append('license', {
                uri: licenseImage.uri,
                type: 'image/jpeg',
                name: 'driver_license.jpg'
            } as any);
        }
            
        console.log(formData);

        setLoading(true);
        try {
            await apiCaller.post('/api/driver', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setLoading(false);
            setRefresh(prev => !prev);
            resetForm();
            Alert.alert("Success", "Driver added successfully!");
            router.back();
        } catch (error: any) {
            console.log(error.response?.data || error.message || error);
            setLoading(false);
            Alert.alert("Error", "Could not create driver. Please check your data or try again later");
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
                        <Dropdown
                            style={styles.dropdown}
                            placeholderStyle={styles.placeholderStyle}
                            selectedTextStyle={styles.selectedTextStyle}
                            inputSearchStyle={styles.inputSearchStyle}
                            iconStyle={styles.iconStyle}
                            data={stateDropdownData}
                            search
                            maxHeight={300}
                            labelField="label"
                            valueField="value"
                            placeholder="Select state"
                            searchPlaceholder="Search..."
                            value={state}
                            onChange={item => {
                                setState(item.value);
                            }}
                        />
                    </View>
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>City</Text>
                        <Dropdown
                            style={styles.dropdown}
                            placeholderStyle={styles.placeholderStyle}
                            selectedTextStyle={styles.selectedTextStyle}
                            inputSearchStyle={styles.inputSearchStyle}
                            iconStyle={styles.iconStyle}
                            data={cityDropdownData}
                            search
                            maxHeight={300}
                            labelField="label"
                            valueField="value"
                            placeholder="Select city"
                            searchPlaceholder="Search..."
                            value={city}
                            onChange={item => {
                                setCity(item.value);
                            }}
                        />
                    </View>
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Vehicle Type</Text>
                        <Dropdown
                            style={styles.dropdown}
                            placeholderStyle={styles.placeholderStyle}
                            selectedTextStyle={styles.selectedTextStyle}
                            inputSearchStyle={styles.inputSearchStyle}
                            iconStyle={styles.iconStyle}
                            data={[
                                { label: 'ALL', value: 'ALL' },
                                { label: 'CAR', value: 'CAR' },
                                { label: 'TRUCK', value: 'TRUCK' },
                                { label: 'BUS', value: 'BUS' },
                                { label: 'TEMPO TRAVELLER', value: 'TAMPO' },
                            ]}
                            maxHeight={300}
                            labelField="label"
                            valueField="value"
                            placeholder="Select vehicle type"
                            value={vehicleType}
                            onChange={item => {
                                setVehicleType(item.value);
                            }}
                        />
                    </View>

                    <TouchableOpacity style={styles.imagePicker} onPress={() => handleImagePicker("driver")}>
                        <Text style={styles.imagePickerText}>Select Driver Image</Text>
                    </TouchableOpacity>
                    {driverImage && <Image source={{ uri: driverImage.uri }} style={styles.previewImage} />}

                    <TouchableOpacity style={styles.imagePicker} onPress={() => handleImagePicker("aadhar")}>
                        <Text style={styles.imagePickerText}>Select Aadhar Card Image</Text>
                    </TouchableOpacity>
                    {aadharImage && <Image source={{ uri: aadharImage.uri }} style={styles.previewImage} />}

                    <TouchableOpacity style={styles.imagePicker} onPress={() => handleImagePicker("license")}>
                        <Text style={styles.imagePickerText}>Select Driver License Image</Text>
                    </TouchableOpacity>
                    {licenseImage && <Image source={{ uri: licenseImage.uri }} style={styles.previewImage} />}

                    <View style={styles.buttonContainer}>
                        <TouchableOpacity
                            style={[styles.button, { backgroundColor: Colors.darkBlue }]}
                            onPress={handleAddDriver}
                        >
                            {loading ? (
                                <ActivityIndicator color="#fff" />
                            ) : (
                                <Text style={[styles.buttonText, { color: "#fff" }]}>Submit</Text>
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
    dropdown: {
        height: 50,
        borderColor: Colors.secondary,
        borderWidth: 1,
        borderRadius: 10,
        paddingHorizontal: 8,
    },
    placeholderStyle: {
        fontSize: 16,
        color: Colors.secondary,
    },
    selectedTextStyle: {
        fontSize: 16,
    },
    iconStyle: {
        width: 20,
        height: 20,
    },
    inputSearchStyle: {
        height: 40,
        fontSize: 16,
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