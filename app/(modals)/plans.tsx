import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  Alert,
  Image,
  ScrollView
} from "react-native";
import { Colors } from "@/constants/Colors";
import RazorpayCheckout from 'react-native-razorpay';
import { useGlobalContext } from "@/context/GlobalProvider";
import { router } from "expo-router";

const keyFeatures = [
  "Priority Support & Technician Assistance",
  "Unlimited Access to All Features",
];

const plans = [
  { name: "Monthly Plan", price: 299, displayPrice: "₹ 299 / Month", planType: "MONTHLY" },
  { name: "Annual Plan", price: 999, displayPrice: "₹ 999 / Yearly", planType: "YEARLY" },
];

let razorpayKeyId = "rzp_live_PwTsFyB8RxXoJf"

const currency = "INR";

const PlansScreen: React.FC = () => {
  const [selectedPlan, setSelectedPlan] = useState<typeof plans[0] | null>(null);
  const { apiCaller, setRefresh, userData } = useGlobalContext();

  const handlePlanSelect = (plan: typeof plans[0]) => {
    setSelectedPlan(plan);
  };

  const renderFeature = ({ item }: { item: string }) => (
    <View style={styles.featureItem}>
      <Text style={styles.featureText}>• {item}</Text>
    </View>
  );

  const renderPlan = ({ item }: { item: typeof plans[0] }) => (
    <TouchableOpacity
      style={[
        styles.planItem,
        selectedPlan?.name === item.name && styles.selectedPlanItem
      ]}
      onPress={() => handlePlanSelect(item)}
    >
      {/* {item.name === "Annual Plan" && (
        <Image
          source={require('@/assets/images/top-seller.png')} // Update the path to your "bestseller" image
          style={styles.bestsellerImage}
        />
      )} */}
      <Text style={[
        styles.planName,
        selectedPlan?.name === item.name && styles.selectedPlanText
      ]}>
        {item.name}
      </Text>
      <Text style={[
        styles.planPrice,
        selectedPlan?.name === item.name && styles.selectedPlanText
      ]}>
        {item.displayPrice}
      </Text>
    </TouchableOpacity>
  );

  const handleSubscription = async () => {
    if (!selectedPlan) return;

    try {
      

      // // Call createOrder API
      // const orderResponse = await apiCaller.post('/api/subscription/createOrder', {
      //   amount: selectedPlan.price.toString(),
      //   currency: currency,
      //   receipt: `receipt#${userData?._id}`
      // });

      // const { id: orderId } = orderResponse.data.data;

      // var options = {
      //   description: `${selectedPlan.name} Subscription`,
      //   image: require('@/assets/images/logo.png'),
      //   currency: currency,
      //   key: razorpayKeyId,
      //   amount: selectedPlan.price * 100,
      //   name: `${selectedPlan.name} Subscription`,
      //   order_id: orderId,
      //   prefill: {
      //     email: userData?.email,
      //     contact: userData?.mobileNumber,
      //     name: userData?.companyName
      //   },
      //   theme: { color: "#89CEF6" }
      // }

      // Call createRazorpaySubscription API
      const orderResponse = await apiCaller.post('/api/subscription/createSubscription');

      const { id: subscriptionId } = orderResponse.data.data;

      var options = {
        subscription_id: subscriptionId,
        description: `${selectedPlan.name} Subscription`,
        name: `${selectedPlan.name} Subscription`,
        image: require('@/assets/images/logo.png'),
        currency: currency,
        // key: razorpayKeyId,
        prefill: {
          email: userData?.email,
          contact: userData?.mobileNumber,
          name: userData?.companyName
        },
        theme: { color: "#89CEF6" }
      }

      // const razorpayResult = await RazorpayCheckout.open(options);

      RazorpayCheckout.open(options).then(async (data) => {
        // alert(`Success: ${data.razorpay_payment_id}`);
        const verificationResponse = await apiCaller.post('/api/subscription/verify', {
          subscription_id: data.subscription_id,
          razorpay_payment_id: data.razorpay_payment_id,
          razorpay_signature: data.razorpay_signature
        });

        if (verificationResponse.data.success) {
                // Call subscription API
            let subscriptionResponse
            if (userData && userData.subscription) {
              subscriptionResponse = await apiCaller.patch(`/api/subscription/${userData.subscription}`, {
                plan: selectedPlan.planType
              });
            } else {
              subscriptionResponse = await apiCaller.post('/api/subscription/', {
                plan: selectedPlan.planType
              });
            }
          router.replace("/")
          setRefresh(prev => !prev)
          
          Alert.alert("Success", "Payment successful and verified!");
          return;
        } else {
          Alert.alert("Error", "Payment verification failed.");
        }
      }).catch((error) => {
        // handle failure
        // alert(`Error: ${error.code} | ${error.description}`);
        alert(`Error: ${error}`);
      });

    } catch (error) {
      console.error("Error in subscription process:", error);
      Alert.alert("Error", "An error occurred during the subscription process. Please try again.");
    }
  };
  const features = [
    'Add your vehicles',
    'Create / Share Invoices',
    'Create Bus Route',
    'Ticket Booking Inquiries',
    'Share your Routes, Tourist Vehicle with Customer',
    'Save & Share your Vehicle Documents',
    'Get Alert Notifications Before your Documents Expire',
    'Store Vehicle Documents with Date & Bills',
    'Sell & Rent your vehicles',
    'Add your driver on every trip & send trip details automatically',
    'After renting vehicle to the customer, send a booking reminder two days before trip, send driver number automatically',
    'Add your staff, cleaner, driver documents & make yourself safe',
    'Get support from Mechanics, Electricians, Spare part shop, SpringWork, Battery Services, Body Repair Services',
    'View Customer & Trip details of all vehicle booking',
    'Get vehicle photos, Driver Payment, Diesel, Vehicle Maintenance, Meter Readings, Before and After each trip',
    'Get driver numbers & Documents in emergency from all over India',
  ];

  return (
    <ScrollView>
       <View style={styles.container1}>
      <View style={styles.planCard}>
        <Text style={styles.planTitle}>Pro Plan</Text>
        <View style={styles.offerTag}>
          <Text style={styles.offerText}>Offer</Text>
        </View>
        <Text style={styles.price}>₹299/month</Text>
        <Text style={styles.price}>₹999/Year</Text>
        <Text style={styles.oldPrice}>₹3600/Year</Text>
        <ScrollView>
          {features.map((feature, index) => (
            <View key={index} style={styles.featureContainer}>
              <Text style={styles.checkMark}>✓</Text>
              <Text style={styles.featureItem}>{feature}</Text>
            </View>
          ))}
        </ScrollView>
      </View>
    </View>
      <SafeAreaView style={styles.container}>
       
      <View style={styles.featuresContainer}>
        {/* <Text style={styles.sectionTitle}>Key Features:</Text> */}
        {/* <FlatList
          data={keyFeatures}
          renderItem={renderFeature}
          keyExtractor={(item, index) => index.toString()}
        /> */}
      </View>
      <View style={styles.plansContainer}>
        <FlatList
          data={plans}
          renderItem={renderPlan}
          keyExtractor={(item, index) => index.toString()}
        />
      </View>
      <TouchableOpacity
        style={[
          styles.continueButton,
          selectedPlan ? styles.activeButton : styles.disabledButton
        ]}
        disabled={!selectedPlan}
        onPress={handleSubscription}
      >
        <Text style={styles.continueButtonText}>Continue</Text>
      </TouchableOpacity>
    </SafeAreaView>
    </ScrollView>

  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAF9F6",
    padding: 15,
  },
  container1: {
    flex: 1,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 1,
  },
  planCard: {
    width: '90%',
    backgroundColor: '#7b00ff',
    borderRadius: 10,
    padding: 20,
    position: 'relative',
  },
  planTitle: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  offerTag: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#ff5722',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    transform: [{ rotate: '45deg' }], // Rotate the offer tag
  },
  offerText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  price: {
    color: '#ffffff',
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 1,
  },
  priceYear: {
    color: '#ffffff',
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 5,
  },
  oldPrice: {
    color: '#ffffff',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    textDecorationLine: 'line-through',
    opacity: 0.7,
  },
  featureContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginVertical: 5,
  },
  checkMark: {
    color: '#ffffff',
    fontSize: 16,
    marginRight: 10,
    marginTop: 3, // Align the checkmark with the feature text vertically
  },
  featureItem: {
    color: '#ffffff',
    fontSize: 14,
    lineHeight: 20,
    flexShrink: 1, // Allow text to wrap and stay within the container
  },
  bestsellerImage: {
    position: 'absolute',
    top: -10,
    right: -10,
    width: 100,
    height: 50,
    resizeMode: 'contain',
  },
  header: {
    marginBottom: 20,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  featuresContainer: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: Colors.darkBlue,
  },
  // featureItem: {
  //   marginBottom: 10,
  // },
  featureText: {
    fontSize: 16,
    color: Colors.secondary,
  },
  plansContainer: {
    marginBottom: 20,
  },
  planItem: {
    padding: 16,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom: 10,
  },
  selectedPlanItem: {
    borderColor: Colors.darkBlue,
    backgroundColor: Colors.secondary,
  },
  selectedPlanText: {
    color: "#fff",
  },
  planName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
    color: Colors.darkBlue,
  },
  planPrice: {
    fontSize: 16,
    color: Colors.secondary,
  },
  continueButton: {
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  activeButton: {
    backgroundColor: Colors.darkBlue,
  },
  disabledButton: {
    backgroundColor: "gray",
  },
  continueButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: "#ffff",
  },
});

export default PlansScreen;
