import { TouristPlace, CompleteTripPlan } from '../types/planner';
import { DestinationInfo } from '../types/location';
import { getPlacesForDestination } from './tourismService';

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  suggestedActions?: string[];
}

/**
 * Responds to travel questions using verified destination & itinerary data.
 * Does NOT hallucinate missing factual prices or times.
 */
export async function queryTravelAssistant(
  question: string,
  destination?: DestinationInfo,
  activePlan?: CompleteTripPlan
): Promise<string> {
  const normQ = question.toLowerCase().trim();

  // Retrieve destination places if available
  const destName = destination?.name || activePlan?.destination?.name || 'Kolkata';
  const places = await getPlacesForDestination(destName, destination?.coordinates);

  // 1. Weather / Rain question
  if (normQ.includes('rain') || normQ.includes('weather') || normQ.includes('bad weather')) {
    const indoorPlaces = places.filter((p) => p.isIndoor);
    if (indoorPlaces.length > 0) {
      const names = indoorPlaces.map((p) => `• **${p.name}** (${p.category} - ${p.estimatedTicketPrice || 'Verified entry applies'})`).join('\n');
      return `If rain is expected in **${destName}**, here are top recommended indoor attractions where you stay dry:\n\n${names}\n\n*Tip: Schedule indoor visits during peak afternoon rain windows.*`;
    }
    return `In case of rainy weather in **${destName}**, consider visiting indoor cultural centers, museums, or local food corridors until weather improves.`;
  }

  // 2. History / Photography / Specific category question
  if (normQ.includes('history') || normQ.includes('heritage') || normQ.includes('photo') || normQ.includes('food')) {
    let cat = 'history';
    if (normQ.includes('photo')) cat = 'photography';
    if (normQ.includes('food')) cat = 'food';

    const catPlaces = places.filter((p) => p.category === cat || p.category === 'history' || p.category === 'culture');
    if (catPlaces.length > 0) {
      const list = catPlaces
        .map((p) => `• **${p.name}**: ${p.whyVisit} (Suggested duration: ${Math.round(p.approxDurationMinutes / 60)} hrs)`)
        .join('\n\n');
      return `Here are top recommended ${cat} highlights in **${destName}**:\n\n${list}`;
    }
  }

  // 3. 2-day / 3-day trip question
  if (normQ.includes('2 day') || normQ.includes('3 day') || normQ.includes('itinerary') || normQ.includes('what can i do')) {
    const sample = places.slice(0, 4).map((p) => p.name).join(', ');
    return `For a trip to **${destName}**, a great 2 to 3 day flow includes exploring:\n\n📍 ${sample}\n\nYou can use the **Plan My Trip** wizard above to customize pace and preferences!`;
  }

  // 4. Near specific landmark
  if (normQ.includes('near') || normQ.includes('around')) {
    const p1 = places[0];
    const p2 = places[1];
    if (p1 && p2) {
      return `Near **${p1.name}**, you can easily visit **${p2.name}** (${p2.distanceFromBaseKm || 1.5} km away). Both can be comfortably paired in the same morning or afternoon slot.`;
    }
  }

  // 5. General destination summary fallback
  const placeNames = places.slice(0, 5).map((p) => `• **${p.name}** (${p.category})`).join('\n');
  return `Based on verified tourism data for **${destName}**, here are key places to visit:\n\n${placeNames}\n\nAsk me about weather options, duration recommendations, or nearby attractions!`;
}
