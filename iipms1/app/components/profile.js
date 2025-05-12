import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import Icon from 'react-native-vector-icons/Feather'; // For icons

const Profile = ({ visible, onClose, onLogout }) => {
  const userDetails = {
    initial: 'R',
    name: 'Robert Brown',
    employeeId: 'E103',
    role: 'software_engineer',
    department: 'Vice Counsellor',
    roleType: 'Employee',
    phoneNo: '6543210987',
    managerId: 'E101',
  };

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
            <Icon name="x" size={24} color="#fff" />
          </TouchableOpacity>

          {/* Profile Image Placeholder */}
          <View style={styles.profileImage}>
            <Text style={styles.profileInitial}>{userDetails.initial}</Text>
          </View>

          {/* User Details */}
          <Text style={styles.profileName}>{userDetails.name}</Text>

          <View style={styles.detailRow}>
            <Icon name="user" size={18} color="#fff" style={styles.detailIcon} />
            <Text style={styles.detailText}>Employee ID: {userDetails.employeeId}</Text>
          </View>

          <View style={styles.detailRow}>
            <Icon name="briefcase" size={18} color="#fff" style={styles.detailIcon} />
            <Text style={styles.detailText}>Role: {userDetails.role}</Text>
          </View>

          <View style={styles.detailRow}>
            <Icon name="grid" size={18} color="#fff" style={styles.detailIcon} />
            <Text style={styles.detailText}>Department: {userDetails.department}</Text>
          </View>

          <View style={styles.detailRow}>
            <Icon name="users" size={18} color="#fff" style={styles.detailIcon} />
            <Text style={styles.detailText}>RoleType: {userDetails.roleType}</Text>
          </View>

          <View style={styles.detailRow}>
            <Icon name="phone" size={18} color="#fff" style={styles.detailIcon} />
            <Text style={styles.detailText}>PhoneNo: {userDetails.phoneNo}</Text>
          </View>

          <View style={styles.detailRow}>
            <Icon name="user-check" size={18} color="#fff" style={styles.detailIcon} />
            <Text style={styles.detailText}>Manager Id: {userDetails.managerId}</Text>
          </View>

          {/* Logout Button */}
          <TouchableOpacity style={styles.logoutButton} onPress={onLogout}>
            <Icon name="log-out" size={18} color="#fff" style={styles.logoutIcon} />
            <Text style={styles.logoutButtonText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#003087',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
  },
  closeButton: {
    alignSelf: 'flex-end',
    padding: 10,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  profileInitial: {
    fontSize: 40,
    color: '#003087',
    fontWeight: 'bold',
  },
  profileName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  detailIcon: {
    marginRight: 10,
  },
  detailText: {
    fontSize: 16,
    color: '#fff',
  },
  logoutButton: {
    flexDirection: 'row',
    backgroundColor: '#ff0000',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  logoutIcon: {
    marginRight: 10,
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Profile;