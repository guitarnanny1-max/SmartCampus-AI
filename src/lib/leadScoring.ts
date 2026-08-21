interface LeadData {
  studentStrength?: number;
  interest?: string;
  location?: string;
}

export function evaluateLead(data: LeadData) {
  let score = 40; // Base score for completing chat

  if (data.studentStrength) {
    if (data.studentStrength > 1500) score += 40;
    else if (data.studentStrength > 500) score += 25;
    else score += 10;
  }

  if (data.interest?.toLowerCase().includes("full") || data.interest?.toLowerCase().includes("all")) {
    score += 20;
  }

  let temperature = "🔵 Cold";
  if (score >= 80) {
    temperature = "🔥 Hot";
  } else if (score >= 60) {
    temperature = "🟠 Warm";
  }

  return { score: Math.min(score, 100), temperature };
}
