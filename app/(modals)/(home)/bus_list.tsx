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

interface Bus {
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
    isSeatPushBack: boolean;
    isLuggageSpace: boolean;
    curtain: boolean;
    amenities: string[];
}

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

const BusListScreen: React.FC = () => {
    const [buses, setBuses] = useState<Bus[]>([]);
    const [loading, setLoading] = useState(true);
    const [showDeleteModal, setShowDeleteModal] = React.useState(false);
    const [selectedBusImage, setSelectedBusImage] = React.useState<string[] | null>(null);
    const [showPhotoModal, setShowPhotoModal] = React.useState(false);
    const [idToDelete, setIdToDelete] = useState<null | string>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const { apiCaller, setEditData, refresh } = useGlobalContext();

    const filterByType = (data: Vehicle[], type: string): Vehicle[] => {
        return data.filter(vehicle => vehicle.type === type);
    };

    const fetchBuses = async () => {
        try {
            setLoading(true);
            const response = await apiCaller.get('/api/vehicle');
            const filteredData = filterByType(response.data.data.vehicles, 'BUS')
            setBuses(filteredData);
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBuses();
    }, [refresh]);

    const handleDelete = async () => {
        await apiCaller.delete(`/api/vehicle?vehicleId=${idToDelete}`);
        setShowDeleteModal(false);
        fetchBuses()
    };

    const handleViewPhoto = (imageUrl: string[]) => {
        setSelectedBusImage(imageUrl);
        setShowPhotoModal(true);
    };

    const filterBuses = (query: string) => {
        return buses.filter((bus) =>
            Object.values(bus).some((value) =>
                String(value).toLowerCase().includes(query.toLowerCase())
            )
        );
    };

    const handleSearch = () => {
        setSearchQuery(searchQuery);
    };

    const filteredBuses = searchQuery ? filterBuses(searchQuery) : buses;

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

            <TouchableOpacity onPress={() => router.push("add_bus")} style={styles.addButton}>
                <Text style={styles.addButtonText}>Add Bus</Text>
            </TouchableOpacity>

            {loading ? (
                <ActivityIndicator size="large" color={Colors.darkBlue} />
            ) : (
                <ScrollView style={styles.busesList}>
                    {filteredBuses.map((bus) => (
                        <View key={bus._id} style={styles.card}>
                            <View style={styles.cardHeader}>
                                <TouchableOpacity onPress={() => { setEditData(bus); router.push("edit_bus") }} style={styles.editButton}>
                                    <Text style={styles.editButtonText}>Edit form</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => { setShowDeleteModal(true); setIdToDelete(bus._id) }}>
                                    <MaterialIcons name="delete" size={24} color={Colors.darkBlue} />
                                </TouchableOpacity>
                            </View>
                            <Text style={styles.cardText}>Vehicle Number: <Text style={{ color: "black" }}>{bus.number.toUpperCase()}</Text></Text>
                            <Text style={styles.cardText}>Seating Capacity: <Text style={{ color: "black" }}>{bus.seatingCapacity}</Text></Text>
                            <Text style={styles.cardText}>Vehicle Model: <Text style={{ color: "black" }}>{bus.model}</Text></Text>
                            <Text style={styles.cardText}>Body Type: <Text style={{ color: "black" }}>{bus.bodyType}</Text></Text>
                            <Text style={styles.cardText}>Chassis Brand: <Text style={{ color: "black" }}>{bus.chassisBrand}</Text></Text>
                            <Text style={styles.cardText}>Location: <Text style={{ color: "black" }}>{bus.location}</Text></Text>
                            <Text style={styles.cardText}>Contact Number: <Text style={{ color: "black" }}>{bus.contactNumber}</Text></Text>
                            <Text style={styles.cardText}>{bus.isAC ? "AC /" : "NON AC /"} {bus.isForRent && " Rent /"} {bus.isForSell && " Sell"}</Text>
                            <Text style={styles.cardText}>{bus.isLuggageSpace ? "Carry Luggage /" : ""} {bus.isSeatPushBack && " Seat Push Back /"} {bus.curtain && " Curtain and Seat Cover"}</Text>
                            <Text style={{ flex: 1, fontWeight: 'bold', color: '#87CEEB' }}>Amenities:</Text>
                            <View style={{
                                paddingTop: 1,
                                paddingBottom: 14,
                                flexDirection: 'row',

                            }}>

                                {bus?.amenities?.includes("wifi") && <Image
                                    source={require('@/assets/images/wifi-icon.png')}
                                    style={{ width: 30, height: 30, marginHorizontal: 5 }}
                                />}
                                {bus?.amenities?.includes("blanket") && <Image
                                    source={require('@/assets/images/blanket.png')}
                                    style={{ width: 30, height: 30, marginHorizontal: 5 }}
                                />}
                                {bus?.amenities?.includes("bottle") && <Image
                                    source={require('@/assets/images/bottle.png')}
                                    style={{ width: 30, height: 30, marginHorizontal: 5 }}
                                />}
                                {bus?.amenities?.includes("charger") && <Image
                                    source={require('@/assets/images/charger.png')}
                                    style={{ width: 30, height: 30, marginHorizontal: 5 }}
                                />}
                                {bus?.amenities?.includes("meal") && <Image
                                    source={require('@/assets/images/meal.png')}
                                    style={{ width: 30, height: 30, marginHorizontal: 5 }}
                                />}
                                {bus?.amenities?.includes("pillow") && <Image
                                    source={require('@/assets/images/pillow.png')}
                                    style={{ width: 30, height: 30, marginHorizontal: 5 }}
                                />}
                                {bus?.amenities?.includes("tv") && <Image
                                    source={require('@/assets/images/tv.png')}
                                    style={{ width: 30, height: 30, marginHorizontal: 5 }}
                                />}
                            </View>
                            <TouchableOpacity style={styles.viewPhotoButton} onPress={() => handleViewPhoto(bus.photos)}>
                                <Text style={styles.viewPhotoButtonText}>View Photos</Text>
                            </TouchableOpacity>
                        </View>
                    ))}
                </ScrollView>
            )}

            {/* Delete Confirmation Modal */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={showDeleteModal}
                onRequestClose={() => setShowDeleteModal(false)}
            >
                <BlurOverlay visible={showDeleteModal} onRequestClose={() => setShowDeleteModal(false)} />

                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalText}>Are you sure you want to delete this bus?</Text>
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

            {/* Photo Modal */}
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
                        {selectedBusImage && selectedBusImage.map((t, index) => (
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
        backgroundColor: "#fff",
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
    busesList: {
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
    busImage: {
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
    overlay: {
        ...StyleSheet.absoluteFillObject,
    },
    modalContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22,
    },
    modalContent: {
        margin: 20,
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
        borderRadius: 20,
        padding: 10,
        elevation: 2,
        width: "48%",
        alignItems: "center",
    },
    modalButtonText: {
        fontWeight: "bold",
    },
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
        marginVertical: 100
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

export default BusListScreen;
