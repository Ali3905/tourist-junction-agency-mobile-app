import React, { useEffect, useState } from "react";
import {
    View,
    StyleSheet,
    TouchableOpacity,
    Text,
    SafeAreaView,
    ScrollView,
    Platform,
    Alert,
    ActivityIndicator,
    Image
} from "react-native";
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Colors } from "@/constants/Colors"; // Replace with your colors constant
import { useGlobalContext } from "@/context/GlobalProvider"; // Ensure you have this hook or context
import { GestureHandlerRootView, TextInput } from "react-native-gesture-handler";
import { router } from "expo-router";
import RadioButtonGroup, { RadioButtonItem } from "expo-radio-button";
import * as ImagePicker from "expo-image-picker";
import tw from 'twrnc'


const AddRouteScreen: React.FC = () => {
    // const [busImages, setBusImages] = useState<ImagePicker.ImagePickerAsset[]>([]);
    const [vehicleNumber, setVehicleNumber] = useState<string>("");
    const [departurePlace, setDeparturePlace] = useState<string>("");
    const [destinationPlace, setDestinationPlace] = useState<string>("");
    const [departureTime, setDepartureTime] = useState<Date>();
    const [arrivalTime, setArrivalTime] = useState<Date>()
    const [pickupPoint, setPickupPoint] = useState<string>("")
    const [dropoffPoint, setDropoffPoint] = useState<string>("")
    const [ticketFare, setTicketFare] = useState<number>(0)
    // const [isAC, setIsAC] = useState<string>("false")
    // const [isSleeper, setIsSleeper] = useState<string>("false")
    const [doesCarryTwoWheelers, setDoesCarryTwoWheelers] = useState<string>("false")
    const [doesProvideCourierService, setDoesProvideCourierService] = useState<string>("false")
    const [doesBookTrainTickets, setDoesBookTrainTickets] = useState<string>("false")
    const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
    const [phonePeName, setPhonePeName] = useState<string>("")
    const [phonePeNumber, setPhonePeNumber] = useState<number | undefined>(0)
    const [discount, setDiscount] = useState<number>("")
    const [officeAddress, setOfficeAddress] = useState<string>("")
    const [QR, setQR] = useState<ImagePicker.ImagePickerAsset | null>(null)
    const [seatingArrangement, setSeatingArrangement] = useState<ImagePicker.ImagePickerAsset | null>(null)
    const [mobileNumbers, setMobileNumbers] = useState({
        mobileNumber1: "",
        mobileNumber2: "",
        mobileNumber3: "",
        mobileNumber4: "",
    })

    const [showDepartureTimePicker, setShowDepartureTimePicker] = useState<boolean>(false);
    const [showArrivalTimePicker, setShowArrivalTimePicker] = useState<boolean>(false);

    const [vehicleNumbers, setVehicleNumbers] = useState<{ id: string, number: string }[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const { apiCaller, setRefresh } = useGlobalContext();
    const [selectedOption, setSelectedOption] = useState(null);


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

    const handleAddRoute = async () => {
        if (!vehicleNumber || !departureTime || !arrivalTime) {
            Alert.alert("Please fill the compulsory fields fields.");
            return;
        }

        const formData = new FormData()

        formData.append("vehicleNo", vehicleNumber)
        formData.append("departurePlace", departurePlace)
        formData.append("destinationPlace", destinationPlace)
        formData.append("departureTime", departureTime?.toISOString())
        formData.append("arrivalTime", arrivalTime?.toISOString())
        formData.append("pickupPoint", pickupPoint)
        formData.append("dropoffPoint", dropoffPoint)
        formData.append("ticketFare", ticketFare)
        formData.append("discount", discount)
        formData.append("phonepeName", phonePeName)
        formData.append("phonepeNumber", phonePeNumber)
        formData.append("officeAddress", officeAddress)
        // formData.append("isAC", isAC || "false")
        // formData.append("isSleeper", isSleeper || "false")
        formData.append("doesCarryTwoWheelers", doesCarryTwoWheelers || "false")
        formData.append("doesProvideCourierService", doesProvideCourierService || "false")
        formData.append("doesBookTrainTickets", doesBookTrainTickets || "false")

        Object.keys(mobileNumbers).map((key) => {
            if (mobileNumbers[key] === "") return;
            formData.append("mobileNumbers", mobileNumbers[key])
        })

        // busImages.forEach((image, index) => {
        //     ImageResizer.createResizedImage(image.uri, 200, 300, "JPEG", 60, 0).then(
        //         (response: any) => {
        //           let cleanUri =
        //             Platform.OS === "ios"
        //               ? response.uri.replace("file:/", "")
        //               : response.uri;
        //         //   data.append("image", {
        //         //     uri: cleanUri,
        //         //     name: "userImage.jpeg",
        //         //     type: "image/jpeg",
        //         //   });
        //         formData.append('busPhotos', {
        //             uri: cleanUri,
        //             type: 'image/jpeg',
        //             name: `photo${index}.jpg`
        //         } as any);
        //   }  ) .catch((err : any) => {
        //     Alert.alert("Somethng went wrong while uploading bus images", err.message)
        //   });
        //     formData.append('busPhotos', {
        //         uri: image.uri,
        //         type: 'image/jpeg',
        //         name: `photo${index}.jpg`
        //     } as any);
        // });
        // return;


        selectedAmenities.forEach((amenity) => {
            formData.append("amenities", amenity as string)
        })


        formData.append("QR", QR ? {
            uri: QR.uri,
            type: 'image/jpeg',
            name: `photo${1}.jpg`
        } as any : undefined)

        formData.append("seatingArrangement", seatingArrangement ? {
            uri: seatingArrangement.uri,
            type: 'image/jpeg',
            name: `photo${2}.jpg`
        } as any : undefined)


        setLoading(true);
        try {
            const res = await apiCaller.post('/api/busRoute', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            console.log(res);

            setLoading(false);
            setRefresh(prev => !prev)
            resetForm();
            Alert.alert("Success", "Route added successfully!");
            router.back()
        } catch (error) {
            console.log(error);
            setLoading(false);
            Alert.alert("Error", "Failed to add route. Please try again.");
        }
    };

    const handleImagePicker = async (type: "busPhotos" | "QR" | "seatingArrangement") => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsMultipleSelection: type === "busPhotos" ? true : false,
            quality: .7,
        });

        if (!result.canceled && result.assets) {
            if (type === "QR") {
                setQR(result.assets[0])
            } else if (type === "seatingArrangement") {
                setSeatingArrangement(result.assets[0])
            }
        }
    };



    const resetForm = () => {
        setVehicleNumber("");
        setDeparturePlace("");
        setDestinationPlace("");
        setDepartureTime(undefined);
    };



    // const onChangeTime = (event: any, selectedTime?: Date) => {
    //     onChange(event, selectedTime, setDepartureTime, setShowTimePicker);
    // };

    const toggleSelectAmenity = (name: string) => {
        setSelectedAmenities(prevSelected =>
            prevSelected.includes(name)
                ? prevSelected.filter(amenityName => amenityName !== name)
                : [...prevSelected, name]
        );
    };



    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <SafeAreaView style={styles.container}>
                <ScrollView style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Vehicle Number</Text>
                            <View style={tw`border-secondary border border-[#C0C0C0] rounded-lg overflow-hidden`}>
                                    <Picker
                                        selectedValue={vehicleNumber}
                                        onValueChange={(itemValue) => setVehicleNumber(itemValue)}
                                        style={tw`text-sm text-black h-14 p-4 sm:p-6 md:p-8 bg-white`}  // Adjust padding for responsiveness
                                        itemStyle={tw`text-black`} // Ensure items have correct text color and spacing
                                    >
                                        <Picker.Item label="Select Vehicle Number" value="" />
                                        {vehicleNumbers.map((number, index) => (
                                            <Picker.Item key={index} label={number.number} value={number.number} />
                                        ))}
                                    </Picker>
                                </View>
                        </View>


                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Departure Place</Text>
                            <TextInput
                                style={styles.input}
                                value={departurePlace}
                                onChangeText={(text) => setDeparturePlace(text)}
                            />
                        </View>
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Destination Place</Text>
                            <TextInput
                                style={styles.input}
                                value={destinationPlace}
                                onChangeText={(text) => setDestinationPlace(text)}
                            />
                        </View>
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Departure Time</Text>
                            <TouchableOpacity
                                style={styles.input}
                                onPress={() => setShowDepartureTimePicker(true)}
                            >
                                <Text>{departureTime ? departureTime.toLocaleTimeString() : "Select Time"}</Text>
                            </TouchableOpacity>
                            {showDepartureTimePicker && (
                                <DateTimePicker
                                    value={departureTime || new Date()}
                                    mode="time"
                                    display="default"
                                    key="departure"
                                    onChange={(event: any, selectedTime?: Date) => {
                                        setShowDepartureTimePicker(false)
                                        setDepartureTime(selectedTime)
                                    }}
                                />
                            )}
                        </View>
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Arrival Time</Text>
                            <TouchableOpacity
                                style={styles.input}
                                onPress={() => setShowArrivalTimePicker(true)}
                            >
                                <Text>{arrivalTime ? arrivalTime.toLocaleTimeString() : "Select Time"}</Text>
                            </TouchableOpacity>
                            {showArrivalTimePicker && (
                                <DateTimePicker
                                    value={arrivalTime || new Date()}
                                    mode="time"
                                    display="default"
                                    key="arrival"
                                    onChange={(event: any, selectedTime?: Date) => {
                                        setShowArrivalTimePicker(false)
                                        setArrivalTime(selectedTime)
                                    }}
                                    is24Hour={false}
                                />
                            )}
                        </View>
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Add Pick up point</Text>
                            <TextInput
                                style={styles.input}
                                value={pickupPoint}
                                onChangeText={(text) => setPickupPoint(text)}
                            />
                        </View>
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Add drop off point</Text>
                            <TextInput
                                style={styles.input}
                                value={dropoffPoint}
                                onChangeText={(text) => setDropoffPoint(text)}
                            />
                        </View>
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Ticket Fare</Text>
                            <TextInput
                                style={styles.input}
                                value={ticketFare?.toString() || ""}
                                keyboardType="numeric"
                                onChangeText={(text) => setTicketFare(Number(text))}
                            />
                        </View>
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Discount</Text>
                            <View style={{ ...styles.input, flexDirection: "row", justifyContent: "start", alignItems: "center" }}>
                                <TextInput
                                    style={{ flex: 1 }}
                                    value={discount.toString() || "0"}
                                    keyboardType="numeric"
                                    onChangeText={(text) => setDiscount(Number(text))}
                                />
                                <Text>%</Text>
                                {/* <TouchableOpacity onPress={() => setIsPasswordVisible(prev => !prev)} style={{ backgroundColor: Colors.darkBlue, padding: 4, borderRadius: 5 }} ><Text style={[{ color: "#fff" }]}>{isPasswordVisible ? "Hide" : "Show"}</Text></TouchableOpacity> */}
                            </View>
                        </View>

                        {/* <TouchableOpacity style={styles.imagePicker} onPress={() => handleImagePicker("busPhotos")}>
                            <Text style={styles.imagePickerText}>Upload Bus Images (Max 5)</Text>
                        </TouchableOpacity>
                        <View style={styles.imagePreviewContainer}>
                            {busImages.map((image, index) => (
                                <Image key={index} source={{ uri: image.uri }} style={styles.previewImage} />
                            ))}
                        </View>

                        <View style={styles.featuresContainer}>
                            <RadioButtonGroup
                                containerStyle={styles.radioButtonGroup}
                                selected={isAC}
                                onSelected={(value: string) => setIsAC(value)}
                                radioBackground={Colors.darkBlue}
                            >
                                <RadioButtonItem value={"true"} label={<Text style={{ color: Colors.primary, fontWeight: "500" }}>AC</Text>} style={styles.radioButtonItem} />
                                <RadioButtonItem value={"false"} label={<Text style={{ color: Colors.primary, fontWeight: "500" }}>Non-AC</Text>} style={styles.radioButtonItem} />
                            </RadioButtonGroup>
                        </View>
                        <View style={styles.featuresContainer}>
                            <RadioButtonGroup
                                containerStyle={styles.radioButtonGroup}
                                selected={isSleeper}
                                onSelected={(value: string) => setIsSleeper(value)}
                                radioBackground={Colors.darkBlue}
                            >
                                <RadioButtonItem value={"true"} label={<Text style={{ color: Colors.primary, fontWeight: "500" }}>Sleeper</Text>} style={styles.radioButtonItem} />
                                <RadioButtonItem value={"false"} label={<Text style={{ color: Colors.primary, fontWeight: "500" }}>Non-Sleeper</Text>} style={styles.radioButtonItem} />
                            </RadioButtonGroup>
                        </View> */}
                        <View style={styles.featuresOuterContainer}>
                            <Text>Does it carry two wheelers?</Text>
                            <View style={styles.featuresContainer}>
                                <RadioButtonGroup
                                    containerStyle={styles.radioButtonGroup}
                                    selected={doesCarryTwoWheelers}
                                    onSelected={(value: string) => setDoesCarryTwoWheelers(value)}
                                    radioBackground={Colors.darkBlue}
                                >
                                    <RadioButtonItem value={"true"} label={<Text style={{ color: Colors.primary, fontWeight: "500" }}>Yes</Text>} style={styles.radioButtonItem} />
                                    <RadioButtonItem value={"false"} label={<Text style={{ color: Colors.primary, fontWeight: "500" }}>No</Text>} style={styles.radioButtonItem} />
                                </RadioButtonGroup>
                            </View>
                        </View>
                        <View style={styles.featuresOuterContainer}>
                            <Text>Does it Provide courier service?</Text>
                            <View style={styles.featuresContainer}>
                                <RadioButtonGroup
                                    containerStyle={styles.radioButtonGroup}
                                    selected={doesProvideCourierService}
                                    onSelected={(value: string) => setDoesProvideCourierService(value)}
                                    radioBackground={Colors.darkBlue}
                                >
                                    <RadioButtonItem value={"true"} label={<Text style={{ color: Colors.primary, fontWeight: "500" }}>Yes</Text>} style={styles.radioButtonItem} />
                                    <RadioButtonItem value={"false"} label={<Text style={{ color: Colors.primary, fontWeight: "500" }}>No</Text>} style={styles.radioButtonItem} />
                                </RadioButtonGroup>
                            </View>
                        </View>
                        <View style={styles.featuresOuterContainer}>
                            <Text>Does it book train tickets?</Text>
                            <View style={styles.featuresContainer}>
                                <RadioButtonGroup
                                    containerStyle={styles.radioButtonGroup}
                                    selected={doesBookTrainTickets}
                                    onSelected={(value: string) => setDoesBookTrainTickets(value)}
                                    radioBackground={Colors.darkBlue}
                                >
                                    <RadioButtonItem value={"true"} label={<Text style={{ color: Colors.primary, fontWeight: "500" }}>Yes</Text>} style={styles.radioButtonItem} />
                                    <RadioButtonItem value={"false"} label={<Text style={{ color: Colors.primary, fontWeight: "500" }}>No</Text>} style={styles.radioButtonItem} />
                                </RadioButtonGroup>
                            </View>
                        </View>

                        <Text style={{ flex: 1, fontWeight: 'bold', color: '#87CEEB' }}>Select Amenities:</Text>
                        <View style={{ paddingTop: 1, paddingBottom: 14, flexDirection: 'row', flexWrap: 'wrap' }}>
                            {[
                                { id: 1, name: "wifi", source: require('@/assets/images/wifi-icon.png') },
                                { id: 2, name: "blanket", source: require('@/assets/images/blanket.png') },
                                { id: 3, name: "bottle", source: require('@/assets/images/bottle.png') },
                                { id: 4, name: "charger", source: require('@/assets/images/charger.png') },
                                { id: 5, name: "meal", source: require('@/assets/images/meal.png') },
                                { id: 6, name: "pillow", source: require('@/assets/images/pillow.png') },
                                { id: 7, name: "tv", source: require('@/assets/images/tv.png') },
                            ].map(amenity => (
                                <TouchableOpacity
                                    key={amenity.id}
                                    onPress={() => toggleSelectAmenity(amenity.name)}
                                    style={{
                                        backgroundColor: selectedAmenities.includes(amenity.name) ? '#87CEEB' : 'transparent',
                                        padding: 5,
                                        borderRadius: 5,
                                        marginHorizontal: 5,
                                    }}>
                                    <Image source={amenity.source} style={{ width: 30, height: 30 }} />
                                </TouchableOpacity>
                            ))}
                        </View>
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Add your PhonePe no here</Text>
                            <TextInput
                                style={styles.input}
                                keyboardType="numeric"
                                value={phonePeNumber?.toString() || ""}
                                onChangeText={(text) => setPhonePeNumber(Number(text))}
                            />
                        </View>
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Add your PhonePe name here</Text>
                            <TextInput
                                style={styles.input}
                                value={phonePeName}
                                onChangeText={(text) => setPhonePeName(text)}
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Mobile No 1</Text>
                            <TextInput
                                style={styles.input}
                                value={mobileNumbers.mobileNumber1}
                                onChangeText={(text) => setMobileNumbers({ ...mobileNumbers, mobileNumber1: text })}
                            />
                        </View>
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Mobile No 2</Text>
                            <TextInput
                                style={styles.input}
                                value={mobileNumbers.mobileNumber2}
                                onChangeText={(text) => setMobileNumbers({ ...mobileNumbers, mobileNumber2: text })}
                            />
                        </View>
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Mobile No 3</Text>
                            <TextInput
                                style={styles.input}
                                value={mobileNumbers.mobileNumber3}
                                onChangeText={(text) => setMobileNumbers({ ...mobileNumbers, mobileNumber3: text })}
                            />
                        </View>
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Mobile No 4</Text>
                            <TextInput
                                style={styles.input}
                                value={mobileNumbers.mobileNumber4}
                                onChangeText={(text) => setMobileNumbers({ ...mobileNumbers, mobileNumber4: text })}
                            />
                        </View>
                        <TouchableOpacity style={styles.imagePicker} onPress={() => handleImagePicker("QR")}>
                            <Text style={styles.imagePickerText}>Upload QR</Text>
                        </TouchableOpacity>
                        <View style={styles.imagePreviewContainer}>
                            {/* {busImages.map((image, index) => ( */}
                            {QR && <Image source={{ uri: QR.uri }} style={styles.previewImage} />}
                            {/* ))} */}
                        </View>
                        <TouchableOpacity style={styles.imagePicker} onPress={() => handleImagePicker("seatingArrangement")}>
                            <Text style={styles.imagePickerText}>Upload Seating Arrangement</Text>
                        </TouchableOpacity>
                        <View style={styles.imagePreviewContainer}>
                            {/* {busImages.map((image, index) => ( */}
                            {seatingArrangement && <Image source={{ uri: seatingArrangement.uri }} style={styles.previewImage} />}
                            {/* ))} */}
                        </View>
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Add Office Address</Text>
                            <TextInput
                                style={styles.input}
                                value={officeAddress}
                                onChangeText={(text) => setOfficeAddress(text)}
                            />
                        </View>


                        <View style={styles.modalButtons}>
                            <TouchableOpacity
                                style={[styles.modalButton, { backgroundColor: Colors.darkBlue }]}
                                onPress={handleAddRoute}
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
        padding: 2,
        backgroundColor: "#ffffff",
        marginBottom:50
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
        padding: 20,
    },
    inputGroup: {
        marginBottom: 15,
    },
    label: {
        marginBottom: 5,
        fontSize: 13,
        color: '#0',
        fontWeight: "500"
    },
    featuresOuterContainer: {
        flexDirection: "column",
        // justifyContent: "space-between",
        alignItems: 'center',
        backgroundColor: Colors.secondary,
        paddingTop: 10,
        borderRadius: 10,
        marginBottom: 15,
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
        justifyContent: "space-around",
        width: "100%"
    },
    radioButtonItem: {
        borderColor: Colors.secondary,
        backgroundColor: "white",
        color: Colors.darkBlue,
    },
    checkboxContainer: {
        flexDirection: 'row',
        marginTop: 8,
    },
    checkboxWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 16,
    },
    checkbox: {
        marginRight: 8,
    },
    checkboxLabel: {
        fontSize: 16,
    },
    input: {
        borderColor: '#C0C0C0',
        borderWidth: 1,
        borderRadius: 10,
        paddingHorizontal: 10,
        height: 40,
        justifyContent: 'center'
    },
    textArea: {
        height: 100,
        textAlignVertical: 'top',
        paddingTop: 10,
    },
    imagePicker: {
        padding: 15,
        backgroundColor: Colors.secondary,
        borderRadius: 10,
        alignItems: "center",
        marginVertical: 15,
    },
    imagePickerText: {
        fontSize: 14,
        fontWeight: "500",
        color: Colors.primary,
    },
    imagePreviewContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-around",
        marginBottom: 15,
    },
    previewImage: {
        width: 70,
        height: 70,
        borderRadius: 10,
        marginBottom: 10,
    },
    pickerContainer: {
        borderColor: Colors.secondary,
        borderWidth: 1,
        borderRadius: 10,
        overflow: 'hidden',
    },
    picker: {
        height: 1,
        width: '100%',
       
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

export default AddRouteScreen;