import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { DashboardGrid } from './components/DashboardGrid';
import { DetailView } from './components/DetailView';
import { AdvancedAnalyticsView } from './components/AdvancedAnalyticsView';
import { OvertimeView } from './components/OvertimeView';
import { ReportGeneratorView } from './components/ReportGeneratorView';
import { UnderConstructionView } from './components/UnderConstructionView';
import { LoginPage } from './components/LoginPage';
import { DashboardItem, ViewTab } from './types';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState('');
  const [selectedItem, setSelectedItem] = useState<DashboardItem | null>(null);
  const [currentTab, setCurrentTab] = useState<ViewTab>('overview');
  const [constructionPageTitle, setConstructionPageTitle] = useState('');

  // Search State
  const [searchTerm, setSearchTerm] = useState('');

  // Theme State
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const handleLogin = (username: string) => {
    setCurrentUser(username);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentUser('');
    setSelectedItem(null);
    setCurrentTab('overview');
    setSearchTerm('');
  };

  const handleTileClick = (item: DashboardItem) => {
    setSelectedItem(item);
    window.scrollTo(0, 0);
  };

  const handleBack = () => {
    setSelectedItem(null);
    // If we were on construction page, go back to overview
    if (currentTab === 'construction') {
      setCurrentTab('overview');
    }
  };

  const handleTabChange = (tab: ViewTab) => {
    setCurrentTab(tab);
    setSelectedItem(null);
    window.scrollTo(0, 0);
  };

  const handleFooterNavigation = (page: string) => {
    setConstructionPageTitle(page);
    setCurrentTab('construction');
    setSelectedItem(null);
    window.scrollTo(0, 0);
  };

  // Auth Guard
  if (!isAuthenticated) {
    return (
      <div className={isDarkMode ? 'dark' : ''}>
        <LoginPage onLogin={handleLogin} isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
      </div>
    );
  }

  // Render Logic
  let content;
  if (selectedItem) {
    if (selectedItem.id === 'overtime') {
      content = <OvertimeView item={selectedItem} onBack={handleBack} isDarkMode={isDarkMode} />;
    } else if (currentTab === 'overview') {
      content = <DetailView item={selectedItem} onBack={handleBack} isDarkMode={isDarkMode} />;
    } else {
      content = <AdvancedAnalyticsView item={selectedItem} onBack={handleBack} isDarkMode={isDarkMode} />;
    }
  } else {
    if (currentTab === 'overview') {
      content = <DashboardGrid
        title="Overview"
        onItemClick={handleTileClick}
        isDarkMode={isDarkMode}
        showOrgBanner={true}
        searchTerm={searchTerm}
      />;
    } else if (currentTab === 'analytics') {
      content = <DashboardGrid
        title="Advanced Analytics"
        description="Executive level reporting and deep-dive analysis."
        onItemClick={handleTileClick}
        isDarkMode={isDarkMode}
        searchTerm={searchTerm}
        showAIBriefing={true}
      />;
    } else if (currentTab === 'reports') {
      content = <ReportGeneratorView isDarkMode={isDarkMode} />;
    } else if (currentTab === 'construction') {
      content = <UnderConstructionView onBack={handleBack} title={constructionPageTitle} />;
    }
  }

  return (
    <div className={isDarkMode ? 'dark' : ''}>
      <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-900 font-sans text-slate-900 dark:text-slate-100 transition-colors duration-500 relative overflow-x-hidden">

        {/* Background removed for cleaner enterprise look */}

        <Header
          currentTab={currentTab}
          onTabChange={handleTabChange}
          onLogout={handleLogout}
          username={currentUser}
          isDarkMode={isDarkMode}
          toggleTheme={toggleTheme}
          searchTerm={searchTerm}
          onSearch={setSearchTerm}
        />

        <main className="flex-grow flex flex-col relative z-10">
          {content}
        </main>

        <Footer isDarkMode={isDarkMode} onNavigate={handleFooterNavigation} />
      </div>
    </div>
  );
};

export default App;