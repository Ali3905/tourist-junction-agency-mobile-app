import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, StatusBar, View, Text, Image, TouchableOpacity, Dimensions, ScrollView, Modal, Alert, BackHandler, Pressable } from 'react-native';
import { Video } from 'expo-av';
import Carousel from 'react-native-reanimated-carousel';
import { useGlobalContext } from '@/context/GlobalProvider';
import { Redirect, router } from 'expo-router';
import Loader from '@/components/loader';
import { Colors } from '@/constants/Colors';
import { GestureHandlerRootView, TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { AntDesign } from '@expo/vector-icons';
import * as Linking from 'expo-linking';
import { BlurView } from 'expo-blur';
import { Path, Rect, Svg } from 'react-native-svg';
import { Bell } from 'lucide-react-native';
import tw from 'twrnc';
import { Picker } from '@react-native-picker/picker'
import { State, City } from 'country-state-city'
import TextInputField from '@/components/TextInputField';
import { useFocusEffect } from '@react-navigation/native';
import { Dropdown } from 'react-native-element-dropdown';

import CityPickerWithSearch from '@/components/CityPickerWithSearch';

const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;

type DropdownItem = {
  label: string;
  value: string;
};

type CityType = {
  countryCode: string;
  name: string;
  stateCode: string;
};

type StateType = {
  countryCode: string;
  isoCode: string;
  name: string;
};


const carouselImages = [
  // require('@/assets/images/Banner1.png'),
  // require('@/assets/images/Janmashtmi.png'),
  // require('@/assets/images/ganpati.jpg'),
  require('@/assets/images/carousel1.png'),
  require('@/assets/images/carousel2.png'),
  require('@/assets/images/carousel3.png'),
  require('@/assets/images/carousel4.png'),
  require('@/assets/images/carousel5.png'),
  require('@/assets/images/carousel6.png')
];
const carouselCustomerImages = [
  require('@/assets/images/1.jpg'),
  require('@/assets/images/2.jpg'),
  require('@/assets/images/3.jpg'),
  require('@/assets/images/4.jpg'),

];

// const { width: deviceWidth, height: deviceHeight } = Dimensions.get('window');

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

export default function HomeScreen() {
  const { isLogged, loading, userData } = useGlobalContext();




  if (!loading && !isLogged) return <Redirect href="/(modals)/onbording" />;

  if (loading) {
    return (
      <View style={styles.container}>
        <Loader loading />
      </View>
    );
  }

  // useFocusEffect(() => {
  //   const onBackPress = () => {
  //     Alert.alert("Exit App", "Do you want to exit the app?", [
  //       { text: "Cancel", style: "cancel" },
  //       { text: "Exit", onPress: () => BackHandler.exitApp() },
  //     ]);
  //     return true; // Prevent default back behavior
  //   };

  //   BackHandler.addEventListener('hardwareBackPress', onBackPress);

  //   return () => BackHandler.removeEventListener('hardwareBackPress', onBackPress);
  // });



  return (
    <>
      {userData?.type === "AGENCY" ?
        <AgencyHome /> :
        userData?.type === "CUSTOMER" ?
          < CustomerHome /> :
          // <Redirect href="/(modals)/onbording" />
          <Loader loading />
      }
    </>
  );
}

const AgencyHome = () => {
  const { userData } = useGlobalContext();
  const videoRef = useRef<Video>(null);
  const whatsNewVideoRef = useRef<Video>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(false);
  const [showVideoModal, setShowVideoModal] = useState(false);



  const handlePlayPause = () => {
    if (isPlaying) {
      videoRef.current?.pauseAsync();
    } else {
      videoRef.current?.playAsync();
    }
    setIsPlaying(!isPlaying);
  };

  const handleViewVideo = (isVideo1: boolean) => {
    setSelectedVideo(isVideo1);
    setShowVideoModal(true);
  };
  return (
    <GestureHandlerRootView style={styles.container}>
      <View style={tw`p-5 flex flex-row justify-between bg-blue-400`}>
        <Text style={tw`text-base font-medium text-white`}>
          Hi, {userData?.userName || userData?.name}
        </Text>
        <Pressable onPress={() => router.push("/(modals)/(home)/notifications")}>
          <Bell color="white" />
        </Pressable>
      </View>

      <ScrollView>
        <View style={styles.logoContainer}>
          <Image source={require('@/assets/images/logo.png')} style={styles.image} />
        </View>


        <View style={styles.carouselContainer}>
          <Carousel
            width={deviceWidth * 0.9}
            height={deviceWidth * 0.6}
            autoPlay
            data={carouselImages}
            renderItem={({ item }) => (
              <Image source={item} style={styles.carouselImage} />
            )}
          />
        </View>

        <View style={styles.dividerContainer}>
          <View style={styles.divider}>
            <Text style={styles.dividerText}>Our Services</Text>
          </View>
        </View>

        <View style={styles.grid}>
          <TouchableOpacity onPress={() => router.push('/(modals)/(home)/daily_route_vehicles')} style={styles.gridItem}>
            <Image source={require('@/assets/DailyRoute.png')} style={styles.icon} />
            <Text style={styles.iconText} numberOfLines={2} ellipsizeMode="tail">Daily Route Vehicles</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push('/(modals)/(home)/package_vehicle_booking')} style={styles.gridItem}>
            <Image source={require('@/assets/package_booking.png')} style={styles.icon} />
            <Text style={styles.iconText} numberOfLines={2} ellipsizeMode="tail">Package Vehicle Booking</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push('/(modals)/(home)/holiday_yatra')} style={styles.gridItem}>
            <Image source={require('@/assets/holiday_Yatra.png')} style={styles.iconEmpty} />
            <Text style={styles.iconText} numberOfLines={2} ellipsizeMode="tail">Create Holiday's & Yatra</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push('/(modals)/(home)/vehicle_servicing_history')} style={styles.gridItem}>
            <Image source={require('@/assets/VehicleServicingHistory.png')} style={styles.icon} />
            <Text style={styles.iconText} numberOfLines={2} ellipsizeMode="tail">Vehicle Servicing History</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push('/(modals)/(home)/employee_list')} style={styles.gridItem}>
            <Image source={require('@/assets/Employee.png')} style={styles.icon} />
            <Text style={styles.iconText} numberOfLines={2} ellipsizeMode="tail">Employee Details</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push('/(modals)/(home)/drivers_all')} style={styles.gridItem}>
            <Image source={require('@/assets/SearchDriver.png')} style={styles.icon} />
            <Text style={styles.iconText} numberOfLines={2} ellipsizeMode="tail">Search Drivers</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push('/(modals)/(home)/drivers_list')} style={styles.gridItem}>
            <Image source={require('@/assets/MyDriverAgency.png')} style={styles.icon} />
            <Text style={styles.iconText} numberOfLines={2} ellipsizeMode="tail">My Driver</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push('/(modals)/(home)/cleaners_list')} style={styles.gridItem}>
            <Image source={require('@/assets/Cleaner.png')} style={styles.icon} />
            <Text style={styles.iconText} numberOfLines={2} ellipsizeMode="tail">Cleaner's List</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push('/(modals)/(home)/vehicle_documents')} style={styles.gridItem}>
            <Image source={require('@/assets/VehicleDocument.png')} style={styles.icon} />
            <Text style={styles.iconText} numberOfLines={2} ellipsizeMode="tail">Vehicle Documents</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push('/(modals)/(home)/all_vehicle_list')} style={styles.gridItem}>
            <Image source={require('@/assets/AllVehicleList.png')} style={styles.icon} />
            <Text style={styles.iconText} numberOfLines={2} ellipsizeMode="tail">All Vehicle List</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push('/(modals)/(home)/technician_support')} style={styles.gridItem}>
            <Image source={require('@/assets/technicians.png')} style={styles.icon} />
            <Text style={styles.iconText} numberOfLines={2} ellipsizeMode="tail">Technician Support</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push('/(modals)/(home)/empty_vehicle_list')} style={styles.gridItem}>
            <Image source={require('@/assets/EmptyVehicle.png')} style={styles.iconEmpty} />
            <Text style={styles.iconText} numberOfLines={2} ellipsizeMode="tail">Create Empty Vehicle Route</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.push('/(modals)/(home)/search_empty_vehicle_list')} style={styles.gridItem}>
            <Image source={require('@/assets/SearchEmpty.png')} style={styles.iconEmpty} />
            <Text style={styles.iconText} numberOfLines={2} ellipsizeMode="tail"> Search Empty Vehicle</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.dividerContainer}>
          <View style={styles.divider}>
            <Text style={styles.dividerText}>Social Connect</Text>
          </View>
        </View>

        <View style={styles.socialMediaContainer}>
          <TouchableOpacity
            style={styles.socialMediaIcon}
            onPress={() => Linking.openURL('https://www.instagram.com/touristjunctionpvtltd?igsh=MWlkZWY1aGtsc3U5Ng==')}
          >
            <AntDesign name="instagram" size={24} color={Colors.primary} />
            <Text style={styles.socialText}>Instagram</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.socialMediaIcon}
            onPress={() => Linking.openURL('https://www.facebook.com/profile.php?id=100077968170241&mibextid=kFxxJD')}
          >
            <AntDesign name="facebook-square" size={24} color={Colors.primary} />
            <Text style={styles.socialText}>Facebook</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.socialMediaIcon}
            onPress={() => Linking.openURL('https://youtube.com/@touristjunction4999?si=R80i9A17olOBrdzX')}
          >
            <AntDesign name="youtube" size={24} color={Colors.primary} />
            <Text style={styles.socialText}>YouTube</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.dividerContainer}>
          <View style={styles.divider}>
            <Text style={styles.dividerText}>Contact Us</Text>
          </View>
          <Text style={{ marginVertical: 10, marginBottom: 50, marginTop: 17, fontSize: 15 }}>touristjunction8@gmail.com</Text>
        </View>
      </ScrollView>


      <Modal
        animationType="slide"
        transparent={true}
        visible={showVideoModal}
        onRequestClose={() => setShowVideoModal(false)}
      >
        <BlurOverlay visible={showVideoModal} onRequestClose={() => setShowVideoModal(false)} />
        {/* 
        <View style={styles.modalContainer}>
          <View style={!selectedVideo ? styles.modalContentOverdide : styles.modalContent}>
            <Video
              ref={videoRef}
              source={!selectedVideo ? require('@/assets/videos/video2.mp4') : require('@/assets/videos/video1.mp4')}
              rate={1.0}
              volume={1.0}
              isMuted={false}
              shouldPlay={isPlaying}
              //@ts-ignore
              resizeMode="cover"
              isLooping
              style={[styles.cardVideo, !selectedVideo && { height: 200 }]}
            />
            <TouchableOpacity style={styles.playPauseButton} onPress={handlePlayPause}>
              <AntDesign style={isPlaying && { opacity: 0.1 }} name={isPlaying ? 'pausecircle' : 'playcircleo'} size={40} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.closeButton} onPress={() => setShowVideoModal(false)}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View> */}
      </Modal>
    </GestureHandlerRootView>
  )
}

