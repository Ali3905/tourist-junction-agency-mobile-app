import { ActivityIndicator, Dimensions, Image, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, View, TouchableOpacity, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useGlobalContext } from '@/context/GlobalProvider'
import { Colors } from '@/constants/Colors'
// import Carousel from 'react-native-reanimated-carousel'
import Carousel from './Carousel'
import CustomButton from "@/components/CustomButton"
import { FontAwesome5, MaterialIcons } from '@expo/vector-icons'
import { City } from 'country-state-city'
import { Picker } from '@react-native-picker/picker'
import GoToLogin from '@/components/GoToLogin'

const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;

export default function FavouriteBusTicketsScreen() {

    const [dailyRoutes, setDailyRoutes] = useState<DailyRoute[]>([])
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const { apiCaller, refresh } = useGlobalContext()
    const cities = City.getCitiesOfCountry("IN")
    const [selectedDepPlace, setSelectedDepPlace] = useState<string>("")
    const [selectedDestPlace, setSelectedDestPlace] = useState<string>("")



    const fetchDailyRoutes = async () => {
        try {
            setIsLoading(true)
            const res = await apiCaller.get("/api/busRoute/favouriteBusRoutes")
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
    }, [refresh])

    const filterDailyRoutes = () => {
        return dailyRoutes.filter((route) => {
            return !selectedDepPlace ? true : route.departurePlace.toLowerCase().includes(selectedDepPlace.toLowerCase()) && !selectedDestPlace ? true : route.destinationPlace.toLowerCase().includes(selectedDestPlace.toLowerCase())
        })
    }

    const filteredRoutes = selectedDepPlace || selectedDestPlace ? filterDailyRoutes() : dailyRoutes

    if (!filteredRoutes || filteredRoutes.length < 1 && !isLoading ) {
        return <Text style={{ textAlign: "center", marginTop: 10 }}>No Favourite Routes</Text>
    }


    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.vehicleFilterContainer}>
                <Picker
                    selectedValue={selectedDepPlace}
                    style={styles.vehiclePicker}
                    onValueChange={item => setSelectedDepPlace(item)}
                >
                    <Picker.Item label="All Cities" value="" />
                    {
                        cities?.map((city) => (
                            <Picker.Item label={city.name} value={city.name} />
                        ))
                    }
                </Picker>
            </View>
            <View style={styles.vehicleFilterContainer}>
                <Picker
                    selectedValue={selectedDestPlace}
                    style={styles.vehiclePicker}
                    onValueChange={item => setSelectedDestPlace(item)}
                >
                    <Picker.Item label="All Cities" value="" />
                    {
                        cities?.map((city) => (
                            <Picker.Item label={city.name} value={city.name} />
                        ))
                    }
                </Picker>
            </View>



            {isLoading ? (
                <ActivityIndicator size="large" color={Colors.darkBlue} />
            ) : (
                <ScrollView style={styles.routesList}>
                    {filteredRoutes?.map((route) => (
                        <BusTicketCard route={route} />
                    ))}
                </ScrollView>
            )}
        </SafeAreaView>
    )
}

