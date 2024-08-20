import React from "react";
import {
    StyleSheet,
    TouchableOpacity,
    Text,
    Image,
    SafeAreaView,
    ScrollView,
} from "react-native";
import { Colors } from "@/constants/Colors";
import { router } from "expo-router";

const AllVehicleListScreen: React.FC = () => {
    return (
        <SafeAreaView style={styles.container}>
            <ScrollView style={styles.driversList}>
                <TouchableOpacity onPress={()=>router.push("car_list")} style={styles.carListButton}>
                    <Image source={require('@/assets/images/car.png')} />
                    <Text style={styles.carListText}>Car List</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={()=>router.push("bus_list")} style={styles.carListButton}>
                    <Image source={require('@/assets/images/bus.png')} />
                    <Text style={styles.carListText}>Bus List</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={()=>router.push("tempo_list")} style={styles.carListButton}>
                    <Image source={require('@/assets/images/tempo.png')} />
                    <Text style={styles.carListText}>Tempo Traveller List</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={()=>router.push("truck_list")} style={styles.carListButton}>
                    <Image source={require('@/assets/images/truck.png')} />
                    <Text style={styles.carListText}>Truck List</Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: "#fff",
    },
    driversList: {
        flex: 1,
    },
    carListButton: {
        borderRadius: 10,
        backgroundColor: Colors.secondary,
        alignItems: "center",
        flexDirection: "row",
        padding: 10,
        marginVertical: 5,
        height: 60
    },
    carListText: {
        fontSize: 16,
        fontWeight: "600", // changed from "semibold" to "600" as React Native doesn't support "semibold"
        marginLeft: 10,
    },
});

export default AllVehicleListScreen;
