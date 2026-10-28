import React from 'react';
import { AppHeader } from './components/organisms/AppHeader';
import { AppFooter } from './components/organisms/AppFooter';
import { CartDrawer } from './components/organisms/CartDrawer';
import { LoginModal } from './components/organisms/LoginModal';
import { StorefrontView } from './views/StorefrontView';
import { ProductDetailView } from './views/ProductDetailView';
import { SecurityView } from './views/SecurityView';
import { MarketingView } from './views/MarketingView';
import { useThemeStore } from './store/useThemeStore';
import { useCommerceStore } from './store/useCommerceStore';
import { useAuthStore } from './store/useAuthStore';

export const App: React.FC = () => {
  const { role, adminTab, theme } = useThemeStore();
  const currentUser = useAuthStore((s) => s.currentUser);
  const selectedProductViewId = useCommerceStore((s) => s.selectedProductViewId);

  const canAccessBackoffice = currentUser?.role === 'admin' && role === 'admin';

  return (
    <div
      data-theme={theme}
      className="w-full bg-[#f8fafc] dark:bg-[#09090b] text-slate-900 dark:text-zinc-100 transition-colors duration-200 flex flex-col justify-between h-fit"
    >
      <AppHeader />
      <main className="w-full pt-2 sm:pt-4 h-fit">
        {!canAccessBackoffice ? (
          selectedProductViewId ? (
            <ProductDetailView />
          ) : (
            <StorefrontView />
          )
        ) : adminTab === 'security' ? (
          <SecurityView />
        ) : (
          <MarketingView />
        )}
      </main>
      <AppFooter />
      <CartDrawer />
      <LoginModal />
    </div>
  );
};

export default App;
