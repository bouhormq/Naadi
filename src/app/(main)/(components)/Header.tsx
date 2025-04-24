import { 
  View, 
  StyleSheet, 
  TouchableOpacity, 
  useWindowDimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import CustomText from 'components/CustomText';

export default function Header() {
  const router = useRouter();
  const { width } = useWindowDimensions();


  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={() => router.push('/')} style={styles.logoContainer}>
        <CustomText style={styles.logo}>naadi</CustomText>
      </TouchableOpacity>
      <View style={styles.headerButtons}>
        <TouchableOpacity style={styles.headerButton}>
          <CustomText style={styles.menuItemText}>Sign up</CustomText>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button}>
          <CustomText style={styles.buttonText}>Log in</CustomText>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
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
});