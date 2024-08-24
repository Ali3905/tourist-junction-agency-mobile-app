import { StyleSheet, Text, View, SafeAreaView, TouchableOpacity } from 'react-native'
import React from 'react'
import { Colors } from '@/constants/Colors'
import { router } from 'expo-router'

export default function GoToPlans() {
    return (
        <SafeAreaView style={styles.container}>
            <Text style={{ marginBottom: 10 }}>Your subscription has expired</Text>
            <TouchableOpacity style={styles.btn} onPress={()=> router.replace("plans")} >
                <Text style={styles.btnText}>Go to Plans</Text>
            </TouchableOpacity>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center"
    },
    btn: {
        backgroundColor: Colors.darkBlue,
        paddingVertical: 8,
        paddingHorizontal: 16,
    },
    btnText: {
        color: "white"
    }
})