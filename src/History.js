import React, { useContext } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { MedicationContext } from './context/MedicationContext';

export default function History() {
  const { history } = useContext(MedicationContext);

  const markedDates = Object.keys(history).reduce((acc, date) => {
    acc[date] = {
      marked: true,
      dotColor: history[date].status === 'O' ? 'green' : 'red',
    };
    return acc;
  }, {});

  return (
    <View style={styles.container}>
      <Text style={styles.title}>복약 기록</Text>
      <Calendar
        markedDates={markedDates}
        onDayPress={(day) => {
          console.log(`선택한 날짜: ${day.dateString}`);
        }}
        style={styles.calendar}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 24, marginBottom: 20 },
  calendar: { borderRadius: 10, elevation: 4 },
});
