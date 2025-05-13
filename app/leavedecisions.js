import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ImageBackground, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Table, Row, Rows } from 'react-native-table-component';
import { Feather } from '@expo/vector-icons';
import Profile from './components/profile';

const LeaveDecisions = () => {
  const [profileVisible, setProfileVisible] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString('en-US', { hour12: true }));
  const { height } = Dimensions.get("window");

  // State to track approval status for each leave request
  const [leaveStatuses, setLeaveStatuses] = useState({});

  const toggleProfile = () => {
    setProfileVisible(!profileVisible);
  };

  const handleLogout = () => {
    setProfileVisible(false);
    // Add logout logic here
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString('en-US', { hour12: true }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Define table headers for Leave Decisions
  const tableHead = ['Employee ID', 'Name', 'Leave Type', 'Start Date', 'End Date', 'Reason', 'Applied On', 'Status', 'Action'];
  const columnWidths = [100, 150, 100, 100, 100, 150, 100, 100, 150];

  // Sample leave decision entry
  const sampleEntry = [
    'EMP001',           // Employee ID
    'John Doe',         // Name
    'Sick Leave',       // Leave Type
    '2025-05-10',       // Start Date
    '2025-05-12',       // End Date
    'Fever',            // Reason
    '2025-05-07',       // Applied On
    'Pending',          // Status (initially)
    'action'            // Placeholder for Action column (will be replaced with buttons)
  ];

  // Combine sample entry into leaveData
  const leaveData = [sampleEntry];

  // Handle Approve/Reject actions
  const handleAction = (index, action) => {
    setLeaveStatuses((prevStatuses) => ({
      ...prevStatuses,
      [index]: action, // 'Approved' or 'Rejected'
    }));
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.innerContainer}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={toggleProfile} style={styles.menuButton}>
            <Feather name="menu" size={20} color="#000" />
          </TouchableOpacity>
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
        </View>

        {/* Navigation Tabs */}
        <View style={styles.navTabs}>
          <TouchableOpacity style={styles.tab}>
            <Text style={styles.tabText}>Home</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.tab}>
            <Text style={styles.tabText}>My Workspace</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.tab}>
            <Text style={styles.tabText}>My Hours Dashboard</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.tab, styles.activeTab]}>
            <Text style={[styles.tabText, styles.activeTabText]}>Leave Decisions</Text>
          </TouchableOpacity>
        </View>

        {/* Main Content */}
        <View style={styles.contentContainer}>
          <Text style={styles.headerText}>Leave Decisions Pending</Text>
          
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
                {leaveData.length > 0 ? (
                  leaveData.map((rowData, rowIndex) => {
                    const status = leaveStatuses[rowIndex] || rowData[7]; // Use updated status if available
                    const isPending = status === 'Pending';
                    return (
                      <Row
                        key={rowIndex}
                        data={[
                          ...rowData.slice(0, 7), // Employee ID, Name, Leave Type, Start Date, End Date, Reason, Applied On
                          <View style={[styles.cell, rowIndex % 2 === 0 && styles.altRow]}>
                            <Text style={styles.tableText}>{status}</Text>
                          </View>,
                          <View style={[styles.cell, rowIndex % 2 === 0 && styles.altRow]}>
                            {isPending ? (
                              <View style={styles.actionButtons}>
                                <TouchableOpacity
                                  style={[styles.actionButton, styles.approveButton]}
                                  onPress={() => handleAction(rowIndex, 'Approved')}
                                >
                                  <Text style={styles.actionButtonText}>Approve</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                  style={[styles.actionButton, styles.rejectButton]}
                                  onPress={() => handleAction(rowIndex, 'Rejected')}
                                >
                                  <Text style={styles.actionButtonText}>Reject</Text>
                                </TouchableOpacity>
                              </View>
                            ) : (
                              <Text style={styles.tableText}>{status}</Text>
                            )}
                          </View>,
                        ]}
                        style={styles.tableRow}
                        textStyle={styles.tableText}
                        widthArr={columnWidths}
                        flexArr={Array(tableHead.length).fill(1)}
                      />
                    );
                  })
                ) : (
                  <Row
                    data={[<Text style={styles.noDataText}>No pending leave decisions</Text>]}
                    style={styles.tableRow}
                    textStyle={styles.tableText}
                    widthArr={[900]} // Span the entire width
                  />
                )}
              </Table>
            </View>
          </ScrollView>

          <Text style={styles.footerText}>
            Showing {leaveData.length} to {leaveData.length} of {leaveData.length} rows
          </Text>
        </View>

        <Profile
          visible={profileVisible}
          onClose={toggleProfile}
          onLogout={handleLogout}
        />
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
  menuButton: {
    position: 'absolute',
    left: 10,
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
  contentContainer: {
    flex: 1,
    padding: 15,
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#003087',
    textAlign: 'center',
    marginBottom: 20,
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
    backgroundColor: '#003087',
  },
  tableHeadText: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    padding: 8,
    color: '#fff',
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
  noDataText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    padding: 20,
  },
  footerText: {
    fontSize: 12,
    color: '#666',
    marginTop: 10,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  actionButton: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  approveButton: {
    backgroundColor: '#28a745',
  },
  rejectButton: {
    backgroundColor: '#dc3545',
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export default LeaveDecisions;