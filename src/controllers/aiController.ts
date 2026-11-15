import { Request, Response } from 'express';
import prisma from '../config/db';
import { AiAdvisorService } from '../services/aiAdvisorService';

export class AiController {
  /**
   * Query ARES Mission Advisor
   */
  public static async askAdvisor(req: Request, res: Response): Promise<void> {
    try {
      const { missionId, question } = req.body;

      if (!missionId || !question) {
        res.status(400).json({ success: false, error: 'missionId and question are required' });
        return;
      }

      // Fetch verified state from database
      const mission = await prisma.mission.findUnique({
        where: { id: missionId },
        include: {
          resourceState: true,
          events: {
            where: { status: 'ACTIVE' },
          },
        },
      });

      if (!mission || !mission.resourceState) {
        res.status(404).json({ success: false, error: 'Mission or resources not found' });
        return;
      }

      const activeEventsSummary = mission.events.map((e) => `[${e.severity}] ${e.title}: ${e.description}`);

      const advice = await AiAdvisorService.queryAdvisor({
        missionId: mission.id,
        userQuestion: question,
        currentDay: mission.currentDay,
        duration: mission.duration,
        difficulty: mission.difficulty,
        resources: {
          oxygen: mission.resourceState.oxygen,
          water: mission.resourceState.water,
          food: mission.resourceState.food,
          power: mission.resourceState.power,
          morale: mission.resourceState.morale,
          integrity: mission.resourceState.integrity,
          radiation: mission.resourceState.radiation,
        },
        recentEvents: activeEventsSummary,
      });

      res.json({
        success: true,
        advisor: advice,
      });
    } catch (err: any) {
      console.error('Error querying ARES advisor:', err);
      res.status(500).json({ success: false, error: 'ARES advisor error', details: err?.message });
    }
  }

  /**
   * Educational Glossary & Scientific References
   */
  public static async getGlossary(_req: Request, res: Response): Promise<void> {
    const glossary = [
      {
        term: 'ISRU (In-Situ Resource Utilization)',
        definition: 'The practice of collecting, processing, and utilizing materials found naturally on other celestial bodies (such as extracting oxygen from Martian CO2 or water from ice) rather than transporting them from Earth.',
        nasaCitation: 'NASA Mars Exploration Program ISRU Architecture & Technology Roadmaps.',
      },
      {
        term: 'MOXIE (Mars Oxygen ISRU Experiment)',
        definition: 'A demonstration technology on NASA’s Perseverance rover that produced 122 grams of breathable oxygen by electrolyzing atmospheric carbon dioxide at 800°C.',
        nasaCitation: 'NASA Jet Propulsion Laboratory (JPL) MOXIE Mission Operations.',
      },
      {
        term: 'ECLSS (Environmental Control and Life Support System)',
        definition: 'Hardware network that provides clean air, water, and atmospheric pressure to astronauts. On the ISS, it recycles over 98% of all water via vacuum distillation.',
        nasaCitation: 'NASA Marshall Space Flight Center ECLSS Development Division.',
      },
      {
        term: 'Martian Regolith',
        definition: 'The layer of loose, heterogeneous superficial deposits covering solid rock on Mars. Rich in iron oxides, silicates, and basalt; can be compressed or melted into radiation-shielding bricks.',
        nasaCitation: 'NASA Johnson Space Center Astromaterials Research & Exploration Science.',
      },
      {
        term: 'Solar Particle Event (SPE)',
        definition: 'Intense flux of energetic protons ejected by the Sun during coronal mass ejections. Because Mars has no global dipole magnetosphere, SPEs pose severe acute radiation risks to astronauts on the surface.',
        nasaCitation: 'NASA Space Radiation Analysis Group (SRAG).',
      },
      {
        term: 'Sabatier Reaction',
        definition: 'A chemical reaction combining carbon dioxide (CO2) and hydrogen (H2) at elevated temperature (300-400°C) over a nickel catalyst to produce methane (CH4) and water (H2O): CO2 + 4H2 -> CH4 + 2H2O.',
        nasaCitation: 'NASA Advanced Exploration Systems Life Support Systems.',
      },
      {
        term: 'Hydroponics & Controlled Environment Agriculture (CEA)',
        definition: 'Growing plants without terrestrial soil using mineral nutrient solutions dissolved in water under tailored LED photon wavelengths, optimizing caloric yield per kilowatt-hour.',
        nasaCitation: 'NASA Kennedy Space Center Space Crop Production Division.',
      },
    ];

    res.json({
      success: true,
      glossary,
    });
  }
}
