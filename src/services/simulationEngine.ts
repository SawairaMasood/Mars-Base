import {
  DifficultyLevel,
  DifficultyConfig,
  ColonyResources,
  ResourceDelta,
  EmergencyDefinition,
  SystemActionDefinition,
} from '../types/simulation';

export const DIFFICULTY_SETTINGS: Record<DifficultyLevel, DifficultyConfig> = {
  BEGINNER: {
    dailyOxygenConsumption: 4.5,
    dailyWaterConsumption: 4.5,
    dailyFoodConsumption: 3.5,
    basePowerGeneration: 20,
    basePowerConsumption: 16,
    dailyIntegrityWear: 1.0,
    dailyRadiationGain: 0.8,
    emergencyProbability: 0.28,
  },
  STANDARD: {
    dailyOxygenConsumption: 6.5,
    dailyWaterConsumption: 6.0,
    dailyFoodConsumption: 5.0,
    basePowerGeneration: 18,
    basePowerConsumption: 18,
    dailyIntegrityWear: 2.2,
    dailyRadiationGain: 1.5,
    emergencyProbability: 0.45,
  },
  EXPERT: {
    dailyOxygenConsumption: 8.5,
    dailyWaterConsumption: 8.0,
    dailyFoodConsumption: 6.8,
    basePowerGeneration: 16,
    basePowerConsumption: 20,
    dailyIntegrityWear: 3.5,
    dailyRadiationGain: 2.4,
    emergencyProbability: 0.65,
  },
};

export const AVAILABLE_ACTIONS: Record<string, SystemActionDefinition> = {
  OXYGEN_SURGE: {
    actionType: 'OXYGEN_SURGE',
    title: 'MOXIE Oxygen Overcharge',
    systemName: 'MOXIE & Electrolysis Reactor',
    description: 'Electrolyze atmospheric CO2 to produce high-purity breathable oxygen.',
    cost: { power: 18 },
    gain: { oxygen: 14 },
    scienceNote: 'NASA’s MOXIE on the Perseverance rover proved solid oxide electrolysis can extract O2 directly from Mars’ 95% CO2 atmosphere.',
  },
  WATER_RECYCLING_PURGE: {
    actionType: 'WATER_RECYCLING_PURGE',
    title: 'ECLSS Closed-Loop Water Recovery',
    systemName: 'Hydrological Recirculation Plant',
    description: 'Process habitat greywater and humidity condensate through catalytic distillation.',
    cost: { power: 14 },
    gain: { water: 15 },
    scienceNote: 'The International Space Station ECLSS recovers over 98% of crew moisture via distillation and catalytic oxidation.',
  },
  GREENHOUSE_HARVEST_CYCLE: {
    actionType: 'GREENHOUSE_HARVEST_CYCLE',
    title: 'Hydroponic Nutrient Flush & Harvest',
    systemName: 'Martian Bio-Dome Greenhouse',
    description: 'Supply concentrated nutrient solutions and spectrum lighting to harvest fast-growth microgreens and tubers.',
    cost: { power: 12, water: 10 },
    gain: { food: 16, oxygen: 2 },
    scienceNote: 'Plants on Mars produce caloric nutrition while absorbing CO2 and transpiring clean moisture, creating biological life support redundancy.',
  },
  SOLAR_ARRAY_DUSTING: {
    actionType: 'SOLAR_ARRAY_DUSTING',
    title: 'Pneumatic Dust Clearing on Photovoltaics',
    systemName: 'Photovoltaic Array & Batteries',
    description: 'Blast compressed atmospheric gas across solar arrays to remove fine electrostatic Martian dust.',
    cost: { power: 8 },
    gain: { power: 22, integrity: 4 },
    scienceNote: 'Electrostatic Martian dust coating doomed the InSight lander and Opportunity rover by severely reducing solar panel yield.',
  },
  RADIATION_MAGNETIC_DEFLECTION: {
    actionType: 'RADIATION_MAGNETIC_DEFLECTION',
    title: 'Active Electromagnetic Magnetosphere Pulse',
    systemName: 'High-Temperature Superconducting Coils',
    description: 'Discharge stored superconducting coil current to deflect incoming cosmic galactic rays and solar protons.',
    cost: { power: 22 },
    gain: { radiation: -14 },
    scienceNote: 'Mars lacks an intrinsic global magnetic dynamo. Artificial magnetic shields or thick regolith berms are essential to prevent DNA damage.',
  },
  HABITAT_STRUCTURAL_PATCH: {
    actionType: 'HABITAT_STRUCTURAL_PATCH',
    title: 'Basalt Fiber Micrometeorite Patching',
    systemName: 'Inflatable TransHab & Regolith Shell',
    description: 'Seal micro-punctures and inspect airlock gaskets using in-situ sintered regolith paste.',
    cost: { power: 10 },
    gain: { integrity: 16 },
    scienceNote: 'Micrometeoroids and thermal expansion cycling cause habitat hull micro-fissures that degrade pressurization integrity over time.',
  },
  CREW_REST_AND_THERAPY: {
    actionType: 'CREW_REST_AND_THERAPY',
    title: 'Psychological Rest & Earth Uplink',
    systemName: 'Crew Quarters & Hydro-Therapy',
    description: 'Authorize an off-duty cycle with terrestrial VR communications and special meal rations.',
    cost: { food: 6, water: 4 },
    gain: { morale: 16 },
    scienceNote: 'Confinement in deep space habitats triggers sensory deprivation and chronic stress. Scheduled decompression preserves operational readiness.',
  },
  EMERGENCY_POWER_RATIONING: {
    actionType: 'EMERGENCY_POWER_RATIONING',
    title: 'Grid Load Shedding to Ultra-Capacitors',
    systemName: 'Smart Microgrid Power Bus',
    description: 'Dim non-essential environmental lighting and throttle scientific lab freezers to charge emergency backup batteries.',
    cost: { morale: -3 },
    gain: { power: 18 },
    scienceNote: 'Space habitats prioritize life-support over experimental modules during power shortfalls to protect crew survival.',
  },
};

