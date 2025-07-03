import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, Platform } from 'react-native';
import { Ionicons, Octicons, MaterialIcons, MaterialCommunityIcons, FontAwesome, FontAwesome5 } from '@expo/vector-icons';
import { useSession } from '@naadi/hooks/ctx';
import { useRouter } from 'expo-router';

const profileOptions = [
  { label: 'Favourites', icon: <Octicons name="heart" size={22} color="#222" />, route: 'favourites' },
  { label: 'Vouchers', icon: <MaterialIcons name="confirmation-number" size={22} color="#222" />, route: 'vouchers' },
  { label: 'Gift cards', icon: <MaterialCommunityIcons name="gift-outline" size={22} color="#222" />, route: 'gift-cards' },
  { label: 'Memberships', icon: <MaterialCommunityIcons name="autorenew" size={22} color="#222" />, route: 'memberships' },
  { label: 'Forms', icon: <FontAwesome name="wpforms" size={22} color="#222" />, route: 'forms' },
  { label: 'Orders', icon: <FontAwesome5 name="shopping-bag" size={22} color="#222" />, route: 'orders' },
  { label: 'Payment methods', icon: <FontAwesome name="credit-card" size={22} color="#222" />, route: 'payment-methods' },
  { label: 'Settings', icon: <Ionicons name="settings-outline" size={22} color="#222" />, route: 'settings' },
];

export default function ProfileScreen() {
  const { session } = useSession();
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={28} color="#222" />
        </TouchableOpacity>
        <Text style={styles.title}>Profile</Text>
        <View style={styles.profileCard}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarText}>
              {session?.firstName?.charAt(0)}{session?.lastName?.charAt(0)}
            </Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.nameText}>{session?.firstName} {session?.lastName}</Text>
            <TouchableOpacity>
              <Text style={styles.editProfileText}>Edit profile</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.optionsList}>
          {profileOptions.map((opt, idx) => (
            <TouchableOpacity
              key={opt.label}
              style={styles.optionRow}
              onPress={() => router.push(opt.route)}
            >
              <View style={styles.iconContainer}>{opt.icon}</View>
              <Text style={styles.optionLabel}>{opt.label}</Text>
              <Ionicons name="chevron-forward" size={22} color="#222" style={{ marginLeft: 'auto' }} />
            </TouchableOpacity>
          ))}
        </View>
        <View style={styles.bottomRow}>
          <TouchableOpacity style={styles.bottomButton}>
            <Ionicons name="globe-outline" size={18} color="#8B5CF6" />
            <Text style={styles.bottomText}>English</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.bottomButton}>
            <Ionicons name="person-circle-outline" size={18} color="#8B5CF6" />
            <Text style={styles.bottomText}>Support</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    paddingHorizontal: 0,
  },
  backButton: {
    marginTop: 10,
    marginLeft: 10,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginLeft: 20,
    marginTop: 10,
    marginBottom: 10,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FAFAFA',
    borderRadius: 16,
    marginHorizontal: 16,
    marginBottom: 24,
    padding: 18,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  avatarCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#E4E1FB',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  avatarText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#7C5AF6',
  },
  nameText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#222',
  },
  editProfileText: {
    fontSize: 15,
    color: '#888',
    marginTop: 2,
  },
  optionsList: {
    marginHorizontal: 0,
    backgroundColor: '#fff',
    borderRadius: 16,
    overflow: 'hidden',
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 18,
    paddingHorizontal: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  iconContainer: {
    width: 32,
    alignItems: 'center',
    marginRight: 16,
  },
  optionLabel: {
    fontSize: 17,
    color: '#222',
    fontWeight: '400',
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    marginTop: 32,
    marginBottom: 16,
  },
  bottomButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  bottomText: {
    color: '#8B5CF6',
    fontSize: 16,
    marginLeft: 4,
    fontWeight: '500',
  },
});
