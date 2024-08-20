import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  Alert,
  Image
} from "react-native";
import { Colors } from "@/constants/Colors";
import RazorpayCheckout from 'react-native-razorpay';
import { useGlobalContext } from "@/context/GlobalProvider";

const keyFeatures = [
  "Priority Support & Technician Assistance",
  "Unlimited Access to All Features",
];

const plans = [
  { name: "Monthly Plan", price: 299, displayPrice: "₹ 299 / Month", planType: "MONTHLY" },
  { name: "Annual Plan", price: 999, displayPrice: "₹ 999 / Yearly", planType: "YEARLY" },
];

let razorpayKeyId = "rzp_test_wG7GhVLcZ7CSBf"

const currency = "INR";

const PlansScreen: React.FC = () => {
  const [selectedPlan, setSelectedPlan] = useState<typeof plans[0] | null>(null);
  const { apiCaller } = useGlobalContext();

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
      {item.name === "Annual Plan" && (
        <Image
          source={require('@/assets/images/top-seller.png')} // Update the path to your "bestseller" image
          style={styles.bestsellerImage}
        />
      )}
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
      // Call subscription API
      const subscriptionResponse = await apiCaller.post('/api/subscription/', {
        plan: selectedPlan.planType
      });

      // Call createOrder API
      const orderResponse = await apiCaller.post('/api/subscription/createOrder', {
        amount: selectedPlan.price.toString(),
        currency: currency,
        receipt: 'receipt#1'
      });

      const { id: orderId } = orderResponse.data.data;

      var options = {
        description: `${selectedPlan.name} Subscription`,
        image: 'https://i.imgur.com/3g7nmJC.png',
        currency: currency,
        key: razorpayKeyId,
        amount: selectedPlan.price * 100,
        name: `${selectedPlan.name} Subscription`,
        order_id: orderId,
        prefill: {
          email: 'xyz@gmail.com',
          contact: '9999999999',
          name: 'User 1'
        },
        theme: { color: '#F37254' }
      }

      const razorpayResult = await RazorpayCheckout.open(options);

      RazorpayCheckout.open(options).then(async (data) => {
        alert(`Success: ${data.razorpay_payment_id}`);
        const verificationResponse = await apiCaller.post('/api/subscription/verify', {
          razorpay_order_id: razorpayResult.razorpay_order_id,
          razorpay_payment_id: razorpayResult.razorpay_payment_id,
          razorpay_signature: razorpayResult.razorpay_signature
        });

        if (verificationResponse.data.success) {
          Alert.alert("Success", "Payment successful and verified!");
        } else {
          Alert.alert("Error", "Payment verification failed.");
        }
      }).catch((error) => {
        // handle failure
        alert(`Error: ${error.code} | ${error.description}`);
      });

    } catch (error) {
      console.error("Error in subscription process:", error);
      Alert.alert("Error", "An error occurred during the subscription process. Please try again.");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.featuresContainer}>
        <Text style={styles.sectionTitle}>Key Features:</Text>
        <FlatList
          data={keyFeatures}
          renderItem={renderFeature}
          keyExtractor={(item, index) => index.toString()}
        />
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
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAF9F6",
    padding: 16,
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
  featureItem: {
    marginBottom: 10,
  },
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
