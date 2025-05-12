import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Modal, Platform, ImageBackground, Dimensions, ScrollView, KeyboardAvoidingView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as Animatable from 'react-native-animatable';
import { router } from 'expo-router';

const LeaveApplication = ({ navigation }) => {
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString('en-US', { hour12: true }));
  const [leaveType, setLeaveType] = useState('');
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [reason, setReason] = useState('');
  const [showFromDatePicker, setShowFromDatePicker] = useState(false);
  const [showToDatePicker, setShowToDatePicker] = useState(false);
  const { height } = Dimensions.get("window");

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString('en-US', { hour12: true }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatDate = (date) => {
    if (!date) return 'dd-mm-yyyy';
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const handleFromDateChange = (event, selectedDate) => {
    setShowFromDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      setFromDate(selectedDate);
      if (Platform.OS !== 'ios') setShowFromDatePicker(false);
    }
  };

  const handleToDateChange = (event, selectedDate) => {
    setShowToDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      setToDate(selectedDate);
      if (Platform.OS !== 'ios') setShowToDatePicker(false);
    }
  };

  const handleSubmit = () => {
    const formattedFromDate = fromDate ? formatDate(fromDate) : '';
    const formattedToDate = toDate ? formatDate(toDate) : '';
    console.log('Leave Request:', { leaveType, fromDate: formattedFromDate, toDate: formattedToDate, reason });
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollViewContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.innerContainer}>
            <Animatable.View animation="fadeInDown" style={styles.header}>
              <View style={styles.headerCenter}>
                <ImageBackground
                  style={{
                    height: height / 5,
                    width: 200,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                  resizeMode="contain"
                  source={require('../assets/images/logo.png')}
                />
                <Text style={styles.headerSubLogo}>IIPMS</Text>
              </View>
              <View style={styles.headerRight}>
                <Text style={styles.time}>{currentTime}</Text>
              </View>
            </Animatable.View>

            <View style={styles.navTabs}>
              <TouchableOpacity style={styles.tab} onPress={() => router.push('/dashboard')}>
                <Text style={styles.tabText}>Home</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.tab, styles.activeTab]}>
                <Text style={[styles.tabText, styles.activeTabText]}>My Workspace</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.tab} onPress={() => router.push('/dashboard')}>
                <Text style={styles.tabText}>My Hours Dashboard</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.buttonSection}>
              {['MY TIMESHEET', 'APPLY LEAVE', 'VIEW LEAVE STATUS'].map((label, index) => (
                <Animatable.View key={index} animation="bounceIn" delay={index * 100}>
                  <TouchableOpacity
                    style={[styles.button, label === 'APPLY LEAVE' && styles.activeButton]}
                    onPress={() => {
                      if (label === 'MY TIMESHEET') router.push('/timesheet');
                      if (label === 'VIEW LEAVE STATUS') router.push('/leavestatus');
                    }}
                  >
                    <Text style={[styles.buttonText, label === 'APPLY LEAVE' && styles.activeButtonText]}>{label}</Text>
                  </TouchableOpacity>
                </Animatable.View>
              ))}
            </View>

            <View style={styles.formContainer}>
              <Text style={styles.formTitle}>Leave Application Form</Text>

              <View style={styles.formField}>
                <Text style={styles.inputLabel}>Leave Type *</Text>
                <View style={styles.pickerContainer}>
                  <Picker
                    selectedValue={leaveType}
                    onValueChange={(itemValue) => setLeaveType(itemValue)}
                    style={styles.picker}
                  >
                    <Picker.Item label="Select a leave type..." value="" />
                    <Picker.Item label="Sick Leave" value="sick" />
                    <Picker.Item label="Casual Leave" value="casual" />
                    <Picker.Item label="Annual Leave" value="annual" />
                  </Picker>
                </View>
              </View>

              <View style={styles.formField}>
                <Text style={styles.inputLabel}>From Date *</Text>
                <TouchableOpacity
                  style={styles.dateInput}
                  onPress={() => setShowFromDatePicker(true)}
                >
                  <Text style={styles.dateText}>{formatDate(fromDate)}</Text>
                </TouchableOpacity>
              </View>

              {showFromDatePicker && (
                <Modal
                  animationType="fade"
                  transparent={true}
                  visible={showFromDatePicker}
                  onRequestClose={() => setShowFromDatePicker(false)}
                >
                  <View style={styles.datePickerContainer}>
                    <View style={[styles.datePickerContent, Platform.OS === 'ios' && styles.iosDatePickerContent]}>
                      <DateTimePicker
                        value={fromDate || new Date()}
                        mode="date"
                        display={Platform.OS === 'ios' ? 'spinner' : 'calendar'}
                        onChange={handleFromDateChange}
                        style={styles.datePicker}
                        textColor={Platform.OS === 'ios' ? '#fff' : undefined}
                      />
                      {Platform.OS === 'ios' && (
                        <View style={styles.datePickerButtons}>
                          <TouchableOpacity
                            style={[styles.datePickerButton, styles.cancelButton]}
                            onPress={() => setShowFromDatePicker(false)}
                          >
                            <Text style={styles.datePickerButtonText}>Cancel</Text>
                          </TouchableOpacity>
                          <TouchableOpacity
                            style={[styles.datePickerButton, styles.confirmButton]}
                            onPress={() => setShowFromDatePicker(false)}
                          >
                            <Text style={styles.datePickerButtonText}>Confirm</Text>
                          </TouchableOpacity>
                        </View>
                      )}
                    </View>
                  </View>
                </Modal>
              )}

              <View style={styles.formField}>
                <Text style={styles.inputLabel}>To Date *</Text>
                <TouchableOpacity
                  style={styles.dateInput}
                  onPress={() => setShowToDatePicker(true)}
                >
                  <Text style={styles.dateText}>{formatDate(toDate)}</Text>
                </TouchableOpacity>
              </View>

              {showToDatePicker && (
                <Modal
                  animationType="fade"
                  transparent={true}
                  visible={showToDatePicker}
                  onRequestClose={() => setShowToDatePicker(false)}
                >
                  <View style={styles.datePickerContainer}>
                    <View style={[styles.datePickerContent, Platform.OS === 'ios' && styles.iosDatePickerContent]}>
                      <DateTimePicker
                        value={toDate || new Date()}
                        mode="date"
                        display={Platform.OS === 'ios' ? 'spinner' : 'calendar'}
                        onChange={handleToDateChange}
                        style={styles.datePicker}
                        textColor={Platform.OS === 'ios' ? '#fff' : undefined}
                      />
                      {Platform.OS === 'ios' && (
                        <View style={styles.datePickerButtons}>
                          <TouchableOpacity
                            style={[styles.datePickerButton, styles.cancelButton]}
                            onPress={() => setShowToDatePicker(false)}
                          >
                            <Text style={styles.datePickerButtonText}>Cancel</Text>
                          </TouchableOpacity>
                          <TouchableOpacity
                            style={[styles.datePickerButton, styles.confirmButton]}
                            onPress={() => setShowToDatePicker(false)}
                          >
                            <Text style={styles.datePickerButtonText}>Confirm</Text>
                          </TouchableOpacity>
                        </View>
                      )}
                    </View>
                  </View>
                </Modal>
              )}

              <View style={styles.formField}>
                <Text style={styles.inputLabel}>Reason *</Text>
                <TextInput
                  style={[styles.input, styles.reasonInput]}
                  value={reason}
                  onChangeText={setReason}
                  placeholder="Briefly explain the reason for your leave..."
                  multiline
                />
              </View>

              <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                <Text style={styles.submitButtonText}>Submit Leave Request</Text>
              </TouchableOpacity>

              <Text style={styles.noteText}>
                Please apply at least 5 business days before your leave start date.
              </Text>
            </View>

            <View style={styles.footer}>
              <Text style={styles.footerText}>© 2025 Intellisurge Technologies. All Rights Reserved.</Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  keyboardAvoidingContainer: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    flexGrow: 1,
    paddingBottom: 20, // Ensure footer is visible
  },
  innerContainer: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  headerSubLogo: {
    fontSize: 30,
    color: '#ff0000',
    fontWeight: 'bold',
    fontStyle: 'italic',
    marginTop: 5,
  },
  headerRight: {
    position: 'absolute',
    right: 10,
    backgroundColor: '#003087',
    padding: 5,
    borderRadius: 5,
  },
  time: {
    fontSize: 12,
    color: '#fff',
  },
  navTabs: {
    flexDirection: 'row',
    backgroundColor: '#003087',
    paddingVertical: 5,
    paddingHorizontal: 10,
    justifyContent: 'space-around',
  },
  tab: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 20,
    backgroundColor: '#003087',
  },
  activeTab: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  tabText: {
    fontSize: 14,
    color: '#fff',
    fontWeight: '600',
  },
  activeTabText: {
    color: '#003087',
  },
  buttonSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
  },
  button: {
    backgroundColor: '#003087',
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 8,
    width: 100,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  activeButton: {
    backgroundColor: '#ff0000',
  },
  buttonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  activeButtonText: {
    color: '#fff',
  },
  formContainer: {
    flex: 1,
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 10,
    margin: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  formTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#003087',
    marginBottom: 20,
  },
  formField: {
    marginBottom: 15,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
  },
  picker: {
    height: 40,
    color: '#666',
  },
  dateInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
    justifyContent: 'center',
  },
  dateText: {
    fontSize: 14,
    color: '#333',
  },
  datePickerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  datePickerContent: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    width: 300,
    alignItems: 'center',
  },
  iosDatePickerContent: {
    backgroundColor: '#003087',
  },
  datePicker: {
    width: 300,
  },
  datePickerButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 10,
  },
  datePickerButton: {
    paddingVertical: 10,
    borderRadius: 5,
    width: 120,
    alignItems: 'center',
  },
  confirmButton: {
    backgroundColor: '#fff',
  },
  cancelButton: {
    backgroundColor: '#ff0000',
  },
  datePickerButtonText: {
    color: '#003087',
    fontSize: 14,
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
    fontSize: 14,
    color: '#333',
  },
  reasonInput: {
    height: 80,
    textAlignVertical: 'top',
  },
  submitButton: {
    backgroundColor: '#003087',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  noteText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    marginTop: 15,
  },
  footer: {
    backgroundColor: '#003087',
    padding: 12,
    alignItems: 'center',
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  footerText: {
    color: '#fff',
    fontSize: 12,
    fontStyle: 'italic',
  },
});

export default LeaveApplication;