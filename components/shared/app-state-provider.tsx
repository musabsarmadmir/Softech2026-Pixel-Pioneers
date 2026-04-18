'use client';

import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type {
  AnalysisSession,
  OpportunityItem,
  RankedOpportunity,
  StudentProfile,
} from '@/types/opportunity';
import { backupProfile, sampleInboxRawText, sampleOpportunities } from '@/constants/sampleData';
import { rankDeterministically } from '@/utils/scoringEngine';

type AppState = {
  profile: StudentProfile;
  inboxRawText: string;
  extractedItems: OpportunityItem[];
  ranked: RankedOpportunity[];
  history: AnalysisSession[];
  setProfile: (profile: StudentProfile) => void;
  setInboxRawText: (value: string) => void;
  setExtractedItems: (items: OpportunityItem[]) => void;
  runDeterministicRanking: () => RankedOpportunity[];
  runMockGmailSync: () => void;
  saveCurrentAnalysis: () => void;
  clearHistory: () => void;
};

const STORAGE_KEY = 'pixel_pioneers_state_v1';

const AppStateContext = createContext<AppState | null>(null);

type PersistedState = {
  profile: StudentProfile;
  inboxRawText: string;
  extractedItems: OpportunityItem[];
  ranked: RankedOpportunity[];
  history: AnalysisSession[];
};

function defaultState(): PersistedState {
  return {
    profile: backupProfile,
    inboxRawText: sampleInboxRawText,
    extractedItems: sampleOpportunities,
    ranked: rankDeterministically(backupProfile, sampleOpportunities),
    history: [],
  };
}

export function AppStateProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<PersistedState>(defaultState);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as PersistedState;
      setState(parsed);
    } catch {
      // ignore persistence read errors and retain fallback seed
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const value = useMemo<AppState>(
    () => ({
      profile: state.profile,
      inboxRawText: state.inboxRawText,
      extractedItems: state.extractedItems,
      ranked: state.ranked,
      history: state.history,
      setProfile: (profile) => setState((prev) => ({ ...prev, profile })),
      setInboxRawText: (inboxRawText) => setState((prev) => ({ ...prev, inboxRawText })),
      setExtractedItems: (extractedItems) => setState((prev) => ({ ...prev, extractedItems })),
      runDeterministicRanking: () => {
        const ranked = rankDeterministically(state.profile, state.extractedItems);
        setState((prev) => ({ ...prev, ranked }));
        return ranked;
      },
      runMockGmailSync: () => {
        setState((prev) => ({
          ...prev,
          inboxRawText: sampleInboxRawText,
          extractedItems: sampleOpportunities,
        }));
      },
      saveCurrentAnalysis: () => {
        const session: AnalysisSession = {
          id: crypto.randomUUID(),
          createdAtISO: new Date().toISOString(),
          profileSnapshot: state.profile,
          ranked: state.ranked,
          inboxItemsCount: state.extractedItems.length,
        };

        setState((prev) => ({
          ...prev,
          history: [session, ...prev.history].slice(0, 20),
        }));
      },
      clearHistory: () => setState((prev) => ({ ...prev, history: [] })),
    }),
    [state],
  );

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
}

export function useAppState() {
  const context = useContext(AppStateContext);
  if (!context) {
    throw new Error('useAppState must be used inside AppStateProvider');
  }
  return context;
}
