import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import Header from './Header';

const Goal = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text>Goal Screen</Text>
      </View>
      <Header navigation={navigation} />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#eee',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default Goal;
