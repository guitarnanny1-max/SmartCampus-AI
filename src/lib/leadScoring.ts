export interface LeadScoringInput {
  studentCount?: number | null;
  requirements?: string | null;
}

export function calculateLeadPriority(input: LeadScoringInput): { priority: 'HIGH' | 'MEDIUM' | 'LOW'; scoreReason: string } {
  let score = 50; // Base score out of 100
  let reasons: string[] = [];

  const studentCount = input.studentCount || 0;
  const requirements = (input.requirements || "").toLowerCase();

  // Evaluate student count scale
  if (studentCount >= 5000) {
    score += 30;
    reasons.push(`Large-scale institution (${studentCount} students)`);
  } else if (studentCount >= 1500) {
    score += 15;
    reasons.push(`Medium-scale institution (${studentCount} students)`);
  } else if (studentCount > 0) {
    score += 5;
    reasons.push(`Compact institution (${studentCount} students)`);
  }

  // Evaluate keywords in requirements for high intent / enterprise signals
  const highIntentKeywords = [
    'enterprise', 
    'district', 
    'multiple campus', 
    'custom integration', 
    'urgent', 
    'migration', 
    'budget allocated', 
    'decision maker',
    'security compliance',
    'lms integration'
  ];
  
  const matchedKeywords = highIntentKeywords.filter(keyword => requirements.includes(keyword));

  if (matchedKeywords.length > 0) {
    score += 25;
    reasons.push(`High-intent keywords: ${matchedKeywords.join(', ')}`);
  }

  // Determine priority bucket
  let priority: 'HIGH' | 'MEDIUM' | 'LOW' = 'MEDIUM';
  if (score >= 75) {
    priority = 'HIGH';
  } else if (score <= 45) {
    priority = 'LOW';
  }

  return {
    priority,
    scoreReason: reasons.length > 0 ? reasons.join('; ') : 'Standard inquiry baseline',
  };
}
