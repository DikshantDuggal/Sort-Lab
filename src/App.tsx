import React, { useState } from 'react';
import { SortLabNavbar, ActiveTab } from './components/sortlab/SortLabNavbar';
import { LandingOverview } from './components/sortlab/LandingOverview';
import { AlgorithmLab } from './components/sortlab/AlgorithmLab';
import { AlgorithmRace } from './components/sortlab/AlgorithmRace';
import { PredictMode } from './components/sortlab/PredictMode';
import { LearningResources } from './components/sortlab/LearningResources';
import { PhotonicLab } from './components/PhotonicLab';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('overview');

  return (
    <div className="min-h-screen bg-[#080c14] text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-black">
      {/* Universal SortLab Navigation Bar */}
      <SortLabNavbar activeTab={activeTab} onSelectTab={setActiveTab} />

      {/* Main Experience Router */}
      <main className="flex-1 w-full">
        {activeTab === 'overview' && (
          <LandingOverview onSelectTab={setActiveTab} />
        )}

        {activeTab === 'lab' && (
          <AlgorithmLab />
        )}

        {activeTab === 'race' && (
          <AlgorithmRace />
        )}

        {activeTab === 'predict' && (
          <PredictMode />
        )}

        {activeTab === 'resources' && (
          <LearningResources />
        )}

        {activeTab === 'optics' && (
          <PhotonicLab />
        )}
      </main>
    </div>
  );
};

export default App;
