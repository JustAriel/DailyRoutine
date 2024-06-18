import React, { useEffect } from 'react';
import { StyleSheet, View, Text, FlatList } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import Header from './Header';
import Svg, { Circle } from 'react-native-svg';
import Animated, { Easing, useAnimatedProps, useSharedValue, withTiming } from 'react-native-reanimated';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const Goal = ({ navigation, route, size = 150, strokeWidth = 10, color = 'blue' }) => {
  const { routines = [] } = route.params || {};  // Default to empty array if params or routines is undefined

  const renderGoal = ({ item }) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const animatedValue = useSharedValue(0);

    useEffect(() => {
      const totalDays = 30;
      const completedDays = item.completedDays.length;
      const completionPercentage = Math.round((completedDays / totalDays) * 100);

      animatedValue.value = withTiming(completionPercentage, {
        duration: 1000,
        easing: Easing.out(Easing.exp),
      });
    }, [item.completedDays.length]);

    const animatedProps = useAnimatedProps(() => {
      const strokeDashoffset = circumference - (circumference * animatedValue.value) / 100;
      return { strokeDashoffset };
    });

    return (
      <View style={styles.goalContainer}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text style={[styles.goalEmoji, { backgroundColor: item.selectedColor }]}>
            {item.selectedEmoji || '🎯'}
          </Text>
          <View style={{ marginLeft: 10 }}>
            <Text style={styles.goalTitle}>{item.routineName}</Text>
            <Text style={styles.goalDescription}>{item.routineDescription}</Text>
          </View>
        </View>
        <Text style={styles.goalProgress}>Completed: {animatedValue.value}%</Text>
        <View style={styles.circleContainer}>
          <Svg height={size} width={size}>
            <Circle
              stroke="#e6e6e6"
              fill="none"
              cx={size / 2}
              cy={size / 2}
              r={radius}
              strokeWidth={strokeWidth}
            />
            <AnimatedCircle
              stroke={color}
              fill="none"
              cx={size / 2}
              cy={size / 2}
              r={radius}
              strokeWidth={strokeWidth}
              strokeDasharray={`${circumference}, ${circumference}`}
              animatedProps={animatedProps}
              strokeLinecap="round"
            />
          </Svg>
        </View>
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
    backgroundColor: '#121212',
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
    borderRadius: 12,
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
  circleContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
});

export default Goal;
