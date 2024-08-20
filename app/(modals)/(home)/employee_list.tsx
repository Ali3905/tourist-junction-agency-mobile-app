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

interface Employee {
    _id: string;
    name: string;
    mobileNumber: string;
    employeeType: string;
    photo: string;
    aadharCard: string;
    email: string;
    phone: string;
    department: string;
    role: string;
}

const EmployeeListScreen: React.FC = () => {
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [loading, setLoading] = useState(true);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [showImageModal, setShowImageModal] = useState(false);
    const [idToDelete, setIdToDelete] = useState<null | string>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const { apiCaller, setEditData, refresh } = useGlobalContext();

    const fetchEmployees = async () => {



        try {
            setLoading(true);
            const response = await apiCaller.get('/api/employee');
            setEmployees(response.data.data);
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEmployees();
    }, [refresh]);

    const handleDelete = async () => {
        await apiCaller.delete(`/api/employee?employeeId=${idToDelete}`);
        setShowDeleteModal(false);
        fetchEmployees();
    };

    const handleViewImage = (imageUri: string) => {
        setSelectedImage(imageUri);
        setShowImageModal(true);
    };

    const filterEmployees = (query: string) => {
        return employees.filter((employee) =>
            Object.values(employee).some((value) =>
                String(value).toLowerCase().includes(query.toLowerCase())
            )
        );
    };

    const handleSearch = () => {
        setSearchQuery(searchQuery);
    };

    const filteredEmployees = searchQuery ? filterEmployees(searchQuery) : employees;

    const [isModalVisible, setModalVisible] = useState(false);

    const toggleModal = () => {
        setModalVisible(!isModalVisible);
    };


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

            <TouchableOpacity onPress={() => router.push("add_employee")} style={styles.addButton}>
                <Text style={styles.addButtonText}>Add employee</Text>
            </TouchableOpacity>

            {loading ? (
                <ActivityIndicator size="large" color={Colors.darkBlue} />
            ) : (
                <ScrollView style={styles.employeesList}>
                    {filteredEmployees.map((employee) => (
                        <View key={employee._id} style={styles.card}>
                            <View style={styles.imageContainer}>
                                <TouchableOpacity onPress={() => handleViewImage(employee.photo)} >
                                    <Image
                                        source={{ uri: employee.photo }}
                                        style={styles.driverImage}
                                    />
                                </TouchableOpacity>
                            </View>
                            <View style={styles.cardHeader}>
                                <TouchableOpacity onPress={() => { setEditData(employee); router.push("edit_employee") }} style={styles.editButton}>
                                    <Text style={styles.editButtonText}>Edit form</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => { setShowDeleteModal(true); setIdToDelete(employee._id) }}>
                                    <MaterialIcons name="delete" size={24} color={Colors.darkBlue} />
                                </TouchableOpacity>
                            </View>
                            <Text style={styles.cardText}>
                                Name: <Text style={{ color: "black" }}>{employee.name}</Text>
                            </Text>
                            <Text style={styles.cardText}>
                                Type: <Text style={{ color: "black" }}>{employee.employeeType}</Text>
                            </Text>
                            <Text style={styles.cardText}>
                                Phone: <Text style={{ color: "black" }}>{employee.mobileNumber}</Text>
                            </Text>
                            <View style={styles.cardActions}>
                                <Text style={styles.cardText}>Aadhar Card</Text>
                                <TouchableOpacity style={styles.viewButton} onPress={() => handleViewImage(employee.aadharCard)}>
                                    <Text style={styles.viewButtonText}>View Aadhaar</Text>
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
                        <Text style={styles.modalText}>Are you sure you want to delete this employee?</Text>
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
        backgroundColor: "#fff",
    },
    enlargedImage: {
        width: 300,
        height: 300,
        borderRadius: 10,
        marginTop: 20,
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
    employeesList: {
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
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        position: "relative",
        marginHorizontal: 5
    },
    employeeImage: {
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
    cardActions: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    viewButton: {
        backgroundColor: Colors.darkBlue,
        paddingHorizontal: 10,
        borderRadius: 5,
        paddingVertical: 5,
    },
    viewButtonText: {
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
});

export default EmployeeListScreen;