import { ActivityIndicator, Dimensions, Image, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, View, TouchableOpacity, Alert, Modal } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useGlobalContext } from '@/context/GlobalProvider'
import { Colors } from '@/constants/Colors'
import Carousel from './Carousel'
import CustomButton from "@/components/CustomButton"
import { MaterialIcons } from '@expo/vector-icons'
import { City } from 'country-state-city'
import { Picker } from '@react-native-picker/picker'
import DateTimePicker from '@react-native-community/datetimepicker';
import { router } from 'expo-router'
import { Bookmark, ChevronUp, ChevronDown } from 'lucide-react-native';
import tw from 'twrnc'
import CityPickerWithSearch from '@/components/CityPickerWithSearch'

const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;

export default function BusTicketsScreen() {

    const [dailyRoutes, setDailyRoutes] = useState<DailyRoute[]>([])
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const { apiCaller, route } = useGlobalContext()
    const cities = City.getCitiesOfCountry("IN")
    const [selectedDepPlace, setSelectedDepPlace] = useState<string>(route.fromCity ? route.fromCity : "")
    const [selectedDestPlace, setSelectedDestPlace] = useState<string>(route.toCity ? route.toCity : "")

    const fetchDailyRoutes = async () => {
        try {
            setIsLoading(true)
            const res = await apiCaller.get("/api/busRoute/all")
            setDailyRoutes(res.data.data)
        } catch (error: any) {
            console.log(error);
            console.log(error?.response?.data?.message);
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchDailyRoutes()
    }, [])
    const filterDailyRoutes = () => {
        return dailyRoutes.filter((route) => {
            return !selectedDepPlace ? true : route.departurePlace?.toLowerCase().includes(selectedDepPlace?.toLowerCase()) && !selectedDestPlace ? true : route.destinationPlace?.toLowerCase()?.includes(selectedDestPlace?.toLowerCase())
        })
    }

    const filteredRoutes = selectedDepPlace || selectedDestPlace ? filterDailyRoutes() : dailyRoutes

     const handleToggleFavourite = async (id: string) => {
    setIsLoading(true);
    try {
      if (isFavourite) {
        // Remove from favourites
        await apiCaller.delete(`/api/busRoute/removeFromFavourite?routeId=${id}`);
        Alert.alert("Success", "This route has been removed from the favourites");
      } else {
        // Add to favourites
        await apiCaller.patch(`/api/busRoute/addToFavourite?routeId=${id}`);
        Alert.alert("Success", "This route has been added to the favourites");
      }

      // Toggle favourite state
      setIsFavourite((prev) => !prev);

      // Trigger refresh (if needed)
      setRefresh((prev) => !prev);
    } catch (error: any) {
      console.error(error?.response?.data?.message || error);
      Alert.alert(
        "Error",
        error?.response?.data?.message ||
          (isFavourite
            ? "Could not remove from favourites"
            : "Could not add to favourites")
      );
    } finally {
      setIsLoading(false);
    }
  };


    return (
        <SafeAreaView style={styles.container}>
        <ScrollView style={styles.scrollContainer}>
          {/* Favourite Routes Button */}
          <TouchableOpacity
            onPress={() =>
              router.push("/(modals)/(customer)/favourite_bus_tickets")
            }
            style={styles.addButton}
          >
            <Text style={styles.addButtonText}>Favourite Routes</Text>
          </TouchableOpacity>
      
          {/* Filter and Search Section */}
          <View style={tw`bg-white p-6 mx-2 rounded-xl mb-4 mt-[10px] relative z-10 shadow-lg`}>
            {/* City picker with search functionality - "From" */}
            <CityPickerWithSearch
              selectedCity={selectedDepPlace} // Pass selected departure place
              setSelectedCity={setSelectedDepPlace} // Update selected departure place
              placeholder="From" // Placeholder for "From"
            />
      
            {/* City picker with search functionality - "To" */}
            <CityPickerWithSearch
              selectedCity={selectedDestPlace} // Pass selected destination place
              setSelectedCity={setSelectedDestPlace} // Update selected destination place
              placeholder="To" // Placeholder for "To"
            />
      
            {/* Search Button */}
            <TouchableOpacity style={tw`text-center mt-2`}>
              <Text style={tw`text-center bg-[#154CE4] rounded-3xl mx-4 py-[12px] text-[14px] text-white`}>
                Search
              </Text>
            </TouchableOpacity>
          </View>
      
          {/* Route List or Loading Spinner */}
          {isLoading ? (
            <ActivityIndicator size="large" color={Colors.darkBlue} />
          ) : (
            <View style={styles.routesList}>
              {filteredRoutes.map((route) => (
                <BusTicketCard route={route} key={route.id} />
              ))}
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
      
      
    )
}

function BusTicketCard({ route }: { route: DailyRoute } ) {
    const [isQRModalVisible, setIsQrModalVisible] = useState<string | null>(null);
    const [isChartModalVisible, setIsChartModalVisible] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
    const [ticketRequest, setTicketRequest] = useState({
        dateOfJourney: "",
        numberOfPeople: 0,
        passengerGender: ""
    })
    const [showDepartureDatePicker, setShowDepartureDatePicker] = useState<boolean>(false)
    const [isLoading, setIsLoading] = useState(false)
    const { apiCaller, isLogged, userData, setRefresh } = useGlobalContext()

    const [showFullCard, setShowFullCard] = useState(false);

    const [isFavourite, setIsFavourite] = useState(false);

    const handleToggleFavourite = async (id: string) => {
        setIsLoading(true);
        try {
          if (isFavourite) {
            // Remove from favourites
            await apiCaller.delete(`/api/busRoute/removeFromFavourite?routeId=${id}`);
            Alert.alert("Success", "This route has been removed from the favourites");
          } else {
            // Add to favourites
            await apiCaller.patch(`/api/busRoute/addToFavourite?routeId=${id}`);
            Alert.alert("Success", "This route has been added to the favourites");
          }
    
          // Toggle favourite state
          setIsFavourite((prev) => !prev);
    
          // Trigger refresh (if needed)
          setRefresh((prev) => !prev);
        } catch (error: any) {
          console.error(error?.response?.data?.message || error);
          Alert.alert(
            "Error",
            error?.response?.data?.message ||
              (isFavourite
                ? "Could not remove from favourites"
                : "Could not add to favourites")
          );
        } finally {
          setIsLoading(false);
        }
      };


    const handleAddToFavourite = async (id: string) => {
        setIsLoading(true)
        try {
            const res = await apiCaller.patch(`/api/busRoute/addToFavourite?routeId=${id}`)
            Alert.alert("Success", "This route have been added to the favourites")
        } catch (error: any) {
            console.log(error?.response?.data?.message || error);
            Alert.alert("Error", error?.response?.data?.message || "Could not add to favourites")
        } finally {
            setIsLoading(false)
        }
    }

    const handleSendRequest = async () => {
        if (!ticketRequest.dateOfJourney || !ticketRequest.numberOfPeople || !ticketRequest.passengerGender) {
            return Alert.alert("Failed", "Fill all the required fields")
        }
        setIsLoading(true)
        try {
            const res = await apiCaller.post(`/api/ticketRequest?routeId=${route._id}`, ticketRequest)
            Alert.alert("Success", "Interest has been sent. Agency will connect with you")
            setIsModalOpen(false)
        } catch (error: any) {
            console.log(error?.response?.data?.message || error);
            Alert.alert("Error", error?.response?.data?.message || "Could not send interest")
        } finally {
            setIsLoading(false)
        }
    }

    const handleCloseModal = () => {
        setIsModalOpen(false)
    }

    const onChangeDateOfJourney = (event: any, selectedTime?: Date) => {
        setShowDepartureDatePicker(false);
        if (selectedTime) {
            setTicketRequest({ ...ticketRequest, dateOfJourney: selectedTime });
        }
    };

    const formatDate = (date: Date | undefined) => {
        if (!date) return "";
        return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear().toString().slice(-2)}`;
    };
    return (
        <View key={route._id} style={styles.card}>

                    <View style={tw`flex-1 justify-center items-center`}>
                        <View style={tw`relative`}>
                            {/* Carousel */}
                            <Carousel
                            images={route?.vehicle?.photos}
                            height={deviceWidth * 0.6}
                            />

                            {/* Bookmark button */}
                            {isLogged && (
                                    <TouchableOpacity
                                        style={tw`absolute top-0 right-1   `}
                                        onPress={() => handleToggleFavourite(route._id)}
                                    >
                                        {isLoading ? (
                                        <ActivityIndicator color="#000" />
                                        ) : (
                                        <Bookmark color={isFavourite ? "blue" : "#EEDC41"} size={32} />
                                        )}
                                    </TouchableOpacity>
                            )}

                            {/* Additional info circle */}
                            <View style={tw`absolute top-4 flex flex-row left-0 bg-blue-100 bg-opacity-70 p-1 pl-2  rounded-r-full`}>
                                        <Text style={tw`text-black text-center text-[10px] font-bold`}>
                                            {route?.vehicle?.isAC ? "AC" : "Non-AC"} /
                                        </Text>
                                        <Text style={tw`text-black text-[10px] text-center font-bold`}>
                                            {route?.vehicle?.isSleeper ? "Sleeper" : "Seater"}
                                        </Text>
                                    
                            </View>

                        </View>
                    </View>


         

            <View >
                <Text
                    style={{
                        fontSize: 15,
                        fontWeight: '900',
                        color: '#202A44',
                        fontFamily: 'sans-serif',
                        paddingHorizontal:12,
                        paddingBottom:2
                    }}
                >
                    {route?.agencyName}
                </Text>
            </View>


            <View style={tw` bg-gray-100 mx-2 px-10 pt-3 rounded-md px-auto`}>
                {/* Departure and Arrival Labels */}
                <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                    {/* Departure Label */}
                    <View style={{ alignItems: "flex-start" }}>
                        <Text style={{ fontWeight: "bold", fontSize: 12 }}>Departure</Text>
                    </View>

                    {/* Arrival Label */}
                    <View style={{ alignItems: "flex-start" }}>
                        <Text style={{ fontWeight: "bold", fontSize: 12, paddingRight: 2 }}>Arrival</Text>
                    </View>
                </View>

                {/* Departure and Arrival Places with Times */}
                <View style={{ flexDirection: "row", justifyContent: "space-between", marginVertical: 1, paddingBottom:8 }}>
                    {/* Departure Place and Time */}
                    <View style={{ alignItems: "center" }}>
                        <Text style={{ fontWeight: "bold", fontSize: 15, color: "#202A44" }}>
                            {route?.departurePlace}
                        </Text>
                        <Text style={tw`text-[12px]`} >{route.departureTime ? new Date(route.departureTime).toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true }) : "Time not added"}</Text>
                    </View>

                    {/* Arrow Icon */}
                    <MaterialIcons name="keyboard-double-arrow-right" size={24} color="#00008B" />

                    {/* Arrival Place and Time */}
                    <View style={{ alignItems: "center" }}>
                        <Text style={{ fontWeight: "bold", fontSize: 15, color: "#202A44" }}>
                            {route?.destinationPlace}
                        </Text>
                        <Text style={tw`text-[12px]`} >{route.arrivalTime ? new Date(route.arrivalTime).toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true }) : "Time not added"}</Text>
                    </View>
                </View>
            </View>
           
            <View style={tw`flex flex-row gap-2 pt-2 mx-2 pb-2 items-center space-x-2`}>
                {/* Ticket Price */}
                <Text style={tw`bg-blue-100 text-[12px] p-1 rounded-md`}>
                    Ticket Price: {route?.ticketFare}
                </Text>

                {/* Discount */}
                <Text style={tw`bg-blue-100 text-[12px] p-1 rounded-md`}>
                    {route?.discount}% off
                </Text>

                <Text style={tw`text-black text-center  bg-blue-100 text-[12px] p-1 rounded-md`}>
                    {route?.vehicle?.number.toUpperCase()}
                </Text>
            </View>



            
      


            <View>
                {/* "View More" Button (Visible at the top) */}
                {!showFullCard && (
                    <TouchableOpacity
                        style={tw`flex-row items-center justify-end`}
                        onPress={() => setShowFullCard(true)} // Expands the card
                    >
                        <Text style={tw`text-blue-400 font-bold text-sm mr-1 items-center`}>
                            View More
                        </Text>
                        <ChevronDown size={20} color="#87CEEB" />
                    </TouchableOpacity>
                )}

                {/* Main Card Content */}
                {showFullCard && (
                    <View style={tw`mx-2`}>
                        {/* Expanded Content */}
                        <View style={tw`border p-2 rounded-lg border-gray-200`}>
                            <Text style={styles.cardText}>
                                Pick Up Point: {route?.pickupPoint}
                            </Text>
                            <Text style={styles.cardText}>
                                Dropping Point: {route?.dropoffPoint}
                            </Text>
                            {/* <Text style={styles.cardText}>
                                Ticket Price: {route?.ticketFare}
                            </Text> */}

                            <View>
                                <Text
                                    style={{
                                        flex: 1,
                                        fontWeight: 'bold',
                                        fontSize: 12,
                                    }}
                                >
                                    Office Address: {route?.officeAddress}
                                </Text>
                            </View>
                            <View>
                                <Text
                                    style={{
                                        flex: 1,
                                        fontWeight: 'bold',
                                        fontSize: 12,
                                        marginBottom: 4,
                                    }}
                                >
                                    Phone Pe No: {route?.phonepeNumber}
                                </Text>
                            </View>
                            {/* <View>
                                <Text
                                    style={{
                                        flex: 1,
                                        fontWeight: 'bold',
                                        fontSize: 12,
                                        marginBottom: 4,
                                    }}
                                >
                                    Discount: {route?.discount}% off
                                </Text>
                            </View> */}
                        </View>
                        <Text style={{ flex: 1, fontWeight: 'bold', color: '#87CEEB' }}>
                            Amenities:
                        </Text>

                        <View style={tw`pt-1 pb-4 border-b border-gray-200 flex-row`}>
                            {route?.amenities?.includes("wifi") && (
                                <Image
                                    source={require('@/assets/images/wifi-icon.png')}
                                    style={tw`w-[30px] h-[30px] mx-[5px]`}
                                />
                            )}
                            {route?.amenities?.includes("blanket") && (
                                <Image
                                    source={require('@/assets/images/blanket.png')}
                                    style={tw`w-[30px] h-[30px] mx-[5px]`}
                                />
                            )}
                            {/* Add other amenities similarly */}
                        </View>


                        {/* Additional Options */}
                        <View
                            style={{
                                padding: 1,
                                justifyContent: "center",
                                alignItems: "center",
                            }}
                        >
                            <View
                              style={tw`flex-row justify-between gap-2  mb-2 pt-3`}

                            >
                                <View style={{ alignItems: "center" }}>
                                    {route?.doesProvideCorierService ? (
                                        <Text style={styles.facilityBtn}>
                                            Courier Service
                                        </Text>
                                    ) : (
                                        <Text
                                            style={[
                                                styles.facilityBtn,
                                                { backgroundColor: "transparent" },
                                            ]}
                                        />
                                    )}
                                    {/* <CustomButton
                                        title="View QR Code"
                                        onPress={() => setIsQrModalVisible(route._id)}
                                    /> */}
                                </View>

                                <View style={{ alignItems: "center" }}>
                                    {route?.doesBookTrainTickets ? (
                                        <Text style={styles.facilityBtn}>
                                            Train Ticket
                                        </Text>
                                    ) : (
                                        <Text
                                            style={[
                                                styles.facilityBtn,
                                                { backgroundColor: "transparent" },
                                            ]}
                                        />
                                    )}
                                </View>

                                <View style={{ alignItems: "center" }}>
                                    {route?.doesCarryTwoWheelers ? (
                                        <Text style={styles.facilityBtn}>
                                            Two Wheeler Courier
                                        </Text>
                                    ) : (
                                        <Text
                                            style={[
                                                styles.facilityBtn,
                                                { backgroundColor: "transparent" },
                                            ]}
                                        />
                                    )}
                                    {/* <CustomButton
                                        title="View Chart"
                                        onPress={() => setIsChartModalVisible(route._id)}
                                    /> */}
                                </View>

                            </View>
                        </View>

                        {/* Send Interest Button */}
                        <View style={tw`flex flex-row items-center justify-between`}>
                            {/* Custom Buttons */}
                            <View style={tw`flex flex-row space-x-2`}>
                                <CustomButton
                                    title="View Chart"
                                    onPress={() => setIsChartModalVisible(route._id)}
                                />
                                <CustomButton
                                    title="View QR Code"
                                    onPress={() => setIsQrModalVisible(route._id)}
                                />
                            </View>

                            {/* Send Interest Button */}
                            <View>
                                {isLogged && (
                                    <TouchableOpacity
                                        style={tw`rounded-lg p-1 px-2 bg-[#50C878]`}
                                        onPress={() => setIsModalOpen(true)}
                                    >
                                        {isLoading ? (
                                            <ActivityIndicator color="#fff" />
                                        ) : (
                                            <Text style={tw`text-white text-[12px] font-bold`}>Send Interest</Text>
                                        )}
                                    </TouchableOpacity>
                                )}
                            </View>
                        </View>


                        {/* "View Less" Button (Visible at the bottom) */}
                        <TouchableOpacity
                            style={tw`flex-row items-center justify-end mt-4`}
                            onPress={() => setShowFullCard(false)} // Collapses the card
                        >
                            <Text style={tw`text-blue-400 font-bold text-sm mr-1 items-center`}>
                                View Less
                            </Text>
                            <ChevronUp size={20} color="#87CEEB" />
                        </TouchableOpacity>
                    </View>
                )}
            </View>


            <Modal
                transparent={true}
                animationType='slide'
                visible={isModalOpen}
                onRequestClose={handleCloseModal}
            >
                <View style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                }}>
                    <View style={{
                        backgroundColor: 'white',
                        padding: 20,
                        borderRadius: 10,
                        width: '80%',
                    }}>
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Name</Text>
                            <TextInput
                                style={styles.input}
                                value={userData?.userName}
                                editable={false}
                            />
                        </View><View style={styles.inputGroup}>
                            <Text style={styles.label}>Contact</Text>
                            <TextInput
                                style={styles.input}
                                value={userData?.mobileNumber}
                                editable={false}
                            />
                        </View>
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Number Of People</Text>
                            <TextInput
                                style={styles.input}
                                value={ticketRequest.numberOfPeople ? ticketRequest.numberOfPeople.toString() : ""}
                                onChangeText={(text) => setTicketRequest({ ...ticketRequest, numberOfPeople: Number(text) })}
                                keyboardType='numeric'
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Date Of Journey</Text>
                            <TouchableOpacity
                                style={styles.input}
                                onPress={() => setShowDepartureDatePicker(true)}
                            >
                                <Text>{ticketRequest.dateOfJourney ? formatDate(ticketRequest.dateOfJourney) : "Select Date"}</Text>
                            </TouchableOpacity>
                            {showDepartureDatePicker && (
                                <DateTimePicker
                                    value={ticketRequest.dateOfJourney || new Date()}
                                    mode="date"
                                    display="default"
                                    onChange={onChangeDateOfJourney}
                                />
                            )}
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Passenger Gender</Text>
                            <View style={styles.pickerContainer}>
                                <Picker
                                    selectedValue={ticketRequest.passengerGender}
                                    onValueChange={(itemValue) => setTicketRequest({ ...ticketRequest, passengerGender: itemValue })}
                                    style={styles.picker}
                                >
                                    <Picker.Item label="Select Passenger Gender" value="" />
                                    <Picker.Item label={"Male"} value={"MALE"} />
                                    <Picker.Item label={"Female"} value={"FEMALE"} />
                                    <Picker.Item label={"Family"} value={"FAMILY"} />
                                </Picker>
                            </View>
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Departure</Text>
                            <TextInput
                                style={styles.input}
                                value={route.departurePlace ? route.departurePlace : ""}
                                editable={false}
                            />
                        </View>
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Arrival</Text>
                            <TextInput
                                style={styles.input}
                                value={route.destinationPlace ? route.destinationPlace : ""}
                                editable={false}
                            />
                        </View>
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Departure Time</Text>
                            <TextInput
                                style={styles.input}
                                value={route.departureTime ? new Date(route.departureTime).toLocaleTimeString("en-US") : ""}
                                editable={false}
                            />
                        </View>
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Arrival Time</Text>
                            <TextInput
                                style={styles.input}
                                value={route.arrivalTime ? new Date(route.arrivalTime).toLocaleTimeString("en-US") : ""}
                                editable={false}
                            />
                        </View>
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Bus Number</Text>
                            <TextInput
                                style={styles.input}
                                value={route?.vehicle?.number}
                                editable={false}
                            />
                        </View>
                        <TouchableOpacity
                            style={[styles.modalButton, { backgroundColor: Colors.darkBlue, marginTop: 5 }]}
                            onPress={handleSendRequest}
                        >
                            {isLoading ? (
                                <ActivityIndicator color="#fff" />
                            ) : (
                                <Text style={[styles.modalButtonText, { color: "#fff" }]}>Send Interest</Text>
                            )}
                        </TouchableOpacity>
                    </View>
                </View>

            </Modal>

            <Modal
                transparent={true}
                visible={isQRModalVisible === route._id}
                animationType="slide"
                onRequestClose={() => setIsQrModalVisible(null)}
            >
                <View
                    style={{
                        flex: 1,
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    }}
                >
                    <View
                        style={{
                            backgroundColor: 'white',
                            padding: 20,
                            borderRadius: 10,
                            width: '80%',
                            alignItems: 'center',
                        }}
                    >
                        <Text style={{ fontSize: 16, marginBottom: 10 }}>
                        </Text>
                        <Image
                            source={{ uri: route.QR }} // Replace with your QR code image URL
                            style={{ width: 200, height: 200, marginBottom: 4 }}
                        />
                        <CustomButton
                            title="Close"
                            onPress={() => setIsQrModalVisible(null)}
                        />
                    </View>
                </View>
            </Modal>

            <Modal
                transparent={true}
                visible={isChartModalVisible === route._id}
                animationType="slide"
                onRequestClose={() => setIsChartModalVisible(null)}
            >
                <View
                    style={{
                        flex: 1,
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    }}
                >
                    <View
                        style={{
                            backgroundColor: 'white',
                            padding: 20,
                            borderRadius: 10,
                            width: '80%',
                            alignItems: 'center',
                        }}
                    >
                        <Text style={{ fontSize: 16, marginBottom: 10 }}>
                            Here is your chart:
                        </Text>
                        <Image
                            source={{ uri: route.seatingArrangement }} // Replace with your chart image URL
                            style={{ width: 200, height: 200, marginBottom: 4 }}
                        />
                        <CustomButton
                            title="Close"
                            onPress={() => setIsChartModalVisible(null)}
                        />
                    </View>
                </View>
            </Modal>



        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 15,
        backgroundColor: "#EAEAEA",
    },
    circle: {
        position: 'absolute',
        bottom: 10,
        right: 10,
        width: 70,
        height: 70,
        borderRadius: 50,
        backgroundColor: '#EEDC41',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 2,
    },
    circleText: {
        color: '#000000',
        textAlign: 'center',
        fontSize: 8,
        fontWeight: '900'
    },
    carouselImage: {
        height: deviceWidth * 0.5,
        borderRadius: 10,
        width: deviceWidth * 0.9,
    },
    notificationContainer: {
        marginVertical: 20,
        paddingHorizontal: 20,
        backgroundColor: '#51BEEE',
        borderRadius: 5,
        padding: 10,
    },
    notificationText: {
        color: '#ffffff',
        fontSize: 16,
        textAlign: 'center',
    },
    vehicleFilterContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderWidth: 1,
        borderColor: Colors.secondary,
    },
    vehiclePicker: {
        flex: 1,
        marginHorizontal: 2,
        borderColor: Colors.secondary,
        borderWidth: 1,
        borderRadius: 5,
    },
    facilityBtn: {
        fontWeight: 'bold',
        fontSize: 12,
        marginBottom: 5,
        backgroundColor: '#e6f2ff',
        paddingVertical: 5,
        paddingHorizontal: 6,
        borderRadius: 5,
    },
    searchContainer: {
        flexDirection: "row",
        alignItems: "center",
        borderRadius: 8,
        paddingHorizontal: 10,
        paddingVertical: 5,
        marginBottom: 10,
        borderColor: Colors.secondary,
        borderWidth: 1
    },
    searchInput: {
        flex: 1,
        marginLeft: 10,
        color: Colors.secondary,
    },
    addButton: {
        backgroundColor: Colors.darkBlue,
        borderRadius: 8,
        padding: 8,
        alignItems: "center",
        marginBottom: 10,
        width: 150
    },
    addButtonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    },
    routesList: {
        flex: 1,
    },
    card: {
        backgroundColor: "#fff",
        padding: 0,
        borderRadius: 5,
        marginBottom: 10,
        paddingHorizontal: 1,
        elevation: 3,
        shadowColor: "#000",
        shadowOffset: { width: 2, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
    },
    cardHeader: {
        flexDirection: "row",
        justifyContent: "flex-end",
        marginBottom: 10,
        alignItems: "center",
        gap: 5,
    },
    editButton: {
        backgroundColor: Colors.darkBlue,
        borderRadius: 5,
        padding: 5,
    },
    editButtonText: {
        color: "#fff",
        fontSize: 12,
    },
    cardText: {
        marginBottom: 1,
        color: '#000000',
        fontWeight: "600",
        fontSize: 12,
    },
    modalContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22,
    },
    modalContent: {
        width: 300,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    modalText: {
        marginBottom: 15,
        textAlign: "center",
    },
    modalButtons: {
        flexDirection: "row",
        justifyContent: "space-between",
        width: "100%",
    },
    modalButton: {
        borderRadius: 10,
        padding: 10,
        elevation: 2,
        marginHorizontal: 5,
        width: "100%",
        alignItems: "center",
    },
    modalButtonText: {
        color: "white",
        fontWeight: "bold",
    },
    overlay: {
        flex: 1,
    },
    inputGroup: {
        marginBottom: 5,
        width: "100%"
    },
    label: {
        fontSize: 16,
        marginBottom: 5,
    },
    picker: {
        width: "100%",
        height: 40,
        borderWidth: 1,
        borderColor: Colors.secondary,
        borderRadius: 5,
    },
    input: {
        borderColor: Colors.secondary,
        borderWidth: 1,
        borderRadius: 10,
        paddingHorizontal: 10,
        height: 35,
        justifyContent: 'center'
    },
    textarea: {
        minHeight: 50,
        maxHeight: 300,
        textAlignVertical: 'top',
        paddingTop: 10,
    },
    pickerContainer: {
        borderColor: Colors.secondary,
        borderWidth: 1,
        borderRadius: 10,
        overflow: 'hidden',
    },
    viewMoreButton: {
        alignItems: "center",
        marginVertical: 10,
      },
      viewMoreText: {
        color: "#87CEEB",
        fontWeight: "bold",
        fontSize: 16,
      },
});