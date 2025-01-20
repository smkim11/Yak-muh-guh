import React, { useContext, useState } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { MedicationContext } from './context/MedicationContext';

export default function History() {
  const { history } = useContext(MedicationContext);
  const [selectedDate, setSelectedDate] = useState(null);

  const markedDates = Object.keys(history).reduce((acc, date) => {
    acc[date] = {
      marked: true,
      dotColor: history[date].status === 'O' ? 'green' : 'red',
    };
    return acc;
  }, {});

  if (selectedDate) {
    markedDates[selectedDate] = {
      ...markedDates[selectedDate],
      selected: true,
      selectedColor: '#778bdd',
    };
  }

  const selectedHistory = selectedDate ? history[selectedDate]?.medications : [];

  return (
    <View style={styles.container}>
      <Calendar
        markedDates={markedDates}
        onDayPress={(day) => {
          setSelectedDate(day.dateString);
        }}
        style={styles.calendar}
        theme={{
          selectedDayBackgroundColor: '#778bdd',
          arrowColor: '#778bdd',
          textDayFontWeight: '500',
          textMonthFontWeight: 'bold',
        }}
      />
      <View style={styles.recordContainer}>
        {selectedDate ? (
          selectedHistory?.length > 0 ? (
            <>
              <Text style={styles.recordTitle}>{selectedDate} 복약 기록:</Text>
              <FlatList
                data={selectedHistory}
                keyExtractor={(item, index) => `${selectedDate}-${index}`}
                renderItem={({ item }) => (
                    <Text style={styles.recordItem}>
                       - {item.name} ({item.time})
                    </Text>
                     )}
                />
            </>
          ) : (<Text style={styles.noRecord}>선택한 날짜에 복약 기록이 없습니다.</Text>)) : 
          (<Text style={styles.noRecord}>날짜를 선택해주세요.</Text>)
          }
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  calendar: {
    borderRadius: 10,
    elevation: 4,
  },
  recordContainer: {
    marginTop: 20,
  },
  recordTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  recordItem: {
    fontSize: 16,
    marginLeft: 10,
    marginBottom: 5,
  },
  noRecord: {
    fontSize: 16,
    color: 'gray',
    marginTop: 10,
    textAlign: 'center',
  },
});
