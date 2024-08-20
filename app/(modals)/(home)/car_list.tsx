import React, { useEffect, useState } from "react";
import {
    View,
    Modal,
    StyleSheet,
    TouchableOpacity,
    Text,
    TouchableWithoutFeedback,
    Image,
    TextInput,
    SafeAreaView,
    ScrollView,
    ActivityIndicator,
} from "react-native";
import { BlurView } from 'expo-blur';
import { Colors } from "@/constants/Colors";
import { FontAwesome5, MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useGlobalContext } from "@/context/GlobalProvider";

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

interface Vehicle {
    _id: string;
    number: string;
    seatingCapacity: number;
    model: string;
    bodyType: string;
    chassisBrand: string;
    location: string;
    contactNumber: string;
    photos: string[];
    isAC: boolean;
    isForRent: boolean;
    isForSell: boolean;
    type: string;
}

const CarListScreen: React.FC = () => {
    const [cars, setCars] = useState<Vehicle[]>([]);
    const [loading, setLoading] = useState(true);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedCarImage, setSelectedCarImage] = useState<string[] | null>(null);
    const [showPhotoModal, setShowPhotoModal] = useState(false);
    const [idToDelete, setIdToDelete] = useState<null|string>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const { apiCaller, setEditData, refresh } = useGlobalContext();

    const filterByType = (data: Vehicle[], type: string): Vehicle[] => {
        return data.filter(vehicle => vehicle.type === type);
    };

    const fetchVehicles = async () => {
        try {
            setLoading(true);
            const response = await apiCaller.get('/api/vehicle');
            
            const filteredData = filterByType(response.data.data.vehicles, 'CAR')
            console.log(filteredData);
            setCars(filteredData);
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchVehicles();
    }, [refresh]);

    const handleDelete = async() => {
        await apiCaller.delete(`/api/vehicle?vehicleId=${idToDelete}`);
        setShowDeleteModal(false);
        fetchVehicles()
    };

    const handleViewPhoto = (imageUrl: string[]) => {
        setSelectedCarImage(imageUrl);
        setShowPhotoModal(true);
    };

    const filterCars = (query: string) => {
        return cars.filter((car) =>
            Object.values(car).some((value) =>
                String(value).toLowerCase().includes(query.toLowerCase())
            )
        );
    };

    const handleSearch = () => {
        setSearchQuery(searchQuery);
    };

    const filteredCars = searchQuery ? filterCars(searchQuery) : cars;

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.searchContainer}>
                <TouchableOpacity onPress={handleSearch}>
                    <FontAwesome5 name="search" size={18} color={Colors.secondary} />
                </TouchableOpacity>
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search..."
                    placeholderTextColor={Colors.secondary}
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                />
            </View>

            <TouchableOpacity onPress={() => router.push("add_car")} style={styles.addButton}>
                <Text style={styles.addButtonText}>Add Car</Text>
            </TouchableOpacity>

            {loading ? (
                <ActivityIndicator size="large" color={Colors.darkBlue} />
            ) : (
                <ScrollView style={styles.carsList}>
                    {filteredCars.map((car) => (
                        <View key={car._id} style={styles.card}>
                            <View style={styles.cardHeader}>
                                <TouchableOpacity onPress={()=> {setEditData(car);router.push("edit_car")}} style={styles.editButton}>
                                    <Text style={styles.editButtonText}>Edit form</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => {setShowDeleteModal(true); setIdToDelete(car._id)}}>
                                    <MaterialIcons name="delete" size={24} color={Colors.darkBlue} />
                                </TouchableOpacity>
                            </View>
                            <Text style={styles.cardText}>Vehicle Number: <Text style={{ color: "black" }}>{car.number.toUpperCase()}</Text></Text>
                            <Text style={styles.cardText}>Seating Capacity: <Text style={{ color: "black" }}>{car.seatingCapacity}</Text></Text>
                            <Text style={styles.cardText}>Vehicle Model: <Text style={{ color: "black" }}>{car.model}</Text></Text>
                            <Text style={styles.cardText}>Location: <Text style={{ color: "black" }}>{car.location}</Text></Text>
                            <Text style={styles.cardText}>Contact Number: <Text style={{ color: "black" }}>{car.contactNumber}</Text></Text>
                            <Text style={styles.cardText}>{car.isAC?"AC /":"NON AC /"} {car.isForRent&&" Rent /"} {car.isForSell&&" Sell"}</Text>
                            <TouchableOpacity style={styles.viewPhotoButton} onPress={() => handleViewPhoto(car.photos)}>
                                <Text style={styles.viewPhotoButtonText}>View Photos</Text>
                            </TouchableOpacity>
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
                        <Text style={styles.modalText}>Are you sure you want to delete this car?</Text>
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
                animationType="fade"
                transparent={true}
                visible={showPhotoModal}
                onRequestClose={() => setShowPhotoModal(false)}
            >
                <BlurOverlay visible={showPhotoModal} onRequestClose={() => setShowPhotoModal(false)} />

                <View style={styles.photoModalContainer}>
                    <TouchableWithoutFeedback onPress={() => setShowPhotoModal(false)}>
                        <View style={styles.photoModalOverlay} />
                    </TouchableWithoutFeedback>
                    <ScrollView style={styles.photoModalContent} contentContainerStyle={styles.photoModalContentContainer}>
                        {selectedCarImage && selectedCarImage.map((t, index) => (
                            <Image key={index} source={{ uri: t }} style={styles.fullImage} />
                        ))}
                    </ScrollView>
                </View>
            </Modal>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: "#ffffff",
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
    carsList: {
        flex: 1,
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
    carImage: {
        width: 70,
        height: 70,
        borderRadius: 35,
        position: "absolute",
        right: 30,
        top: 70,
    },
    cardHeader: {
        flexDirection: "row",
        justifyContent: "flex-end",
        marginBottom: 10,
        gap: 50,
        alignItems: "center",
    },
    editButton: {
        backgroundColor: Colors.darkBlue,
        paddingHorizontal: 10,
        borderRadius: 5,
        paddingVertical: 5,
    },
    editButtonText: {
        color: "#fff",
        fontWeight: "bold",
    },
    cardText: {
        marginBottom: 10,
        color: Colors.secondary,
        fontWeight: "500",
        fontSize: 15,
    },
    viewPhotoButton: {
        backgroundColor: Colors.darkBlue,
        paddingHorizontal: 10,
        borderRadius: 5,
        paddingVertical: 5,
        alignItems: "center",
    },
    viewPhotoButtonText: {
        color: "#fff",
        fontWeight: "bold",
    },
    // Modal Styles
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
    // Photo Modal Styles
    photoModalContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    photoModalOverlay: {
        position: "absolute",
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    photoModalContent: {
        width: "80%",
        height: "80%",
        backgroundColor: "#fff",
        borderRadius: 10,
        padding: 20,
        elevation: 10,
        marginVertical:100
    },
    photoModalContentContainer: {
        alignItems: "center",
    },
    fullImage: {
        width: 250,
        height: 250,
        marginBottom: 20,
        resizeMode: "contain",
    },
});

export default CarListScreen;