export const EMERGENCY_EVENTS: EmergencyDefinition[] = [
  {
    eventType: 'DUST_STORM',
    severity: 'HIGH',
    title: 'Atmospheric Global Dust Storm Alert',
    description: 'A planet-encircling dust storm has blanketed Chryse Planitia. Solar irradiance plummeted by 75%, and fine electrostatic grit is abrading radiator fins.',
    options: [
      {
        id: 'opt_dust_conserve',
        label: 'Conserve Power & Battery Isolation',
        description: 'Mothball auxiliary sensors and rely on fuel cells. Low risk, but limits scientific research.',
        resourceCost: { power: -10, morale: -5 },
        benefit: 'Avoids mechanical breakdown; battery reserves maintained at safe margins.',
      },
      {
        id: 'opt_dust_clean',
        label: 'Deploy Automated Robotic Sweepers',
        description: 'Send rover units to continuously blow grit off active solar arrays in real time.',
        resourceCost: { power: -18, integrity: 6 },
        benefit: 'Restores partial solar power generation while protecting array glass.',
      },
      {
        id: 'opt_dust_auxiliary',
        label: 'Burn Emergency Methane/LOX Fuel Cell',
        description: 'Ignite backup chemical fuel cell to generate steady power despite the darkened skies.',
        resourceCost: { oxygen: -8 },
        benefit: 'Generates +25 units of continuous electrical power during peak blackout.',
      },
    ],
  },
  {
    eventType: 'OXYGEN_LEAK',
    severity: 'CRITICAL',
    title: 'Secondary Airlock Seal Micro-Fracture',
    description: 'Rapid depressurization detected in Habitat Module B! Atmospheric oxygen is venting into the Martian near-vacuum at 3.2 kPa per minute.',
    options: [
      {
        id: 'opt_o2_isolate',
        label: 'Emergency Bulkhead Isolation',
        description: 'Immediately close internal blast doors to seal off the leaking corridor, quarantining Module B.',
        resourceCost: { oxygen: -10, morale: -6 },
        benefit: 'Arrests decompression immediately with minimum crew risk.',
      },
      {
        id: 'opt_o2_eva_repair',
        label: 'Rapid EVA Sealant Application',
        description: 'Dispatch Commander Shepard and Flight Engineer on a high-speed spacewalk to weld the outer seal with basalt epoxy.',
        resourceCost: { power: -12, integrity: 10 },
        benefit: 'Fully repairs the structural hull breach; zero additional oxygen lost.',
      },
      {
        id: 'opt_o2_boost_moxie',
        label: 'Overdrive MOXIE Production to Compensate',
        description: 'Pump raw CO2 through the solid-oxide reactor to match the venting rate until tomorrow.',
        resourceCost: { power: -24, oxygen: 5 },
        benefit: 'Keeps Module B accessible without isolating crew quarters.',
      },
    ],
  },
  {
    eventType: 'WATER_SYSTEM_FAILURE',
    severity: 'HIGH',
    title: 'ECLSS Catalytic Distillation Membrane Clog',
    description: 'Brine precipitation and perchlorate minerals have encrusted the primary water recycling centrifuge, halting greywater purification.',
    options: [
      {
        id: 'opt_water_chemical_flush',
        label: 'Acidic Ultrasonic Membrane Flush',
        description: 'Inject chemical descaling agents and run high-frequency transducers to disintegrate mineral scale.',
        resourceCost: { power: -14, water: -8 },
        benefit: 'Clears the membrane and restores 100% recycling efficiency.',
      },
      {
        id: 'opt_water_subsurface_ice',
        label: 'Activate Subsurface Thermal Melt Probe',
        description: 'Extract raw Martian sub-regolith glacial ice using the automated RODWELL thermal drill.',
        resourceCost: { power: -20, integrity: -4 },
        benefit: 'Supplies +22 units of fresh mineral water directly to the storage tanks.',
      },
      {
        id: 'opt_water_strict_rationing',
        label: 'Institute Tier-3 Water Rationing',
        description: 'Cut crew hygiene allocations and reduce greenhouse misting cycles by half for 48 hours.',
        resourceCost: { water: -4, morale: -10 },
        benefit: 'Conserves existing reservoir reserves until standard maintenance.',
      },
    ],
  },
  {
    eventType: 'RADIATION_STORM',
    severity: 'CRITICAL',
    title: 'Solar Particle Event (SPE) Class X-12 Flare',
    description: 'Deep Space Climate Observatory detects an Earth-and-Mars directed Coronal Mass Ejection. Dangerous high-energy protons arriving in 40 minutes!',
    options: [
      {
        id: 'opt_rad_shelter',
        label: 'Retreat to Underground Regolith Vault',
        description: 'Order all 4 astronauts into the 5-meter deep subsurface shelter buried under dense Martian dirt.',
        resourceCost: { food: -4, morale: -8 },
        benefit: 'Absorbs 95% of cosmic flux; crew receives negligible radiation exposure.',
      },
      {
        id: 'opt_rad_shield_power',
        label: 'Maximum Shielding Field Overcharge',
        description: 'Direct the entire power capacitor bank into the superconducting magnetic deflector grid.',
        resourceCost: { power: -28 },
        benefit: 'Deflects the flare without interrupting above-ground habitat operations.',
      },
      {
        id: 'opt_rad_water_curtain',
        label: 'Pump Greywater into Ceiling Bladders',
        description: 'Use the habitat’s massive hydrogen-dense water tanks as a thermal/radiation absorbing ceiling ceiling shield.',
        resourceCost: { water: -6, integrity: 6 },
        benefit: 'Hydrogen atoms in water effectively slow down relativistic neutrons and protons.',
      },
    ],
  },
  {
    eventType: 'GREENHOUSE_FAILURE',
    severity: 'MEDIUM',
    title: 'Hydroponic Thermal Inversion & Fungal Spore Alert',
    description: 'Greenhouse heating heat-pipe valve froze in the -60°C Martian night, causing condensation and frost damage to the dwarf wheat crops.',
    options: [
      {
        id: 'opt_green_heat_lamp',
        label: 'Deploy Infrared Radiant Heat Lamps',
        description: 'Engage auxiliary thermal lamps and UV sterilizers to thaw crops and eradicate spore growth.',
        resourceCost: { power: -16, food: -5 },
        benefit: 'Saves 80% of the harvest; halts further biological crop decay.',
      },
      {
        id: 'opt_green_spirulina',
        label: 'Shift to High-Yield Spirulina Algae Vats',
        description: 'Inoculate fast-growing microalgae photobioreactors that produce protein with zero soil requirements.',
        resourceCost: { water: -8, power: -10 },
        benefit: 'Generates +18 units of emergency superfood in 24 hours.',
      },
      {
        id: 'opt_green_salvage',
        label: 'Freeze-Dry & Salvage Remaining Biomass',
        description: 'Harvest whatever is salvageable immediately and accept a temporary calorie cut.',
        resourceCost: { food: -10, morale: -6 },
        benefit: 'Conserves power for other critical life-support modules.',
      },
    ],
  },
  {
    eventType: 'EQUIPMENT_MALFUNCTION',
    severity: 'MEDIUM',
    title: 'Primary Coolant Loop Circulation Cavitation',
    description: 'Vapor bubbles in the ethylene-glycol heat transfer loop are causing thermal pumps to vibrate violently, risking thermal runaway.',
    options: [
      {
        id: 'opt_equip_purge',
        label: 'Bleed & Replenish Coolant Circuit',
        description: 'Purge vapor pockets using spare reserve fluid and recalibrate pressure regulators.',
        resourceCost: { power: -12, integrity: 12 },
        benefit: 'Eliminates vibration and stabilizes habitat thermal balance.',
      },
      {
        id: 'opt_equip_radiator',
        label: 'Deploy Secondary Passive Radiator Panels',
        description: 'Unfurl accordion-style thermal heat-pipe radiators to reject heat into the freezing Martian atmosphere.',
        resourceCost: { power: -6, integrity: 8 },
        benefit: 'Relieves stress on mechanical pumps with zero fluid consumption.',
      },
    ],
  },
  {
    eventType: 'CREW_FATIGUE',
    severity: 'LOW',
    title: 'Chronobiology Desynchronization & Confinement Fatigue',
    description: 'Living on a 24-hour 39-minute Martian Sol with artificial LED schedules has disrupted crew circadian rhythms, causing cognitive lag.',
    options: [
      {
        id: 'opt_crew_banquet',
        label: 'Host Mission Milestone Celebration',
        description: 'Open emergency luxury rations (real freeze-dried shrimp cocktail & chocolate) and broadcast Earth video messages.',
        resourceCost: { food: -8, water: -4 },
        benefit: 'Tremendous boost to morale (+18%) and restoration of team cohesion.',
      },
      {
        id: 'opt_crew_circadian',
        label: 'Recalibrate Full-Spectrum Blue-Light Array',
        description: 'Sync crew biological clocks with timed high-lux blue-shifted light pulses throughout the habitat.',
        resourceCost: { power: -10 },
        benefit: 'Naturally restores alertness and boosts crew morale (+10%).',
      },
    ],
  },
];

