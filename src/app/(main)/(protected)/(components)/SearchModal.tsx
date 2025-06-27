import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Categories from './Categories';

interface SearchModalProps {
  visible: boolean;
  onClose: () => void;
}

const SearchModal: React.FC<SearchModalProps> = ({ visible, onClose }) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close" size={28} color="black" />
          </TouchableOpacity>
          <ScrollView>
            <View style={styles.inputContainer}>
              <Ionicons name="search-outline" size={24} color="gray" style={styles.inputIcon} />
              <TextInput placeholder="Activity or venue" style={styles.input} />
            </View>
            <View style={styles.inputContainer}>
              <Ionicons name="location-outline" size={24} color="gray" style={styles.inputIcon} />
              <TextInput placeholder="Current location" style={styles.input} />
            </View>
            <View style={styles.dateContainer}>
              <TouchableOpacity style={styles.dateInput}>
                <Ionicons name="calendar-outline" size={24} color="gray" style={styles.inputIcon} />
                <Text style={styles.dateText}>Any date</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.dateInput}>
                <Ionicons name="time-outline" size={24} color="gray" style={styles.inputIcon} />
                <Text style={styles.dateText}>Any time</Text>
              </TouchableOpacity>
            </View>
            <Categories variant="modal" />
          </ScrollView>
          <TouchableOpacity style={styles.searchButton}>
            <Text style={styles.searchButtonText}>Search</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    height: '90%',
  },
  closeButton: {
    alignSelf: 'flex-end',
    marginBottom: 10,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 15,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 50,
    fontSize: 16,
  },
  dateContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  dateInput: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 10,
    width: '48%',
  },
  dateText: {
    fontSize: 16,
    color: '#333',
  },
  searchButton: {
    backgroundColor: 'black',
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 20,
  },
  searchButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default SearchModal;
