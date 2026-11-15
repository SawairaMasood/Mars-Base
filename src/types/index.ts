export type DifficultyLevel = 'BEGINNER' | 'STANDARD' | 'EXPERT';
export type MissionStatus = 'ACTIVE' | 'PAUSED' | 'COMPLETED' | 'FAILED';
export type EventSeverity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface ColonyResources {
  id?: string;
  missionId?: string;
  oxygen: number;
  water: number;
  food: number;
  power: number;
  morale: number;
  integrity: number;
  radiation: number;
  updatedAt?: string;
}

export interface ResourceDelta {
  oxygen?: number;
  water?: number;
  food?: number;
  power?: number;
  morale?: number;
  integrity?: number;
  radiation?: number;
}

export interface Mission {
  id: string;
  name: string;
  commanderName: string;
  difficulty: DifficultyLevel;
  currentDay: number;
  duration: number;
  status: MissionStatus;
  failureReason?: string | null;
  score: number;
  finalGrade?: string | null;
  createdAt: string;
  updatedAt: string;
  resourceState?: ColonyResources;
  events?: MissionEvent[];
  actions?: MissionAction[];
  snapshots?: DailySnapshot[];
}

export interface MissionAction {
  id: string;
  missionId: string;
  day: number;
  actionType: string;
  description: string;
  resourceChanges: string; // JSON
  success: boolean;
  createdAt: string;
}

export interface EmergencyOption {
  id: string;
  label: string;
  description: string;
  resourceCost: ResourceDelta;
  benefit: string;
}

export interface MissionEvent {
  id: string;
  missionId: string;
  day: number;
  eventType: string;
  severity: EventSeverity;
  title: string;
  description: string;
  options: string; // JSON string of EmergencyOption[]
  selectedOption?: string | null;
  status: 'ACTIVE' | 'RESOLVED' | 'IGNORED';
  impactDescription?: string | null;
  createdAt: string;
}

export interface DailySnapshot {
  id: string;
  missionId: string;
  day: number;
  oxygen: number;
  water: number;
  food: number;
  power: number;
  morale: number;
  integrity: number;
  radiation: number;
  score: number;
  summary?: string | null;
  createdAt: string;
}

export interface SystemActionDefinition {
  actionType: string;
  title: string;
  description: string;
  systemName: string;
  cost: ResourceDelta;
  gain: ResourceDelta;
  scienceNote: string;
}

export interface AdvisorResponse {
  mode: 'AI_CONNECTED' | 'DEMO_ADVISOR_MODE';
  situationAnalysis: string;
  criticalRisks: string[];
  recommendedActions: string[];
  scientificInsights: string;
  fullMessage: string;
}

export interface GlossaryItem {
  term: string;
  definition: string;
  nasaCitation: string;
}

export interface MissionReportData {
  missionId: string;
  missionName: string;
  commanderName: string;
  difficulty: string;
  status: string;
  failureReason?: string | null;
  daysSurvived: number;
  totalDuration: number;
  finalResources: ColonyResources;
  score: number;
  grade: string;
  scoreBreakdown: Record<string, number>;
  strengths: string[];
  mistakes: string[];
  educationalLessons: string[];
  totalActionsExecuted: number;
  totalEmergenciesHandled: number;
  disclaimer: string;
  generatedAt: string;
}
