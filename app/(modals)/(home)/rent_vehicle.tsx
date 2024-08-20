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
} from "react-native";
import PagerView from "react-native-pager-view";
import { FontAwesome5 } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";
import { useGlobalContext } from "@/context/GlobalProvider";
import { BlurView } from 'expo-blur';

const { width: viewportWidth } = Dimensions.get("window");

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
        <TouchableOpacity activeOpacity={1} onPress={onRequestClose} style={styles.overlay}>
            <BlurView intensity={90} tint="light" style={StyleSheet.absoluteFill} />
        </TouchableOpacity>
    </Modal>
);

const RentVehicleScreen: React.FC = () => {
    const [activeSlide, setActiveSlide] = useState(0);
    const [loading, setLoading] = useState(true);
    const { apiCaller, token } = useGlobalContext();
    const [vehicles, setVehicles] = useState<Vehicle[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [showImageModal, setShowImageModal] = useState(false);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    const renderPagerItem = (item: string, index: number) => {
        return (
            <TouchableOpacity activeOpacity={1} style={styles.carouselItem} key={index} onPress={() => handleViewImage(item)}>
                <Image source={{ uri: item }} style={styles.carouselImage} />
            </TouchableOpacity>
        );
    };

    const filterByType = (data: Vehicle[]): Vehicle[] => {
        return data.filter(vehicle => vehicle.isForRent === true);
    };

    const fetchVehicles = async () => {
        try {
            setLoading(true);
            const response = await apiCaller.get('/api/vehicle/purpose/RENT/');
            const filteredData = filterByType(response.data.data)
            setVehicles(filteredData);
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchVehicles();
    }, []);

    const filterVehicles = (query: string) => {
        return vehicles.filter((vehicle) =>
            Object.values(vehicle).some((value) =>
                String(value).toLowerCase().includes(query.toLowerCase())
            )
        );
    };

    const handleSearch = () => {
        setSearchQuery(searchQuery);
    };

    const handleViewImage = (imageUri: string) => {
        setSelectedImage(imageUri);
        setShowImageModal(true);
    };

    const filteredVehicles = searchQuery ? filterVehicles(searchQuery) : vehicles;

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView>
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

                {loading ? (
                    <ActivityIndicator size="large" color={Colors.darkBlue} style={{ marginTop: 20 }} />
                ) : (
                    filteredVehicles.map((vehicle, index) => (
                        <View key={index} style={styles.card}>
                            <PagerView
                                style={styles.pagerView}
                                initialPage={0}
                                onPageSelected={(e) => setActiveSlide(e.nativeEvent.position)}
                                useNext
                            >
                                {vehicle.photos.map((photo, photoIndex) => renderPagerItem(photo, photoIndex))}
                            </PagerView>
                            <View style={styles.paginationContainer}>
                                {vehicle.photos.map((_, photoIndex) => (
                                    <View
                                        key={photoIndex}
                                        style={[
                                            styles.dotStyle,
                                            { opacity: photoIndex === activeSlide ? 1 : 0.4 },
                                        ]}
                                    />
                                ))}
                            </View>
                            <Text style={styles.cardText}>Vehicle No: <Text style={{ color: "black" }}>{vehicle.number.toUpperCase()}</Text></Text>
                            <Text style={styles.cardText}>Model: <Text style={{ color: "black" }}>{vehicle.model}</Text></Text>
                            <Text style={styles.cardText}>Contact No: <Text style={{ color: "black" }}>{vehicle.contactNumber}</Text></Text>
                            <Text style={styles.cardText}>Location: <Text style={{ color: "black" }}>{vehicle.location}</Text></Text>
                        </View>
                    ))
                )}
            </ScrollView>

            <Modal
                animationType="fade"
                transparent={true}
                visible={showImageModal}
                onRequestClose={() => setShowImageModal(false)}
            >
                <BlurOverlay visible={showImageModal} onRequestClose={() => setShowImageModal(false)} />

                <View style={styles.modalContainer}>
                    {selectedImage &&
                        <View style={styles.modalContent}>
                            <Image source={{ uri: selectedImage }} style={styles.modalImage} />
                            <TouchableOpacity style={styles.closeButton} onPress={() => setShowImageModal(false)}>
                                <Text style={styles.closeButtonText}>Close</Text>
                            </TouchableOpacity>
                        </View>
                    }
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
    card: {
        backgroundColor: "#fff",
        padding: 20,
        borderRadius: 5,
        elevation: 3,
        shadowColor: "#000",
        shadowOffset: { width: 2, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        marginBottom: 20,
    },
    cardText: {
        marginBottom: 10,
        color: Colors.secondary,
        fontWeight: "500",
        fontSize: 15,
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
});

export default RentVehicleScreen;