import React, { useState, useContext, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  FlatList,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Calendar } from 'react-native-calendars';
import * as Notifications from 'expo-notifications';
import { MedicationContext } from './context/MedicationContext';

// 알림 설정
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export default function Medication() {
  const { addMedication, notificationsEnabled } = useContext(MedicationContext);
  const [name, setName] = useState('');
  const [selectedDates, setSelectedDates] = useState({ start: null, end: null });
  const [reminderTimes, setReminderTimes] = useState([]);
  const [currentReminder, setCurrentReminder] = useState('');

  // 알림 권한 요청
  useEffect(() => {
    const registerForPushNotificationsAsync = async () => {
      const { status } = await Notifications.getPermissionsAsync();
      if (status !== 'granted') {
        const { status: newStatus } = await Notifications.requestPermissionsAsync();
        if (newStatus !== 'granted') {
          Alert.alert('알림 권한이 필요합니다.');
        }
      }
    };

    registerForPushNotificationsAsync();
  }, []);

  const handleDayPress = (day) => {
    if (!selectedDates.start || (selectedDates.start && selectedDates.end)) {
      setSelectedDates({ start: day.dateString, end: null });
    } else {
      setSelectedDates((prev) => ({
        ...prev,
        end: day.dateString,
      }));
    }
  };

  // 복용 시간 추가
  const addReminderTime = () => {
    if (!currentReminder.trim()) {
      Alert.alert('복용 시간을 입력하세요!');
      return;
    }
    if (!/^\d{2}:\d{2}$/.test(currentReminder)) {
      Alert.alert('시간 형식이 올바르지 않습니다. 예: 08:00');
      return;
    }
    setReminderTimes((prev) => [...prev, currentReminder]);
    setCurrentReminder('');
  };

  // 복용 시간 삭제
  const removeReminderTime = (time) => {
    setReminderTimes((prev) => prev.filter((t) => t !== time));
  };

  // 알림 예약 함수
  const scheduleNotification = async (name, date, time) => {
    if (!notificationsEnabled) return;

    const [hour, minute] = time.split(':').map(Number);
    const notificationDate = new Date(date);
    notificationDate.setHours(hour);
    notificationDate.setMinutes(minute);

    await Notifications.scheduleNotificationAsync({
      content: {
        title: '약 복용 알림',
        body: `${name}을(를) 복용할 시간입니다.`,
      },
      trigger: notificationDate,
    });
  };

  const handleAddMedication = async () => {
    if (!name.trim()) {
      Alert.alert('약 이름을 입력하세요!');
      return;
    }
    if (!selectedDates.start || !selectedDates.end) {
      Alert.alert('복용 시작일과 종료일을 선택하세요!');
      return;
    }
    if (reminderTimes.length === 0) {
      Alert.alert('복용 시간을 최소 1개 이상 추가하세요!');
      return;
    }

    // 약 추가
    addMedication({
      name,
      period: `${selectedDates.start} ~ ${selectedDates.end}`,
      reminderTimes,
    });

    // 알림 예약
    let currentDate = new Date(selectedDates.start);
    const endDate = new Date(selectedDates.end);

    while (currentDate <= endDate) {
      for (const time of reminderTimes) {
        await scheduleNotification(name, currentDate.toISOString().split('T')[0], time);
      }
      currentDate.setDate(currentDate.getDate() + 1); // 다음 날로 이동
    }

    Alert.alert('약이 추가되고 알림이 설정되었습니다!');
    setName('');
    setSelectedDates({ start: null, end: null });
    setReminderTimes([]);
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
  <View style={styles.container}>
    <Text style={styles.title}>새로운 약 추가</Text>
    <TextInput
      style={styles.input}
      placeholder="약 이름 입력"
      value={name}
      onChangeText={setName}
    />
    <Text style={styles.subTitle}>복용 기간 선택</Text>
    <Calendar
      markedDates={{
        ...(selectedDates.start && { [selectedDates.start]: { selected: true, selectedColor: 'blue' } }),
        ...(selectedDates.end && { [selectedDates.end]: { selected: true, selectedColor: 'blue' } }),
      }}
      onDayPress={handleDayPress}
    />
    {selectedDates.start && selectedDates.end && (
      <Text style={styles.periodText}>
        복용 기간: {selectedDates.start} ~ {selectedDates.end}
      </Text>
    )}
    <Text style={styles.subTitle}>복용 시간 추가</Text>
    <View style={styles.timeInputContainer}>
      <TextInput
        style={styles.input}
        placeholder="예: 08:00"
        value={currentReminder}
        onChangeText={setCurrentReminder}
        keyboardType="numeric"
      />
      <Button title="추가" onPress={addReminderTime} />
    </View>
    <View>
      {reminderTimes.map((time, index) => (
        <View key={`${time}-${index}`} style={styles.timeItem}>
          <Text>{time}</Text>
          <TouchableOpacity onPress={() => removeReminderTime(time)}>
            <Text style={styles.deleteButton}>X</Text>
          </TouchableOpacity>
        </View>
      ))}
    </View>
    <Button title="약 추가" onPress={handleAddMedication} />
  </View>
</ScrollView>

  );
}

const styles = StyleSheet.create({
  scrollContainer: { flexGrow: 1 },
  container: { flex: 1, padding: 20 },
  title: { fontSize: 24, marginBottom: 20, textAlign: 'center' },
  subTitle: { fontSize: 18, marginBottom: 10 },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 10, marginBottom: 20, borderRadius: 5 },
  periodText: { fontSize: 16, color: 'green', marginVertical: 10, textAlign: 'center' },
  timeInputContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  timeItem: { flexDirection: 'row', justifyContent: 'space-between', padding: 10, borderBottomWidth: 1, borderColor: '#ccc' },
  deleteButton: { color: 'red', fontWeight: 'bold' },
});
