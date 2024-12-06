import { Alert, Dimensions, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useGlobalContext } from '@/context/GlobalProvider'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { FontAwesome5 } from '@expo/vector-icons'
import { ActivityIndicator } from 'react-native'
import { Colors } from '@/constants/Colors'

const { height } = Dimensions.get('window');

export default function NotificationsScreen() {
    const [isLoading, setIsLoading] = useState(false)
    const [notifications, setNotifications] = useState<TicketRequest[]>([])
    const [searchQuery, setSearchQuery] = useState<string>("")

    const { apiCaller } = useGlobalContext()

    const fetchNotifications = async () => {
        try {
            const res = await apiCaller.get("/api/ticketRequest")
            setNotifications(res.data.data)
        } catch (error: any) {
            console.log("Error", error?.response?.data?.message || error.message);
            Alert.alert("Error", "Could not fetch the notications")
        }
    }

    const filterTours = (query: string) => {
        
        return notifications.filter((notication) =>{
            const destinationMatch = notication?.route?.destinationPlace?.toLowerCase()?.includes(query?.toLowerCase())
            const departureMatch = notication?.route?.departurePlace?.toLowerCase()?.includes(query?.toLowerCase())
            const customerMatch = notication?.customer.userName?.toLowerCase()?.includes(query?.toLowerCase())
            const dateMatch = new Date(notication?.dateOfJourney).toLocaleDateString("en-US", ).toString()?.includes(query?.toLowerCase())
            
            return destinationMatch || departureMatch || customerMatch || dateMatch
        });
    };

    useEffect(() => {
        fetchNotifications()
    }, [])


    return (
        <GestureHandlerRootView style={{ flex: 1, marginTop: 50 }}>
            <SafeAreaView style={styles.container}>
                <ScrollView>
                

                    <View style={styles.searchContainer}>
                        <TouchableOpacity>
                            <FontAwesome5 name="search" size={18} color={Colors.secondary} />
                        </TouchableOpacity>
                        <TextInput
                            style={styles.searchInput}
                            placeholder="Search Tour Name"
                            placeholderTextColor={Colors.secondary}
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                        />
                    </View>

                    {
                        isLoading ? (
                            <ActivityIndicator size="large" color={Colors.darkBlue} />
                        ) :
                            filterTours(searchQuery).map((notication) => {
                                return <NotificationCard notification={notication} />
                            })
                    }

                </ScrollView>
            </SafeAreaView>
        </GestureHandlerRootView>
    );
}

const NotificationCard = ({ notification }: { notification: TicketRequest }) => {

    return (
        <>
            <View style={styles.card}>
                <Text style={styles.cardText}>Customer Name: <Text style={{ color: "black" }}>{notification?.customer.userName}</Text></Text>
                <Text style={styles.cardText}>Phone Number: <Text style={{ color: "black" }}>{notification?.customer.mobileNumber}</Text></Text>
                <Text style={styles.cardText}>Date of journey: <Text style={{ color: "black" }}>{notification?.dateOfJourney ? new Date(notification.dateOfJourney).toLocaleDateString("en-US"): "Date OF Journey is not available"}</Text></Text>
                <Text style={styles.cardText}>No. Of People: <Text style={{ color: "black" }}>{notification?.numberOfPeople}</Text></Text>
                <Text style={styles.cardText}>Gender: <Text style={{ color: "black" }}>{notification?.passengerGender}</Text></Text>
                <Text style={styles.cardText}>Departure Place: <Text style={{ color: "black" }}>{notification?.route.departurePlace}</Text></Text>
                <Text style={styles.cardText}>Destination Place: <Text style={{ color: "black" }}>{notification?.route.destinationPlace}</Text></Text>
                <Text style={styles.cardText}>Bus number: <Text style={{ color: "black" }}>{notification?.route?.vehicle?.number}</Text></Text>
            </View>
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        backgroundColor: "#EAEAEA",
    },
    searchContainer: {
        flexDirection: "row",
        alignItems: "center",
        borderColor: Colors.secondary,
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 15,
        marginBottom: 20,
        paddingVertical: 5,
    },
    searchInput: {
        flex: 1,
        marginLeft: 10,
        color: Colors.secondary,
    },

    notificationContainer: {
        marginVertical: 20,
        paddingHorizontal: 20,
        backgroundColor: '#51BEEE',
        borderRadius: 5,
        padding: 10,
    },
    notificationText: {
        color: '#ffffff',
        fontSize: 16,
        textAlign: 'center',
    },
    card: {
        backgroundColor: "#fff",
        padding: 10,
        borderRadius: 5,
        elevation: 3,
        shadowColor: "#000",
        shadowOffset: { width: 2, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        marginBottom: 20,

    },
    cardHeader: {
        flexDirection: "row",
        justifyContent: "flex-end",
        marginBottom: 10,
        alignItems: "center",
        gap: 5,
    },
    editButton: {
        backgroundColor: Colors.darkBlue,
        borderRadius: 5,
        padding: 5,
    },
    editButtonText: {
        color: "#fff",
        fontSize: 12,
    },
    cardText: {
        marginBottom: 1,
        color: Colors.secondary,
        fontWeight: "500",
        fontSize: 12,
    },
    image: {
        width: '100%',
        height: height * 0.3,
    },
    addButton: {
        backgroundColor: Colors.darkBlue,
        borderRadius: 8,
        padding: 8,
        paddingHorizontal: 1,
        alignItems: "center",
        marginBottom: 10,
        width: 200
    },
    addButtonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    },
});
