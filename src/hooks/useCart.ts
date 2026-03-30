import { useState, useCallback } from 'react';
import type { SoundOption } from '../config';

export function useCart(
  walletBalance: number,
  onBuySounds: (soundIds: string[], totalPrice: number) => void
) {
  const [cartIds, setCartIds] = useState<string[]>([]);

  const toggleInCart = useCallback((id: string) => {
    setCartIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  }, []);

  const removeFromCart = useCallback((id: string) => {
    setCartIds((prev) => prev.filter((item) => item !== id));
  }, []);

  const clearCart = useCallback(() => {
    setCartIds([]);
  }, []);

  const calculateTotal = useCallback((soundCatalog: Map<string, SoundOption>) => {
    return cartIds.reduce((sum, id) => {
      const sound = soundCatalog.get(id);
      return sum + (sound?.price ?? 0);
    }, 0);
  }, [cartIds]);

  const canAfford = useCallback((soundCatalog: Map<string, SoundOption>) => {
    return walletBalance >= calculateTotal(soundCatalog);
  }, [walletBalance, calculateTotal]);

  const checkout = useCallback((soundCatalog: Map<string, SoundOption>) => {
    const total = calculateTotal(soundCatalog);
    if (walletBalance >= total) {
      onBuySounds(cartIds, total);
      setCartIds([]);
      return true;
    }
    return false;
  }, [cartIds, walletBalance, calculateTotal, onBuySounds]);

  return {
    cartIds,
    toggleInCart,
    removeFromCart,
    clearCart,
    calculateTotal,
    canAfford,
    checkout,
  };
}
