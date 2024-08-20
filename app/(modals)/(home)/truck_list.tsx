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
    noOfTyres: number;
    vehicleWeightInKGS: number;
    model: string;
    bodyType: string;
    chassisBrand: string;
    location: string;
    contactNumber: string;
    photos: string[];
    isForRent: boolean;
    isForSell: boolean;
    type: string;
}

const TruckListScreen: React.FC = () => {
    const [trucks, setTrucks] = useState<Vehicle[]>([]);
    const [loading, setLoading] = useState(true);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedTruckImage, setSelectedTruckImage] = useState<string[] | null>(null);
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
            const filteredData = filterByType(response.data.data.vehicles, 'TRUCK');
            setTrucks(filteredData);
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
        setSelectedTruckImage(imageUrl);
        setShowPhotoModal(true);
    };

    const filterTrucks = (query: string) => {
        return trucks.filter((truck) =>
            Object.values(truck).some((value) =>
                String(value).toLowerCase().includes(query.toLowerCase())
            )
        );
    };

    const handleSearch = () => {
        setSearchQuery(searchQuery);
    };

    const filteredTrucks = searchQuery ? filterTrucks(searchQuery) : trucks;

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

            <TouchableOpacity onPress={() => router.push("add_truck")} style={styles.addButton}>
                <Text style={styles.addButtonText}>Add Truck</Text>
            </TouchableOpacity>

            {loading ? (
                <ActivityIndicator size="large" color={Colors.darkBlue} />
            ) : (
                <ScrollView style={styles.trucksList}>
                    {filteredTrucks.map((truck) => (
                        <View key={truck._id} style={styles.card}>
                            <View style={styles.cardHeader}>
                                <TouchableOpacity onPress={()=> {setEditData(truck);router.push("edit_truck")}} style={styles.editButton}>
                                    <Text style={styles.editButtonText}>Edit form</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => {setShowDeleteModal(true); setIdToDelete(truck._id)}}>
                                    <MaterialIcons name="delete" size={24} color={Colors.darkBlue} />
                                </TouchableOpacity>
                            </View>
                            <Text style={styles.cardText}>
                                Vehicle Number: <Text style={{ color: "black" }}>{truck.number.toUpperCase()}</Text>
                            </Text>
                            <Text style={styles.cardText}>
                                Number of Tyres: <Text style={{ color: "black" }}>{truck.noOfTyres}</Text>
                            </Text>
                            <Text style={styles.cardText}>
                                Vehicle Weight: <Text style={{ color: "black" }}>{truck.vehicleWeightInKGS}</Text>
                            </Text>
                            <Text style={styles.cardText}>
                                Model: <Text style={{ color: "black" }}>{truck.model}</Text>
                            </Text>
                            <Text style={styles.cardText}>
                                Body Type: <Text style={{ color: "black" }}>{truck.bodyType}</Text>
                            </Text>
                            <Text style={styles.cardText}>
                                Location: <Text style={{ color: "black" }}>{truck.location}</Text>
                            </Text>
                            <Text style={styles.cardText}>
                                Chassis Number: <Text style={{ color: "black" }}>{truck.chassisBrand}</Text>
                            </Text>
                            <Text style={styles.cardText}>{truck.isForRent&&" Rent /"} {truck.isForSell&&" Sell"}</Text>

                            <TouchableOpacity style={styles.viewPhotoButton} onPress={() => handleViewPhoto(truck.photos)}>
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
                        <Text style={styles.modalText}>Are you sure you want to delete this truck?</Text>
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
                        {selectedTruckImage && selectedTruckImage.map((t, index) => (
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
    trucksList: {
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
        marginHorizontal: 5,
    },
    modalContent: {
        backgroundColor: "#fff",
        padding: 20,
        borderRadius: 10,
        alignItems: "center",
        elevation: 5,
        minWidth: 300,
    },
    modalText: {
        marginBottom: 20,
        fontSize: 18,
        textAlign: "center",
    },
    modalButtons: {
        flexDirection: "row",
        justifyContent: "center",
    },
    modalButton: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        marginHorizontal: 10,
    },
    modalButtonText: {
        fontSize: 16,
        fontWeight: "bold",
    },
    overlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    photoModalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    photoModalOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    photoModalContent: {
        width: '80%',
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 10,
        marginVertical:100
    },
    photoModalContentContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    fullImage: {
        width: '100%',
        height: 200,
        borderRadius: 10,
        marginBottom: 10,
    },
});

export default TruckListScreen;
