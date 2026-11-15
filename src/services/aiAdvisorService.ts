import { ColonyResources } from '../types/simulation';

export interface AdvisorRequest {
  missionId: string;
  userQuestion: string;
  currentDay: number;
  duration: number;
  difficulty: string;
  resources: ColonyResources;
  recentEvents: string[];
}

export interface AdvisorResponse {
  mode: 'AI_CONNECTED' | 'DEMO_ADVISOR_MODE';
  situationAnalysis: string;
  criticalRisks: string[];
  recommendedActions: string[];
  scientificInsights: string;
  fullMessage: string;
}

export class AiAdvisorService {
  public static async queryAdvisor(request: AdvisorRequest): Promise<AdvisorResponse> {
    const apiKey = process.env.GEMINI_API_KEY?.trim();

    if (apiKey && apiKey.length > 5 && !apiKey.includes('YOUR_')) {
      try {
        const aiResponse = await this.callGeminiAPI(apiKey, request);
        if (aiResponse) {
          return aiResponse;
        }
      } catch (err: any) {
        console.warn('[ARES Advisor] Gemini API call failed or timed out, switching to Rule-Based Advisor:', err?.message || err);
      }
    }

    // Fallback: Smart Rule-Based Engine
    return this.generateDeterministicAdvice(request);
  }

