import React, { useEffect, useState, useCallback } from 'react';
import { View, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import CustomText from '@/components/CustomText';
import { useSession } from '@naadi/hooks/ctx';
import { getUserProfile } from '@naadi/api/auth';
import { PartnerAccount } from '@naadi/types';
import { styles } from './styles';

import BusinessDetailsView from './components/BusinessDetailsView';
import ClientSourcesView from './components/ClientSourcesView';
import LocationsView from './components/LocationsView';

export default function WorkspaceSettings() {
  const router = useRouter();
  const { session } = useSession();
  const [partnerData, setPartnerData] = useState<PartnerAccount | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSection, setSelectedSection] = useState<'business' | 'locations' | 'clientSources'>('business');

  const fetchProfile = useCallback(async () => {
    if (session?.uid) {
      try {
        const profile = await getUserProfile(session.uid);
        if (profile) {
          // Cast to PartnerAccount as we know partners have this structure
          setPartnerData(profile as unknown as PartnerAccount);
        }
      } catch (error) {
        console.error("Failed to fetch partner profile", error);
      } finally {
        setLoading(false);
      }
    }
  }, [session]);

  useFocusEffect(
    useCallback(() => {
      fetchProfile();
    }, [fetchProfile])
  );

  const getPageTitle = () => {
    switch(selectedSection) {
      case 'business': return 'Business details';
      case 'locations': return 'Locations';
      case 'clientSources': return 'Client sources';
      default: return 'Business setup';
    }
  };

  const getPageSubtitle = () => {
    switch(selectedSection) {
      case 'business': return 'Set your business name, tax and language preferences, and manage external links. Learn more.';
      case 'clientSources': return 'Manage sources to track how clients found your business. Learn more.';
      default: return '';
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color="#4f46e5" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* Header / Breadcrumbs */}
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => router.navigate('/partners/(protected)')} style={styles.backButton}>
           <Ionicons name="arrow-back" size={18} color="#334155" />
           <CustomText style={styles.backButtonText}>Back</CustomText>
        </TouchableOpacity>
        <CustomText style={styles.breadcrumbs}>Workspace settings  •  {selectedSection === 'business' ? 'Business setup' : selectedSection === 'locations' ? 'Locations' : 'Client sources'}</CustomText>
      </View>

      <View style={styles.mainLayout}>
        {/* Left Sidebar - Now in a Card */}
        <View style={styles.leftSidebar}>
           <View style={styles.card}>
             <CustomText style={styles.sidebarSectionTitle}>Business setup</CustomText>
             
             <TouchableOpacity onPress={() => setSelectedSection('business')} style={[styles.sidebarItem, selectedSection === 'business' && styles.sidebarItemActive]}>
               <CustomText style={[styles.sidebarItemText, selectedSection === 'business' && styles.sidebarItemTextActive]}>Business details</CustomText>
             </TouchableOpacity>
             <TouchableOpacity onPress={() => setSelectedSection('locations')} style={[styles.sidebarItem, selectedSection === 'locations' && styles.sidebarItemActive]}>
               <CustomText style={[styles.sidebarItemText, selectedSection === 'locations' && styles.sidebarItemTextActive]}>Locations</CustomText>
             </TouchableOpacity>
             <TouchableOpacity onPress={() => setSelectedSection('clientSources')} style={[styles.sidebarItem, selectedSection === 'clientSources' && styles.sidebarItemActive]}>
               <CustomText style={[styles.sidebarItemText, selectedSection === 'clientSources' && styles.sidebarItemTextActive]}>Client sources</CustomText>
             </TouchableOpacity>

           </View>
        </View>

        {/* Right Content */}
        <View style={styles.rightContent}>
           {selectedSection !== 'clientSources' && selectedSection !== 'locations' && (
             <>
               <CustomText style={styles.pageTitle}>{getPageTitle()}</CustomText>
               <CustomText style={styles.pageSubtitle}>
                 {getPageSubtitle()}
               </CustomText>
             </>
           )}

           {/* Business Info Section */}
           {selectedSection === 'business' && (
             <BusinessDetailsView partnerData={partnerData} onRefresh={fetchProfile} />
           )}

           {selectedSection === 'clientSources' && (
             <ClientSourcesView />
           )}
           {selectedSection === 'locations' && (
             <LocationsView />
           )}
        </View>
      </View>
    </ScrollView>
  );
}
