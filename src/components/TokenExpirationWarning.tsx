// src/components/TokenExpirationWarning.tsx
import { useEffect, useState } from 'react';
import { getTokenExpiresIn } from '@/utils/token';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';

export const TokenExpirationWarning = () => {
  const [showWarning, setShowWarning] = useState(false);
  const [expiresIn, setExpiresIn] = useState<number | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      const token = localStorage.getItem('token');
      const remainingTime = getTokenExpiresIn(token);

      // Mostrar advertencia 30 segundos antes de expirar
      if (
        remainingTime !== null &&
        remainingTime <= 30 &&
        remainingTime > 0
      ) {
        setShowWarning(true);
        setExpiresIn(remainingTime);
      } else if (remainingTime === 0 || remainingTime === null) {
        setShowWarning(false);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Dialog open={showWarning} onOpenChange={setShowWarning}>
      <DialogContent className="bg-white text-black">
        <DialogTitle>⚠️ Sesión a punto de expirar</DialogTitle>
        <div className="space-y-4">
          <p>Tu sesión expirará en <strong>{expiresIn} segundos</strong>.</p>
          <p>Por favor, guarda tu trabajo antes de que expire.</p>
        </div>
      </DialogContent>
    </Dialog>
  );
};