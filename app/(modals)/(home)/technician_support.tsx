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
    FlatList,
    ActivityIndicator,
    Linking,
    Platform,
} from "react-native";
import { BlurView } from 'expo-blur';
import { Colors } from "@/constants/Colors";
import { FontAwesome5, MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useGlobalContext } from "@/context/GlobalProvider";
import { Picker } from '@react-native-picker/picker';
import { State, City } from 'country-state-city';
import { Rating, AirbnbRating } from 'react-native-ratings';

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

interface Technician {
    _id: string;
    technicianType: string;
    name: string;
    city: string;
    state: string;
    mobileNumber: string;
    alternateNumber: string;
    vehicleType: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
}

const TechnicianSupport: React.FC = () => {
    const [technicians, setTechnicians] = useState<Technician[]>([]);
    const [loading, setLoading] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [idToDelete, setIdToDelete] = useState<null | string>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [vehicleFilter, setVehicleFilter] = useState('');
    const [stateFilter, setStateFilter] = useState('');
    const [cityFilter, setCityFilter] = useState('');
    const { apiCaller, setEditData, refresh } = useGlobalContext();
    const [currentPage, setCurrentPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [modalVisible, setModalVisible] = useState(false);
    const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);

    const states = State.getStatesOfCountry('IN');
    const cities = City.getCitiesOfState('IN', stateFilter);

    const fetchTechnicians = async (page: number, isLoadMore: boolean = false) => {
        if (!hasMore && isLoadMore) return;

        try {
            setLoading(true);
            let url = `/api/technician?page=${page}`;
            if (cityFilter) url += `&city=${cityFilter}`;
            if (vehicleFilter) url += `&vehicleType=${vehicleFilter}`;
            if (searchQuery) url += `&search=${searchQuery}`;

            const response = await apiCaller.get(url);
            const newTechnicians = response.data.data;
            
            if (isLoadMore) {
                setTechnicians(prev => [...prev, ...newTechnicians]);
            } else {
                setTechnicians(newTechnicians);
            }

            setHasMore(newTechnicians.length > 0);
            setCurrentPage(page);
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTechnicians(1);
    }, [refresh, cityFilter, vehicleFilter, searchQuery]);

    const handleDelete = async () => {
        await apiCaller.delete(`/api/technician?technicianId=${idToDelete}`);
        setShowDeleteModal(false);
        fetchTechnicians(1);
    };

    const handlePress = (number: string) => {
        Linking.openURL(`tel:${number}`);
        console.log('Phone number dialed: ', number);
        if (timeoutId) {
          clearTimeout(timeoutId);
        }
        const id = setTimeout(() => {
          console.log('Showing modal');
          setModalVisible(true);
        }, 100);
        setTimeoutId(id);
    };

    const handleVehicleFilterChange = (itemValue: string) => {
        setVehicleFilter(itemValue === 'all' ? '' : itemValue);
    };

    const handleStateFilterChange = (itemValue: string) => {
        setStateFilter(itemValue === 'all' ? '' : itemValue);
        setCityFilter('');
    };

    const handleCityFilterChange = (itemValue: string) => {
        setCityFilter(itemValue === 'all' ? '' : itemValue);
    };

    const renderTechnicianItem = ({ item }: { item: Technician }) => (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>Check Airbnb Ratings Below:</Text>
            <View style={styles.ratingContainer}>
                <AirbnbRating />
                <AirbnbRating
                    count={11}
                    reviews={["Terrible", "Bad", "Meh", "OK", "Good", "Hmm...", "Very Good", "Wow", "Amazing", "Unbelievable", "Jesus"]}
                    defaultRating={11}
                    size={20}
                />
            </View>
            
            <View style={[styles.cardHeader, { marginBottom: 2, marginTop: 5 }]}>
                <TouchableOpacity onPress={() => handlePress(item.mobileNumber)}>
                    <MaterialIcons name="phone-in-talk" size={24} color={Colors.darkBlue} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handlePress(item.alternateNumber)}>
                    <MaterialIcons name="phone-in-talk" size={24} color={Colors.secondary} />
                </TouchableOpacity>
            </View>

            <Text style={styles.cardText}>Technician Name: <Text style={{ color: "black" }}> {item.name}</Text></Text>
            <Text style={styles.cardText}>Technician Type: <Text style={{ color: "black" }}> {item.technicianType}</Text></Text>
            <Text style={styles.cardText}>City: <Text style={{ color: "black" }}>{item.city}</Text></Text>
            <Text style={styles.cardText}>State: <Text style={{ color: "black" }}>{item.state}</Text></Text>
            <Text style={styles.cardText}>Vehicle Type: <Text style={{ color: "black" }}> {item.vehicleType}</Text></Text>
            
            <Modal
                visible={modalVisible}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <AirbnbRating
                            reviews={['bad', 'ok', 'good', 'very good', 'excellent']}
                            count={5}
                            defaultRating={3}
                        />
                        <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeButton}>
                            <Text style={styles.closeButtonText}>Close</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    ); 

    const handleLoadMore = () => {
        if (!loading && hasMore) {
            fetchTechnicians(currentPage + 1, true);
        }
    };

    const renderFooter = () => {
        if (!loading) return null;
        return (
            <View style={styles.loaderFooter}>
                <ActivityIndicator size="small" color={Colors.darkBlue} />
            </View>
        );
    };

    const renderContent = () => {
        if (loading && currentPage === 1) {
            return (
                <View style={styles.centerContainer}>
                    <ActivityIndicator size="large" color={Colors.darkBlue} />
                </View>
            );
        }

        if (technicians.length === 0) {
            return (
                <View style={styles.centerContainer}>
                    <Text style={styles.noTechnicianText}>
                        Currently not available any technicians for this location, but don't worry we very soon adding technician on this location
                    </Text>
                </View>
            );
        }

        return (
            <FlatList
                data={technicians}
                renderItem={renderTechnicianItem}
                keyExtractor={(item) => item._id}
                onEndReached={handleLoadMore}
                onEndReachedThreshold={0.1}
                ListFooterComponent={renderFooter}
            />
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.searchContainer}>
                <FontAwesome5 name="search" size={18} color={Colors.secondary} />
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search technician, city"
                    placeholderTextColor={Colors.secondary}
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                />
            </View>

            <View style={styles.filterContainer}>
                <View style={styles.vehicleFilterContainer}>
                    <Picker
                        selectedValue={vehicleFilter}
                        style={styles.vehiclePicker}
                        onValueChange={handleVehicleFilterChange}
                    >
                        <Picker.Item label="All Vehicle Types" value="all" />
                        <Picker.Item label="CAR" value="CAR" />
                        <Picker.Item label="BUS" value="BUS" />
                        <Picker.Item label="TRUCK" value="TRUCK" />
                        <Picker.Item label="TAMPO" value="TAMPO" />
                    </Picker>
                </View>

                <View style={styles.locationFilterContainer}>
                    <Picker
                        selectedValue={stateFilter}
                        style={styles.locationPicker}
                        onValueChange={handleStateFilterChange}
                    >
                        <Picker.Item label="All States" value="all" />
                        {states.map((state) => (
                            <Picker.Item key={state.isoCode} label={state.name} value={state.isoCode} />
                        ))}
                    </Picker>

                    <Picker
                        selectedValue={cityFilter}
                        style={styles.locationPicker}
                        onValueChange={handleCityFilterChange}
                        enabled={!!stateFilter}
                    >
                        <Picker.Item label="All Cities" value="all" />
                        {cities.map((city) => (
                            <Picker.Item key={city.name} label={city.name} value={city.name} />
                        ))}
                    </Picker>
                </View>
            </View>

            <TouchableOpacity onPress={() => router.push("add_technician")} style={styles.addButton}>
                <Text style={styles.addButtonText}>Add Technician</Text>
            </TouchableOpacity>

            {renderContent()}

            <Modal
                animationType="slide"
                transparent={true}
                visible={showDeleteModal}
                onRequestClose={() => setShowDeleteModal(false)}
            >
                <BlurOverlay visible={showDeleteModal} onRequestClose={() => setShowDeleteModal(false)} />

                <TouchableWithoutFeedback onPress={() => setShowDeleteModal(false)}>
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalContainer}>
                            <View style={styles.modalContent}>
                                <Text style={styles.modalText}>Currently not available any technician for this location, but don't worry will add technicians on this location very soon</Text>
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
                    </View>
                </TouchableWithoutFeedback>
            </Modal>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: "#fff",
    },
    ratingContainer: {
        marginBottom: 20,
      },
    searchContainer: {
        flexDirection: "row",
        alignItems: "center",
        borderColor: Colors.secondary,
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 15,
        marginBottom: 10,
        paddingVertical: 5,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
      },
      modalContent: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        width: '80%',
        alignItems: 'center',
      },
      closeButton: {
        marginTop: 10,
        padding: 10,
        backgroundColor: '#ddd',
        borderRadius: 5,
      },
      closeButtonText: {
        color: 'black',
      },
    searchInput: {
        flex: 1,
        marginLeft: 10,
        color: Colors.secondary,
    },
    filterContainer: {
        marginBottom: 1,
    },
    vehicleFilterContainer: {
        marginBottom: -5,
    },
    locationFilterContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    vehiclePicker: {
        width: '100%',
    },
    locationPicker: {
        flex: 1,
        marginHorizontal: 5,
    },
    picker: {
        flex: 1,
        marginHorizontal: 5,
    },
    addButton: {
        backgroundColor: Colors.darkBlue,
        paddingVertical: 10,
        borderRadius: 5,
        alignItems: "center",
        marginBottom: 20,
        width: 140,
    },
    addButtonText: {
        color: "#fff",
        fontWeight: "bold",
    },
    card: {
        backgroundColor: "#fff",
        padding: 20,
        borderRadius: 5,
        marginBottom: 20,
        elevation: 3,
        shadowColor: "#000",
        shadowOffset: { width: 2, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        position: "relative",
    },
    cardHeader: {
        flexDirection: "row",
        justifyContent: "flex-end",
        marginBottom: 10,
        gap: 30,
        alignItems: "center",
    },
    cardText: {
        marginBottom: 8,
        color: Colors.secondary,
        fontWeight: "500",
        fontSize: 13,
    },
    modalContainer: {
        justifyContent: "center",
        alignItems: "center",
        marginHorizontal: 5,
        marginVertical: 'auto'
    },
    modalOverlay: {
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
        maxHeight: 400,
    },
    modalText: {
        marginBottom: 20,
        fontSize: 18,
        textAlign: "center",
    },
    modalButtons: {
        flexDirection: "row",
        width: '100%',
        justifyContent: "space-between"
    },
    modalButton: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 5,
        alignItems: "center",
        width: '48%'
    },
    modalButtonText: {
        fontWeight: "bold",
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
    },
    loaderFooter: {
        paddingVertical: 20,
        alignItems: 'center',
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    noTechnicianText: {
        textAlign: 'center',
        fontSize: 16,
        color: Colors.secondary,
        paddingHorizontal: 20,
    },
});

export default TechnicianSupport;