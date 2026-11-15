import {
  Mission,
  MissionEvent,
  SystemActionDefinition,
  AdvisorResponse,
  MissionReportData,
  GlossaryItem,
  ResourceDelta,
  ColonyResources,
} from '../types';

const BASE_URL = '/api';

export const api = {
  async getHealth(): Promise<{ status: string; geminiKeyConfigured: boolean }> {
    const res = await fetch(`${BASE_URL}/health`);
    return res.json();
  },

  async createMission(
    name: string,
    commanderName: string,
    difficulty: string
  ): Promise<{ success: boolean; mission: Mission }> {
    const res = await fetch(`${BASE_URL}/missions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, commanderName, difficulty }),
    });
    if (!res.ok) throw new Error('Failed to create mission');
    return res.json();
  },

  async getMissions(): Promise<{ success: boolean; missions: Mission[] }> {
    const res = await fetch(`${BASE_URL}/missions`);
    if (!res.ok) throw new Error('Failed to fetch missions');
    return res.json();
  },

  async getMission(id: string): Promise<{ success: boolean; mission: Mission }> {
    const res = await fetch(`${BASE_URL}/missions/${id}`);
    if (!res.ok) throw new Error('Failed to fetch mission details');
    return res.json();
  },

  async advanceDay(id: string): Promise<{
    success: boolean;
    mission: Mission;
    resources: ColonyResources;
    deltas: ResourceDelta;
    newEmergency: MissionEvent | null;
  }> {
    const res = await fetch(`${BASE_URL}/missions/${id}/advance-day`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to advance day');
    return data;
  },

  async pauseMission(id: string): Promise<{ success: boolean; mission: Mission }> {
    const res = await fetch(`${BASE_URL}/missions/${id}/pause`, { method: 'POST' });
    return res.json();
  },

  async resumeMission(id: string): Promise<{ success: boolean; mission: Mission }> {
    const res = await fetch(`${BASE_URL}/missions/${id}/resume`, { method: 'POST' });
    return res.json();
  },

  async restartMission(id: string): Promise<{ success: boolean; mission: Mission }> {
    const res = await fetch(`${BASE_URL}/missions/${id}/restart`, { method: 'POST' });
    return res.json();
  },

  async getActions(id: string): Promise<{
    success: boolean;
    catalog: SystemActionDefinition[];
    history: any[];
  }> {
    const res = await fetch(`${BASE_URL}/missions/${id}/actions`);
    return res.json();
  },

  async executeAction(
    id: string,
    actionType: string
  ): Promise<{
    success: boolean;
    resources: ColonyResources;
    changes: ResourceDelta;
    scienceNote: string;
    error?: string;
  }> {
    const res = await fetch(`${BASE_URL}/missions/${id}/actions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ actionType }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Action execution failed');
    return data;
  },

  async getEvents(id: string): Promise<{ success: boolean; events: MissionEvent[] }> {
    const res = await fetch(`${BASE_URL}/missions/${id}/events`);
    return res.json();
  },

  async respondToEvent(
    missionId: string,
    eventId: string,
    optionId: string
  ): Promise<{
    success: boolean;
    event: MissionEvent;
    resources: ColonyResources;
    impact: string;
  }> {
    const res = await fetch(`${BASE_URL}/missions/${missionId}/events/${eventId}/respond`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ optionId }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to respond to emergency');
    return data;
  },

  async getAnalytics(id: string): Promise<any> {
    const res = await fetch(`${BASE_URL}/missions/${id}/analytics`);
    return res.json();
  },

  async getReport(id: string): Promise<{ success: boolean; report: MissionReportData }> {
    const res = await fetch(`${BASE_URL}/missions/${id}/report`);
    return res.json();
  },

  async askAdvisor(missionId: string, question: string): Promise<{ success: boolean; advisor: AdvisorResponse }> {
    const res = await fetch(`${BASE_URL}/ai/advisor`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ missionId, question }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'ARES Advisor failed to respond');
    return data;
  },

  async getGlossary(): Promise<{ success: boolean; glossary: GlossaryItem[] }> {
    const res = await fetch(`${BASE_URL}/science/glossary`);
    return res.json();
  },
};
