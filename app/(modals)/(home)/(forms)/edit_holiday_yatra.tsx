import { SafeAreaView, ScrollView, StyleSheet, Text, View, TouchableOpacity, ActivityIndicator, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Colors } from "@/constants/Colors";
import * as ImagePicker from "expo-image-picker";
import TextInputField from '@/components/TextInputField';
import FileInputField from '@/components/FileInputField';
import { useGlobalContext } from '@/context/GlobalProvider';
import { router } from 'expo-router';

type Tour = {
    name: string,
    primaryMobileNumber: string,
    secondaryMobileNumber: string,
    officeAddress: string,
    location: string,
    photos: ImagePicker.ImagePickerAsset[] | []
}

export default function EditHolidayYatraScreen() {

    const [loading, setLoading] = useState(false);
    const { apiCaller, setRefresh, editData } = useGlobalContext();


    const [tour, setTour] = useState<Tour>({
        name: "",
        primaryMobileNumber: "",
        secondaryMobileNumber: "",
        officeAddress: "",
        location: "",
        photos: []
    })

    const formFields = [
        { name: "name", label: "Tour name", type: "text" },
        { name: "primaryMobileNumber", label: "Mobile Number 1", type: "text", keyboardType: "numeric" },
        { name: "secondaryMobileNumber", label: "Mobile Number 2", type: "text", keyboardType: "numeric" },
        { name: "officeAddress", label: "Office Address", type: "text" },
        { name: "location", label: "Location", type: "text" },
        { name: "photos", label: "Upload Photo", type: "file" },
    ]

    const onChange = (name: string, text: string) => {
        setTour({
            ...tour, [name]: text
        })
    }

    const handleImagePicker = async () => {
        console.log("running till here");

        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsMultipleSelection: false,
            quality: .7,
        });

        if (!result.canceled) {
            setTour({ ...tour, photos: result.assets });
        }
    };


    const handleSubmit = async () => {
        try {
            setLoading(true)
            const formData = new FormData()

            Object.keys(tour).forEach((ele) => {
                const key = ele as keyof Tour
                if (tour[key] === "" || tour[key] === null) return;
                if (ele === "photos") {
                    tour.photos.map((ph, index) => {
                        if (ph && ph.uri) {
                            formData.append(ele, {
                                uri: tour[key][index].uri,
                                name: tour[key][index].fileName || "photo.jpg",
                                type: tour[key][index].mimeType || "image/jpeg",
                            });
                        }
                    })
                } else {
                    formData.append(ele, tour[key] as string);
                }
            });

            const res = await apiCaller.patch(`/api/tour?tourId=${editData._id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
            setLoading(false)
            setRefresh(prev => !prev)
            resetForm()
            Alert.alert("Success", "Tour updated successfully!");
            router.back()
        } catch (error) {
            console.log(error);
            setLoading(false);
            Alert.alert("Error", "Failed to Update tour. Please try again.");
        }


    }

    const resetForm = () => {
        setTour({
            name: "",
            primaryMobileNumber: "",
            secondaryMobileNumber: "",
            officeAddress: "",
            location: "",
            photos: []
        })
    }

    useEffect(()=>{
        setTour(editData)
    }, [editData])

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView style={styles.scrollView}>
                <View style={styles.content}>

                    {
                        formFields.map((field) => {
                            return field.type === "text" ? <TextInputField name={field.name} value={tour[field.name]} label={field.label} onChange={onChange} type={field.type} key={field.name} keyboardType={field.keyboardType ? field.keyboardType : undefined} /> :
                                field.type === "file" ? <FileInputField OnPress={handleImagePicker} image={tour.photos} isImageArray={true} label={field.label} key={field.name} /> : null
                        })
                    }

                    <View style={styles.modalButtons}>
                        <TouchableOpacity
                            style={[styles.modalButton, { backgroundColor: Colors.darkBlue }]}
                            onPress={handleSubmit}
                        >
                            {loading ? (
                                <ActivityIndicator color="#fff" />
                            ) : (
                                <Text style={[styles.modalButtonText, { color: "#fff" }]}>Submit</Text>
                            )}
                        </TouchableOpacity>
                    </View>



                </View>


            </ScrollView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#ffffff",
    },
    scrollView: {
        flex: 1,
        paddingTop: 10,
        paddingHorizontal: 20,
    },
    content: {
        backgroundColor: "#fff",
        borderRadius: 10,
        elevation: 5,
        padding: 20,
    },


    modalButtons: {
        flexDirection: "row",
        justifyContent: "center",
        paddingVertical: 10,
    },
    modalButton: {
        borderRadius: 5,
        paddingHorizontal: 20,
        paddingVertical: 10,
        marginHorizontal: 10,
    },
    modalButtonText: {
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: 4
    },

})