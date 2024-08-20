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
    ActivityIndicator,
    Image
} from "react-native";
import { Colors } from "@/constants/Colors";
import * as ImagePicker from "expo-image-picker";
import { useGlobalContext } from "@/context/GlobalProvider";
import { Picker } from "@react-native-picker/picker";
import DateTimePicker from '@react-native-community/datetimepicker';
import { router } from "expo-router";

const add_empty_vehicle = () => {
   
  const [vehicleNumber, setVehicleNumber] = useState("");
  
    const [mobileNumber, setMobileNumber] = useState("");
   
   
   
    const [departurePlace, setDeparturePlace] = useState("");
    const [destinationPlace, setDestinationPlace] = useState("");
    const [departureTime, setDepartureTime] = useState<Date | undefined>(undefined);
  
    const [showDepartureTimePicker, setShowDepartureTimePicker] = useState<boolean>(false);
  
    const [instructions, setInstructions] = useState("");
   

    const [loading, setLoading] = useState(false);
    const [vehicleNumbers, setVehicleNumbers] = useState<{ id: string, number: string }[]>([]);
    const { apiCaller, setRefresh } = useGlobalContext();
    const [departureDate, setDepartureDate] = useState<Date | undefined>(undefined);
    const [showDepartureDatePicker, setShowDepartureDatePicker] = useState<boolean>(false);
    const [showReturnDatePicker, setShowReturnDatePicker] = useState<boolean>(false);
    const [busImages, setBusImages] = useState<string[]>([]);

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

    // const onChangeReturnTime = (event: any, selectedTime?: Date) => {
    //     setShowReturnTimePicker(false);
    //     if (selectedTime) {
    //         setReturnTime(selectedTime);
    //     }
    // };

    const onChangeDepartureDate = (event: any, selectedDate?: Date) => {
        setShowDepartureDatePicker(false);
        if (selectedDate) {
            setDepartureDate(selectedDate);
        }
    };

    // const onChangeReturnDate = (event: any, selectedDate?: Date) => {
    //     setShowReturnDatePicker(false);
    //     if (selectedDate) {
    //         setReturnDate(selectedDate);
    //     }
    // };

    const formatDate = (date: Date | undefined) => {
        if (!date) return "";
        return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear().toString().slice(-2)}`;
    };

    const handleBooking = async () => {

        if (!vehicleNumber || !mobileNumber  ||  !departurePlace || !destinationPlace || !departureTime ||  !departureDate  || !instructions ) {
            Alert.alert("Please fill all fields.");
            return;
        }

        const newBooking = {
            vehicleNo: vehicleNumber,
          
            mobileNumber,
        
            departurePlace,
            destinationPlace,
            departureTime: departureTime,
            departureDate: departureDate,
            moreInformation: instructions,
            photos: busImages,
           
            
        };

        setLoading(true);
        try {
            await apiCaller.post('/api/emptyVehicle', newBooking,  { headers: { 'Content-Type': 'multipart/form-data' } });
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

    const handleImagePicker = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 1,
    });

    if (!result.canceled) {
      setBusImages(result.assets.map(asset => asset.uri));
    }
  };

    const resetForm = () => {
        setVehicleNumber("");
     
        setMobileNumber("");
        setDeparturePlace("");
        setDestinationPlace("");
        setDepartureTime(undefined);
        setDepartureDate(undefined);       
        setInstructions("");
        setBusImages([]);
   
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
                            <Picker.Item key={index} label={number.number} value={number.number} />
                        ))}
                    </Picker>
                </View>
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
                <Text style={styles.label}>Add Note</Text>
                <TextInput
                    style={styles.input}
                    value={instructions}
                    onChangeText={(text) => setInstructions(text)}
                />
            </View>

            <TouchableOpacity style={styles.imagePicker} onPress={handleImagePicker}>
            <Text style={styles.imagePickerText}>Upload Bus Images (Max 2)</Text>
              </TouchableOpacity>
              <View style={styles.imagePreviewContainer}>
                {busImages.map((uri, index) => (
                  <Image key={index} source={{ uri }} style={styles.previewImage} />
                ))}
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
  )
}


const styles = StyleSheet.create({
  container: {
      flex: 1,
      padding: 20,
      backgroundColor: "#ffffff",
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

export default add_empty_vehicle
