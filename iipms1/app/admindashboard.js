import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground, Dimensions, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Feather';
import Profile from './components/profile';
import { router } from 'expo-router';


const App = () => {
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString('en-US', { hour12: true }));
  const [profileVisible, setProfileVisible] = useState(false);
  const { height } = Dimensions.get("window");

  // Animation refs for each button
  const fadeAnim1 = useRef(new Animated.Value(0)).current;
  const scaleAnim1 = useRef(new Animated.Value(0.5)).current;
  const fadeAnim2 = useRef(new Animated.Value(0)).current;
  const scaleAnim2 = useRef(new Animated.Value(0.5)).current;
  const fadeAnim3 = useRef(new Animated.Value(0)).current;
  const scaleAnim3 = useRef(new Animated.Value(0.5)).current;
  const fadeAnim4 = useRef(new Animated.Value(0)).current;
  const scaleAnim4 = useRef(new Animated.Value(0.5)).current;

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString('en-US', { hour12: true }));
    }, 1000);

    // Staggered animation for buttons
    Animated.stagger(200, [
      Animated.parallel([
        Animated.timing(fadeAnim1, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim1, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
      ]),
      Animated.parallel([
        Animated.timing(fadeAnim2, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim2, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
      ]),
      Animated.parallel([
        Animated.timing(fadeAnim3, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim3, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
      ]),
      Animated.parallel([
        Animated.timing(fadeAnim4, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim4, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
      ]),
    ]).start();

    return () => clearInterval(timer);
  }, []);

  const toggleProfile = () => {
    setProfileVisible(!profileVisible);
  };

  const handleLogout = () => {
    setProfileVisible(false);
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
          <TouchableOpacity onPress={() => router.push('/employeedetails')} style={styles.tab}>
            <Text style={styles.tabText}>My Workspace</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.tab}>
            <Text style={styles.tabText}>My Hours Dashboard</Text>
          </TouchableOpacity>
        </View>

        {/* Buttons Section */}
        <View style={styles.buttonSection}>


        <Animated.View style={{ opacity: fadeAnim1, transform: [{ scale: scaleAnim1 }] }}>
            <TouchableOpacity
              onPress={() => router.push('/employeeregister')}
              style={[styles.button, { backgroundColor: '#2a3eb1' }]}
            >
              <Text style={styles.buttonText}>Employee Register</Text>
            </TouchableOpacity>
          </Animated.View>


          <Animated.View style={{ opacity: fadeAnim1, transform: [{ scale: scaleAnim1 }] }}>
            <TouchableOpacity
              onPress={() => router.push('/adminemployee')}
              style={[styles.button, { backgroundColor: '#2a3eb1' }]}
            >
              <Text style={styles.buttonText}>Employee Details</Text>
            </TouchableOpacity>
          </Animated.View>

          <Animated.View style={{ opacity: fadeAnim2, transform: [{ scale: scaleAnim2 }] }}>
            <TouchableOpacity
              onPress={() => router.push('/employeeattend')}
              style={[styles.button, { backgroundColor: '#2a3eb1' }]}
            >
              <Text style={styles.buttonText}>Attendance Reports</Text>
            </TouchableOpacity>
          </Animated.View>

          <Animated.View style={{ opacity: fadeAnim3, transform: [{ scale: scaleAnim3 }] }}>
            <TouchableOpacity
              onPress={() => router.push('/employeetasks')}
              style={[styles.button, { backgroundColor: '#2a3eb1' }]}
            >
              <Text style={styles.buttonText}>Employee Tasks</Text>
            </TouchableOpacity>
          </Animated.View>

          <Animated.View style={{ opacity: fadeAnim4, transform: [{ scale: scaleAnim4 }] }}>
            <TouchableOpacity
              onPress={() => router.push('/leavedecisions')}
              style={[styles.button, { backgroundColor: '#2a3eb1' }]}
            >
              <Text style={styles.buttonText}>Leave Desicion</Text>
            </TouchableOpacity>
          </Animated.View>
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
    flexDirection: 'column',
    alignItems: 'center',
    padding: 15,
  },
  button: {
    backgroundColor: '#2a3eb1',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginVertical: 10,
    width: 200,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
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