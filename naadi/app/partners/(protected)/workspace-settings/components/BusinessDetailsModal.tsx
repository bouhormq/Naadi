import React, { useState, useEffect } from 'react';
import { View, Modal, TouchableOpacity, ScrollView, TextInput, ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import CustomText from '@/components/CustomText';
import { styles } from '../styles';
import { PartnerAccount } from '@naadi/types';
import { editUser } from '@naadi/api/auth';
import { useSession } from '@naadi/hooks/ctx';

interface BusinessDetailsModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: () => void;
  partnerData: PartnerAccount | null;
}

export default function BusinessDetailsModal({ visible, onClose, onSave, partnerData }: BusinessDetailsModalProps) {
  const { session, refreshSession } = useSession();
  const [saving, setSaving] = useState(false);

  // Form State
  const [facebook, setFacebook] = useState('');
  const [instagram, setInstagram] = useState('');
  const [twitter, setTwitter] = useState('');
  const [website, setWebsite] = useState('');

  useEffect(() => {
    if (visible && partnerData) {
      setFacebook(partnerData.facebook || '');
      setInstagram(partnerData.instagram || '');
      setTwitter(partnerData.twitter || '');
      setWebsite(partnerData.website || '');
    }
  }, [visible, partnerData]);

  const handleSave = async () => {
    if (!session?.uid) return;
    setSaving(true);
    try {
      await editUser(session.uid, {
        facebook,
        instagram,
        twitter,
        website
      });
      
      // Refresh the global session to update UI across the app
      await refreshSession();
      
      onSave();
      onClose();
    } catch (error: any) {
      console.error("Failed to update profile", error);
      Alert.alert("Error", "Failed to update profile. " + error.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
      <View style={styles.fullScreenModal}>
        <View style={styles.modalHeader}>
          <CustomText style={styles.modalTitle}>Edit business details</CustomText>
          <View style={styles.modalHeaderButtons}>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <CustomText style={styles.closeButtonText}>Close</CustomText>
            </TouchableOpacity>
            <TouchableOpacity style={styles.saveButton} onPress={handleSave} disabled={saving}>
              {saving ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <CustomText style={styles.saveButtonText}>Save</CustomText>
              )}
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView contentContainerStyle={styles.modalContent}>
          {/* Language Settings Section */}
          <View style={{ marginBottom: 24 }}>
            <CustomText style={styles.sidebarSectionTitle}>Language settings</CustomText>
            <CustomText style={styles.pageSubtitle}>Choose the default language for clients and team members.</CustomText>

            <View style={{ flexDirection: 'row', gap: 24, marginBottom: 24 }}>
              <View style={{ flex: 1 }}>
                <CustomText style={styles.label}>Team default language</CustomText>
                <View style={styles.dropdownButton}>
                  <CustomText style={{ flex: 1 }}>🇬🇧 English (English)</CustomText>
                  <Ionicons name="chevron-down" size={16} color="#64748b" />
                </View>
              </View>
              <View style={{ flex: 1 }}>
                <CustomText style={styles.label}>Client default language</CustomText>
                <View style={styles.dropdownButton}>
                  <CustomText style={{ flex: 1 }}>🇬🇧 English (English)</CustomText>
                  <Ionicons name="chevron-down" size={16} color="#64748b" />
                </View>
              </View>
            </View>

            <View style={{ backgroundColor: '#f8fafc', padding: 16, borderRadius: 6 }}>
              <CustomText style={{ fontSize: 14, color: '#475569' }}>
                Team members and clients can override the language displayed to them in their settings.
              </CustomText>
            </View>
          </View>

          <View style={styles.sidebarDivider} />

          {/* External Links Section */}
          <View style={{ marginBottom: 24 }}>
            <CustomText style={styles.sidebarSectionTitle}>External links</CustomText>
            <CustomText style={styles.pageSubtitle}>Add your company website and social media links for sharing with clients.</CustomText>

            <InputWithIcon 
              label="Facebook" 
              icon="logo-facebook" 
              placeholder="facebook.com/yoursite" 
              value={facebook} 
              onChangeText={setFacebook} 
            />
            <InputWithIcon 
              label="Instagram" 
              icon="logo-instagram" 
              placeholder="instagram.com/yoursite" 
              value={instagram} 
              onChangeText={setInstagram} 
            />
            <InputWithIcon 
              label="X (Twitter)" 
              icon="logo-twitter" 
              placeholder="x.com/yoursite" 
              value={twitter} 
              onChangeText={setTwitter} 
            />
            <InputWithIcon 
              label="Website" 
              icon="globe-outline" 
              placeholder="https://yourbusiness.com" 
              value={website} 
              onChangeText={setWebsite} 
            />
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
}

const InputWithIcon = ({ label, icon, placeholder, value, onChangeText }: any) => (
  <View style={{ marginBottom: 20 }}>
    <CustomText style={styles.label}>{label}</CustomText>
    <View style={[styles.inputWrapper, { flexDirection: 'row', alignItems: 'center' }]}>
      <Ionicons name={icon} size={20} color="#94a3b8" style={{ paddingLeft: 12 }} />
      <TextInput
        style={[styles.input, { flex: 1 }]}
        placeholder={placeholder}
        placeholderTextColor="#cbd5e1"
        value={value}
        onChangeText={onChangeText}
        autoCapitalize="none"
      />
    </View>
  </View>
);
