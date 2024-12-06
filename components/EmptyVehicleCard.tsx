import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import ConfirmationModal from "./Modal";
import { MaterialIcons } from "@expo/vector-icons";
import Carousel from "./Carousel";
import { Colors } from "@/constants/Colors";
import { router } from "expo-router";

const EmptyVehicleCard = ({ vehicle, index, handleDelete }: EmptyVehicleCardProps) => {

    const [isDeleteModalVisible, setIsDeleteModalVisible] = useState<boolean>(false)
    const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null)
    const { setEditData } = useGlobalContext();

    const closeModal = () => {
        setIsDeleteModalVisible(false)
    }

    const handler = () => {
        if (selectedVehicle) {
            handleDelete(selectedVehicle._id)
            setIsDeleteModalVisible(false)
        }
    }

    function formatDate(dateString: string): string {
        const date = new Date(dateString);
        const year = date.getUTCFullYear();
        const month = date.getUTCMonth() + 1;
        const day = date.getUTCDate();
        return `${month}/${day}/${year}`;
    }



    return (
        <>
            <View key={index} style={styles.card}>
                <View style={styles.cardHeader}>

                    <TouchableOpacity onPress={() => { setEditData(vehicle); router.push("edit_empty_vehicle") }} style={styles.editButton}>
                        <Text style={styles.editButtonText}>Edit Route</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => { setIsDeleteModalVisible(true); setSelectedVehicle(vehicle); }}>
                        <MaterialIcons name="delete" size={24} color={Colors.darkBlue} />
                    </TouchableOpacity>
                </View>
                <Carousel height={300} images={vehicle.photos} />
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', margin: 10 }}>
                    <View style={{ alignItems: "center" }}>
                        <Text style={{ fontWeight: 'bold' }}>Departure</Text>
                        <Text>{vehicle.departurePlace}</Text>
                    </View>
                    <View style={{ alignItems: "center" }}>
                        <Text style={{ fontWeight: 'bold' }}>Destination</Text>
                        <Text>{vehicle.destinationPlace}</Text>
                    </View>
                </View>
                <View style={styles.cardTextContainer}>
                    <Text style={styles.cardText}>Vehicle No: </Text>
                    <Text style={{ color: "black" }}>{vehicle.vehicle.number.toUpperCase()}</Text>
                </View>
                <View style={styles.cardTextContainer}>
                    <Text style={styles.cardText}>Departure Date: </Text>
                    <Text style={{ color: "black" }}>{vehicle.departureDate ? formatDate(vehicle.departureDate) : "Time not added"}</Text>
                </View>
                <View style={styles.cardTextContainer}>
                    <Text style={styles.cardText}>Departure Time: </Text>
                    <Text style={{ color: "black" }}>{vehicle.departureTime ? new Date(vehicle.departureTime).toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true }) : "Time not added"}</Text>
                </View>
                <View style={styles.cardTextContainer}>
                    <Text style={styles.cardText}>Contact Number: </Text>
                    <Text style={{ color: "black" }}>{vehicle.mobileNumber}</Text>
                </View>
                <View style={styles.cardTextContainer}>
                    <Text style={styles.cardText}>More Info About Trip: </Text>
                    <Text style={{ color: "black" }}>{vehicle.moreInformation}</Text>
                </View>
            </View>
            {/* <ConfirmationModal actionBtnText="Delete" closeModal={closeModal} isVisible={isDeleteModalVisible} message="Are you sure you want to delete empty vehicle" handler={handler} /> */}
        </>
    )
}