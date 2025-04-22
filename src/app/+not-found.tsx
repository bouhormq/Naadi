import { Link, router, Stack } from 'expo-router';
import { StyleSheet, Text, View, Platform, TouchableOpacity } from 'react-native';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Oops! This screen doesn\'t exist.' }} />
      <View style={styles.header}>
      <TouchableOpacity onPress={() => router.push('/')} style={styles.logoContainer}>
        <Text style={styles.logo}>naadi</Text>
      </TouchableOpacity>
      <View style={styles.headerButtons}>
        <TouchableOpacity style={styles.headerButton}>
          <Text style={styles.menuItemText}>Sign up</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Log in</Text>
        </TouchableOpacity>
      </View>
      </View>
      <View style={styles.container}>
        <Text style={styles.title}>🚧 Oops! Page<Text style={styles.notFound}> Not Found...</Text></Text>
        <Text style={[styles.mainSubtitle]}> Great choice of page tho, too bad it doesn’t exist.</Text>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: Platform.OS === 'web' ? 57.6 : 48, // Responsive font size
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 15,
    lineHeight: Platform.OS === 'web' ? 57.6 : 54, // Responsive line height
    textAlign: 'center', // Center the text horizontally
    // maxWidth: 650, // Moved maxWidth to textContainer
  },
  notFound: {
    color: "#D2042D",
    // maxWidth: 650, // Moved maxWidth to textContainer
  },
  sparkles: {
    fontSize: 40,
    // maxWidth: 650, // Moved maxWidth to textContainer
  },
  link: {
    marginTop: 15,
    paddingVertical: 5,
  },
  linkText: {
    fontSize: 14,
    color: '#2e78b7', // Example link color
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    backgroundColor: '#fff',
  },
  logoContainer: {
    flex: 1,
  },
  logo: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  menuItems: {
    flex: 1,
    padding: 15,
  },
  menuItemText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  button: {
    backgroundColor: '#2357FF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 30,
    alignSelf: 'center',
    marginLeft: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: 'bold',
  },
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    flex: 2,
  },
  headerButton: {
    marginLeft: 10,
    marginRight: 10,
  },
  mainSubtitle: {
    fontSize: 25,
    color: '#4b5563',
    lineHeight: 25,
    fontWeight: 'bold',
    textAlign: 'center', // Center the text horizontally
    // maxWidth: 650, // Moved maxWidth to textContainer
  }
});