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
import { Picker } from "@react-native-picker/picker";
import DateTimePicker from '@react-native-community/datetimepicker';
import { GestureHandlerRootView, TextInput } from "react-native-gesture-handler";
import { router } from "expo-router";
import tw from 'twrnc'

const AddServiceHistoryScreen: React.FC = () => {
    const [garageName, setGarageName] = useState("");
    const [garageNumber, setGarageNumber] = useState("");
    const [date, setDate] = useState<Date | undefined>(undefined);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [workDescription, setWorkDescription] = useState("");
    const [vehicleNumber, setVehicleNumber] = useState("");
    const [billImages, setBillImages] = useState<ImagePicker.ImagePickerAsset[]>([]);
    const [loading, setLoading] = useState(false);
    const [vehicleNumbers, setVehicleNumbers] = useState<{ id: string, number: string }[]>([]);
    const [inputHeight, setInputHeight] = useState(100);
    const { apiCaller, setRefresh } = useGlobalContext();

    const extractNumbers = (data: Vehicle[]): { id: string, number: string }[] => {
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

    const onChangeDate = (event: any, selectedDate?: Date) => {
        setShowDatePicker(false);
        if (selectedDate) {
            setDate(selectedDate);
        }
    };

    const formatDate = (date: Date): string => {
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear().toString().slice(-2);
        return `${day}/${month}/${year}`;
    };

    const handleAddServiceHistory = async () => {
        if (!garageName || !garageNumber || !date || !workDescription || !vehicleNumber || billImages.length === 0) {
            Alert.alert("Please fill all fields and provide at least one bill image.");
            return;
        }

        const formData = new FormData();
        formData.append('garageName', garageName);
        formData.append('garageNumber', garageNumber);
        formData.append('date', date.toISOString());
        formData.append('workDescription', workDescription);
        formData.append('vehicleNumber', vehicleNumber);

        billImages.forEach((image, index) => {
            if (!image.uri) return;
            formData.append('bill', {
                uri: image.uri,
                type: 'image/jpeg',
                name: `photo${index}.jpg`
            } as any);
        });

        setLoading(true);
        try {
            await apiCaller.post('/api/service', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
            setLoading(false);
            setRefresh(prev => !prev);
            resetForm();
            Alert.alert("Success", "Service history added successfully!");
            router.back();
        } catch (error) {
            console.log(error);
            setLoading(false);
            Alert.alert("Error", "Failed to add service history. Please try again.");
        }
    };

    const handleImagePicker = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsMultipleSelection: true,
            selectionLimit: 5,
            quality: .7,
        });

        if (!result.canceled) {
            setBillImages(result.assets);
        }
    };

    const resetForm = () => {
        setGarageName("");
        setGarageNumber("");
        setDate(undefined);
        setWorkDescription("");
        setVehicleNumber("");
        setBillImages([]);
    };

    return (
        <GestureHandlerRootView style={{ flex: 1 }} >
            <SafeAreaView style={styles.container}>
                <ScrollView style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Vehicle Number</Text>
                            <View style={tw`border-secondary border border-[#C0C0C0] rounded-lg overflow-hidden`}>
                                <Picker
                                    selectedValue={vehicleNumber}
                                    onValueChange={(itemValue) => setVehicleNumber(itemValue)}
                                    style={tw`text-sm text-black h-14 p-4 sm:p-6 md:p-8 bg-white`}  // Responsive padding, font size, height, and background color
                                    itemStyle={tw`text-black`} // Ensures items have correct text color
                                >
                                    <Picker.Item label="Select Vehicle Number" value="" />
                                    {vehicleNumbers.map((number, index) => (
                                        <Picker.Item key={index} label={number.number} value={number.number} />
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
                                style={styles.input}
                                onPress={() => setShowDatePicker(true)}
                            >
                                <Text>{date ? formatDate(date) : "Select Date"}</Text>
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
                        <View style={styles.imagePreviewContainer}>
                            {billImages.map((image, index) => (
                                <Image key={index} source={{ uri: image.uri }} style={styles.previewImage} />
                            ))}
                        </View>

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
        padding: 10,
        backgroundColor: "#ffffff",
    },
    modalContainer: {
        flex: 1,
        paddingTop: Platform.OS === 'android' ? 20 : 0,
        paddingHorizontal: 10,
    },
    modalContent: {
        backgroundColor: "#fff",
        borderRadius: 10,
        elevation: 5,
        padding:20
    },
    inputGroup: {
        marginBottom: 15,
    },
    label: {
        marginBottom: 5,
        fontSize: 13,
        color: '#000000',
        fontWeight: "500"
    },
    input: {
        borderColor: '#C0C0C0',
        borderWidth: 1,
        borderRadius: 10,
        paddingHorizontal: 10,
        height: 40,
        justifyContent: 'center'
    },
    textarea: {
        minHeight: 100,
        maxHeight: 300,
        textAlignVertical: 'top',
        paddingTop: 10,
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
});

export default AddServiceHistoryScreen;