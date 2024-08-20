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

const VehicleTransactionScreen: React.FC = () => {
    return (
        <SafeAreaView style={styles.container}>
            <ScrollView style={styles.driversList}>
                <TouchableOpacity onPress={() => router.push("sell_vehicle")} style={styles.carListButton}>
                    <Text style={styles.carListText}>Sell Vehicle</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => router.push("rent_vehicle")} style={styles.carListButton}>
                    <Text style={styles.carListText}>Rent Vehicle</Text>
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
        fontWeight: "600",
        marginLeft: 10,
    },
});

export default VehicleTransactionScreen;
