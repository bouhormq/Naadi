import React, { useEffect, useState } from 'react';
import { View, TouchableOpacity, ActivityIndicator, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import CustomText from '@/components/CustomText';
import { getLocations, createLocation, updateLocation, deleteLocation } from '@naadi/api';
import { styles } from '../styles';
import LocationModal from './LocationModal';

export default function LocationsView() {
  const [loading, setLoading] = useState(true);
  const [locations, setLocations] = useState<Array<any>>([]);
  const [isModalVisible, setModalVisible] = useState(false);
  const [editing, setEditing] = useState<any | null>(null);
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [activeDropdownId, setActiveDropdownId] = useState<string | null>(null);

  const fetch = async () => {
    setLoading(true);
    try {
      const res = await getLocations();
      setLocations(res.locations || []);
    } catch (e) {
      console.error('Failed to load locations', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetch(); }, []);

  const openCreate = () => {
    setEditing(null);
    setName('');
    setAddress('');
    setModalVisible(true);
  };

  const openEdit = (loc: any) => {
    setEditing(loc);
    setName(loc.name);
    setAddress(loc.address);
    setModalVisible(true);
  };

  const handleSave = async (data: any) => {
    try {
      const payload = {
        name: data.name,
        address: data.location?.address || '',
        phone: data.phone,
        email: data.email,
        services: data.services,
        coordinates: data.location?.location,
        noPhysicalLocation: data.location?.noPhysicalLocation,
        openingHours: data.openingHours,
        // Billing info is currently static in the modal, so we can add it later or send empty/default if needed
        // billing: ... 
      };

      if (editing) {
        await updateLocation(editing.id, payload);
      } else {
        await createLocation(payload);
      }
      await fetch();
      setModalVisible(false);
    } catch (e) {
      console.error('Failed to save location', e);
      alert('Failed to save');
    }
  };

  const handleDelete = async (id: string) => {
    setActiveDropdownId(null);
    if (Platform.OS === 'web') {
       if (!window.confirm('Are you sure you want to delete this location?')) return;
    }
    try {
      await deleteLocation(id);
      await fetch();
    } catch (e) {
      console.error('Failed to delete', e);
      alert('Failed to delete');
    }
  };

  return (
    <View>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
        <View style={{ flex: 1, marginRight: 16 }}>
           <CustomText style={styles.pageTitle}>Locations</CustomText>
           <CustomText style={styles.pageSubtitle}>Manage info and preferences of locations within your business. Learn more.</CustomText>
        </View>
        <View style={{ flexDirection: 'row', gap: 12 }}>
            <TouchableOpacity style={styles.addButton} onPress={openCreate}>
                <CustomText style={styles.addButtonText}>Add</CustomText>
            </TouchableOpacity>
        </View>
      </View>

      {loading ? (
        <ActivityIndicator style={{ marginTop: 20 }} />
      ) : (
        locations.map((loc: any) => (
          <View 
            key={loc.id} 
            style={[
              styles.card,
              { flexDirection: 'row', padding: 0, marginBottom: 16, zIndex: activeDropdownId === loc.id ? 1000 : 1 }
            ]}
          >
            {/* Image Placeholder */}
            <View style={{ width: 180, backgroundColor: '#f1f5f9', justifyContent: 'center', alignItems: 'center', borderTopLeftRadius: 8, borderBottomLeftRadius: 8 }}>
                <Ionicons name="storefront-outline" size={48} color="#94a3b8" />
            </View>

            {/* Content */}
            <View style={{ flex: 1, padding: 24 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <View>
                        <CustomText style={{ fontWeight: '700', fontSize: 18, marginBottom: 4, color: '#0f172a' }}>{loc.name}</CustomText>
                        <CustomText style={{ color: '#64748b', fontSize: 14, marginBottom: 8 }}>No reviews yet</CustomText>
                        <CustomText style={{ color: '#64748b', fontSize: 14 }}>{loc.address}</CustomText>
                    </View>
                </View>

                <View style={{ marginTop: 16 }}>
                    <TouchableOpacity 
                        style={[styles.actionButton, { alignSelf: 'flex-start' }]} 
                        onPress={() => setActiveDropdownId(activeDropdownId === loc.id ? null : loc.id)}
                    >
                        <CustomText style={styles.actionButtonText}>Actions</CustomText>
                        <Ionicons name="chevron-down" size={14} color="#334155" />
                    </TouchableOpacity>

                    {activeDropdownId === loc.id && (
                        <View style={[styles.dropdownMenu, { top: '100%', left: 0, right: 'auto' }]}>
                        <TouchableOpacity 
                            style={styles.dropdownItem} 
                            onPress={() => {
                            setActiveDropdownId(null);
                            openEdit(loc);
                            }}
                        >
                            <Ionicons name="eye-outline" size={16} color="#334155" />
                            <CustomText style={styles.dropdownItemText}>View</CustomText>
                        </TouchableOpacity>
                        <View style={styles.dropdownDivider} />
                        <TouchableOpacity 
                            style={styles.dropdownItem} 
                            onPress={() => {
                            setActiveDropdownId(null);
                            handleDelete(loc.id);
                            }}
                        >
                            <Ionicons name="trash-outline" size={16} color="#dc2626" />
                            <CustomText style={[styles.dropdownItemText, { color: '#dc2626' }]}>Delete</CustomText>
                        </TouchableOpacity>
                        </View>
                    )}
                </View>
            </View>
          </View>
        ))
      )}

      <LocationModal 
        visible={isModalVisible}
        onClose={() => setModalVisible(false)}
        onSave={handleSave}
        editing={editing}
      />
    </View>
  );
}
