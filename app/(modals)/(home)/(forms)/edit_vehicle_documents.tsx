import React, { useEffect, useState } from "react";
import {
    View,
    StyleSheet,
    Text,
    SafeAreaView,
    ScrollView,
    Platform,
    Alert,
    ActivityIndicator,
    TouchableOpacity,
    Image
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Colors } from "@/constants/Colors";
import { useGlobalContext } from "@/context/GlobalProvider";
import { router } from "expo-router";
import { Picker } from '@react-native-picker/picker';

const EditVehicleDocumentsScreen: React.FC = () => {
    const [vehicleId, setVehicleId] = useState("");
    const [rcImage, setRcImage] = useState<ImagePicker.ImagePickerAsset | null>(null);
    const [insuranceImage, setInsuranceImage] = useState<ImagePicker.ImagePickerAsset | null>(null);
    const [permitImage, setPermitImage] = useState<ImagePicker.ImagePickerAsset | null>(null);
    const [fitnessImage, setFitnessImage] = useState<ImagePicker.ImagePickerAsset | null>(null);
    const [taxImage, setTaxImage] = useState<ImagePicker.ImagePickerAsset | null>(null);
    const [pucImage, setPucImage] = useState<ImagePicker.ImagePickerAsset | null>(null);
    const [loading, setLoading] = useState(false);
    const [vehicleNumbers, setVehicleNumbers] = useState<{ id: string, number: string }[]>([]);
    const { apiCaller, editData, setRefresh } = useGlobalContext();

    const extractNumbers = (data: any[]): { id: string, number: string }[] => {
        return data.map(vehicle => ({ id: vehicle._id, number: vehicle.number }));
    };

    const fetchVehicles = async () => {
        try {
            setLoading(true);
            const response = await apiCaller.get('/api/vehicle');
            setVehicleNumbers(extractNumbers(response.data.data.vehicles));
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchVehicles();
    }, []);

    useEffect(() => {
        if (editData) {
            setVehicleId(editData._id);
            setRcImage({uri:editData.RC});
            setInsuranceImage({uri:editData.insurance});
            setPermitImage({uri:editData.permit});
            setFitnessImage({uri:editData.fitness});
            setTaxImage({uri:editData.tax});
            setPucImage({uri:editData.PUC});
        }
    }, [editData])

    const handleAddVehicleDocuments = async () => {
        if (!vehicleId || !rcImage || !insuranceImage || !permitImage || !fitnessImage || !taxImage || !pucImage) {
            Alert.alert("Please fill all fields and upload all documents.");
            return;
        }

        const formData = new FormData();
        formData.append('RC', {
            uri: rcImage.uri,
            type: 'image/jpeg',
            name: 'rc.jpg',
        } as any);
        formData.append('insurance', {
            uri: insuranceImage.uri,
            type: 'image/jpeg',
            name: 'insurance.jpg',
        } as any);
        formData.append('permit', {
            uri: permitImage.uri,
            type: 'image/jpeg',
            name: 'permit.jpg',
        } as any);
        formData.append('fitness', {
            uri: fitnessImage.uri,
            type: 'image/jpeg',
            name: 'fitness.jpg',
        } as any);
        formData.append('tax', {
            uri: taxImage.uri,
            type: 'image/jpeg',
            name: 'tax.jpg',
        } as any);
        formData.append('PUC', {
            uri: pucImage.uri,
            type: 'image/jpeg',
            name: 'puc.jpg',
        } as any);

        setLoading(true);
        try {
            await apiCaller.patch(`/api/vehicle/addDocuments?vehicleId=${vehicleId}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            setLoading(false);
            setRefresh(prev => !prev)
            resetForm();
            Alert.alert("Success", "Vehicle documents added successfully!");
            router.back()
        } catch (error) {
            console.error(error);
            setLoading(false);
            Alert.alert("Error", "Failed to add vehicle documents. Please try again.");
        }
    };

    const handleImagePicker = async (setImage: React.Dispatch<React.SetStateAction<ImagePicker.ImagePickerAsset | null>>) => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsMultipleSelection: false,
            quality: 1,
        });

        if (!result.canceled) {
            setImage(result.assets[0]);
        }
    };

    const resetForm = () => {
        setVehicleId("");
        setRcImage(null);
        setInsuranceImage(null);
        setPermitImage(null);
        setFitnessImage(null);
        setTaxImage(null);
        setPucImage(null);
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Vehicle Number</Text>
                        <View style={styles.pickerContainer}>
                            <Picker
                                selectedValue={vehicleId}
                                onValueChange={(itemValue) => setVehicleId(itemValue)}
                                style={styles.picker}
                            >
                                <Picker.Item label="Select Vehicle" value="" />
                                {vehicleNumbers.map((vehicle, index) => (
                                    <Picker.Item key={index} label={vehicle.number} value={vehicle.id} />
                                ))}
                            </Picker>
                        </View>
                    </View>

                    <View style={styles.inputGroup}>
                        <TouchableOpacity
                            style={styles.imagePicker}
                            onPress={() => handleImagePicker(setRcImage)}
                        >
                            <Text style={styles.imagePickerText}>Upload RC</Text>
                        </TouchableOpacity>
                        {rcImage && <Image source={{ uri: rcImage.uri }} style={styles.previewImage} />}
                    </View>

                    <View style={styles.inputGroup}>
                        <TouchableOpacity
                            style={styles.imagePicker}
                            onPress={() => handleImagePicker(setInsuranceImage)}
                        >
                            <Text style={styles.imagePickerText}>Upload Insurance</Text>
                        </TouchableOpacity>
                        {insuranceImage && <Image source={{ uri: insuranceImage.uri }} style={styles.previewImage} />}
                    </View>

                    <View style={styles.inputGroup}>
                        <TouchableOpacity
                            style={styles.imagePicker}
                            onPress={() => handleImagePicker(setPermitImage)}
                        >
                            <Text style={styles.imagePickerText}>Upload Permit</Text>
                        </TouchableOpacity>
                        {permitImage && <Image source={{ uri: permitImage.uri }} style={styles.previewImage} />}
                    </View>

                    <View style={styles.inputGroup}>
                        <TouchableOpacity
                            style={styles.imagePicker}
                            onPress={() => handleImagePicker(setFitnessImage)}
                        >
                            <Text style={styles.imagePickerText}>Upload Fitness</Text>
                        </TouchableOpacity>
                        {fitnessImage && <Image source={{ uri: fitnessImage.uri }} style={styles.previewImage} />}
                    </View>

                    <View style={styles.inputGroup}>
                        <TouchableOpacity
                            style={styles.imagePicker}
                            onPress={() => handleImagePicker(setTaxImage)}
                        >
                            <Text style={styles.imagePickerText}>Upload Tax</Text>
                        </TouchableOpacity>
                        {taxImage && <Image source={{ uri: taxImage.uri }} style={styles.previewImage} />}
                    </View>

                    <View style={styles.inputGroup}>
                        <TouchableOpacity
                            style={styles.imagePicker}
                            onPress={() => handleImagePicker(setPucImage)}
                        >
                            <Text style={styles.imagePickerText}>Upload PUC</Text>
                        </TouchableOpacity>
                        {pucImage && <Image source={{ uri: pucImage.uri }} style={styles.previewImage} />}
                    </View>

                    <View style={styles.modalButtons}>
                        <TouchableOpacity
                            style={[styles.modalButton, { backgroundColor: Colors.darkBlue }]}
                            onPress={handleAddVehicleDocuments}
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
    pickerContainer: {
        borderColor: Colors.secondary,
        borderWidth: 1,
        borderRadius: 10,
        overflow: 'hidden',
    },
    picker: {
        height: 40,
        width: '100%',
        marginTop: -6,
        marginBottom: 6
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
});

export default EditVehicleDocumentsScreen;