const DEMO_MODE_KEY = 'tsis_demo_mode_enabled';

export function isDemoModeEnabled(): boolean {
  try {
    const item = localStorage.getItem(DEMO_MODE_KEY);
    return item === 'true';
  } catch {
    return false;
  }
}

export function setDemoModeEnabled(enabled: boolean): void {
  try {
    localStorage.setItem(DEMO_MODE_KEY, String(enabled));
  } catch (error) {
    console.error('Failed to set demo mode preference:', error);
  }
}
