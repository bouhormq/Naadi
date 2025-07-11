import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, Alert, Linking } from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useSession } from '@naadi/hooks/ctx';

const settingsOptions = [
  { label: 'Social logins', icon: <Feather name="share-2" size={22} color="#222" />, route: '/(main)/(protected)/(tabs)/profile/settings/social-logins' },
  { label: 'Notifications', icon: <Ionicons name="notifications-outline" size={22} color="#222" />, route: '/(main)/(protected)/(tabs)/profile/settings/notifications' },
  { label: 'Language', icon: <Ionicons name="globe-outline" size={22} color="#222" />, route:  '/(main)/(protected)/(tabs)/profile/settings/language' },
  { label: 'Privacy policy', icon: <Feather name="external-link" size={22} color="#222" />, route: 'https://naadi.ma/privacy-policy' },
  { label: 'Terms of service', icon: <Feather name="external-link" size={22} color="#222" />, route: 'https://naadi.ma/terms-of-service' },
  { label: 'Terms of use', icon: <Feather name="external-link" size={22} color="#222" />, route: 'https://naadi.ma/terms-of-use' },
];

export default function SettingsScreen() {
  const router = useRouter();
  const { signOut } = useSession();

  const handleSignOut = () => {
    signOut();
    router.replace('/(main)/onboarding');
  };

  const handleDeleteAccount = () => {
    router.push('/(main)/(protected)/(tabs)/profile/delete-account');
  };

  const handleOptionPress = (route: string) => {
    if (route.startsWith('https')) {
      Linking.openURL(route);
    } else {
      router.push(route);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        <View style={styles.header}>
            <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                <Ionicons name="arrow-back" size={24} color="black" />
            </TouchableOpacity>
            <Text style={styles.title}>Settings</Text>
        </View>

        <View style={styles.optionsList}>
          {settingsOptions.map((opt) => (
            <TouchableOpacity
              key={opt.label}
              style={styles.optionRow}
              onPress={() => handleOptionPress(opt.route)}
            >
              <View style={styles.iconContainer}>{opt.icon}</View>
              <Text style={styles.optionLabel}>{opt.label}</Text>
              <Ionicons name="chevron-forward" size={22} color="#ccc" style={{ marginLeft: 'auto' }} />
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.actionsContainer}>
            <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
                <Text style={styles.signOutButtonText}>Sign out</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.deleteButton} onPress={handleDeleteAccount}>
                <Text style={styles.deleteButtonText}>Delete account</Text>
            </TouchableOpacity>
        </View>

        <Text style={styles.versionText}>App version 3.8.2 (43)</Text>

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
  },
  contentContainer: {
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    marginBottom: 10,
  },
  backButton: {
    padding: 5,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  optionsList: {
    backgroundColor: '#fff',
    borderRadius: 16,
    overflow: 'hidden',
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 18,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  iconContainer: {
    width: 32,
    alignItems: 'center',
    marginRight: 16,
  },
  optionLabel: {
    fontSize: 17,
    color: '#222',
  },
  actionsContainer: {
    marginTop: 40,
    alignItems: 'center',
  },
  signOutButton: {
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    backgroundColor: '#fff',
    marginBottom: 15,
  },
  signOutButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000',
  },
  deleteButton: {
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    backgroundColor: 'transparent',
  },
  deleteButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#d4163a',
  },
  versionText: {
    textAlign: 'center',
    color: '#aaa',
    marginTop: 30,
    fontSize: 12,
  },
});
