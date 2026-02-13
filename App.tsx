import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Breadcrumbs } from './components/Breadcrumbs';
import { OnboardingTour } from './components/OnboardingTour';
import { DashboardGrid } from './components/DashboardGrid';
import { DetailView } from './components/DetailView';
import { AdvancedAnalyticsView } from './components/AdvancedAnalyticsView';
import { MetricDetailView } from './components/MetricDetailView';
import { ReportGeneratorView } from './components/ReportGeneratorView';
import { UnderConstructionView } from './components/UnderConstructionView';
import { LoginPage } from './components/LoginPage';
import { DashboardItem, ViewTab } from './types';
import { Sidebar } from './components/Sidebar';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState('');
  const [selectedItem, setSelectedItem] = useState<DashboardItem | null>(null);
  const [currentTab, setCurrentTab] = useState<ViewTab>('overview');
  const [constructionPageTitle, setConstructionPageTitle] = useState('');

  // Search State
  const [searchTerm, setSearchTerm] = useState('');

  // Date Range State
  const [dateRange, setDateRange] = useState('ytd');

  // Theme State
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Onboarding Tour State
  const [showTour, setShowTour] = useState(false);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const handleLogin = (username: string) => {
    setCurrentUser(username);
    setIsAuthenticated(true);
    // Check if this is first login (no tour completed flag)
    const tourCompleted = localStorage.getItem('hss-tour-completed');
    if (!tourCompleted) {
      setShowTour(true);
    }
  };

  const handleTourClose = () => {
    setShowTour(false);
    localStorage.setItem('hss-tour-completed', 'true');
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

  // Render Logic - Route all metric tiles to MetricDetailView
  const metricIds = [
    'overtime', 'paid-hours', 'sick-hours', 'worked-hours',
    'workforce', 'terminations', 'retirements', 'internal-transfers',
    'vacancy', 'retirement-risk', 'new-hires', 'recruitment'
  ];

  let content;
  if (selectedItem) {
    // If on analytics tab, show AdvancedAnalyticsView for any metric
    if (currentTab === 'analytics') {
      content = <AdvancedAnalyticsView item={selectedItem} onBack={handleBack} isDarkMode={isDarkMode} />;
    } else if (metricIds.includes(selectedItem.id)) {
      // Overview tab - show MetricDetailView for all metrics
      content = <MetricDetailView item={selectedItem} onBack={handleBack} isDarkMode={isDarkMode} />;
    } else {
      content = <DetailView item={selectedItem} onBack={handleBack} isDarkMode={isDarkMode} />;
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
      <div className="min-h-screen flex bg-slate-50 dark:bg-slate-900 font-sans text-slate-900 dark:text-slate-100 transition-colors duration-500 relative overflow-hidden">

        {/* Background Gradient */}
        <div className="fixed inset-0 bg-gradient-to-br from-slate-50 to-blue-50/50 dark:from-slate-900 dark:to-[#001e38] pointer-events-none z-0"></div>

        {/* Sidebar Navigation */}
        <Sidebar
          currentTab={currentTab}
          onTabChange={handleTabChange}
          onLogout={handleLogout}
          username={currentUser}
        />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto relative z-10 scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-600">

          <Header
            currentTab={currentTab}
            onTabChange={handleTabChange}
            onLogout={handleLogout}
            username={currentUser}
            isDarkMode={isDarkMode}
            toggleTheme={toggleTheme}
            searchTerm={searchTerm}
            onSearch={setSearchTerm}
            dateRange={dateRange}
            onDateRangeChange={setDateRange}
          />

          {/* Breadcrumbs Navigation */}
          {selectedItem && (
            <div className="px-6 pt-4 pb-0">
              <Breadcrumbs
                currentTab={currentTab}
                selectedItem={selectedItem}
                onNavigateHome={() => { setSelectedItem(null); setCurrentTab('overview'); }}
                onNavigateTab={(tab) => { setSelectedItem(null); setCurrentTab(tab); }}
                isDarkMode={isDarkMode}
              />
            </div>
          )}

          <main className="flex-grow p-6 flex flex-col">
            <div className="max-w-7xl mx-auto w-full flex-1 flex flex-col animate-fade-in relative">
              {/* Added distinct glow effect behind main content */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-96 bg-blue-400/5 rounded-full blur-3xl pointer-events-none -z-10"></div>
              {content}
            </div>
          </main>

          <Footer isDarkMode={isDarkMode} onNavigate={handleFooterNavigation} />
        </div>

        {/* Onboarding Tour */}
        <OnboardingTour
          isOpen={showTour}
          onClose={handleTourClose}
          isDarkMode={isDarkMode}
        />
      </div>
    </div>
  );
};

export default App;