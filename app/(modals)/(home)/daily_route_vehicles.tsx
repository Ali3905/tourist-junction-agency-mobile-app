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
    ScrollView,
    Alert,
    ActivityIndicator,
    Image,
    Dimensions,
} from "react-native";
import * as ImagePicker from 'expo-image-picker';
import { BlurView } from 'expo-blur';
import { Colors } from "@/constants/Colors";
import { FontAwesome5, MaterialIcons } from "@expo/vector-icons";
import FloatingButton from "@/components/FloatingButton";
import { useGlobalContext } from "@/context/GlobalProvider";

const { width: deviceWidth } = Dimensions.get('window');

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

function timestampToTime(timestamp: string): string {
    const date = new Date(timestamp);
    let hours = date.getUTCHours();
    const minutes = date.getUTCMinutes().toString().padStart(2, '0');
    const seconds = date.getUTCSeconds().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';

    hours = hours % 12;
    hours = hours ? hours : 12;
    const formattedHours = hours.toString().padStart(2, '0');

    return `${formattedHours}:${minutes}:${seconds} ${ampm}`;
}

const DailyRouteVehicles: React.FC = () => {
    const [routes, setRoutes] = useState<DailyRoute[]>([]);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showStartTripModal, setShowStartTripModal] = useState(false);
    const [showEndTripModal, setShowEndTripModal] = useState(false);
    const [beforeJourneyNote, setBeforeJourneyNote] = useState("");
    const [afterJourneyNote, setAfterJourneyNote] = useState("");
    const [selectedPhotos, setSelectedPhotos] = useState<string[]>([]);
    const [afterJourneyPhotos, setAfterJourneyPhotos] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const [selectedRoute, setSelectedRoute] = useState<DailyRoute | null>(null);
    const [inputHeight, setInputHeight] = useState(50);

    const { apiCaller, driverId } = useGlobalContext();

    useEffect(() => {
        fetchRoutes();
    }, []);

    const fetchRoutes = async () => {
        try {
            setLoading(true);
            const response = await apiCaller.get(`/api/busRoute/driver/${driverId}`);
            console.log(response.data.data);
            
            const filteredRoutes = response.data.data.filter((route: DailyRoute) => route.status !== "COMPLETED");
            setRoutes(filteredRoutes);
        } catch (error) {
            console.error("Error fetching routes:", error);
            Alert.alert("Error", "Failed to fetch routes. Please try again.");
        } finally {
            setLoading(false);
        }
    };
    const timestampToDate = (timestamp: string) => {
        const date = new Date(timestamp);
        return new Intl.DateTimeFormat('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(date);
    };

    const handleDelete = async () => {
        if (!selectedRoute) return;

        try {
            setLoading(true);
            await apiCaller.delete(`/api/dailyRoutes/${selectedRoute._id}`);
            fetchRoutes();
            setShowDeleteModal(false);
        } catch (error) {
            console.error("Error deleting route:", error);
            Alert.alert("Error", "Failed to delete route. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleStartTrip = async () => {
        if (!beforeJourneyNote || selectedPhotos.length === 0) {
            Alert.alert("Please add a note and select photos.");
            return;
        }
        if (selectedRoute) {
            const formData = new FormData()

            formData.append("beforeJourneyNote", beforeJourneyNote);
            selectedPhotos.forEach((image, index) => {
                if (image.uri) {
                    formData.append("beforeJourneyPhotos", {
                        uri: image.uri,
                        type: 'image/jpeg',
                        name: `photo${index}.jpg`
                    } as any);
                }
            });

            try {
                setLoading(true);
                await apiCaller.patch(`/api/busRoute/start?routeId=${selectedRoute._id}`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });
                Alert.alert("Success", "Trip started successfully!");
                setShowStartTripModal(false);
                fetchRoutes();
            } catch (error) {
                console.error("Error starting trip:", error);
                Alert.alert("Error", "Failed to start trip. Please try again.");
            } finally {
                setLoading(false);
            }
        }
    };

    const handleEndTrip = async () => {
        if (!afterJourneyNote || afterJourneyPhotos.length === 0) {
            Alert.alert("Please add a note and select photos.");
            return;
        }
        if (selectedRoute) {
            const formData = new FormData()
            formData.append("afterJourneyNote", afterJourneyNote)
            afterJourneyPhotos.forEach((image, index) => {
                if (image.uri) {
                    formData.append("afterJourneyPhotos", {
                        uri: image.uri,
                        type: 'image/jpeg',
                        name: `photo${index}.jpg`
                    } as any);
                }
            })

            try {
                setLoading(true);
                await apiCaller.patch(`/api/busRoute/complete?routeId=${selectedRoute._id}`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });
                Alert.alert("Success", "Trip ended successfully!");
                setShowEndTripModal(false);
                fetchRoutes();
            } catch (error) {
                console.error("Error ending trip:", error);
                Alert.alert("Error", "Failed to end trip. Please try again.");
            } finally {
                setLoading(false);
            }
        }
    };

    const pickImage = async (type: 'before' | 'after') => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsMultipleSelection: true,
            selectionLimit: 5,
            quality: 1,
        });

        if (!result.canceled) {
            if (type === 'before') {
                setSelectedPhotos(result.assets);
            } else {
                setAfterJourneyPhotos(result.assets);
            }
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.searchContainer}>
                <FontAwesome5 name="search" size={18} color={Colors.secondary} />
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search..."
                    placeholderTextColor={Colors.secondary}
                />
            </View>

            {loading ? (
                <ActivityIndicator size="large" color={Colors.darkBlue} />
            ) : (
                <ScrollView style={styles.routesList}>
                    {routes.map((route) => (
                        <View key={route._id} style={styles.card}>
                            <View style={styles.cardHeader}>
                                {route.status === "STARTED" ?
                                    <TouchableOpacity
                                        style={[styles.editButton, { backgroundColor: "red" }]}
                                        onPress={() => {
                                            setSelectedRoute(route);
                                            setShowEndTripModal(true);
                                        }}
                                    >
                                        <Text style={styles.editButtonText}>End Trip</Text>
                                    </TouchableOpacity>
                                    :
                                    <TouchableOpacity
                                        style={styles.editButton}
                                        onPress={() => {
                                            setSelectedRoute(route);
                                            setShowStartTripModal(true);
                                        }}
                                    >
                                        <Text style={styles.editButtonText}>Start Trip</Text>
                                    </TouchableOpacity>
                                }
                                <TouchableOpacity onPress={() => {
                                    setSelectedRoute(route);
                                    setShowDeleteModal(true);
                                }}>
                                    <MaterialIcons name="delete" size={24} color={Colors.darkBlue} />
                                </TouchableOpacity>
                            </View>

                            <View style={{ width: "100%", flexDirection: "row", justifyContent: "space-between" }} >
                                <Text style={{ fontWeight: "600", fontSize: 14 }} >Departure</Text>
                                <Text style={{ fontWeight: "600", fontSize: 14 }} >Destination</Text>
                            </View>
                            <View style={{ width: "100%", flexDirection: "row", justifyContent: "space-between", marginVertical: 5 }} >
                                <Text style={{ fontWeight: "600", fontSize: 15 }} >{route.departurePlace}</Text>
                                <MaterialIcons name="keyboard-double-arrow-right" size={24} color={Colors.darkBlue} />
                                <Text style={{ fontWeight: "600", fontSize: 15 }} >{route.destinationPlace}</Text>
                            </View>

                            <Text style={styles.cardText}>
                                Vehicle Number: <Text style={{ color: "black" }}>{route.vehicle.number}</Text>
                            </Text>
                            <Text style={styles.cardText}>
                                Departure Time: <Text style={{ color: "black" }}>{route.departureTime ? new Date(route.departureTime).toLocaleTimeString() : ""}</Text>
                            </Text>
                            <Text style={styles.cardText}>
                                Departure Date: <Text style={{ color: "black" }}>{timestampToDate(route.departureTime)}</Text>
                            </Text>
                            <Text style={styles.cardText}>
                                Cleaner Name: <Text style={{ color: "black" }}>{route.cleaner ? route.cleaner.name : "N/A"}</Text>
                            </Text>
                            <Text style={styles.cardText}>
                                Primary Driver : <Text style={{ color: "black" }}>{route.primaryDriver ? route.primaryDriver.name : "N/A"}</Text>
                            </Text>
                            <Text style={styles.cardText}>
                                Secondary Driver: <Text style={{ color: "black" }}>{route.secondaryDriver ? route.secondaryDriver.name : "N/A"}</Text>
                            </Text>

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

                <TouchableWithoutFeedback onPress={() => setShowDeleteModal(false)}>
                    <View style={styles.modalOverlay}>
                        <View style={[styles.modalContainer, { height: 200 }]}>
                            <View style={styles.modalContent}>
                                <Text style={styles.modalText}>Are you sure you want to delete this route?</Text>
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

            <Modal
                animationType="slide"
                transparent={true}
                visible={showStartTripModal}
                onRequestClose={() => setShowStartTripModal(false)}
            >
                <BlurOverlay visible={showStartTripModal} onRequestClose={() => setShowStartTripModal(false)} />

                <TouchableOpacity onPress={() => setShowStartTripModal(false)} style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                        <ScrollView style={styles.modalScroll}>
                            <View style={styles.modalContent}>
                                <View style={styles.inputGroup}>
                                    <Text style={styles.label}>Before Journey Note</Text>
                                    <TextInput
                                        style={[styles.input, styles.textarea, { height: Math.max(50, inputHeight) }]}
                                        value={beforeJourneyNote}
                                        onChangeText={(text) => setBeforeJourneyNote(text)}
                                        multiline={true}
                                        onContentSizeChange={(event) => {
                                            setInputHeight(event.nativeEvent.contentSize.height);
                                        }}
                                    />
                                </View>
                                <View style={styles.inputGroup}>
                                    <Text style={styles.label}>Before Journey Photos</Text>
                                    <TouchableOpacity style={styles.photoButton} onPress={() => pickImage('before')}>
                                        <Text style={styles.photoButtonText}>Select Photos</Text>
                                    </TouchableOpacity>
                                    <Text style={styles.maxPhotosText}>Max 5 photos</Text>
                                    <ScrollView horizontal>
                                        {selectedPhotos.map((photoUri, index) => (
                                            <Image
                                                key={index}
                                                source={{ uri: photoUri.uri }}
                                                style={styles.photo}
                                            />
                                        ))}
                                    </ScrollView>
                                </View>

                                <View style={styles.modalButtons}>
                                    <TouchableOpacity
                                        style={[styles.modalButton, { backgroundColor: Colors.darkBlue }]}
                                        onPress={handleStartTrip}
                                    >
                                        {loading ? (
                                            <ActivityIndicator color="#fff" />
                                        ) : (
                                            <Text style={[styles.modalButtonText, { color: "#fff" }]}>Start Trip</Text>
                                        )}
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </ScrollView>
                    </View>
                </TouchableOpacity>
            </Modal>

            <Modal
                animationType="slide"
                transparent={true}
                visible={showEndTripModal}
                onRequestClose={() => setShowEndTripModal(false)}
            >
                <BlurOverlay visible={showEndTripModal} onRequestClose={() => setShowEndTripModal(false)} />

                <TouchableOpacity onPress={() => setShowEndTripModal(false)} style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                        <ScrollView style={styles.modalScroll}>
                            <View style={styles.modalContent}>
                                <View style={styles.inputGroup}>
                                    <Text style={styles.label}>After Journey Note</Text>
                                    <TextInput
                                        style={[styles.input, styles.textarea, { height: Math.max(50, inputHeight) }]}
                                        value={afterJourneyNote}
                                        onChangeText={(text) => setAfterJourneyNote(text)}
                                        multiline={true}
                                        onContentSizeChange={(event) => {
                                            setInputHeight(event.nativeEvent.contentSize.height);
                                        }}
                                    />
                                </View>
                                <View style={styles.inputGroup}>
                                    <Text style={styles.label}>After Journey Photos</Text>
                                    <TouchableOpacity style={styles.photoButton} onPress={() => pickImage('after')}>
                                        <Text style={styles.photoButtonText}>Select Photos</Text>
                                    </TouchableOpacity>
                                    <Text style={styles.maxPhotosText}>Max 5 photos</Text>
                                    <ScrollView horizontal>
                                        {afterJourneyPhotos.map((photoUri, index) => (
                                            <Image
                                                key={index}
                                                source={{ uri: photoUri.uri }}
                                                style={styles.photo}
                                            />
                                        ))}
                                    </ScrollView>
                                </View>

                                <View style={styles.modalButtons}>
                                    <TouchableOpacity
                                        style={[styles.modalButton, { backgroundColor: Colors.darkBlue }]}
                                        onPress={handleEndTrip}
                                    >
                                        {loading ? (
                                            <ActivityIndicator color="#fff" />
                                        ) : (
                                            <Text style={[styles.modalButtonText, { color: "#fff" }]}>End Trip</Text>
                                        )}
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </ScrollView>
                    </View>
                </TouchableOpacity>
            </Modal>

            <FloatingButton />
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
    routesList: {
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
        gap: 30,
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
        fontSize: 12,
    },
    cardText: {
        marginBottom: 8,
        color: Colors.secondary,
        fontWeight: "500",
        fontSize: 13,
    },
    modalText: {
        marginBottom: 20,
        fontSize: 18,
        textAlign: "center",
    },
    modalOverlay: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    modalContainer: {
        width: deviceWidth * 0.8,
        backgroundColor: "#fff",
        borderRadius: 10,
        padding: 20,
        elevation: 5,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    modalScroll: {
        width: "100%",
    },
    modalContent: {
        flex: 1,
        justifyContent: "center",
    },
    inputGroup: {
        marginBottom: 20,
    },
    label: {
        fontWeight: "bold",
        marginBottom: 5,
        color: Colors.secondary,
    },
    input: {
        borderColor: Colors.secondary,
        borderWidth: 1,
        borderRadius: 5,
        padding: 10,
        color: Colors.secondary,
        height: 100,
        textAlignVertical: 'top',
        textAlign: 'left',
    },
    textarea: {
        minHeight: 50,
        maxHeight: 300,
        textAlignVertical: 'top',
        paddingTop: 10,
    },
    photoButton: {
        backgroundColor: Colors.darkBlue,
        paddingVertical: 10,
        borderRadius: 5,
        alignItems: "center",
        marginBottom: 10,
    },
    photoButtonText: {
        color: "#fff",
        fontWeight: "bold",
    },
    maxPhotosText: {
        color: Colors.secondary,
        marginBottom: 10,
    },
    photo: {
        width: 80,
        height: 80,
        borderRadius: 5,
        marginRight: 10,
    },
    modalButtons: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    modalButton: {
        flex: 1,
        paddingVertical: 10,
        borderRadius: 5,
        alignItems: "center",
    },
    modalButtonText: {
        fontWeight: "bold",
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default DailyRouteVehicles;