import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator, SafeAreaView } from 'react-native';
import { useSession } from '@naadi/hooks/ctx';
import { editUser } from '@naadi/api';
import { useRouter } from 'expo-router';
import { User, PhoneInfo } from '@naadi/types';
import { Ionicons } from '@expo/vector-icons';
import PhoneInput from '@naadi/components/PhoneInput';

export default function EditProfileScreen() {
  const { session } = useSession();
  const router = useRouter();
  const [firstName, setFirstName] = useState(session?.firstName || '');
  const [lastName, setLastName] = useState(session?.lastName || '');
  const [email, setEmail] = useState(session?.email || '');
  const [phone, setPhone] = useState<PhoneInfo>(session?.phone || { code: 'MA', name: 'Morocco', dialCode: '+212', number: '' });
  type GenderType = "male" | "female" | undefined;
  const [gender, setGender] = useState<GenderType>(session?.gender);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dob, setDob] = useState({ day: '', month: '', year: '' });
  const genderOptions = [
    { label: 'Male', value: 'male' },
    { label: 'Female', value: 'female' },
  ];

  const handleSaveChanges = async () => {
    if (!session) return;

    setIsLoading(true);
    setError(null);

    const updatedData: Partial<User> = {
      firstName,
      lastName,
      email,
      phone,
      // gender is not in User type, so do not include it unless you add it to your User type
      // gender,
      // You may want to combine dob into a string or Date if you add it to your User type
    };

    try {
      const updatedUser = await editUser(session.uid, updatedData);
      if (updatedUser) {
        router.back();
      } else {
        setError('Failed to update profile.');
      }
    } catch (e: any) {
      setError(e.message || 'An error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Edit profile details</Text>
          <TouchableOpacity onPress={() => router.back()} style={styles.closeButton}>
            <Ionicons name="close" size={28} color="#000" />
          </TouchableOpacity>
        </View>
        <ScrollView style={styles.formContainer} showsVerticalScrollIndicator={false}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>First name</Text>
            <TextInput
              style={styles.input}
              value={firstName}
              onChangeText={setFirstName}
              placeholder="John"
              placeholderTextColor="black"
              autoCapitalize="words"
            />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Last name</Text>
            <TextInput
              style={styles.input}
              value={lastName}
              onChangeText={setLastName}
              placeholder="Smith"
              placeholderTextColor="black"
              autoCapitalize="words"
            />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Mobile number</Text>
            <PhoneInput
              value={phone}
              onChangeInfo={(newPhone) => setPhone(newPhone!)}
            />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email address</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="jsmith.mobbin9@gmail.com"
              placeholderTextColor="black"
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Date of birth</Text>
            <View style={styles.dobContainer}>
              <TextInput
                style={[styles.input, styles.dobInput]}
                placeholder="Day"
                placeholderTextColor="black"
                keyboardType="number-pad"
                maxLength={2}
                value={dob.day}
                onChangeText={d => setDob({ ...dob, day: d.replace(/[^0-9]/g, '') })}
              />
              <TextInput
                style={[styles.input, styles.dobInput]}
                placeholder="Month"
                placeholderTextColor="black"
                keyboardType="number-pad"
                maxLength={2}
                value={dob.month}
                onChangeText={m => setDob({ ...dob, month: m.replace(/[^0-9]/g, '') })}
              />
              <TextInput
                style={[styles.input, styles.dobInput]}
                placeholder="Year"
                placeholderTextColor="black"
                keyboardType="number-pad"
                maxLength={4}
                value={dob.year}
                onChangeText={y => setDob({ ...dob, year: y.replace(/[^0-9]/g, '') })}
              />
            </View>
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Gender</Text>
            <View style={styles.genderContainer}>
              {genderOptions.map(option => (
                <TouchableOpacity
                  key={option.label}
                  style={[styles.genderButton, gender === option.value && styles.genderButtonSelected]}
                  onPress={() => setGender(option.value as GenderType)}
                >
                  <Text style={[styles.genderButtonText, gender === option.value && styles.genderButtonTextSelected]}>
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {error && <Text style={styles.errorText}>{error}</Text>}
        </ScrollView>
        <View style={styles.footer}>
          <TouchableOpacity style={styles.saveButton} onPress={handleSaveChanges} disabled={isLoading}>
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.saveButtonText}>Save</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  container: {
    flex: 1,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    backgroundColor: 'white',
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  closeButton: {
    padding: 5,
  },
  formContainer: {
    paddingHorizontal: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: '#333',
    fontWeight: '500',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    backgroundColor: '#fafafa',
  },
  dobContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dobInput: {
    width: '32%',
    marginRight: 4,
  },
  genderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  genderButton: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 10,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 4,
    backgroundColor: '#fafafa',
  },
  genderButtonSelected: {
    backgroundColor: '#f0f0f0',
    borderColor: '#000',
  },
  genderButtonText: {
    fontSize: 16,
    color: '#000',
  },
  genderButtonTextSelected: {
  },
  selectText: {
    color: '#000',
    fontSize: 16,
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  saveButton: {
    backgroundColor: '#000',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginBottom: 10,
  },
});
