import { ReactNode } from 'react';
import { TopNav } from './TopNav';
import { Footer } from './Footer';
import { useEditMode } from '@/contexts/EditModeContext';

export function AppLayout({ children }: { children: ReactNode }) {
  const { isEditMode } = useEditMode();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <TopNav />
      <main className={`flex-1 px-4 md:px-8 lg:px-12 py-6 md:py-8 w-full ${isEditMode ? 'ring-2 ring-inset rounded-sm ring-secondary/30' : ''}`}>
        {children}
      </main>
      <Footer />
    </div>
  );
}
