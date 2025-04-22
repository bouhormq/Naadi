import { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet,
  TouchableOpacity
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: "How much does it cost to join Naadi?",
      answer: "It's completely free to join Naadi as a partner. There are no setup fees, monthly charges, or hidden costs. You only pay a small commission on bookings made through the platform."
    },
    {
      question: "How do I control my availability on Naadi?",
      answer: "You have full control over your schedule. You can block times, limit spots available to Naadi members, and adjust availability in real-time through your partner dashboard."
    },
    {
      question: "Will Naadi affect my existing clients?",
      answer: "No. Naadi is designed to complement your existing partner by helping you fill spots that would otherwise go empty."
    },
    {
      question: "Does Naadi work with my booking system?",
      answer: "Naadi integrates with most major booking and management systems. Our team can help you set up the integration to ensure a seamless experience."
    }
  ];

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Frequently asked questions</Text>
      </View>

      <View style={styles.faqContainer}>
        {faqs.map((faq, index) => (
          <View key={index} style={styles.faqItem}>
            <TouchableOpacity 
              style={styles.faqQuestion}
              onPress={() => toggleFAQ(index)}
            >
              <Text style={styles.questionText}>{faq.question}</Text>
              <Ionicons 
                name={openIndex === index ? "chevron-up" : "chevron-down"} 
                size={20} 
                color="#666" 
              />
            </TouchableOpacity>
            {openIndex === index && (
              <View style={styles.faqAnswer}>
                <Text style={styles.answerText}>{faq.answer}</Text>
              </View>
            )}
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  faqContainer: {
    width: '100%',
  },
  faqItem: {
    borderBottomWidth: 1,
    borderBottomColor: '#e6e6e6',
  },
  faqQuestion: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
  },
  questionText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    flex: 1,
    paddingRight: 10,
  },
  faqAnswer: {
    paddingBottom: 15,
  },
  answerText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 22,
  },
});