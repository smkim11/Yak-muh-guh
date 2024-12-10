import React, { useContext } from 'react';
import { View, Text, FlatList, Button, StyleSheet, TouchableOpacity, Switch, Alert } from 'react-native';
import { MedicationContext } from './context/MedicationContext';

export default function Home() {
  const {
    medications,
    toggleMedicationStatus,
    toggleMedicationNotification,
    removeMedication,
    updateHistoryForToday,
  } = useContext(MedicationContext);

  // 약 삭제 확인 알림
  const confirmDelete = (id) => {
    Alert.alert(
      '약 삭제',
      '정말로 이 약을 삭제하시겠습니까?',
      [
        { text: '취소', style: 'cancel' },
        { text: '삭제', onPress: () => removeMedication(id) },
      ],
      { cancelable: true }
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>오늘 복용할 약</Text>
      <FlatList
        data={medications}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.period}>복용 기간: {item.period}</Text>
            <Text style={styles.timesTitle}>복용 시간:</Text>
            {item.reminderTimes?.length > 0 ? (
              item.reminderTimes.map((time, index) => (
                <Text key={`${item.id}-${index}`} style={styles.reminderTime}>
                  - {time}
                </Text>
              ))
            ) : (
              <Text style={styles.noTimes}>복용 시간이 설정되지 않았습니다.</Text>
            )}
            <View style={styles.toggleContainer}>
              <Text>알림 {item.notificationsEnabled ? '켜짐' : '꺼짐'}</Text>
              <Switch
                value={item.notificationsEnabled}
                onValueChange={() => toggleMedicationNotification(item.id)}
              />
            </View>
            <View style={styles.buttons}>
              <Button
                title={item.taken ? '✅ 완료' : '복용 완료'}
                onPress={() => toggleMedicationStatus(item.id)}
              />
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => confirmDelete(item.id)}
              >
                <Text style={styles.deleteButtonText}>X</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
      <Button
        title="복용 완료 기록"
        onPress={updateHistoryForToday}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 24, marginBottom: 20 },
  item: {
    marginBottom: 15,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  name: { fontSize: 18, fontWeight: 'bold' },
  period: { fontSize: 14, color: '#666', marginTop: 5 },
  timesTitle: { fontSize: 16, marginTop: 10 },
  reminderTime: { fontSize: 14, color: '#444', marginLeft: 10 },
  noTimes: { fontSize: 14, color: 'red', marginLeft: 10 },
  toggleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  buttons: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 },
  deleteButton: {
    marginLeft: 10,
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 5,
  },
  deleteButtonText: { color: 'white', fontWeight: 'bold' },
});
