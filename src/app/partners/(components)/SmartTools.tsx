import {
  View,
  Text,
  StyleSheet,
  Image,
  // Dimensions, // No longer needed
  useWindowDimensions, // Import the hook
} from 'react-native';

// Define a breakpoint for switching layouts (adjust as needed)
const TWO_COLUMN_BREAKPOINT = 768; // Example: Tablets and wider get 2 columns

export default function SmartToolsSection() {
  const { width } = useWindowDimensions(); // Get screen width

  // Determine if we should use the two-column layout
  const isTwoColumnLayout = width >= TWO_COLUMN_BREAKPOINT;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>
          SmartTools <Text style={styles.highlight}>101</Text>
        </Text>
        <Text style={styles.subtitle}>
          SmartTools, an intelligent spot management system, uses real-time data to predict empty spots and adjust rates to fill them.
        </Text>
      </View>

      {/* Apply conditional styles to the container */}
      <View style={[
        styles.toolsContainerBase,
        isTwoColumnLayout && styles.toolsContainerRow // Apply row styles if wide enough
      ]}>
        {/* Apply conditional styles to each card */}
        <View style={[
          styles.toolCardBase,
          isTwoColumnLayout && styles.toolCardTwoColumn // Apply two-column card styles if needed
        ]}>
          <Image
            source={require('../(assets)/smart-spot.webp')} // Ensure path is correct
            style={styles.toolImage}
            resizeMode="cover" // Added resizeMode for better image handling
          />
          <Text style={styles.toolTitle}>
            Smart<Text style={styles.highlight}>Spot</Text>
          </Text>
          <Text style={styles.toolDescription}>
            By analyzing historic booking patterns, SmartSpot only lists spots that you're less likely to fill on your own, so you can protect your direct clientele.
          </Text>
        </View>

        <View style={[
          styles.toolCardBase,
          isTwoColumnLayout && styles.toolCardTwoColumn // Apply two-column card styles if needed
        ]}>
          <Image
            source={require('../(assets)/smart-rate.webp')} // Ensure path is correct
            style={styles.toolImage}
            resizeMode="cover" // Added resizeMode for better image handling
          />
          <Text style={styles.toolTitle}>
            Smart<Text style={styles.highlight}>Rate</Text>
          </Text>
          <Text style={styles.toolDescription}>
            SmartRate dynamically prices your available spots based on factors like popularity, location and time to help you optimize your revenue.
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    paddingVertical: 40,
    paddingHorizontal: 20,
    alignItems: 'center', // Center content like header and tools container
  },
  header: {
    alignItems: 'center',
    marginBottom: 40, // Increased margin
    width: '100%', // Ensure header takes full width for text centering
    maxWidth: 800, // Optional: Limit header width for readability
  },
  title: {
    fontSize: 32, // Larger title
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 15, // Increased margin
  },
  highlight: {
    color: '#0077ff', // Use your brand's highlight color
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24, // Improved line height
  },
  // --- Layout Styles ---
  toolsContainerBase: {
    width: '100%',
    maxWidth: 1000, // Max width for the tools section on very wide screens
  },
  toolsContainerRow: {
    flexDirection: 'row', // Arrange cards horizontally
    justifyContent: 'space-between', // Distribute space between cards
    // You can use 'gap' for spacing (RN >= 0.71) or adjust card width/margins
    gap: 20, // Spacing between the two columns
  },
  toolCardBase: {
    // Common styles for cards in both layouts
    borderRadius: 12,
    padding: 20,
    // Default: 1-column layout settings
    marginBottom: 30, // Space below cards in 1-column mode
    width: '100%', // Takes full width in 1-column mode
  },
  toolCardTwoColumn: {
    // Styles specific to the 2-column layout
    // Calculate width: (100% - gap) / 2
    // Example: (100% - 20px gap requires more complex calc or flex basis)
    // Using flex: 1 is often easier with gap:
    flex: 1, // Each card takes equal space
    // Or set explicit width if preferred (adjust based on gap):
    // width: '48%', // Example: (100% - 4% gap)/2
    marginBottom: 0, // No bottom margin needed in row layout if container handles alignment
  },
  // --- Content Styles ---
  toolImage: {
    width: '100%',
    height: 330, // Keep height or adjust if needed
    borderRadius: 10, // Slightly rounder corners
    marginBottom: 20, // Increased margin
  },
  toolTitle: {
    fontSize: 22, // Larger tool title
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10, // Increased margin
  },
  toolDescription: {
    fontSize: 15, // Slightly larger description
    color: '#555', // Darker gray
    lineHeight: 23,
  },
});