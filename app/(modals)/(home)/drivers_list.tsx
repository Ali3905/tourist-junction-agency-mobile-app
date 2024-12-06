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
    Linking,
} from "react-native";
import { BlurView } from 'expo-blur';
import { Colors } from "@/constants/Colors";
import { FontAwesome5, MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useGlobalContext } from "@/context/GlobalProvider";
import GoToPlans from "@/components/GoToPlans";
import tw from 'twrnc'

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

const DriverListScreen: React.FC = () => {
    const [drivers, setDrivers] = useState<Driver[]>([]);
    const [loading, setLoading] = useState(true);
    const [showDeleteModal, setShowDeleteModal] = React.useState(false);
    const [showImageModal, setShowImageModal] = useState(false);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [idToDelete, setIdToDelete] = useState<null | string>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const { apiCaller, setEditData, refresh, userData } = useGlobalContext();
    const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);

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

    useEffect(() => {
        fetchDrivers();
    }, [refresh]);

    const handleDelete = async () => {
        await apiCaller.delete(`/api/driver?driverId=${idToDelete}`);
        setShowDeleteModal(false);
        fetchDrivers();
    };

    const handleViewImage = (imageUri: string) => {
        setSelectedImage(imageUri);
        setShowImageModal(true);
    };

    const filterDrivers = (query: string) => {
        return drivers.filter((driver) =>
            Object.values(driver).some((value) =>
                String(value).toLowerCase().includes(query.toLowerCase())
            )
        );
    };

    const handleSearch = () => {
        setSearchQuery(searchQuery);
    };

    const handlePress = (number: string) => {
        Linking.openURL(`tel:${number}`);
        if (timeoutId) {
            clearTimeout(timeoutId);
        }
        const id = setTimeout(() => {
            console.log('Showing modal');
            // setModalVisible(true);
        }, 100);
        setTimeoutId(id);
    };

    const filteredDrivers = searchQuery ? filterDrivers(searchQuery) : drivers;

    if (!userData?.isSubsciptionValid && Date.now() >= new Date(userData?.trialValidTill).getTime()) {
    return <GoToPlans />;
  }
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

            <TouchableOpacity onPress={() => router.push("add_driver")} style={styles.addButton}>
                <Text style={styles.addButtonText}>Add driver</Text>
            </TouchableOpacity>

            {loading ? (
                <ActivityIndicator size="large" color={Colors.darkBlue} />
            ) : (
                <ScrollView style={styles.driversList}>
                    {filteredDrivers.map((driver) => (
                        <View key={driver._id} style={styles.card}>
                            <View style={styles.imageContainer}>
                                <TouchableOpacity onPress={() => handleViewImage(driver.photo)} >
                                    <Image
                                        source={driver.photo ? { uri: driver.photo } : require("@/assets/images/avatar.jpg")}
                                        style={styles.driverImage}
                                    />
                                </TouchableOpacity>
                            </View>
                            <View style={styles.cardHeader}>
                                <TouchableOpacity onPress={() => { setEditData(driver); router.push("edit_driver") }} style={styles.editButton}>
                                    <Text style={styles.editButtonText}>Edit form</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => { setShowDeleteModal(true); setIdToDelete(driver._id) }}>
                                    <MaterialIcons name="delete" size={24} color={Colors.darkBlue} />
                                </TouchableOpacity>
                            </View>
                            <Text style={styles.cardText}>
                                Name - <Text style={{ color: "black" }}>{driver.name}</Text>
                            </Text>
                            {/* <Text style={styles.cardText}>
                                Mobile: <Text style={{ color: "black" }}>{driver.mobileNumber}</Text>
                            </Text> */}
                            <View style={[{ marginBottom: 1, marginTop: 1, flexDirection: "row" }]}>
                                <Text style={tw`font-medium`}>Mobile - </Text>
                                <TouchableOpacity onPress={() => handlePress(driver.mobileNumber)}>
                                    <MaterialIcons name="phone-in-talk" size={24} color={Colors.darkBlue} />
                                </TouchableOpacity>
                                {/* <TouchableOpacity onPress={() => handlePress(item.alternateNumber)}>
                                    <MaterialIcons name="phone-in-talk" size={24} color={Colors.secondary} />
                                </TouchableOpacity> */}
                            </View>
                            <Text style={tw`mb-1 text-[12px] font-medium`}>
                                City - <Text style={{ color: "black" }}>{driver.city}</Text>
                            </Text>
                            <Text style={styles.cardText}>
                                State - <Text style={{ color: "black" }}>{driver.state}</Text>
                            </Text>
                            <Text style={styles.cardText}>
                                Vehicle Type - <Text style={{ color: "black" }}>{driver.vehicleType}</Text>
                            </Text>
                            <View style={tw`flex-row items-center justify-between`}>
                                {/* <Text style={styles.cardText}>Aadhar card</Text> */}
                                <TouchableOpacity style={styles.viewAadharButton} onPress={() => handleViewImage(driver.aadharCard)}>
                                    <Text style={styles.viewAadharButtonText}>View Aadhar</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={tw`flex-row items-center mt-2 justify-between`}>
                                {/* <Text style={styles.cardText}>Driver License</Text> */}
                                <TouchableOpacity style={styles.viewAadharButton} onPress={() => handleViewImage(driver.license)}>
                                    <Text style={styles.viewAadharButtonText}>View License</Text>
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
                        <Text style={styles.modalText}>Are you sure you want to delete this driver?</Text>
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
        backgroundColor: "#EAEAEA",
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
        backgroundColor:'#fff'
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
    driversList: {
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
        marginBottom: 2,
        color: '#000000',
        fontWeight: "500",
        fontSize: 12,
    },
    aadharContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    viewAadharButton: {
        backgroundColor: Colors.darkBlue,
        paddingHorizontal: 10,
        borderRadius: 5,
        paddingVertical: 5,
    },
    viewAadharButtonText: {
        color: "#fff",
        fontWeight: "bold",
    },
    errorText: {
        color: 'red',
        textAlign: 'center',
        marginTop: 20,
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
        height: 400,
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
});

export default DriverListScreen;