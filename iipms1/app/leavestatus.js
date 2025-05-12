import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, ImageBackground, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Table, Row, Rows } from 'react-native-table-component';
import * as Animatable from 'react-native-animatable';
import { router } from 'expo-router';

const LeaveStatus = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString('en-US', { hour12: true }));
  const tableHead = ['#', 'Leave...', 'From', 'To', 'Reason', 'Status', 'Applied On', 'Action'];
  const tableData = [
    [
      '1',
      'Bereavement Leave',
      '2025-05-15',
      '2025-05-16',
      'Please give me leave, as I have meeting',
      'Rejected',
      '2025-05-04 17:43:40',
      'Locked',
    ],
    [
      '2',
      'Sick Leave',
      '2025-05-20',
      '2025-05-21',
      'Not feeling well, need rest',
      'Approved',
      '2025-05-04 18:00:00',
      'Locked',
    ],
  ];
  const columnWidths = [50, 150, 100, 100, 200, 100, 150, 100];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString('en-US', { hour12: true }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleDownloadExcel = () => {
    const excelData = [
      tableHead,
      ...tableData,
    ];
    console.log('Downloading Excel with data:', excelData);
    alert('Excel download initiated (simulated). Check console for data.');
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <View style={styles.innerContainer}>
            {/* Header */}
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

            {/* Navigation Tabs */}
            <View style={styles.navTabs}>
              <TouchableOpacity onPress={() => router.push('./dashboard')} style={[styles.tab]}>
                <Text style={[styles.tabText]}>Home</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.tab, , styles.activeTab]}>
                <Text style={[styles.tabText, styles.activeTabText]}>My Workspace</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.tab}>
                <Text style={styles.tabText}>My Hours Dashboard</Text>
              </TouchableOpacity>
            </View>

            {/* Button Section */}
            <View style={styles.buttonSection}>
              {['MY TIMESHEET', 'APPLY LEAVE', 'VIEW LEAVE STATUS'].map((label, index) => (
                <Animatable.View key={index} animation="bounceIn" delay={index * 100}>
                  <TouchableOpacity
                    style={[styles.button, label === 'VIEW LEAVE STATUS' && styles.activeButton]}
                    onPress={() => {
                      if (label === 'MY TIMESHEET') router.push('./timesheet');
                      if (label === 'APPLY LEAVE') router.push('./leave');
                      if (label === 'VIEW LEAVE STATUS') router.push('./leavestatus');
                    }}
                  >
                    <Text style={styles.buttonText}>{label}</Text>
                  </TouchableOpacity>
                </Animatable.View>
              ))}
            </View>

            {/* Title and Search Bar */}
            <View style={styles.headerSection}>
              <Text style={styles.title}>My Leave Applications</Text>
              <TextInput
                style={styles.searchBar}
                placeholder="Search"
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
            </View>

            {/* Table */}
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
                  {tableData.map((rowData, rowIndex) => (
                    <Row
                      key={rowIndex}
                      data={rowData.map((cell, cellIndex) => {
                        if (cellIndex === 5) {
                          const status = cell.trim();
                          let statusStyle;
                          if (status === 'Approved') {
                            statusStyle = styles.statusCellApproved;
                          } else if (status === 'Rejected') {
                            statusStyle = styles.statusCellRejected;
                          } else {
                            statusStyle = styles.statusCellDefault;
                          }
                          return (
                            <View
                              style={[
                                styles.cell,
                                statusStyle,
                                rowIndex % 2 === 0 && styles.altRow,
                              ]}
                            >
                              <Text style={styles.statusText}>{cell}</Text>
                            </View>
                          );
                        }
                        if (cellIndex === 7) {
                          return (
                            <View style={[styles.cell, rowIndex % 2 === 0 && styles.altRow]}>
                              <Text style={styles.actionText}>{cell}</Text>
                            </View>
                          );
                        }
                        return (
                          <View style={[styles.cell, rowIndex % 2 === 0 && styles.altRow]}>
                            <Text style={styles.tableText}>{cell}</Text>
                          </View>
                        );
                      })}
                      style={styles.tableRow}
                      textStyle={styles.tableText}
                      widthArr={columnWidths}
                      flexArr={Array(tableHead.length).fill(1)}
                    />
                  ))}
                </Table>
              </View>
            </ScrollView>

            {/* Pagination Indicator */}
            <Text style={styles.paginationText}>SHOWING 1 to 2 of 2 rows</Text>

            {/* Download Excel Button */}
            <TouchableOpacity style={styles.downloadButton} onPress={handleDownloadExcel}>
              <Text style={styles.downloadButtonText}>Download Excel</Text>
            </TouchableOpacity>

            {/* Footer */}
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
    fontSize: 16,
    color: '#ff0000',
    fontWeight: 'bold',
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
  headerSection: {
    padding: 15,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#003087',
    marginBottom: 10,
  },
  searchBar: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
    fontSize: 14,
    color: '#333',
    backgroundColor: '#fff',
    marginBottom: 15,
  },
  tableWrapper: {
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginHorizontal: 15,
  },
  tableHead: {
    backgroundColor: '#003087',
  },
  tableHeadText: {
    fontSize: 12,
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
  statusCellApproved: {
    backgroundColor: '#28a745',
    borderRadius: 5,
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  statusCellRejected: {
    backgroundColor: '#ff0000',
    borderRadius: 5,
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  statusCellDefault: {
    backgroundColor: '#ccc',
    borderRadius: 5,
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  statusText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: 'bold',
  },
  actionText: {
    fontSize: 12,
    color: '#333',
  },
  paginationText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    marginVertical: 10,
  },
  downloadButton: {
    backgroundColor: '#003087',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 15,
    marginBottom: 15,
  },
  downloadButtonText: {
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

export default LeaveStatus;