import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Modal, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import Icon from 'react-native-vector-icons/Feather';
import { Picker } from '@react-native-picker/picker';

const AdminEmployeeDetails = () => {
  // Mock employee data
  const [employees, setEmployees] = useState([
    {
      initial: 'R',
      name: 'Robert Brown',
      employeeId: 'E103',
      role: 'software_engineer',
      department: 'Vice Counsellor',
      roleType: 'Employee',
      phoneNo: '6543210987',
      emailId: 'schalamc@gmail.com',
      date: '2023-05-06',
      address: '123 Main St, Anytown USA',
    },
    {
      initial: 'M',
      name: 'Mary Johnson',
      employeeId: 'M201',
      role: 'project_manager',
      department: 'Operations',
      roleType: 'Manager',
      phoneNo: '9876543210',
      emailId: 'schalamc@gmail.com',
      date: '2023-05-06',
      address: '456 Elm St, Anytown USA',
    },
  ]);

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [editForm, setEditForm] = useState({
    initial: '',
    name: '',
    employeeId: '',
    role: '',
    department: '',
    roleType: '',
    phoneNo: '',
    emailId: '',
    date: '',
    address: '',
  });

  const handleEdit = (employee) => {
    setSelectedEmployee(employee);
    setEditForm(employee);
    setModalVisible(true);
  };

  const handleUpdate = () => {
    // Validate employeeId prefix
    const prefix = editForm.roleType === 'Employee' ? 'E' : 'M';
    if (!editForm.employeeId.startsWith(prefix)) {
      alert(`Employee ID must start with '${prefix}'`);
      return;
    }

    // Update employee in the list
    setEmployees(
      employees.map((emp) =>
        emp.employeeId === selectedEmployee.employeeId ? editForm : emp
      )
    );
    setModalVisible(false);
    setSelectedEmployee(null);
  };

  const handleDelete = (employeeId) => {
    setEmployees(employees.filter((emp) => emp.employeeId !== employeeId));
  };

  const handleInputChange = (key, value) => {
    setEditForm({ ...editForm, [key]: value });
  };

  const renderEmployee = ({ item }) => (
    <View style={styles.employeeCard}>
      <View style={styles.employeeInfo}>
        <Text style={styles.employeeName}>{item.name} ({item.initial})</Text>
        <Text style={styles.employeeDetail}>ID: {item.employeeId}</Text>
        <Text style={styles.employeeDetail}>Role: {item.role}</Text>
        <Text style={styles.employeeDetail}>Department: {item.department}</Text>
        <Text style={styles.employeeDetail}>Type: {item.roleType}</Text>
        <Text style={styles.employeeDetail}>Phone: {item.phoneNo}</Text>
        <Text style={styles.employeeDetail}>Email: {item.emailId}</Text>
        <Text style={styles.employeeDetail}>Hire date: {item.date}</Text>
        <Text style={styles.employeeDetail}>Address: {item.address}</Text>


      </View>
      <View style={styles.employeeActions}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => handleEdit(item)}
        >
          <Icon name="edit" size={20} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: '#ff0000' }]}
          onPress={() => handleDelete(item.employeeId)}
        >
          <Icon name="trash-2" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.innerContainer}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <Icon name="arrow-left" size={20} color="#000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Employee Details</Text>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionSection}>
          <TouchableOpacity
            style={styles.actionButtonLarge}
            onPress={() => router.push('/employeeregister')}
          >
            <Text style={styles.actionButtonText}>Add New Employee</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButtonLarge}
            onPress={() => router.push('/employeeattend')}
          >
            <Text style={styles.actionButtonText}>View Attendance Reports</Text>
          </TouchableOpacity>
        </View>

        {/* Employee List */}
        <FlatList
          data={employees}
          renderItem={renderEmployee}
          keyExtractor={(item) => item.employeeId}
          contentContainerStyle={styles.listContainer}
        />

        {/* Edit Modal */}
        <Modal visible={modalVisible} animationType="slide" transparent={true}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Edit Employee</Text>

              <Text style={styles.label}>Initial</Text>
              <TextInput
                style={styles.input}
                value={editForm.initial}
                onChangeText={(text) => handleInputChange('initial', text)}
                placeholder="e.g., R"
              />

              <Text style={styles.label}>Full Name</Text>
              <TextInput
                style={styles.input}
                value={editForm.name}
                onChangeText={(text) => handleInputChange('name', text)}
                placeholder="e.g., Robert Brown"
              />

              <Text style={styles.label}>Employee ID</Text>
              <TextInput
                style={styles.input}
                value={editForm.employeeId}
                onChangeText={(text) => handleInputChange('employeeId', text)}
                placeholder={`e.g., ${editForm.roleType === 'Employee' ? 'E103' : 'M103'}`}
              />

              <Text style={styles.label}>Role</Text>
              <TextInput
                style={styles.input}
                value={editForm.role}
                onChangeText={(text) => handleInputChange('role', text)}
                placeholder="e.g., software_engineer"
              />

              <Text style={styles.label}>Department</Text>
              <TextInput
                style={styles.input}
                value={editForm.department}
                onChangeText={(text) => handleInputChange('department', text)}
                placeholder="e.g., Vice Counsellor"
              />

              <Text style={styles.label}>Role Type</Text>
              <Picker
                selectedValue={editForm.roleType}
                style={styles.picker}
                onValueChange={(itemValue) =>
                  handleInputChange('roleType', itemValue)
                }
              >
                <Picker.Item label="Employee" value="Employee" />
                <Picker.Item label="Manager" value="Manager" />
              </Picker>

              <Text style={styles.label}>Phone Number</Text>
              <TextInput
                style={styles.input}
                value={editForm.phoneNo}
                onChangeText={(text) => handleInputChange('phoneNo', text)}
                placeholder="e.g., 6543210987"
                keyboardType="phone-pad"
              />

              <View style={styles.modalActions}>
                <TouchableOpacity
                  style={styles.modalButton}
                  onPress={handleUpdate}
                >
                  <Text style={styles.modalButtonText}>Save</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalButton, { backgroundColor: '#cccccc' }]}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={styles.modalButtonText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
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
  actionSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 15,
  },
  actionButtonLarge: {
    backgroundColor: '#2a3eb1',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    flex: 1,
    marginHorizontal: 5,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  listContainer: {
    paddingBottom: 20,
  },
  employeeCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  employeeInfo: {
    flex: 3,
  },
  employeeName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#003087',
    marginBottom: 5,
  },
  employeeDetail: {
    fontSize: 14,
    color: '#333',
    marginBottom: 3,
  },
  employeeActions: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  actionButton: {
    backgroundColor: '#2a3eb1',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    alignItems: 'center',
    width: 50,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    padding: 20,
    borderRadius: 10,
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#003087',
    marginBottom: 15,
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
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    backgroundColor: '#2a3eb1',
    paddingVertical: 15,
    borderRadius: 10,
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default AdminEmployeeDetails;