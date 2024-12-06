import { ActivityIndicator, Alert, Dimensions, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useGlobalContext } from '@/context/GlobalProvider'
import { router } from 'expo-router'
// import Carousel from 'react-native-reanimated-carousel'
import Carousel from './Carousel'
import { Colors } from '@/constants/Colors'
import { City } from 'country-state-city'
import { Picker } from '@react-native-picker/picker'
import GoToLogin from '@/components/GoToLogin'
import PhoneNumbersList from '@/components/PhoneNumberList'
import tw from 'twrnc';
import ConfirmationModal from '@/components/Modal'

const amenitiesValues = [
    "LOADGE",
    "HALL",
    "DHARMA-SHALA",
    "HOT-WATER",
    "WATER-BOTTLE",
    "MINERAL-WATER",
    "BREAKFAST",
    "TEA",
    "LUNCH",
    "DINNER",
    "AUTO",
    "TAXI",
    "BOATING",
    "GUIDE-FEE",
    "VISIT-FEE",
    "SIGHT-SEEING-FEE",
    "2-TIME-MEAL"
  ];

const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;

export default function FavouriteHolidayYatraScreen() {
    const [tours, setTours] = useState<Tour[]>([])

    const [isLoading, setIsLoading] = useState<boolean>(true)
    const { apiCaller, refresh, isLogged } = useGlobalContext()

    const [selectedLocation, setSelectedLocation] = useState<string>("")

    const cities = City.getCitiesOfCountry("IN")

    const fetchTours = async () => {
        setIsLoading(true)
        try {
            const res = await apiCaller.get("/api/tour/customer/favouriteTours")
            setTours(res.data.data)
        } catch (error: any) {
            console.log(error);
            console.log(error.response.data.message);
            Alert.alert("Error", "Failed to fetch tours. Please try again.");
        } finally {
            setIsLoading(false)
        }
    }


    const filterTours = () => {
        return tours.filter((tour) =>
            !selectedLocation ? true : tour.location?.toLowerCase().includes(selectedLocation.toLocaleLowerCase())
        );
    };

    const filteredTours = selectedLocation ? filterTours() : tours


    useEffect(() => {
        fetchTours()
    }, [refresh])
    
    if (!isLogged) {
        return <GoToLogin />
    }
    if (!isLoading && (!filteredTours || filteredTours.length < 1)) {
        return <Text style={{ textAlign: "center", marginTop: 10 }}>No Favourite Tours to show</Text>
    }


    return (
        <View style={styles.container}>
            <View style={styles.vehicleFilterContainer}>
                <Picker
                    selectedValue={selectedLocation}
                    style={styles.vehiclePicker}
                    onValueChange={item => setSelectedLocation(item)}
                >
                    <Picker.Item label="All Cities" value="" />
                    {
                        cities?.map((city) => (
                            <Picker.Item label={city.name} value={city.name} />
                        ))
                    }
                </Picker>
            </View>
            {
                isLoading ? (
                    <ActivityIndicator size="large" color={Colors.darkBlue} />
                ) :
                    <ScrollView style={styles.routesList}>
                        {filteredTours.map((tour) => {
                            return <TourCard tour={tour} />
                        })}
                    </ScrollView>
            }
        </View>
    )
}

