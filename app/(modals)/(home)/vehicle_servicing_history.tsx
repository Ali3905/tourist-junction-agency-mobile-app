import React, { useEffect, useState } from "react";
import {
    View,
    Modal,
    StyleSheet,
    TouchableOpacity,
    Text,
    TouchableWithoutFeedback,
    SafeAreaView,
    ScrollView,
    TextInput,
    Image,
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

interface ServiceHistory {
    _id: string;
    garageName: string;
    garageNumber: string;
    date: string;
    workDescription: string;
    vehicle: string;
    bill: string[];
}

const ServiceHistoryScreen: React.FC = () => {
    const [docs, setDocs] = useState<ServiceHistory[]>([])
    const [selectedBill, setSelectedBill] = React.useState<string[] | null>(null);
    const [showBillModal, setShowBillModal] = React.useState(false);
    const [loading, setLoading] = useState(true);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [idToDelete, setIdToDelete] = useState<null | string>(null)
    const [searchQuery, setSearchQuery] = useState("");
    const { apiCaller, setEditData, refresh } = useGlobalContext();
    const [vehicleNumbers, setVehicleNumbers] = useState<{ id: string, number: string }[]>([]);

    const findVehicleByNumber = (id: string) => {
        return vehicleNumbers.find(vehicle => vehicle.id === id);
      };

    const fetchVehiclesDocs = async () => {
        try {
            setLoading(true);
            const response = await apiCaller.get('/api/service');
            setDocs(response.data.data)
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    };
    function formatDate(dateString: string): string {
        const date = new Date(dateString);
        const year = date.getUTCFullYear();
        const month = date.getUTCMonth() + 1;
        const day = date.getUTCDate();
        return `${month}/${day}/${year}`;
      }

    useEffect(() => {
        fetchVehiclesDocs();
    }, [refresh]);

    const handleViewBill = (billUrls: string[]) => {
        console.log("Bill URLs:", billUrls);
        setSelectedBill(billUrls);
        setShowBillModal(true);
    };

    const handleDelete = async () => {
        await apiCaller.delete(`/api/vehicle?vehicleId=${idToDelete}`);
        setShowDeleteModal(false);
        fetchVehiclesDocs()
    };

    const filterServiceHistory = (query: string) => {
        return docs.filter((record) =>
            Object.values(record).some((value) =>
                String(value).toLowerCase().includes(query.toLowerCase())
            )
        );
    };

    const handleSearch = () => {
        setSearchQuery(searchQuery);
    };

    const filteredServiceHistory = searchQuery ? filterServiceHistory(searchQuery) : docs;

   
        const extractNumbers = (data: Vehicle[]): { id: string, number: string }[] => {
            return data.map(vehicle => ({ id: vehicle._id, number: vehicle.number }));
        };


        const fetchVehicles = async () => {
            try {
                setLoading(true);
                const response = await apiCaller.get('/api/vehicle');
                setVehicleNumbers(extractNumbers(response.data.data.vehicles));
            } catch (err) {
                console.log(err);
            } finally {
                setLoading(false);
            }
        };

        useEffect(() => {
            fetchVehicles();
        }, []);


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

            <TouchableOpacity onPress={() => router.push("add_vehicle_servicing_history")} style={styles.addButton}>
                <Text style={styles.addButtonText}>Add Vehicle</Text>
            </TouchableOpacity>

            {loading ? (
                <ActivityIndicator size="large" color={Colors.darkBlue} />
            ) : (
                <ScrollView style={styles.recordsList}>
                    {filteredServiceHistory.map((record, index) => (
                        <View key={index} style={styles.card}>
                            <View style={styles.cardHeader}>
                                <TouchableOpacity onPress={() => { setEditData(record); router.push("edit_vehicle_servicing_history") }} style={styles.editButton}>
                                    <Text style={styles.editButtonText}>Edit form</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => { setShowDeleteModal(true); setIdToDelete(record._id) }}>
                                    <MaterialIcons name="delete" size={24} color={Colors.darkBlue} />
                                </TouchableOpacity>
                            </View>
                            <Text style={styles.cardText}>Vehicle Number: <Text style={{ color: "black" }}>{findVehicleByNumber(record.vehicle)?.number.toUpperCase()}</Text></Text>
                            {/* <Text style={styles.cardText}>Vehicle Number:</Text> */}
                            {/* <Text style={{color: "black"}}>{findVehicleByNumber(record.vehicle)?.number}</Text> */}

                            <Text style={styles.cardText}>Garage Number: <Text style={{ color: "black" }}>{record.garageNumber}</Text></Text>
                            <Text style={styles.cardText}>Garage Name: <Text style={{ color: "black" }}>{record.garageName}</Text></Text>
                            <Text style={styles.cardText}>Date: <Text style={{ color: "black" }}>{formatDate(record.date)}</Text></Text>
                            <Text style={styles.cardText}>Work Details: <Text style={{ color: "black" }}>{record.workDescription}</Text></Text>
                            <TouchableOpacity style={styles.viewBillButton} onPress={() => handleViewBill(record.bill)}>
                                <Text style={styles.viewBillButtonText}>View Bill</Text>
                            </TouchableOpacity>
                        </View>
                    ))}
                </ScrollView>
            )}
            <Modal
                animationType="slide"
                transparent={true}
                visible={showBillModal}
                onRequestClose={() => setShowBillModal(false)}
            >
                <BlurOverlay visible={showBillModal} onRequestClose={() => setShowBillModal(false)} />

                <View style={styles.modalContainer}>
                    <ScrollView contentContainerStyle={styles.imageScrollView}>
                        {selectedBill && selectedBill.length > 0 ? (
                            selectedBill.map((imageUrl, index) => (
                                <Image key={index} source={{ uri: imageUrl }} style={styles.billImage} />
                            ))
                        ) : (
                            <Text style={styles.modalText}>No images available</Text>
                        )}
                    </ScrollView>
                </View>
            </Modal>

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
    recordsList: {
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
    cardText: {
        marginBottom: 10,
        color: Colors.secondary,
        fontWeight: "500",
        fontSize: 15,
    },
    viewBillButton: {
        backgroundColor: Colors.darkBlue,
        paddingHorizontal: 10,
        borderRadius: 5,
        paddingVertical: 5,
        alignItems: "center",
    },
    viewBillButtonText: {
        color: "#fff",
        fontWeight: "bold",
    },
    overlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
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
    imageScrollView: {
        alignItems: 'center',
    },
    billImage: {
        width: 300,
        height: 300,
        borderRadius: 10,
        marginBottom: 10,
    },
    addButtonText: {
        color: "#fff",
        fontWeight: "bold",
    },
    addButton: {
        backgroundColor: Colors.darkBlue,
        paddingVertical: 10,
        borderRadius: 5,
        alignItems: "center",
        marginBottom: 20,
        width: 140,
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
});

export default ServiceHistoryScreen;