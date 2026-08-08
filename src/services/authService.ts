import { EmergencyContact } from '../types/sos';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  preferences: string[];
  createdAt: string;
}

export interface UserRecord {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  salt: string;
  preferences: string[];
  createdAt: string;
}

const USERS_STORAGE_KEY = 'tsis_users';
const SESSION_STORAGE_KEY = 'tsis_current_session';

// Cryptographic helpers using browser native Web Crypto API
async function hashPassword(password: string, salt: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password + salt);
  const hashBuffer = await window.crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

function generateSalt(): string {
  const array = new Uint32Array(8);
  window.crypto.getRandomValues(array);
  return Array.from(array).map((n) => n.toString(16)).join('');
}

function getStoredUsers(): UserRecord[] {
  try {
    const raw = localStorage.getItem(USERS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveUsers(users: UserRecord[]): void {
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
}

export async function signUp(name: string, email: string, password: string): Promise<UserProfile> {
  const normalizedEmail = email.trim().toLowerCase();
  if (!name.trim() || !normalizedEmail || password.length < 6) {
    throw new Error('Invalid registration details. Password must be at least 6 characters.');
  }

  const users = getStoredUsers();
  if (users.some((u) => u.email === normalizedEmail)) {
    throw new Error('An account with this email already exists.');
  }

  const salt = generateSalt();
  const passwordHash = await hashPassword(password, salt);

  const newUser: UserRecord = {
    id: `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    name: name.trim(),
    email: normalizedEmail,
    passwordHash,
    salt,
    preferences: ['history', 'culture', 'food'],
    createdAt: new Date().toISOString(),
  };

  users.push(newUser);
  saveUsers(users);

  // Auto-login
  const profile: UserProfile = {
    id: newUser.id,
    name: newUser.name,
    email: newUser.email,
    preferences: newUser.preferences,
    createdAt: newUser.createdAt,
  };

  localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify({ token: `sess-${Date.now()}`, user: profile }));
  return profile;
}

export async function login(email: string, password: string): Promise<UserProfile> {
  const normalizedEmail = email.trim().toLowerCase();
  const users = getStoredUsers();
  const user = users.find((u) => u.email === normalizedEmail);

  if (!user) {
    throw new Error('Incorrect email or password.');
  }

  const inputHash = await hashPassword(password, user.salt);
  if (inputHash !== user.passwordHash) {
    throw new Error('Incorrect email or password.');
  }

  const profile: UserProfile = {
    id: user.id,
    name: user.name,
    email: user.email,
    preferences: user.preferences,
    createdAt: user.createdAt,
  };

  localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify({ token: `sess-${Date.now()}`, user: profile }));
  return profile;
}

export function logout(): void {
  localStorage.removeItem(SESSION_STORAGE_KEY);
}

export function getCurrentUser(): UserProfile | null {
  try {
    const sessionRaw = localStorage.getItem(SESSION_STORAGE_KEY);
    if (!sessionRaw) return null;
    const session = JSON.parse(sessionRaw);
    return session.user || null;
  } catch {
    return null;
  }
}

export function updateProfile(userId: string, name: string, preferences: string[]): UserProfile {
  const sessionRaw = localStorage.getItem(SESSION_STORAGE_KEY);
  if (!sessionRaw) throw new Error('Not authenticated.');
  const session = JSON.parse(sessionRaw);

  if (session.user.id !== userId) {
    throw new Error('Unauthorized action.');
  }

  const users = getStoredUsers();
  const index = users.findIndex((u) => u.id === userId);
  if (index === -1) throw new Error('User not found.');

  users[index].name = name.trim();
  users[index].preferences = preferences;
  saveUsers(users);

  const updatedProfile: UserProfile = {
    id: users[index].id,
    name: users[index].name,
    email: users[index].email,
    preferences: users[index].preferences,
    createdAt: users[index].createdAt,
  };

  localStorage.setItem(
    SESSION_STORAGE_KEY,
    JSON.stringify({ token: session.token, user: updatedProfile })
  );
  return updatedProfile;
}

export function resetPasswordSimulated(email: string): void {
  const normalizedEmail = email.trim().toLowerCase();
  const users = getStoredUsers();
  const user = users.find((u) => u.email === normalizedEmail);
  if (!user) {
    throw new Error('No account found with this email.');
  }
  // Simulated success
  console.log(`Password reset instructions sent to ${email}`);
}
