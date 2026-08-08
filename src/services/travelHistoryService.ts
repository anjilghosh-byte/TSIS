import { getCurrentUser } from './authService';

export interface TravelHistoryRecord {
  id: string;
  userId: string;
  destinationId: string;
  destinationName: string;
  country: string;
  state?: string;
  latitude: number;
  longitude: number;
  startDate: string;
  endDate: string;
  days: number;
  tripId?: string;
  createdAt: string;
}

const HISTORY_STORAGE_KEY = 'tsis_travel_history';

function getStoredHistory(): TravelHistoryRecord[] {
  try {
    const raw = localStorage.getItem(HISTORY_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveHistory(history: TravelHistoryRecord[]): void {
  localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(history));
}

function enforceAuth(userId: string): void {
  const currentUser = getCurrentUser();
  if (!currentUser || currentUser.id !== userId) {
    throw new Error('Unauthorized access. Access denied.');
  }
}

export function getTravelHistory(userId: string): TravelHistoryRecord[] {
  enforceAuth(userId);
  const allHistory = getStoredHistory();
  return allHistory.filter((item) => item.userId === userId);
}

export function addVisitedPlace(
  userId: string,
  visit: Omit<TravelHistoryRecord, 'id' | 'userId' | 'createdAt'>
): TravelHistoryRecord {
  enforceAuth(userId);

  const newRecord: TravelHistoryRecord = {
    ...visit,
    id: `history-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    userId,
    createdAt: new Date().toISOString(),
  };

  const allHistory = getStoredHistory();
  allHistory.push(newRecord);
  saveHistory(allHistory);

  return newRecord;
}

export function deleteVisitedPlace(userId: string, historyId: string): void {
  enforceAuth(userId);

  const allHistory = getStoredHistory();
  const record = allHistory.find((item) => item.id === historyId);
  if (!record) {
    throw new Error('Record not found.');
  }
  if (record.userId !== userId) {
    throw new Error('Unauthorized action.');
  }

  const updatedHistory = allHistory.filter((item) => item.id !== historyId);
  saveHistory(updatedHistory);
}
