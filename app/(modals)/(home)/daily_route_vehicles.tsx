import React, { useEffect, useState } from "react";
import {
  View,
  Modal,
  StyleSheet,
  TouchableOpacity,
  Text,
  TouchableWithoutFeedback,
  TextInput,
  SafeAreaView,
  ScrollView,
  Alert,
  ActivityIndicator,
  Button,
  Image,
  Pressable
} from "react-native";
import { BlurView } from 'expo-blur';
import { Colors } from "@/constants/Colors";

import { router } from "expo-router";
import { useGlobalContext } from "@/context/GlobalProvider";
import { Picker } from '@react-native-picker/picker';
import Carousel from "@/components/Carousel";
import CustomButton from "@/components/CustomButton"
import { FontAwesome5, MaterialIcons } from "@expo/vector-icons";
import PhoneNumbersList from "@/components/PhoneNumberList";
import Icon from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import GoToPlans from "@/components/GoToPlans";
import tw from 'twrnc';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';
import { Bookmark, ChevronUp, ChevronDown } from 'lucide-react-native';


const shareImage = async (imageUri: string) => {
  try {

    const fileUri = FileSystem.documentDirectory + imageUri.split('/').pop();
    await FileSystem.downloadAsync(imageUri, fileUri);
    // return fileUri;



    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(fileUri);
    } else {
      alert('Sharing is not available on this device');
    }
  } catch (error) {
    console.error('Error sharing images:', error);
  }
};


interface BlurOverlayProps {
  visible: boolean;
  onRequestClose: () => void;
}

const BlurOverlay: React.FC<BlurOverlayProps> = ({ visible, onRequestClose }) => (
  <Modal
    animationType="fade"
    transparent={true}
    visible={visible}
    onRequestClose={onRequestClose}
  >
    <TouchableWithoutFeedback onPress={onRequestClose}>
      <BlurView intensity={90} tint="light" style={styles.overlay} />
    </TouchableWithoutFeedback>
  </Modal>
);

function timestampToTime(timestamp: string): string {
  const date = new Date(timestamp);
  let hours = date.getUTCHours();
  const minutes = date.getUTCMinutes().toString().padStart(2, '0');
  const seconds = date.getUTCSeconds().toString().padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';

  hours = hours % 12;
  hours = hours ? hours : 12;
  const formattedHours = hours.toString().padStart(2, '0');

  return `${formattedHours}:${minutes}:${seconds} ${ampm}`;
}

