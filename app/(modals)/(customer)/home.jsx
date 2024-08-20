import { StyleSheet, StatusBar, View, Text, Image, Dimensions, ScrollView, TouchableOpacity } from 'react-native'
import React from 'react'
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Colors } from "@/constants/Colors";
import Carousel from 'react-native-reanimated-carousel';

const { width: deviceWidth } = Dimensions.get('window');

const home = () => {
    const carouselImages = [
        require('@/assets/images/carousel1.png'),
        require('@/assets/images/carousel2.png'),
        require('@/assets/images/carousel3.png'),
        require('@/assets/images/carousel4.png'),
        require('@/assets/images/carousel5.png'),
        require('@/assets/images/carousel6.png')
    ];

    return (
        <GestureHandlerRootView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerText}>Hi, Customer</Text>
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
                <TouchableOpacity style={styles.gridItem}>
                    <Image source={require('@/assets/images/route.png')} style={styles.icon} />
                    <Text style={styles.iconText} numberOfLines={2} ellipsizeMode="tail">Bus Ticket</Text>
                 </TouchableOpacity>
                
                <TouchableOpacity  style={styles.gridItem}>
                  <Image source={require('@/assets/images/vehicle_documents.png')} style={styles.icon} />
                  <Text style={styles.iconText} numberOfLines={2} ellipsizeMode="tail">Vehicle Documents</Text>
               </TouchableOpacity>

               <TouchableOpacity style={styles.gridItem}>
                    <Image source={require('@/assets/images/vehicle_servicing_history.png')} style={styles.icon} />
                    <Text style={styles.iconText} numberOfLines={2} ellipsizeMode="tail">Vehicle Servicing History</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => router.push('drivers_all')} style={styles.gridItem}>
                    <Image source={require('@/assets/images/emergency-driver-icon.png')} style={styles.icon} />
                    <Text style={styles.iconText} numberOfLines={2} ellipsizeMode="tail">Search Drivers</Text>
                </TouchableOpacity>
                <TouchableOpacity  style={styles.gridItem}>
                    <Image source={require('@/assets/images/vehicle_management.png')} style={styles.icon} />
                    <Text style={styles.iconText} numberOfLines={2} ellipsizeMode="tail">All Vehicle List</Text>
                </TouchableOpacity>
                

            </View>
               
                    



            </ScrollView>
        </GestureHandlerRootView>
    )
}

export default home

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
    },
    header: {
        paddingTop: 13,
        paddingBottom:13,
        padding: 10, // Reduced padding to decrease navbar height
        backgroundColor: Colors.darkBlue,
        
    },
    headerText: {
        fontSize: 15,
        fontWeight: '500',
        color: "white",
    },
    logoContainer: {
        alignItems: 'center',
        marginVertical: 10,
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
      iconText: {
        marginTop: 5,
        fontSize: 10,
        color: Colors.primary,
        textAlign: 'center',
        fontWeight: '500',
        width: '100%',
      },
    image: {
        width: 200,
        height: 150,
        resizeMode: 'contain'
    },
});
