import { SafeAreaView, ScrollView, StyleSheet, Text, View, TextInput, Image, TouchableOpacity, ActivityIndicator, Alert, Pressable } from 'react-native'
import React, { useState } from 'react'
import { Colors } from "@/constants/Colors";
import * as ImagePicker from "expo-image-picker";
import TextInputField from '@/components/TextInputField';
import FileInputField from '@/components/FileInputField';
import { useGlobalContext } from '@/context/GlobalProvider';
import DateTimePicker from '@react-native-community/datetimepicker';
import { router } from 'expo-router';
import AntDesign from '@expo/vector-icons/AntDesign';
type Tour = {
    name: string,
    mobileNumbers: string[],
    departureDate: Date | null,
    arrivalDate: Date | null,
    lastDateToBook: Date | null,
    description: string,
    amenities: string[],
    experience: string,
    price: number,
    officeAddress: string,
    travellingWith: string[],
    location: string,
    priceForCouple: number,
    priceForSingle: number,
    cities: string[],
    photos: ImagePicker.ImagePickerAsset[] | []
}

const add_holiday_yatra = () => {

    // const [busImages, setBusImages] = useState<ImagePicker.ImagePickerAsset[]>([]);
    const [loading, setLoading] = useState(false);
    const { apiCaller, setRefresh } = useGlobalContext();

    const [showDepartureDatePicker, setShowDepartureDatePicker] = useState(false)
    const [showArrivalDatePicker, setShowArrivalDatePicker] = useState(false)
    const [showLastDateDatePicker, setShowLastDatePicker] = useState(false)

    const [tour, setTour] = useState<Tour>({
        name: "",
        location: "",
        departureDate: null,
        arrivalDate: null,
        description: "",
        amenities: [],  // Assuming amenities is an array of selected options
        lastDateToBook: null,
        experience: "",
        price: 0,
        officeAddress: "",
        mobileNumbers: ["", "", "", ""],
        priceForSingle: 0,
        priceForCouple: 0,
        cities: [""],
        photos: [],
        travellingWith: [],
    });


    const formFields = [
        { name: "name", label: "Tour name", type: "text" },
        { name: "location", label: "Location", type: "text" },
        { name: "departureDate", label: "Departure Date", type: "date" },
        { name: "arrivalDate", label: "Arrival Date", type: "date" },
        { name: "description", label: "Trip Details", type: "text" },
        {
            name: "amenities", label: "Package Include", type: "checkbox", options: [
                { label: "Loadge", value: "LOADGE" },
                { label: "Hall", value: "HALL" },
                { label: "Dharma Shala", value: "DHARMA-SHALA" },
                { label: "Hot Water", value: "HOT-WATER" },
                { label: "Water Bottle", value: "WATER-BOTTLE" },
                { label: "Mineral Water", value: "MINERAL-WATER" },
                { label: "Breakfast", value: "BREAKFAST" },
                { label: "Tea", value: "TEA" },
                { label: "Lunch", value: "LUNCH" },
                { label: "Dinner", value: "DINNER" },
                { label: "Auto", value: "AUTO" },
                { label: "Taxi", value: "TAXI" },
                { label: "Boating", value: "BOATING" },
                { label: "Guide Fee", value: "GUIDE-FEE" },
                { label: "Visit Fee", value: "VISIT-FEE" },
                { label: "Sightseeing Fee", value: "SIGHT-SEEING-FEE" },
                { label: "2-Time Meal", value: "2-TIME-MEAL" }
            ]
        },
        {
            name: "travellingWith", label: "Travelling With", type: "checkbox", options: [
                { label: "Bus", value: "BUS" },
                { label: "Train", value: "TRAIN" },
                { label: "Plane", value: "PLANE" },
            ]
        },
        { name: "lastDateToBook", label: "Last Date To Book", type: "date" },
        { name: "experience", label: "Experience", type: "text" },
        { name: "cities", label: "Bookings accepted from: city", type: "array" },
        { name: "mobileNumbers", label: "Mobile Number", type: "multi", keyboardType: "numeric" },
        { name: "priceForSingle", label: "Price Per Person", type: "text", keyboardType: "numeric" },
        { name: "priceForCouple", label: "Price Per Couple", type: "text", keyboardType: "numeric" },
        { name: "officeAddress", label: "Office Address", type: "text" },
        { name: "photos", label: "Upload Photo", type: "file" },
    ]

    const onChange = (name: string, text: string, type: string) => {
        if (type === "text") {
            setTour({
                ...tour,
                [name]: text
            });
        } else if (type === "checkbox") {
            setTour({
                ...tour,
                [name]: tour[name].includes(text)
                    ? tour[name].filter((item: string) => item !== text)  // Remove if already exists
                    : [...tour[name], text]                               // Add if not present
            });
        }
    };


    const handleImagePicker = async () => {
        // console.log("running till here");

        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsMultipleSelection: true,
            selectionLimit: 5,
            quality: .7,
        });

        if (!result.canceled) {

            setTour({ ...tour, photos: result.assets });
        }
    };

    const handleSubmit = async () => {
        try {
            setLoading(true)
            console.log({ tour });

            const formData = new FormData()

            formData.append("name", tour.name);
            formData.append("description", tour.description);
            formData.append("experience", tour.experience);
            formData.append("officeAddress", tour.officeAddress);
            formData.append("price[forPerson]", Number(tour.priceForSingle));
            formData.append("price[forCouple]", Number(tour.priceForCouple));
            formData.append("location", tour.location);
            formData.append("arrivalDate", tour?.arrivalDate?.toISOString());
            formData.append("departureDate", tour?.departureDate?.toISOString());
            formData.append("lastDateToBook", tour?.lastDateToBook?.toISOString());

            tour.cities.forEach((city) => {
                console.log(city);

                if (city) {
                    formData.append('acceptedCities', city)
                }
            })
            tour.mobileNumbers.forEach((num) => {
                if (num) {
                    formData.append('mobileNumbers', num)
                }
            })
            tour.amenities.forEach((amenity) => {
                if (amenity) {
                    formData.append('amenities', amenity)
                }
            })
            tour.travellingWith.forEach((veh) => {
                if (veh) {
                    formData.append('travellingWith', veh)
                }
            })
            tour?.photos?.forEach((photo, index) => {
                if (photo && photo.uri) {
                    formData.append('photos', {
                        uri: photo.uri,
                        type: 'image/jpeg',
                        name: `photo${index}.jpg`
                    } as any);
                }
            })

            const res = await apiCaller.post('/api/tour', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
            setLoading(false)
            resetForm()
            setRefresh(prev => !prev)
            Alert.alert("Success", "Tour added successfully!");
            router.back()
        } catch (error) {
            console.log(error.response.data.message);
            setLoading(false);
            Alert.alert("Error", "Failed to add route. Please try again.");
        }


    }

    const resetForm = () => {
        setTour({
            name: "",
            location: "",
            departureDate: null,
            arrivalDate: null,
            description: "",
            amenities: [],  // Assuming amenities is an array of selected options
            lastDateToBook: null,
            experience: "",
            price: 0,
            officeAddress: "",
            mobileNumbers: [""],
            priceForCouple: 0,
            priceForSingle: 0,
            cities: [""],
            photos: [],
            travellingWith: [],
        })
    }

    const handleChangeMobileNumbers = (index: number, text: string, fieldName: string) => {

        let numbers = tour[fieldName]
        numbers[index] = text

        setTour({ ...tour, [fieldName]: numbers })

    }

    const onChangeDepartureDate = (event: any, selectedDate?: Date) => {
        setShowDepartureDatePicker(false);
        if (selectedDate) {
            setTour({ ...tour, departureDate: selectedDate });
        }
    };

    const onChangeArrivalDate = (event: any, selectedDate?: Date) => {
        setShowArrivalDatePicker(false);
        if (selectedDate) {
            setTour({ ...tour, arrivalDate: selectedDate });
        }
    };

    const onChangeLastDate = (event: any, selectedDate?: Date) => {
        setShowLastDatePicker(false);
        if (selectedDate) {
            setTour({ ...tour, lastDateToBook: selectedDate });
        }
    };

    function formatDate(dateString: string): string {
        // console.log(dateString)
        const date = new Date(dateString);
        const year = date.getUTCFullYear();
        const month = date.getUTCMonth() + 1;
        const day = date.getUTCDate();
        return `${month}/${day}/${year}`;
    }

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView style={styles.scrollView}>
                <View style={styles.content}>

                    {
                        formFields.map((field) => {
                            return field.type === "text" ? <TextInputField name={field.name} value={field.keyboardType === "numeric" ? tour[field.name].toString() : tour[field.name]} label={field.label} onChange={(name, text) => onChange(name, text, field.type)} type={field.type} key={field.name} keyboardType={field.keyboardType ? field.keyboardType : undefined} /> :
                                field.type === "file" ? <FileInputField OnPress={handleImagePicker} image={tour.photos} isImageArray={true} label={field.label} key={field.name} /> :
                                    field.type === "checkbox" ? <View style={styles.featuresContainer}>
                                        <Text style={styles.label}>{field.label}</Text>
                                        {
                                            field.options?.map((ele, i) => {
                                                return <Pressable key={field.name + i} style={{ flexDirection: "row", alignItems: "center", gap: 10, marginVertical: 5 }} onPress={() => onChange(field.name, ele.value, field.type)}>
                                                    <View  style={[styles.checkbox, { backgroundColor: tour[field.name]?.includes(ele.value) ? Colors.darkBlue : "white", borderColor: tour[field.name]?.includes(ele.value) ? Colors.darkBlue : "black" }]}>
                                                        <AntDesign name="check" size={24} color="white" />
                                                    </View>
                                                    <Text style={styles.checkboxText}>{ele.label}</Text>
                                                    {/* <View style={{flexDirection: "row"}}>
                                                     <TouchableOpacity
                                                    style={[styles.checkboxContainer, { backgroundColor: tour[field.name]?.includes(ele.value) ? Colors.darkBlue : Colors.secondary }]}
                                                    onPress={() => onChange(field.name, ele.value, field.type)}
                                                >
                                                    <Text style={styles.checkboxText}>Yes</Text>

                                                </TouchableOpacity>
                                                <TouchableOpacity
                                                    style={[styles.checkboxContainer, { backgroundColor: !tour[field.name]?.includes(ele.value) ? Colors.darkBlue : Colors.secondary }]}
                                                    onPress={() => onChange(field.name, ele.value, field.type)}
                                                >
                                                    <Text style={styles.checkboxText}>No</Text>
                                                </TouchableOpacity>
                                                     </View> */}
                                                </Pressable>
                                            })
                                        }
                                    </View> : field.name === "departureDate" ?

                                        <View style={styles.inputGroup}>
                                            <Text style={styles.label}>Date(From)</Text>
                                            <TouchableOpacity
                                                style={styles.input}
                                                onPress={() => setShowDepartureDatePicker(true)}
                                            >
                                                <Text>{tour.departureDate ? formatDate(tour.departureDate) : "Select Date"}</Text>
                                            </TouchableOpacity>
                                            {showDepartureDatePicker && (
                                                <DateTimePicker
                                                    value={tour.departureDate || new Date()}
                                                    mode="date"
                                                    display="default"
                                                    onChange={onChangeDepartureDate}
                                                />
                                            )}
                                        </View> : field.name === "arrivalDate" ?

                                            <View style={styles.inputGroup}>
                                                <Text style={styles.label}>Date (To)</Text>
                                                <TouchableOpacity
                                                    style={styles.input}
                                                    onPress={() => setShowArrivalDatePicker(true)}
                                                >
                                                    <Text>{tour.arrivalDate ? formatDate(tour.arrivalDate) : "Select Date"}</Text>
                                                </TouchableOpacity>
                                                {showArrivalDatePicker && (
                                                    <DateTimePicker
                                                        value={tour.arrivalDate || new Date()}
                                                        mode="date"
                                                        display="default"
                                                        onChange={onChangeArrivalDate}
                                                    />
                                                )}
                                            </View> : field.name === "lastDateToBook" ?

                                                <View style={styles.inputGroup}>
                                                    <Text style={styles.label}>Last Date</Text>
                                                    <TouchableOpacity
                                                        style={styles.input}
                                                        onPress={() => setShowLastDatePicker(true)}
                                                    >
                                                        <Text>{tour.lastDateToBook ? formatDate(tour.lastDateToBook) : "Select Date"}</Text>
                                                    </TouchableOpacity>
                                                    {showLastDateDatePicker && (
                                                        <DateTimePicker
                                                            value={tour.lastDateToBook || new Date()}
                                                            mode="date"
                                                            display="default"
                                                            onChange={onChangeLastDate}
                                                        />
                                                    )}
                                                </View> :
                                                field.type === "array" ?
                                                    <View>
                                                        {tour[field.name].map((ele, i) => {
                                                            return <TextInputField name={field.name} value={tour[field.name][i]} label={field.label + " " + [i + 1]} onChange={(name, text) => handleChangeMobileNumbers(i, text, field.name)} type={field.type} key={field.name + i} />
                                                        })}
                                                        <View>
                                                            <TouchableOpacity style={{ padding: 4, borderWidth: 1, borderColor: Colors.secondary }} onPress={() => setTour({ ...tour, [field.name]: [...tour[field.name], ""] })}><Text>Add More cities</Text></TouchableOpacity>
                                                            <TouchableOpacity style={{ padding: 4, borderWidth: 1, borderColor: Colors.secondary }} onPress={() => setTour({ ...tour, [field.name]: tour[field.name].slice(0, -1) })}><Text>Remove cities</Text></TouchableOpacity>
                                                        </View>
                                                    </View> :
                                                    field.type === "multi" ?
                                                        <View>
                                                            {
                                                                tour.mobileNumbers.map((num, i) => {
                                                                    return <TextInputField name={field.name} value={field.keyboardType === "numeric" ? tour[field.name].toString() : tour[field.name]} label={field.label + " " + [i + 1]} onChange={(name, text) => handleChangeMobileNumbers(i, text, field.name)} type={field.type} key={field.name + i} keyboardType={field.keyboardType ? field.keyboardType : undefined} />
                                                                })
                                                            }
                                                        </View>
                                                        :
                                                        null
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

export default add_holiday_yatra

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
    featuresContainer: {
        flexDirection: "column",
        justifyContent: "space-between",
        // borderColor: Colors.secondary,
        gap: 4,
        // borderWidth: 2,
        // padding: 10,
        borderRadius: 10,
        marginBottom: 15,
    },
    checkboxContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        padding: 10,
        borderRadius: 5,
        marginHorizontal: 5,
    },
    checkbox: {
        borderWidth: 1,
        borderRadius: 10,
        padding: 2
    },
    checkboxText: {
        color: Colors.primary,
        fontWeight: "500",
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
        justifyContent: 'center'
    },
    inputGroup: {
        marginBottom: 15,
    },

})