import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useGlobalContext } from "@/context/GlobalProvider";
import { Colors } from "@/constants/Colors";
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';

const formatDate = (dateString: string) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit'
  });
};

const formatTime = (timeString: string) => {
  if (!timeString) return '';
  const date = new Date(timeString);
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });
};

const InvoiceScreen: React.FC = () => {
  const { invoiceData } = useGlobalContext();

  const createAndDownloadPDF = async () => {
    if (!invoiceData) return;

    const htmlContent = `
    <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no" />
      <style>
        body { font-family: 'Helvetica'; padding: 20px; margin: 0; }
        .title { font-size: 24px; font-weight: bold; text-align: left; margin-bottom: 10px; }
        .container { background-color: #4994f5; color: white; padding: 10px; margin-bottom: 20px; padding-top: 30px; padding-bottom: 30px }
        .container-header { display: flex; justify-content: space-between; align-items: flex-start; }
        .company-info { text-align: right; margin-top: 50px }
        .company-name { font-size: 38px; font-weight: bold; margin-bottom: 10px }
        .company-address { font-size: 18px; }
        .booking-date { text-align: right; margin-top: 10px; font-size: 18px; }
        table { width: 100%; border-collapse: collapse; }
        th, td { padding: 8px; text-align: left; border: 1px solid #ddd; }
        th { background-color: #f2f2f2; font-weight: bold; }
        .page-break { page-break-after: always; }
        .terms-header { display: flex; flex-direction: column; gap: 50px; margin-bottom: 50px; margin-top: 20px; padding-top: 50px }
        .terms-title { font-size: 20px; font-weight: bold; margin: 20px 0; }
        ul { padding-left: 20px; margin: 0; }
        li { margin-bottom: 5px; }
        li:last-child { margin-bottom: 0; }
        .tourist-wheel { color: #83c4f2; font-size: 22px; margin-top: 10px }
        .tourist-block { height: 50px }
        @page { size: A4; margin: 0; }
        @media print { body { width: 210mm; height: 297mm; } }
      </style>
    </head>
    <body>
      <div class="title">Invoice</div>
      <div class="container">
        <div class="container-header">
          <div>Invoice ID: ${invoiceData.invoiceId}</div>
          <div class="company-info">
            <div class="company-name">Tusharraj Travel</div>
            <div class="company-address">
              8669124213, Opposite to SP office, Osmanabad
            </div>
          </div>
        </div>
        <div class="booking-date">Booking Date: ${formatDate(invoiceData.createdAt)}</div>
      </div>
      <table>
        <tr><th>Customer Name</th><td>${invoiceData.customerName}</td></tr>
        <tr><th>Mobile Number</th><td>${invoiceData.mobileNumber}</td></tr>
        <tr><th>Alternate Number</th><td>${invoiceData.alternateNumber}</td></tr>
        <tr><th>Vehicle Number</th><td>${invoiceData.vehicle ? invoiceData.vehicle.number : ""}</td></tr>
        <tr><th>Other Vehicle Number</th><td>${invoiceData.otherVehicle ? invoiceData.otherVehicle.number : ""}</td></tr>
        <tr><th>KM Starting</th><td>${invoiceData.kmStarting}</td></tr>
        <tr><th>Rate per KM</th><td>${invoiceData.perKmRateInINR}</td></tr>
        <tr><th>Advance Amount</th><td>${invoiceData.advanceAmountInINR}</td></tr>
        <tr><th>Remaining Amount</th><td>${invoiceData.remainingAmountInINR}</td></tr>
        <tr><th>Advance Place</th><td>${invoiceData.advancePlace}</td></tr>
        <tr><th>Departure Place</th><td>${invoiceData.departurePlace}</td></tr>
        <tr><th>Destination Place</th><td>${invoiceData.destinationPlace}</td></tr>
        <tr><th>Departure Date</th><td>${formatDate(invoiceData.departureDate)}</td></tr>
        <tr><th>Departure Time</th><td>${formatTime(invoiceData.departureTime)}</td></tr>
        <tr><th>Return Date</th><td>${formatDate(invoiceData.returnDate)}</td></tr>
        <tr><th>Return Time</th><td>${formatTime(invoiceData.returnTime)}</td></tr>
        <tr><th>Toll</th><td>${invoiceData.tollInINR}</td></tr>
        <tr><th>Other State Tax</th><td>${invoiceData.otherStateTaxInINR}</td></tr>
        <tr><th>Note</th><td>${invoiceData.note}</td></tr>
        <tr><th>Booked By</th><td>${invoiceData.createdBy}</td></tr>
      </table>

      <div class="page-break"></div>
    
      <div class="terms-header">
        <div>${invoiceData.customerName}</div>
        <div>Tusharraj Travel</div>
      </div>

      <div class="terms-title">Terms and Conditions</div>
    
      <ul>
        <li>The Booking will not be cancelled for any reason and the advance amount paid will not be refunded</li>
        <li>Full Payment is mandatory before departure for the trip.</li>
        <li>If you Cause damage to the vehicle, you will have to pay compensation for it.</li>
        <li>Driver meal will remain with the party.</li>
        <li>Tap, TV, Sound cannot be guaranteed.</li>
        <li>In case of emergency, the vehicle route will be change.</li>
        <li>Vehicle Kilometers will be taken form office to office.</li>
        <li>Sometimes Problem may arise in the vehicle;passengers will have to be patient.</li>
        <li>The travel company is not responsible or takes any responsibility for any kind of personal or finacial loss.</li>
      </ul>
    
      <div class="tourist-wheel">Tourist Wheel</div>
    </body>
    </html>
  `;

    try {
      console.log('Generating PDF...');
      const { uri } = await Print.printToFileAsync({ html: htmlContent });
      if (!uri) {
        throw new Error('Failed to generate PDF');
      }
      console.log('PDF generated at:', uri);

      const pdfName = `Invoice_${invoiceData._id}.pdf`;
      const pdfDir = `${FileSystem.documentDirectory}PDFs/`;
      const pdfUri = `${pdfDir}${pdfName}`;

      console.log('Creating directory...');
      await FileSystem.makeDirectoryAsync(pdfDir, { intermediates: true });

      console.log('Copying file...');
      await FileSystem.copyAsync({
        from: uri,
        to: pdfUri
      });

      console.log('File saved at:', pdfUri);

      Alert.alert(
        "PDF Saved",
        `The invoice has been saved as ${pdfName} in your app's documents folder.`,
        [
          { text: "OK" },
          {
            text: "Share",
            onPress: () => sharePDF(pdfUri)
          }
        ]
      );
    } catch (error) {
      console.error('Error in createAndDownloadPDF:', error);
      Alert.alert("Error", "Failed to generate or save PDF");
    }
  };

  const sharePDF = async (fileUri: string) => {
    try {
      if (!(await Sharing.isAvailableAsync())) {
        Alert.alert("Sharing isn't available on your platform");
        return;
      }
      await Sharing.shareAsync(fileUri);
    } catch (error) {
      console.error('Error in sharePDF:', error);
      Alert.alert("Error", "Failed to share PDF");
    }
  };

  if (!invoiceData) {
    return (
      <View style={styles.centered}>
        <Text>No invoice found.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.row}>
        <Text style={styles.label}>Invoice ID:</Text>
        <Text style={styles.value}>{invoiceData.invoiceId}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Customer Name:</Text>
        <Text style={styles.value}>{invoiceData.customerName}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Mobile Number:</Text>
        <Text style={styles.value}>{invoiceData.mobileNumber}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Alternate Number:</Text>
        <Text style={styles.value}>{invoiceData.alternateNumber}</Text>
      </View>
      {invoiceData.vehicle &&
        <View style={styles.row}>
          <Text style={styles.label}>Vehicle Number:</Text>
          <Text style={styles.value}>{invoiceData.vehicle.number}</Text>
        </View>
      }
      {invoiceData.otherVehicle &&
        <View style={styles.row}>
          <Text style={styles.label}>Other Vehicle Number:</Text>
          <Text style={styles.value}>{invoiceData.otherVehicle.number}</Text>
        </View>
      }
      <View style={styles.row}>
        <Text style={styles.label}>KM Starting:</Text>
        <Text style={styles.value}>{invoiceData.kmStarting}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Rate per KM:</Text>
        <Text style={styles.value}>{invoiceData.perKmRateInINR}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Advance Amount:</Text>
        <Text style={styles.value}>{invoiceData.advanceAmountInINR}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Remaining Amount:</Text>
        <Text style={styles.value}>{invoiceData.remainingAmountInINR}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Advance Place:</Text>
        <Text style={styles.value}>{invoiceData.advancePlace}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Departure Place:</Text>
        <Text style={styles.value}>{invoiceData.departurePlace}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Destination Place:</Text>
        <Text style={styles.value}>{invoiceData.destinationPlace}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Departure Time:</Text>
        <Text style={styles.value}>{formatTime(invoiceData.departureTime)}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Return Time:</Text>
        <Text style={styles.value}>{formatTime(invoiceData.returnTime)}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Toll:</Text>
        <Text style={styles.value}>{invoiceData.tollInINR}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Other State Tax:</Text>
        <Text style={styles.value}>{invoiceData.otherStateTaxInINR}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Note:</Text>
        <Text style={styles.value}>{invoiceData.note}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Created At:</Text>
        <Text style={styles.value}>{formatDate(invoiceData.createdAt)}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Updated At:</Text>
        <Text style={styles.value}>{formatDate(invoiceData.updatedAt)}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Status:</Text>
        <Text style={styles.value}>{invoiceData.status}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Departure Date:</Text>
        <Text style={styles.value}>{formatDate(invoiceData.departureDate)}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Return Date:</Text>
        <Text style={styles.value}>{formatDate(invoiceData.returnDate)}</Text>
      </View>
      <TouchableOpacity style={styles.downloadButton} onPress={createAndDownloadPDF}>
        <Text style={styles.downloadButtonText}>Download PDF</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#ffffff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  label: {
    fontWeight: "bold",
    fontSize: 16,
    color: Colors.darkBlue,
  },
  value: {
    fontSize: 16,
    color: Colors.secondary,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  downloadButton: {
    marginTop: 20,
    backgroundColor: Colors.primary,
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    marginBottom: 50
  },
  downloadButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default InvoiceScreen;