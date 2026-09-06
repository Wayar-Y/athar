import {loadRecord,saveRecord} from './recordStorage';
import { useEffect, useRef, useState } from 'react';

// GitHub Pages uses IndexedDB; the optional server mode retains SQLite.
export function useStoredState<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(initial);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const pending = useRef(0);
  useEffect(() => {
    const guard = (event: BeforeUnloadEvent) => { if (pending.current > 0 || error) { event.preventDefault(); event.returnValue = ''; } };
    window.addEventListener('beforeunload', guard);
    return () => window.removeEventListener('beforeunload', guard);
  }, [error]);
  const revision = useRef(0);
  const saved = useRef('');
  const queue = useRef(Promise.resolve());
  useEffect(() => {
    let active = true;
    loadRecord(key).then(data => {
      if (!active) return;
      revision.current = data.revision;
      if (data.value !== null) { saved.current = JSON.stringify(data.value); setValue(data.value); }
      setReady(true);
    }).catch(e => { if (active) setError(e.message); });
    return () => { active = false; };
  }, [key]);
  useEffect(() => {
    if (!ready) return;
    const serialized = JSON.stringify(value);
    if (serialized === saved.current) return;
    pending.current += 1; setSaving(true);
    queue.current = queue.current.then(async () => {
      revision.current = await saveRecord(key, JSON.parse(serialized), revision.current);
      saved.current = serialized;
      setError('');
    }).catch(e => setError(e.message)).finally(() => { pending.current -= 1; setSaving(pending.current > 0); });
  }, [value, ready, key]);
  return [value, setValue, {ready, error, saving}] as const;
}
