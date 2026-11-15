export type DifficultyLevel = 'BEGINNER' | 'STANDARD' | 'EXPERT';
export type MissionStatus = 'ACTIVE' | 'PAUSED' | 'COMPLETED' | 'FAILED';
export type EventSeverity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface ColonyResources {
  oxygen: number;
  water: number;
  food: number;
  power: number;
  morale: number;
  integrity: number;
  radiation: number;
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

export interface DifficultyConfig {
  dailyOxygenConsumption: number;
  dailyWaterConsumption: number;
  dailyFoodConsumption: number;
  basePowerGeneration: number;
  basePowerConsumption: number;
  dailyIntegrityWear: number;
  dailyRadiationGain: number;
  emergencyProbability: number;
}

export interface EmergencyOption {
  id: string;
  label: string;
  description: string;
  resourceCost: ResourceDelta;
  benefit: string;
}

export interface EmergencyDefinition {
  eventType: string;
  severity: EventSeverity;
  title: string;
  description: string;
  options: EmergencyOption[];
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
