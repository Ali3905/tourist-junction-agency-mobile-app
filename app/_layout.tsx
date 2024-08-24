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
        <Stack.Screen name="(tabs)/index" options={{ headerShown: false }} />
        <Stack.Screen name="(modals)/login" options={{ headerShown: false }} />
        <Stack.Screen name="(modals)/(home)/before_photos" options={{ headerShadowVisible:false, headerTitle:"Before Journey Photos", headerTitleAlign:"center" }} />
        <Stack.Screen name="(modals)/(home)/after_photos" options={{ headerShadowVisible:false, headerTitle:"After Journey Photos", headerTitleAlign:"center" }} />

        <Stack.Screen name="(modals)/(home)/package_vehicle_booking" options={{ headerShadowVisible: false, headerTitle: "Package Vehicle booking", headerTitleAlign: "center" }} />
        <Stack.Screen name="(modals)/(home)/package_vehicle_booking_more/[pkgId]" options={{ headerShadowVisible: false, headerTitle: "Package Vehicle booking", headerTitleAlign: "center" }} />
        <Stack.Screen name="(modals)/(home)/package_vehicle_booking_complete" options={{ headerShadowVisible: false, headerTitle: "Package Vehicle booking", headerTitleAlign: "center" }} />
        <Stack.Screen name="(modals)/(home)/daily_route_vehicles" options={{ headerShadowVisible: false, headerTitle: "Daily Route Vehicles", headerTitleAlign: "center" }} />
        <Stack.Screen name="(modals)/(home)/daily_route_vehicles_complete" options={{ headerShadowVisible: false, headerTitle: "Daily Route Vehicles", headerTitleAlign: "center" }} />
        <Stack.Screen name="(modals)/plans" options={{ headerShadowVisible: false, headerTitle: "Premium", headerTitleAlign: "center" }} />
        <Stack.Screen name="(modals)/(home)/all_photos" options={{ headerShadowVisible: false, headerTitle: "Gallery", headerTitleAlign: "center" }} />
        <Stack.Screen name="+not-found" />
      </Stack>
      <Toast />
    </GlobalProvider>
  );
}
