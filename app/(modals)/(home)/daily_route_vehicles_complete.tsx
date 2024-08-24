import React, { useEffect, useState } from "react";
import {
    View,
    StyleSheet,
    TouchableOpacity,
    Text,
    SafeAreaView,
    ScrollView,
    TextInput,
    Alert,
    ActivityIndicator,
    Modal,
} from "react-native";
import { FontAwesome5, MaterialIcons } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";
import { router } from "expo-router";
import FloatingButton from "@/components/FloatingButton";
import { useGlobalContext } from "@/context/GlobalProvider";

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

const timestampToDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return new Intl.DateTimeFormat('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(date);
};

const DailyRouteVehiclesComplete: React.FC = () => {
    const [routes, setRoutes] = useState<DailyRoute[]>([]);
    const [loading, setLoading] = useState(false);
    const [selectedRoute, setSelectedRoute] = useState<DailyRoute | null>(null);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [showFullBeforeNote, setShowFullBeforeNote] = useState(false);
    const [showFullAfterNote, setShowFullAfterNote] = useState(false);

    const { apiCaller, driverId, setPhotos } = useGlobalContext();

    useEffect(() => {
        fetchRoutes();
    }, []);

    const fetchRoutes = async () => {
        try {
            setLoading(true);
            const response = await apiCaller.get(`/api/busRoute/driver/${driverId}`);
            const filteredRoutes = response.data.data.filter((route: DailyRoute) => route.status === "COMPLETED");
            setRoutes(filteredRoutes);
        } catch (error) {
            console.error("Error fetching routes:", error);
            Alert.alert("Error", "Failed to fetch routes. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleShowDetails = (route: DailyRoute) => {
        setSelectedRoute(route);
        setShowDetailsModal(true);
        setShowFullBeforeNote(false);
        setShowFullAfterNote(false);
    };

    const renderNote = (note: string, isFullNote: boolean, setFullNote: React.Dispatch<React.SetStateAction<boolean>>) => {
        const maxLength = 100;
        if (!note || note.length <= maxLength) {
            return <Text style={styles.modalNoteText}>{note || 'No notes available'}</Text>;
        }

        if (isFullNote) {
            return (
                <View>
                    <Text style={styles.modalNoteText}>{note}</Text>
                    <TouchableOpacity onPress={() => setFullNote(false)}>
                        <Text style={styles.readMoreLess}>Show Less</Text>
                    </TouchableOpacity>
                </View>
            );
        }

        return (
            <View>
                <Text style={styles.modalNoteText}>
                    {`${note.substring(0, maxLength)}...`}
                </Text>
                <TouchableOpacity onPress={() => setFullNote(true)}>
                    <Text style={styles.readMoreLess}>Read More</Text>
                </TouchableOpacity>
            </View>
        );
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
                    {routes.map((route, index) => (
                        <View key={index} style={styles.card}>
                            <View style={styles.cardHeader}>
                                <TouchableOpacity onPress={() => handleShowDetails(route)} style={styles.detailsButton}>
                                    <Text style={styles.detailsButtonText}>Details</Text>
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
                                Cleaner Name: <Text style={{ color: "black" }}>{route.cleaner ? route.cleaner.name : ""}</Text>
                            </Text>
                            <Text style={styles.cardText}>
                                Primary Driver : <Text style={{ color: "black" }}>{route.primaryDriver ? route.primaryDriver.name : ""}</Text>
                            </Text>
                            <Text style={styles.cardText}>
                                Secondary Driver: <Text style={{ color: "black" }}>{route.secondaryDriver ? route.secondaryDriver.name : ""}</Text>
                            </Text>
                        </View>
                    ))}
                </ScrollView>
            )}
            <FloatingButton />

            <Modal
                animationType="slide"
                transparent={true}
                visible={showDetailsModal}
                onRequestClose={() => setShowDetailsModal(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Journey Details</Text>
                        <Text style={styles.modalText}>Before Journey Notes:</Text>
                        {renderNote(selectedRoute?.beforeJourneyNote || '', showFullBeforeNote, setShowFullBeforeNote)}
                        <Text style={styles.modalText}>After Journey Notes:</Text>
                        {renderNote(selectedRoute?.afterJourneyNote || '', showFullAfterNote, setShowFullAfterNote)}
                        <View style={styles.modalButtons}>
                            <TouchableOpacity
                                style={[styles.modalButton, { backgroundColor: Colors.darkBlue }]}
                                onPress={() => { setShowDetailsModal(false); setPhotos(selectedRoute.beforeJourneyPhotos); router.push('before_photos') }}
                            >
                                <Text style={[styles.modalButtonText, { color: "#fff" }]}>Before Journey Photos</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.modalButton, { backgroundColor: Colors.darkBlue }]}
                                onPress={() => { setShowDetailsModal(false); setPhotos(selectedRoute.afterJourneyPhotos); router.push('after_photos') }}
                            >
                                <Text style={[styles.modalButtonText, { color: "#fff" }]}>After Journey Photos</Text>
                            </TouchableOpacity>
                        </View>
                        <TouchableOpacity
                            style={[styles.modalButton, { backgroundColor: "#ccc", marginTop: 10 }]}
                            onPress={() => setShowDetailsModal(false)}
                        >
                            <Text style={styles.modalButtonText}>Close</Text>
                        </TouchableOpacity>
                    </View>
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
    detailsButtonText: {
        color: "#fff",
        fontWeight: "semibold",
        fontSize: 10,
    },
    detailsButton: {
        backgroundColor: Colors.darkBlue,
        paddingHorizontal: 10,
        borderRadius: 5,
        paddingVertical: 5,
        height: 25,
        marginRight: 5,
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
    },
    cardText: {
        marginBottom: 8,
        color: Colors.secondary,
        fontWeight: "500",
        fontSize: 13,
    },
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
        marginBottom: 5,
        textAlign: "left",
        fontWeight: "bold",
        alignSelf: "flex-start",
    },
    modalNoteText: {
        marginBottom: 15,
        textAlign: "left",
        alignSelf: "flex-start",
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 15,
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
    readMoreLess: {
        color: Colors.darkBlue,
        fontWeight: "bold",
        marginBottom: 10,
    },
});

export default DailyRouteVehiclesComplete;