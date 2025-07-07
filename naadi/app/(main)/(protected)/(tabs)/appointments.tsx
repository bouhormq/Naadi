import { View, Text, TouchableOpacity, StyleSheet, Dimensions, ScrollView, Linking, Platform, SafeAreaView } from 'react-native';
import React, { useRef } from 'react';
import { useNavigation } from '@react-navigation/native';
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import { useSession } from '@naadi/hooks/ctx';
import { venues } from '@naadi/assets/data/venues'; // Adjust path if needed
import MapViewComponent from '../(components)/(search)/MapViewComponent';
import { appointments } from '@naadi/assets/data/appointments';

const { width } = Dimensions.get('window');

const Appointments = () => {
  const navigation = useNavigation();
  const { session } = useSession();
  const mapRef = useRef(null);

  // Use imported appointments from shared data file
  const mockAppointments = appointments;

  // Helper to get end datetime
  function getEndDateTime(date: string, time: string, duration: string) {
    // time: '10:00 AM', duration: '1 hr' or '2 hr'
    const [hourMin, ampm] = time.split(' ');
    let [hour, min] = hourMin.split(':').map(Number);
    if (ampm === 'PM' && hour !== 12) hour += 12;
    if (ampm === 'AM' && hour === 12) hour = 0;
    let durHrs = parseInt(duration);
    let durMins = duration.includes('30') ? 30 : 0;
    const start = new Date(`${date}T${hour.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}:00`);
    return new Date(start.getTime() + durHrs * 60 * 60 * 1000 + durMins * 60 * 1000);
  }

  // Categorise based on current date
  const now = new Date();
  const upcoming = mockAppointments.filter(a => getEndDateTime(a.date, a.time, a.duration) > now);
  const past = mockAppointments.filter(a => getEndDateTime(a.date, a.time, a.duration) <= now);

  // AppointmentList component
  const AppointmentList: React.FC = () => {
    // Use the categorised arrays from above
    if (upcoming.length === 0 && past.length === 0) {
      return (
        <View style={styles.card}>
          <View style={styles.iconContainer}>
            <Ionicons name="calendar-outline" size={40} color="#3674B5" />
          </View>
          <Text style={styles.noAppointments}>No appointments</Text>
          <Text style={styles.description}>
            Your upcoming and past appointments will appear when you book
          </Text>
          <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('search' as never)}>
            <Text style={styles.buttonText}>Search Activities</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <View style={{ width: '100%', marginTop: 24 }}>
        {/* Upcoming section */}
        <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 24, marginBottom: 8 }}>
          <Text style={{ fontSize: 20, fontWeight: '700' }}>Upcoming</Text>
          <View style={{
            backgroundColor: '#3674B5',
            borderRadius: 10,
            width: 20,
            height: 20,
            alignItems: 'center',
            justifyContent: 'center',
            marginLeft: 6,
          }}>
            <Text style={{ color: '#fff', fontSize: 12, fontWeight: '700' }}>{upcoming.length}</Text>
          </View>
        </View>
        {upcoming.map((a) => (
          <TouchableOpacity key={a.id} onPress={() => navigation.navigate('appointment/[id]', { id: a.id })}>
          <View style={{ backgroundColor: '#fff', borderRadius: 16, marginHorizontal: 16, marginBottom: 20, padding: 0, shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 8, elevation: 2, borderColor: '#E0E0E0', borderWidth: 1, position: 'relative' }}>
            {/* Map Container with pointer events disabled to prevent scroll interference */}
            <View style={{ 
              height: 140, 
              borderTopLeftRadius: 16, 
              borderTopRightRadius: 16, 
              overflow: 'hidden'
            }}>
              <MapViewComponent
                mapRef={mapRef}
                filteredVenues={[{ ...venues.find(v => v.id === a.id) }]}
                animatedY={{ setValue: () => {} }}
                handleCardPress={() => {}}
                region={{
                  latitude: a.coordinate.latitude,
                  longitude: a.coordinate.longitude,
                  latitudeDelta: 0.001, // much more zoomed in
                  longitudeDelta: 0.001,
                }}
                singleVenueMode={true}
                scrollEnabled={false}
                zoomEnabled={false}
                pitchEnabled={false}
                rotateEnabled={false}
                // Add these props to disable all interactions
                pointerEvents="none"
                style={{ pointerEvents: 'none' }}
              />
              {/* Invisible overlay to capture touches and prevent map interaction */}
              <View style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'transparent',
                zIndex: 1
              }} />
            </View>
            <View style={{ padding: 18 }}>
              <Text style={{ fontSize: 18, fontWeight: '700', marginBottom: 2 }}>{a.venue}</Text>
              <Text style={{ color: '#444', marginBottom: 2 }}>{formatDate(a.date)} at {a.time}</Text>
              <Text style={{ color: '#888', marginBottom: 10 }}>{a.duration}  •  {a.price}  •  {a.service}</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                <TouchableOpacity 
                  style={{ borderWidth: 1, borderColor: '#e0e0e0', borderRadius: 22, paddingHorizontal: 22, paddingVertical: 10, backgroundColor: '#fff', marginRight: 8 }}
                  onPress={() => {
                    const lat = a.coordinate.latitude;
                    const lng = a.coordinate.longitude;
                    const url = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
                    Linking.openURL(url);
                  }}
                >
                  <Text style={{ fontWeight: '600', fontSize: 15 }}>Get directions</Text>
                </TouchableOpacity>
              </View>
              {/* Calendar icon absolutely positioned in bottom right */}
              <TouchableOpacity
                style={{ position: 'absolute', bottom: 18, right: 18 }}
                onPress={() => {
                  // Google Calendar event creation link
                  const start = `${a.date}T10:00:00`;
                  const end = `${a.date}T11:00:00`;
                  const details = [
                    `action=TEMPLATE`,
                    `text=${encodeURIComponent(a.venue + ' - ' + a.service)}`,
                    `dates=${start.replace(/[-:]/g, '')}Z/${end.replace(/[-:]/g, '')}Z`,
                    `details=${encodeURIComponent(a.service)}`,
                    `location=${encodeURIComponent(a.address)}`
                  ].join('&');
                  const url = `https://www.google.com/calendar/render?${details}`;
                  Linking.openURL(url);
                }}
              >
                <View style={{ borderWidth: 1, borderColor: '#e0e0e0', borderRadius: 22, paddingHorizontal: 18, paddingVertical: 9, backgroundColor: '#fff', elevation: 2 }}>
                  <FontAwesome name="calendar-plus-o" size={22} color="#222" />
                </View>
              </TouchableOpacity>
            </View>
          </View>
          </TouchableOpacity>
        ))}
        {/* Past section */}
        <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 24, marginBottom: 8 }}>
          <Text style={{ fontSize: 20, fontWeight: '700' }}>Past</Text>
          <View style={{
            backgroundColor: '#E0E0E0',
            borderRadius: 10,
            width: 20,
            height: 20,
            alignItems: 'center',
            justifyContent: 'center',
            marginLeft: 6,
          }}>
            <Text style={{ color: '#111', fontSize: 12, fontWeight: '700' }}>{past.length}</Text>
          </View>
        </View>
        {past.map((a) => (
          <TouchableOpacity key={a.id} onPress={() => navigation.navigate('appointment/[id]', { id: a.id } as never)}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginHorizontal: 16, marginBottom: 18, backgroundColor: '#fff', borderRadius: 14, padding: 10, elevation: 1 }}>
            <View style={{ width: 54, height: 54, borderRadius: 12, backgroundColor: '#f3f3f3', marginRight: 12, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
              <Ionicons name="image-outline" size={28} color="#bbb" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontWeight: '700', fontSize: 16 }} numberOfLines={1}>{a.venue}</Text>
              <Text style={{ color: '#444', fontSize: 14 }} numberOfLines={1}>{formatDate(a.date)} at {a.time}</Text>
              <Text style={{ color: '#888', fontSize: 13 }} numberOfLines={1}>{a.price}  •  1 item  •  {a.status || 'Completed'}</Text>
            </View>
            <TouchableOpacity style={{ borderWidth: 1, borderColor: '#e0e0e0', borderRadius: 22, paddingHorizontal: 18, paddingVertical: 8, backgroundColor: '#fff', marginLeft: 8 }}>
              <Text style={{ fontWeight: '600', fontSize: 15 }}>Book again</Text>
            </TouchableOpacity>
          </View>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  // Helper to format date
  function formatDate(dateStr: string) {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <ScrollView 
          style={{ width: '100%' }} 
          contentContainerStyle={{ paddingBottom: 40 }} 
          showsVerticalScrollIndicator={false}
          // Add these props to improve scroll behavior
          bounces={true}
          scrollEventThrottle={16}
        >
          {Platform.OS !== 'web' && (
            <View style={styles.header}>
              <Text style={styles.headerText}>Appointments</Text>
              <TouchableOpacity onPress={() => navigation.navigate('profile' as never)}>
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>{session?.firstName?.charAt(0)}{session?.lastName?.charAt(0)}</Text>
                </View>
              </TouchableOpacity>
            </View>
          )}
          <AppointmentList />
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  header: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    position: 'relative',
    height: 60,
  },
  headerText: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#EFEFEF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111',
    marginBottom: 20, // Space below title
  },
  card: {
    width: width - 32,
    backgroundColor: '#fff',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    alignItems: 'center',
    justifyContent: 'center', // Center vertically
    paddingVertical: 40,
    elevation: 2,
    alignSelf: 'center', // Center horizontally
    marginTop: 24, // Add space from top
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
    backgroundColor: '#ede7ff',
  },
  noAppointments: {
    fontSize: 22,
    fontWeight: '700',
    color: '#222',
    marginBottom: 8,
    textAlign: 'center',
  },
  description: {
    fontSize: 15,
    color: '#888',
    marginBottom: 28,
    textAlign: 'center',
    paddingHorizontal: 16,
  },
  button: {
    backgroundColor: '#fff',
    borderColor: '#E0E0E0',
    borderWidth: 1,
    borderRadius: 24,
    paddingHorizontal: 32,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 1,
  },
  buttonText: {
    color: '#222',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default Appointments;