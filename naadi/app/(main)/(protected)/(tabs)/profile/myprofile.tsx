import { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import { useSession } from '@naadi/ctx';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function MyProfileScreen() {
  const { session } = useSession();
  const router = useRouter();

  const formatPhoneNumber = (phone: any) => {
    if (!phone) return '-';
    return `${phone.dialCode} ${phone.number}`;
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="chevron-back"  size={28} color="#000" />
          </TouchableOpacity>
        </View>
        <Text style={styles.headerTitle}>My Profile</Text>
        <View style={styles.profileCard}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {session?.firstName?.charAt(0)}{session?.lastName?.charAt(0)}
              </Text>
            </View>
            <TouchableOpacity style={styles.editIcon}>
              <Ionicons name="pencil" size={12} color="#fff" />
            </TouchableOpacity>
          </View>

          <Text style={styles.name}>{session?.firstName} {session?.lastName}</Text>

          <TouchableOpacity style={styles.editButton} onPress={() => router.push('/(main)/(protected)/(tabs)/profile/editProfile')}>
            <Text style={styles.editButtonText}>Edit</Text>
          </TouchableOpacity>

          <View style={styles.detailsContainer}>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>First name</Text>
              <Text style={styles.detailValue}>{session?.firstName || '-'}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Last name</Text>
              <Text style={styles.detailValue}>{session?.lastName || '-'}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Mobile number</Text>
              <Text style={styles.detailValue}>{formatPhoneNumber(session?.phone)}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Email</Text>
              <Text style={styles.detailValue}>{session?.email || '-'}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Date of birth</Text>
              <Text style={styles.detailValue}>-</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Gender</Text>
              <Text style={styles.detailValue}>-</Text>
            </View>
          </View>
        </View>

        <View style={styles.deleteSection}>
          <Text style={styles.deleteSectionTitle}>Delete account</Text>
          <Text style={styles.deleteSectionSubtitle}>Are you sure you want to leave Naadi?</Text>
          <TouchableOpacity style={styles.deleteButton}>
            <Text style={styles.deleteButtonText}>Delete my account</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: 'white',
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#fff',
  },
  backButton: {},
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    marginLeft: 20,
    marginTop: 10,
    marginBottom: 5,
  },
  profileCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    margin: 16,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  avatarContainer: {
    marginTop: 20,
    position: 'relative',
    marginBottom: 12,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#EFEFEF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
  },
  editIcon: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: 'grey',
    borderRadius: 15,
    padding: 6,
    borderWidth: 2,
    borderColor: '#fff',
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 24,
  },
  editButton: {
    position: 'absolute',
    top: 20,
    right: 20,
  },
  editButtonText: {
    fontSize: 16,
    color: 'black',
    fontWeight: '600',
  },
  detailsContainer: {
    width: '100%',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    marginTop: 16,
  },
  detailRow: {
    paddingVertical: 12,
  },
  detailLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 16,
    color: '#000',
  },
  deleteSection: {
    marginHorizontal: 16,
    marginTop: 16,
  },
  deleteSectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  deleteSectionSubtitle: {
    fontSize: 15,
    color: '#888',
    marginBottom: 20,
    textAlign: 'left',
    alignSelf: 'flex-start',
  },
  deleteButton: {
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingVertical: 10,
    marginBottom: 25,
    paddingHorizontal: 0,
    borderWidth: 1,
    borderColor: '#f0f0f0',
    alignItems: 'flex-start',
    alignSelf: 'flex-start',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
  },
  deleteButtonText: {
    color: '#d4163a',
    fontWeight: 'bold',
    fontSize: 15,
    paddingHorizontal: 18,
    textAlign: 'left',
  },
});
