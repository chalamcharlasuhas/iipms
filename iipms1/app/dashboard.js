import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Feather'; // For hamburger icon
import Profile from './components/profile'; // Import the new Profile component
import { router } from 'expo-router';
const App = () => {
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString('en-US', { hour12: true }));
  const [profileVisible, setProfileVisible] = useState(false); // State for profile modal
  const { height } = Dimensions.get("window");

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString('en-US', { hour12: true }));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const toggleProfile = () => {
    setProfileVisible(!profileVisible);
  };

  const handleLogout = () => {
    setProfileVisible(false);
    // Add logout logic here (e.g., clear user data, navigate to login screen)
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.innerContainer}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={toggleProfile} style={styles.menuButton}>
            <Icon name="menu" size={20} color="#000" />
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

        {/* Buttons Section */}
        <View style={styles.buttonSection}>
          <TouchableOpacity
            onPress={() => router.push('/timesheet')}
            style={[styles.button, { backgroundColor: '#003087' }]}
          >
            <Text style={styles.buttonText}>MY TIMESHEET</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => router.push('/leave')}
            style={styles.button}
          >
            <Text style={styles.buttonText}>APPLY LEAVE</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => router.push('/leavestatus')}
            style={styles.button}
          >
            <Text style={styles.buttonText}>VIEW LEAVE STATUS</Text>
          </TouchableOpacity>

          {/* <TouchableOpacity
            onPress={() => router.push('/managerdashboard')}
            style={styles.button}
          >
            <Text style={styles.buttonText}>manager dashboard</Text>
          </TouchableOpacity> */}
        </View>

        {/* Background Image Section */}
        <ImageBackground
          source={{ uri: 'https://media.istockphoto.com/id/1827291486/photo/a-dedicated-mentor-is-explaining-mentees-importance-of-project-while-sitting-at-the-boardroom.jpg?s=612x612&w=0&k=20&c=whMTmOCyOUfNqoNBe8GPlmcNUM-aCfqD-0whdFPQpO4=' }}
          style={styles.imageBackground}
          resizeMode="cover"
        >
          <View style={styles.imageOverlay} />
        </ImageBackground>

        {/* Profile Modal */}
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
    justifyContent: 'space-between',
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
    padding: 5,
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
    position: 'relative',
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
  buttonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  imageBackground: {
    flex: 1,
    justifyContent: 'center',
  },
  imageOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
});

export default App;