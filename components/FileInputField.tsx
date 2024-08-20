import { StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native';
import React from 'react';
import { Colors } from '@/constants/Colors';

type FileInputFieldProps = {
    OnPress: ((event: GestureResponderEvent) => void) | undefined,
    image: object | object[] | null, // Adjusted to allow both single object and array
    isImageArray: boolean,
    label: string
};

export default function FileInputField({ OnPress, image, isImageArray, label }: FileInputFieldProps) {
    return (
        <>
            <TouchableOpacity style={styles.imagePicker} onPress={OnPress}>
                <Text style={styles.imagePickerText}>{label}</Text>
            </TouchableOpacity>
            {Image && (
                <View style={styles.imagePreviewContainer}>
                    {isImageArray && image ? (
                        image.map((img: object, index: number) => (
                            <Image key={index} source={{ uri: img.uri || img }} style={styles.previewImage} />
                        ))
                    ) : (
                        image && <Image source={{ uri: image.uri || image }} style={styles.previewImage} />
                    )}
                </View>
            )}
        </>
    );
}

const styles = StyleSheet.create({
    imagePreviewContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-around",
        marginBottom: 15,
    },
    imagePicker: {
        padding: 15,
        backgroundColor: Colors.secondary,
        borderRadius: 10,
        alignItems: "center",
        marginVertical: 15,
    },
    imagePickerText: {
        fontSize: 14,
        fontWeight: "500",
        color: Colors.primary,
    },
    previewImage: {
        width: 70,
        height: 70,
        borderRadius: 10,
        marginBottom: 10,
    },
});
