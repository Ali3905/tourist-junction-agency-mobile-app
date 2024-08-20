import React, { useState } from "react";
import {
    View,
    StyleSheet,
    Text,
    Image,
    TextInput,
    SafeAreaView,
    ScrollView,
    Platform,
    Alert,
    ActivityIndicator,
    TouchableOpacity
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Colors } from "@/constants/Colors";
//@ts-ignore
import RadioButtonGroup, { RadioButtonItem } from "expo-radio-button";
import { useGlobalContext } from "@/context/GlobalProvider";
import { router } from "expo-router";

const AddCarScreen: React.FC = () => {
    const [vehicleNo, setVehicleNo] = useState("");
    const [seatingCapacity, setSeatingCapacity] = useState("");
    const [vehicleModel, setVehicleModel] = useState("");
    const [location, setLocation] = useState("");
    const [carName, setCarName] = useState("");
    const [contactNo, setContactNo] = useState("");
    const [selectedAC, setSelectedAC] = useState<string | null>(null);
    const [selectedForRent, setSelectedForRent] = useState<boolean>(false);
    const [selectedForSell, setSelectedForSell] = useState<boolean>(false);
    const [carImages, setCarImages] = useState<ImagePicker.ImagePickerAsset[]>([]);
    const [loading, setLoading] = useState(false);
    const { apiCaller, setRefresh } = useGlobalContext();

    const handleAddCar = async () => {
        if (!vehicleNo || !seatingCapacity || !vehicleModel || !location || !carName || !contactNo || carImages.length === 0) {
            Alert.alert("Please fill all fields and upload car images.");
            return;
        }

        const formData = new FormData();
        formData.append('number', vehicleNo);
        formData.append('seatingCapacity', seatingCapacity);
        formData.append('model', vehicleModel);
        formData.append('location', location);
        formData.append('contactNumber', contactNo);
        formData.append('isAC', selectedAC === "AC" ? 'true' : 'false');
        formData.append('isForRent', selectedForRent ? 'true' : 'false');
        formData.append('isForSell', selectedForSell ? 'true' : 'false');
        formData.append('type', "CAR");
        formData.append('name', carName);

        carImages.forEach((image, index) => {
            formData.append('photos', {
                uri: image.uri,
                type: 'image/jpeg',
                name: `photo${index}.jpg`
            } as any);
        });

        setLoading(true);
        try {
            await apiCaller.post('/api/vehicle', formData, { 
                headers: { 
                    'Content-Type': 'multipart/form-data'
                } 
            });
            setLoading(false);
            setRefresh(prev => !prev);
            resetForm();
            Alert.alert("Success", "Car added successfully!");
            router.back();
        } catch (error) {
            console.log(error);
            setLoading(false);
            Alert.alert("Error", "Failed to add car. Please try again.");
        }
    };

    const handleImagePicker = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsMultipleSelection: true,
            quality: 1,
        });

        if (!result.canceled) {
            setCarImages(result.assets);
        }
    };

    const resetForm = () => {
        setVehicleNo("");
        setSeatingCapacity("");
        setVehicleModel("");
        setLocation("");
        setCarName("");
        setContactNo("");
        setSelectedAC(null);
        setSelectedForRent(false);
        setSelectedForSell(false);
        setCarImages([]);
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Vehicle No</Text>
                        <TextInput
                            style={styles.input}
                            value={vehicleNo}
                            onChangeText={(text) => setVehicleNo(text)}
                        />
                        <Text style={styles.vehicleNumberLabel}>"If your vehicle is to be sold to other vehicle owners or is to be given on rent, then you will have to fill the option given below."</Text>
                    </View>
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Seating Capacity</Text>
                        <TextInput
                            style={styles.input}
                            value={seatingCapacity}
                            onChangeText={(text) => setSeatingCapacity(text)}
                            keyboardType="numeric"
                        />
                    </View>
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Vehicle Model</Text>
                        <TextInput
                            style={styles.input}
                            value={vehicleModel}
                            onChangeText={(text) => setVehicleModel(text)}
                        />
                    </View>
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Location</Text>
                        <TextInput
                            style={styles.input}
                            value={location}
                            onChangeText={(text) => setLocation(text)}
                        />
                    </View>
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Car Name</Text>
                        <TextInput
                            style={styles.input}
                            value={carName}
                            onChangeText={(text) => setCarName(text)}
                        />
                    </View>
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Contact No</Text>
                        <TextInput
                            style={styles.input}
                            value={contactNo}
                            onChangeText={(text) => setContactNo(text)}
                            keyboardType="phone-pad"
                        />
                    </View>

                    {/* AC/Non-AC RadioButtonGroup */}
                    <View style={styles.featuresContainer}>
                        <RadioButtonGroup
                            containerStyle={styles.radioButtonGroup}
                            selected={selectedAC}
                            onSelected={(value: string) => setSelectedAC(value)}
                            radioBackground={Colors.darkBlue}
                        >
                            <RadioButtonItem value="AC" label={<Text style={{ color: Colors.primary, fontWeight: "500" }}>AC</Text>} style={styles.radioButtonItem} />
                            <RadioButtonItem value="NonAC" label={<Text style={{ color: Colors.primary, fontWeight: "500" }}>Non-AC</Text>} style={styles.radioButtonItem} />
                        </RadioButtonGroup>
                    </View>

                    {/* For Rent/For Sell Checkboxes */}
                    <View style={styles.featuresContainer}>
                        <TouchableOpacity
                            style={[styles.checkboxContainer, { backgroundColor: selectedForRent ? Colors.darkBlue : Colors.secondary }]}
                            onPress={() => setSelectedForRent(!selectedForRent)}
                        >
                            <Text style={styles.checkboxText}>For Rent</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.checkboxContainer, { backgroundColor: selectedForSell ? Colors.darkBlue : Colors.secondary }]}
                            onPress={() => setSelectedForSell(!selectedForSell)}
                        >
                            <Text style={styles.checkboxText}>For Sell</Text>
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity style={styles.imagePicker} onPress={handleImagePicker}>
                        <Text style={styles.imagePickerText}>Upload Car Images (Max 5)</Text>
                    </TouchableOpacity>
                    <View style={styles.imagePreviewContainer}>
                        {carImages.map((image, index) => (
                            <Image key={index} source={{ uri: image.uri }} style={styles.previewImage} />
                        ))}
                    </View>

                    <View style={styles.modalButtons}>
                        <TouchableOpacity
                            style={[styles.modalButton, { backgroundColor: Colors.darkBlue }]}
                            onPress={handleAddCar}
                        >
                            {loading ? (
                                <ActivityIndicator color="#fff" />
                            ) : (
                                <Text style={[styles.modalButtonText, { color: "#fff" }]}>Submit</Text>
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
    featuresContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        backgroundColor: Colors.secondary,
        padding: 10,
        borderRadius: 10,
        marginBottom: 15,
    },
    radioButtonGroup: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent:"space-around",
        width:"100%"
    },
    radioButtonItem: {
        borderColor: Colors.secondary,
        backgroundColor: "white",
        color: Colors.darkBlue,
    },
    checkboxContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        padding: 10,
        borderRadius: 5,
        marginHorizontal: 5,
    },
    checkboxText: {
        color: Colors.primary,
        fontWeight: "500",
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
    imagePreviewContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
    },
    previewImage: {
        width: "48%",
        height: 100,
        borderRadius: 10,
        marginBottom: 10,
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
    vehicleNumberLabel: {
        fontSize: 12,
        color: Colors.primary,
        marginTop: 5,
    },
});

export default AddCarScreen;