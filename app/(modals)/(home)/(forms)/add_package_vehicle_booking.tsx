import React, { useEffect, useState } from "react";
import {
    View,
    StyleSheet,
    Text,
    TextInput,
    SafeAreaView,
    ScrollView,
    Platform,
    Alert,
    TouchableOpacity,
    ActivityIndicator
} from "react-native";
import { Colors } from "@/constants/Colors";
import { useGlobalContext } from "@/context/GlobalProvider";
import { Picker } from "@react-native-picker/picker";
import DateTimePicker from '@react-native-community/datetimepicker';
import { router } from "expo-router";

const PackageBookingForm: React.FC = () => {
    const [vehicleNumber, setVehicleNumber] = useState("");
    const [otherVehicleNumber, setOtherVehicleNumber] = useState("");
    const [customerName, setCustomerName] = useState("");
    const [mobileNumber, setMobileNumber] = useState("");
    const [alternateNumber, setAlternateNumber] = useState("");
    const [kmStarting, setKmStarting] = useState("");
    const [perKmRate, setPerKmRate] = useState("");
    const [advancedAmount, setAdvancedAmount] = useState("");
    const [remainingAmount, setRemainingAmount] = useState("");
    const [departurePlace, setDeparturePlace] = useState("");
    const [destinationPlace, setDestinationPlace] = useState("");
    const [departureTime, setDepartureTime] = useState<Date | undefined>(undefined);
    const [returnTime, setReturnTime] = useState<Date | undefined>(undefined);
    const [showDepartureTimePicker, setShowDepartureTimePicker] = useState<boolean>(false);
    const [showReturnTimePicker, setShowReturnTimePicker] = useState<boolean>(false);
    const [toll, setToll] = useState("");
    const [otherStateTax, setOtherStateTax] = useState("");
    const [instructions, setInstructions] = useState("");
    const [entryParking, setEntryParking] = useState("");
    const [pickUpPoint, setPickUpPoint] = useState("");
    const [loading, setLoading] = useState(false);
    const [vehicleNumbers, setVehicleNumbers] = useState<{ id: string, number: string }[]>([]);
    const { apiCaller, setRefresh } = useGlobalContext();
    const [departureDate, setDepartureDate] = useState<Date | undefined>(undefined);
    const [returnDate, setReturnDate] = useState<Date | undefined>(undefined);
    const [showDepartureDatePicker, setShowDepartureDatePicker] = useState<boolean>(false);
    const [showReturnDatePicker, setShowReturnDatePicker] = useState<boolean>(false);

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

    const onChangeDepartureTime = (event: any, selectedTime?: Date) => {
        setShowDepartureTimePicker(false);
        if (selectedTime) {
            setDepartureTime(selectedTime);
        }
    };

    const onChangeReturnTime = (event: any, selectedTime?: Date) => {
        setShowReturnTimePicker(false);
        if (selectedTime) {
            setReturnTime(selectedTime);
        }
    };

    const onChangeDepartureDate = (event: any, selectedDate?: Date) => {
        setShowDepartureDatePicker(false);
        if (selectedDate) {
            setDepartureDate(selectedDate);
        }
    };

    const onChangeReturnDate = (event: any, selectedDate?: Date) => {
        setShowReturnDatePicker(false);
        if (selectedDate) {
            setReturnDate(selectedDate);
        }
    };

    const formatDate = (date: Date | undefined) => {
        if (!date) return "";
        return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear().toString().slice(-2)}`;
    };

    const handleBooking = async () => {

        if (!vehicleNumber || !otherVehicleNumber || !customerName || !mobileNumber || !alternateNumber || !kmStarting || !perKmRate || !advancedAmount || !remainingAmount || !departurePlace || !destinationPlace || !departureTime || !returnTime || !departureDate || !returnDate || !toll || !otherStateTax || !instructions || !entryParking || !pickUpPoint) {
            Alert.alert("Please fill all fields.");
            return;
        }

        const newBooking = {
            vehicleId: vehicleNumber,
            otherVehicleId: otherVehicleNumber,
            customerName,
            mobileNumber,
            alternateNumber,
            kmStarting,
            perKmRateInINR: perKmRate,
            advanceAmountInINR: advancedAmount,
            remainingAmountInINR: remainingAmount,
            departurePlace,
            destinationPlace,
            departureTime: departureTime,
            returnTime: returnTime,
            departureDate: departureDate,
            returnDate: returnDate,
            tollInINR: toll,
            otherStateTaxInINR: otherStateTax,
            advancePlace: entryParking,
            note: instructions,
            pickupPoint: pickUpPoint
            
        };


        setLoading(true);
        try {
            await apiCaller.post('/api/packageBooking', newBooking);
            setLoading(false);
            setRefresh(prev=>!prev)
            resetForm();
            Alert.alert("Success", "Booking added successfully!");
            router.back()
        } catch (error) {
            console.log(error);
            setLoading(false);
            Alert.alert("Error", "Failed to add booking. Please try again.");
        }
    };

    const resetForm = () => {
        setVehicleNumber("");
        setOtherVehicleNumber("");
        setCustomerName("");
        setMobileNumber("");
        setAlternateNumber("");
        setKmStarting("");
        setPerKmRate("");
        setAdvancedAmount("");
        setRemainingAmount("");
        setDeparturePlace("");
        setDestinationPlace("");
        setDepartureTime(undefined);
        setReturnTime(undefined);
        setDepartureDate(undefined);
        setReturnDate(undefined);
        setToll("");
        setOtherStateTax("");
        setInstructions("");
        setEntryParking("");
        setPickUpPoint("")
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Vehicle Number</Text>
                        <View style={styles.pickerContainer}>
                            <Picker
                                selectedValue={vehicleNumber}
                                onValueChange={(itemValue) => setVehicleNumber(itemValue)}
                                style={styles.picker}
                            >
                                <Picker.Item label="Select Vehicle Number" value="" />
                                {vehicleNumbers.map((number, index) => (
                                    <Picker.Item key={index} label={number.number} value={number.id} />
                                ))}
                            </Picker>
                        </View>
                    </View>
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Other Vehicle Number</Text>
                        <View style={styles.pickerContainer}>
                            <Picker
                                selectedValue={otherVehicleNumber}
                                onValueChange={(itemValue) => setOtherVehicleNumber(itemValue)}
                                style={styles.picker}
                            >
                                <Picker.Item label="Select Vehicle Number" value="" />
                                {vehicleNumbers.map((number, index) => (
                                    <Picker.Item key={index} label={number.number} value={number.id} />
                                ))}
                            </Picker>
                        </View>
                    </View>
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Customer Name</Text>
                        <TextInput
                            style={styles.input}
                            value={customerName}
                            onChangeText={(text) => setCustomerName(text)}
                        />
                    </View>
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Mobile Number</Text>
                        <TextInput
                            style={styles.input}
                            value={mobileNumber}
                            onChangeText={(text) => setMobileNumber(text)}
                            keyboardType="phone-pad"
                        />
                    </View>
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Alternate Number</Text>
                        <TextInput
                            style={styles.input}
                            value={alternateNumber}
                            onChangeText={(text) => setAlternateNumber(text)}
                            keyboardType="phone-pad"
                        />
                    </View>
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>KM Starting</Text>
                        <TextInput
                            style={styles.input}
                            value={kmStarting}
                            onChangeText={(text) => setKmStarting(text)}
                        />
                    </View>
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Per KM Rate</Text>
                        <TextInput
                            style={styles.input}
                            value={perKmRate}
                            onChangeText={(text) => setPerKmRate(text)}
                        />
                    </View>
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Advanced Amount</Text>
                        <TextInput
                            style={styles.input}
                            value={advancedAmount}
                            onChangeText={(text) => setAdvancedAmount(text)}
                            keyboardType="numeric"
                        />
                    </View>
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Remaining Amount</Text>
                        <TextInput
                            style={styles.input}
                            value={remainingAmount}
                            onChangeText={(text) => setRemainingAmount(text)}
                            keyboardType="numeric"
                        />
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
                        <Text style={styles.label}>Departure Date</Text>
                        <TouchableOpacity
                            style={styles.input}
                            onPress={() => setShowDepartureDatePicker(true)}
                        >
                            <Text>{departureDate ? formatDate(departureDate) : "Select Date"}</Text>
                        </TouchableOpacity>
                        {showDepartureDatePicker && (
                            <DateTimePicker
                                value={departureDate || new Date()}
                                mode="date"
                                display="default"
                                onChange={onChangeDepartureDate}
                            />
                        )}
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
                                onChange={onChangeDepartureTime}
                            />
                        )}
                    </View>
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Return Date</Text>
                        <TouchableOpacity
                            style={styles.input}
                            onPress={() => setShowReturnDatePicker(true)}
                        >
                            <Text>{returnDate ? formatDate(returnDate) : "Select Date"}</Text>
                        </TouchableOpacity>
                        {showReturnDatePicker && (
                            <DateTimePicker
                                value={returnDate || new Date()}
                                mode="date"
                                display="default"
                                onChange={onChangeReturnDate}
                            />
                        )}
                    </View>
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Return Time</Text>
                        <TouchableOpacity
                            style={styles.input}
                            onPress={() => setShowReturnTimePicker(true)}
                        >
                            <Text>{returnTime ? returnTime.toLocaleTimeString() : "Select Time"}</Text>
                        </TouchableOpacity>
                        {showReturnTimePicker && (
                            <DateTimePicker
                                value={returnTime || new Date()}
                                mode="time"
                                display="default"
                                onChange={onChangeReturnTime}
                            />
                        )}
                    </View>
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Toll</Text>
                        <TextInput
                            style={styles.input}
                            value={toll}
                            onChangeText={(text) => setToll(text)}
                        />
                    </View>
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Other State Tax</Text>
                        <TextInput
                            style={styles.input}
                            value={otherStateTax}
                            onChangeText={(text) => setOtherStateTax(text)}
                        />
                    </View>
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Add Note</Text>
                        <TextInput
                            style={styles.input}
                            value={instructions}
                            onChangeText={(text) => setInstructions(text)}
                        />
                    </View>
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Entry Parking</Text>
                        <TextInput
                            style={styles.input}
                            value={entryParking}
                            onChangeText={(text) => setEntryParking(text)}
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Pick up point</Text>
                        <TextInput
                            style={styles.input}
                            value={pickUpPoint}
                            onChangeText={(text) => setPickUpPoint(text)}
                        />
                    </View>

                    <View style={styles.modalButtons}>
                        <TouchableOpacity
                            style={[styles.modalButton, { backgroundColor: Colors.darkBlue }]}
                            onPress={handleBooking}
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
        justifyContent: 'center'
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

export default PackageBookingForm;