import GlobalProvider from '@/context/GlobalProvider';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';
import Toast from 'react-native-toast-message';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <GlobalProvider>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="(modals)/onbording" options={{ headerShown: false }} />
        <Stack.Screen name="(modals)/welcome" options={{ headerShown: false }} />
        <Stack.Screen name="(modals)/customerOrAgency" options={{ headerShown: false }} />
        <Stack.Screen name="(modals)/login" options={{ headerShown: false }} />
        <Stack.Screen name="(modals)/signup" options={{ headerShown: false }} />
        <Stack.Screen name="(modals)/forgotPassword" options={{ headerShown: false }} />
        <Stack.Screen name="(modals)/verify" options={{ headerShown: false }} />
        <Stack.Screen name="(modals)/accountCreatedDone" options={{ headerShown: false }} />
        <Stack.Screen name="(modals)/premiumDone" options={{ headerShown: false }} />
        <Stack.Screen name="(modals)/resetPasswordDone" options={{ headerShown: false }} />
        <Stack.Screen name="(modals)/resetPassword" options={{ headerShown: false }} />
        {/* <Stack.Screen name="(modals)/edit_profile" options={{ headerShown: false } }/> */}

        <Stack.Screen name="(modals)/(home)/drivers_list" options={{  headerShadowVisible:false, headerTitle:"Driver List", headerTitleAlign:"center", headerTitleStyle: { fontSize: 16 } }} />
        <Stack.Screen name="(modals)/(home)/drivers_all" options={{  headerShadowVisible:false, headerTitle:"All Drivers List", headerTitleAlign:"center", headerTitleStyle: { fontSize: 16 } }} />
        <Stack.Screen name="(modals)/(home)/cleaners_list" options={{ headerShadowVisible:false, headerTitle:"Cleaner List", headerTitleAlign:"center", headerTitleStyle: { fontSize: 16 } }} />
        <Stack.Screen name="(modals)/(home)/employee_list" options={{ headerShadowVisible:false, headerTitle:"Employee List", headerTitleAlign:"center", headerTitleStyle: { fontSize: 16 } }} />
        <Stack.Screen name="(modals)/(home)/(forms)/edit_profile" options={{ headerShown: false }} />
        <Stack.Screen name="(modals)/(home)/all_vehicle_list" options={{ headerShadowVisible:false, headerTitle:"All Vehicle List", headerTitleAlign:"center", headerTitleStyle: { fontSize: 16 } }} />
        <Stack.Screen name="(modals)/(home)/car_list" options={{ headerShadowVisible:false, headerTitle:"Car List", headerTitleAlign:"center", headerTitleStyle: { fontSize: 16 } }} />
        <Stack.Screen name="(modals)/(home)/bus_list" options={{ headerShadowVisible:false, headerTitle:"Bus List", headerTitleAlign:"center", headerTitleStyle: { fontSize: 16 } }} />
        <Stack.Screen name="(modals)/(home)/tempo_list" options={{ headerShadowVisible:false, headerTitle:"Tempo Traveller List", headerTitleAlign:"center", headerTitleStyle: { fontSize: 16 } }} />
        <Stack.Screen name="(modals)/(home)/truck_list" options={{ headerShadowVisible:false, headerTitle:"Truck List", headerTitleAlign:"center", headerTitleStyle: { fontSize: 16 } }} />
        <Stack.Screen name="(modals)/(home)/package_vehicle_booking" options={{ headerShadowVisible:false, headerTitle:"Package Vehicle booking", headerTitleAlign:"center",  headerTitleStyle: { fontSize: 16 } }} />
        <Stack.Screen name="(modals)/(home)/package_vehicle_booking_inspection" options={{ headerShadowVisible:false, headerTitle:"Package Vehicle booking", headerTitleAlign:"center", headerTitleStyle: { fontSize: 16 } }} />
        <Stack.Screen name="(modals)/(home)/package_vehicle_booking_more/[pkgId]" options={{ headerShadowVisible:false, headerTitle:"Package Vehicle booking", headerTitleAlign:"center", headerTitleStyle: { fontSize: 16 } }} />
        <Stack.Screen name="(modals)/(home)/daily_route_vehicles" options={{ headerShadowVisible:false, headerTitle:"Daily Route Vehicles", headerTitleAlign:"center", headerTitleStyle: { fontSize: 16 } }} />
        <Stack.Screen name="(modals)/(home)/daily_route_vehicles_inspection" options={{ headerShadowVisible:false, headerTitle:"Daily Route Vehicles", headerTitleAlign:"center", headerTitleStyle: { fontSize: 16 } }} />
        <Stack.Screen name="(modals)/(home)/technician_support" options={{ headerShadowVisible:false, headerTitle:"Technician Support", headerTitleAlign:"center", headerTitleStyle: { fontSize: 16 } }} />
        <Stack.Screen name="(modals)/(home)/vehicle_documents" options={{ headerShadowVisible:false, headerTitle:"Vehicle Documents", headerTitleAlign:"center", headerTitleStyle: { fontSize: 16 } }} />
        <Stack.Screen name="(modals)/(home)/vehicle_servicing_history" options={{ headerShadowVisible:false, headerTitle:"Vehicle Servicing history", headerTitleAlign:"center", headerTitleStyle: { fontSize: 16 } }} />
        <Stack.Screen name="(modals)/(home)/sell_vehicle" options={{ headerShadowVisible:false, headerTitle:" Sell Vehicle", headerTitleAlign:"center", headerTitleStyle: { fontSize: 16 } }} />
        <Stack.Screen name="(modals)/(home)/rent_vehicle" options={{ headerShadowVisible:false, headerTitle:" Rent Vehicle", headerTitleAlign:"center", headerTitleStyle: { fontSize: 16 } }} />
        <Stack.Screen name="(modals)/all_photos" options={{ headerShadowVisible:false, headerTitle:"Gallery", headerTitleAlign:"center", headerTitleStyle: { fontSize: 16 } }} />
        <Stack.Screen name="(modals)/(home)/before_photos" options={{ headerShadowVisible:false, headerTitle:"Before Journey Photos", headerTitleAlign:"center", headerTitleStyle: { fontSize: 16 } }} />
        <Stack.Screen name="(modals)/(home)/after_photos" options={{ headerShadowVisible:false, headerTitle:"After Journey Photos", headerTitleAlign:"center", headerTitleStyle: { fontSize: 16 } }} />
        <Stack.Screen name="(modals)/(home)/holiday_yatra" options={{ headerShadowVisible:false, headerTitle:"Holiday Yatra", headerTitleAlign:"center", headerTitleStyle: { fontSize: 16 } }} />
        <Stack.Screen name="(modals)/(home)/empty_vehicle_list" options={{ headerShadowVisible:false, headerTitle:"Empty Vehicle List", headerTitleAlign:"center", headerTitleStyle: { fontSize: 16 } }} />
        <Stack.Screen name="(modals)/(home)/search_empty_vehicle_list" options={{ headerShadowVisible:false, headerTitle:"Search Empty Vehicle", headerTitleAlign:"center", headerTitleStyle: { fontSize: 16 } }} />

        <Stack.Screen name="(modals)/(home)/(forms)/add_cleaner" options={{ headerShadowVisible:false, headerTitle:"Add Cleaner", headerTitleAlign:"center", headerTitleStyle: { fontSize: 16 } }} />
        <Stack.Screen name="(modals)/(home)/(forms)/edit_cleaner" options={{ headerShadowVisible:false, headerTitle:"Edit Cleaner", headerTitleAlign:"center", headerTitleStyle: { fontSize: 16 } }} />
        <Stack.Screen name="(modals)/(home)/(forms)/add_driver" options={{ headerShadowVisible:false, headerTitle:"Add Driver", headerTitleAlign:"center", headerTitleStyle: { fontSize: 16 } }} />
        <Stack.Screen name="(modals)/(home)/(forms)/edit_driver" options={{ headerShadowVisible:false, headerTitle:"Edit Driver", headerTitleAlign:"center", headerTitleStyle: { fontSize: 16 } }} />
        <Stack.Screen name="(modals)/(home)/(forms)/add_employee" options={{ headerShadowVisible:false, headerTitle:"Add Employee", headerTitleAlign:"center", headerTitleStyle: { fontSize: 16 } }} />
        <Stack.Screen name="(modals)/(home)/(forms)/edit_employee" options={{ headerShadowVisible:false, headerTitle:"Edit Employee", headerTitleAlign:"center", headerTitleStyle: { fontSize: 16 } }} />
        <Stack.Screen name="(modals)/(home)/(forms)/add_car" options={{ headerShadowVisible:false, headerTitle:"Add Car", headerTitleAlign:"center", headerTitleStyle: { fontSize: 16 } }} />
        <Stack.Screen name="(modals)/(home)/(forms)/add_bus" options={{ headerShadowVisible:false, headerTitle:"Add Bus", headerTitleAlign:"center", headerTitleStyle: { fontSize: 16 } }} />
        <Stack.Screen name="(modals)/(home)/(forms)/add_tempo" options={{ headerShadowVisible:false, headerTitle:"Add Tempo Traveller", headerTitleAlign:"center", headerTitleStyle: { fontSize: 16 } }} />
        <Stack.Screen name="(modals)/(home)/(forms)/add_truck" options={{ headerShadowVisible:false, headerTitle:"Add Truck", headerTitleAlign:"center", headerTitleStyle: { fontSize: 16 } }} />
        <Stack.Screen name="(modals)/(home)/(forms)/edit_car" options={{ headerShadowVisible:false, headerTitle:"Edit Car", headerTitleAlign:"center", headerTitleStyle: { fontSize: 16 } }} />
        <Stack.Screen name="(modals)/(home)/(forms)/edit_bus" options={{ headerShadowVisible:false, headerTitle:"Edit Bus", headerTitleAlign:"center", headerTitleStyle: { fontSize: 16 } }} />
        <Stack.Screen name="(modals)/(home)/(forms)/edit_tempo" options={{ headerShadowVisible:false, headerTitle:"Edit Tempo Traveller", headerTitleAlign:"center", headerTitleStyle: { fontSize: 16 } }} />
        <Stack.Screen name="(modals)/(home)/(forms)/edit_truck" options={{ headerShadowVisible:false, headerTitle:"Edit Truck", headerTitleAlign:"center", headerTitleStyle: { fontSize: 16 } }} />
        <Stack.Screen name="(modals)/(home)/(forms)/add_package_vehicle_booking" options={{ headerShadowVisible:false, headerTitle:"Package Vehicle Booking Form", headerTitleAlign:"center", headerTitleStyle: { fontSize: 16 } }} />
        <Stack.Screen name="(modals)/(home)/(forms)/add_daily_route_vehicles" options={{ headerShadowVisible:false, headerTitle:"Daily Route Vehicles", headerTitleAlign:"center", headerTitleStyle: { fontSize: 16 } }} />
        <Stack.Screen name="(modals)/(home)/(forms)/edit_package_vehicle_booking" options={{ headerShadowVisible:false, headerTitle:"Package Vehicle Booking Form", headerTitleAlign:"center", headerTitleStyle: { fontSize: 16 } }} />
        <Stack.Screen name="(modals)/(home)/(forms)/edit_daily_route_vehicles" options={{ headerShadowVisible:false, headerTitle:"Daily Route Vehicles", headerTitleAlign:"center", headerTitleStyle: { fontSize: 16 } }} />
        <Stack.Screen name="(modals)/(home)/(forms)/add_technician" options={{ headerShadowVisible:false, headerTitle:"Add Technician", headerTitleAlign:"center", headerTitleStyle: { fontSize: 16 } }} />
        <Stack.Screen name="(modals)/(home)/(forms)/edit_technician" options={{ headerShadowVisible:false, headerTitle:"Edit Technician", headerTitleAlign:"center", headerTitleStyle: { fontSize: 16 } }} />
        <Stack.Screen name="(modals)/(home)/(forms)/add_vehicle_documents" options={{ headerShadowVisible:false, headerTitle:"Vehicle Documents", headerTitleAlign:"center", headerTitleStyle: { fontSize: 16 } }} />
        <Stack.Screen name="(modals)/(home)/(forms)/add_vehicle_servicing_history" options={{ headerShadowVisible:false, headerTitle:"Vehicle Service History", headerTitleAlign:"center", headerTitleStyle: { fontSize: 16 } }} />
        <Stack.Screen name="(modals)/(home)/(forms)/edit_vehicle_servicing_history" options={{ headerShadowVisible:false, headerTitle:"Edit Vehicle History", headerTitleAlign:"center", headerTitleStyle: { fontSize: 16 } }} />
        <Stack.Screen name="(modals)/(home)/(forms)/edit_vehicle_documents" options={{ headerShadowVisible:false, headerTitle:"Vehicle Documents", headerTitleAlign:"center", headerTitleStyle: { fontSize: 16 } }} />
        <Stack.Screen name="(modals)/(home)/(forms)/add_holiday_yatra" options={{ headerShadowVisible:false, headerTitle:"Add Holiday yatra", headerTitleAlign:"center", headerTitleStyle: { fontSize: 16 } }} />
        <Stack.Screen name="(modals)/(home)/(forms)/edit_holiday_yatra" options={{ headerShadowVisible:false, headerTitle:"Edit Holiday yatra", headerTitleAlign:"center", headerTitleStyle: { fontSize: 16 } }} />
        <Stack.Screen name="(modals)/(home)/(forms)/add_empty_vehicle" options={{ headerShadowVisible:false, headerTitle:"Add Empty Vehicle", headerTitleAlign:"center", headerTitleStyle: { fontSize: 16 } }} />
        <Stack.Screen name="(modals)/(home)/(forms)/edit_empty_vehicle" options={{ headerShadowVisible:false, headerTitle:"Edit Empty Vehicle", headerTitleAlign:"center", headerTitleStyle: { fontSize: 16 } }} />

        <Stack.Screen name="(modals)/(customer)/drivers_all" options={{ headerShadowVisible: false, headerTitle: "Drivers for you", headerTitleAlign: "center" }} />
        <Stack.Screen name='(modals)/(customer)/hire_vehicles' options={{ headerShadowVisible: false, headerTitle: "Hire Vehicles", headerTitleAlign: "center" }} />
        <Stack.Screen name='(modals)/(customer)/bus_tickets' options={{ headerShadowVisible: false, headerTitle: "Bus Tickets", headerTitleAlign: "center" }} />
        <Stack.Screen name='(modals)/(customer)/favourite_bus_tickets' options={{ headerShadowVisible: false, headerTitle: "Favourite Bus Tickets", headerTitleAlign: "center" }} />
        <Stack.Screen name='(modals)/(customer)/holiday_yatra' options={{ headerShadowVisible: false, headerTitle: "Holiday Yatra", headerTitleAlign: "center" }} />
        <Stack.Screen name='(modals)/(customer)/favourite_holiday_yatra' options={{ headerShadowVisible: false, headerTitle: "Favourite Holiday Yatra", headerTitleAlign: "center" }} />
        <Stack.Screen name='(modals)/(customer)/sell_vehicle_list' options={{ headerShadowVisible: false, headerTitle: "Sell Vehicle List", headerTitleAlign: "center" }} />
        
        <Stack.Screen name='(modals)/(customer)/login' options={{ headerShown: false}} />
        <Stack.Screen name='(modals)/(customer)/signup' options={{ headerShown: false}} />
        <Stack.Screen name='(modals)/(customer)/welcome' options={{ headerShown: false}} />

        <Stack.Screen name="(modals)/plans" options={{ headerShadowVisible:false, headerTitle:"Premium", headerTitleAlign:"center" }} />
        <Stack.Screen name="(modals)/(home)/invoice" options={{ headerShadowVisible:false, headerTitle:"Invoice", headerTitleAlign:"center" }} />

        <Stack.Screen name="+not-found" />
      </Stack>
      <Toast />
    </GlobalProvider>
  );
}
