import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Modal, TextInput, ImageBackground } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Table, Row, Rows } from 'react-native-table-component';
import * as Animatable from 'react-native-animatable';
import { Picker } from '@react-native-picker/picker';
import { router } from 'expo-router';

const App = () => {
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString('en-US', { hour12: false }));
  const currentDate = new Date('2025-05-06');
  const weekStartDate = new Date('2025-04-14');
  const weekEndDate = new Date('2025-04-20');

  // State for tasks added by the employee
  const [tasks, setTasks] = useState([
    { projectName: 'HRMS', activityName: 'Frontend' },
    { projectName: 'Airwave', activityName: 'Backend' },
  ]);

  // State for timesheet data with login/logout tracking
  const [tableData, setTableData] = useState([
    { projectName: 'HRMS', activityName: 'Frontend', hours: ['00:00', '00:00', '00:00', '00:00', '00:00', '00:00', '00:00'], loginTimes: Array(7).fill(null), logoutTimes: Array(7).fill(null) },
    { projectName: 'Airwave', activityName: 'Backend', hours: ['00:00', '00:00', '00:00', '00:00', '00:00', '00:00', '00:00'], loginTimes: Array(7).fill(null), logoutTimes: Array(7).fill(null) },
    { projectName: 'HRMS', activityName: 'Frontend', hours: ['00:00', '00:00', '00:00', '00:00', '00:00', '00:00', '00:00'], loginTimes: Array(7).fill(null), logoutTimes: Array(7).fill(null) },
  ]);

  const [timeModalVisible, setTimeModalVisible] = useState(false);
  const [addTaskModalVisible, setAddTaskModalVisible] = useState(false);
  const [alertModalVisible, setAlertModalVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [selectedTaskIndex, setSelectedTaskIndex] = useState(null);
  const [selectedDayIndex, setSelectedDayIndex] = useState(null);
  const [selectedTime, setSelectedTime] = useState('');

  // State for adding a new task
  const [taskCategory, setTaskCategory] = useState('');
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [percentComplete, setPercentComplete] = useState('0');
  const [assignedBy, setAssignedBy] = useState('');

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // Update clock every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString('en-US', { hour12: false }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Generate week days for the table header
  const generateWeekDays = (startDate) => {
    const days = [];
    const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    
    for (let i = 0; i < 7; i++) {
      const currentDay = new Date(startDate);
      currentDay.setDate(startDate.getDate() + i);
      const dayName = dayNames[currentDay.getDay()];
      const date = currentDay.getDate().toString().padStart(2, '0');
      days.push(`${dayName} ${date}`);
    }
    return days;
  };

  const weekDays = generateWeekDays(weekStartDate);
  const tableHead = ['Actions', 'Project Name', 'Activity Name', ...weekDays];
  const columnWidths = [50, 150, 150, ...Array(7).fill(80)];

  // Format the week range for display
  const formatWeekRange = (startDate, endDate) => {
    const startStr = startDate.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).replace(/ /g, '-');
    const endStr = endDate.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).replace(/ /g, '-');
    return `${startStr} - ${endStr}`;
  };

  const weekRange = formatWeekRange(weekStartDate, weekEndDate);

  // Pagination logic
  const totalRows = tableData.length;
  const totalPages = Math.ceil(totalRows / rowsPerPage);
  const paginatedData = tableData.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

  // Calculate hours difference between login and logout times
  const calculateHoursDifference = (loginTime, logoutTime) => {
    if (!loginTime || !logoutTime) return '00:00';
    const [loginHours, loginMinutes] = loginTime.split(':').map(Number);
    const [logoutHours, logoutMinutes] = logoutTime.split(':').map(Number);
    const loginDate = new Date();
    loginDate.setHours(loginHours, loginMinutes, 0, 0);
    const logoutDate = new Date();
    logoutDate.setHours(logoutHours, logoutMinutes, 0, 0);
    const diffMs = logoutDate - loginDate;
    if (diffMs < 0) return '00:00';
    const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    return `${diffHrs.toString().padStart(2, '0')}:${diffMins.toString().padStart(2, '0')}`;
  };

  // Handle time slot click
  const handleTimeSlotClick = (taskIndex, dayIndex) => {
    const newTableData = [...tableData];
    const currentRow = newTableData[taskIndex];

    if (!currentRow.loginTimes[dayIndex]) {
      currentRow.loginTimes[dayIndex] = currentTime;
      setTableData(newTableData);
      setAlertMessage(`Your login time (${currentTime}) has been recorded.`);
      setAlertModalVisible(true);
    } else if (!currentRow.logoutTimes[dayIndex]) {
      currentRow.logoutTimes[dayIndex] = currentTime;
      const hoursWorked = calculateHoursDifference(currentRow.loginTimes[dayIndex], currentRow.logoutTimes[dayIndex]);
      currentRow.hours[dayIndex] = hoursWorked;
      setTableData(newTableData);
    } else {
      setSelectedTaskIndex(taskIndex);
      setSelectedDayIndex(dayIndex);
      setSelectedTime(currentRow.hours[dayIndex]);
      setTimeModalVisible(true);
    }
  };

  // Save the updated time (for manual edits)
  const handleTimeUpdate = () => {
    if (selectedTaskIndex !== null && selectedDayIndex !== null) {
      const newTableData = [...tableData];
      newTableData[selectedTaskIndex].hours[selectedDayIndex] = selectedTime || '00:00';
      setTableData(newTableData);
    }
    setTimeModalVisible(false);
    setSelectedTaskIndex(null);
    setSelectedDayIndex(null);
    setSelectedTime('');
  };

  // Update project name
  const handleProjectChange = (value, index) => {
    console.log('Selected Project:', value, 'Index:', index);
    const newTableData = [...tableData];
    newTableData[index].projectName = value;
    const matchingTask = tasks.find(task => task.projectName === value);
    newTableData[index].activityName = matchingTask ? matchingTask.activityName : '';
    setTableData(newTableData);
  };

  // Update activity name
  const handleActivityChange = (value, index) => {
    console.log('Selected Activity:', value, 'Index:', index);
    const newTableData = [...tableData];
    newTableData[index].activityName = value;
    setTableData(newTableData);
  };

  // Add a new task
  const handleAddTask = () => {
    const newTask = {
      projectName: taskCategory || 'N/A',
      activityName: taskTitle || 'N/A',
    };
    setTasks([...tasks, newTask]);

    setTableData([
      ...tableData,
      { projectName: taskCategory, activityName: taskTitle, hours: ['00:00', '00:00', '00:00', '00:00', '00:00', '00:00', '00:00'], loginTimes: Array(7).fill(null), logoutTimes: Array(7).fill(null) },
    ]);

    setTaskCategory('');
    setTaskTitle('');
    setTaskDescription('');
    setPercentComplete('0');
    setAssignedBy('');
    setAddTaskModalVisible(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.innerContainer}>
        {/* Navbar */}
        <Animatable.View animation="fadeInDown" style={styles.header}>
          <View style={styles.headerCenter}>
            <ImageBackground
              style={styles.logo}
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
          <TouchableOpacity onPress={() => router.push('./dashboard')} style={styles.tab}>
            <Text style={[styles.tabText]}>Home</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.tab, styles.activeTab]}>
            <Text style={[styles.tabText, styles.activeTabText]}>My Workspace</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.tab}>
            <Text style={styles.tabText}>My Hours Dashboard</Text>
          </TouchableOpacity>
        </View>

        {/* Timesheet */}
        <View style={styles.tableContainer}>
          <View style={styles.tableHeader}>
            <Text style={styles.tableHeaderText}>Add timesheet for week ({weekRange})</Text>
            <TouchableOpacity
              style={styles.addTaskButton}
              onPress={() => setAddTaskModalVisible(true)}
            >
              <Text style={styles.addTaskButtonText}>+ Add Task</Text>
            </TouchableOpacity>
          </View>
          <ScrollView horizontal>
            <View style={styles.tableWrapper}>
              <Table borderStyle={{ borderWidth: 1, borderColor: '#ddd' }}>
                <Row
                  data={tableHead}
                  style={styles.tableHead}
                  textStyle={styles.tableHeadText}
                  widthArr={columnWidths}
                  flexArr={Array(tableHead.length).fill(1)}
                />
                {paginatedData.map((rowData, rowIndex) => {
                  const actualIndex = (currentPage - 1) * rowsPerPage + rowIndex;
                  const projectActivities = tasks.filter(task => task.projectName === rowData.projectName).map(task => task.activityName);
                  return (
                    <Row
                      key={actualIndex}
                      data={[
                        <View style={styles.actionsCell}>
                          <TouchableOpacity>
                            <Text style={styles.actionIconText}>☑</Text>
                          </TouchableOpacity>
                        </View>,
                        <View style={styles.cell}>
                          <View style={styles.pickerRow}>
                            <View style={[styles.pickerContainer, rowData.projectName && styles.selectedPickerContainer]}>
                              <Picker
                                selectedValue={rowData.projectName}
                                onValueChange={(value) => handleProjectChange(value, actualIndex)}
                                style={styles.picker}
                                dropdownIconColor="#333"
                              >
                                <Picker.Item label="Select Project" value="" />
                                {[...new Set(tasks.map(task => task.projectName))].map((option, idx) => (
                                  <Picker.Item key={idx} label={option} value={option} />
                                ))}
                              </Picker>
                            </View>
                          </View>
                        </View>,
                        <View style={styles.cell}>
                          <View style={styles.pickerRow}>
                            <View style={[styles.pickerContainer, rowData.activityName && styles.selectedPickerContainer]}>
                              <Picker
                                selectedValue={rowData.activityName}
                                onValueChange={(value) => handleActivityChange(value, actualIndex)}
                                style={styles.picker}
                                enabled={projectActivities.length > 0}
                                dropdownIconColor="#333"
                              >
                                <Picker.Item label="Select Activity" value="" />
                                {projectActivities.map((option, idx) => (
                                  <Picker.Item key={idx} label={option} value={option} />
                                ))}
                              </Picker>
                            </View>
                          </View>
                        </View>,
                        ...rowData.hours.map((time, dayIndex) => (
                          <TouchableOpacity
                            key={dayIndex}
                            style={styles.cell}
                            onPress={() => handleTimeSlotClick(actualIndex, dayIndex)}
                          >
                            <View style={styles.timeCellContent}>
                              {rowData.loginTimes[dayIndex] ? (
                                <Text style={styles.timeDetailText}>
                                  In: {rowData.loginTimes[dayIndex].slice(0, 5)}
                                </Text>
                              ) : (
                                <Text style={styles.timeDetailText}>In: --:--</Text>
                              )}
                              {rowData.logoutTimes[dayIndex] ? (
                                <Text style={styles.timeDetailText}>
                                  Out: {rowData.logoutTimes[dayIndex].slice(0, 5)}
                                </Text>
                              ) : (
                                <Text style={styles.timeDetailText}>Out: --:--</Text>
                              )}
                              <Text style={styles.hoursText}>Hrs: {time}</Text>
                            </View>
                            <Text style={styles.commentIcon}>🗨️</Text>
                          </TouchableOpacity>
                        )),
                      ]}
                      style={styles.tableRow}
                      textStyle={styles.tableText}
                      widthArr={columnWidths}
                      flexArr={Array(tableHead.length).fill(1)}
                    />
                  );
                })}
              </Table>
            </View>
          </ScrollView>

          {/* Pagination */}
          <View style={styles.paginationContainer}>
            <View style={styles.pagination}>
              <Text style={styles.paginationText}>Rows per page: </Text>
              <Picker
                selectedValue={rowsPerPage}
                onValueChange={(value) => {
                  setRowsPerPage(value);
                  setCurrentPage(1);
                }}
                style={styles.paginationPicker}
              >
                {[5, 10, 15].map((value) => (
                  <Picker.Item key={value} label={`${value}`} value={value} />
                ))}
              </Picker>
              <Text style={styles.paginationText}>
                {`${(currentPage - 1) * rowsPerPage + 1}-${Math.min(currentPage * rowsPerPage, totalRows)} of ${totalRows}`}
              </Text>
              <TouchableOpacity
                onPress={() => setCurrentPage(currentPage > 1 ? currentPage - 1 : 1)}
                disabled={currentPage === 1}
              >
                <Text style={[styles.paginationArrow, currentPage === 1 && styles.disabledArrow]}>◄</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setCurrentPage(currentPage < totalPages ? currentPage + 1 : totalPages)}
                disabled={currentPage === totalPages}
              >
                <Text style={[styles.paginationArrow, currentPage === totalPages && styles.disabledArrow]}>►</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Add Task Modal */}
        <Modal
          animationType="fade"
          transparent={true}
          visible={addTaskModalVisible}
          onRequestClose={() => setAddTaskModalVisible(false)}
        >
          <Animatable.View animation="zoomIn" style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Add Task Details</Text>
                <TouchableOpacity onPress={() => setAddTaskModalVisible(false)}>
                  <Text style={styles.closeIcon}>✖</Text>
                </TouchableOpacity>
              </View>
              <Text style={styles.inputLabel}>Project Name</Text>
              <TextInput
                style={styles.input}
                value={taskCategory}
                onChangeText={setTaskCategory}
                placeholder="Enter project name"
              />
              <Text style={styles.inputLabel}>Activity Name</Text>
              <TextInput
                style={styles.input}
                value={taskTitle}
                onChangeText={setTaskTitle}
                placeholder="Enter activity name"
              />
              <Text style={styles.inputLabel}>Task Description</Text>
              <TextInput
                style={styles.input}
                value={taskDescription}
                onChangeText={setTaskDescription}
                placeholder="Enter task description"
                multiline
              />
              <Text style={styles.inputLabel}>% Complete</Text>
              <TextInput
                style={styles.input}
                value={percentComplete}
                onChangeText={setPercentComplete}
                placeholder="Enter % complete"
                keyboardType="numeric"
              />
              <Text style={styles.inputLabel}>Assigned By</Text>
              <TextInput
                style={styles.input}
                value={assignedBy}
                onChangeText={setAssignedBy}
                placeholder="Enter assignee"
              />
              <TouchableOpacity style={styles.submitButton} onPress={handleAddTask}>
                <Text style={styles.submitButtonText}>Submit</Text>
              </TouchableOpacity>
            </View>
          </Animatable.View>
        </Modal>

        {/* Time Input Modal */}
        <Modal
          animationType="fade"
          transparent={true}
          visible={timeModalVisible}
          onRequestClose={() => setTimeModalVisible(false)}
        >
          <Animatable.View animation="zoomIn" style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Edit Time for {selectedDayIndex !== null && weekDays[selectedDayIndex]}</Text>
                <TouchableOpacity onPress={() => setTimeModalVisible(false)}>
                  <Text style={styles.closeIcon}>✖</Text>
                </TouchableOpacity>
              </View>
              {selectedTaskIndex !== null && selectedDayIndex !== null && (
                <>
                  <Text style={styles.inputLabel}>Login Time</Text>
                  <Text style={styles.timeDisplay}>
                    {tableData[selectedTaskIndex].loginTimes[selectedDayIndex] || 'Not set'}
                  </Text>
                  <Text style={styles.inputLabel}>Logout Time</Text>
                  <Text style={styles.timeDisplay}>
                    {tableData[selectedTaskIndex].logoutTimes[selectedDayIndex] || 'Not set'}
                  </Text>
                </>
              )}
              <Text style={styles.inputLabel}>Hours Worked (e.g., 08:00)</Text>
              <TextInput
                style={styles.input}
                value={selectedTime}
                onChangeText={setSelectedTime}
                placeholder="Enter hours (e.g., 08:00)"
              />
              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.confirmButton]}
                  onPress={handleTimeUpdate}
                >
                  <Text style={styles.modalButtonText}>Confirm</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalButton, styles.cancelButton]}
                  onPress={() => setTimeModalVisible(false)}
                >
                  <Text style={styles.modalButtonText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Animatable.View>
        </Modal>

        {/* Custom Alert Modal */}
        <Modal
          animationType="fade"
          transparent={true}
          visible={alertModalVisible}
          onRequestClose={() => setAlertModalVisible(false)}
        >
          <Animatable.View animation="zoomIn" style={styles.modalContainer}>
            <View style={styles.alertContent}>
              <Text style={styles.alertTitle}>Notification</Text>
              <Text style={styles.alertMessage}>{alertMessage}</Text>
              <TouchableOpacity
                style={styles.alertButton}
                onPress={() => setAlertModalVisible(false)}
              >
                <Text style={styles.alertButtonText}>OK</Text>
              </TouchableOpacity>
            </View>
          </Animatable.View>
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
  logo: {
    height: 120,
    width: 180,
    justifyContent: 'center',
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
  tableContainer: {
    flex: 1,
    padding: 15,
  },
  tableHeader: {
    backgroundColor: '#003087',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  tableHeaderText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    flex: 1,
  },
  addTaskButton: {
    backgroundColor: '#fff',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  addTaskButtonText: {
    color: '#003087',
    fontSize: 14,
    fontWeight: 'bold',
  },
  tableWrapper: {
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  tableHead: {
    backgroundColor: '#e6e6e6',
  },
  tableHeadText: {
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
    padding: 8,
    color: '#333',
  },
  tableRow: {
    backgroundColor: '#fff',
  },
  tableText: {
    fontSize: 12,
    textAlign: 'center',
    padding: 8,
    color: '#333',
  },
  cell: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 5,
  },
  timeCellContent: {
    alignItems: 'center',
  },
  timeDetailText: {
    fontSize: 10,
    color: '#555',
    marginBottom: 2,
  },
  hoursText: {
    fontSize: 12,
    color: '#333',
    fontWeight: 'bold',
  },
  pickerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  pickerContainer: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    backgroundColor: '#fff',
    marginHorizontal: 2,
    height: 60, // Match the picker height to avoid clipping
  },
  selectedPickerContainer: {
    backgroundColor: '#e6f0ff', // Light blue background when a value is selected
  },
  picker: {
    flex: 1,
    color: '#000',
    fontSize: 16, // Increased font size for better visibility
    height: 60, // Increased height for better interaction
  },
  commentIcon: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  actionsCell: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 5,
  },
  actionIconText: {
    fontSize: 16,
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 10,
    marginBottom: 15,
  },
  pagination: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  paginationText: {
    fontSize: 12,
    marginHorizontal: 5,
  },
  paginationPicker: {
    width: 60,
    height: 30,
    color: '#333',
  },
  paginationArrow: {
    fontSize: 16,
    marginHorizontal: 5,
    color: '#003087',
  },
  disabledArrow: {
    color: '#ccc',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 25,
    borderRadius: 12,
    width: 300,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#003087',
  },
  closeIcon: {
    fontSize: 18,
    color: '#333',
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
    fontSize: 14,
    color: '#333',
  },
  timeDisplay: {
    fontSize: 14,
    color: '#555',
    marginBottom: 15,
  },
  submitButton: {
    backgroundColor: '#28a745',
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
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  modalButton: {
    paddingVertical: 12,
    borderRadius: 8,
    width: 120,
    alignItems: 'center',
  },
  confirmButton: {
    backgroundColor: '#003087',
  },
  cancelButton: {
    backgroundColor: '#ff0000',
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  alertContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: 250,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  alertTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#003087',
    marginBottom: 10,
  },
  alertMessage: {
    fontSize: 14,
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
  },
  alertButton: {
    backgroundColor: '#28a745',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  alertButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default App;