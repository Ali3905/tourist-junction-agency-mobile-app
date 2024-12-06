import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    SafeAreaView,
    ScrollView,
    Image,
    Dimensions,
    ActivityIndicator,
    TouchableOpacity,
    Modal,
    Alert,
    Pressable,
} from "react-native";
import { FontAwesome5, MaterialIcons } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";
import { useGlobalContext } from "@/context/GlobalProvider";
import { router } from "expo-router";
import Carousel from "@/components/Carousel";
import ConfirmationModal from "@/components/Modal";
import GoToPlans from "@/components/GoToPlans";
import { Picker } from "@react-native-picker/picker";
import tw from 'twrnc'

const { width: viewportWidth } = Dimensions.get("window");

interface Vehicle {
    _id: string;
    // number: string;
    // seatingCapacity: number;
    departureDate: string;
    departurePlace: string;
    departureTime: string;
    destinationPlace: string;
    mobileNumber: string;
    moreInformation: string,
    photos: string[];
    // isAC: boolean;
    // isForRent: boolean;
    // isForSell: boolean;
    // type: string;
}

interface EmptyVehicleCardProps {
    vehicle: Vehicle,
    index: number,
}


function formatDate(dateString: string): string {
    const date = new Date(dateString);
    const year = date.getUTCFullYear();
    const month = date.getUTCMonth() + 1;
    const day = date.getUTCDate();
    return `${month}/${day}/${year}`;
}


const SearchEmptyVehicleScreen: React.FC = () => {
    const [vehicles, setVehicles] = useState<Vehicle[]>([]);
    const [loading, setLoading] = useState(true);
    const { apiCaller, refresh, userData } = useGlobalContext();

    const [vehicleTypeFilter, setVehicleTypeFilter] = useState("")
    const [fromFilter, setFromFilter] = useState("")
    const [toFilter, setToFilter] = useState("")
    const [notificationVisible, setNotificationVisible] = useState(true);

    const [searchQuery, setSearchQuery] = useState("");

    const fetchVehicles = async () => {
        try {
            setLoading(true);
            const response = await apiCaller.get('/api/emptyVehicle/all');
            // console.log('API response:', response);
            const filteredData = response.data.data
            setVehicles(filteredData);
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchVehicles();
    }, [refresh]);

    useEffect(() => {
        const timer = setTimeout(() => {
            setNotificationVisible(false);
        }, 10000);

        return () => clearTimeout(timer);
    }, []);

    const filterVehicles = (query: string) => {
        return vehicles.filter((vehicle) =>
            Object.values(vehicle).some((value) =>
                String(value).toLowerCase().includes(query.toLowerCase()) &&
                    vehicleTypeFilter ? vehicle.vehicle.type === vehicleTypeFilter : true &&
                        fromFilter ? vehicle.departurePlace.toLowerCase().includes(fromFilter.toLowerCase()) : true &&
                            toFilter ? vehicle.destinationPlace.toLowerCase().includes(toFilter.toLowerCase()) : true
            )
        );
    };

    const handleSearch = () => {
        setSearchQuery(searchQuery);
    };

   
    const filteredVehicles = searchQuery || fromFilter || toFilter || vehicleTypeFilter ? filterVehicles(searchQuery) : vehicles;

    if (!userData?.isSubsciptionValid && Date.now() >= new Date(userData?.trialValidTill).getTime()) {
    return <GoToPlans />;
  }

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView>
            <View style={styles.container1}>
                  <View style={styles.inputContainer}>
                        <FontAwesome5 name="bus" size={24} color="black" style={styles.icon} />
                        <TextInput
                        placeholder="From"
                        style={styles.input}
                        value={fromFilter}
                        onChangeText={setFromFilter}
                        />
                    </View>
                    {/* <View style={styles.iconContainer}>
                        <FontAwesome5 name="exchange" size={24} color="white" />
                    </View> */}
                    <View style={styles.inputContainer}>
                        <FontAwesome5 name="bus" size={24} color="black" style={styles.icon} />
                        <TextInput
                        placeholder="To"
                        style={styles.input}
                        value={toFilter}
                        onChangeText={setToFilter}
                        />
                    </View>
            </View>

                {/* <View style={styles.searchContainer}>
                    <TouchableOpacity onPress={handleSearch}>
                        <FontAwesome5 name="search" size={18} color={Colors.secondary} />
                    </TouchableOpacity>
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search.."
                        placeholderTextColor={Colors.secondary}
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                </View> */}
                {/* <View style={styles.vehicleFilterContainer}>
                    <Picker
                        selectedValue={vehicleTypeFilter}
                        style={styles.vehiclePicker}
                        onValueChange={item => setVehicleTypeFilter(item)}
                    >
                        <Picker.Item label="All Vehicle Types" value="" />
                        <Picker.Item label="CAR" value="CAR" />
                        <Picker.Item label="BUS" value="BUS" />
                        <Picker.Item label="TRUCK" value="TRUCK" />
                        <Picker.Item label="TAMPO" value="TAMPO" />
                    </Picker>
                </View> */}
                {/* <View style={{ flexDirection: "row", marginTop: 5, gap: 5 }}>
                    <View style={styles.searchContainer}>
                        <TouchableOpacity onPress={handleSearch}>
                            <FontAwesome5 name="search" size={18} color={Colors.secondary} />
                        </TouchableOpacity>
                        <TextInput
                            style={styles.searchInput}
                            placeholder="Search Departure City"
                            placeholderTextColor={Colors.secondary}
                            value={fromFilter}
                            onChangeText={setFromFilter}
                        />
                    </View><View style={styles.searchContainer}>
                        <TouchableOpacity onPress={handleSearch}>
                            <FontAwesome5 name="search" size={18} color={Colors.secondary} />
                        </TouchableOpacity>
                        <TextInput
                            style={styles.searchInput}
                            placeholder="Search Destination City"
                            placeholderTextColor={Colors.secondary}
                            value={toFilter}
                            onChangeText={setToFilter}
                        />
                    </View>
                </View> */}

                {loading ? (
                    <ActivityIndicator size="large" color={Colors.darkBlue} style={{ marginTop: 20 }} />
                ) : (
                    filteredVehicles.length < 1 ? <Text style={{ textAlign: "center" }}>Currently vehicle is not available on route</Text> :
                        filteredVehicles.map((vehicle, index) => (
                            <EmptyVehicleCard vehicle={vehicle} index={index} />
                        ))
                )}
            </ScrollView>

        </SafeAreaView>
    );
};

