import React, { useState, useEffect } from 'react';
import { View, Button, Text, StyleSheet, SafeAreaView } from 'react-native';
import { CameraView,  useCameraPermissions } from 'expo-camera';
import PaymentModal from '@/components/Screens/PaymentModal';

const ScanPay: React.FC = () => {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [qrCodeValue, setQrCodeValue] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState<boolean>(false);

  useEffect(() => {
    if (permission === null) {
      requestPermission();
    }
  }, [permission, requestPermission]);

  const handleBarCodeScanned = ({ type, data }: { type: string, data: string }) => {
    setScanned(true);
    setQrCodeValue(data);
    setModalVisible(true);
  };

  if (permission === null) {
    return <Text>Requesting for camera permission...</Text>;
  }
  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>We need your permission to use the camera</Text>
        <Button onPress={requestPermission} title="Grant Permission" />
      </View>
    );
  }

  return (
    <SafeAreaView style={StyleSheet.absoluteFillObject}>
      <View style={styles.container}>
        <CameraView 
          style={StyleSheet.absoluteFillObject} 
          facing='back' 
          onBarcodeScanned={scanned ? undefined : handleBarCodeScanned} 
        />

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
    </SafeAreaView>
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
  message: {
    textAlign: 'center',
    paddingBottom: 10,
  },
});
