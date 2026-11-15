import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  Mission,
  ColonyResources,
  MissionEvent,
  MissionAction,
  SystemActionDefinition,
  ResourceDelta,
} from '../types';
import { api } from '../services/api';
import { soundFX } from '../utils/audio';

interface NotificationToast {
  id: string;
  type: 'info' | 'success' | 'warning' | 'danger';
  title: string;
  message: string;
}

interface MissionContextType {
  activeMission: Mission | null;
  resources: ColonyResources | null;
  events: MissionEvent[];
  activeEvents: MissionEvent[];
  unresolvedCount: number;
  actionsHistory: MissionAction[];
  actionCatalog: SystemActionDefinition[];
  loading: boolean;
  advancingDay: boolean;
  solTransition: boolean;
  isMuted: boolean;
  activeTab: string;
  recentDeltas: ResourceDelta | null;
  toasts: NotificationToast[];
  setActiveTab: (tab: string) => void;
  startMission: (name: string, commander: string, difficulty: string) => Promise<Mission>;
  loadMission: (id: string) => Promise<void>;
  advanceSol: () => Promise<void>;
  runAction: (actionType: string) => Promise<void>;
  resolveEmergency: (eventId: string, optionId: string) => Promise<void>;
  pauseMission: () => Promise<void>;
  resumeMission: () => Promise<void>;
  restartMission: () => Promise<void>;
  toggleMute: () => void;
  dismissToast: (id: string) => void;
  refreshMissionData: () => Promise<void>;
}

const MissionContext = createContext<MissionContextType | undefined>(undefined);

