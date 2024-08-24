import React, { useEffect, useState } from "react";
import {
  View,
  Modal,
  StyleSheet,
  TouchableOpacity,
  Text,
  TextInput,
  SafeAreaView,
  ScrollView,
  Alert,
  ActivityIndicator,
  Image,
  Dimensions,
  TouchableWithoutFeedback,
} from "react-native";
import * as ImagePicker from 'expo-image-picker';
import { BlurView } from 'expo-blur';
import { FontAwesome5, MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Colors } from "@/constants/Colors";
import FloatingButton from "@/components/FloatingButton";
import { useGlobalContext } from "@/context/GlobalProvider";

const { width: deviceWidth } = Dimensions.get('window');

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
    <TouchableOpacity onPress={onRequestClose} style={styles.overlay}>
      <BlurView intensity={90} tint="light" style={styles.overlay} />
    </TouchableOpacity>
  </Modal>
);

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const year = date.getUTCFullYear();
  const month = date.getUTCMonth() + 1;
  const day = date.getUTCDate();
  return `${month}/${day}/${year}`;
}

const PackageVehicleListScreen = () => {
  const [showStartTripModal, setShowStartTripModal] = useState(false);
  const [showEndTripModal, setShowEndTripModal] = useState(false);
  const [beforeJourneyNote, setBeforeJourneyNote] = useState("");
  const [afterJourneyNote, setAfterJourneyNote] = useState("");
  const [packages, setPackages] = useState<Package[]>([]);
  const [selectedPhotos, setSelectedPhotos] = useState<string[]>([]);
  const [afterJourneyPhotos, setAfterJourneyPhotos] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);
  const { apiCaller, driverId } = useGlobalContext();
  const [inputHeight, setInputHeight] = useState(50);

  const fetchPackages = async () => {
    try {
      setLoading(true);
      const response = await apiCaller.get(`/api/packageBooking/driver/${driverId}`);
      const filteredRoutes = response.data.data.filter((route: Package) => route.status !== "COMPLETED");
      setPackages(filteredRoutes);
    } catch (err) {
      console.error("Error fetching packages:", err);
      Alert.alert("Error", "Failed to fetch packages. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPackages();
  }, []);

  const handleStartTrip = async () => {
    if (!beforeJourneyNote || selectedPhotos.length === 0 || !selectedPackage) {
      Alert.alert("Please add a note, select photos, and select a package.");
      return;
    }

    // const tripData = {
    //   beforeJourneyNote,
    //   beforeJourneyPhotos: selectedPhotos
    // };

    const formData = new FormData()

    formData.append("beforeJourneyNote", beforeJourneyNote);
    selectedPhotos.forEach((image, index) => {
      if (image.uri) {
        formData.append("beforeJourneyPhotos", {
          uri: image.uri,
          type: 'image/jpeg',
          name: `photo${index}.jpg`
        } as any);
      }
    });

    try {
      setLoading(true);
      await apiCaller.patch(`/api/packageBooking/start?bookingId=${selectedPackage._id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      Alert.alert("Success", "Trip started successfully!");
      setShowStartTripModal(false);
      fetchPackages();
    } catch (error) {
      console.error("Error starting trip:", error);
      Alert.alert("Error", "Failed to start trip. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleEndTrip = async () => {
    if (!afterJourneyNote || afterJourneyPhotos.length === 0 || !selectedPackage) {
      Alert.alert("Please add a note, select photos, and select a package.");
      return;
    }

    // const tripData = {
    //   afterJourneyNote,
    //   afterJourneyPhotos
    // };

    const formData = new FormData()
    formData.append("afterJourneyNote", afterJourneyNote)
    afterJourneyPhotos.forEach((image, index) => {
      if (image.uri) {
        formData.append("afterJourneyPhotos", {
          uri: image.uri,
          type: 'image/jpeg',
          name: `photo${index}.jpg`
        } as any);
      }
    })

    try {
      setLoading(true);
      await apiCaller.patch(`/api/packageBooking/complete?bookingId=${selectedPackage._id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      Alert.alert("Success", "Trip ended successfully!");
      setShowEndTripModal(false);
      fetchPackages();
    } catch (error) {
      console.error("Error ending trip:", error);
      Alert.alert("Error", "Failed to end trip. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedPackage) return;

    try {
      setLoading(true);
      await apiCaller.delete(`/api/packageBooking/${selectedPackage._id}`);
      fetchPackages();
      setShowDeleteModal(false);
    } catch (error) {
      console.error("Error deleting package:", error);
      Alert.alert("Error", "Failed to delete package. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const pickImage = async (type: 'before' | 'after') => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      selectionLimit: 5,
      quality: .7,
    });

    if (!result.canceled) {
      if (type === 'before') {
        setSelectedPhotos(result.assets);
      } else {
        setAfterJourneyPhotos(result.assets);
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.searchContainer}>
        <FontAwesome5 name="search" size={18} color={Colors.secondary} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search..."
          placeholderTextColor={Colors.secondary}
        />
      </View>

      {loading ? (
        <ActivityIndicator size="large" color={Colors.darkBlue} />
      ) : (
        <ScrollView style={styles.packagesList}>
          {packages.map((pkg) => (
            <View key={pkg._id} style={styles.card}>
              <View style={styles.cardHeader}>
                {pkg.status === "STARTED" ? (
                  <TouchableOpacity
                    style={[styles.editButton, { backgroundColor: "red" }]}
                    onPress={() => {
                      setSelectedPackage(pkg);
                      setShowEndTripModal(true);
                    }}
                  >
                    <Text style={styles.editButtonText}>End Trip</Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    style={styles.editButton}
                    onPress={() => {
                      setSelectedPackage(pkg);
                      setShowStartTripModal(true);
                    }}
                  >
                    <Text style={styles.editButtonText}>Start Trip</Text>
                  </TouchableOpacity>
                )}
                <TouchableOpacity onPress={() => {
                  setSelectedPackage(pkg);
                  setShowDeleteModal(true);
                }}>
                  <MaterialIcons name="delete" size={24} color={Colors.darkBlue} />
                </TouchableOpacity>
              </View>

              <View style={{ width: "100%", flexDirection: "row", justifyContent: "space-between" }}>
                <Text style={{ fontWeight: "600", fontSize: 14 }}>Departure</Text>
                <Text style={{ fontWeight: "600", fontSize: 14 }}>Destination</Text>
              </View>
              <View style={{ width: "100%", flexDirection: "row", justifyContent: "space-around", marginVertical: 5 }}>
                <Text style={{ fontWeight: "600", fontSize: 15 }}>{pkg.departurePlace}</Text>
                <MaterialIcons name="keyboard-double-arrow-right" size={24} color={Colors.darkBlue} />
                <Text style={{ fontWeight: "600", fontSize: 15 }}>{pkg.destinationPlace}</Text>
              </View>

              <Text style={styles.cardText}>Customer Name: <Text style={styles.textValue}>{pkg.customerName}</Text></Text>
              <Text style={styles.cardText}>Journey Duration: <Text style={styles.textValue}>{formatDate(pkg.departureDate)} to {formatDate(pkg.returnDate)}</Text></Text>
              {pkg.vehicle &&
                <Text style={styles.cardText}>Vehicle Number: <Text style={styles.textValue}>{pkg.vehicle.number}</Text></Text>
              }
              <Text style={styles.cardText}>Other Vehicle: <Text style={styles.textValue}>{pkg.otherVehicle.number}</Text></Text>

              <TouchableOpacity
                style={styles.viewMoreButton}
                onPress={() => router.push(`package_vehicle_booking_more/${pkg._id}`)}
              >
                <Text style={styles.viewMoreButtonText}>View More</Text>
              </TouchableOpacity>
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

        <TouchableWithoutFeedback onPress={() => setShowDeleteModal(false)}>
          <View style={styles.modalOverlay}>
            <View style={[styles.modalContainer, { height: 200 }]}>
              <View style={styles.modalContent}>
                <Text style={styles.modalText}>Are you sure you want to delete this package?</Text>
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
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={showStartTripModal}
        onRequestClose={() => setShowStartTripModal(false)}
      >
        <BlurOverlay visible={showStartTripModal} onRequestClose={() => setShowStartTripModal(false)} />

        <TouchableOpacity onPress={() => setShowStartTripModal(false)} style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <ScrollView style={styles.modalScroll}>
              <View style={styles.modalContent}>
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Before Journey Note</Text>
                  <TextInput
                    value={beforeJourneyNote}
                    style={[styles.input, styles.textarea, { height: Math.max(50, inputHeight) }]}
                    onChangeText={(text) => setBeforeJourneyNote(text)}
                    multiline={true}
                    onContentSizeChange={(event) => {
                      setInputHeight(event.nativeEvent.contentSize.height);
                    }}
                  />
                </View>
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Before Journey Photos</Text>
                  <TouchableOpacity style={styles.photoButton} onPress={() => pickImage('before')}>
                    <Text style={styles.photoButtonText}>Select Photos</Text>
                  </TouchableOpacity>
                  <Text style={styles.maxPhotosText}>Max 5 photos</Text>
                  <ScrollView horizontal>
                    {selectedPhotos.map((photoUri, index) => (
                      <Image
                        key={index}
                        source={{ uri: photoUri.uri }}
                        style={styles.photo}
                      />
                    ))}
                  </ScrollView>
                </View>

                <View style={styles.modalButtons}>
                  <TouchableOpacity
                    style={[styles.modalButton, { backgroundColor: Colors.darkBlue }]}
                    onPress={handleStartTrip}
                  >
                    {loading ? (
                      <ActivityIndicator color="#fff" />
                    ) : (
                      <Text style={[styles.modalButtonText, { color: "#fff" }]}>Start Trip</Text>
                    )}
                  </TouchableOpacity>
                </View>
              </View>
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={showEndTripModal}
        onRequestClose={() => setShowEndTripModal(false)}
      >
        <BlurOverlay visible={showEndTripModal} onRequestClose={() => setShowEndTripModal(false)} />

        <TouchableOpacity onPress={() => setShowEndTripModal(false)} style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <ScrollView style={styles.modalScroll}>
              <View style={styles.modalContent}>
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>After Journey Note</Text>
                  <TextInput
                    style={[styles.input, styles.textarea, { height: Math.max(50, inputHeight) }]}
                    value={afterJourneyNote}
                    onChangeText={(text) => setAfterJourneyNote(text)}
                    multiline={true}
                    onContentSizeChange={(event) => {
                      setInputHeight(event.nativeEvent.contentSize.height);
                    }}
                  />
                </View>
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>After Journey Photos</Text>
                  <TouchableOpacity style={styles.photoButton} onPress={() => pickImage('after')}>
                    <Text style={styles.photoButtonText}>Select Photos</Text>
                  </TouchableOpacity>
                  <Text style={styles.maxPhotosText}>Max 5 photos</Text>
                  <ScrollView horizontal>
                    {afterJourneyPhotos.map((photoUri, index) => (
                      <Image
                        key={index}
                        source={{ uri: photoUri.uri }}
                        style={styles.photo}
                      />
                    ))}
                  </ScrollView>
                </View>

                <View style={styles.modalButtons}>
                  <TouchableOpacity
                    style={[styles.modalButton, { backgroundColor: Colors.darkBlue }]}
                    onPress={handleEndTrip}
                  >
                    {loading ? (
                      <ActivityIndicator color="#fff" />
                    ) : (
                      <Text style={[styles.modalButtonText, { color: "#fff" }]}>End Trip</Text>
                    )}
                  </TouchableOpacity>
                </View>
              </View>
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>

      <FloatingButton />
    </SafeAreaView>
  );
};

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
  packagesList: {
    flex: 1,
  },
  textarea: {
    minHeight: 50,
    maxHeight: 300,
    textAlignVertical: 'top',
    paddingTop: 10,
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
  editButton: {
    backgroundColor: Colors.darkBlue,
    paddingHorizontal: 10,
    borderRadius: 5,
    paddingVertical: 5,
  },
  editButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 12,
  },
  cardText: {
    marginBottom: 8,
    color: Colors.secondary,
    fontWeight: "500",
    fontSize: 15,
  },
  viewMoreButton: {
    backgroundColor: Colors.darkBlue,
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 10,
  },
  viewMoreButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 12,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: deviceWidth * 0.8,
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  modalScroll: {
    width: "100%",
  },
  modalContent: {
    flex: 1,
    justifyContent: "center",
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontWeight: "bold",
    marginBottom: 5,
    color: Colors.secondary,
  },
  input: {
    borderColor: Colors.secondary,
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    color: Colors.secondary,
  },
  photoButton: {
    backgroundColor: Colors.darkBlue,
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: "center",
    marginBottom: 10,
  },
  photoButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  maxPhotosText: {
    color: Colors.secondary,
    marginBottom: 10,
  },
  photo: {
    width: 80,
    height: 80,
    borderRadius: 5,
    marginRight: 10,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  modalButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  modalButtonText: {
    fontWeight: "bold",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalText: {
    marginBottom: 20,
    fontSize: 18,
    textAlign: "center",
  },
  textValue: {
    color: "black",
  },
});

export default PackageVehicleListScreen;