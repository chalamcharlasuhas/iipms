import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, ImageBackground, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Table, Row, Rows } from 'react-native-table-component';
import * as Animatable from 'react-native-animatable';
import { useLocalSearchParams } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import Profile from './components/profile';

const EmployeeDetails = () => {
  const { loginState: loginStateString } = useLocalSearchParams();
  const [profileVisible, setProfileVisible] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString('en-US', { hour12: true }));
  const loginState = loginStateString ? JSON.parse(loginStateString) : {};
  const { height } = Dimensions.get("window");

  // Define table headers for Employee Details
  const tableHead = ['#', 'Employee ID', 'Name', 'Department', 'Role'];
  const columnWidths = [50, 100, 150, 100, 100];

  // Define a sample entry
  const sampleEntry = [
    '1',              // #
    'EMP001',         // Employee ID
    'John Doe',       // Name
    'Engineering',    // Department
    'Developerr'       // Role
  ];

  // Generate employee data from loginState, and include the sample entry
  const employeeDataFromLoginState = Object.keys(loginState).length > 0 
    ? Object.keys(loginState).map((day, index) => {
        const state = loginState[day];
        return [
          (index + 1).toString(),
          `EMP${index + 100}`,
          `Employee ${index + 1}`,
          state.loginTime ? 'Engineering' : 'HR',
          state.exitTime ? 'Developer' : 'Manager',
        ];
      })
    : [];

  // Combine the sample entry with the data from loginState
  const employeeData = [sampleEntry, ...employeeDataFromLoginState];

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
          <TouchableOpacity style={[styles.tab, styles.activeTab]}>
            <Text style={[styles.tabText, styles.activeTabText]}>Home</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.tab}>
            <Text style={styles.tabText}>My Workspace</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.tab}>
            <Text style={styles.tabText}>My Hours Dashboard</Text>
          </TouchableOpacity>
        </View>

        <Animatable.View animation="fadeInDown" style={styles.header}>
          <Text style={styles.headerText}>Employee Details</Text>
        </Animatable.View>

        <View style={styles.tableContainer}>
          <View style={styles.headerActions}>
            <TextInput
              style={styles.searchInput}
              placeholder="Search"
              placeholderTextColor="#999"
            />
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
                {employeeData.length > 0 ? (
                  employeeData.map((rowData, rowIndex) => (
                    <Row
                      key={rowIndex}
                      data={rowData.map((cell) => (
                        <View style={[styles.cell, rowIndex % 2 === 0 && styles.altRow]}>
                          <Text style={styles.tableText}>{cell}</Text>
                        </View>
                      ))}
                      style={styles.tableRow}
                      textStyle={styles.tableText}
                      widthArr={columnWidths}
                      flexArr={Array(tableHead.length).fill(1)}
                    />
                  ))
                ) : (
                  <Row
                    data={[<Text style={styles.noDataText}>No employee data available</Text>]}
                    style={styles.tableRow}
                    textStyle={styles.tableText}
                    widthArr={[500]} // Span the entire width
                  />
                )}
              </Table>
            </View>
          </ScrollView>

          <Text style={styles.footerText}>
            Showing {employeeData.length} to {employeeData.length} of {employeeData.length} rows
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
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#003087',
    textAlign: 'center',
  },
  tableContainer: {
    flex: 1,
    padding: 15,
  },
  headerActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 10,
  },
  searchInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 8,
    width: 150,
    fontSize: 14,
    color: '#333',
    backgroundColor: '#fff',
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
});

export default EmployeeDetails;