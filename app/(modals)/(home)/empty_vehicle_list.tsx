import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    TextInput,
    SafeAreaView,
    ScrollView,
    ActivityIndicator,
    TouchableOpacity,
    Pressable,
    Image
} from "react-native";
import { FontAwesome5, MaterialIcons } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";
import { useGlobalContext } from "@/context/GlobalProvider";
import { router } from "expo-router";
import Carousel from "@/components/Carousel";
import ConfirmationModal from "@/components/Modal";
import GoToPlans from "@/components/GoToPlans";
import { Picker } from "@react-native-picker/picker";
import tw from 'twrnc';

interface Vehicle {
    _id: string;
    departureDate: string;
    departurePlace: string;
    departureTime: string;
    destinationPlace: string;
    mobileNumber: string;
    moreInformation: string;
    photos: string[];
    vehicle: {
        number: string;
        isAC: boolean;
        isSleeper: boolean;
    };
}

interface EmptyVehicleCardProps {
    vehicle: Vehicle;
    index: number;
    handleDelete: (id: string) => Promise<void>;
}

function formatDate(dateString: string): string {
    const date = new Date(dateString);
    const year = date.getUTCFullYear();
    const month = date.getUTCMonth() + 1;
    const day = date.getUTCDate();
    return `${month}/${day}/${year}`;
}

