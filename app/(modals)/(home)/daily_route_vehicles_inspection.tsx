import React, { useEffect, useState } from "react";
import {
  View,
  Modal,
  StyleSheet,
  TouchableOpacity,
  Text,
  TouchableWithoutFeedback,
  TextInput,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { BlurView } from 'expo-blur';
import { Colors } from "@/constants/Colors";
import { FontAwesome5, MaterialIcons } from "@expo/vector-icons";
import { useGlobalContext } from "@/context/GlobalProvider";
import { router } from "expo-router";

interface BlurOverlayProps {
  visible: boolean;
  onRequestClose: () => void;
}

const BlurOverlay: React.FC<BlurOverlayProps> = ({ visible, onRequestClose }) => (
  <Modal
    animationType="fade"
    transparent={true}
    visible={visible}
    onRequestClose={onRequestClose}
  >
    <TouchableWithoutFeedback onPress={onRequestClose}>
      <BlurView intensity={90} tint="light" style={styles.overlay} />
    </TouchableWithoutFeedback>
  </Modal>
);

function timestampToTime(timestamp: string): string {
  const date = new Date(timestamp);
  let hours = date.getUTCHours();
  const minutes = date.getUTCMinutes().toString().padStart(2, '0');
  const seconds = date.getUTCSeconds().toString().padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';

  hours = hours % 12;
  hours = hours ? hours : 12;
  const formattedHours = hours.toString().padStart(2, '0');

  return `${formattedHours}:${minutes}:${seconds} ${ampm}`;
}

const DailyRouteVehicles: React.FC = () => {
  const [dailyRoutes, setDailyRoutes] = useState<DailyRoute[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedRoute, setSelectedRoute] = useState<DailyRoute | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const { apiCaller, refresh, setPhotos } = useGlobalContext();
  const [showFullBeforeNote, setShowFullBeforeNote] = useState(false);
  const [showFullAfterNote, setShowFullAfterNote] = useState(false);

  const fetchDailyRoutes = async () => {
    try {
      setLoading(true);
      const response = await apiCaller.get('/api/dailyRoute');
      const filteredRoutes = response.data.data.filter((route: DailyRoute) => route.status === "COMPLETED");
      setDailyRoutes(filteredRoutes);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDailyRoutes();
  }, [refresh]);

  const handleDelete = async () => {
    if (selectedRoute) {
      try {
        await apiCaller.delete(`/api/dailyRoute?dailyRouteId=${selectedRoute._id}`);
        fetchDailyRoutes();
        setShowDeleteModal(false);
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleShowDetails = (pkg: DailyRoute) => {
    setSelectedRoute(pkg);
    setShowDetailsModal(true);
  };

  const filterDailyRoutes = (routes: DailyRoute[], query: string) => {
    return routes.filter((route) =>
      Object.values(route).some((value) =>
        String(value).toLowerCase().includes(query.toLowerCase())
      )
    );
  };

  const filteredRoutes = filterDailyRoutes(dailyRoutes, searchQuery);

  const renderNote = (note: string, isFullNote: boolean, setFullNote: React.Dispatch<React.SetStateAction<boolean>>) => {
    const maxLength = 100;
    if (note.length <= maxLength) {
      return <Text style={styles.modalNoteText}>{note}</Text>;
    }

    if (isFullNote) {
      return (
        <View>
          <TextInput
            style={styles.fullNoteText}
            multiline
            editable={false}
            value={note}
          />
          <TouchableOpacity onPress={() => setFullNote(false)}>
            <Text style={styles.readMoreLess}>Show Less</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <View>
        <Text style={styles.modalNoteText}>
          {`${note.substring(0, maxLength)}...`}
        </Text>
        <TouchableOpacity onPress={() => setFullNote(true)}>
          <Text style={styles.readMoreLess}>Read More</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.searchContainer}>
        <FontAwesome5 name="search" size={18} color={Colors.secondary} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search..."
          placeholderTextColor={Colors.secondary}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {loading ? (
        <ActivityIndicator size="large" color={Colors.darkBlue} />
      ) : (
        <ScrollView style={styles.routesList}>
          {filteredRoutes.map((route) => (
            <View key={route._id} style={styles.card}>
              <View style={styles.cardHeader}>
                <TouchableOpacity onPress={() => handleShowDetails(route)} style={styles.detailsButton}>
                  <Text style={styles.detailsButtonText}>Details</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => { setShowDeleteModal(true); setSelectedRoute(route); }}>
                  <MaterialIcons name="delete" size={24} color={Colors.darkBlue} />
                </TouchableOpacity>
              </View>

              <View style={{ width: "100%", flexDirection: "row", justifyContent: "space-between" }} >
                <Text style={{ fontWeight: "bold", fontSize: 15 }} >Departure</Text>
                <Text style={{ fontWeight: "bold", fontSize: 15 }} >Destination</Text>
              </View>
              <View style={{ width: "100%", flexDirection: "row", justifyContent: "space-around", marginVertical: 5 }} >
                <Text style={{ fontWeight: "bold", fontSize: 18 }} >{route.departurePlace}</Text>
                <MaterialIcons name="keyboard-double-arrow-right" size={24} color={Colors.darkBlue} />
                <Text style={{ fontWeight: "bold", fontSize: 18 }} >{route.destinationPlace}</Text>
              </View>

              <Text style={styles.cardText}>
                Vehicle Number: <Text style={{ color: "black" }}>{route.vehicle.number}</Text>
              </Text>
              <Text style={styles.cardText}>
                Departure Time: <Text style={{ color: "black" }}>{route.departureTime ? new Date(route.departureTime).toLocaleTimeString() : ""}</Text>
              </Text>
              <Text style={styles.cardText}>
                Cleaner Name: <Text style={{ color: "black" }}>{route.cleaner ? route.cleaner.name : ""}</Text>
              </Text>
              <Text style={styles.cardText}>
                Primary Driver : <Text style={{ color: "black" }}>{route.primaryDriver ? route.primaryDriver.name : ""}</Text>
              </Text>
              <Text style={styles.cardText}>
                Secondary Driver: <Text style={{ color: "black" }}>{route.secondaryDriver ? route.secondaryDriver.name : ""}</Text>
              </Text>
            </View>
          ))}
        </ScrollView>
      )}

      <Modal
        animationType="slide"
        transparent={true}
        visible={showDeleteModal}
        onRequestClose={() => setShowDeleteModal(false)}
      >
        <BlurOverlay visible={showDeleteModal} onRequestClose={() => setShowDeleteModal(false)} />

        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>Are you sure you want to delete this vehicle?</Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity style={[styles.modalButton, { backgroundColor: "#ccc" }]} onPress={() => setShowDeleteModal(false)}>
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.modalButton, { backgroundColor: Colors.darkBlue }]} onPress={handleDelete}>
                <Text style={[styles.modalButtonText, { color: "#fff" }]}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={showDetailsModal}
        onRequestClose={() => setShowDetailsModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Journey Details</Text>
            <Text style={styles.modalText}>Before Journey Notes:</Text>
            {renderNote(selectedRoute?.beforeJourneyNote || 'No notes available', showFullBeforeNote, setShowFullBeforeNote)}
            <Text style={styles.modalText}>After Journey Notes:</Text>
            {renderNote(selectedRoute?.afterJourneyNote || 'No notes available', showFullAfterNote, setShowFullAfterNote)}
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: Colors.darkBlue }]}
                onPress={() => { setShowDetailsModal(false); setPhotos(selectedRoute.beforeJourneyPhotos); router.push('before_photos') }}
              >
                <Text style={[styles.modalButtonText, { color: "#fff" }]}>Before Journey Photos</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: Colors.darkBlue }]}
                onPress={() => { setShowDetailsModal(false); setPhotos(selectedRoute.afterJourneyPhotos); router.push('after_photos') }}
              >
                <Text style={[styles.modalButtonText, { color: "#fff" }]}>After Journey Photos</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              style={[styles.modalButton, { backgroundColor: "#ccc", marginTop: 10 }]}
              onPress={() => setShowDetailsModal(false)}
            >
              <Text style={styles.modalButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "#fff",
  },
  detailsButtonText: {
    color: "#fff",
    fontWeight: "semibold",
    fontSize: 10,
  },
  detailsButton: {
    backgroundColor: Colors.darkBlue,
    paddingHorizontal: 10,
    borderRadius: 5,
    paddingVertical: 5,
    height: 25,
    marginRight: 5,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginBottom: 10,
    borderColor: Colors.secondary,
    borderWidth: 1
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    color: Colors.secondary,
  },
  routesList: {
    flex: 1,
  },
  card: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 5,
    marginBottom: 20,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginBottom: 10,
    alignItems: "center",
    gap: 5,
  },
  cardText: {
    marginBottom: 6,
    color: Colors.secondary,
    fontWeight: "500",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalContent: {
    width: 300,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    marginBottom: 5,
    textAlign: "left",
    fontWeight: "bold",
    alignSelf: "flex-start",
  },
  modalNoteText: {
    marginBottom: 15,
    textAlign: "left",
    alignSelf: "flex-start",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  modalButton: {
    borderRadius: 10,
    padding: 10,
    elevation: 2,
    marginHorizontal: 5,
    width: 100,
    alignItems: "center",
  },
  modalButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  overlay: {
    flex: 1,
  },
  fullNoteText: {
    marginBottom: 10,
    textAlign: "left",
    alignSelf: "stretch",
    maxHeight: 200,
    borderColor: Colors.secondary,
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
  },
  readMoreLess: {
    color: Colors.darkBlue,
    fontWeight: "bold",
    marginBottom: 10,
  },
});

export default DailyRouteVehicles;