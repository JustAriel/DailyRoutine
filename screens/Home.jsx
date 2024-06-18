import React, { useState, useEffect, useCallback, useRef } from 'react';
import { View, Text, TouchableOpacity, Animated, StyleSheet, FlatList } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { FontAwesome } from '@expo/vector-icons';
import Header from './Header';
import Config from './Config';

const Home = ({ navigation }) => {
  const [showConfig, setShowConfig] = useState(false);
  const [configPosition] = useState(new Animated.Value(1000));
  const [routines, setRoutines] = useState([]);
  const progressBarWidths = useRef([]).current;

  useEffect(() => {
    if (showConfig) {
      Animated.timing(configPosition, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(configPosition, {
        toValue: 1000,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [showConfig]);

  const handleAddRoutine = () => {
    setShowConfig(true);
  };

  const handleDoneConfig = useCallback((configData) => {
    setRoutines((prev) => [...prev, { ...configData, completedTimes: 0, completedDays: [] }]);
    setShowConfig(false);
  }, []);

  const handleTimesCompleted = (index) => {
    setRoutines((prevRoutines) => {
      const newRoutines = [...prevRoutines];
      const routine = newRoutines[index];
      if (routine.completedTimes < routine.timesPerDay) {
        routine.completedTimes += 1;
        if (routine.completedTimes === routine.timesPerDay) {
          routine.completedDays.push(new Date().getDate());
        }
      }
      return newRoutines;
    });

    const progress = (routines[index].completedTimes / routines[index].timesPerDay) * 100;
    Animated.timing(progressBarWidths[index], {
      toValue: progress,
      duration: 500,
      useNativeDriver: false,
    }).start();
  };

  const renderRoutine = ({ item, index }) => {
    if (!progressBarWidths[index]) {
      progressBarWidths[index] = new Animated.Value(0);
    }

    const days = Array.from({ length: 30 }, (_, i) => i + 1);
    const dayStyle = (day) =>
      item.completedDays.includes(day) ? [styles.completedCube, { backgroundColor: item.selectedColor }] : styles.incompleteCube;

    return (
      <View style={[styles.noRoutinesContainer, { borderColor: item.selectedColor }]}>
        <View style={styles.daysContainer}>
          {days.map((day) => (
            <TouchableOpacity key={day} style={[styles.dayCube, dayStyle(day)]} activeOpacity={.777}>
              <Text style={styles.dayText}>{day}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <View style={{ flexDirection: 'row', justifyContent: "space-between" }}>
          <View style={[styles.emojiContainer, { backgroundColor: item.selectedColor }]}>
            <Text style={styles.routineEmoji}>{item.selectedEmoji || "🎯"}</Text>
          </View>
          <View style={{ right: 80 }}>
            <Text style={styles.noRoutinesText}>{item.routineName || "My goal"}</Text>
            <Text style={styles.noRoutinesMiniText}>{item.routineDescription || "Work hard to achieve your goals, or others will achieve them instead."}</Text>
          </View>
          <TouchableOpacity onPress={() => handleTimesCompleted(index)} style={styles.addButton}>
            <FontAwesome name="check" size={24} color={item.selectedColor} />
            <Text style={styles.timesText}>{item.completedTimes}/{item.timesPerDay}</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.progressBarContainer}>
          <Animated.View style={[styles.progressBar, { width: progressBarWidths[index].interpolate({ inputRange: [0, 100], outputRange: ['1%', '100%'] }), backgroundColor: item.selectedColor }]} />
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerTop}>
        <Text style={styles.headerTitle}>DailyRoutine</Text>
        <TouchableOpacity onPress={handleAddRoutine} style={styles.plusContainer}>
          <FontAwesome name="plus" size={16} color="#999" />
        </TouchableOpacity>
      </View>
      <View style={styles.content}>
        {routines.length ? (
          <FlatList
            data={routines}
            renderItem={renderRoutine}
            keyExtractor={(item, index) => index.toString()}
          />
        ) : (
          <View style={styles.noRoutinesContainer2}>
            <View style={styles.daysContainer}>
              {Array.from({ length: 30 }, (_, i) => i + 1).map((day) => (
                <TouchableOpacity key={day} style={[styles.dayCube, styles.incompleteCube]}>
                  <Text style={styles.dayText}>{day}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <View style={{ flexDirection: 'row', justifyContent: "space-between" }}>
              <View>
                <Text style={styles.noRoutinesText}>No routines</Text>
                <Text style={styles.noRoutinesMiniText}>Add your first routine</Text>
              </View>
              <TouchableOpacity onPress={handleAddRoutine} style={styles.addButton}>
                <FontAwesome name="plus" size={24} color="#999" />
              </TouchableOpacity>
            </View>
            <View style={styles.progressBarContainer2}>
            </View>
          </View>
        )}
      </View>
      <Header navigation={navigation} />
      <StatusBar style="auto" />
      <Animated.View style={[styles.configContainer, { transform: [{ translateY: configPosition }] }]}>
        {showConfig && <Config onDone={handleDoneConfig} />}
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111',
    position: 'relative',
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    paddingHorizontal: 20,
    backgroundColor: '#111',
    borderBottomWidth: 1,
    borderBottomColor: '#111',
    paddingTop: 50,
  },
  headerTitle: {
    fontSize: 30,
    fontWeight: 'bold',
    color: "white",
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  noRoutinesContainer: {
    backgroundColor: "#222",
    padding: 8,
    width: 390,
    height: 210,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "white",
    marginBottom: 10,
  },
  noRoutinesContainer2: {
    backgroundColor: "#222",
    padding: 8,
    width: 390,
    height: 210,
    marginTop: -470,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "white",
    marginBottom: 10,
  },
  noRoutinesText: {
    fontSize: 34,
    color: 'white',
    fontWeight: "bold",
    left: 10,
  },
  noRoutinesMiniText: {
    fontSize: 13,
    color: 'white',
    width: 230,
    left: 5
  },
  addButton: {
    marginTop: 5,
    backgroundColor: '#333',
    borderRadius: 12,
    height: 65,
    width: 70,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    right: 0,
  },
  plusContainer: {
    width: 30,
    height: 30,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#222",
  },
  daysContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  dayCube: {
    width: 35,
    height: 32,
    margin: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
  },
  incompleteCube: {
    backgroundColor: '#444',
  },
  completedCube: {
    backgroundColor: 'orange',
  },
  dayText: {
    color: "#222",
    fontWeight: "bold",
  },
  timesText: {
    color: "white",
    fontWeight: "bold",
    top: 5,
  },
  emojiContainer: {
    width: 60,
    height: 60,
    backgroundColor: '#444',
    borderRadius: 20,
    marginTop: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  routineEmoji: {
    fontSize: 40,
  },
  progressBarContainer: {
    height: 15,
    backgroundColor: '#333',
    borderRadius: 10,
    marginTop: 10,
    overflow: 'hidden',
  },
  progressBarContainer2: {
    height: 15,
    backgroundColor: '#333',
    borderRadius: 10,
    top: 20,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 12,
  },
  configContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#222',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
});

export default Home;
