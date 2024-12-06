import { StyleSheet, Text, View, Image, Dimensions, SafeAreaView, TextInput, ActivityIndicator, TouchableOpacity, Alert, Pressable } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Colors } from "@/constants/Colors";
import { GestureHandlerRootView, ScrollView } from 'react-native-gesture-handler';
import { FontAwesome5, MaterialIcons } from "@expo/vector-icons";
import { router } from 'expo-router';
import PhoneNumbersList from '@/components/PhoneNumberList';
import { useGlobalContext } from '@/context/GlobalProvider';
import ConfirmationModal from '@/components/Modal';
import GoToPlans from '@/components/GoToPlans';
import Carousel from '@/components/Carousel';
import tw from 'twrnc';
import { Bookmark, ChevronUp, ChevronDown } from 'lucide-react-native';



const { height } = Dimensions.get('window');
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


const holiday_yatra = () => {

  const [tours, setTours] = useState([])

  const [isLoading, setIsLoading] = useState(false);
  const { apiCaller, setRefresh, refresh, userData } = useGlobalContext();
  const [searchQuery, setSearchQuery] = useState("");
  const [notificationVisible, setNotificationVisible] = useState(true);



  const fetchTours = async () => {
    setIsLoading(true)
    try {
      const res = await apiCaller.get("/api/tour")
      // console.log(res.data.data);

      setTours(res.data.data)
    } catch (error) {
      console.log(error);
      Alert.alert("Error", "Failed to add route. Please try again.");
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (tourId: string) => {
    if (tourId) {
      try {
        await apiCaller.delete(`/api/tour?tourId=${tourId}`);
        fetchTours()
        setRefresh(prev => !prev)
        Alert.alert("Success", "Holiday Yatra deleted")
      } catch (err) {
        console.error(err);
        Alert.alert("Error", "Could not delete the holiday yatra")
      }
    }
  };


  const filterTours = (query: string) => {
    return tours.filter((tour) =>
      Object.values(tour).some((value) =>
        String(value).toLowerCase().includes(query.toLowerCase())
      )
    );
  };




  useEffect(() => {
    fetchTours()
  }, [refresh])

  useEffect(() => {
    const timer = setTimeout(() => {
      setNotificationVisible(false);
    }, 10000);

    return () => clearTimeout(timer);
  }, []);

  if (!userData?.isSubsciptionValid && Date.now() >= new Date(userData?.trialValidTill).getTime()) {
    return <GoToPlans />;
  }

  return (
    <GestureHandlerRootView style={tw`flex-1`}>
    <SafeAreaView style={tw`flex-1 p-4 mb-10 bg-[#EAEAEA]`}>

    <TouchableOpacity onPress={() => router.push("add_holiday_yatra")} style={tw`bg-[${Colors.darkBlue}] rounded-lg w-[60%]  items-center mb-3 text-[12px]`}>
          <Text style={tw`text-white font-bold text-[16px] p-1 `}>Create Holidays and Yatra</Text>
        </TouchableOpacity>

      
      <ScrollView>
        <View style={tw`flex-row bg-[#fff] items-center  border-secondary rounded-lg px-4 py-2 mb-5`}>
          <TouchableOpacity>
            <FontAwesome5 name="search" size={18} color={Colors.secondary} />
          </TouchableOpacity>
          <TextInput
            style={tw`flex-1 ml-2 text-secondary bg-[#fff]`}
            placeholder="Search Tour Name"
            placeholderTextColor={Colors.secondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>


        {notificationVisible && (
          <View style={tw`my-5 px-5 py-3 bg-[#51BEEE] rounded-lg`}>
            <Pressable onPress={() => setNotificationVisible(false)}>
              <FontAwesome5 name="times-circle" size={18} color="#fff" style={tw`self-end`} />
            </Pressable>
            <Text style={tw`text-white text-center text-base`}>
              Here added cards will be shown on customer app
            </Text>
          </View>
        )}

        {isLoading ? (
          <ActivityIndicator size="large" color={Colors.darkBlue} />
        ) : (
          filterTours(searchQuery).map((tour) => (
            <TourCard key={tour._id} tour={tour} handleDelete={handleDelete} />
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  </GestureHandlerRootView>
  );
};

export default holiday_yatra;

const TourCard = ({ tour, handleDelete }: any) => {

  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState<boolean>(false)
  const { setEditData } = useGlobalContext();
  const [showFullCard, setShowFullCard] = useState(false);



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

    return  days+"D" + "/"+ nights + "N";
  };
  return (
    <>
     <View style={tw`flex-row justify-end gap-2 mb-2 items-center space-x-1`}>
          <TouchableOpacity onPress={() => { setEditData(tour); router.push("edit_holiday_yatra") }} style={tw`bg-[${Colors.darkBlue}] rounded-lg p-2`}>
            <Text style={tw`text-white text-xs`}>Edit Tour</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={handleOpenModal} style={tw`bg-[${Colors.darkBlue}] rounded-lg p-2`}>
            {/* <MaterialIcons name="delete" size={24} color={Colors.darkBlue} /> */}
            <Text style={tw`text-white text-xs`}>Delete</Text>
          </TouchableOpacity>
        </View>

      <View style={tw`bg-white  rounded-lg mb-5 shadow-lg`}>
       
        {/* <Image source={{ uri: tour.photo }} height={350} /> */}

        <Carousel images={tour.photos} height={200} />
           <View style={tw`p-2`}>
              {/* <Text style={tw`items-start text-center mb-0.5 text-[#042F40] font-bold text-xl`}>{tour?.agencyName}<Text style={{ color: "black" }}></Text></Text> */}
              
              <View style={tw`flex flex-row text-[#042F40] justify-between items-center px-2`}>
                <View>
                  <Text style={tw` text-[#042F40] text-[14px] font-bold`}>{tour?.agencyName}</Text>
                 
                </View>
                <View style={{ justifyContent: 'flex-end' }}>            
                  <Text style={tw`text-[#171717] font-bold text-[14px]`}>{tour?.location}</Text>
                </View>
              </View>

                <View style={tw`border border-gray-200 p-2 rounded-md`}>
                  <View style={tw`flex flex-row justify-between`}>
                    <Text style={tw`text-[#7D7D7D]`}>Trip Name</Text>
                    <Text style={tw`font-bold text-[#FF5C00]`}>{tour?.name}</Text>
                  </View>
                  <View style={tw`flex flex-row justify-between`}>
                    <Text style={tw`text-[#7D7D7D]`}>Duration</Text>
                    <Text style={tw`font-bold text-[12px]`}>{calculateDaysAndNights(tour?.departureDate, tour?.arrivalDate)}</Text>
                  </View>
                  <View style={tw`flex flex-row justify-between`}>
                    <Text style={tw`text-[#7D7D7D]`}>Dates</Text>
                    <Text style={tw`font-bold text-[12px]`}>{formatDate(tour?.departureDate)} - {formatDate(tour?.arrivalDate)}</Text>
                  </View>


                    {/* <Text style={styles.cardText}>Dates: <Text style={{ color: "black" }}>{calculateDaysAndNights(tour?.departureDate, tour?.arrivalDate)}</Text></Text> */}
                </View>

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


        {showFullCard && (
          <View>
                     {/* <Text style={styles.cardText}>Departure Date: <Text style={tw``}></Text></Text> */}
                    {/* <Text style={styles.cardText}>Arrival Date: <Text style={{ color: "black" }}></Text></Text> */}
                    <Text style={tw`items-start mb-1 text-secondary font-medium mt-2 text-xs`}>Booking last date: <Text style={{ color: "black" }}>{formatDate(tour?.lastDateToBook)}</Text></Text>
                    <Text style={tw`items-start mb-1 text-secondary font-medium border-b pb-2 border-gray-200  text-xs`}>Experience: <Text style={{ color: "black" }}>{tour?.experience}</Text></Text>
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
                    <View style={tw`text-[12px] border border-gray-200 p-2 rounded-xl mb-2`}>
                      <Text style={tw`text-[14px] font-bold `}>Trip Details</Text>
                      <Text style={tw`text-[12px] `}>{tour?.description}</Text>

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
                  <Text style={tw`items-start  text-[${Colors.secondary}] font-medium mt-2 text-xs`}>Office Address:  </Text>
                  <Text style={{ color: "black" }}>{tour?.officeAddress}</Text>
                </View>
                <View style={tw`flex flex-row gap-2`}>
                      <View style={tw`bg-[#1C15E41A] p-1 flex-row items-center rounded-xl mt-2`}>
                          <Text style={tw`font-bold text-[#171717] text-[14px]`}>{tour?.price?.forPerson}/- </Text>
                          <Text style={tw`text-xs`}>per person</Text>
                      </View>
                      <View style={tw`bg-[#1C15E41A] p-1 flex-row items-center rounded-xl mt-2`}>
                          <Text style={tw`font-bold text-[#171717] text-[14px]`}>{tour?.price?.forCouple}/- </Text>
                          <Text style={tw`text-xs`}>per couple</Text>
                      </View>
                    
                </View>

               {/* View Less Button */}
                <TouchableOpacity
                style={tw`flex-row items-center justify-end mt-4`}
                onPress={() => setShowFullCard(false)} // Collapse the card
              >
                <Text style={tw`text-blue-400 font-bold text-sm mr-1`}>
                  View Less
                </Text>
                <ChevronUp size={20} color="#87CEEB" />
              </TouchableOpacity>
            </View>

          )}

          </View>

      </View>

      <ConfirmationModal actionBtnText='Delete' closeModal={handleCloseModal} handler={() => { handleDelete(tour._id); setIsDeleteModalVisible(false) }} isVisible={isDeleteModalVisible} message='Are you sure you want to delete holiday yatra' />
    </>
  )
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
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
  card: {
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 5,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    marginBottom: 20,

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
    alignItems: "flex-start",
    marginBottom: 1,
    color: Colors.secondary,
    fontWeight: "500",
    fontSize: 12,
  },
  image: {
    width: '100%',
    height: height * 0.3,
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
  cardList: {

  }
});
