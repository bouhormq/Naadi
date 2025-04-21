import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView, // Keep ScrollView for the overall page structure
  FlatList,    // Import FlatList
  useWindowDimensions, // Import useWindowDimensions hook
} from 'react-native';
import { useRouter } from 'expo-router';


// --- Card Data ---
const businessCardData = [
  {
    id: 'b1',
    // NOTE: Ensure these paths are correct relative to your component file
    image: require('../assets/sign-up-image.webp'),
    title: 'Sign up for free',
    text: 'Fill out the form to become a Naadi partner at no cost to you.',
  },
  {
    id: 'b2',
    image: require('../assets/build-profile-image.webp'),
    title: 'Build your profile',
    text: 'Add details of your partner such as photos and descriptions of your services and amenities.',
  },
  {
    id: 'b3',
    image: require('../assets/increase-revenue-image.webp'),
    title: 'Increase revenue',
    text: 'Fill spots that often go unfilled, lower expenses, and increase profits.',
  },
];

const memberCardData = [
  {
    id: 'm1',
    image: require('../assets/book-classes-image.png'),
    title: 'Book classes and appointments',
    text: 'Naadi members get credits to book fitness classes and wellness appointments worldwide.',
  },
  {
    id: 'm2',
    image: require('../assets/custom-routine-image.png'),
    title: 'Create a custom routine',
    text: 'Users are able to book what they want, when they want to create a routine that works for them.',
  },
  {
    id: 'm3',
    image: require('../assets/save-money-image.webp'),
    title: 'Save on self-care',
    text: 'Naadi offers exclusive member rates and in-app promotions to keep reservations affordable.',
  },
];
// --- End Card Data ---

// Define a threshold for switching layouts (adjust as needed)
const DESKTOP_BREAKPOINT = 768;

export default function HeroSection() {
  const [activeTab, setActiveTab] = useState('partneres');
  const { width } = useWindowDimensions(); // Use the hook
  const router = useRouter();

  // Determine number of columns based on width
  const numColumns = width > DESKTOP_BREAKPOINT ? 3 : 1;
  const isDesktop = numColumns === 3;

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
      <Text style={styles.cardTitle}>{item.title}</Text>
      <Text style={styles.cardText}>{item.text}</Text>
    </View>
  );

  return (
    // Use ScrollView for the overall page content if needed,
    // otherwise View might be sufficient if this section itself isn't meant to scroll independently.
    <View style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.title}>How partnering with Naadi works</Text>
          <Text style={styles.subtitle}>
            Find out how to list your classes and appointments on Naadi to scale your business.
          </Text>

          {/* --- Tabs --- */}
          <View style={styles.tabContainer}>
            <View style={styles.tabsWrapper}>
              <TouchableOpacity
                style={[
                  styles.tab,
                  activeTab === 'partneres' && styles.activeTab,
                ]}
                onPress={() => setActiveTab('partneres')}
              >
                <Text style={[
                  styles.tabText,
                  activeTab === 'partneres' && styles.activeTabText,
                ]}>
                  For partneres
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.tab,
                  activeTab === 'members' && styles.activeTab,
                ]}
                onPress={() => setActiveTab('members')}
              >
                <Text style={[
                  styles.tabText,
                  activeTab === 'members' && styles.activeTabText,
                ]}>
                  For Naadi members
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* --- Cards using FlatList --- */}
          <FlatList
            key={numColumns} // Important: Change key when numColumns changes to force re-render
            data={currentCardData}
            renderItem={({ item }) => <Card item={item} isDesktopLayout={isDesktop} />}
            keyExtractor={(item) => item.id}
            numColumns={numColumns}
            style={styles.cardList}
            // Remove scrollEnabled if the outer ScrollView handles scrolling
            scrollEnabled={true}
            // Use ListFooterComponent for the button so it appears after the list items
            ListFooterComponent={() => (
                <TouchableOpacity style={styles.button} onPress={() => router.push('/signup')}>
                    <Text style={styles.buttonText}>Get Started</Text>
                </TouchableOpacity>
            )}
            // Add spacing between columns for desktop view
            columnWrapperStyle={numColumns > 1 ? styles.columnWrapper : null}
          />

        </View>
      </View>
  );
}

// --- Styles ---
const styles = StyleSheet.create({
  scrollViewContainer: {
    flexGrow: 1, // Ensures ScrollView takes up available space if content is short
  },
  container: {
    backgroundColor: '#f0f7ff',
    paddingVertical: 50,
    paddingHorizontal: 20,
    flex: 1, // Make container fill the ScrollView
  },
  content: {
    alignItems: 'center',
    width: '100%', // Ensure content takes full width for centering
    maxWidth: 1500, // Optional: Max width for very large screens
    alignSelf: 'center', // Center the content block itself
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
    maxWidth: '80%', // Keep max width for text readability
  },
  tabContainer: {
    width: '100%',
    marginBottom: 30,
    alignItems: 'center', // Center the tabs wrapper
  },
  tabsWrapper: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 50,
    padding: 4,
    maxWidth: 350, // Keep max width for the tabs
    width: '90%', // Make it slightly responsive
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 50,
  },
  activeTab: {
    backgroundColor: '#2357FF',
  },
  tabText: {
    color: '#333',
    fontWeight: '500',
    fontSize: 14, // Adjusted for potentially smaller space
  },
  activeTabText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  // FlatList styles
  cardList: {
    width: '100%', // FlatList takes full width of its container
  },
  columnWrapper: {
    justifyContent: 'space-between', // Distribute space between columns
    // Use gap for spacing (React Native 0.71+)
    gap: 20,
    // If using older RN or need specific margin control, comment out gap
    // and uncomment marginHorizontal on cardContainer
  },
  // Card styles
  cardContainer: {
    flex: 1, // Allows cards to grow/shrink within the column structure
    marginBottom: 30, // Space below each card row
    // If not using 'gap' in columnWrapperStyle, add horizontal margin here:
    // marginHorizontal: 10, // Example for spacing if gap isn't used
    // Adjust maxWidth if needed when using margins instead of gap
    // maxWidth: '32%',
  },
  cardContainerMobile: {
     maxWidth: '100%', // Ensure mobile cards take full width
     // Remove horizontal margins if they were added for desktop via marginHorizontal
     // marginHorizontal: 0,
  },
  cardImage: {
    width: '100%',
    height: 300, // Desktop height
    borderRadius: 10,
    marginBottom: 15,
  },
  cardImageMobile: {
    height: 200, // Mobile height (adjust as needed)
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
    marginTop: 20, // Appears after the last card/row (adjust if marginBottom on card is enough)
    alignSelf: 'center', // Center the button
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});