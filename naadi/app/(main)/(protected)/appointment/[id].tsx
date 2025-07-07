import { Appointment, EstablishmentData } from '@naadi/types';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking, Image } from 'react-native';
import { useLocalSearchParams, useNavigation, router } from 'expo-router';
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

// Mock data - in a real app, you'd fetch this based on the id
import { appointments } from '@naadi/assets/data/appointments';
import { venues } from '@naadi/assets/data/venues';

interface ActionButtonProps {
  icon: string;
  iconFamily?: 'Ionicons' | 'FontAwesome';
  title: string;
  subtitle: string;
  onPress?: () => void;
  disabled?: boolean;
}

const AppointmentDetail = () => {
  const navigation = useNavigation();
  const { id } = useLocalSearchParams<{ id: string }>();

  // Find the appointment and venue
  const appointment = appointments.find(a => a.id === id);
  const venue = venues.find(v => v.id === id);

  if (!appointment || !venue) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <Text>Appointment not found.</Text>
        </View>
      </SafeAreaView>
    );
  }

  const handleAddToCalendar = () => {
    const start = `${appointment.date}T10:00:00`; // Assuming 10:00 AM for now
    const end = `${appointment.date}T11:00:00`; // Assuming 1 hour duration
    const details = [
      `action=TEMPLATE`,
      `text=${encodeURIComponent(appointment.venue + ' - ' + appointment.service)}`,
      `dates=${start.replace(/[-:]/g, '')}Z/${end.replace(/[-:]/g, '')}Z`,
      `details=${encodeURIComponent(appointment.service)}`,
      `location=${encodeURIComponent(appointment.address)}`
    ].join('&');
    const url = `https://www.google.com/calendar/render?${details}`;
    Linking.openURL(url);
  };

  const handleGetDirections = () => {
    const lat = appointment.coordinate.latitude;
    const lng = appointment.coordinate.longitude;
    const url = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
    Linking.openURL(url);
  };

  const getStatusAttributes = (status: Appointment['status']) => {
    switch (status) {
      case 'Confirmed':
        return { color: '#56baf0', icon: 'checkmark-circle' as const };
      case 'Completed':
        return { color: '#56bf56', icon: 'checkmark-circle' as const };
      case 'Cancelled':
        return { color: '#e82337', icon: 'close-circle' as const };
      default:
        return { color: '#e0e0e0', icon: 'help-circle' as const };
    }
  };

  const statusAttributes = getStatusAttributes(appointment.status);

  const ActionButton = ({ icon, iconFamily = 'Ionicons', title, subtitle, onPress, disabled }: ActionButtonProps) => (
    <TouchableOpacity style={styles.actionButton} onPress={onPress} disabled={disabled}>
      <View style={[styles.actionButtonIcon, disabled && { backgroundColor: '#f0f0f0' }]}>
        {iconFamily === 'FontAwesome' ? (
          <FontAwesome name={icon as any} size={24} color={disabled ? '#ccc' : '#3674B5'} />
        ) : (
          <Ionicons name={icon as any} size={24} color={disabled ? '#ccc' : '#3674B5'} />
        )}
      </View>
      <View style={styles.actionButtonTextContainer}>
        <Text style={[styles.actionButtonText, disabled && { color: '#ccc' }]}>{title}</Text>
        <Text style={[styles.actionButtonSubtitle, disabled && { color: '#ccc' }]}>{subtitle}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom', 'left', 'right']}>
      <ScrollView style={styles.container} contentContainerStyle={{ flexGrow: 1 }} bounces={true}>
        {/* Header with Image */}
        <View style={styles.headerImageContainer}>
          {venue.images && venue.images.length > 0 ? (
            <Image source={{ uri: venue.images[0] }} style={styles.headerImage} />
          ) : (
            <View style={[styles.headerImage, { backgroundColor: '#f0f0f0' }]} />
          )}
          <View style={styles.headerOverlay}>
            <TouchableOpacity onPress={() => router.replace('/appointments')} style={styles.backButton}>
              <Ionicons name="arrow-back" size={24} color="black" />
            </TouchableOpacity>
            <Text style={styles.venueName}>{appointment.venue}</Text>
          </View>
        </View>

        <View style={styles.contentContainer}>
          {/* Status and Date Section */}
          <View style={[styles.statusContainer, { backgroundColor: statusAttributes.color }]}>
            <Ionicons name={statusAttributes.icon} size={20} color="#fff" />
            <Text style={styles.statusText}>{appointment.status}</Text>
          </View>

          <Text style={styles.dateTimeText}>
            {new Date(appointment.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })} at {appointment.time}
          </Text>
          <Text style={styles.durationText}>{appointment.duration} duration</Text>

          {/* Action Buttons */}
          <View style={styles.actionButtonsContainer}>
            <ActionButton icon="calendar-plus-o" iconFamily="FontAwesome" title="Add to calendar" subtitle="Set yourself a reminder" onPress={handleAddToCalendar}/>
            <ActionButton icon="navigate" title="Getting there" subtitle={appointment.address} onPress={handleGetDirections} />
            <ActionButton icon="create" title="Manage appointment" subtitle="Reschedule or cancel your appointment" disabled />
            <ActionButton icon="business-outline" title="Venue details" subtitle={appointment.venue} disabled />
          </View>

          {/* Overview Section */}
          <View style={styles.overviewSection}>
            <Text style={styles.sectionTitle}>Overview</Text>
            <View style={styles.overviewItem}>
              <Text style={styles.overviewItemText}>{appointment.service}</Text>
              <Text style={styles.overviewItemText}>{appointment.price === '0' ? 'free' : appointment.price}</Text>
            </View>
            <View style={styles.overviewItem}>
              <Text style={styles.overviewItemText}>{appointment.duration} Package</Text>
            </View>
            <View style={[styles.overviewItem, styles.totalItem]}>
              <Text style={styles.totalText}>Total</Text>
              <Text style={styles.totalText}>{appointment.price === '0' ? 'free' : appointment.price}</Text>
            </View>
          </View>         
          {/* Cancellation Policy Section */}
          <View style={styles.cancellationSection}>
            <Text style={styles.sectionTitle}>Cancellation policy</Text>
            <Text style={styles.cancellationText}>{venue.cancellationPolicy}</Text>
            {appointment.bookingRef && <Text style={styles.bookingRef}>Booking ref: {appointment.bookingRef}</Text>}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
    height: '100%',
  },
  container: {
    backgroundColor: '#f8f8f8',
  },
  headerImageContainer: {
    height: 300, // Changed from percentage to a fixed value
    position: 'relative',
  },
  headerImage: {
    width: '100%',
    height: '100%',
  },
  headerOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'space-between',
    padding: 20,
  },
  backButton: {
    position: 'absolute',
    top: 70, // Adjusted for safe area
    left: 20,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 8,
  },
  venueName: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 30,
  },
  contentContainer: {
    padding: 20,
    backgroundColor: '#fff',
    marginTop: -20, // Pulls the content up over the image
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#8A2BE2',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 15,
    alignSelf: 'flex-start',
    marginBottom: 15,
  },
  statusText: {
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 8,
    fontSize: 16,
  },
  dateTimeText: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#111',
  },
  durationText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 25,
    marginTop: 5,
  },
  actionButtonsContainer: {
    marginBottom: 20,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
  },
  actionButtonIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#eef4ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  actionButtonTextContainer: {
    flex: 1,
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111',
  },
  actionButtonSubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  overviewSection: {
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  overviewItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  overviewItemText: {
    fontSize: 16,
    color: '#333',
  },
  totalItem: {
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    marginTop: 10,
    paddingTop: 15,
  },
  totalText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111',
  },
  formsSection: {
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    marginTop: 20,
  },
  formItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  }, 
  cancellationSection: {
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  cancellationText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  bookingRef: {
      marginTop: 10,
      fontSize: 14,
      color: '#666',
  }
});

export default AppointmentDetail;
