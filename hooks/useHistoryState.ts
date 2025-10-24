import { useState, useCallback } from 'react';

interface History<T> {
  past: T[];
  present: T;
  future: T[];
}

export const useHistoryState = <T>(initialState: T) => {
  const [history, setHistory] = useState<History<T>>({
    past: [],
    present: initialState,
    future: [],
  });

  const canUndo = history.past.length > 0;
  const canRedo = history.future.length > 0;

  const undo = useCallback(() => {
    if (!canUndo) return;

    setHistory(currentHistory => {
      const { past, present, future } = currentHistory;
      const previous = past[past.length - 1];
      const newPast = past.slice(0, past.length - 1);
      return {
        past: newPast,
        present: previous,
        future: [present, ...future],
      };
    });
  }, [canUndo]);

  const redo = useCallback(() => {
    if (!canRedo) return;

    setHistory(currentHistory => {
      const { past, present, future } = currentHistory;
      const next = future[0];
      const newFuture = future.slice(1);
      return {
        past: [...past, present],
        present: next,
        future: newFuture,
      };
    });
  }, [canRedo]);

  const setState = useCallback((newState: T) => {
    setHistory(currentHistory => {
      const { past, present } = currentHistory;
      if (newState === present) {
        return currentHistory;
      }
      return {
        past: [...past, present],
        present: newState,
        future: [],
      };
    });
  }, []);
  
  const resetState = useCallback((newState: T) => {
    setHistory({
      past: [],
      present: newState,
      future: []
    })
  }, []);

  return { state: history.present, setState, undo, redo, canUndo, canRedo, resetState };
};
