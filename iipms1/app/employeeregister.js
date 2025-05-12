import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import Icon from 'react-native-vector-icons/Feather';

const Register = () => {
  const [formData, setFormData] = useState({
    initial: '',
    name: '',
    employeeId: '',
    role: 'software_engineer',
    department: '',
    roleType: 'Employee',
    phoneNo: '',
  });

  const handleInputChange = (key, value) => {
    setFormData({ ...formData, [key]: value });
  };

  const handleSubmit = () => {
    // Here you would typically send formData to a backend API
    console.log('Registering:', formData);
    // Navigate back or to another page after successful registration
    router.push('/');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.innerContainer}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Icon name="arrow-left" size={20} color="#000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Employee Registration</Text>
        </View>

        {/* Form */}
        <View style={styles.formContainer}>
          <Text style={styles.label}>Initial</Text>
          <TextInput
            style={styles.input}
            value={formData.initial}
            onChangeText={(text) => handleInputChange('initial', text)}
            placeholder="e.g., R"
          />

          <Text style={styles.label}>Full Name</Text>
          <TextInput
            style={styles.input}
            value={formData.name}
            onChangeText={(text) => handleInputChange('name', text)}
            placeholder="e.g., Robert Brown"
          />

          <Text style={styles.label}>Employee ID</Text>
          <TextInput
            style={styles.input}
            value={formData.employeeId}
            onChangeText={(text) => handleInputChange('employeeId', text)}
            placeholder="e.g., E103"
          />

          <Text style={styles.label}>Role</Text>
          <TextInput
            style={styles.input}
            value={formData.role}
            onChangeText={(text) => handleInputChange('role', text)}
            placeholder="e.g., software_engineer"
          />

          <Text style={styles.label}>Department</Text>
          <TextInput
            style={styles.input}
            value={formData.department}
            onChangeText={(text) => handleInputChange('department', text)}
            placeholder="e.g., Vice Counsellor"
          />

          <Text style={styles.label}>Role Type</Text>
          <Picker
            selectedValue={formData.roleType}
            style={styles.picker}
            onValueChange={(itemValue) => handleInputChange('roleType', itemValue)}
          >
            <Picker.Item label="Employee" value="Employee" />
            <Picker.Item label="Manager" value="Manager" />
          </Picker>

          <Text style={styles.label}>Phone Number</Text>
          <TextInput
            style={styles.input}
            value={formData.phoneNo}
            onChangeText={(text) => handleInputChange('phoneNo', text)}
            placeholder="e.g., 6543210987"
            keyboardType="phone-pad"
          />

          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitButtonText}>Register</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  innerContainer: {
    flex: 1,
    paddingHorizontal: 15,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  backButton: {
    padding: 10,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#003087',
    marginLeft: 10,
  },
  formContainer: {
    flex: 1,
    paddingVertical: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#003087',
    marginBottom: 5,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    fontSize: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  picker: {
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  submitButton: {
    backgroundColor: '#2a3eb1',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Register;