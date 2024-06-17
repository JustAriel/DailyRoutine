import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal, StyleSheet, Switch } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as Notifications from 'expo-notifications';
import EmojiSelector from 'react-native-emoji-selector';

const Config = ({ onDone }) => {
  const [selectedColor, setSelectedColor] = useState('orange');
  const [timesPerDay, setTimesPerDay] = useState(1);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [selectedEmoji, setSelectedEmoji] = useState(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [routineName, setRoutineName] = useState('');
  const [routineDescription, setRoutineDescription] = useState('');

  const colorOptions = ["#fff", '#777', '#666', '#999', 'orange', 'green', '##115DC7'];

  useEffect(() => {
    if (notificationsEnabled) {
      scheduleNotification(selectedDate);
    } else {
      Notifications.cancelAllScheduledNotificationsAsync();
    }
  }, [notificationsEnabled, selectedDate]);

  const formatDate = (date) => {
    return `${date.getMonth() + 1} - ${date.getDate()} - ${date.getFullYear()}`;
  };

  const handleDateChange = (event, date) => {
    if (date) {
      setSelectedDate(date);
    }
    setShowDatePicker(Platform.OS === 'ios');
  };

  const scheduleNotification = async (notificationDate) => {
    if (!notificationsEnabled) return;

    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Daily Reminder',
        body: "It's time to check up your routine!",
      },
      trigger: {
        hour: notificationDate.getHours(),
        minute: notificationDate.getMinutes(),
        repeats: true,
      },
    });
  };

  const toggleNotifications = () => {
    setNotificationsEnabled((prev) => !prev);
  };

  const handleEmojiSelection = useCallback((emoji) => {
    setSelectedEmoji(emoji);
    setShowEmojiPicker(false);
  }, []);

  const toggleEmojiPicker = useCallback(() => {
    setShowEmojiPicker(prev => !prev);
  }, []);

  const toggleDatePicker = () => {
    setShowDatePicker((prev) => !prev);
  };

  const handleDone = () => {
    const configData = {
      selectedEmoji,
      routineName,
      routineDescription,
      selectedColor,
      timesPerDay,
      selectedDate,
      notificationsEnabled,
    };
    onDone(configData);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.topRow}>
        <TouchableOpacity onPress={() => console.log("Close button pressed")} style={styles.closeButton}>
          <FontAwesome name="times" size={18} color="white" />
        </TouchableOpacity>
        <Text style={styles.addRoutineText}>Add Routine</Text>
        <TouchableOpacity onPress={handleDone} style={styles.doneButton}>
          <FontAwesome name="check" size={16} color="white" />
        </TouchableOpacity>
      </View>

      <View style={styles.routineContainer}>
        <TouchableOpacity style={styles.routineImage} onPress={toggleEmojiPicker}>
          <Text style={{ fontSize: 60 }}>{selectedEmoji || '🎯'}</Text>
        </TouchableOpacity>

        {/* Routine Inputs */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Routine Name (15 Chars)"
            placeholderTextColor="#999"
            value={routineName}
            maxLength={15}
            onChangeText={(text) => setRoutineName(text)}
          />
          <TextInput
            style={[styles.input, { marginTop: 10 }]}
            placeholder="Routine Description (80 Chars)"
            maxLength={80}
            placeholderTextColor="#999"
            value={routineDescription}
            onChangeText={(text) => setRoutineDescription(text)}
            multiline
          />
        </View>
      </View>

      {/* Color Theme */}
      <View style={styles.colorThemeContainer}>
        <Text style={styles.colorThemeText}>Theme</Text>
        <View style={styles.colorButtons}>
          {colorOptions.map((color, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.colorButton,
                { backgroundColor: color, borderWidth: selectedColor === color ? 5 : 0, borderColor: selectedColor === color ? '#191919' : 'transparent' }
              ]}
              onPress={() => setSelectedColor(color)}
            />
          ))}
        </View>
      </View>

      {/* Times per Day */}
      <View style={styles.counterContainer}>
        <Text style={styles.counterText}>Times per Day</Text>
        <View style={styles.counterButtons}>
          <TouchableOpacity
            style={styles.counterButton}
            onPress={() => setTimesPerDay(prev => Math.max(prev - 1, 1))}
          >
            <FontAwesome name="minus" size={16} color="white" />
          </TouchableOpacity>
          <Text style={styles.counterValue}>{timesPerDay}</Text>
          <TouchableOpacity
            style={styles.counterButton}
            onPress={() => setTimesPerDay(prev => prev + 1)}
          >
            <FontAwesome name="plus" size={16} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Start Date */}
      <View style={styles.dateContainer}>
        <Text style={styles.counterText}>Start date</Text>
        <TouchableOpacity onPress={toggleDatePicker} style={styles.dateButton}>
          <Text style={styles.selectedDate}>{formatDate(selectedDate)}</Text>
          <FontAwesome name="calendar" size={16} color="white" />
        </TouchableOpacity>
        {showDatePicker && (
          <DateTimePicker
            value={selectedDate}
            mode="date"
            display="spinner"
            onChange={handleDateChange}
            textColor="#fff"
            style={styles.datePicker}
          />
        )}
      </View>

      {/* Notifications */}
      <View style={styles.notificationsContainer}>
        <Text style={styles.notificationsText}>Notifications</Text>
        <Switch
          trackColor={{ false: '#767577', true: '#81b0ff' }}
          thumbColor={notificationsEnabled ? '#f5dd4b' : '#f4f3f4'}
          ios_backgroundColor="#3e3e3e"
          onValueChange={toggleNotifications}
          value={notificationsEnabled}
        />
      </View>

      {/* Emoji Picker Modal */}
      <Modal
        animationType="slide"
        visible={showEmojiPicker}
        onRequestClose={() => setShowEmojiPicker(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalHeaderText}>Select Emoji</Text>
            <TouchableOpacity onPress={() => setShowEmojiPicker(false)} style={styles.closeModalButton}>
              <FontAwesome name="times" size={18} color="white" />
            </TouchableOpacity>
          </View>
          <View style={styles.modalContent}>
            <EmojiSelector
              onEmojiSelected={handleEmojiSelection}
              columns={6}
              placeholder="Search emoji..."
              showSearchBar
              showSectionTitles
              theme="dark"
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#191919',
    paddingHorizontal: 20,
    paddingTop: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    flex: 1,
    paddingBottom: 20,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  closeButton: {
    padding: 10,
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#222",
    borderRadius: 12,
  },
  addRoutineText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  doneButton: {
    padding: 10,
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#222",
    borderRadius: 12,
  },
  routineContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: "#121212",
    padding: 10,
    borderRadius: 12,
    marginBottom: 20,
  },
  routineImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginRight: 20,
    backgroundColor: "#333",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  inputContainer: {
    flex: 1,
  },
  input: {
    backgroundColor: '#333',
    borderRadius: 8,
    padding: 10,
    color: 'white',
  },
  colorThemeContainer: {
    marginBottom: 10,
    backgroundColor: "#121212",
    borderRadius: 12,
    padding: 10,
  },
  colorThemeText: {
    color: 'white',
    fontSize: 18,
    marginBottom: 10,
    fontWeight: "bold",
  },
  colorButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  colorButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  counterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    backgroundColor: "#121212",
    borderRadius: 12,
    padding: 10,
  },
  counterText: {
    color: 'white',
    fontSize: 18,
    marginBottom: 10,
    fontWeight: "bold",
    marginRight: 20,
  },
  counterButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 120,
  },
  counterButton: {
    backgroundColor: '#333',
    width: 30,
    height: 30,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: -10,
  },
  counterValue: {
    color: 'white',
    fontSize: 18,
    marginHorizontal: 10,
    fontWeight: "bold",
    paddingLeft: 18,
    paddingHorizontal: 12,
  },
  dateContainer: {
    backgroundColor: "#121212",
    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    padding: 10,
  },
  dateButton: {
    flexDirection: "row",
    padding: 10,
    alignItems: 'center',
    width: 200,
    borderRadius: 12,
    backgroundColor: "#222",
  },
  dateButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  datePicker: {
    backgroundColor: '#333',
  },
  selectedDate: {
    color: "#eee",
    fontSize: 16,
    marginLeft: 30,
    marginRight: 45,
  },
  notificationsContainer: {
    backgroundColor: "#121212",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderRadius: 12,
    padding: 10,
    marginTop: 10,
  },
  notificationsText: {
    color: 'white',
    fontSize: 18,
    fontWeight: "bold",
  },
  notificationToggle: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: '#F44336',
  },
  notificationToggleText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  emojiContainer: {
    width: 414, 
    height: 490,
    position: "absolute",
    bottom: 0,
    backgroundColor: "#fff",
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#191919',
    paddingTop: 50,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  modalHeaderText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  closeModalButton: {
    padding: 10,
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#222",
    borderRadius: 12,
  },
  modalContent: {
    flex: 1,
    paddingHorizontal: 20,
  },
});

export default Config;
