import React from "react";
import {
    StyleSheet,
    TouchableOpacity,
    Text,
    SafeAreaView,
    ScrollView,
    StatusBar,
} from "react-native";
import { Colors } from "@/constants/Colors";
import { router } from "expo-router";

const VehicleInspectionScreen: React.FC = () => {
    return (
        <SafeAreaView style={styles.container}>
            <ScrollView style={styles.driversList}>
                <TouchableOpacity onPress={() => router.push("package_vehicle_booking_inspection")} style={styles.carListButton}>
                    <Text style={styles.carListText}>Package Vehicle Booking</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => router.push("daily_route_vehicles_inspection")} style={styles.carListButton}>
                    <Text style={styles.carListText}>Daily Route Vehicle</Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: "#ffffff",
        marginTop: StatusBar.currentHeight,
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

export default VehicleInspectionScreen;
