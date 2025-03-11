import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { Link } from 'expo-router';

interface HeaderProps {
  title?: string;
}

export default function Header({ title = 'Naadi' }: HeaderProps) {
  return (
    <View style={styles.header}>
      <Text style={styles.title}>{title}</Text>
      
      <Link href="https://naadi.ma/business" asChild>
        <TouchableOpacity style={styles.businessButton}>
          <Text style={styles.businessButtonText}>For Businesses</Text>
        </TouchableOpacity>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    ...Platform.select({
      web: {
        position: 'sticky',
        top: 0,
        zIndex: 100,
      },
    }),
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  businessButton: {
    backgroundColor: '#4A90E2',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
  },
  businessButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
}); 