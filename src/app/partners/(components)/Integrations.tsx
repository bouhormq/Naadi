import {
  View,
  StyleSheet,
  Image,
  useWindowDimensions,
} from 'react-native';
import CustomText from '@/components/CustomText';


// Define a threshold for switching layouts
const DESKTOP_BREAKPOINT = 768;

export default function Integrations() {
  const { width } = useWindowDimensions();
  
  // Determine if we should use desktop (two-column) layout
  const isDesktop = width > DESKTOP_BREAKPOINT;

  return (
    <View style={styles.container}>
      <View style={[styles.contentWrapper, isDesktop ? styles.desktopLayout : styles.mobileLayout]}>
        <View style={[styles.textContainer, isDesktop ? styles.textDesktop : styles.textMobile]}>
          <CustomText style={[styles.title, isDesktop ? styles.titleLeft : styles.titleCenter]}>
            <CustomText style={styles.scaleText}>Easily</CustomText> integrate your booking system
          </CustomText>
          <CustomText style={[styles.subtitle, isDesktop ? styles.subtitleLeft : styles.subtitleCenter]}>
            Naadi seamlessly integrates with your booking systems, making it easy for you to sync your schedule and avoid overbooking.
          </CustomText>
        </View>
        <View style={[styles.imageContainer, isDesktop ? styles.imageDesktop : styles.imageMobile]}>
          <Image
            source={require('../(assets)/integrations.png')}
            style={styles.corporateImage}
            resizeMode="contain"
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f0f7ff',
    paddingVertical: 70,
    paddingHorizontal: 20,
    width: '100%',
  },
  contentWrapper: {
    width: '100%',
    maxWidth: 1500,
    alignSelf: 'center',
  },
  desktopLayout: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  mobileLayout: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  textContainer: {
    marginBottom: 20,
  },
  textDesktop: {
    flex: 1,
    paddingRight: 40,
  },
  textMobile: {
    width: '100%',
    alignItems: 'center',
  },
  imageContainer: {
    width: '100%',
  },
  imageDesktop: {
    flex: 1,
  },
  imageMobile: {
    alignItems: 'center',
  },
  corporateImage: {
    width: '100%',
    height: 370,
    borderRadius: 10,
  },
  title: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 10,
  },
  titleLeft: {
    textAlign: 'left',
  },
  titleCenter: {
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#000',
    marginBottom: 25,
    opacity: 0.9,
  },
  subtitleLeft: {
    textAlign: 'left',
  },
  subtitleCenter: {
    textAlign: 'center',
  },
  scaleText: {
    color: '#007bff',
    fontWeight: 'bold',
  },
});