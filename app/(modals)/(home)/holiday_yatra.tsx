import { StyleSheet, Text, View, Image, Dimensions, SafeAreaView, TextInput, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Colors } from "@/constants/Colors";
import { GestureHandlerRootView, ScrollView } from 'react-native-gesture-handler';
import { FontAwesome5, MaterialIcons } from "@expo/vector-icons";
import { router } from 'expo-router';
import PhoneNumbersList from '@/components/PhoneNumberList';
import { useGlobalContext } from '@/context/GlobalProvider';
import ConfirmationModal from '@/components/Modal';

const { width, height } = Dimensions.get('window');

const holiday_yatra = () => {

  const [isLoading, setIsLoading] = useState(false);
  const [tours, setTours] = useState([])
  const { apiCaller, setRefresh, refresh } = useGlobalContext();

  const fetchTours = async () => {
    setIsLoading(true)
    try {
      const res = await apiCaller.get("/api/tour")
      setTours(res.data.data)
    } catch (error) {
      console.log(error);
      Alert.alert("Error", "Failed to add route. Please try again.");
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (tourId : string) => {
    if (tourId) {
      try {
        await apiCaller.delete(`/api/tour?tourId=${tourId}`);
        fetchTours()
        setRefresh(prev => !prev)
        Alert.alert("Success", "Holiday Yatra deleted")
      } catch (err) {
        console.error(err);
        Alert.alert("Error", "Could not delete the holiday yatra")
      }
    }
  };


  useEffect(() => {
    fetchTours()
  }, [refresh])

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView style={styles.container}>
        <ScrollView>
          {/* <Text>holiday_yatra</Text>
          <Text onPress={() => router.push('/add_holiday_yatra')}>Add form</Text> */}

          <View style={styles.searchContainer}>
            <TouchableOpacity>
              <FontAwesome5 name="search" size={18} color={Colors.secondary} />
            </TouchableOpacity>
            <TextInput
              style={styles.searchInput}
              placeholder="Search..."
              placeholderTextColor={Colors.secondary}
            />
          </View>

          <TouchableOpacity onPress={() => router.push("add_holiday_yatra")} style={styles.addButton}>
            <Text style={styles.addButtonText}>Add Yatra</Text>
          </TouchableOpacity>

          {
            isLoading ? (
              <ActivityIndicator size="large" color={Colors.darkBlue} />
            ) :
              tours.map((tour) => {
                return <TourCard tour={tour} handleDelete={handleDelete} />
              })
          }



        </ScrollView>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
};

export default holiday_yatra;

const TourCard = ({ tour, handleDelete } : any) => {
  
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState<boolean>(false)
  const { setEditData } = useGlobalContext();

  
  const handleCloseModal = () => {
    setIsDeleteModalVisible(false)
  }

  const handleOpenModal = () => {
    setIsDeleteModalVisible(true)
  }
  
  return (
    <>
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <TouchableOpacity onPress={() => { setEditData(tour); router.push("edit_holiday_yatra") }} style={styles.editButton}>
            <Text style={styles.editButtonText}>Edit Tour</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={handleOpenModal} style={styles.editButton}>
            {/* <MaterialIcons name="delete" size={24} color={Colors.darkBlue} /> */}
            <Text style={styles.editButtonText}>Delete</Text>
          </TouchableOpacity>
        </View>
        <Image source={{ uri: tour.photo }} height={200} />

        <Text style={styles.cardText}>{tour?.agencyName}<Text style={{ color: "black" }}></Text></Text>
        <View style={{ padding: 1 }}>
          <PhoneNumbersList phoneNumbers={[tour?.primaryMobileNumber, tour?.secondaryMobileNumber]} />
        </View>
        <Text style={styles.cardText}>Office Address:  <Text style={{ color: "black" }}>{tour?.officeAddress}</Text></Text>
        <Text style={styles.cardText}>Tour Name: <Text style={{ color: "black" }}>{tour?.name}</Text></Text>
        <Text style={styles.cardText}>Location: <Text style={{ color: "black" }}>{tour?.location}</Text></Text>
      </View>

      <ConfirmationModal actionBtnText='Delete' closeModal={handleCloseModal} handler={()=> { handleDelete(tour._id); setIsDeleteModalVisible(false) } } isVisible={isDeleteModalVisible} message='Are you sure you want to delete holiday yatra' />
    </>
  )
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#ffffff",
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
  card: {
    backgroundColor: "#fff",
    padding: 1,
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
    width: '100%', // Full width of the container
    height: height * 0.3, // Adjusted height to 30% of screen height
  },
  addButton: {
    backgroundColor: Colors.darkBlue,
    borderRadius: 8,
    padding: 8,
    alignItems: "center",
    marginBottom: 10,
    width: 120
  },
  addButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
