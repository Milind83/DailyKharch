import React, { useState, useEffect } from 'react';
import { View, Button, Text,StyleSheet } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import PaymentModal from '@/components/Screens/PaymentModal';

const ScanPay: React.FC = () => {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState(false);  
  const [qrCodeValue, setQrCodeValue] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState<boolean>(false);

  useEffect(() => {
    const getBarCodeScannerPermissions = async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    };

    getBarCodeScannerPermissions();
  }, []);

  const handleBarCodeScanned = ({ type, data }: { type: string, data: string }) => {
    setScanned(true);
    setQrCodeValue(data);
    setModalVisible(true);
  };

  if (hasPermission === null) {
    return <Text>Requesting for camera permission...</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={styles.container}>
      <View style={styles.scannerContainer}>
        <BarCodeScanner
          onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
          style={StyleSheet.absoluteFillObject}
        />
      </View>

      {scanned && (
        <Button
          title={'Tap to Scan Again'}
          onPress={() => {
            setScanned(false);
            setQrCodeValue(null);
            setModalVisible(false);
          }}
        />
      )}

      <PaymentModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        qrCodeValue={qrCodeValue}
      />
    </View>
  );
};

export default ScanPay;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  scannerContainer: {
    width: '100%',
    height: '60%',
  },
});
