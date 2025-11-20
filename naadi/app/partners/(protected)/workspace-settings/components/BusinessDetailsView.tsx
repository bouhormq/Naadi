import React, { useState } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import CustomText from '@/components/CustomText';
import { PartnerAccount } from '@naadi/types';
import { styles } from '../styles';
import BusinessDetailsModal from './BusinessDetailsModal';

interface BusinessDetailsViewProps {
  partnerData: PartnerAccount | null;
  onRefresh?: () => void;
}

export default function BusinessDetailsView({ partnerData, onRefresh }: BusinessDetailsViewProps) {
  const router = useRouter();
  const [isModalVisible, setModalVisible] = useState(false);

  return (
    <View style={styles.card}>
      <View style={styles.cardHeaderRow}>
        <CustomText style={styles.cardSectionTitle}>Business Info</CustomText>
        <TouchableOpacity style={styles.editButton} onPress={() => setModalVisible(true)}>
          <CustomText style={styles.editButtonText}>Edit</CustomText>
        </TouchableOpacity>
      </View>

      <View style={styles.infoGrid}>
        <InfoItem label="Business name" value={partnerData?.businessName || 'Not set'} />
        <InfoItem label="Country" value={partnerData?.location || 'Not set'} />
        <InfoItem label="Currency" value="USD" />
        <InfoItem label="Tax calculation" value="Retail prices exclude tax" />
        <InfoItem label="Team default language" value="🇬🇧 English (English)" />
        <InfoItem label="Client default language" value="🇬🇧 English (English)" />
      </View>

      <View style={styles.cardDivider} />

      {/* External Links Section */}
      <CustomText style={[styles.cardSectionTitle, { marginBottom: 16 }]}>External links</CustomText>
      <View style={styles.infoGrid}>
        <LinkItem label="Facebook" action="Add" onPress={() => setModalVisible(true)} />
        <LinkItem label="X (Twitter)" action="Add" onPress={() => setModalVisible(true)} />
        <LinkItem label="Instagram" action="Add" onPress={() => setModalVisible(true)} />
        <LinkItem label="Website" action={partnerData?.website ? 'Edit' : 'Add'} value={partnerData?.website} onPress={() => setModalVisible(true)} />
      </View>

      <BusinessDetailsModal 
        visible={isModalVisible}
        onClose={() => setModalVisible(false)}
        onSave={() => {
          if (onRefresh) onRefresh();
        }}
        partnerData={partnerData}
      />
    </View>
  );
}

const InfoItem = ({ label, value }: { label: string, value: string }) => (
  <View style={styles.infoItem}>
    <CustomText style={styles.infoLabel}>{label}</CustomText>
    <CustomText style={styles.infoValue}>{value}</CustomText>
  </View>
);

const LinkItem = ({ label, action, value, onPress }: { label: string, action: string, value?: string, onPress?: () => void }) => (
  <View style={styles.infoItem}>
    <CustomText style={styles.infoLabel}>{label}</CustomText>
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
        {value && <CustomText style={[styles.infoValue, { marginRight: 8 }]} numberOfLines={1}>{value}</CustomText>}
        <TouchableOpacity onPress={onPress}>
        <CustomText style={styles.linkAction}>{action}</CustomText>
        </TouchableOpacity>
    </View>
  </View>
);
