import React from 'react';
import { StyleSheet, View, Text, FlatList } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import Header from './Header';

const Goal = ({ navigation, route }) => {
  const { routines } = route.params;

  const renderGoal = ({ item }) => {
    const totalDays = 30;
    const completedDays = item.completedDays.length;
    const completionPercentage = Math.round((completedDays / totalDays) * 100);

    return (
      <View style={styles.goalContainer}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text style={[styles.goalEmoji, { backgroundColor: item.selectedColor }]}>
            {item.selectedEmoji || "🎯"}
          </Text>
          <View style={{ marginLeft: 10 }}>
            <Text style={styles.goalTitle}>{item.routineName}</Text>
            <Text style={styles.goalDescription}>{item.routineDescription}</Text>
          </View>
        </View>
        <Text style={styles.goalProgress}>Completed: {completionPercentage}%</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {routines.length ? (
          <FlatList
            data={routines}
            renderItem={renderGoal}
            keyExtractor={(item, index) => index.toString()}
          />
        ) : (
          <Text style={styles.noGoalsText}>No goals to display</Text>
        )}
      </View>
      <Header navigation={navigation} />
      <StatusBar style="auto" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  goalContainer: {
    backgroundColor: '#222',
    padding: 15,
    borderRadius: 10,
    marginVertical: 10,
  },
  goalEmoji: {
    fontSize: 40,
    borderRadius: 20,
    padding: 10,
    textAlign: 'center',
    textAlignVertical: 'center',
  },
  goalTitle: {
    fontSize: 20,
    color: 'white',
    fontWeight: 'bold',
  },
  goalDescription: {
    fontSize: 14,
    color: 'white',
  },
  goalProgress: {
    marginTop: 10,
    fontSize: 16,
    color: 'white',
  },
  noGoalsText: {
    color: 'white',
    fontSize: 18,
    textAlign: 'center',
    marginTop: 20,
  },
});

export default Goal;