  private static async callGeminiAPI(apiKey: string, request: AdvisorRequest): Promise<AdvisorResponse | null> {
    const { userQuestion, currentDay, duration, difficulty, resources, recentEvents } = request;

    const systemPrompt = `You are ARES (Astronaut Resource Evaluation System), the advanced NASA mission advisory AI aboard the MarsBase Alpha habitat for the 2026 Junior Astronaut Mission Trainer challenge.
Your role:
1. Provide concise, high-reliability tactical advice to the Mars Mission Commander (the student user).
2. Ground all answers in real aerospace physics, biology, and life-support engineering (ISRU, Sabatier reactors, MOXIE, ECLSS, hydroponics, radiation shielding).
3. Distinguish between simulated educational game metrics (0-100 scales) and actual NASA scientific principles.
4. Keep answers encouraging, structured, and realistic. Do not guarantee survival, as Martian conditions are inherently hazardous.

Output your response strictly as valid JSON matching this schema:
{
  "situationAnalysis": "Short 2-3 sentence overview of current colony telemetry",
  "criticalRisks": ["Risk 1", "Risk 2"],
  "recommendedActions": ["Action 1 with reason", "Action 2 with reason"],
  "scientificInsights": "1-2 sentences explaining the NASA science behind this recommendation",
  "fullMessage": "Complete friendly tactical advice addressing the commander's specific question"
}`;

    const contextPayload = `Current Mission Telemetry:
- Sol: ${currentDay} of ${duration}
- Difficulty: ${difficulty}
- Oxygen: ${resources.oxygen.toFixed(1)}%
- Water: ${resources.water.toFixed(1)}%
- Food: ${resources.food.toFixed(1)}%
- Power Grid: ${resources.power.toFixed(1)}%
- Crew Morale: ${resources.morale.toFixed(1)}%
- Habitat Integrity: ${resources.integrity.toFixed(1)}%
- Cosmic Radiation Exposure: ${resources.radiation.toFixed(1)}%
- Recent Incident Log: ${recentEvents.length > 0 ? recentEvents.join(' | ') : 'Nominal telemetry, no active anomalies.'}

Commander Question: "${userQuestion}"`;

    // Attempt Gemini call using official endpoint
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          {
            role: 'user',
            parts: [
              { text: systemPrompt },
              { text: contextPayload }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.3,
          maxOutputTokens: 1000,
          responseMimeType: 'application/json'
        }
      })
    });

    if (!response.ok) {
      throw new Error(`Gemini API returned status ${response.status}`);
    }

    const data: any = await response.json();
    const candidateText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!candidateText) return null;

    try {
      const parsed = JSON.parse(candidateText);
      return {
        mode: 'AI_CONNECTED',
        situationAnalysis: parsed.situationAnalysis || 'Telemetry analyzed by ARES neural core.',
        criticalRisks: parsed.criticalRisks || [],
        recommendedActions: parsed.recommendedActions || [],
        scientificInsights: parsed.scientificInsights || '',
        fullMessage: parsed.fullMessage || candidateText,
      };
    } catch {
      return {
        mode: 'AI_CONNECTED',
        situationAnalysis: 'Telemetry processed successfully.',
        criticalRisks: ['Monitor life support reserves closely.'],
        recommendedActions: ['Execute daily ECLSS balance.'],
        scientificInsights: 'Closed-loop regenerative life support systems require continuous balance between consumables and power.',
        fullMessage: candidateText,
      };
    }
  }

  /**
   * Deterministic, intelligent rule-based Mission Advisor
   */
  public static generateDeterministicAdvice(request: AdvisorRequest): AdvisorResponse {
    const { userQuestion, currentDay, duration, resources, recentEvents } = request;
    const q = userQuestion.toLowerCase();

    const criticalRisks: string[] = [];
    const recommendedActions: string[] = [];

    // Analyze resources
    if (resources.oxygen < 25) {
      criticalRisks.push(`CRITICAL OXYGEN DEFICIT: Oxygen at ${resources.oxygen.toFixed(1)}%. Depletion imminent within 2-3 Sols.`);
      recommendedActions.push('Overcharge MOXIE Oxygen Generator immediately to prevent crew hypoxia.');
    } else if (resources.oxygen < 45) {
      criticalRisks.push(`Oxygen reserves declining (${resources.oxygen.toFixed(1)}%). Buffer is narrowing.`);
      recommendedActions.push('Prioritize MOXIE cycles before power drops.');
    }

    if (resources.water < 25) {
      criticalRisks.push(`SEVERE DEHYDRATION RISK: Water at ${resources.water.toFixed(1)}%.`);
      recommendedActions.push('Initiate Closed-Loop Catalytic Water Distillation.');
    } else if (resources.water < 45) {
      criticalRisks.push(`Water supply below 50% (${resources.water.toFixed(1)}%).`);
    }

    if (resources.power < 30) {
      criticalRisks.push(`POWER GRID MARGIN COMPROMISED: Battery at ${resources.power.toFixed(1)}%.`);
      recommendedActions.push('Clear solar array dust or enable Grid Load Shedding.');
    }

    if (resources.food < 30) {
      criticalRisks.push(`FOOD RATION SQUEEZE: Food reserves at ${resources.food.toFixed(1)}%.`);
      recommendedActions.push('Execute Hydroponic Greenhouse Harvest Cycle.');
    }

    if (resources.radiation > 65) {
      criticalRisks.push(`HIGH RADIATION FLUX: Cumulative index at ${resources.radiation.toFixed(1)}%.`);
      recommendedActions.push('Engage Superconducting Magnetic Shielding to halt cell ionizing damage.');
    }

    if (resources.integrity < 50) {
      criticalRisks.push(`HULL STRESS WARNING: Habitat integrity down to ${resources.integrity.toFixed(1)}%.`);
      recommendedActions.push('Deploy Basalt-Fiber Structural Sealant to patch micro-fissures.');
    }

    if (resources.morale < 40) {
      criticalRisks.push(`CREW COGNITIVE FATIGUE: Morale at ${resources.morale.toFixed(1)}%.`);
      recommendedActions.push('Schedule Earth uplink video call or luxury ration decompression cycle.');
    }

    // Default recommendations if telemetry is healthy
    if (recommendedActions.length === 0) {
      recommendedActions.push('Colony parameters nominal. Maintain steady power reserves for unforeseen atmospheric dust storms.');
      recommendedActions.push('Conduct preventative maintenance on photovoltaic panels and water filtration membranes.');
    }

    let situationAnalysis = `Commander, on Sol ${currentDay} of ${duration}, habitat telemetry indicates overall ${
      criticalRisks.length > 0 ? 'HEIGHTENED RISK status' : 'STABLE operational status'
    }. Life-support buffers: O2 (${resources.oxygen.toFixed(0)}%), H2O (${resources.water.toFixed(0)}%), Food (${resources.food.toFixed(0)}%), Power (${resources.power.toFixed(0)}%).`;

    let scientificInsights = 'Closed-loop space habitats depend on thermodynamic mass balance. Energy generated by photovoltaic arrays directly powers electrolysis and catalytic water recycling; without steady power, regenerative loops freeze.';

    let fullMessage = '';

    if (q.includes('oxygen') || q.includes('breathe') || q.includes('air')) {
      scientificInsights = 'NASA’s MOXIE demonstration aboard Perseverance demonstrated solid-oxide electrolysis at 800°C, stripping oxygen atoms from CO2 molecules (2 CO2 -> 2 CO + O2).';
      fullMessage = `Commander Shepard, regarding oxygen: Mars has a thin 6 mbar atmosphere composed of 95% CO2. We do not bring all our oxygen from Earth; instead, we rely on In-Situ Resource Utilization (ISRU). Current oxygen level is ${resources.oxygen.toFixed(1)}%. Your MOXIE reactor converts Martian CO2 into O2 at the cost of electrical wattage. ${
        resources.oxygen < 40
          ? 'Urgent warning: Oxygen is trending low. Run an Oxygen Surge cycle before the next Sol.'
          : 'Your oxygen margin is currently acceptable, but keep battery reserves above 35% to power upcoming cycles.'
      }`;
    } else if (q.includes('energy') || q.includes('power') || q.includes('solar') || q.includes('battery')) {
      scientificInsights = 'Martian solar irradiance is only 43% of Earth’s due to distance (1.52 AU). Fine electrostatic dust clings to photovoltaic glass and reduces generation over time.';
      fullMessage = `Power update: Your battery grid stands at ${resources.power.toFixed(1)}%. All habitat systems—electrolysis, UV greenhouse lamps, water pumps, and thermal heating—compete for kilowatt-hours. If dust storms roll in, solar output will drop drastically. Recommended tactic: run 'Pneumatic Dust Clearing' on solar panels to ensure maximum daytime replenishment.`;
    } else if (q.includes('water') || q.includes('thirst') || q.includes('drink')) {
      scientificInsights = 'The ISS Environmental Control and Life Support System (ECLSS) recycles urine, sweat, and breath humidity with ~98% recovery efficiency through vacuum distillation and catalytic oxidation.';
      fullMessage = `Hydrological status: Available water is at ${resources.water.toFixed(1)}%. Water is heavy to transport (1 kg per liter), making 100% recycling mandatory for Mars outposts. If water falls below 30%, greenhouse harvests will fail and crew hydration will trigger medical emergency alerts.`;
    } else if (q.includes('radiation') || q.includes('storm') || q.includes('shield')) {
      scientificInsights = 'Mars lacks an active geomagnetic field and has less than 1% of Earth’s atmosphere, exposing explorers to Galactic Cosmic Rays (GCR) and Solar Particle Events (SPE). Regolith and hydrogen-rich water provide the best physical shielding.';
      fullMessage = `Radiation alert analysis: Current radiation index is ${resources.radiation.toFixed(1)}%. Prolonged exposure above 70% induces acute tissue inflammation and cognitive slowing. To mitigate risks, keep active magnetic deflection online or retreat to the subsurface regolith vault when high-energy solar storms are detected.`;
    } else if (q.includes('emergency') || q.includes('dust') || q.includes('leak') || q.includes('crisis')) {
      scientificInsights = 'NASA risk management operates on the principle of graceful degradation: fail-safe isolation of modules prevents cascading habitat destruction.';
      fullMessage = `Emergency response protocol: In any Martian anomaly, prioritize (1) Atmospheric containment, (2) Power grid stability, and (3) Crew safety. Never spend all remaining power on a single action—always retain a 15-20% emergency reserve for life-support pumps.`;
    } else {
      fullMessage = `Commander, ARES diagnostic online. Based on Sol ${currentDay} telemetry, your immediate priority should be: ${recommendedActions[0]} Review your Resource Center to execute preventative system cycles. Keep our 4 astronauts safe and mission ready!`;
    }

    return {
      mode: 'DEMO_ADVISOR_MODE',
      situationAnalysis,
      criticalRisks,
      recommendedActions,
      scientificInsights,
      fullMessage,
    };
  }
}
