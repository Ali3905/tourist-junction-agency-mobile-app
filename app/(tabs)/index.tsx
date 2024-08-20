import React, { useState, useRef } from 'react';
import { StyleSheet, StatusBar, View, Text, Image, TouchableOpacity, Dimensions, ScrollView, Modal } from 'react-native';
import { Video } from 'expo-av';
import Carousel from 'react-native-reanimated-carousel';
import { useGlobalContext } from '@/context/GlobalProvider';
import { Redirect, router } from 'expo-router';
import Loader from '@/components/loader';
import { Colors } from '@/constants/Colors';
import { GestureHandlerRootView, TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { AntDesign } from '@expo/vector-icons';
import * as Linking from 'expo-linking';
import { BlurView } from 'expo-blur';
import { Path, Rect, Svg } from 'react-native-svg';

const carouselImages = [
  require('@/assets/images/carousel1.png'),
  require('@/assets/images/carousel2.png'),
  require('@/assets/images/carousel3.png'),
  require('@/assets/images/carousel4.png'),
  require('@/assets/images/carousel5.png'),
  require('@/assets/images/carousel6.png')
];

const { width: deviceWidth, height: deviceHeight } = Dimensions.get('window');

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

export default function HomeScreen() {
  const { isLogged, loading, userData } = useGlobalContext();
  const videoRef = useRef<Video>(null);
  const whatsNewVideoRef = useRef<Video>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(false);
  const [showVideoModal, setShowVideoModal] = useState(false);

  const handlePlayPause = () => {
    if (isPlaying) {
      videoRef.current?.pauseAsync();
    } else {
      videoRef.current?.playAsync();
    }
    setIsPlaying(!isPlaying);
  };

  const handleViewVideo = (isVideo1: boolean) => {
    setSelectedVideo(isVideo1);
    setShowVideoModal(true);
  };

  if (!loading && !isLogged) return <Redirect href="/(modals)/onbording" />;

  if (loading) {
    return (
      <View style={styles.container}>
        <Loader loading />
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={styles.container}>
      <View style={{
        padding: 20,
        backgroundColor: Colors.darkBlue,
      }}>
        <Text style={{ fontSize: 15, fontWeight: '500', color: "white" }}>Hi, {userData?.userName}</Text>
      </View>
      <ScrollView>
        <View style={styles.logoContainer}>
          <Image source={require('@/assets/images/logo.png')} style={styles.image} />
        </View>
        <View style={styles.carouselContainer}>
          <Carousel
            width={deviceWidth * 0.9}
            height={deviceWidth * 0.6}
            autoPlay
            data={carouselImages}
            renderItem={({ item }) => (
              <Image source={item} style={styles.carouselImage} />
            )}
          />
        </View>

        <View style={styles.dividerContainer}>
          <View style={styles.divider}>
            <Text style={styles.dividerText}>Our Services</Text>
          </View>
        </View>

        <View style={styles.grid}>
          <TouchableOpacity onPress={() => router.push('daily_route_vehicles')} style={styles.gridItem}>
            <Image source={require('@/assets/images/route.png')} style={styles.icon} />
            <Text style={styles.iconText} numberOfLines={2} ellipsizeMode="tail">Daily Route Vehicles</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push('package_vehicle_booking')} style={styles.gridItem}>
            <Image source={require('@/assets/images/package.png')} style={styles.icon} />
            <Text style={styles.iconText} numberOfLines={2} ellipsizeMode="tail">Package Vehicle Booking</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push('vehicle_servicing_history')} style={styles.gridItem}>
            <Image source={require('@/assets/images/vehicle_servicing_history.png')} style={styles.icon} />
            <Text style={styles.iconText} numberOfLines={2} ellipsizeMode="tail">Vehicle Servicing History</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push('employee_list')} style={styles.gridItem}>
            <Image source={require('@/assets/images/staff_details.png')} style={styles.icon} />
            <Text style={styles.iconText} numberOfLines={2} ellipsizeMode="tail">Employee Details</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push('drivers_all')} style={styles.gridItem}>
            <Image source={require('@/assets/images/emergency-driver-icon.png')} style={styles.icon} />
            <Text style={styles.iconText} numberOfLines={2} ellipsizeMode="tail">Search Drivers</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push('drivers_list')} style={styles.gridItem}>
            <Image source={require('@/assets/images/drivers_list.png')} style={styles.icon} />
            <Text style={styles.iconText} numberOfLines={2} ellipsizeMode="tail">My Driver</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push('cleaners_list')} style={styles.gridItem}>
            <Image source={require('@/assets/images/cleaners_list.png')} style={styles.icon} />
            <Text style={styles.iconText} numberOfLines={2} ellipsizeMode="tail">Cleaner's List</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push('vehicle_documents')} style={styles.gridItem}>
            <Image source={require('@/assets/images/vehicle_documents.png')} style={styles.icon} />
            <Text style={styles.iconText} numberOfLines={2} ellipsizeMode="tail">Vehicle Documents</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push('all_vehicle_list')} style={styles.gridItem}>
            <Image source={require('@/assets/images/vehicle_management.png')} style={styles.icon} />
            <Text style={styles.iconText} numberOfLines={2} ellipsizeMode="tail">All Vehicle List</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push('technician_support')} style={styles.gridItem}>
            <Image source={require('@/assets/images/technician_support.png')} style={styles.icon} />
            <Text style={styles.iconText} numberOfLines={2} ellipsizeMode="tail">Technician Support</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push('empty_vehicle_list')} style={styles.gridItem}>
            <Image source={require('@/assets/images/empty-vehicle-icon.png')} style={styles.iconEmpty} />
            <Text style={styles.iconText} numberOfLines={2} ellipsizeMode="tail">Empty Vehicles</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push('holiday_yatra')} style={styles.gridItem}>
            <Image source={require('@/assets/images/empty-vehicle-icon.png')} style={styles.iconEmpty} />
            <Text style={styles.iconText} numberOfLines={2} ellipsizeMode="tail">Holiday Yatra</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.dividerContainer}>
          <View style={styles.divider}>
            <Text style={styles.dividerText}>Watch Videos</Text>
          </View>
        </View>

        <Text style={styles.whatsNewHeading}>How to use</Text>

        <View style={styles.card}>
          <Video
            ref={videoRef}
            source={require('@/assets/videos/video1.mp4')}
            rate={1.0}
            volume={1.0}
            isMuted={false}
            //@ts-ignore
            resizeMode="cover"
            shouldPlay={false}
            isLooping
            style={[styles.cardVideo, { height: 200 }]}
          />
          <TouchableOpacity style={styles.playPauseButton} onPress={() => handleViewVideo(true)}>
            <AntDesign name={'playcircleo'} size={40} color="#fff" />
          </TouchableOpacity>
        </View>

        <Text style={styles.whatsNewHeading}>Why choose us</Text>
        <View style={styles.card}>
          <Video
            ref={whatsNewVideoRef}
            source={require('@/assets/videos/video2.mp4')}
            rate={1.0}
            volume={1.0}
            isMuted={false}
            //@ts-ignore
            resizeMode="cover"
            shouldPlay={false}
            isLooping
            style={styles.whatsNewVideo}
          />
          <TouchableOpacity style={styles.playPauseButton} onPress={() => handleViewVideo(false)}>
            <AntDesign name={'playcircleo'} size={40} color="#fff" />
          </TouchableOpacity>
        </View>

        <View style={styles.socialMediaContainer}>
          <TouchableOpacity
            style={styles.socialMediaIcon}
            onPress={() => Linking.openURL('https://www.instagram.com/touristjunctionpvtltd?igsh=MWlkZWY1aGtsc3U5Ng==')}
          >
            <AntDesign name="instagram" size={24} color={Colors.primary} />
            <Text style={styles.socialText}>Instagram</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.socialMediaIcon}
            onPress={() => Linking.openURL('https://www.facebook.com/profile.php?id=100077968170241&mibextid=kFxxJD')}
          >
            <AntDesign name="facebook-square" size={24} color={Colors.primary} />
            <Text style={styles.socialText}>Facebook</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.socialMediaIcon}
            onPress={() => Linking.openURL('https://youtube.com/@touristjunction4999?si=R80i9A17olOBrdzX')}
          >
            <AntDesign name="youtube" size={24} color={Colors.primary} />
            <Text style={styles.socialText}>YouTube</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <Modal
        animationType="slide"
        transparent={true}
        visible={showVideoModal}
        onRequestClose={() => setShowVideoModal(false)}
      >
        <BlurOverlay visible={showVideoModal} onRequestClose={() => setShowVideoModal(false)} />

        <View style={styles.modalContainer}>
          <View style={!selectedVideo ? styles.modalContentOverdide : styles.modalContent}>
            <Video
              ref={videoRef}
              source={!selectedVideo ? require('@/assets/videos/video2.mp4') : require('@/assets/videos/video1.mp4')}
              rate={1.0}
              volume={1.0}
              isMuted={false}
              shouldPlay={isPlaying}
              //@ts-ignore
              resizeMode="cover"
              isLooping
              style={[styles.cardVideo, !selectedVideo && { height: 200 }]}
            />
            <TouchableOpacity style={styles.playPauseButton} onPress={handlePlayPause}>
              <AntDesign style={isPlaying && { opacity: 0.1 }} name={isPlaying ? 'pausecircle' : 'playcircleo'} size={40} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.closeButton} onPress={() => setShowVideoModal(false)}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    marginTop: StatusBar.currentHeight,
  },
  carouselContainer: {
    alignItems: 'center',
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
    borderBottomColor: Colors.secondary,
    width: '100%',
    position: 'relative',
    alignItems: 'center',
  },
  dividerText: {
    position: 'absolute',
    backgroundColor: '#ffffff',
    paddingHorizontal: 5,
    top: -10,
    color: '#00000',
    fontWeight: '700'
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginVertical: 20,
  },
  gridItem: {
    width: '33.33%',
    alignItems: 'center',
    marginVertical: 10,
    paddingHorizontal: 5,
  },
  icon: {
    width: 50,
    height: 50,
    resizeMode: 'contain',
  },
  iconEmpty: {
    width: 45,
    height: 45,
  },
  iconText: {
    marginTop: 5,
    fontSize: Math.min(11, deviceHeight * 0.015),
    color: Colors.primary,
    textAlign: 'center',
    fontWeight: '500',
    width: '100%',
  },
  logoContainer: {
    alignItems: 'center',
    marginVertical: 10,
  },
  buttonContainer: {
    alignItems: 'center',
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
  cardVideo: {
    width: '100%',
    height: "90%",
    borderRadius: 15,
  },
  playPauseButton: {
    position: 'absolute',
    top: '40%',
    left: '45%',
    zIndex: 1,
  },
  cardText: {
    marginTop: 10,
    marginBottom: 5,
    fontSize: 13,
    textAlign: 'center',
    paddingHorizontal: 12,
    paddingVertical: 2,
    fontWeight: '600',
  },
  whatsNewHeading: {
    fontSize: 24,
    fontWeight: '800',
    color: Colors.primary,
    textAlign: 'center',
    marginVertical: 20,
  },
  whatsNewVideoContainer: {
    position: 'relative',
    alignSelf: 'center',
  },
  whatsNewVideo: {
    width: deviceWidth * 0.9,
    height: deviceWidth * 0.5,
    borderRadius: 15,
  },
  playPauseButtonWhatsNew: {
    position: 'absolute',
    top: '40%',
    left: '45%',
    zIndex: 1,
  },
  socialMediaContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginVertical: 20,
    marginBottom: 60
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
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 5,
    width: "90%",
    alignItems: "center",
    marginVertical: 20
  },
  modalText: {
    fontSize: 16,
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: "row",
    gap: 20,
    alignItems: "center",
  },
  modalImage: {
    width: 200,
    height: 200,
    resizeMode: "contain",
    marginBottom: 20,
  },
  closeButton: {
    backgroundColor: Colors.darkBlue,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 20
  },
  closeButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  modalContentOverdide: {
    backgroundColor: "#fff",
    borderRadius: 5,
    width: "90%",
    alignItems: "center",
    marginVertical: 20,
    height: "70%",
    justifyContent: "center",
    paddingTop: 50,
    gap: 100
  },
  image: {
    width: 200,
    height: 150,
    resizeMode: 'contain'
  },
});