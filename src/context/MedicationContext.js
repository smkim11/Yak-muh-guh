import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const MedicationContext = createContext();

export const MedicationProvider = ({ children }) => {
  const [medications, setMedications] = useState([]);
  const [history, setHistory] = useState({});
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  // AsyncStorage에서 데이터를 불러오기
  const loadData = async () => {
    try {
      const storedMedications = await AsyncStorage.getItem('medications');
      const storedHistory = await AsyncStorage.getItem('history');
      const storedNotificationsEnabled = await AsyncStorage.getItem('notificationsEnabled');

      setMedications(storedMedications ? JSON.parse(storedMedications) : []);
      setHistory(storedHistory ? JSON.parse(storedHistory) : {});
      setNotificationsEnabled(storedNotificationsEnabled ? JSON.parse(storedNotificationsEnabled) : true);
    } catch (error) {
      console.error('Failed to load data:', error);
    }
  };

  // AsyncStorage에 데이터를 저장하기
  const saveData = async () => {
    try {
      await AsyncStorage.setItem('medications', JSON.stringify(medications));
      await AsyncStorage.setItem('history', JSON.stringify(history));
      await AsyncStorage.setItem('notificationsEnabled', JSON.stringify(notificationsEnabled));
    } catch (error) {
      console.error('Failed to save data:', error);
    }
  };

  const addMedication = ({ name, period, reminderTimes }) => {
    if (!reminderTimes || reminderTimes.length === 0) {
      console.error('복용 시간이 설정되지 않았습니다.');
      return;
    }
    setMedications((prev) => [
      ...prev,
      { id: Date.now().toString(), name, period, reminderTimes, taken: {}, notificationsEnabled: true },
    ]);
  };

  // 복용 상태 토글 함수
  const toggleMedicationStatus = (id, time) => {
    setMedications((prev) =>
      prev.map((med) =>
        med.id === id
          ? {
              ...med,
              takenTimes: {
                ...med.takenTimes,
                [time]: !med.takenTimes?.[time], // 특정 시간 복용 상태 토글
              },
            }
          : med
      )
    );
  };
  

  // 알림 On/Off 토글 함수 (약별)
  const toggleMedicationNotification = (id) => {
    setMedications((prev) =>
      prev.map((med) =>
        med.id === id ? { ...med, notificationsEnabled: !med.notificationsEnabled } : med
      )
    );
  };

  // 약 제거 함수
  const removeMedication = (id) => {
    setMedications((prev) => prev.filter((med) => med.id !== id));
  };

  // 오늘 날짜 복약 상태 기록
  const updateHistoryForToday = () => {
    const today = new Date().toISOString().split('T')[0];
  
    // 복용 완료된 약물의 이름과 시간 추출
    const takenMedications = medications
      .filter((med) => med.takenTimes)
      .flatMap((med) =>
        Object.keys(med.takenTimes)
          .filter((time) => med.takenTimes[time]) // 복용 완료된 시간만 필터링
          .map((time) => ({ name: med.name, time }))
      );
  
    // 새로운 기록 상태
    const status = takenMedications.length > 0 ? 'O' : 'X';
  
    setHistory((prev) => ({
      ...prev,
      [today]: {
        status,
        medications: [...(prev[today]?.medications || []), ...takenMedications], // 이전 기록 유지 및 새로운 기록 추가
      },
    }));
  
    // 복용 상태 초기화
    setMedications((prev) =>
      prev.map((med) => ({
        ...med,
        taken: false, // 복용 상태 초기화
        takenTimes: {}, // 복용 시간 초기화
      }))
    );
  };
  
  

  // 알림 활성화/비활성화 상태 토글
  const toggleNotifications = () => {
    setNotificationsEnabled((prev) => !prev);
  };

  // 데이터 로드 및 저장 효과 적용
  useEffect(() => {
    loadData(); // 앱 실행 시 데이터 불러오기
  }, []);

  useEffect(() => {
    saveData(); // 데이터 변경 시 AsyncStorage에 저장
  }, [medications, history, notificationsEnabled]);

  return (
    <MedicationContext.Provider
      value={{
        medications,
        history,
        notificationsEnabled,
        toggleNotifications,
        addMedication,
        toggleMedicationStatus,
        toggleMedicationNotification,
        removeMedication,
        updateHistoryForToday,
      }}
    >
      {children}
    </MedicationContext.Provider>
  );
};
