import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { COLORS } from '@/utils/constants';
import { useAppStore } from '@/store/useAppStore';

// Simulated BLE devices
const MOCK_BLE_DEVICES = [
  { id: '1', name: 'RezzoniX Bio-Sensor X1' },
  { id: '2', name: 'RezzoniX Pro Scanner' },
  { id: '3', name: 'RezzoniX Analyzer V2' },
];

export default function SensorScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { setSensor } = useAppStore();
  const [selectedType, setSelectedType] = useState<'BLE' | 'USB' | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [devices, setDevices] = useState<any[]>([]);
  const [selectedDevice, setSelectedDevice] = useState<any>(null);

  const handleScan = () => {
    if (selectedType === 'BLE') {
      setIsScanning(true);
      setDevices([]);

      // Simulate scanning
      setTimeout(() => {
        setDevices(MOCK_BLE_DEVICES);
        setIsScanning(false);
      }, 2000);
    } else if (selectedType === 'USB') {
      // Simulate USB detection
      setDevices([{ id: 'usb1', name: 'USB OTG Sensor' }]);
    }
  };

  const handleConnect = () => {
    if (!selectedDevice) {
      Alert.alert(t('common.error'), t('sensor.errorSelect'));
      return;
    }

    setSensor(selectedType!, selectedDevice.name);
    router.push('/scan');
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={[COLORS.background, COLORS.backgroundLight]}
        style={styles.gradient}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <Text style={styles.title}>{t('sensor.title')}</Text>
            <Text style={styles.subtitle}>{t('sensor.subtitle')}</Text>
          </View>

          {/* Sensor Type Selection */}
          <View style={styles.typeSelection}>
            <TouchableOpacity
              style={[
                styles.typeCard,
                selectedType === 'BLE' && styles.typeCardSelected,
              ]}
              onPress={() => {
                setSelectedType('BLE');
                setDevices([]);
                setSelectedDevice(null);
              }}
            >
              <Ionicons
                name="bluetooth"
                size={32}
                color={selectedType === 'BLE' ? COLORS.primary : COLORS.textSecondary}
              />
              <Text
                style={[
                  styles.typeTitle,
                  selectedType === 'BLE' && styles.typeTitleSelected,
                ]}
              >
                {t('sensor.ble')}
              </Text>
              <Text style={styles.typeSubtitle}>{t('sensor.bleSubtitle')}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.typeCard,
                selectedType === 'USB' && styles.typeCardSelected,
              ]}
              onPress={() => {
                setSelectedType('USB');
                setDevices([]);
                setSelectedDevice(null);
              }}
            >
              <Ionicons
                name="hardware-chip"
                size={32}
                color={selectedType === 'USB' ? COLORS.primary : COLORS.textSecondary}
              />
              <Text
                style={[
                  styles.typeTitle,
                  selectedType === 'USB' && styles.typeTitleSelected,
                ]}
              >
                {t('sensor.usb')}
              </Text>
              <Text style={styles.typeSubtitle}>{t('sensor.usbSubtitle')}</Text>
            </TouchableOpacity>
          </View>

          {/* Scan/Connect Section */}
          {selectedType && (
            <Card style={styles.card}>
              {devices.length === 0 && !isScanning && (
                <View style={styles.emptyState}>
                  <Ionicons name="search" size={48} color={COLORS.textSecondary} />
                  <Text style={styles.emptyText}>
                    {selectedType === 'BLE'
                      ? t('sensor.noDevices')
                      : 'USB cihazı aramak için tıklayın'}
                  </Text>
                </View>
              )}

              {isScanning && (
                <View style={styles.scanningState}>
                  <Ionicons name="radio" size={48} color={COLORS.primary} />
                  <Text style={styles.scanningText}>{t('sensor.scanning')}</Text>
                </View>
              )}

              {devices.length > 0 && (
                <View style={styles.deviceList}>
                  <Text style={styles.deviceListTitle}>
                    {devices.length} cihaz bulundu
                  </Text>
                  {devices.map((device) => (
                    <TouchableOpacity
                      key={device.id}
                      style={[
                        styles.deviceItem,
                        selectedDevice?.id === device.id && styles.deviceItemSelected,
                      ]}
                      onPress={() => setSelectedDevice(device)}
                    >
                      <Ionicons
                        name={
                          selectedType === 'BLE' ? 'bluetooth' : 'hardware-chip'
                        }
                        size={24}
                        color={
                          selectedDevice?.id === device.id
                            ? COLORS.primary
                            : COLORS.textSecondary
                        }
                      />
                      <View style={styles.deviceInfo}>
                        <Text
                          style={[
                            styles.deviceName,
                            selectedDevice?.id === device.id &&
                              styles.deviceNameSelected,
                          ]}
                        >
                          {device.name}
                        </Text>
                        <Text style={styles.deviceId}>ID: {device.id}</Text>
                      </View>
                      {selectedDevice?.id === device.id && (
                        <Ionicons
                          name="checkmark-circle"
                          size={24}
                          color={COLORS.success}
                        />
                      )}
                    </TouchableOpacity>
                  ))}
                </View>
              )}

              <View style={styles.cardButtons}>
                {!isScanning && devices.length === 0 && (
                  <Button
                    title={t('sensor.scan')}
                    onPress={handleScan}
                    icon={<Ionicons name="search" size={20} color={COLORS.text} />}
                  />
                )}
                {devices.length > 0 && (
                  <>
                    <Button
                      title={t('sensor.scan')}
                      onPress={handleScan}
                      variant="outline"
                    />
                    <Button
                      title={t('sensor.startScan')}
                      onPress={handleConnect}
                      disabled={!selectedDevice}
                    />
                  </>
                )}
              </View>
            </Card>
          )}

          <Button
            title={t('sensor.back')}
            onPress={() => router.back()}
            variant="outline"
          />
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  gradient: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    gap: 24,
  },
  header: {
    marginBottom: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.text,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: 8,
  },
  typeSelection: {
    flexDirection: 'row',
    gap: 12,
  },
  typeCard: {
    flex: 1,
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 20,
    borderWidth: 2,
    borderColor: COLORS.border,
    alignItems: 'center',
  },
  typeCardSelected: {
    borderColor: COLORS.primary,
    backgroundColor: `${COLORS.primary}15`,
  },
  typeTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.textSecondary,
    marginTop: 12,
  },
  typeTitleSelected: {
    color: COLORS.primary,
  },
  typeSubtitle: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 4,
    textAlign: 'center',
  },
  card: {},
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: 16,
    textAlign: 'center',
  },
  scanningState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  scanningText: {
    fontSize: 16,
    color: COLORS.primary,
    marginTop: 16,
    fontWeight: '600',
  },
  deviceList: {
    gap: 12,
  },
  deviceListTitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 8,
  },
  deviceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.backgroundLight,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: 12,
  },
  deviceItemSelected: {
    borderColor: COLORS.primary,
    backgroundColor: `${COLORS.primary}10`,
  },
  deviceInfo: {
    flex: 1,
  },
  deviceName: {
    fontSize: 16,
    color: COLORS.text,
    fontWeight: '600',
  },
  deviceNameSelected: {
    color: COLORS.primary,
  },
  deviceId: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  cardButtons: {
    marginTop: 20,
    gap: 12,
  },
});
