import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Modal, ImageBackground, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Table, Row, Rows } from 'react-native-table-component';
import * as Animatable from 'react-native-animatable';
import { router } from 'expo-router';

const App = () => {
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString('en-US', { hour12: true }));
  const [addTaskModalVisible, setAddTaskModalVisible] = useState(false);
  const [timeModalVisible, setTimeModalVisible] = useState(false);
  const [selectedDay, setSelectedDay] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const currentDate = new Date('2025-05-06');
  const weekStartDate = new Date('2025-05-05');

  const [tableData, setTableData] = useState([
    ['1', 'Software', 'App devoping', 'hello', '0%', '2025-05-04', 'N/A', 'Suhas', ''],
  ]);

  const [hoursData, setHoursData] = useState(['45:00', '9:00', '9:00', '9:00', '9:00', '9:00', '0:00', '0:00']);
  const [loginState, setLoginState] = useState({});

  const [taskCategory, setTaskCategory] = useState('');
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [percentComplete, setPercentComplete] = useState('0');
  const [assignedBy, setAssignedBy] = useState('');

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString('en-US', { hour12: true }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const generateWeekDays = (startDate) => {
    const days = [];
    const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    for (let i = 0; i < 7; i++) {
      const currentDay = new Date(startDate);
      currentDay.setDate(startDate.getDate() + i);
      const dayName = dayNames[currentDay.getDay()];
      const date = currentDay.getDate().toString().padStart(2, '0');
      const month = monthNames[currentDay.getMonth()];
      days.push(`${dayName}\n${date} ${month}`);
    }
    return days;
  };

  const weekDays = generateWeekDays(weekStartDate);

  const taskTableHead = [
    'S.No', 'Category', 'TaskTitle', 'TaskDesc', '%Complete', 'CreatedAt', 'CompletedAt', 'Assigned By', 'Actions'
  ];

  const hoursTableHead = ['Total Hours', ...weekDays];

  const formatWeekRange = (startDate) => {
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 6);
    
    const weekNumber = Math.ceil((startDate.getDate() + startDate.getDay()) / 7);
    const startStr = startDate.toISOString().split('T')[0];
    const endStr = endDate.toISOString().split('T')[0];
    
    return `W${weekNumber} ${startStr} - ${endStr}`;
  };

  const weekRange = formatWeekRange(weekStartDate);

  const taskColumnWidths = Array(9).fill(100);
  const hoursColumnWidths = [100, 80, 80, 80, 80, 80, 80, 80];

  const handleAddTask = () => {
    const newTask = [
      (tableData.length + 1).toString(),
      taskCategory || 'N/A',
      taskTitle || 'N/A',
      taskDescription || 'N/A',
      `${percentComplete}%` || '0%',
      currentDate.toISOString().split('T')[0],
      'N/A',
      assignedBy || 'N/A',
      ''
    ];

    setTableData([...tableData, newTask]);

    setTaskCategory('');
    setTaskTitle('');
    setTaskDescription('');
    setPercentComplete('0');
    setAssignedBy('');
    setAddTaskModalVisible(false);
  };

  const isDayBeforeCurrent = (day) => {
    const dayParts = day.split('\n');
    const dayDateStr = `${dayParts[1].split(' ')[0]} ${dayParts[1].split(' ')[1]} 2025`;
    const dayDate = new Date(dayDateStr);
    return dayDate < currentDate;
  };

  const handleTimeSelection = (time, day, index) => {
    const dayIndex = hoursTableHead.indexOf(day);
    if (dayIndex === -1 || isDayBeforeCurrent(day)) return;

    const currentDayState = loginState[day] || { hasLoggedIn: false, loginTime: null, exitTime: null };

    if (!currentDayState.hasLoggedIn) {
      const newHoursData = [...hoursData];
      newHoursData[dayIndex] = currentTime;
      setHoursData(newHoursData);
      setLoginState({
        ...loginState,
        [day]: { hasLoggedIn: true, loginTime: currentTime, exitTime: null },
      });
    } else {
      const loginTime = new Date(`2025-05-06 ${currentDayState.loginTime}`);
      const exitTime = new Date(`2025-05-06 ${currentTime}`);
      const hoursWorked = (exitTime - loginTime) / (1000 * 60 * 60);
      const formattedHours = hoursWorked.toFixed(2) + ':00';

      const newHoursData = [...hoursData];
      newHoursData[dayIndex] = formattedHours;
      setHoursData(newHoursData);
      setLoginState({
        ...loginState,
        [day]: { ...currentDayState, exitTime: currentTime },
      });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.innerContainer}>
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

        <View style={styles.buttonSection}>
          {['MY TIMESHEET', 'APPLY LEAVE', 'VIEW LEAVE STATUS', 'ATTENDANCE REPORT'].map((label, index) => (
            <Animatable.View key={index} animation="bounceIn" delay={index * 100}>
              <TouchableOpacity
                style={[styles.button, label === 'MY TIMESHEET' && styles.activeButton]}
                onPress={() => {
                  if (label === 'MY TIMESHEET') router.push('./timesheet');
                  if (label === 'APPLY LEAVE') router.push('./leave');
                  if (label === 'VIEW LEAVE STATUS') router.push('./leavestatus');
                  if (label === 'ATTENDANCE REPORT') router.push({ pathname: './attendance', params: { loginState: JSON.stringify(loginState) } });
                }}
              >
                <Text style={styles.buttonText}>{label}</Text>
              </TouchableOpacity>
            </Animatable.View>
          ))}
        </View>

        <View style={styles.tableContainer}>
          <View style={styles.tableHeader}>
            <Text style={styles.tableHeaderText}>{weekRange}</Text>
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
                  data={taskTableHead}
                  style={styles.tableHead}
                  textStyle={styles.tableHeadText}
                  widthArr={taskColumnWidths}
                  flexArr={Array(taskTableHead.length).fill(1)}
                />
                {tableData.map((rowData, rowIndex) => (
                  <Row
                    key={rowIndex}
                    data={rowData.map((cell, cellIndex) => {
                      if (cellIndex === 8) {
                        return (
                          <View style={styles.actionsCell}>
                            <TouchableOpacity style={styles.actionIcon}>
                              <Text style={styles.actionIconText}>✏️</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.actionIcon}>
                              <Text style={styles.actionIconText}>🗑️</Text>
                            </TouchableOpacity>
                          </View>
                        );
                      }
                      return (
                        <View style={[styles.cell, rowIndex % 2 === 0 && styles.altRow]}>
                          <Text style={styles.tableText}>
                            {cell}
                          </Text>
                        </View>
                      );
                    })}
                    style={styles.tableRow}
                    textStyle={styles.tableText}
                    widthArr={taskColumnWidths}
                    flexArr={Array(taskTableHead.length).fill(1)}
                  />
                ))}
              </Table>
            </View>
          </ScrollView>

          <View style={styles.hoursContainer}>
            <ScrollView horizontal>
              <View style={styles.tableWrapper}>
                <Table borderStyle={{ borderWidth: 1, borderColor: '#ddd' }}>
                  <Row
                    data={hoursTableHead}
                    style={styles.tableHead}
                    textStyle={styles.tableHeadText}
                    widthArr={hoursColumnWidths}
                    flexArr={Array(hoursTableHead.length).fill(1)}
                  />
                  <Row
                    data={hoursData.map((cell, cellIndex) => {
                      const isTotalHours = cellIndex === 0;
                      const day = hoursTableHead[cellIndex];
                      const isDisabled = isTotalHours || isDayBeforeCurrent(day);
                      return (
                        <TouchableOpacity
                          style={[styles.cell, isTotalHours && styles.totalHoursCell, isDisabled && styles.disabledCell]}
                          onPress={() => !isDisabled && handleTimeSelection(cell, day, cellIndex)}
                          disabled={isDisabled}
                        >
                          <Text style={[styles.tableText, isTotalHours && styles.totalHoursText, isDisabled && styles.disabledText]}>
                            {cell}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                    style={styles.tableRow}
                    textStyle={styles.tableText}
                    widthArr={hoursColumnWidths}
                    flexArr={Array(hoursTableHead.length).fill(1)}
                  />
                </Table>
              </View>
            </ScrollView>
          </View>
        </View>

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
              <Text style={styles.inputLabel}>Task Category</Text>
              <TextInput
                style={styles.input}
                value={taskCategory}
                onChangeText={setTaskCategory}
                placeholder="Enter task category"
              />
              <Text style={styles.inputLabel}>Task Title</Text>
              <TextInput
                style={styles.input}
                value={taskTitle}
                onChangeText={setTaskTitle}
                placeholder="Enter task title"
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

        <Modal
          animationType="fade"
          transparent={true}
          visible={timeModalVisible}
          onRequestClose={() => setTimeModalVisible(false)}
        >
          <Animatable.View animation="zoomIn" style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Edit Time for {selectedDay}</Text>
                <TouchableOpacity onPress={() => setTimeModalVisible(false)}>
                  <Text style={styles.closeIcon}>✖</Text>
                </TouchableOpacity>
              </View>
              <Text style={styles.inputLabel}>Hours</Text>
              <TextInput
                style={styles.input}
                value={selectedTime}
                onChangeText={setSelectedTime}
                placeholder="Enter hours (e.g., 9:00)"
              />
              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.confirmButton]}
                  onPress={() => {
                    const dayIndex = hoursTableHead.indexOf(selectedDay);
                    if (dayIndex !== -1) {
                      const newHoursData = [...hoursData];
                      newHoursData[dayIndex] = selectedTime;
                      setHoursData(newHoursData);
                    }
                    setTimeModalVisible(false);
                    setSelectedDay(null);
                    setSelectedTime(null);
                  }}
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

        <View style={styles.footer}>
          <Text style={styles.footerText}>© 2025 Intellisurge Technologies. All Rights Reserved.</Text>
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
  tableContainer: {
    flex: 1,
    padding: 15,
  },
  tableHeader: {
    backgroundColor: '#003087',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
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
  altRow: {
    backgroundColor: '#f9f9f9',
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
  totalHoursCell: {
    backgroundColor: '#e6e6e6',
  },
  totalHoursText: {
    fontWeight: 'bold',
  },
  disabledCell: {
    backgroundColor: '#f0f0f0',
  },
  disabledText: {
    color: '#999',
  },
  actionsCell: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 5,
  },
  actionIcon: {
    marginHorizontal: 5,
  },
  actionIconText: {
    fontSize: 16,
  },
  hoursContainer: {
    marginTop: 15,
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

export default App;