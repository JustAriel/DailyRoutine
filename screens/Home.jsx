import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, Animated, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { FontAwesome } from '@expo/vector-icons';
import Header from './Header';
import Config from './Config';

const Home = ({ navigation, routines }) => {
  const [showConfig, setShowConfig] = useState(false);
  const [configPosition] = useState(new Animated.Value(1000));
  const [selectedRoutine, setSelectedRoutine] = useState(null);
  const [completedTimes, setCompletedTimes] = useState(0);
  const [completedDays, setCompletedDays] = useState([]); // Track completed days

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
    setSelectedRoutine(configData);
    setCompletedTimes(0);
    setCompletedDays([]); // Reset completed days when a new routine is selected
    setShowConfig(false);
  }, []);

  const handleTimesCompleted = () => {
    if (selectedRoutine && completedTimes < selectedRoutine.timesPerDay) {
      setCompletedTimes((prev) => {
        const newCompletedTimes = prev + 1;
        if (newCompletedTimes === selectedRoutine.timesPerDay) {
          // Mark the first day as completed
          setCompletedDays((days) => [...days, 1]);
        }
        return newCompletedTimes;
      });
    }
  };

  const renderDayCube = (day) => {
    const dayStyle = completedDays.includes(day) ? [styles.completedCube, { backgroundColor: selectedRoutine.selectedColor }] : styles.incompleteCube;
    
    return (
      <TouchableOpacity
        key={day}
        style={[styles.dayCube, dayStyle]}
        onPress={() => toggleDayCompletion(day)}
      >
        <Text style={styles.dayText}>{day}</Text>
      </TouchableOpacity>
    );
  };

  const toggleDayCompletion = (day) => {
    setCompletedDays((days) => {
      if (days.includes(day)) {
        return days.filter((d) => d !== day);
      } else {
        return [...days, day];
      }
    });
  };

  const days = Array.from({ length: 30 }, (_, index) => index + 1);

  return (
    <View style={styles.container}>
      <View style={styles.headerTop}>
        <Text style={styles.headerTitle}>DailyRoutine</Text>
        <TouchableOpacity onPress={handleAddRoutine} style={styles.plusContainer}>
          <FontAwesome name="plus" size={24} color="#999" />
        </TouchableOpacity>
      </View>
      <View style={styles.content}>
        {selectedRoutine ? (
          <View style={[styles.noRoutinesContainer, { borderColor: selectedRoutine.selectedColor }]}>
            <View style={styles.daysContainer}>
              {days.map((day) => renderDayCube(day))}
            </View>
            <View style={{ flexDirection: 'row', justifyContent: "space-between" }}>
              <View style={[styles.emojiContainer, { backgroundColor: selectedRoutine.selectedColor }]}>
                <Text style={styles.routineEmoji}>{selectedRoutine.selectedEmoji}</Text>
              </View>
              <View style={{ right: 80, }}>
                <Text style={styles.noRoutinesText}>{selectedRoutine.routineName}</Text>
                <Text style={styles.noRoutinesMiniText}>{selectedRoutine.routineDescription}</Text>
              </View>
              <TouchableOpacity onPress={handleTimesCompleted} style={styles.addButton}>
                <FontAwesome name="check" size={24} color={selectedRoutine.selectedColor} />
                <Text style={styles.timesText}>{completedTimes}/{selectedRoutine.timesPerDay}</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View style={styles.noRoutinesContainer}>
            <View style={styles.daysContainer}>
              {days.map((day) => renderDayCube(day))}
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

const formatDate = (date) => {
  return `${date.getMonth() + 1} - ${date.getDate()} - ${date.getFullYear()}`;
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
  routineContainer: {
    backgroundColor: "#222",
    padding: 20,
    borderRadius: 15,
    marginBottom: 20,
  },
  routineName: {
    fontSize: 24,
    color: 'white',
    fontWeight: 'bold',
  },
  routineDescription: {
    fontSize: 18,
    color: 'white',
    marginTop: 10,
  },
  routineDetails: {
    fontSize: 16,
    color: 'white',
    marginTop: 5,
  },
  noRoutinesContainer: {
    backgroundColor: "#222",
    padding: 8,
    width: 390,
    height: 190,
    borderRadius: 15,
    marginTop: -500,
    borderWidth: 1,
    borderColor: "white",
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
    width: 40,
    height: 40,
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
    backgroundColor: "#333",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 12,
    marginTop: 6,
  },
  routineEmoji: {
    fontSize: 40,
  }
});

export default Home;
