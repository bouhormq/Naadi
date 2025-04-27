import { useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
  useWindowDimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import CustomText from '@/components/CustomText';

// --- Card Data ---
const businessCardData = [
  {
    id: 'b1',
    image: require('../(assets)/sign-up-image.webp'),
    title: 'Sign up for free',
    text: 'Fill out the form to become a Naadi partner at no cost to you.',
  },
  {
    id: 'b2',
    image: require('../(assets)/build-profile-image.webp'),
    title: 'Build your profile',
    text: 'Add details of your partner such as photos and descriptions of your services and amenities.',
  },
  {
    id: 'b3',
    image: require('../(assets)/increase-revenue-image.webp'),
    title: 'Increase revenue',
    text: 'Fill spots that often go unfilled, lower expenses, and increase profits.',
  },
];

const memberCardData = [
  {
    id: 'm1',
    image: require('../(assets)/book-classes-image.png'),
    title: 'Book classes and appointments',
    text: 'Naadi members get credits to book fitness classes and wellness appointments worldwide.',
  },
  {
    id: 'm2',
    image: require('../(assets)/custom-routine-image.png'),
    title: 'Create a custom routine',
    text: 'Users are able to book what they want, when they want to create a routine that works for them.',
  },
  {
    id: 'm3',
    image: require('../(assets)/save-money-image.webp'),
    title: 'Save on self-care',
    text: 'Naadi offers exclusive member rates and in-app promotions to keep reservations affordable.',
  },
];
// --- End Card Data ---

// Define thresholds for responsive design
const DESKTOP_BREAKPOINT = 768;
const TABLET_BREAKPOINT = 480;

export default function HeroSection() {
  const [activeTab, setActiveTab] = useState('partneres');
  const { width } = useWindowDimensions();
  const router = useRouter();

  // Determine number of columns based on width
  const numColumns = width > DESKTOP_BREAKPOINT ? 3 : 1;
  const isDesktop = numColumns === 3;

  // Calculate responsive values based on screen size
  const getTabPadding = () => {
    if (width > DESKTOP_BREAKPOINT) return 16;
    if (width > TABLET_BREAKPOINT) return 14;
    return 10; // Smaller padding for small screens
  };

  const getTabFontSize = () => {
    if (width > DESKTOP_BREAKPOINT) return 16;
    if (width > TABLET_BREAKPOINT) return 14;
    return 12; // Smaller font for small screens
  };

  // Get min tab width to calculate text fitting
  const tabMinWidth = (width * 0.9 * 0.5) - 16; // 90% container width, 50% per tab, minus padding
  
  // Select the data based on the active tab
  const currentCardData = activeTab === 'partneres' ? businessCardData : memberCardData;
  
  // Reusable Card Component
  interface CardProps {
    item: {
      image: any;
      title: string;
      text: string;
    };
    isDesktopLayout: boolean;
  }

  const Card = ({ item, isDesktopLayout }: CardProps) => (
    <View style={[styles.cardContainer, !isDesktopLayout && styles.cardContainerMobile]}>
      <Image
        source={item.image}
        style={[styles.cardImage, !isDesktopLayout && styles.cardImageMobile]}
        resizeMode="cover"
      />
      <CustomText style={styles.cardTitle}>{item.title}</CustomText>
      <CustomText style={styles.cardText}>{item.text}</CustomText>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <CustomText style={styles.title}>How partnering with Naadi works</CustomText>
        <CustomText style={styles.subtitle}>
          Find out how to list your classes and appointments on Naadi to scale your business.
        </CustomText>

        {/* --- Updated Tabs --- */}
        <View style={styles.tabContainer}>
          <View style={styles.tabsWrapper}>
            <TouchableOpacity
              style={[
                styles.tab,
                { paddingVertical: getTabPadding() },
                activeTab === 'partneres' && styles.activeTab,
              ]}
              onPress={() => setActiveTab('partneres')}
            >
              <CustomText 
                style={[
                  styles.tabText,
                  { 
                    fontSize: getTabFontSize(),
                    // Ensure text fits in container
                    maxWidth: tabMinWidth,
                  },
                  activeTab === 'partneres' && styles.activeTabText,
                ]}
                numberOfLines={1} // Force single line
                ellipsizeMode="tail" // Add ellipsis if text is too long
              >
                For partneres
              </CustomText>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.tab,
                { paddingVertical: getTabPadding() },
                activeTab === 'members' && styles.activeTab,
              ]}
              onPress={() => setActiveTab('members')}
            >
              <CustomText 
                style={[
                  styles.tabText,
                  { 
                    fontSize: getTabFontSize(),
                    // Ensure text fits in container
                    maxWidth: tabMinWidth,
                  },
                  activeTab === 'members' && styles.activeTabText,
                ]}
                numberOfLines={1} // Force single line
                ellipsizeMode="tail" // Add ellipsis if text is too long
              >
                For Naadi members
              </CustomText>
            </TouchableOpacity>
          </View>
        </View>

        {/* --- Cards using FlatList --- */}
        <FlatList
          key={numColumns}
          data={currentCardData}
          renderItem={({ item }) => <Card item={item} isDesktopLayout={isDesktop} />}
          keyExtractor={(item) => item.id}
          numColumns={numColumns}
          style={styles.cardList}
          scrollEnabled={true}
          ListFooterComponent={() => (
            <TouchableOpacity style={styles.button} onPress={() => router.push('/partners/signup')}>
              <CustomText style={styles.buttonText}>Get Started</CustomText>
            </TouchableOpacity>
          )}
          columnWrapperStyle={numColumns > 1 ? styles.columnWrapper : null}
        />
      </View>
    </View>
  );
}

// --- Updated Styles ---
const styles = StyleSheet.create({
  scrollViewContainer: {
    flexGrow: 1,
  },
  container: {
    backgroundColor: '#f0f7ff',
    paddingVertical: 50,
    paddingHorizontal: 20,
    flex: 1,
  },
  content: {
    alignItems: 'center',
    width: '100%',
    maxWidth: 1500,
    alignSelf: 'center',
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    marginBottom: 30,
    maxWidth: '80%',
  },
  tabContainer: {
    width: '100%',
    marginBottom: 30,
    alignItems: 'center',
  },
  tabsWrapper: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 50,
    padding: 4,
    maxWidth: 350,
    width: '90%',
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center', // Ensures vertical centering
    borderRadius: 50,
    paddingHorizontal: 8, // Add horizontal padding to prevent text from touching edges
  },
  activeTab: {
    backgroundColor: '#2357FF',
  },
  tabText: {
    color: '#333',
    fontWeight: '500',
    textAlign: 'center', // Ensures horizontal centering
  },
  activeTabText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  // FlatList styles
  cardList: {
    width: '100%',
  },
  columnWrapper: {
    justifyContent: 'space-between',
    gap: 20,
  },
  // Card styles
  cardContainer: {
    flex: 1,
    marginBottom: 30,
  },
  cardContainerMobile: {
    maxWidth: '100%',
  },
  cardImage: {
    width: '100%',
    height: 300,
    borderRadius: 10,
    marginBottom: 15,
  },
  cardImageMobile: {
    height: 200,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 8,
  },
  cardText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  // Button styles
  button: {
    backgroundColor: '#2357FF',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 30,
    marginTop: 20,
    alignSelf: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});