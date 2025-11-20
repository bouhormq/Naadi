import React, { useState } from 'react';
import { View, TouchableOpacity, Modal, ScrollView, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import CustomText from '@/components/CustomText';
import { styles } from '../styles';

interface ClientSourceModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: () => void;
  editing: any | null;
  name: string;
  setName: (text: string) => void;
  active: boolean;
  setActive: (active: boolean) => void;
}

export default function ClientSourceModal({ 
  visible, 
  onClose, 
  onSave, 
  editing, 
  name, 
  setName, 
  active, 
  setActive 
}: ClientSourceModalProps) {
  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <View style={styles.fullScreenModal}>
        <View style={styles.modalHeader}>
          <CustomText style={styles.modalTitle}>{editing ? 'Edit client sources' : 'Add client sources'}</CustomText>
          <View style={styles.modalHeaderButtons}>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <CustomText style={styles.closeButtonText}>Close</CustomText>
            </TouchableOpacity>
            <TouchableOpacity style={styles.saveButton} onPress={onSave}>
              <CustomText style={styles.saveButtonText}>{editing ? 'Save' : 'Add'}</CustomText>
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView contentContainerStyle={styles.modalContent}>
           <CustomText style={styles.label}>Client source name</CustomText>
           <View style={styles.inputWrapper}>
              <TextInput 
                style={styles.input}
                value={name} 
                onChangeText={setName} 
                placeholder="e.g. Location promotion" 
                placeholderTextColor="#cbd5e1"
              />
           </View>

           <TouchableOpacity style={styles.checkboxRow} onPress={() => setActive(!active)}>
              <View style={[styles.checkbox, active && styles.checkboxActive]}>
                 {active && <Ionicons name="checkmark" size={14} color="#fff" />}
              </View>
              <CustomText style={styles.checkboxLabel}>Active</CustomText>
           </TouchableOpacity>
        </ScrollView>
      </View>
    </Modal>
  );
}
