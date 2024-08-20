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
    Dimensions
} from "react-native";
import { BlurView } from 'expo-blur';
import { Colors } from "@/constants/Colors";
import { FontAwesome5, MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useGlobalContext } from "@/context/GlobalProvider";
import * as Sharing from 'expo-sharing';

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

interface VehicleDocuments {
    _id: string;
    number: string;
    RC: string;
    insurance: string;
    permit: string;
    fitness: string;
    tax: string;
    PUC: string;
}

const VehicleListScreen: React.FC = () => {
    const [filteredVehicles, setFilteredVehicles] = useState<VehicleDocuments[]>([]);
    const [loading, setLoading] = useState(true);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedVehicleId, setSelectedVehicleId] = useState<string | null>(null);
    const [showImageModal, setShowImageModal] = useState(false);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const { apiCaller, setEditData, refresh } = useGlobalContext();
    const [isFullSize, setIsFullSize] = useState<boolean>(false);

    const fetchVehicles = async () => {
        try {
            setLoading(true);
            const response = await apiCaller.get('/api/vehicle');
            setFilteredVehicles(response.data.data.vehicles);
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    };
    
    const handleDownloadImage = async (imageUri: string) => {
        if (await Sharing.isAvailableAsync()) {
            await Sharing.shareAsync(imageUri);
        } else {
            alert('Sharing is not available on this device');
        }
    };
    
    const toggleFullSizeImage = () => {
        setIsFullSize(!isFullSize);
    };

    useEffect(() => {
        fetchVehicles();
    }, [refresh]);

    const handleSearch = (query: string) => {
        setSearchQuery(query);
        const filtered = vehicles.filter(vehicle => 
            vehicle.number.toLowerCase().includes(query.toLowerCase())
        );
        setFilteredVehicles(filtered);
    };

    const handleDelete = async () => {
        if (selectedVehicleId) {
            await apiCaller.delete(`/api/vehicle?vehicleId=${selectedVehicleId}`);
            setShowDeleteModal(false);
            fetchVehicles();
        }
    };

    const handleViewImage = (imageUri: string) => {
        setSelectedImage(imageUri);
        setShowImageModal(true);
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.searchContainer}>
                <FontAwesome5 name="search" size={18} color={Colors.secondary} />
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search by vehicle number..."
                    placeholderTextColor={Colors.secondary}
                    value={searchQuery}
                    onChangeText={handleSearch}
                />
            </View>

            <TouchableOpacity onPress={() => router.push("add_vehicle_documents")} style={styles.addButton}>
                <Text style={styles.addButtonText}>Add Vehicle & Document</Text>
            </TouchableOpacity>

            {loading ? (
                <ActivityIndicator size="large" color={Colors.darkBlue} />
            ) : (
                <ScrollView style={styles.vehiclesList}>
                    {filteredVehicles.map((vehicle) => (
                        <View key={vehicle._id} style={styles.card}>
                            <View style={styles.cardHeader}>
                                <TouchableOpacity onPress={()=> {setEditData(vehicle); router.push("edit_vehicle_documents")}} style={styles.editButton}>
                                    <Text style={styles.editButtonText}>Edit form</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => { setShowDeleteModal(true); setSelectedVehicleId(vehicle._id); }}>
                                    <MaterialIcons name="delete" size={24} color={Colors.darkBlue} />
                                </TouchableOpacity>
                            </View>
                            <Text style={styles.cardText}>Vehicle Number: <Text style={{ color: "black" }}>{vehicle.number.toUpperCase()}</Text></Text>
                            <View style={styles.documentContainer}>
                                <TouchableOpacity style={styles.viewDocumentButton} onPress={() => handleViewImage(vehicle.RC)}>
                                    <Text style={styles.viewDocumentButtonText}>View RC</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.viewDocumentButton} onPress={() => handleViewImage(vehicle.insurance)}>
                                    <Text style={styles.viewDocumentButtonText}>View Insurance</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.viewDocumentButton} onPress={() => handleViewImage(vehicle.permit)}>
                                    <Text style={styles.viewDocumentButtonText}>View Permit</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.viewDocumentButton} onPress={() => handleViewImage(vehicle.fitness)}>
                                    <Text style={styles.viewDocumentButtonText}>View Fitness</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.viewDocumentButton} onPress={() => handleViewImage(vehicle.tax)}>
                                    <Text style={styles.viewDocumentButtonText}>View Tax</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.viewDocumentButton} onPress={() => handleViewImage(vehicle.PUC)}>
                                    <Text style={styles.viewDocumentButtonText}>View PUC</Text>
                                </TouchableOpacity>
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
                         <TouchableOpacity style={styles.downloadButton} onPress={() => handleDownloadImage(selectedImage)}>
                            <Text style={styles.downloadButtonText}>Download</Text>
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
                visible={showImageModal}
                onRequestClose={() => setShowImageModal(false)}
            >
                <BlurOverlay visible={showImageModal} onRequestClose={() => setShowImageModal(false)} />

                <View style={styles.modalContainer}>
                    {selectedImage && 
                    <View style={styles.modalContent}>
                        {/* <Image source={{ uri: selectedImage }} style={styles.modalImage} /> */}

                        <TouchableOpacity style={styles.imageContainer} onPress={toggleFullSizeImage}>
                            <Image source={{ uri: selectedImage }} style={isFullSize ? styles.fullSizeImage : styles.modalImage} resizeMode="contain" />
                        </TouchableOpacity>

                        <View style={styles.buttonContainer}>
                            <TouchableOpacity style={styles.closeButton} onPress={() => {setShowImageModal(false); toggleFullSizeImage()}}>
                                <Text style={styles.closeButtonText}>Close</Text>
                            </TouchableOpacity>
                        </View>
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
    imageContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalImage: {
        width: 300,
        height: 400,
    },
    fullSizeImage: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
    },
    downloadButtonText: {
        color: '#fff',
        fontSize: 16,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
    },
    downloadButton: {
        marginTop: 20,
        padding: 10,
        backgroundColor: '#2196F3',
        borderRadius: 5,
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
    vehiclesList: {
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
    documentContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 10,
        marginTop: 10,
    },
    viewDocumentButton: {
        backgroundColor: Colors.darkBlue,
        paddingHorizontal: 10,
        borderRadius: 5,
        paddingVertical: 5,
    },
    viewDocumentButtonText: {
        color: "#fff",
        fontWeight: "bold",
    },
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
    modalImage: {
        width: 300,
        height: 300,
        resizeMode: "contain",
        marginBottom: 20,
    },
    closeButton: {
        padding: 10,
        backgroundColor: '#f44336',
        borderRadius: 5,
        marginHorizontal: 5,
    },
    closeButtonText: {
        color: "#fff",
        fontWeight: "bold",
    },
});

export default VehicleListScreen;