import { View, Text, TouchableOpacity, StyleSheet, Dimensions, ScrollView } from 'react-native';
import React, { useMemo, useRef } from 'react';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useSession } from '../../../../ctx';
import { venues } from '../venues';
import MapViewComponent from '../(components)/(search)/MapViewComponent';

const { width } = Dimensions.get('window');

const Appointments = () => {
  const navigation = useNavigation();
  const { session } = useSession();
  const mapRef = useRef(null);

  // Generate mock appointments from venues
  const mockAppointments = venues.slice(0, 10).map((venue, idx) => ({
    id: venue.id,
    type: idx % 2 === 0 ? 'upcoming' : 'past',
    venue: venue.name,
    date: `2024-09-${24 + idx}`,
    time: '10:00 AM',
    duration: '1 hr',
    price: `${venue.price}MAD`,
    service: venue.activities[0]?.name || 'Service',
    address: venue.address,
    coordinate: venue.coordinate,
    status: idx % 2 === 0 ? undefined : 'Completed',
  }));

  // AppointmentList component
  const AppointmentList: React.FC = () => {
    const upcoming = useMemo(() => mockAppointments.filter(a => a.type === 'upcoming'), []);
    const past = useMemo(() => mockAppointments.filter(a => a.type === 'past'), []);

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
          <View key={a.id} style={{ backgroundColor: '#fff', borderRadius: 16, marginHorizontal: 16, marginBottom: 20, padding: 0, shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 8, elevation: 2, borderColor: '#E0E0E0', borderWidth: 1, position: 'relative' }}>
            <View style={{ height: 140, borderTopLeftRadius: 16, borderTopRightRadius: 16, overflow: 'hidden' }}>
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
              />
            </View>
            <View style={{ padding: 18 }}>
              <Text style={{ fontSize: 18, fontWeight: '700', marginBottom: 2 }}>{a.venue}</Text>
              <Text style={{ color: '#444', marginBottom: 2 }}>{formatDate(a.date)} at {a.time}</Text>
              <Text style={{ color: '#888', marginBottom: 10 }}>{a.duration}  •  {a.price}  •  {a.service}</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                <TouchableOpacity style={{ borderWidth: 1, borderColor: '#e0e0e0', borderRadius: 22, paddingHorizontal: 22, paddingVertical: 10, backgroundColor: '#fff', marginRight: 8 }}>
                  <Text style={{ fontWeight: '600', fontSize: 15 }}>Get directions</Text>
                </TouchableOpacity>
              </View>
              {/* Calendar icon absolutely positioned in bottom right */}
              <View style={{ position: 'absolute', bottom: 18, right: 18 }}>
                <View style={{ borderWidth: 1, borderColor: '#e0e0e0', borderRadius: 22, paddingHorizontal: 18, paddingVertical: 9, backgroundColor: '#fff', elevation: 2 }}>
                  <Ionicons name="calendar-outline" size={22} color="#222" />
                </View>
              </View>
            </View>
          </View>
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
          <View key={a.id} style={{ flexDirection: 'row', alignItems: 'center', marginHorizontal: 16, marginBottom: 18, backgroundColor: '#fff', borderRadius: 14, padding: 10, elevation: 1 }}>
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
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Appointments</Text>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {session?.firstName?.charAt(0)}{session?.lastName?.charAt(0)}
          </Text>
        </View>
      </View>
      <ScrollView style={{ width: '100%' }} contentContainerStyle={{ paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
        <AppointmentList />
      </ScrollView>
      {/* <View style={styles.card}>
        <View style={styles.iconContainer}>
          <Ionicons name="calendar-outline" size={40} color="#3674B5" />
        </View>
        <Text style={styles.noAppointments}>No appointments</Text>
        <Text style={styles.description}>
          Your upcoming and past appointments will appear when you book
        </Text>
        <TouchableOpacity style={styles.button} onPress={handleSearchSalons}>
          <Text style={styles.buttonText}>Search Activities</Text>
        </TouchableOpacity>
      </View> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 60,
    alignItems: 'center',
  },
  header: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start', // avatar stays at the top
    paddingHorizontal: 24,
    marginBottom: 0,
    marginTop: 0,
    position: 'relative',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111',
    marginTop: 50, // Lower the title a lot
    marginBottom: 20, // Space below title
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#EFEFEF',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: 0,
    right: 24,
  },
  avatarText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
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