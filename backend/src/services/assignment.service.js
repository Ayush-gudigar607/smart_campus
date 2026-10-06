import { env } from '../config/env.js';
import * as repository from '../repositories/request.repository.js';

export const pickStaff = (candidates) => candidates.filter(x => x.activeLoad < env.MAX_ACTIVE_PER_STAFF).sort((a,b) => a.activeLoad-b.activeLoad || new Date(a.lastAssignedAt || 0)-new Date(b.lastAssignedAt || 0) || a.id-b.id)[0] || null;

const extractJson = (text = '') => {
  const match = text.match(/\{[\s\S]*\}/);
  if (!match) return null;
  try { return JSON.parse(match[0]); } catch { return null; }
};

async function askGeminiToPickStaff(request, candidates) {
  if (!env.GEMINI_API_KEY?.trim()) return null;

  const eligible = candidates.filter((candidate) => candidate.activeLoad < env.MAX_ACTIVE_PER_STAFF);
  if (!eligible.length) return null;

  const prompt = [
    'Choose the best staff member for this campus service request.',
    'Return only JSON in this exact shape: {"staffId": number, "reason": string}.',
    'Prefer the correct department, lower active load, older last assignment, and relevant title/description/location clues.',
    `Request: ${JSON.stringify({
      code: request.requestCode,
      title: request.title,
      description: request.description,
      location: request.location,
      priority: request.priority,
      departmentId: request.departmentId,
    })}`,
    `Candidates: ${JSON.stringify(eligible.map(({ id, name, activeLoad, lastAssignedAt }) => ({ id, name, activeLoad, lastAssignedAt })))}`,
  ].join('\n');

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(env.GEMINI_MODEL)}:generateContent`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': env.GEMINI_API_KEY,
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.2, responseMimeType: 'application/json' },
      }),
    });

    if (!response.ok) return null;
    const data = await response.json();
    const text = data?.candidates?.[0]?.content?.parts?.map((part) => part.text).filter(Boolean).join('\n');
    const choice = extractJson(text);
    const staffId = Number(choice?.staffId);
    const selected = eligible.find((candidate) => Number(candidate.id) === staffId);
    return selected ? { ...selected, assignmentReason: choice.reason } : null;
  } catch {
    return null;
  }
}

export const pickStaffWithAi = async (request, candidates) => (await askGeminiToPickStaff(request, candidates)) || pickStaff(candidates);
export const autoAssign = (requestId) => repository.autoAssign(requestId, pickStaffWithAi);