const EmptyVehicleScreen: React.FC = () => {
    const [vehicles, setVehicles] = useState<Vehicle[]>([]);
    const [filteredVehicles, setFilteredVehicles] = useState<Vehicle[]>([]);
    const [loading, setLoading] = useState(true);
    const { apiCaller, refresh, userData } = useGlobalContext();

    const [vehicleTypeFilter, setVehicleTypeFilter] = useState("");
    const [fromFilter, setFromFilter] = useState("");
    const [toFilter, setToFilter] = useState("");
    const [notificationVisible, setNotificationVisible] = useState(true);

    const fetchVehicles = async () => {
        try {
            setLoading(true);
            const response = await apiCaller.get('/api/emptyVehicle');
            const data = response.data.data;
            setVehicles(data);
            setFilteredVehicles(data); // Show all vehicles by default
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchVehicles();
    }, [refresh]);

    useEffect(() => {
        const timer = setTimeout(() => {
            setNotificationVisible(false);
        }, 10000);
        return () => clearTimeout(timer);
    }, []);

    const handleSearch = () => {
        const results = vehicles.filter((vehicle) => {
            const matchesType = vehicleTypeFilter ? vehicle.vehicleType === vehicleTypeFilter : true;
            const matchesFrom = fromFilter ? vehicle.departurePlace.toLowerCase().includes(fromFilter.toLowerCase()) : true;
            const matchesTo = toFilter ? vehicle.destinationPlace.toLowerCase().includes(toFilter.toLowerCase()) : true;
            return matchesType && matchesFrom && matchesTo;
        });
        setFilteredVehicles(results);
    };

    const handleDeleteEmptyVehicle = async (id: string) => {
        if (!id) {
            Alert.alert("Could not get the id to delete empty vehicle");
            return;
        }
        try {
            setLoading(true);
            await apiCaller.delete(`/api/emptyVehicle?emptyVehicleId=${id}`);
            fetchVehicles();
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    };

   if (!userData?.isSubsciptionValid && Date.now() >= new Date(userData?.trialValidTill).getTime()) {
    return <GoToPlans />;
  }

    return (
        <SafeAreaView style={tw`flex-1  px-2 bg-[#EAEAEA]`}>
            <ScrollView>
               <TouchableOpacity onPress={() => router.push("add_empty_vehicle")} style={tw`bg-[#2AA4D5] rounded-lg p-2 items-center mb-2 mt-2 w-[250px]`}>
                    <Text style={tw`text-white text-[15px] font-bold`}>Create Empty Vehicle Routes</Text>
                </TouchableOpacity>

                <View style={tw`flex-row justify-between border border-gray-300 bg-white rounded-xl h-12 mb-2`}>
                    <Picker
                        selectedValue={vehicleTypeFilter}
                        style={tw`flex-1 mx-1`}
                        onValueChange={(item) => setVehicleTypeFilter(item)}
                    >
                        <Picker.Item label="Select Vehicle Types" value="" />
                        <Picker.Item label="CAR" value="CAR" />
                        <Picker.Item label="BUS" value="BUS" />
                        <Picker.Item label="TRUCK" value="TRUCK" />
                        <Picker.Item label="TAMPO" value="TAMPO" />
                    </Picker>
                </View>

                <View style={tw`flex-col bg-white rounded-lg p-4  mb-3 border border-gray-300`}>
                    <View style={tw`flex-row items-center border-b border-gray-300 py-2`}>
                        <FontAwesome5 name="bus" size={24} color="black" style={tw`mr-3`} />
                        <TextInput
                            placeholder="From"
                            style={tw`flex-1 text-lg`}
                            value={fromFilter}
                            onChangeText={setFromFilter}
                        />
                    </View>
                    <View style={tw`flex-row items-center border-b border-gray-300 py-2 mt-3`}>
                        <FontAwesome5 name="bus" size={24} color="black" style={tw`mr-3`} />
                        <TextInput
                            placeholder="To"
                            style={tw`flex-1 text-lg`}
                            value={toFilter}
                            onChangeText={setToFilter}
                        />
                    </View>
                    <TouchableOpacity onPress={handleSearch} style={tw`bg-[#154CE4] rounded-full p-2 items-center mt-2 mx-8`}>
                        <Text style={tw`text-white text-[15px] font-bold`}>Search</Text>
                    </TouchableOpacity>
                </View>

                {notificationVisible && (
                    <View style={tw`my-5 px-5 bg-[#51BEEE] rounded p-2`}>
                        <Pressable onPress={() => setNotificationVisible(false)}>
                            <FontAwesome5 name="times-circle" size={18} color="#ffffff" style={tw`self-end`} />
                        </Pressable>
                        <Text style={tw`text-white text-lg text-center`}>Here added vehicles shown to other agencies as well</Text>
                    </View>
                )}

                {loading ? (
                    <ActivityIndicator size="large" color={Colors.darkBlue} style={tw`mt-5`} />
                ) : (
                    filteredVehicles.length < 1 ? (
                        <Text style={tw`text-center mt-10 font-bold bg-white p-4 rounded-xl`}>Currently, vehicle is not available on route !</Text>
                    ) : (
                        filteredVehicles.map((vehicle, index) => (
                            <EmptyVehicleCard vehicle={vehicle} index={index} handleDelete={handleDeleteEmptyVehicle} key={index} />
                        ))
                    )
                )}
            </ScrollView>
        </SafeAreaView>
    );
};

const EmptyVehicleCard = ({ vehicle, index, handleDelete }: EmptyVehicleCardProps) => {
    const [isDeleteModalVisible, setIsDeleteModalVisible] = useState<boolean>(false);
    const { setEditData } = useGlobalContext();

    const closeModal = () => setIsDeleteModalVisible(false);

    const handler = () => {
        if (selectedVehicle) {
            handleDelete(selectedVehicle._id);
            closeModal();
        }
    };

    return (
        <>
            <View style={tw`bg-white py-5 px-3 rounded-lg shadow-lg mb-5`}>
                <View style={tw`flex-row justify-end items-center mb-2 space-x-2`}>
                    <TouchableOpacity onPress={() => { setEditData(vehicle); router.push("edit_empty_vehicle"); }} style={tw`bg-[#2AA4D5] rounded p-1`}>
                        <Text style={tw`text-white text-sm `}>Edit Route</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => { setIsDeleteModalVisible(true); setSelectedVehicle(vehicle); }}>
                        <MaterialIcons name="delete" size={24} color={Colors.darkBlue} />
                    </TouchableOpacity>
                </View>

                <View style={tw`relative`}>
                    <Carousel height={300} images={vehicle.photos} />
                    <View style={tw`absolute bottom-3 right-3 bg-[#154CE4] items-center rounded-full p-4`}>
                        <Text style={tw`text-white font-bold text-[10px]`}>{vehicle.vehicle.number.toUpperCase()}</Text>
                        <Text style={tw`text-white font-bold text-[10px]`}>{vehicle.vehicle.isAC ? "AC" : "Non-AC"}</Text>
                        <Text style={tw`text-white font-bold text-[10px]`}>{vehicle.vehicle.isSleeper ? "Sleeper" : "Seater"}</Text>
                    </View>
                </View>

                <View style={tw`flex-row justify-between my-3 mx-2`}>
                    <View style={tw`items-center`}>
                        <Text style={tw`font-bold text-[#042F40]`}>Departure</Text>
                        <Text>{vehicle.departurePlace}</Text>
                        <Text style={tw`text-black`}>
                            {vehicle.departureTime ? new Date(vehicle.departureTime).toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true }) : "Time not added"}
                        </Text>
                    </View>
                    <View style={tw`flex flex-row items-center`}>
                         <Image source={require('@/assets/left-arrow.png')} style={tw``} />
                         <Image source={require('@/assets/vehicle-icon.png')} style={tw``} />
                         <Image source={require('@/assets/right-arrow.png')} style={tw``} />
                  </View>
                    <View style={tw`items-center`}>
                        <Text style={tw`font-bold text-[#042F40]`}>Destination</Text>
                        <Text>{vehicle.destinationPlace}</Text>
                    </View>
                </View>

                <View style={tw`flex flex-row mb-2`}>
                    <Text style={tw`text-gray-500 font-medium`}>Departure Date - </Text>
                    <Text style={tw`text-black`}>{vehicle.departureDate ? formatDate(vehicle.departureDate) : "Time not added"}</Text>
                </View>
                <View style={tw`flex flex-row items-center mb-2`}>
                    <Text style={tw`text-gray-500 font-medium`}>Contact Number - </Text>
                    <Text style={tw`text-black`}>{vehicle.mobileNumber}</Text>
                </View>

                <View style={tw`border flex flex-row justify-between rounded-md p-3 border-gray-200`}>
                    <View style={tw`flex flex-col mb-2`}>
                        <Text style={tw`text-gray-500 font-medium`}>More Info About Trip: </Text>
                        <Text style={tw`text-black`}>{vehicle.moreInformation}</Text>
                    </View>                
                </View> 
            </View>

            <ConfirmationModal actionBtnText="Delete" closeModal={closeModal} isVisible={isDeleteModalVisible} message="Are you sure you want to delete this empty vehicle?" handler={handler} />
        </>
    );
};

export default EmptyVehicleScreen;