export class SimulationEngine {
  /**
   * Applies daily consumption and natural generation.
   */
  public static calculateDailyTick(
    current: ColonyResources,
    difficulty: DifficultyLevel
  ): {
    nextResources: ColonyResources;
    deltas: ResourceDelta;
    failureReason: string | null;
  } {
    const config = DIFFICULTY_SETTINGS[difficulty] || DIFFICULTY_SETTINGS.STANDARD;

    // Power calculations
    const netPowerChange = config.basePowerGeneration - config.basePowerConsumption;

    // Apply deltas
    let oxygen = current.oxygen - config.dailyOxygenConsumption;
    let water = current.water - config.dailyWaterConsumption;
    let food = current.food - config.dailyFoodConsumption;
    let power = current.power + netPowerChange;
    let integrity = current.integrity - config.dailyIntegrityWear;
    let radiation = current.radiation + config.dailyRadiationGain;
    let morale = current.morale;

    // Morale natural dynamics:
    // If life support is bountiful (>75%), morale slowly recovers; if low (<30%), morale degrades rapidly
    if (oxygen < 30 || water < 30 || food < 30 || power < 25) {
      morale -= 4.0;
    } else if (oxygen > 70 && water > 70 && food > 70 && power > 50) {
      morale = Math.min(100, morale + 1.5);
    } else {
      morale -= 0.5;
    }

    // High radiation degrades morale and health
    if (radiation > 60) {
      morale -= 3.0;
    }

    // Clamp values
    oxygen = Math.max(0, Math.min(100, Math.round(oxygen * 10) / 10));
    water = Math.max(0, Math.min(100, Math.round(water * 10) / 10));
    food = Math.max(0, Math.min(100, Math.round(food * 10) / 10));
    power = Math.max(0, Math.min(100, Math.round(power * 10) / 10));
    morale = Math.max(0, Math.min(100, Math.round(morale * 10) / 10));
    integrity = Math.max(0, Math.min(100, Math.round(integrity * 10) / 10));
    radiation = Math.max(0, Math.min(100, Math.round(radiation * 10) / 10));

    const nextResources: ColonyResources = {
      oxygen,
      water,
      food,
      power,
      morale,
      integrity,
      radiation,
    };

    const deltas: ResourceDelta = {
      oxygen: Math.round((oxygen - current.oxygen) * 10) / 10,
      water: Math.round((water - current.water) * 10) / 10,
      food: Math.round((food - current.food) * 10) / 10,
      power: Math.round((power - current.power) * 10) / 10,
      morale: Math.round((morale - current.morale) * 10) / 10,
      integrity: Math.round((integrity - current.integrity) * 10) / 10,
      radiation: Math.round((radiation - current.radiation) * 10) / 10,
    };

    // Check failure conditions
    let failureReason: string | null = null;
    if (oxygen <= 0) {
      failureReason = 'CRITICAL FAILURE: Atmospheric oxygen reserves depleted. Habitat life support failed to sustain crew respiration.';
    } else if (water <= 0) {
      failureReason = 'CRITICAL FAILURE: Potable water exhausted. Closed-loop distillation failed, leaving the crew without hydration.';
    } else if (food <= 0) {
      failureReason = 'CRITICAL FAILURE: Food rations exhausted. Hydroponic crop failure led to starvation.';
    } else if (power <= 0) {
      failureReason = 'CRITICAL FAILURE: Total grid blackout. Habitat thermal regulation collapsed in the Martian sub-zero environment.';
    } else if (integrity <= 0) {
      failureReason = 'CRITICAL FAILURE: Catastrophic structural breach. Inflatable habitat dome lost pressurization integrity.';
    } else if (morale <= 0) {
      failureReason = 'CRITICAL FAILURE: Crew psychological incapacitation. Severe confinement fatigue and systemic failure broke team operational command.';
    } else if (radiation >= 100) {
      failureReason = 'CRITICAL FAILURE: Acute Radiation Sickness threshold exceeded. Inadequate shielding exposed the expedition to lethal cosmic radiation.';
    }

    return { nextResources, deltas, failureReason };
  }