const EmptyVehicleCard = ({ vehicle, index }: EmptyVehicleCardProps) => {




    return (
        <>
            <View key={index} style={styles.card}>
                <Carousel height={300} images={vehicle.photos} />
                <View style={tw`p-2`}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', margin: 10 }}>
                            <View style={{ alignItems: "center" }}>
                                <Text style={{ fontWeight: 'bold' }}>Departure</Text>
                                <Text>{vehicle.departurePlace}</Text>
                            </View>
                            <View style={{ alignItems: "center" }}>
                                <Text style={{ fontWeight: 'bold' }}>Destination</Text>
                                <Text>{vehicle.destinationPlace}</Text>
                            </View>
                        </View>
                        <View style={styles.cardTextContainer}>
                            <Text style={styles.cardText}>Vehicle No - </Text>
                            <Text style={{ color: "black" }}>{vehicle.vehicle?.number.toUpperCase()}</Text>
                        </View>
                        <View style={styles.cardTextContainer}>
                            <Text style={styles.cardText}>Departure Date - </Text>
                            <Text style={{ color: "black" }}>{vehicle.departureDate ? formatDate(vehicle.departureDate) : "Time not added"}</Text>
                        </View>
                        <View style={styles.cardTextContainer}>
                            <Text style={styles.cardText}>Departure Time - </Text>
                            <Text style={{ color: "black" }}>{vehicle.departureTime ? new Date(vehicle.departureTime).toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true }) : "Time not added"}</Text>
                        </View>
                        <View style={styles.cardTextContainer}>
                            <Text style={styles.cardText}>Contacttt Number - </Text>
                            <Text style={{ color: "black" }}>{vehicle.mobileNumber}</Text>
                        </View>
                        <View style={styles.cardTextContainer}>
                            <Text style={styles.cardText}>More Info About Tripp - </Text>
                            <Text style={{ color: "black" }}>{vehicle.moreInformation}</Text>
                        </View>

                </View>

            </View>
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingVertical: 20,
        paddingHorizontal: 20,
        backgroundColor: "#EAEAEA",
    },
    searchContainer: {
        flexDirection: "row",
        flex: 1,
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
    vehicleFilterContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderWidth: 1,
        borderColor: Colors.secondary,
    },
    vehiclePicker: {
        flex: 1,
        marginHorizontal: 2,
    },
    addButton: {
        backgroundColor: Colors.darkBlue,
        borderRadius: 8,
        padding: 8,
        alignItems: "center",
        marginBottom: 10,
        width: 250
    },
    addButtonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
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
    card: {
        backgroundColor: "#fff",
        paddingVertical: 0,
        paddingHorizontal: 0,
        borderRadius: 5,
        elevation: 3,
        shadowColor: "#000",
        shadowOffset: { width: 2, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 20,
        marginBottom: 20,
    },
    cardTextContainer: {
        marginBottom: 4,
        flexDirection: "row",
    },
    cardText: {

        color: '#000000',
        fontWeight: "500",
        fontSize: 12,
    },
    carouselItem: {
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 10,
        overflow: "hidden",
    },
    carouselImage: {
        width: viewportWidth * 0.8,
        height: 200,
    },
    pagerView: {
        width: viewportWidth * 0.8,
        height: 200,
    },
    paginationContainer: {
        flexDirection: "row",
        justifyContent: "center",
        paddingVertical: 8,
    },
    dotStyle: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: Colors.darkBlue,
        marginHorizontal: 4,
    },
    modalContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    modalContent: {
        backgroundColor: "#fff",
        padding: 20,
        borderRadius: 10,
        alignItems: "center",
        elevation: 5,
        width: viewportWidth * 0.9,
    },
    modalImage: {
        width: viewportWidth * 0.8,
        height: viewportWidth * 0.8,
        resizeMode: 'contain',
        marginBottom: 20,
    },
    closeButton: {
        backgroundColor: Colors.darkBlue,
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 5,
    },
    closeButtonText: {
        color: "#fff",
        fontWeight: "bold",
        fontSize: 16,
    },
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        paddingVertical: 10,
      },
      icon: {
        marginRight: 10,
      },
      input: {
        flex: 1,
        fontSize: 16,
      },
      iconContainer: {
        position: 'absolute',
        right: 10,
        top: '50%',
        marginTop: -12,
        backgroundColor: '#555',
        borderRadius: 20,
        padding: 5,
      },
      container1: {
        flexDirection: 'column',
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 10,
        marginTop: 10,
        marginBottom:10,
        borderWidth: 1,
        borderColor: '#ccc',
      },
});

export default SearchEmptyVehicleScreen;