const DailyRouteVehicles: React.FC = () => {
  const [dailyRoutes, setDailyRoutes] = useState<DailyRoute[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showAddDriverModal, setShowAddDriverModal] = useState(false);
  const [selectedRoute, setSelectedRoute] = useState<DailyRoute | null>(null);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [cleaners, setCleaners] = useState<Cleaner[]>([]);
  const [selectedPrimaryDriver, setSelectedPrimaryDriver] = useState<string>("");
  const [selectedSecondaryDriver, setSelectedSecondaryDriver] = useState<string>("");
  const [selectedCleaner, setSelectedCleaner] = useState<string>("");
  const [instruction, setInstruction] = useState("")

  const [searchQuery, setSearchQuery] = useState("");
  const { apiCaller, setEditData, refresh, userData } = useGlobalContext();
  const [inputHeight, setInputHeight] = useState(50);
  // const [modalVisible, setModalVisible] = useState(false);

  const [isQRModalVisible, setIsQrModalVisible] = useState<string | null>(null);
  const [isDriverModalVisible, setIsDriverModalVisible] = useState<string | null>(null);
  const [isChartModalVisible, setIsChartModalVisible] = useState<string | null>(null);
  const [notificationVisible, setNotificationVisible] = useState(true);

  const [discountAmount, setDiscountAmount] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  
  const [showFullCard, setShowFullCard] = useState(false);



  // const handleOpenModal = () => {
  //   if (!modalVisible) {
  //     setModalVisible(true);
  //   }
  // };

  const fetchDailyRoutes = async () => {
    try {
      setLoading(true);
      const response = await apiCaller.get('/api/busRoute');
      setDailyRoutes(response.data.data);
      // console.log(response.data.data[0]?.vehicle?.number);

    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchDrivers = async () => {
    try {
      setLoading(true);
      const response = await apiCaller.get('/api/driver');
      setDrivers(response.data.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCleaners = async () => {
    try {
      setLoading(true);
      const response = await apiCaller.get('/api/cleaner');
      setCleaners(response.data.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDailyRoutes();
    fetchDrivers();
    fetchCleaners();
  }, [refresh]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setNotificationVisible(false);
    }, 10000);

    return () => clearTimeout(timer);
  }, []);

  const handleDelete = async () => {
    if (selectedRoute) {
      try {
        await apiCaller.delete(`/api/busRoute?routeId=${selectedRoute._id}`);
        fetchDailyRoutes();
        setShowDeleteModal(false);
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleCreateDiscount = () => {
    // Handle the discount amount here
    console.log('Discount Amount:', discountAmount);
    setModalVisible(false); // Close the modal after creating the discount
  };

  const handleAddDriver = async () => {
    if (!selectedPrimaryDriver) {
      Alert.alert("Please fill at least one field.");
      return;
    }

    const newDriverData = {
      primaryDriverId: selectedPrimaryDriver || null,
      secondaryDriverId: selectedSecondaryDriver || null,
      cleanerId: selectedCleaner || null,
      instructions: instruction || ""
    };

    try {
      setLoading(true);
      await apiCaller.patch(`/api/busRoute/finalize?routeId=${selectedRoute?._id}`, newDriverData);
      Alert.alert("Success", "Drivers and cleaner added successfully!");
      fetchDailyRoutes();
      setShowAddDriverModal(false);
    } catch (error) {
      console.error("Error adding drivers and cleaner:", error);
      Alert.alert("Error", "Failed to add drivers and cleaner. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const filterDailyRoutes = (query: string) => {
    return dailyRoutes.filter((route) =>
      Object.values(route).some((value) =>
        String(value).toLowerCase().includes(query.toLowerCase()) || String(route.vehicle.number).toLowerCase().includes(query.toLowerCase())
      )
    );
  };

  if (!userData?.isSubsciptionValid && Date.now() >= new Date(userData?.trialValidTill).getTime()) {
    return <GoToPlans />;
  }



  return (
    <SafeAreaView style={tw`flex-1 p-4 bg-gray-200`}>


<ScrollView
    contentContainerStyle={tw``}
    keyboardShouldPersistTaps="handled" // Ensures keyboard dismisses on tap
  >


       <TouchableOpacity onPress={() => router.push("add_daily_route_vehicles")} style={styles.addButton}>
          <Text style={styles.addButtonText}>Create Route</Text>
      </TouchableOpacity>

  {/* Search Container */}
      <View style={tw`bg-white p-4 mx-2 rounded-xl mb-4 mt-[10px] relative z-10 shadow-lg`}>
        <View style={tw`flex-row items-center bg-white rounded-lg px-3 py-1.5 mb-2 border border-[${Colors.secondary}]`}>
          <FontAwesome5 name="search" size={18} color={Colors.secondary} />
          <TextInput
            style={tw`flex-1 text-[14px] text-black`}
            placeholder="Search vehicle number"
            placeholderTextColor={Colors.secondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {/* Search Button */}
        <TouchableOpacity style={tw`text-center mt-2`}>
          <Text style={tw`text-center bg-[#154CE4] rounded-3xl mx-4 py-[12px] text-[14px] text-white`}>
            Search
          </Text>
        </TouchableOpacity>
      </View>




      {notificationVisible && (
        <View style={styles.notificationContainer}>

          <Pressable onPress={() => setNotificationVisible(false)}>
            <FontAwesome5 name="times-circle" size={18} color={Colors.light} style={{ alignSelf: "flex-end" }} />
          </Pressable>
          <Text style={styles.notificationText}>
            Here added cards will be shown on customer app
          </Text>
        </View>
      )}

      {loading ? (
        <ActivityIndicator size="large" color={Colors.darkBlue} />
      ) : (
        <ScrollView style={styles.routesList}>
          {filterDailyRoutes(searchQuery).map((route) => (
           <View>
              <View style={tw`flex-row justify-end gap-2 mb-2 items-center space-x-1.5`}>
                <TouchableOpacity style={styles.editButton} onPress={() => {
                  setSelectedRoute(route);
                  setShowAddDriverModal(true);
                }}>
                  <Text style={styles.editButtonText}>Add Driver</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => { setEditData(route); router.push("edit_daily_route_vehicles") }} style={styles.editButton}>
                  <Text style={styles.editButtonText}>Edit Route</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => { setShowDeleteModal(true); setSelectedRoute(route); }}>
                  <MaterialIcons name="delete" size={24} color={Colors.darkBlue} />
                </TouchableOpacity>
              </View>

               <View key={route._id} style={tw`bg-white rounded-xl  mb-12  shadow-sm`}>
            

              <View style={tw`flex-1  justify-center items-center`}>
                <View style={tw`relative`}>
                  <Carousel height={300} images={route?.vehicle?.photos} />
                  <View style={tw`absolute  bottom-3 right-3 bg-[#2AA4D5]  items-center rounded-full p-4`}>
                    <Text style={tw`text-white text-[10px]`}>{route?.vehicle?.number.toUpperCase()}</Text>
                    <Text style={tw`text-white text-[10px]`}>{route?.vehicle.isAC ? "AC" : "Non-AC"}</Text>
                    <Text style={tw`text-white text-[10px]`}>{route?.vehicle.isSleeper ? "Sleeper" : "Seater"}</Text>
                  </View>
                </View>
              </View>


              <Text style={tw`text-xl flex justify-center text-center font-extrabold text-[#042F40] font-sans`}>
                {route?.agencyName}
              </Text>




              <View style={tw`flex-row px-2 justify-between my-1`}>
                <View style={tw``}>
                  <Text style={tw`font-bold text-lg text-[#042F40]`}>
                    {route?.departurePlace}
                  </Text>
                  <Text style={tw` text-[10px] text-[#042F40]`}>{route.departureTime ? new Date(route.departureTime).toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true }) : "Time not added"}</Text>
                </View>

                {/* <MaterialIcons name="keyboard-double-arrow-right" size={24} color="#00008B" /> */}
                <View style={tw`flex flex-row items-center`}>
                  <Image source={require('@/assets/left-arrow.png')} style={tw``} />
                  <Image source={require('@/assets/vehicle-icon.png')} style={tw``} />
                  <Image source={require('@/assets/right-arrow.png')} style={tw``} />
                </View>

                <View style={tw``}>
                  <Text style={tw`font-bold text-lg text-[#042F40]`}>
                    {route?.destinationPlace}
                  </Text>
                  <Text style={tw` text-[10px] text-[#042F40]`}>
                    {route.arrivalTime ? new Date(route.arrivalTime).toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true }) : "Time not added"}
                  </Text>
                </View>
              </View>

              <View style={tw`flex flex-row flex-wrap border rounded-md border-gray-200 p-3 mx-2 justify-between`}>

                <View style={tw`flex flex-col`}>
                  <Text style={tw`text-[11px] text-[#7D7D7D]`}>Pick Up Point:</Text>
                  <Text style={tw`text-[12px] font-bold text-[#042F40]`}>{route?.pickupPoint}</Text>
                </View>

                <View style={tw`flex flex-col`}>
                  <Text style={tw`text-[11px] text-[#7D7D7D]`}>Dropping Point:</Text>
                  <Text style={tw`text-[12px] font-bold text-[#042F40]`}>{route?.dropoffPoint}</Text>
                </View>

                <View style={tw`flex flex-col`}>
                  <Text style={tw`text-[11px] text-[#7D7D7D]`}>Ticket Price:</Text>
                  <Text style={tw`text-[12px] font-bold text-[#042F40]`}>{route?.ticketFare}</Text>
                </View>

                <View style={tw`flex flex-col w-full mt-2`}>
                  <Text style={tw`text-[11px] text-[#7D7D7D]`}>Amenities:</Text>
                  <View style={tw`pt-1 flex-row flex-wrap`}>
                    {route?.amenities?.includes("wifi") && (
                      <Image source={require('@/assets/images/wifi-icon.png')} style={tw`w-7 h-7 mx-1`} />
                    )}
                    {route?.amenities?.includes("blanket") && (
                      <Image source={require('@/assets/images/blanket.png')} style={tw`w-7 h-7 mx-1`} />
                    )}
                    {route?.amenities?.includes("bottle") && (
                      <Image source={require('@/assets/images/bottle.png')} style={tw`w-7 h-7 mx-1`} />
                    )}
                    {route?.amenities?.includes("charger") && (
                      <Image source={require('@/assets/images/charger.png')} style={tw`w-7 h-7 mx-1`} />
                    )}
                    {route?.amenities?.includes("meal") && (
                      <Image source={require('@/assets/images/meal.png')} style={tw`w-7 h-7 mx-1`} />
                    )}
                    {route?.amenities?.includes("pillow") && (
                      <Image source={require('@/assets/images/pillow.png')} style={tw`w-7 h-7 mx-1`} />
                    )}
                    {route?.amenities?.includes("tv") && (
                      <Image source={require('@/assets/images/tv.png')} style={tw`w-7 h-7 mx-1`} />
                    )}
                  </View>
                </View>

              </View>


              <View>
                              {/* "View More" Button (Visible at the top) */}
                    {/* {!showFullCard && (
                          <TouchableOpacity
                              style={tw`flex-row items-center justify-end`}
                              onPress={() => setShowFullCard(true)} // Expands the card
                          >
                              <Text style={tw`text-blue-400 font-bold text-sm mr-1 items-center`}>
                                  View More
                              </Text>
                              <ChevronDown size={20} color="#87CEEB" />
                          </TouchableOpacity>
                      )} */}

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
  <View style={tw`px-1 py-4`}>
    <Text style={tw`text-[15px] font-bold mb-2`}>Facilities</Text>
    <View style={tw`flex gap-1 flex-row`}>
      {/* Columns for services */}
      <View style={tw`items-center`}>
        {route?.doesProvideCorierService ? (
          <Text style={tw`bg-[#C8C8F44D] font-bold text-[#101010] text-[12px] px-2 py-1 rounded`}>
            Courier Service
          </Text>
        ) : (
          <Text style={tw`bg-transparent px-2 py-1`} />
        )}
      </View>

      <View style={tw`items-center`}>
        {route?.doesBookTrainTickets ? (
          <Text style={tw`bg-[#C8C8F44D] font-bold text-[#101010] text-[12px] px-2 py-1 rounded`}>
            Train Ticket
          </Text>
        ) : (
          <Text style={tw`bg-transparent px-2 py-1`} />
        )}
      </View>

      <View style={tw`items-center`}>
        {route?.doesCarryTwoWheelers ? (
          <Text style={tw`bg-[#C8C8F44D] font-bold text-[#101010] text-[12px] px-2 py-1 rounded`}>
            Two Wheeler Courier
          </Text>
        ) : (
          <Text style={tw`bg-transparent px-2 py-1`} />
        )}
      </View>
    </View>

    <View style={tw`p-1`}>
      <Text style={tw`font-bold text-[15px] mb-2 text-[#27272A]`}>Contact</Text>
      <PhoneNumbersList phoneNumbers={route?.mobileNumbers} />
    </View>

    <View>
      <View style={tw`mt-2`}>
        <Text style={tw`font-medium text-[#7D7D7D] text-[12px]`}>Office Address</Text>
        <Text style={tw`font-bold text-[12px] text-[#042F40]`}>{route?.officeAddress}</Text>
      </View>
      <View style={tw`mt-2`}>
        <Text style={tw`font-bold text-[#7D7D7D] text-[12px]`}>Phone Pe No</Text>
        <Text style={tw`font-bold text-[12px] text-[#042F40]`} >{route?.phonepeNumber}</Text>
      </View>
      <View style={tw`mt-2 mb-2`}>
        <Text style={tw`font-bold text-[#7D7D7D] text-[12px]`}>Discount</Text>
        <Text style={tw`font-bold text-[12px] text-[#042F40]`}>{route?.discount}%</Text>
      </View>
    </View>

    <View style={tw`flex flex-row`}>
      <CustomButton title="Scan To Pay"
        onPress={() => setIsQrModalVisible(route._id)}
        imageSource={require('@/assets/QR.png')}
      />
      <CustomButton title="View Driver" onPress={() => setIsDriverModalVisible(route._id)} />
      <CustomButton title="view Bus Chart" onPress={() => setIsChartModalVisible(route._id)}
        imageSource={require('@/assets/bus-chart.png')}
      />
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

    {/* Modals (QR Code, Driver Info, Discount Entry, etc.) */}
    {/* Modal implementations... */}
  </View>
)}


                
              </View>


               </View>
            </View>

          ))}
        </ScrollView>
      )}



      <Modal
        animationType="slide"
        transparent={true}
        visible={showDeleteModal}
        onRequestClose={() => setShowDeleteModal(false)}
      >
        <BlurOverlay visible={showDeleteModal} onRequestClose={() => setShowDeleteModal(false)} />

        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>Are you sure you want to delete this vehicle?</Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity style={[styles.modalButton, { backgroundColor: "#ccc" }]} onPress={() => setShowDeleteModal(false)}>
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.modalButton, { backgroundColor: Colors.darkBlue }]} onPress={handleDelete}>
                <Text style={[styles.modalButtonText, { color: "#fff" }]}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={showAddDriverModal}
        onRequestClose={() => setShowAddDriverModal(false)}
      >
        <BlurOverlay visible={showAddDriverModal} onRequestClose={() => setShowAddDriverModal(false)} />

        <View style={styles.modalContainer}>
          <TouchableWithoutFeedback>
            <View style={styles.modalContent}>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Primary Driver</Text>
                <Picker
                  selectedValue={selectedPrimaryDriver}
                  onValueChange={(itemValue) => setSelectedPrimaryDriver(itemValue)}
                  style={styles.picker}
                >
                  <Picker.Item label="Select Primary Driver" value="" />
                  {drivers.filter(driver => driver._id !== selectedSecondaryDriver).map((driver) => (
                    <Picker.Item key={driver._id} label={driver.name} value={driver._id} />
                  ))}
                </Picker>
              </View>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Secondary Driver</Text>
                <Picker
                  selectedValue={selectedSecondaryDriver}
                  onValueChange={(itemValue) => setSelectedSecondaryDriver(itemValue)}
                  style={styles.picker}
                >
                  <Picker.Item label="Select Secondary Driver" value="" />
                  {drivers.filter(driver => driver._id !== selectedPrimaryDriver).map((driver) => (
                    <Picker.Item key={driver._id} label={driver.name} value={driver._id} />
                  ))}
                </Picker>
              </View>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Cleaner</Text>
                <Picker
                  selectedValue={selectedCleaner}
                  onValueChange={(itemValue) => setSelectedCleaner(itemValue)}
                  style={styles.picker}
                >
                  <Picker.Item label="Select Cleaner" value="" />
                  {cleaners.map((cleaner) => (
                    <Picker.Item key={cleaner._id} label={cleaner.name} value={cleaner._id} />
                  ))}
                </Picker>
              </View>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Instructions</Text>
                <TextInput
                  value={instruction}
                  style={[styles.input, styles.textarea, { height: Math.max(50, inputHeight) }]}
                  onChangeText={(text) => setInstruction(text)}
                  multiline={true}
                  onContentSizeChange={(event) => {
                    setInputHeight(event.nativeEvent.contentSize.height);
                  }}
                />
              </View>
              <View style={styles.modalButtons}>
                <TouchableOpacity style={[styles.modalButton, { backgroundColor: "#ccc" }]} onPress={() => setShowAddDriverModal(false)}>
                  <Text style={styles.modalButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.modalButton, { backgroundColor: Colors.darkBlue }]} onPress={handleAddDriver}>
                  <Text style={[styles.modalButtonText, { color: "#fff" }]}>Add Driver</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </Modal>

      </ScrollView>
    </SafeAreaView>
  );
};


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
    marginBottom: 1,
    width: 120
  },
  addButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  routesList: {
    // flex: 1,
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
    width: 100,
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

export default DailyRouteVehicles;







