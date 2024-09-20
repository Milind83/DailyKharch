import React, { useState, useEffect } from 'react';
import { Modal, View, Text, Button, StyleSheet, TextInput, Alert, Linking } from 'react-native';

interface PaymentModalProps {
  visible: boolean;
  onClose: () => void;
  qrCodeValue: string | null;
}

const MAX_UPI_AMOUNT = 100000; // Maximum amount per transaction
const MAX_UPI_DAILY_AMOUNT = 100000; // Maximum amount per day
const MAX_UPI_TRANSACTIONS = 10; // Maximum transactions per day

const PaymentModal: React.FC<PaymentModalProps> = ({ visible, onClose, qrCodeValue }) => {
  const [amount, setAmount] = useState<string>('');
  const [personAddress, setPersonAddress] = useState<string>('');
  const [personName, setPersonName] = useState<string>('');
  const [aid, setAid] = useState<string>('');
  const [paymentNote, setPaymentNote] = useState<string>('');
  const [transactionsToday, setTransactionsToday] = useState<number>(0);
  const [totalAmountToday, setTotalAmountToday] = useState<number>(0);

  // Function to parse QR code URL and extract 'pa' and 'pn' values
  const parseQrCodeValue = (qrValue: string) => {
    try {
      const url = new URL(qrValue);
      const params = new URLSearchParams(url.search);
      setPersonAddress(params.get('pa') || '');
      setPersonName(params.get('pn') || '');
      setAid(params.get('aid') || '');
    } catch (error) {
      console.error('Error parsing QR code value:', error);
      Alert.alert('Error', 'Failed to parse QR code.');
    }
  };

  // Call parseQrCodeValue when qrCodeValue is updated
  useEffect(() => {
    if (qrCodeValue) {
      parseQrCodeValue(qrCodeValue);
    }
  }, [qrCodeValue]);

  const handlePayment = () => {
    const amountNumber = parseFloat(amount);

    if (!amount || !personAddress) {
      Alert.alert('Error', 'Please enter the amount and scan a QR code.');
      return;
    }

    if (isNaN(amountNumber) || amountNumber <= 0) {
      Alert.alert('Error', 'Please enter a valid amount.');
      return;
    }

    if (amountNumber > MAX_UPI_AMOUNT) {
      Alert.alert('Error', `The amount exceeds the maximum limit of ₹${MAX_UPI_AMOUNT}.`);
      return;
    }

    if (transactionsToday >= MAX_UPI_TRANSACTIONS) {
      Alert.alert('Error', `You have reached the maximum number of UPI transactions (${MAX_UPI_TRANSACTIONS}) for today.`);
      return;
    }

    if (totalAmountToday + amountNumber > MAX_UPI_DAILY_AMOUNT) {
      Alert.alert('Error', `The total amount exceeds the daily limit of ₹${MAX_UPI_DAILY_AMOUNT}.`);
      return;
    }

    // Construct the payment URL
    const url = `upi://pay?pa=${personAddress}&pn=${personName}&am=${amountNumber.toFixed(2)}&cu=INR&aid=${aid}&mode=02&tn=${paymentNote}`;
    console.log("URRRRRRRRRR:::: "+url);
    Linking.openURL(url)
      .then(() => {
        // Update the transaction counters
        setTransactionsToday(transactionsToday + 1);
        setTotalAmountToday(totalAmountToday + amountNumber);
      })
      .catch(() => {
        Alert.alert('Error', 'Failed to open the payment app. Please try again.');
      });
  };

  return (
    <Modal
      transparent={true}
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalBackground}>
        <View style={styles.modalContainer}>
          <Text style={styles.title}>Payment Details</Text>
          
          <TextInput
            style={styles.input}
            placeholder="Enter Amount"
            keyboardType="numeric"
            value={amount}
            onChangeText={setAmount}
          />
          <TextInput
            style={styles.input}
            placeholder="Note"
            value={paymentNote} // Payment note input
            onChangeText={setPaymentNote}
          />

          <Button title="Pay" onPress={handlePayment} />
          <Button title="Cancel" onPress={onClose} color="red" />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContainer: {
    width: '80%',
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    marginBottom: 15,
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    marginBottom: 15,
  },
});

export default PaymentModal;
