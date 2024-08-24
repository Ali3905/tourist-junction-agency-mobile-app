import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity
} from "react-native";
import { Colors } from "@/constants/Colors";
import RazorpayCheckout from 'react-native-razorpay';

const keyFeatures = [
  "Priority Support & Technician Assistance",
  "Unlimited Access to All Features",
];

const plans = [
  { name: "Annual Plan", price: 599, displayPrice: "₹ 599 / Yearly" },
];

let razorpayKeyId = "rzp_test_wG7GhVLcZ7CSBf"
let razorpayKeySecret = "Wl7e9nI1xJ6WdE5QBTtiW2NB"

const currency = "INR";

const PlansScreen: React.FC = () => {
  const [selectedPlan, setSelectedPlan] = useState<typeof plans[0] | null>(null);

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
        onPress={() => {
          if (!selectedPlan) return;

          var options = {
            description: 'Annual Subscription',
            image: 'https://i.imgur.com/3g7nmJC.png',
            currency: currency,
            key: razorpayKeyId,
            amount: selectedPlan.price * 100, 
            name: 'Annual Plan Subscription',
            order_id:"",
            prefill: {
              email: 'xyz@gmail.com',
              contact: '9999999999',
              name: 'User 1'
            },
            theme: { color: '#F37254' }
          }
          RazorpayCheckout.open(options).then((data) => {
            alert(`Success: ${data.razorpay_payment_id}`);
          }).catch((error) => {
            console.log(error);
            alert(`Error: ${error.code} | ${error.description}`);
          });
        }}
      >
        <Text style={styles.continueButtonText}>Continue</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 16,
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