const TourCard = ({ tour, handleDelete }: any) => {

    const [isDeleteModalVisible, setIsDeleteModalVisible] = useState<boolean>(false)
    const { isLogged, apiCaller, setRefresh } = useGlobalContext();
    const [isLoading, setIsLoading] = useState(false)


    const handleCloseModal = () => {
        setIsDeleteModalVisible(false)
    }

    const handleOpenModal = () => {
        setIsDeleteModalVisible(true)
    }

    function formatDate(dateString: string): string {
        const date = new Date(dateString);
        const year = date.getUTCFullYear();
        const month = date.getUTCMonth() + 1;
        const day = date.getUTCDate();
        return `${month}/${day}/${year}`;
    }
    const calculateDaysAndNights = (departureDate, arrivalDate) => {
        const departure = new Date(departureDate);
        const arrival = new Date(arrivalDate);

        // Calculate the difference in milliseconds
        const differenceInMs = arrival - departure;

        // Convert milliseconds to days
        const days = Math.floor(differenceInMs / (1000 * 60 * 60 * 24));

        // Calculate nights as one less than the number of days
        const nights = days - 1;

        return days + "D" + "/" + nights + "N";
    };
    const handleAddToFavourite = async (id: string) => {
        setIsLoading(true)
        try {
            const res = await apiCaller.delete(`/api/tour/removeFromFavourite?tourId=${id}`)
            Alert.alert("Success", "This tour have been removed from the favourites")
            setRefresh(prev => !prev)
        } catch (error: any) {
            console.log(error?.response?.data?.message || error);
            Alert.alert("Error", error?.response?.data?.message || "Could not add to favourites")
        } finally {
            setIsLoading(false)
        }
    }
    return (
        <>
            <View style={tw`bg-white p-1 rounded-lg mb-5 shadow-lg`}>
                {/* <View style={tw`flex-row justify-end gap-2 mb-2 items-center space-x-1`}>
            <TouchableOpacity onPress={() => { setEditData(tour); router.push("edit_holiday_yatra") }} style={tw`bg-[${Colors.darkBlue}] rounded-lg p-2`}>
              <Text style={tw`text-white text-xs`}>Edit Tour</Text>
            </TouchableOpacity>
  
            <TouchableOpacity onPress={handleOpenModal} style={tw`bg-[${Colors.darkBlue}] rounded-lg p-2`}>
              <MaterialIcons name="delete" size={24} color={Colors.darkBlue} />
              <Text style={tw`text-white text-xs`}>Delete</Text>
            </TouchableOpacity>
          </View> */}
                {/* <Image source={{ uri: tour.photo }} height={350} /> */}

                <Carousel images={tour.photos} height={500} />

                <Text style={tw`items-start text-center mb-0.5 text-[#042F40] font-bold text-xl`}>{tour?.agencyName}<Text style={{ color: "black" }}></Text></Text>

                <View style={tw`flex flex-row text-[#042F40] justify-between items-center px-2`}>
                    <View>
                        <Text style={tw`text-xl text-[#042F40] font-bold`}>{tour?.agencyName}</Text>
                        <Text style={tw`text-[12px]`}>{tour?.description}</Text>
                    </View>
                    <View style={{ justifyContent: 'flex-end' }}>
                        <Text style={tw`text-[#171717] font-bold text-xl`}>{tour?.location}</Text>
                    </View>
                </View>

                <View style={tw`border border-gray-200 p-2 rounded-md`}>
                    <View style={tw`flex flex-row justify-between`}>
                        <Text style={tw`text-[#7D7D7D]`}>Trip Name</Text>
                        <Text style={tw`font-bold text-[#FF5C00]`}>{tour?.name}</Text>
                    </View>
                    <View style={tw`flex flex-row justify-between`}>
                        <Text style={tw`text-[#7D7D7D]`}>Duration</Text>
                        <Text style={tw`font-bold `}>{calculateDaysAndNights(tour?.departureDate, tour?.arrivalDate)}</Text>
                    </View>
                    <View style={tw`flex flex-row justify-between`}>
                        <Text style={tw`text-[#7D7D7D]`}>Dates</Text>
                        <Text style={tw`font-bold `}>{formatDate(tour?.departureDate)} - {formatDate(tour?.arrivalDate)}</Text>
                    </View>


                    {/* <Text style={styles.cardText}>Dates: <Text style={{ color: "black" }}>{calculateDaysAndNights(tour?.departureDate, tour?.arrivalDate)}</Text></Text> */}
                </View>


                {/* <Text style={styles.cardText}>Departure Date: <Text style={tw``}></Text></Text> */}
                {/* <Text style={styles.cardText}>Arrival Date: <Text style={{ color: "black" }}></Text></Text> */}
                <Text style={styles.cardText}>Booking last date: <Text style={{ color: "black" }}>{formatDate(tour?.lastDateToBook)}</Text></Text>
                <Text style={styles.cardText}>Booking last date: <Text style={{ color: "black" }}>{tour?.experience}</Text></Text>
                {/* <Text style={styles.cardText}>Price Per Person: <Text style={{ color: "black" }}>{tour?.price?.forPerson}</Text></Text> */}
                {/* <Text style={styles.cardText}>Price Per Couple: <Text style={{ color: "black" }}>{tour?.price?.forCouple}</Text></Text> */}
                <View style={tw`p-1 flex flex-wrap`}>
                    <Text style={tw`font-bold text-[#27272A]`}>Contact</Text>
                    {tour.mobileNumbers ? (
                        <PhoneNumbersList phoneNumbers={tour?.mobileNumbers} />
                    ) : (
                        <Text>No Mobile Number</Text>
                    )}
                </View>

                <View style={tw`flex flex-col p-2 border rounded-xl border-gray-200`}>
                    <Text style={tw`text-blue font-bold`}>Package Include:</Text>
                    <View style={tw`flex-row flex-wrap text-sm gap-2 mt-2 font-medium text-xs`}>
                        {tour?.amenities?.map((amenity: string, index) => (
                            <Text key={index} style={tw`text-[#101010] p-1 rounded-md text-xs bg-[#C8C8F44D]`}>
                                {amenity}
                            </Text>
                        ))}
                    </View>
                </View>
                <View style={tw`flex border mt-2 p-2 rounded-xl flex-col border-gray-200`}>
                    <Text style={tw`text-secondary font-semibold `}>Package Not Include:</Text>
                    <View style={tw`flex-row flex-wrap text-xs gap-2 mt-2`}>
                        {amenitiesValues?.map((amenity: string, index) => {
                            if (!tour.amenities.includes(amenity)) {
                                return (
                                    <Text key={index} style={tw`text-[#101010] p-1 rounded-md text-xs bg-[#C8C8F44D]`}>
                                        {amenity}
                                    </Text>
                                );
                            }
                        })}
                    </View>
                </View>
                <View style={tw`mt-2 border rounded-xl p-2 border-gray-200`}>
                    <Text style={tw`text-secondary font-medium text-xs mb-1`}>Travelling With:</Text>
                    <View style={tw`flex-row flex-wrap text-xs gap-2`}>
                        {
                            tour?.travellingWith?.map((veh: string, index) => (
                                <Text key={index} style={tw`text-[#101010] p-1 rounded-md text-xs bg-[#C8C8F44D]`}>{veh}</Text>
                            ))
                        }
                    </View>

                </View>

                <View style={tw`mt-2 border rounded-xl border-gray-200 p-2`}>
                    <Text style={tw`text-secondary font-medium text-xs mb-1`}>Bookings accepted from:</Text>
                    <View style={tw`flex-row flex-wrap gap-2`}>
                        {
                            tour?.acceptedCities?.map((city: string, index) => (
                                <Text key={index} style={tw`text-[#101010] p-1 rounded-md text-xs bg-[#C8C8F44D]`}>{city}</Text>
                            ))
                        }
                    </View>
                </View>

                <View>
                    <Text style={tw`items-start  text-[${Colors.secondary}] font-medium text-xs`}>Office Address:  </Text>
                    <Text style={{ color: "black" }}>{tour?.officeAddress}</Text>
                </View>
                <View style={tw`flex flex-row gap-2`}>
                    <View style={tw`bg-[#1C15E41A] p-2 flex-row items-center rounded-xl mt-2`}>
                        <Text style={tw`font-bold text-[#171717] text-[18px]`}>{tour?.price?.forPerson}/- </Text>
                        <Text style={tw`text-xs`}>per person</Text>
                    </View>
                    <View style={tw`bg-[#1C15E41A] p-2 flex-row items-center rounded-xl mt-2`}>
                        <Text style={tw`font-bold text-[#171717] text-[18px]`}>{tour?.price?.forCouple}/- </Text>
                        <Text style={tw`text-xs`}>per couple</Text>
                    </View>

                </View>

            {isLogged && <View style={styles.modalButtons}>
                <TouchableOpacity
                    style={[styles.modalButton, { backgroundColor: Colors.darkBlue }]}
                    onPress={() => handleAddToFavourite(tour._id)}
                >
                    {isLoading ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Text style={[styles.modalButtonText, { color: "#fff" }]}>Remove From Favourite</Text>
                    )}
                </TouchableOpacity>
            </View>}
            </View>

            <ConfirmationModal actionBtnText='Delete' closeModal={handleCloseModal} handler={() => { handleDelete(tour._id); setIsDeleteModalVisible(false) }} isVisible={isDeleteModalVisible} message='Are you sure you want to delete holiday yatra' />
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 15,
        backgroundColor: "#EAEAEA",
    },
    searchContainer: {
        flexDirection: "row",
        alignItems: "center",
        borderColor: Colors.secondary,
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 15,
        marginBottom: 20,
        paddingVertical: 5,
    },
    searchInput: {
        flex: 1,
        marginLeft: 10,
        color: Colors.secondary,
    },
    carouselImage: {
        height: deviceWidth * 0.5,
        borderRadius: 10,
        width: deviceWidth * 0.9,
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

    notificationContainer: {
        marginVertical: 20,
        paddingHorizontal: 20,
        backgroundColor: '#51BEEE',
        borderRadius: 5,
        padding: 10,
    },
    routesList: {
        flex: 1
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
        color: Colors.secondary,
        fontWeight: "500",
        fontSize: 12,
    },
    image: {
        width: '100%',
        height: deviceHeight * 0.3,
    },
    addButton: {
        backgroundColor: Colors.darkBlue,
        borderRadius: 8,
        padding: 8,
        paddingHorizontal: 1,
        alignItems: "center",
        marginBottom: 10,
        width: 200
    },
    addButtonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
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
});