import { StyleSheet, Text, TextInput, View } from 'react-native'
import React from 'react'
import { Colors } from '@/constants/Colors'

type componentProps = {
    value: string,
    onChange: (name: string, text: string) => void,
    type: string,
    name: string,
    label: string
}

export default function TextInputField({ value, onChange, type, name, label, keyboardType }: componentProps) {
    return (
        <View style={styles.inputGroup}>
            <Text style={styles.label}>{label}</Text>
            <TextInput
                style={styles.input}
                keyboardType={keyboardType?keyboardType:"default"}
                value={type === "text" ? value : type === "number" ? type.toString() : undefined}
                onChangeText={(text) => onChange(name, text)}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    inputGroup: {
        marginBottom: 15,
    },
    label: {
        marginBottom: 5,
        fontSize: 13,
        color: Colors.secondary,
        fontWeight: "500",
    },
    input: {
        borderColor: Colors.secondary,
        borderWidth: 1,
        borderRadius: 10,
        paddingHorizontal: 10,
        height: 40,
    },
})