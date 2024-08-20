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

const CleanerListScreen: React.FC = () => {
    const [cleaners, setCleaners] = useState<Cleaner[]>([]);
    const [loading, setLoading] = useState(true);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [showImageModal, setShowImageModal] = useState(false);
    const [idToDelete, setIdToDelete] = useState<null|string>(null);
    const [searchQuery, setSearchQuery] = useState(""); // New state for search query
    const { apiCaller, setEditData, refresh } = useGlobalContext();

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
        fetchCleaners();
    }, [refresh]);

    const handleDelete = async() => {
        await apiCaller.delete(`/api/cleaner?cleanerId=${idToDelete}`);
        setShowDeleteModal(false);
        fetchCleaners();
    };

    const handleViewImage = (imageUri: string) => {
        setSelectedImage(imageUri);
        setShowImageModal(true);
    };

    const filterCleaners = (query: string) => {
        return cleaners.filter((cleaner) =>
            Object.values(cleaner).some((value) =>
                String(value).toLowerCase().includes(query.toLowerCase())
            )
        );
    };

    const handleSearch = () => {
        setSearchQuery(searchQuery);
    };

    const filteredCleaners = searchQuery ? filterCleaners(searchQuery) : cleaners;

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

            <TouchableOpacity onPress={() => router.push("add_cleaner")} style={styles.addButton}>
                <Text style={styles.addButtonText}>Add cleaner</Text>
            </TouchableOpacity>

            {loading ? (
                <ActivityIndicator size="large" color={Colors.darkBlue} />
            ) : (
                <ScrollView style={styles.cleanersList}>
                    {filteredCleaners.map((cleaner) => (
                        <View key={cleaner._id} style={styles.card}>
                            <View style={styles.imageContainer}>
                                <TouchableOpacity onPress={() => handleViewImage(cleaner.photo)} >
                                    <Image
                                        source={{ uri: cleaner.photo }}
                                        style={styles.driverImage}
                                    />
                                </TouchableOpacity>
                            </View>
                            <View style={styles.cardHeader}>
                                <TouchableOpacity onPress={()=> {setEditData(cleaner); router.push("edit_cleaner")}} style={styles.editButton}>
                                    <Text style={styles.editButtonText}>Edit form</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => {setShowDeleteModal(true); setIdToDelete(cleaner._id)}}>
                                    <MaterialIcons name="delete" size={24} color={Colors.darkBlue} />
                                </TouchableOpacity>
                            </View>
                            <Text style={styles.cardText}>Name: <Text style={{ color: "black" }}>{cleaner.name}</Text></Text>
                            <Text style={styles.cardText}>Mobile: <Text style={{ color: "black" }}>{cleaner.mobileNumber}</Text></Text>
                            <Text style={styles.cardText}>City: <Text style={{ color: "black" }}>{cleaner.city}</Text></Text>
                            <Text style={styles.cardText}>State: <Text style={{ color: "black" }}>{cleaner.state}</Text></Text>
                            <View style={styles.aadharContainer}>
                                <Text style={styles.cardText}>Aadhar card</Text>
                                <TouchableOpacity style={styles.viewAadharButton} onPress={() => handleViewImage(cleaner.aadharCard)}>
                                    <Text style={styles.viewAadharButtonText}>View Aadhar</Text>
                                </TouchableOpacity>
                            </View>
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
                        <Text style={styles.modalText}>Are you sure you want to delete this cleaner?</Text>
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

            {/* Image View Modal */}
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
    cleanersList: {
        flex: 1,
    },
    imageContainer: {
        position: "absolute",
        right: 30,
        top: 70,
    },
    driverImage: {
        width: 70,
        height: 70,
        borderRadius: 35,
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
    cleanerImage: {
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
    aadharContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    viewAadharButton: {
        backgroundColor: Colors.darkBlue,
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 5,
    },
    viewAadharButtonText: {
        color: "#fff",
        fontWeight: "bold",
    },
    modalContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    modalContent: {
        backgroundColor: "#fff",
        borderRadius: 5,
        padding: 20,
        width: "80%",
        alignItems: "center",
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
    modalButton: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 5,
    },
    modalButtonText: {
        fontWeight: "bold",
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
    },
    closeButtonText: {
        color: "#fff",
        fontWeight: "bold",
    },
    overlay: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
});

export default CleanerListScreen;
