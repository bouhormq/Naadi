import React, { useEffect, useState } from 'react';
import { View, TouchableOpacity, ActivityIndicator, Platform, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import CustomText from '@/components/CustomText';
import { getClientSources, createClientSource, updateClientSource, deleteClientSource } from '@naadi/api';
import { styles } from '../styles';
import ClientSourceModal from './ClientSourceModal';

export default function ClientSourcesView() {
  const [loading, setLoading] = useState(true);
  const [sources, setSources] = useState<Array<any>>([]);
  const [isModalVisible, setModalVisible] = useState(false);
  const [editing, setEditing] = useState<any | null>(null);
  const [name, setName] = useState('');
  const [active, setActive] = useState(true);
  const [activeDropdownId, setActiveDropdownId] = useState<string | null>(null);

  const fetch = async () => {
    setLoading(true);
    try {
      const res = await getClientSources();
      const fetchedSources = res.sources || res || [];
      // Sort by createdAt descending (newest first)
      fetchedSources.sort((a: any, b: any) => {
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return dateB - dateA;
      });
      setSources(fetchedSources);
    } catch (e) {
      console.error('Failed to load client sources', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetch(); }, []);

  const openCreate = () => {
    setEditing(null);
    setName('');
    setActive(true);
    setModalVisible(true);
  };

  const openEdit = (src: any) => {
    setEditing(src);
    setName(src.name);
    setActive(!!src.active);
    setModalVisible(true);
  };

  const handleSave = async () => {
    try {
      if (editing) {
        await updateClientSource(editing.id, { name, active });
      } else {
        await createClientSource({ name, active });
      }
      await fetch();
      setModalVisible(false);
    } catch (e) {
      console.error('Failed to save client source', e);
      alert('Failed to save');
    }
  };

  const handleDelete = async (id: string) => {
    // Close the dropdown immediately
    setActiveDropdownId(null);

    try {
      await deleteClientSource(id);
      await fetch();
    } catch (e) {
      console.error('Failed to delete', e);
      // Keep UX-friendly error handling for both web and native
      if (Platform.OS === 'web') {
        alert('Failed to delete');
      } else {
        Alert.alert('Error', 'Failed to delete');
      }
    }
  };

  const FIXED_SOURCES = [
    'Walk-In', 'Instagram', 'Imported', 'Google', 'Fresha Marketplace', 'Facebook', 'Book Now Link'
  ];

  return (
    <View>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
        <View style={{ flex: 1, marginRight: 16 }}>
           <CustomText style={styles.pageTitle}>Client sources</CustomText>
           <CustomText style={styles.pageSubtitle}>Manage sources to track how clients found your business. Learn more.</CustomText>
        </View>
        <TouchableOpacity style={styles.addButton} onPress={openCreate}>
           <CustomText style={styles.addButtonText}>Add</CustomText>
        </TouchableOpacity>
      </View>

      {/* Custom sources */}
      {loading ? (
        <ActivityIndicator style={{ marginTop: 20 }} />
      ) : (
        sources.map((src: any) => (
          <View 
            key={src.id} 
            style={[
              styles.clientSourceItem, 
              styles.card,
              { zIndex: activeDropdownId === src.id ? 1000 : 1 }
            ]}
          >
            <View>
              <CustomText style={{ fontWeight: '600', fontSize: 16, marginBottom: 4 }}>{src.name}</CustomText>
              <CustomText style={{ color: src.active ? '#10b981' : '#64748b', fontSize: 14 }}>{src.active ? 'Active' : 'Disabled'}</CustomText>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, position: 'relative' }}>
              <TouchableOpacity 
                style={styles.actionButton} 
                onPress={() => setActiveDropdownId(activeDropdownId === src.id ? null : src.id)}
              >
                <CustomText style={styles.actionButtonText}>Actions</CustomText>
                <Ionicons name="chevron-down" size={14} color="#334155" />
              </TouchableOpacity>

              {activeDropdownId === src.id && (
                <View style={styles.dropdownMenu}>
                  <TouchableOpacity 
                    style={styles.dropdownItem} 
                    onPress={() => {
                      setActiveDropdownId(null);
                      openEdit(src);
                    }}
                  >
                    <Ionicons name="pencil-outline" size={16} color="#334155" />
                    <CustomText style={styles.dropdownItemText}>Edit</CustomText>
                  </TouchableOpacity>
                  <View style={styles.dropdownDivider} />
                  <TouchableOpacity 
                    style={styles.dropdownItem} 
                    onPress={() => {
                      setActiveDropdownId(null);
                      handleDelete(src.id);
                    }}
                  >
                    <Ionicons name="trash-outline" size={16} color="#dc2626" />
                    <CustomText style={[styles.dropdownItemText, { color: '#dc2626' }]}>Delete</CustomText>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </View>
        ))
      )}

      {/* Fixed list (read-only) */}
      {FIXED_SOURCES.map((s) => (
        <View key={s} style={[styles.clientSourceItem, styles.card] }>
          <View>
             <CustomText style={{ fontWeight: '600', fontSize: 16, marginBottom: 4 }}>{s}</CustomText>
             <CustomText style={{ color: '#10b981', fontSize: 14 }}>Active</CustomText>
          </View>
          <Ionicons name="lock-closed-outline" size={20} color="#94a3b8" />
        </View>
      ))}

      <ClientSourceModal 
        visible={isModalVisible}
        onClose={() => setModalVisible(false)}
        onSave={handleSave}
        editing={editing}
        name={name}
        setName={setName}
        active={active}
        setActive={setActive}
      />
    </View>
  );
}
