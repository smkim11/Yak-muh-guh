import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const MedicationContext = createContext();

export const MedicationProvider = ({ children }) => {
  const [medications, setMedications] = useState([]);
  const [history, setHistory] = useState({});
  const [notificationsEnabled, setNotificationsEnabled] = useState(true); // 알림 On/Off 상태

  // AsyncStorage에서 데이터를 불러오기
  const loadData = async () => {
    try {
      const storedMedications = await AsyncStorage.getItem('medications');
      const storedHistory = await AsyncStorage.getItem('history');
      const storedNotificationsEnabled = await AsyncStorage.getItem('notificationsEnabled');

      if (storedMedications) setMedications(JSON.parse(storedMedications));
      if (storedHistory) setHistory(JSON.parse(storedHistory));
      if (storedNotificationsEnabled) setNotificationsEnabled(JSON.parse(storedNotificationsEnabled));
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
    }
    setMedications((prev) => [
      ...prev,
      { id: Date.now().toString(), name, period, reminderTimes, taken: false, notificationsEnabled: true },
    ]);
  };
  

  // 복용 상태 토글 함수
  const toggleMedicationStatus = (id) => {
    setMedications((prev) =>
      prev.map((med) =>
        med.id === id ? { ...med, taken: !med.taken } : med
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
    const allTaken = medications.every((med) => med.taken); // 모든 약 복용 완료 여부 확인
    const status = allTaken ? 'O' : 'X'; // O: 성공, X: 실패

    setHistory((prev) => ({
      ...prev,
      [today]: { status },
    }));
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
        notificationsEnabled, // 알림 상태
        toggleNotifications, // 알림 상태 토글 함수
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
