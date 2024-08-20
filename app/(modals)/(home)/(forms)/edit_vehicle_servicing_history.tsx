import React, { useEffect, useState } from "react";
import {
    View,
    StyleSheet,
    TouchableOpacity,
    Text,
    Image,
    SafeAreaView,
    ScrollView,
    Platform,
    Alert,
    ActivityIndicator
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Colors } from "@/constants/Colors";
import { useGlobalContext } from "@/context/GlobalProvider";
import DateTimePicker from '@react-native-community/datetimepicker';
import { GestureHandlerRootView, TextInput } from "react-native-gesture-handler";
import { router } from "expo-router";
import { Picker } from '@react-native-picker/picker';

const AddServiceHistoryScreen: React.FC = () => {
    const [garageName, setGarageName] = useState("");
    const [garageNumber, setGarageNumber] = useState("");
    const [date, setDate] = useState<Date | undefined>(undefined);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [workDescription, setWorkDescription] = useState("");
    const [vehicleId, setVehicleId] = useState("");
    const [billImages, setBillImages] = useState<ImagePicker.ImagePickerAsset[]>([]);
    const [loading, setLoading] = useState(false);
    const [inputHeight, setInputHeight] = useState(100);
    const [vehicleNumbers, setVehicleNumbers] = useState<{ id: string, number: string }[]>([]);
    const { apiCaller, editData, setRefresh } = useGlobalContext();

    const findVehicleByNumber = (number: string) => {
        return vehicleNumbers.find(vehicle => vehicle.id === number);
    };

    useEffect(() => {
        fetchVehicles();
    }, []);

    useEffect(() => {
        if (editData) {
            setGarageName(editData.garageName);
            setGarageNumber(editData.garageNumber);
            setDate(new Date(editData.date));
            setWorkDescription(editData.workDescription);
            setVehicleId(editData.vehicle);
            setBillImages(editData.bill || []);
        }
    }, [editData])

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

    const onChangeDate = (event: any, selectedDate?: Date) => {
        setShowDatePicker(false);
        if (selectedDate) {
            setDate(selectedDate);
        }
    };

    const handleAddServiceHistory = async () => {
        if (!garageName || !garageNumber || !date || !workDescription || !vehicleId || billImages.length === 0) {
            Alert.alert("Please fill all fields and provide at least one bill image.");
            return;
        }

        const formData = new FormData();
        formData.append('garageName', garageName);
        formData.append('garageNumber', garageNumber);
        formData.append('date', date.toISOString().split('T')[0]);
        formData.append('workDescription', workDescription);
        formData.append('vehicleId', vehicleId);

        billImages.forEach((image, index) => {
            formData.append('bill', {
                uri: image.uri,
                type: 'image/jpeg',
                name: `bill${index}.jpg`
            } as any);
        });

        setLoading(true);
        try {
            await apiCaller.patch(`/api/service?serviceId=${editData._id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
            setLoading(false);
            setRefresh(prev => !prev);
            router.back();
            Alert.alert("Success", "Service history updated successfully!");
        } catch (error) {
            console.log(error);
            setLoading(false);
            Alert.alert("Error", "Failed to add service history. Please try again.");
        }
    };

    const handleImagePicker = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: false,
            aspect: [4, 3],
            quality: 1,
            allowsMultipleSelection: true,
        });

        if (!result.canceled) {
            setBillImages(result.assets);
        }
    };

    const removeImage = (index: number) => {
        setBillImages(prevImages => prevImages.filter((_, i) => i !== index));
    };

    return (
        <GestureHandlerRootView style={{ flex: 1 }} >
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
                                    <Picker.Item label={findVehicleByNumber(vehicleId)?.number} value={vehicleId} />
                                    {vehicleNumbers.map((vehicle, index) => (
                                        <Picker.Item key={index} label={vehicle.number} value={vehicle.id} />
                                    ))}
                                </Picker>
                            </View>
                        </View>
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Garage Name</Text>
                            <TextInput
                                style={styles.input}
                                value={garageName}
                                onChangeText={(text) => setGarageName(text)}
                            />
                        </View>
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Garage Number</Text>
                            <TextInput
                                style={styles.input}
                                value={garageNumber}
                                onChangeText={(text) => setGarageNumber(text)}
                                keyboardType="phone-pad"
                            />
                        </View>
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Date</Text>
                            <TouchableOpacity
                                style={[styles.input, { paddingBottom: -8, paddingTop: 8 }]}
                                onPress={() => setShowDatePicker(true)}
                            >
                                <Text>{date ? date.toDateString() : "Select Date"}</Text>
                            </TouchableOpacity>
                            {showDatePicker && (
                                <DateTimePicker
                                    value={date || new Date()}
                                    mode="date"
                                    display="default"
                                    onChange={onChangeDate}
                                />
                            )}
                        </View>
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Work Description</Text>
                            <TextInput
                                style={[styles.input, styles.textarea, { height: Math.max(100, inputHeight) }]}
                                value={workDescription}
                                onChangeText={(text) => setWorkDescription(text)}
                                multiline={true}
                                onContentSizeChange={(event) => {
                                    setInputHeight(event.nativeEvent.contentSize.height);
                                }}
                            />
                        </View>
                        <TouchableOpacity style={styles.imagePicker} onPress={handleImagePicker}>
                            <Text style={styles.imagePickerText}>Select Bill Images</Text>
                        </TouchableOpacity>
                        {billImages.map((image, index) => (
                            <View key={index} style={styles.imageContainer}>
                                <Image source={{ uri: image.uri }} style={styles.previewImage} />
                                <TouchableOpacity style={styles.removeButton} onPress={() => removeImage(index)}>
                                    <Text style={styles.removeButtonText}>Remove</Text>
                                </TouchableOpacity>
                            </View>
                        ))}

                        <View style={styles.modalButtons}>
                            <TouchableOpacity
                                style={[styles.modalButton, { backgroundColor: Colors.darkBlue }]}
                                onPress={handleAddServiceHistory}
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
        </GestureHandlerRootView>
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
    imageContainer: {
        marginBottom: 15,
    },
    previewImage: {
        width: "100%",
        height: 200,
        borderRadius: 10,
    },
    removeButton: {
        backgroundColor: 'red',
        padding: 5,
        borderRadius: 5,
        alignItems: 'center',
        marginTop: 5,
    },
    removeButtonText: {
        color: '#fff',
        fontWeight: 'bold',
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
    textarea: {
        minHeight: 100,
        maxHeight: 300,
        textAlignVertical: 'top',
        paddingTop: 10,
    },
});

export default AddServiceHistoryScreen;