  /**
   * Applies an action trade-off to current resources.
   */
  public static executeAction(
    current: ColonyResources,
    actionType: string
  ): {
    success: boolean;
    nextResources: ColonyResources;
    changes: ResourceDelta;
    error?: string;
  } {
    const action = AVAILABLE_ACTIONS[actionType];
    if (!action) {
      return { success: false, nextResources: current, changes: {}, error: 'Unknown action type' };
    }

    // Verify sufficient resources
    const cost = action.cost;
    if (cost.oxygen && current.oxygen < cost.oxygen) {
      return { success: false, nextResources: current, changes: {}, error: `Insufficient Oxygen (Needs ${cost.oxygen})` };
    }
    if (cost.water && current.water < cost.water) {
      return { success: false, nextResources: current, changes: {}, error: `Insufficient Water (Needs ${cost.water})` };
    }
    if (cost.food && current.food < cost.food) {
      return { success: false, nextResources: current, changes: {}, error: `Insufficient Food (Needs ${cost.food})` };
    }
    if (cost.power && current.power < cost.power) {
      return { success: false, nextResources: current, changes: {}, error: `Insufficient Power (Needs ${cost.power})` };
    }

    // Calculate updated resources
    let oxygen = current.oxygen - (cost.oxygen || 0) + (action.gain.oxygen || 0);
    let water = current.water - (cost.water || 0) + (action.gain.water || 0);
    let food = current.food - (cost.food || 0) + (action.gain.food || 0);
    let power = current.power - (cost.power || 0) + (action.gain.power || 0);
    let morale = current.morale - (cost.morale || 0) + (action.gain.morale || 0);
    let integrity = current.integrity - (cost.integrity || 0) + (action.gain.integrity || 0);
    let radiation = current.radiation - (cost.radiation || 0) + (action.gain.radiation || 0);

    // Clamp
    oxygen = Math.max(0, Math.min(100, Math.round(oxygen * 10) / 10));
    water = Math.max(0, Math.min(100, Math.round(water * 10) / 10));
    food = Math.max(0, Math.min(100, Math.round(food * 10) / 10));
    power = Math.max(0, Math.min(100, Math.round(power * 10) / 10));
    morale = Math.max(0, Math.min(100, Math.round(morale * 10) / 10));
    integrity = Math.max(0, Math.min(100, Math.round(integrity * 10) / 10));
    radiation = Math.max(0, Math.min(100, Math.round(radiation * 10) / 10));

    const nextResources: ColonyResources = {
      oxygen,
      water,
      food,
      power,
      morale,
      integrity,
      radiation,
    };

    const changes: ResourceDelta = {
      oxygen: Math.round((oxygen - current.oxygen) * 10) / 10,
      water: Math.round((water - current.water) * 10) / 10,
      food: Math.round((food - current.food) * 10) / 10,
      power: Math.round((power - current.power) * 10) / 10,
      morale: Math.round((morale - current.morale) * 10) / 10,
      integrity: Math.round((integrity - current.integrity) * 10) / 10,
      radiation: Math.round((radiation - current.radiation) * 10) / 10,
    };

    return { success: true, nextResources, changes };
  }

