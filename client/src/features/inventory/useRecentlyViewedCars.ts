import { useEffect, useMemo, useSyncExternalStore } from 'react';
import { useLocation } from 'react-router-dom';
import type { Car } from './types';

const storageKey = 'mustang-garage:recently-viewed';
const changeEvent = 'mustang-garage:recently-viewed-changed';
let memorySnapshot = '';
let storageUnavailable = false;

function getSnapshot() {
  if (storageUnavailable) return memorySnapshot;
  try {
    return window.localStorage.getItem(storageKey) ?? memorySnapshot;
  } catch {
    storageUnavailable = true;
    return memorySnapshot;
  }
}

function parseIds(snapshot: string): number[] {
  try {
    const value: unknown = JSON.parse(snapshot);
    return Array.isArray(value)
      ? [...new Set(value.filter((id): id is number => typeof id === 'number' && Number.isSafeInteger(id)))].slice(0, 3)
      : [];
  } catch {
    return [];
  }
}

function subscribe(onChange: () => void) {
  const onStorage = (event: StorageEvent) => {
    if (event.key === storageKey || event.key === null) {
      memorySnapshot = event.newValue ?? '';
      storageUnavailable = false;
      onChange();
    }
  };
  window.addEventListener(changeEvent, onChange);
  window.addEventListener('storage', onStorage);
  return () => {
    window.removeEventListener(changeEvent, onChange);
    window.removeEventListener('storage', onStorage);
  };
}

export default function useRecentlyViewedCars(cars: Car[]) {
  const { pathname } = useLocation();
  const snapshot = useSyncExternalStore(subscribe, getSnapshot, () => '');

  useEffect(() => {
    const match = /^\/inventory\/(\d+)\/?$/.exec(pathname);
    const car = match ? cars.find(item => item.id === Number(match[1])) : undefined;
    if (!car) return;
    const previous = getSnapshot();
    const ids = parseIds(previous).filter(id => cars.some(item => item.id === id));
    const next = JSON.stringify([car.id, ...ids.filter(id => id !== car.id)].slice(0, 3));
    if (next === previous) return;
    memorySnapshot = next;
    try {
      window.localStorage.setItem(storageKey, next);
    } catch {
      storageUnavailable = true;
      // Browsing history still works in memory when storage is unavailable.
    }
    window.dispatchEvent(new Event(changeEvent));
  }, [pathname, cars]);

  return useMemo(() => parseIds(snapshot)
    .map(id => cars.find(car => car.id === id))
    .filter((car): car is Car => Boolean(car)), [snapshot, cars]);
}

