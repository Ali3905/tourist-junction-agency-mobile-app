import { StyleSheet, StatusBar, View, Text, Image, TouchableOpacity, Dimensions, ScrollView } from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
import { useGlobalContext } from '@/context/GlobalProvider';
import { Redirect, router } from 'expo-router';
import Loader from '@/components/loader';
import { Colors } from '@/constants/Colors';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import FloatingButton from '@/components/FloatingButton';
import * as SecureStore from "expo-secure-store";
import { useEffect } from 'react';

const carouselImages = [
  require('@/assets/images/carousel1.png'),
  require('@/assets/images/carousel2.png'),
  require('@/assets/images/carousel3.png'),
  require('@/assets/images/carousel4.png'),
  require('@/assets/images/carousel5.png'),
  require('@/assets/images/carousel6.png')
];

const { width: deviceWidth } = Dimensions.get('window');

export default function HomeScreen() {
  const { loading, setIsLogged, setToken, isLogged } = useGlobalContext();

  if (!loading && !isLogged) return <Redirect href="/(modals)/login" />;

  const logout = async () => {
    try {
      await SecureStore.deleteItemAsync("access_token");
      setIsLogged(false);
      setToken(null);
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Loader loading />
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={logout} style={styles.logoutButton}>
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
      </View>
      <ScrollView style={{ flex: 1 }} >
        <View style={styles.welcomeCard}>
          <Text style={styles.welcomeCardText}>Welcome to,</Text>
          <Text style={styles.welcomeCardText}>Tourist Junctions</Text>
        </View>

        <View style={styles.dividerContainer}>
          <View style={styles.divider}>
            <Text style={styles.dividerText}>My Trip</Text>
          </View>
        </View>

        <View style={styles.grid}>
          <TouchableOpacity onPress={() => router.push('daily_route_vehicles')} style={styles.gridItem}>
            <Image source={require(`@/assets/images/route.png`)} style={styles.icon} />
            <Text style={styles.iconText}>Daily Route Vehicles</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push('package_vehicle_booking')} style={styles.gridItem}>
            <Image source={require(`@/assets/images/package.png`)} style={styles.icon} />
            <Text style={styles.iconText}>Package Vehicle Booking</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.dividerContainer}>
          <View style={styles.divider}>
            <Text style={styles.dividerText}>Completed Trips</Text>
          </View>
        </View>

        <View style={styles.grid}>
          <TouchableOpacity onPress={() => router.push('daily_route_vehicles_complete')} style={styles.gridItem}>
            <Image source={require(`@/assets/images/package_vehicle_booking_complete.png`)} style={styles.icon} />
            <Text style={styles.iconText}>Daily Route Vehicles</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push('package_vehicle_booking_complete')} style={styles.gridItem}>
            <Image source={require(`@/assets/images/package_vehicle_booking_complete.png`)} style={styles.icon} />
            <Text style={styles.iconText}>Package Vehicle Booking</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.dividerContainer}>
          <View style={styles.divider}>
            <Text style={styles.dividerText}>Technician Support</Text>
          </View>
        </View>
        <View style={styles.carouselContainer}>
        <Carousel
            width={deviceWidth * 0.9}
            height={deviceWidth * 0.5}
            autoPlay
            data={carouselImages}
            renderItem={({ item }) => (
              <Image source={item} style={styles.carouselImage} />
            )}
          />
        </View>
      </ScrollView>
      {/* <FloatingButton /> */}
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    marginTop: StatusBar.currentHeight,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 10,
  },
  logoutButton: {
    backgroundColor: Colors.secondary,
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  logoutButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  welcomeCard: {
    backgroundColor: Colors.secondary,
    padding: 20,
    borderRadius: 15,
    margin: 20,
    alignItems: 'center',
    width: deviceWidth * 0.9,
    height: deviceWidth * 0.4,
    justifyContent: "center"
  },
  welcomeCardText: {
    color: Colors.primary,
    fontSize: 23,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  carouselContainer: {
    alignItems: 'center',
    marginVertical: 20,
    marginBottom: 50
  },
  carouselImage: {
    height: deviceWidth * 0.5,
    borderRadius: 10,
    width: deviceWidth * 0.9,
  },
  dividerContainer: {
    marginHorizontal: 20,
    alignItems: 'center',
    marginVertical: 10,
  },
  divider: {
    borderBottomWidth: 1,
    width: '100%',
    position: 'relative',
    alignItems: 'center',
  },
  dividerText: {
    position: 'absolute',
    backgroundColor: '#ffffff',
    paddingHorizontal: 5,
    top: -10,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginVertical: 20,
  },
  gridItem: {
    width: '50%',
    alignItems: 'center',
    marginVertical: 10,
  },
  icon: {
    width: 50,
    height: 50,
    objectFit: 'contain',
  },
  iconText: {
    marginTop: 5,
    fontSize: 11,
    color: Colors.secondary,
    textAlign: 'center',
    fontWeight: '500',
    width: 80,
    height: 30,
    lineHeight: 15,
  },
  buttonContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  button: {
    backgroundColor: Colors.secondary,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 15,
    alignItems: 'center',
    margin: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
  },
  cardImage: {
    width: "100%",
    height: 200,
    borderRadius: 15,
  },
  cardText: {
    marginTop: 10,
    marginBottom: 5,
    fontSize: 13,
    textAlign: 'center',
    paddingHorizontal: 12,
    paddingVertical: 2,
    fontWeight: "600"
  },
  whatsNewHeading: {
    fontSize: 24,
    fontWeight: '800',
    color: Colors.primary,
    textAlign: 'center',
    marginVertical: 20,
  },
  whatsNewImage: {
    width: deviceWidth * 0.9,
    height: deviceWidth * 0.5,
    borderRadius: 15,
    alignSelf: 'center',
    marginVertical: 20,
  },
  socialMediaContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginVertical: 20,
  },
  socialMediaIcon: {
    alignItems: 'center',
  },
  socialIcon: {
    width: 50,
    height: 50,
  },
  socialText: {
    marginTop: 5,
    fontSize: 11,
    color: Colors.primary,
    textAlign: 'center',
  },
});