  /**
   * Randomly triggers an emergency based on difficulty and current conditions.
   */
  public static evaluateEmergency(
    currentDay: number,
    difficulty: DifficultyLevel,
    currentResources: ColonyResources
  ): EmergencyDefinition | null {
    // Give day 1 a calm start to allow onboarding
    if (currentDay <= 1) return null;

    const config = DIFFICULTY_SETTINGS[difficulty] || DIFFICULTY_SETTINGS.STANDARD;
    
    // Higher chance if systems are in degraded condition
    let adjustedChance = config.emergencyProbability;
    if (currentResources.integrity < 50) adjustedChance += 0.15;
    if (currentResources.power < 30) adjustedChance += 0.15;
    if (currentResources.morale < 40) adjustedChance += 0.10;

    const roll = Math.random();
    if (roll > adjustedChance) {
      return null;
    }

    // Pick an appropriate random event
    const randomIndex = Math.floor(Math.random() * EMERGENCY_EVENTS.length);
    return EMERGENCY_EVENTS[randomIndex];
  }

  /**
   * Calculates overall composite score and grade.
   */
  public static calculateMissionScore(
    daysSurvived: number,
    maxDays: number,
    resources: ColonyResources,
    status: string
  ): { score: number; grade: string; breakdown: Record<string, number> } {
    const survivalRate = Math.min(1, daysSurvived / maxDays);
    const dayPoints = Math.round(survivalRate * 400); // Up to 400 points

    // Resource points (Up to 300 points)
    const resourceAvg = (resources.oxygen + resources.water + resources.food + resources.power) / 4;
    const resourcePoints = Math.round((resourceAvg / 100) * 300);

    // Integrity & Wellbeing (Up to 200 points)
    const wellbeingPoints = Math.round(((resources.morale + resources.integrity) / 200) * 200);

    // Radiation mitigation (Up to 100 points, 0 radiation = 100, 100 radiation = 0)
    const radiationPoints = Math.max(0, Math.round((1 - resources.radiation / 100) * 100));

    // Bonus for full mission completion
    const completionBonus = status === 'COMPLETED' ? 100 : 0;

    const totalScore = Math.min(1000, dayPoints + resourcePoints + wellbeingPoints + radiationPoints + completionBonus);

    let grade = 'F';
    if (totalScore >= 920) grade = 'S';
    else if (totalScore >= 800) grade = 'A';
    else if (totalScore >= 680) grade = 'B';
    else if (totalScore >= 520) grade = 'C';
    else grade = 'D';

    if (status === 'FAILED') {
      grade = 'F';
    }

    return {
      score: totalScore,
      grade,
      breakdown: {
        survivalDays: dayPoints,
        resources: resourcePoints,
        wellbeing: wellbeingPoints,
        radiationSafety: radiationPoints,
        completionBonus,
      },
    };
  }
}
