import { StyleSheet, Text, View, SafeAreaView, TouchableOpacity } from 'react-native'
import React from 'react'
import { Colors } from '@/constants/Colors'
import { router } from 'expo-router'

export default function GoToLogin() {
    return (
        <SafeAreaView style={styles.container}>
            <Text style={{ marginBottom: 10 }}>You need to login to access this point</Text>
            <TouchableOpacity style={styles.btn} onPress={()=> router.replace("/login")} >
                <Text style={styles.btnText}>Login</Text>
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