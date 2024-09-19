import React, { useState } from 'react';
import { Modal, View, Text, Button, StyleSheet, TextInput, Alert, Linking } from 'react-native';

interface PaymentModalProps {
  visible: boolean;
  onClose: () => void;
  qrCodeValue: string | null;
}

const PaymentModal: React.FC<PaymentModalProps> = ({ visible, onClose, qrCodeValue }) => {
  const [amount, setAmount] = useState<string>('');
  const [personAddress, setPersonAddress] = useState<string>('');
  const [personName, setPersonName] = useState<string>('');

  // Function to parse QR code URL and extract 'pa' and 'pn' values
  const parseQrCodeValue = (qrValue: string) => {
    try {
      const url = new URL(qrValue);
      const params = new URLSearchParams(url.search);
      setPersonAddress(params.get('pa') || '');
      setPersonName(params.get('pn') || '');
    } catch (error) {
      console.error('Error parsing QR code value:', error);
      Alert.alert('Error', 'Failed to parse QR code.');
    }
  };

  // Call parseQrCodeValue when qrCodeValue is updated
  React.useEffect(() => {
    if (qrCodeValue) {
      parseQrCodeValue(qrCodeValue);
    }
  }, [qrCodeValue]);

  const handlePayment = () => {
    if (!amount || !personAddress) {
      Alert.alert('Error', 'Please enter the amount and scan a QR code.');
      return;
    }

    // Construct the payment URL
    const url = `upi://pay?pa=${personAddress}&pn=${personName}&am=${amount}&cu=INR`;

    Linking.openURL(url)
      .catch(() => {
        Alert.alert('Error', 'Failed to open the payment app.');
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