const CustomerHome = () => {
  const [fromCities, setFromCities] = useState(City.getCitiesOfCountry("IN"))
  const [toCities, setToCities] = useState(City.getCitiesOfCountry("IN"))
  const [fromCity, setFromCity] = useState("")
  const [toCity, setToCity] = useState("")

  const [fromCitySearch, setFromCitySearch] = useState("")
  const { setRoute, userData } = useGlobalContext()
  const [state, setState] = useState("");
  const [city, setCity] = useState("");

  const [stateList, setStateList] = useState<StateType[]>([]);
  const [cityList, setCityList] = useState<CityType[]>([]);
  const [stateDropdownData, setStateDropdownData] = useState<DropdownItem[]>([]);
  const [cityDropdownData, setCityDropdownData] = useState<DropdownItem[]>([]);
  const [selectedCity, setSelectedCity] = useState<string>('');


  useEffect(() => {
    const states = State.getStatesOfCountry("IN");
    setStateList(states);
    setStateDropdownData(states.map(state => ({
      label: state.name,
      value: state.isoCode
    })));
  }, []);

  useEffect(() => {
    if (state) {
      const cities = City.getCitiesOfState("IN", state);
      setCityList(cities);
      setCityDropdownData(cities.map(city => ({
        label: city.name,
        value: city.name
      })));
    }
  }, [state]);

  const handleSearch = () => {
    setRoute({ fromCity, toCity })
    router.push("/bus_tickets")
  }

  const handleSearchFromCity = (query) => {
    const filtered = fromCities?.filter((city) => city.name.toLowerCase().includes(fromCity.toLowerCase()))
    setFromCities(filtered)
  }

  return (
    <GestureHandlerRootView style={styles.container}>
      <View style={styles.header}>
        <Text style={tw`text-base font-medium text-white`}>
          Hi, {userData?.userName || userData?.name}
        </Text>
      </View>
      <ScrollView>
        <Text style={tw`font-bold text-[20px] mt-8 pl-2`} >Bus Ticket</Text>
        <View style={tw`bg-white p-6 mx-2 rounded-xl mb-4 mt-[10px] relative z-10 shadow-lg`}>
          {/* City picker with search functionality - Using a placeholder */}
          <CityPickerWithSearch
            selectedCity={fromCity} // Pass selected "From" city
            setSelectedCity={setFromCity} // Function to update selected "From" city
            placeholder="From" // Placeholder value for "From" input
          />

          {/* City picker for "To" */}
          <CityPickerWithSearch
            selectedCity={toCity} // Pass selected "To" city
            setSelectedCity={setToCity} // Function to update selected "To" city
            placeholder="To" // Placeholder value for "To" input
          />

          {/* Search Button */}
          <TouchableOpacity style={tw`text-center mt-2`} onPress={handleSearch}>
            <Text style={tw`text-center bg-[#154CE4] rounded-3xl mx-4 py-[12px] text-[14px] text-white`}>
              Search
            </Text>
          </TouchableOpacity>
        </View>


        <View style={styles.dividerContainer}>
          <View style={styles.divider}>
            <Text style={styles.dividerText}>Our Services</Text>
          </View>
        </View>

        <View style={styles.grid}>
          <TouchableOpacity style={styles.gridItem} onPress={() => {
            router.push('/(modals)/(customer)/bus_tickets');
            setRoute({ fromCity: "", toCity: "" })
          }}>
            <Image source={require('@/assets/TicketBooking.png')} style={styles.icon} />
            <Text style={styles.iconText} numberOfLines={2} ellipsizeMode="tail">Bus Ticket</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.gridItem} onPress={() => router.push('/(modals)/(customer)/holiday_yatra')}>
            <Image source={require('@/assets/holiday_Yatra.png')} style={styles.icon} />
            <Text style={styles.iconText} numberOfLines={2} ellipsizeMode="tail">Holiday's & Yatra</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.gridItem} onPress={() => router.push('/(modals)/(customer)/sell_vehicle_list')}>
            <Image source={require('@/assets/SellVehicle.png')} style={styles.icon} />
            <Text style={styles.iconText} numberOfLines={2} ellipsizeMode="tail"> Vehicles for Sell</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.push('/(modals)/(customer)/hire_vehicle')} style={styles.gridItem}>
            <Image source={require('@/assets/RentVehicle.png')} style={styles.icon} />
            <Text style={styles.iconText} numberOfLines={2} ellipsizeMode="tail">Vehicle's on Rent</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.gridItem} onPress={() => router.push('/(modals)/(customer)/drivers_all')}>
            <Image source={require('@/assets/SearchDriver.png')} style={styles.icon} />
            <Text style={styles.iconText} numberOfLines={2} ellipsizeMode="tail">Search Driver</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.gridItem} onPress={() => router.push('/(modals)/(customer)/technicians')}>
            <Image source={require('@/assets/technicians.png')} style={styles.icon} />
            <Text style={styles.iconText} numberOfLines={2} ellipsizeMode="tail">Technician Support</Text>
          </TouchableOpacity>

        </View>

        <View style={styles.carouselContainer}>
          <Carousel
            width={deviceWidth * 0.9}
            height={deviceWidth * 0.6}
            autoPlay
            data={carouselCustomerImages}
            renderItem={({ item }) => (
              <Image source={item} style={styles.carouselImage} />
            )}
          />
        </View>

      </ScrollView>
    </GestureHandlerRootView>
  )
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    // marginTop: StatusBar.currentHeight,
  },
  header: {
    paddingTop: 13,
    paddingBottom: 13,
    padding: 10, // Reduced padding to decrease navbar height
    backgroundColor: Colors.darkBlue,

  },
  headerText: {
    fontSize: 15,
    fontWeight: '500',
    color: "white",
  },
  carouselContainer: {
    alignItems: 'center',
  },

  carouselImage: {
    height: deviceWidth * 0.5,
    borderRadius: 10,
    width: deviceWidth * 0.9,
  },
  dividerContainer: {
    marginHorizontal: 20,
    alignItems: 'center',
    marginVertical: 10,
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.secondary,
    width: '100%',
    position: 'relative',
    alignItems: 'center',
  },
  dividerText: {
    position: 'absolute',
    backgroundColor: '#ffffff',
    paddingHorizontal: 5,
    top: -10,
    color: '#00000',
    fontWeight: '700'
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginVertical: 20,
  },

  gridItem: {
    width: '30%', // Approximate one-third of the screen
    alignItems: 'center',
    marginVertical: 10,
    paddingHorizontal: 5,
  },
  icon: {
    width: 50,
    height: 50,
    resizeMode: 'contain',
  },
  iconEmpty: {
    width: 50,
    height: 50,
    resizeMode: 'contain',
  },
  iconText: {
    marginTop: 5,
    fontSize: Math.min(12, deviceHeight * 0.02), // Larger and more dynamic font size for better readability
    color: '#000', // Assuming the primary color is black
    textAlign: 'center',
    fontWeight: '500',
    width: '100%',
    flexWrap: 'wrap', // Ensuring text wraps correctly
  },
  logoContainer: {
    alignItems: 'center',
    marginVertical: 10,
  },
  buttonContainer: {
    alignItems: 'center',
  },
  button: {
    backgroundColor: Colors.secondary,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 15,
    alignItems: 'center',
    margin: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
  },
  cardVideo: {
    width: '100%',
    height: "90%",
    borderRadius: 15,
  },
  playPauseButton: {
    position: 'absolute',
    top: '40%',
    left: '45%',
    zIndex: 1,
  },
  cardText: {
    marginTop: 10,
    marginBottom: 5,
    fontSize: 13,
    textAlign: 'center',
    paddingHorizontal: 12,
    paddingVertical: 2,
    fontWeight: '600',
  },
  whatsNewHeading: {
    fontSize: 24,
    fontWeight: '800',
    color: Colors.primary,
    textAlign: 'center',
    marginVertical: 20,
  },
  whatsNewVideoContainer: {
    position: 'relative',
    alignSelf: 'center',
  },
  whatsNewVideo: {
    width: deviceWidth * 0.9,
    height: deviceWidth * 0.5,
    borderRadius: 15,
  },
  playPauseButtonWhatsNew: {
    position: 'absolute',
    top: '40%',
    left: '45%',
    zIndex: 1,
  },
  socialMediaContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginVertical: 20,
    marginBottom: 20
  },
  socialMediaIcon: {
    alignItems: 'center',
  },
  socialIcon: {
    width: 50,
    height: 50,
  },
  socialText: {
    marginTop: 5,
    fontSize: 11,
    color: Colors.primary,
    textAlign: 'center',
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 5,
    width: "90%",
    alignItems: "center",
    marginVertical: 20
  },
  modalText: {
    fontSize: 16,
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: "row",
    gap: 20,
    alignItems: "center",
  },
  modalImage: {
    width: 200,
    height: 200,
    resizeMode: "contain",
    marginBottom: 20,
  },
  closeButton: {
    backgroundColor: Colors.darkBlue,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 20
  },
  closeButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  modalContentOverdide: {
    backgroundColor: "#fff",
    borderRadius: 5,
    width: "90%",
    alignItems: "center",
    marginVertical: 20,
    height: "70%",
    justifyContent: "center",
    paddingTop: 50,
    gap: 100
  },
  image: {
    width: 200,
    height: 150,
    resizeMode: 'contain'
  },
});