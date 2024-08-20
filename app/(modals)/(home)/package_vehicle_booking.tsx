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
  ActivityIndicator,
  TouchableWithoutFeedback,
  Alert,
} from "react-native";
import { FontAwesome5, MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Colors } from "@/constants/Colors";
import { useGlobalContext } from "@/context/GlobalProvider";
import { BlurView } from "expo-blur";
import { Picker } from '@react-native-picker/picker';

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const year = date.getUTCFullYear();
  const month = date.getUTCMonth() + 1;
  const day = date.getUTCDate();
  return `${month}/${day}/${year}`;
}

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

const PackageVehicleListScreen: React.FC = () => {
  const [packages, setPackages] = useState<Package[]>([]);
  const [filteredPackages, setFilteredPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);
  const [showAddDriverModal, setShowAddDriverModal] = useState(false);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [cleaners, setCleaners] = useState<Cleaner[]>([]);
  const [selectedPrimaryDriver, setSelectedPrimaryDriver] = useState<string>("");
  const [selectedSecondaryDriver, setSelectedSecondaryDriver] = useState<string>("");
  const [selectedCleaner, setSelectedCleaner] = useState<string>("");
  const [instruction, setInstruction] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedVehicleType, setSelectedVehicleType] = useState("");
  const { apiCaller, setEditData, setInvoiceData, refresh } = useGlobalContext();
  const [inputHeight, setInputHeight] = useState(50);

  const fetchPackages = async () => {
    try {
      setLoading(true);
      const response = await apiCaller.get('/api/packageBooking');
      setPackages(response.data.data);
      console.log(response.data.data[0].returnTime);

    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchDrivers = async () => {
    try {
      setLoading(true);
      const response = await apiCaller.get('/api/driver');
      setDrivers(response.data.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCleaners = async () => {
    try {
      setLoading(true);
      const response = await apiCaller.get('/api/cleaner');
      setCleaners(response.data.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPackages();
    fetchDrivers();
    fetchCleaners();
  }, [refresh]);

  useEffect(() => {
    filterPackages();
  }, [packages, searchQuery, selectedVehicleType]);

  const filterPackages = () => {
    let filtered = packages;

    if (searchQuery) {
      filtered = filtered.filter(pkg =>
        pkg.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pkg.departurePlace.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pkg.destinationPlace.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (pkg.vehicle && pkg.vehicle.number.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    if (selectedVehicleType) {
      filtered = filtered.filter(pkg => pkg.vehicle && pkg.vehicle.type === selectedVehicleType);
    }

    setFilteredPackages(filtered);
  };

  const handleDelete = async () => {
    if (selectedPackage) {
      try {
        await apiCaller.delete(`/api/packageBooking?bookingId=${selectedPackage._id}`);
        fetchPackages();
        setShowDeleteModal(false);
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleAddDriver = async () => {
    if (!selectedPrimaryDriver || !selectedSecondaryDriver || !selectedCleaner || !instruction) {
      Alert.alert("Please select all fields.");
      return;
    }

    const newDriverData = {
      primaryDriverId: selectedPrimaryDriver,
      secondaryDriverId: selectedSecondaryDriver,
      cleanerId: selectedCleaner,
      instructions: instruction
    };

    try {
      setLoading(true);
      await apiCaller.patch(`/api/packageBooking/finalize?bookingId=${selectedPackage?._id}`, newDriverData);
      Alert.alert("Success", "Drivers and cleaner added successfully!");
      fetchPackages();
      setShowAddDriverModal(false);
    } catch (error) {
      console.error("Error adding drivers and cleaner:", error);
      Alert.alert("Error", "Failed to add drivers and cleaner. Please try again.");
    } finally {
      setLoading(false);
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
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>
{/* 
      <View style={styles.filterContainer}>
        <Picker
          selectedValue={selectedVehicleType}
          onValueChange={(itemValue) => setSelectedVehicleType(itemValue)}
          style={styles.filterPicker}
        >
          <Picker.Item label="All Vehicle Types" value="" />
          <Picker.Item label="CAR" value="CAR" />
          <Picker.Item label="BUS" value="BUS" />
          <Picker.Item label="TRUCK" value="TRUCK" />
          <Picker.Item label="TAMPO" value="TAMPO" />
        </Picker>
      </View> */}

      <TouchableOpacity onPress={() => router.push("add_package_vehicle_booking")} style={styles.addButton}>
        <Text style={styles.addButtonText}>Create Customer Invoice</Text>
      </TouchableOpacity>

      {loading ? (
        <ActivityIndicator size="large" color={Colors.darkBlue} />
      ) : (
        <ScrollView style={styles.packagesList}>
          {filteredPackages.map((pkg) => (
            <View key={pkg._id} style={styles.card}>
              <View style={styles.cardHeader}>
                <TouchableOpacity onPress={() => { setEditData(pkg); router.push("edit_package_vehicle_booking") }} style={styles.editButton}>
                  <Text style={styles.editButtonText}>Edit Booking</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => { setInvoiceData(pkg); router.push("invoice") }} style={styles.editButton}>
                  <Text style={styles.editButtonText}>View Invoice</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.editButton} onPress={() => {
                  setSelectedPackage(pkg);
                  setShowAddDriverModal(true);
                }}>
                  <Text style={styles.editButtonText}>Add Driver</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => { setShowDeleteModal(true); setSelectedPackage(pkg); }}>
                  <MaterialIcons name="delete" size={24} color={Colors.darkBlue} />
                </TouchableOpacity>
              </View>

              <View style={{ width: "100%", flexDirection: "row", justifyContent: "space-between" }} >
                <Text style={{ fontWeight: "bold", fontSize: 14 }} >Departure</Text>
                <Text style={{ fontWeight: "bold", fontSize: 14 }} >Destination</Text>
              </View>
              <View style={{ width: "100%", flexDirection: "row", justifyContent: "space-around", marginVertical: 5 }} >
                <Text style={{ fontWeight: "bold", fontSize: 16 }} >{pkg.departurePlace}</Text>
                <MaterialIcons name="keyboard-double-arrow-right" size={24} color={Colors.darkBlue} />
                <Text style={{ fontWeight: "bold", fontSize: 16 }} >{pkg.destinationPlace}</Text>
              </View>

              <Text style={styles.cardText}>Customer Name: <Text style={styles.textValue}>{pkg.customerName}</Text></Text>
              <Text style={styles.cardText}>Journey Duration: <Text style={styles.textValue}>{formatDate(pkg.departureDate)} to {formatDate(pkg.returnDate)}</Text></Text>
              {pkg.vehicle &&
                <Text style={styles.cardText}>Vehicle Number: <Text style={styles.textValue}>{pkg.vehicle.number}</Text></Text>
              }
              {pkg.otherVehicle._id &&
                <Text style={styles.cardText}>Other Vehicle: <Text style={styles.textValue}>{pkg.otherVehicle.number}</Text></Text>
              }

              <TouchableOpacity
                style={styles.viewMoreButton}
                onPress={() => router.push(`/package_vehicle_booking_more/${pkg._id}`)}
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
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>Are you sure you want to delete this package?</Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: "#ccc" }]}
                onPress={() => setShowDeleteModal(false)}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: Colors.darkBlue }]}
                onPress={handleDelete}
              >
                <Text style={[styles.modalButtonText, { color: "#fff" }]}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={showAddDriverModal}
        onRequestClose={() => setShowAddDriverModal(false)}
      >
        <BlurOverlay visible={showAddDriverModal} onRequestClose={() => setShowAddDriverModal(false)} />

        <TouchableWithoutFeedback >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Primary Driver</Text>
                <Picker
                  selectedValue={selectedPrimaryDriver}
                  onValueChange={(itemValue) => setSelectedPrimaryDriver(itemValue)}
                  style={styles.picker}
                >
                  <Picker.Item label="Select Primary Driver" value="" />
                  {drivers.filter(driver => driver._id !== selectedSecondaryDriver).map((driver) => (
                    <Picker.Item key={driver._id} label={driver.name} value={driver._id} />
                  ))}
                </Picker>
              </View>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Secondary Driver</Text>
                <Picker
                  selectedValue={selectedSecondaryDriver}
                  onValueChange={(itemValue) => setSelectedSecondaryDriver(itemValue)}
                  style={styles.picker}
                >
                  <Picker.Item label="Select Secondary Driver" value="" />
                  {drivers.filter(driver => driver._id !== selectedPrimaryDriver).map((driver) => (
                    <Picker.Item key={driver._id} label={driver.name} value={driver._id} />
                  ))}
                </Picker>
              </View>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Cleaner</Text>
                <Picker
                  selectedValue={selectedCleaner}
                  onValueChange={(itemValue) => setSelectedCleaner(itemValue)}
                  style={styles.picker}
                >
                  <Picker.Item label="Select Cleaner" value="" />
                  {cleaners.map((cleaner) => (
                    <Picker.Item key={cleaner._id} label={cleaner.name} value={cleaner._id} />
                  ))}
                </Picker>
              </View>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Instructions</Text>
                <TextInput
                  style={[styles.input, styles.textarea, { height: Math.max(50, inputHeight) }]}
                  value={instruction}
                  onChangeText={(text) => setInstruction(text)}
                  multiline={true}
                  onContentSizeChange={(event) => {
                    setInputHeight(event.nativeEvent.contentSize.height);
                  }}
                />
              </View>
              <View style={styles.modalButtons}>
                <TouchableOpacity style={[styles.modalButton, { backgroundColor: "#ccc" }]} onPress={() => setShowAddDriverModal(false)}>
                  <Text style={styles.modalButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.modalButton, { backgroundColor: Colors.darkBlue }]} onPress={handleAddDriver}>
                  <Text style={[styles.modalButtonText, { color: "#fff" }]}>Add Driver</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
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
  addButton: {
    backgroundColor: Colors.darkBlue,
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: "center",
    marginBottom: 20,
    width: 150,
  },
  addButtonText: {
    color: "#fff",
    fontWeight: "semibold",
    fontSize: 12,
  },
  packagesList: {
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
  editButton: {
    backgroundColor: Colors.darkBlue,
    paddingHorizontal: 10,
    borderRadius: 5,
    paddingVertical: 5,
    height: 25,
  },
  editButtonText: {
    color: "#fff",
    fontWeight: "semibold",
    fontSize: 10,
  },
  packageInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 5,
  },
  label: {
    fontWeight: "semibold",
    fontSize: 14,
  },
  value: {
    fontWeight: "semibold",
    fontSize: 15,
  },
  cardText: {
    marginBottom: 6,
    color: Colors.secondary,
    fontWeight: "500",
    fontSize: 12,
  },
  textValue: {
    color: "black",
  },
  viewMoreButton: {
    backgroundColor: Colors.darkBlue,
    paddingHorizontal: 10,
    borderRadius: 5,
    paddingVertical: 5,
    alignItems: "center",
    marginTop: 10,
  },
  viewMoreButtonText: {
    color: "#fff",
    fontWeight: "bold",
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
    marginBottom: 15,
    textAlign: "center",
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
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalScroll: {
    width: "100%",
  },

  inputGroup: {
    marginBottom: 15,
    width: "100%"
  },
  input: {
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    fontSize: 16,
  },
  picker: {
    width: "100%",
    height: 50,
    borderWidth: 1,
    borderColor: Colors.secondary,
    borderRadius: 5,
  },
  filterContainer: {
    marginBottom: 10,
    marginTop: -10
  },
  filterPicker: {
    height: 40,
    width: '100%',
    borderRadius: 5,
    marginBottom: 10
  },
  textarea: {
    minHeight: 50,
    maxHeight: 300,
    textAlignVertical: 'top',
    paddingTop: 10,
  },
});

export default PackageVehicleListScreen;