function BusTicketCard({ route }: { route: DailyRoute }) {
    const [isQRModalVisible, setIsQrModalVisible] = useState<string | null>(null);
    const [isDriverModalVisible, setIsDriverModalVisible] = useState<string | null>(null);
    const [isChartModalVisible, setIsChartModalVisible] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false)
    const { apiCaller, setRefresh, isLogged } = useGlobalContext()

    const handleAddToFavourite = async (id: string) => {
        setIsLoading(true)
        try {
            const res = await apiCaller.delete(`/api/busRoute/removeFromFavourite?routeId=${id}`)
            Alert.alert("Success", "This route have been removed from the favourites")
            setRefresh(prev => !prev)
        } catch (error: any) {
            console.log(error?.response?.data?.message || error);
            Alert.alert("Error", error?.response?.data?.message || "Could not remove from favourites")
        } finally {
            setIsLoading(false)
        }
    }
    if (!isLogged) {
        return <GoToLogin />
    }

    return (
        <View key={route._id} style={styles.card}>

            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <View style={{ position: 'relative' }}>
                    <Carousel
                        // width={deviceWidth * 0.9}
                        // height={deviceWidth * 0.6}
                        // autoPlay
                        // data={route?.vehicle?.photos}
                        // renderItem={({ item }) => (
                        //     <Image source={{ uri: item }} style={styles.carouselImage} />
                        // )}
                        images={route?.vehicle?.photos}
                        height={deviceWidth * 0.6}
                    />
                    <View style={styles.circle}>
                        <Text style={styles.circleText}>{route?.vehicle.isAC ? "AC" : "Non-AC"}</Text>
                        <Text style={styles.circleText}>{route?.vehicle.isSleeper ? "Sleeper" : "Seater"}</Text>
                        <Text style={styles.circleText}>{route?.vehicle?.number?.toUpperCase()}</Text>
                    </View>
                </View>
            </View>
            <View >
                <Text
                    style={{
                        fontSize: 20,
                        fontWeight: '900',
                        color: '#87CEEB',
                        fontFamily: 'sans-serif',
                        textAlign: 'center'
                    }}
                >
                    {route?.agencyName}
                </Text>
            </View>


            <View style={{ width: "100%", paddingHorizontal: 40 }}>
                {/* Departure and Arrival Labels */}
                <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                    {/* Departure Label */}
                    <View style={{ alignItems: "flex-start" }}>
                        <Text style={{ fontWeight: "bold", fontSize: 15 }}>Departure</Text>
                    </View>

                    {/* Arrival Label */}
                    <View style={{ alignItems: "flex-start" }}>
                        <Text style={{ fontWeight: "bold", fontSize: 15, paddingRight: 13 }}>Arrival</Text>
                    </View>
                </View>

                {/* Departure and Arrival Places with Times */}
                <View style={{ flexDirection: "row", justifyContent: "space-between", marginVertical: 1 }}>
                    {/* Departure Place and Time */}
                    <View style={{ alignItems: "center" }}>
                        <Text style={{ fontWeight: "bold", fontSize: 18, color: "#87CEEB" }}>
                            {route?.departurePlace}
                        </Text>
                        <Text>{route.departureTime ? new Date(route.departureTime).toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true }) : "Time not added"}</Text>
                    </View>

                    {/* Arrow Icon */}
                    <MaterialIcons name="keyboard-double-arrow-right" size={24} color="#00008B" />

                    {/* Arrival Place and Time */}
                    <View style={{ alignItems: "center" }}>
                        <Text style={{ fontWeight: "bold", fontSize: 18, color: "#87CEEB" }}>
                            {route?.destinationPlace}
                        </Text>
                        <Text style={{ marginBottom: 14 }} >{route.arrivalTime ? new Date(route.arrivalTime).toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true }) : "Time not added"}</Text>
                    </View>
                </View>
            </View>
            {/* 
        <Text style={styles.cardText}>
          Vehicle Number: <Text style={{ color: "black" }}>{route.vehicle.number.toUpperCase()}</Text>
        </Text> */}


            <Text style={styles.cardText}>
                Pick Up Point: {route?.pickupPoint}
            </Text>
            <Text style={styles.cardText}>
                Dropping Point: {route?.dropoffPoint}
            </Text>
            <Text style={styles.cardText}>
                Ticket Price: {route?.ticketFare}
            </Text>

            <View>
                <Text style={{ flex: 1, fontWeight: 'bold', fontSize: 12, }}>Office Address: {route?.officeAddress} </Text>
            </View>
            <View>
                <Text style={{ flex: 1, fontWeight: 'bold', fontSize: 12, marginBottom: 4 }}>Phone Pe No: {route?.phonepeNumber} </Text>
            </View>
            <View>
                <Text style={{ flex: 1, fontWeight: 'bold', fontSize: 12, marginBottom: 4 }}>Discount: {route?.discount}% </Text>
            </View>
            <Text style={{ flex: 1, fontWeight: 'bold', color: '#87CEEB' }}>Amenities:</Text>
            <View style={{
                paddingTop: 1,
                paddingBottom: 14,
                flexDirection: 'row',

            }}>

                {route?.amenities?.includes("wifi") && <Image
                    source={require('@/assets/images/wifi-icon.png')}
                    style={{ width: 30, height: 30, marginHorizontal: 5 }}
                />}
                {route?.amenities?.includes("blanket") && <Image
                    source={require('@/assets/images/blanket.png')}
                    style={{ width: 30, height: 30, marginHorizontal: 5 }}
                />}
                {route?.amenities?.includes("bottle") && <Image
                    source={require('@/assets/images/bottle.png')}
                    style={{ width: 30, height: 30, marginHorizontal: 5 }}
                />}
                {route?.amenities?.includes("charger") && <Image
                    source={require('@/assets/images/charger.png')}
                    style={{ width: 30, height: 30, marginHorizontal: 5 }}
                />}
                {route?.amenities?.includes("meal") && <Image
                    source={require('@/assets/images/meal.png')}
                    style={{ width: 30, height: 30, marginHorizontal: 5 }}
                />}
                {route?.amenities?.includes("pillow") && <Image
                    source={require('@/assets/images/pillow.png')}
                    style={{ width: 30, height: 30, marginHorizontal: 5 }}
                />}
                {route?.amenities?.includes("tv") && <Image
                    source={require('@/assets/images/tv.png')}
                    style={{ width: 30, height: 30, marginHorizontal: 5 }}
                />}
            </View>

            <View style={{ padding: 1 }}>
                {/* <PhoneNumbersList phoneNumbers={route?.mobileNumbers} /> */}
            </View>
            {/* <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: 1,
              }}
            >
              <Text style={{ flex: 1, fontWeight: 'bold', color: '#87CEEB' }}>Courier Services</Text>
              <Text style={{ flex: 1, fontWeight: 'bold', color: '#87CEEB' }}>Train Ticket</Text>
              <Text style={{ flex: 1, fontWeight: 'bold', color: '#87CEEB' }}>Two Wheeler Courier</Text>
            </View> */}
            <View
                style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >

                <View style={{ padding: 1 }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20, paddingTop: 14 }}>
                        {/* Column for Courier Service and QR Code Button */}
                        <View style={{ alignItems: 'center' }}>
                            {route?.doesProvideCorierService ? <Text style={styles.facilityBtn}>
                                Courier Service
                            </Text> : <Text style={[styles.facilityBtn, { backgroundColor: "transparent" }]}>

                            </Text>}
                            <CustomButton
                                title="View QR Code"
                                onPress={() => setIsQrModalVisible(route._id)}
                            />
                        </View>

                        {/* Column for Train Ticket and Driver Button */}
                        <View style={{ alignItems: 'center' }}>
                            {route?.doesBookTrainTickets ? <Text style={styles.facilityBtn}>
                                Train Ticket
                            </Text> : <Text style={[styles.facilityBtn, { backgroundColor: "transparent" }]}>

                            </Text>}
                            <CustomButton
                                title="View Driver"
                                onPress={() => setIsDriverModalVisible(route._id)}
                            />
                        </View>

                        {/* Column for Two Wheeler Courier and Chart Button */}
                        <View style={{ alignItems: 'center' }}>
                            {route?.doesCarryTwoWheelers ? <Text style={styles.facilityBtn}>
                                Two Wheeler Courier
                            </Text> : <Text style={[styles.facilityBtn, { backgroundColor: "transparent" }]}>

                            </Text>}
                            <CustomButton
                                title="View Chart"
                                onPress={() => setIsChartModalVisible(route._id)}
                            />
                        </View>
                    </View>
                    <View style={styles.modalButtons}>
                        <TouchableOpacity
                            style={[styles.modalButton, { backgroundColor: Colors.darkBlue }]}
                            onPress={() => handleAddToFavourite(route._id)}
                        >
                            {isLoading ? (
                                <ActivityIndicator color="#fff" />
                            ) : (
                                <Text style={[styles.modalButtonText, { color: "#fff" }]}>Remove From Favourite</Text>
                            )}
                        </TouchableOpacity>
                    </View>
                </View>
            </View>



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
        width: 120
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
        padding: 4,
        borderRadius: 5,
        marginBottom: 10,
        paddingHorizontal: 8,
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
        marginBottom: 15,
        width: "100%"
    },
    label: {
        fontSize: 16,
        marginBottom: 5,
    },
    picker: {
        width: "100%",
        height: 50,
        borderWidth: 1,
        borderColor: Colors.secondary,
        borderRadius: 5,
    },
    input: {
        borderColor: Colors.secondary,
        borderWidth: 1,
        borderRadius: 10,
        paddingHorizontal: 10,
        height: 40,
        justifyContent: 'center'
    },
    textarea: {
        minHeight: 50,
        maxHeight: 300,
        textAlignVertical: 'top',
        paddingTop: 10,
    },
});