export const MissionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeMission, setActiveMission] = useState<Mission | null>(null);
  const [resources, setResources] = useState<ColonyResources | null>(null);
  const [events, setEvents] = useState<MissionEvent[]>([]);
  const [actionsHistory, setActionsHistory] = useState<MissionAction[]>([]);
  const [actionCatalog, setActionCatalog] = useState<SystemActionDefinition[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [advancingDay, setAdvancingDay] = useState<boolean>(false);
  const [solTransition, setSolTransition] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(soundFX.isMuted());
  const [activeTab, setActiveTabState] = useState<string>('landing');
  const [recentDeltas, setRecentDeltas] = useState<ResourceDelta | null>(null);
  const [toasts, setToasts] = useState<NotificationToast[]>([]);

  const addToast = (type: 'info' | 'success' | 'warning' | 'danger', title: string, message: string) => {
    const id = `${Date.now()}_${Math.random()}`;
    setToasts((prev) => [...prev, { id, type, title, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 6000);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const setActiveTab = (tab: string) => {
    soundFX.playClick();
    setActiveTabState(tab);
  };

  const toggleMute = () => {
    const next = soundFX.toggleMute();
    setIsMuted(next);
  };

  // Load mission details
  const loadMission = useCallback(async (id: string) => {
    setLoading(true);
    try {
      const data = await api.getMission(id);
      if (data.success && data.mission) {
        setActiveMission(data.mission);
        if (data.mission.resourceState) {
          setResources(data.mission.resourceState);
        }
        if (data.mission.events) {
          setEvents(data.mission.events);
        }
        if (data.mission.actions) {
          setActionsHistory(data.mission.actions);
        }
        localStorage.setItem('marsbase_active_id', id);

        // Fetch action catalog
        const actionsData = await api.getActions(id);
        if (actionsData.success) {
          setActionCatalog(actionsData.catalog);
        }
      }
    } catch (err: any) {
      console.error('Failed to load mission:', err);
      addToast('danger', 'Telemetry Error', 'Could not retrieve MarsBase mission state.');
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshMissionData = useCallback(async () => {
    if (!activeMission) return;
    try {
      const data = await api.getMission(activeMission.id);
      if (data.success && data.mission) {
        setActiveMission(data.mission);
        if (data.mission.resourceState) {
          setResources(data.mission.resourceState);
        }
        if (data.mission.events) {
          setEvents(data.mission.events);
        }
        if (data.mission.actions) {
          setActionsHistory(data.mission.actions);
        }
      }
    } catch (err) {
      console.error('Refresh error:', err);
    }
  }, [activeMission]);

  // Try auto-loading existing mission on start
  useEffect(() => {
    const savedId = localStorage.getItem('marsbase_active_id');
    if (savedId) {
      loadMission(savedId);
    }
  }, [loadMission]);

  // Start a new mission
  const startMission = async (name: string, commander: string, difficulty: string): Promise<Mission> => {
    setLoading(true);
    try {
      const res = await api.createMission(name, commander, difficulty);
      if (res.success && res.mission) {
        setActiveMission(res.mission);
        if (res.mission.resourceState) {
          setResources(res.mission.resourceState);
        }
        localStorage.setItem('marsbase_active_id', res.mission.id);
        soundFX.playActionSuccess();
        addToast('success', 'Mission Initialized', `Operation launched under ${commander}. Sols ahead: 30.`);
        
        // Fetch action catalog
        const actionsData = await api.getActions(res.mission.id);
        if (actionsData.success) {
          setActionCatalog(actionsData.catalog);
        }

        setActiveTabState('dashboard');
        return res.mission;
      }
      throw new Error('Mission creation response was incomplete');
    } catch (err: any) {
      addToast('danger', 'Initialization Failed', err?.message || 'Server error creating mission.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Advance Sol + 1
  const advanceSol = async () => {
    if (!activeMission || advancingDay) return;
    setAdvancingDay(true);
    setSolTransition(true);
    soundFX.playDayAdvance();

    try {
      const res = await api.advanceDay(activeMission.id);
      if (res.success) {
        setActiveMission(res.mission);
        setResources(res.resources);
        setRecentDeltas(res.deltas);

        // Refresh event list
        const evData = await api.getEvents(activeMission.id);
        if (evData.success) {
          setEvents(evData.events);
        }

        if (res.newEmergency) {
          soundFX.playEmergencyAlarm();
          addToast('danger', `CRITICAL ALERT: ${res.newEmergency.title}`, 'Emergency requires tactical commander decision!');
        } else {
          addToast('info', `Sol ${res.mission.currentDay} Dawn`, 'Daily consumption and solar generation processed.');
        }

        if (res.mission.status === 'COMPLETED') {
          soundFX.playVictory();
          addToast('success', 'MISSION ACCOMPLISHED', 'All 30 Sols survived! Proceeding to mission debrief.');
          setActiveTabState('debrief');
        } else if (res.mission.status === 'FAILED') {
          soundFX.playEmergencyAlarm();
          addToast('danger', 'MISSION ABORTED', res.mission.failureReason || 'Critical habitat life support failure.');
          setActiveTabState('debrief');
        }
      }
    } catch (err: any) {
      addToast('danger', 'Telemetry Sync Error', err?.message || 'Failed to advance Sol.');
    } finally {
      setAdvancingDay(false);
      setTimeout(() => setSolTransition(false), 900);
    }
  };

  // Execute Life Support Action
  const runAction = async (actionType: string) => {
    if (!activeMission) return;
    try {
      const res = await api.executeAction(activeMission.id, actionType);
      if (res.success) {
        soundFX.playActionSuccess();
        setResources(res.resources);
        addToast('success', 'Life-Support Cycle Executed', `Resource adjustment successfully applied.`);
        // Refresh actions
        const actionsData = await api.getActions(activeMission.id);
        if (actionsData.success) {
          setActionsHistory(actionsData.history);
        }
      }
    } catch (err: any) {
      soundFX.playEmergencyAlarm();
      addToast('warning', 'Action Refused', err?.message || 'Insufficient resources for this cycle.');
      throw err;
    }
  };

  // Resolve Emergency
  const resolveEmergency = async (eventId: string, optionId: string) => {
    if (!activeMission) return;
    try {
      const res = await api.respondToEvent(activeMission.id, eventId, optionId);
      if (res.success) {
        soundFX.playActionSuccess();
        setResources(res.resources);
        addToast('success', 'Emergency Neutralized', res.impact);
        // Refresh events & actions
        const evData = await api.getEvents(activeMission.id);
        if (evData.success) {
          setEvents(evData.events);
        }
        const actData = await api.getActions(activeMission.id);
        if (actData.success) {
          setActionsHistory(actData.history);
        }
      }
    } catch (err: any) {
      addToast('danger', 'Decision Failed', err?.message || 'Could not execute emergency protocol.');
    }
  };

  const pauseMission = async () => {
    if (!activeMission) return;
    try {
      const res = await api.pauseMission(activeMission.id);
      if (res.success) {
        setActiveMission(res.mission);
        addToast('info', 'Simulation Paused', 'Mission clock halted.');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const resumeMission = async () => {
    if (!activeMission) return;
    try {
      const res = await api.resumeMission(activeMission.id);
      if (res.success) {
        setActiveMission(res.mission);
        addToast('info', 'Simulation Resumed', 'Mission clock active.');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const restartMission = async () => {
    if (!activeMission) return;
    try {
      const res = await api.restartMission(activeMission.id);
      if (res.success) {
        setActiveMission(res.mission);
        if (res.mission.resourceState) {
          setResources(res.mission.resourceState);
        }
        setEvents([]);
        setActionsHistory([]);
        soundFX.playActionSuccess();
        addToast('info', 'Mission Reset', 'Telemetry recalibrated to Sol 1 baseline.');
        setActiveTabState('dashboard');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const activeEvents = events.filter((e) => e.status === 'ACTIVE');
  const unresolvedCount = activeEvents.length;

  return (
    <MissionContext.Provider
      value={{
        activeMission,
        resources,
        events,
        activeEvents,
        unresolvedCount,
        actionsHistory,
        actionCatalog,
        loading,
        advancingDay,
        solTransition,
        isMuted,
        activeTab,
        recentDeltas,
        toasts,
        setActiveTab,
        startMission,
        loadMission,
        advanceSol,
        runAction,
        resolveEmergency,
        pauseMission,
        resumeMission,
        restartMission,
        toggleMute,
        dismissToast,
        refreshMissionData,
      }}
    >
      {children}
    </MissionContext.Provider>
  );
};

export const useMission = () => {
  const ctx = useContext(MissionContext);
  if (!ctx) throw new Error('useMission must be used within a MissionProvider');
  return ctx;
};
