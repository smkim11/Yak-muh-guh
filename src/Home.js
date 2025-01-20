import React, { useContext } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Switch, Alert } from 'react-native';
import { MedicationContext } from './context/MedicationContext';

export default function Home() {
  const {
    medications,
    toggleMedicationStatus,
    toggleMedicationNotification,
    removeMedication,
    updateHistoryForToday,
  } = useContext(MedicationContext);

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
      {medications.length === 0 ? (
        <Text style={styles.emptyMessage}>현재 복용 중인 약물이 없습니다.</Text>
      ) : (
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
                  <View key={`${item.id}-${index}`} style={styles.timeRow}>
                    <View style={styles.reminderTimeRow}>
                      <Text style={styles.reminderTime}>- {time}</Text>
                      <TouchableOpacity
                        style={[
                          styles.button,
                          item.takenTimes?.[time] && styles.completedButton,
                          styles.smallerButton,
                        ]}
                        onPress={() => toggleMedicationStatus(item.id, time)}
                      >
                        <Text style={styles.smallerText}>
                          {item.takenTimes?.[time] ? '✅ 완료' : '복용 완료'}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ))
              ) : (
                <Text style={styles.noTimes}>복용 시간이 설정되지 않았습니다.</Text>
              )}
              <View style={styles.toggleContainer}>
                <Text style={styles.toggleText}>
                  알림 {item.notificationsEnabled ? '켜짐' : '꺼짐'}
                </Text>
                <Switch
                  value={item.notificationsEnabled}
                  onValueChange={() => toggleMedicationNotification(item.id)}
                />
              </View>
              <TouchableOpacity
                style={[styles.deleteButton, styles.smallerButton]}
                onPress={() => confirmDelete(item.id)}
              >
                <Text style={styles.smallerText}>X</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      )}
      <TouchableOpacity style={[styles.button, styles.recordButton]} onPress={updateHistoryForToday}>
        <Text style={styles.buttonText}>복용 완료 기록</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  emptyMessage: {
    textAlign: 'center',
    fontSize: 18,
    color: '#666',
    marginTop: 50,
  },
  item: {
    marginBottom: 20,
    padding: 15,
    borderRadius: 8,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
  },
  period: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  timesTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginTop: 15,
    color: '#444',
  },
  reminderTime: {
    fontSize: 14,
    color: '#444',
    marginLeft: 10,
  },
  reminderTimeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  noTimes: {
    fontSize: 14,
    color: '#f44336',
    marginLeft: 10,
  },
  toggleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 15,
  },
  toggleText: {
    fontSize: 14,
    color: '#444',
  },
  deleteButton: {
    marginTop: 10,
    backgroundColor: '#FF6C6C',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#778bdd',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  completedButton: {
    backgroundColor: '#4caf50',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  smallerText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  recordButton: {
    marginTop: 20,
  },
  smallerButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    fontSize: 10,
    width: 90,
    marginLeft: 'auto',
  },
});
