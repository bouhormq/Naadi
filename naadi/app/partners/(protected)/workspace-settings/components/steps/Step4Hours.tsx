import React from 'react';
import { View, TouchableOpacity, Switch, StyleSheet } from 'react-native';
import CustomText from '@/components/CustomText';
import { styles as sharedStyles } from '../../styles';
import { Ionicons } from '@expo/vector-icons';

interface Step4HoursProps {
  openingHours: any[];
  setOpeningHours: (hours: any[]) => void;
}

export default function Step4Hours({ openingHours, setOpeningHours }: Step4HoursProps) {
  const toggleDay = (index: number) => {
    const newHours = [...openingHours];
    newHours[index].isOpen = !newHours[index].isOpen;
    setOpeningHours(newHours);
  };

  const updateTime = (index: number, field: 'open' | 'close', value: string) => {
    const newHours = [...openingHours];
    newHours[index][field] = value;
    setOpeningHours(newHours);
  };

  return (
    <View>
      <CustomText style={styles.stepTitle}>Opening hours</CustomText>
      <CustomText style={styles.stepSubtitle}>
        Set your opening hours for this location. You can customize these later.
      </CustomText>

      <View style={styles.hoursContainer}>
        {openingHours.map((day, index) => (
          <View key={day.day} style={styles.dayRow}>
            <View style={styles.dayLabelContainer}>
              <Switch
                value={day.isOpen}
                onValueChange={() => toggleDay(index)}
                trackColor={{ false: '#e2e8f0', true: '#818cf8' }}
                thumbColor={day.isOpen ? '#4f46e5' : '#f1f5f9'}
              />
              <CustomText style={styles.dayName}>{day.day}</CustomText>
            </View>
            
            {day.isOpen ? (
              <View style={styles.timeInputsContainer}>
                <View style={styles.timeInputWrapper}>
                  <CustomText style={styles.timeText}>{day.open}</CustomText>
                  <Ionicons name="chevron-down" size={12} color="#64748b" />
                </View>
                <CustomText style={styles.toText}>to</CustomText>
                <View style={styles.timeInputWrapper}>
                  <CustomText style={styles.timeText}>{day.close}</CustomText>
                  <Ionicons name="chevron-down" size={12} color="#64748b" />
                </View>
              </View>
            ) : (
              <CustomText style={styles.closedText}>Closed</CustomText>
            )}
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  stepTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 8,
    textAlign: 'center',
  },
  stepSubtitle: {
    fontSize: 16,
    color: '#64748b',
    textAlign: 'center',
    marginBottom: 32,
  },
  hoursContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    overflow: 'hidden',
  },
  dayRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  dayLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 140,
  },
  dayName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1e293b',
    marginLeft: 12,
  },
  timeInputsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    minWidth: 80,
    justifyContent: 'space-between',
  },
  timeText: {
    fontSize: 14,
    color: '#334155',
    fontWeight: '500',
  },
  toText: {
    marginHorizontal: 8,
    color: '#94a3b8',
    fontSize: 14,
  },
  closedText: {
    color: '#94a3b8',
    fontSize: 14,
    fontStyle: 'italic',
    marginRight: 24,
  },
});
