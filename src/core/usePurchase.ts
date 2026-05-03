import { useState, useCallback } from 'react';

export function usePurchase() {
  const [isPremium, setIsPremium] = useState<boolean>(() => {
    return localStorage.getItem('ai-passport-premium') === 'true';
  });
  const [isDevMode, setIsDevMode] = useState<boolean>(() => {
    return localStorage.getItem('ai-passport-dev-mode') === 'true';
  });

  const setDevMode = useCallback((mode: boolean) => {
    localStorage.setItem('ai-passport-dev-mode', String(mode));
    setIsDevMode(mode);
  }, []);

  const purchasePremium = useCallback(() => {
    localStorage.setItem('ai-passport-premium', 'true');
    setIsPremium(true);
  }, []);

  const restorePurchase = useCallback(() => {
    const stored = localStorage.getItem('ai-passport-premium') === 'true';
    setIsPremium(stored);
  }, []);

  // isUnlocked = premium OR devMode
  const isUnlocked = isPremium || isDevMode;

  return {
    isPremium,
    isDevMode,
    isUnlocked,
    setDevMode,
    purchasePremium,
    restorePurchase,
  };
}
