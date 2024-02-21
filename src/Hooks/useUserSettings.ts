import { UserSettings } from '@Type/Model';
import { useState } from 'react';

const appName = import.meta.env.VITE_APP_NAME;

export const useUserSettings = () => {
  const [userSettings, setUserSettings] = useState<UserSettings | null>(() => {
    const savedUserSettings = localStorage.getItem(`${appName}:userSettings`);

    if (savedUserSettings === null) {
      return null;
    }

    return JSON.parse(savedUserSettings) as UserSettings;
  });

  const get = () => userSettings;

  const set = (fields: Partial<UserSettings>) => {
    const newUserSettings: UserSettings = {
      ...(userSettings || ({} as UserSettings)),
      ...fields,
    };

    setUserSettings(newUserSettings);
    localStorage.setItem(`${appName}:userSettings`, JSON.stringify(newUserSettings));
  };

  return { get, set };
};
