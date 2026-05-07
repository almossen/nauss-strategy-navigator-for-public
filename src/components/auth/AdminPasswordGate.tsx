import { useState, useEffect, ReactNode } from 'react';
import { Lock } from 'lucide-react';

const ADMIN_PASSWORD = 'nauss2025-2026';
const STORAGE_KEY = 'nauss_admin_access';

export function AdminPasswordGate({ children }: { children: ReactNode }) {
  const [unlocked, setUnlocked] = useState(false);
  const [value, setValue] = useState('');
  const [error, setError] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem(STORAGE_KEY) === 'true' || localStorage.getItem(STORAGE_KEY) === 'true') {
      setUnlocked(true);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value === ADMIN_PASSWORD) {
      localStorage.setItem(STORAGE_KEY, 'true');
      setUnlocked(true);
      setError(false);
    } else {
      setError(true);
    }
  };

  if (unlocked) return <>{children}</>;

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-4" dir="rtl">
      <form onSubmit={handleSubmit} className="w-full max-w-md bg-card border rounded-2xl shadow-xl p-8 space-y-6">
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="w-14 h-14 rounded-full flex items-center justify-center" style={{ background: 'linear-gradient(135deg, hsl(var(--nauss-primary)), hsl(195,41%,31%))' }}>
            <Lock className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-xl font-bold text-foreground">لوحة التحكم محمية</h1>
          <p className="text-sm text-muted-foreground">يرجى إدخال كلمة المرور للوصول إلى لوحة التحكم</p>
        </div>
        <div className="space-y-2">
          <input
            type="password"
            value={value}
            onChange={(e) => { setValue(e.target.value); setError(false); }}
            placeholder="كلمة المرور"
            className="w-full h-11 px-4 rounded-md border border-input bg-background text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring text-right"
            autoFocus
          />
          {error && <p className="text-sm text-destructive">كلمة المرور غير صحيحة</p>}
        </div>
        <button
          type="submit"
          className="w-full h-11 rounded-md text-white font-medium transition-opacity hover:opacity-90"
          style={{ background: 'linear-gradient(135deg, hsl(var(--nauss-primary)), hsl(195,41%,31%))' }}
        >
          دخول
        </button>
      </form>
    </div>
  );
}