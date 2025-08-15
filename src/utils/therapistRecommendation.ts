
interface ScoreMapping {
  [key: string]: string[];
}

interface TherapistScores {
  [therapistName: string]: number;
}

// Scoring mappings based on user answers - updated to only include active therapists
const SCORING_MAPPINGS: { [questionId: number]: ScoreMapping } = {
  0: { // Q1: How do you usually process it?
    'talk-emotions': ['Julie'],
    'logical-thinking': ['Camille'],
    'hold-until-break': ['Elena', 'Sage'],
    'understanding-without-explaining': ['Sage']
  },
  1: { // Q2: Which of these do you relate to most?
    'emotionally-overwhelmed': ['Sage', 'Elena'],
    'stuck-decisions': ['Camille'],
    'breakup-identity': ['Sage'],
    'quiet-emptiness': ['Camille'],
    'need-non-judgmental': ['Elena', 'Sage']
  },
  2: { // Q3: What kind of support would feel most comforting?
    'warm-motherly': ['Elena', 'Sage'],
    'calm-grounded': ['Sage', 'Camille'],
    'positive-uplifting': ['Julie'],
    'thoughtful-explorer': ['Camille'],
    'clear-insightful': ['Julie']
  },
  3: { // Q4: Choose a vibe
    'cozy-tea': ['Elena', 'Sage'],
    'clean-desk': ['Camille'],
    'sunny-walk': ['Julie'],
    'candlelit-journal': ['Camille'],
    'wise-conversation': ['Sage']
  }
};

export interface TherapistRecommendation {
  name: string;
  score: number;
  rank: number;
}

export const calculateTherapistRecommendations = (
  answers: Record<number, string[]>
): TherapistRecommendation[] => {
  console.log('Calculating recommendations for answers:', answers);
  
  // Initialize scores for active therapists only
  const therapistScores: TherapistScores = {
    'Sage': 0,
    'Camille': 0,
    'Elena': 0,
    'Julie': 0
  };

  // Calculate scores based on user answers
  Object.entries(answers).forEach(([questionIdStr, selectedOptions]) => {
    const questionId = parseInt(questionIdStr);
    const mappings = SCORING_MAPPINGS[questionId];
    
    if (!mappings) {
      console.warn(`No mappings found for question ${questionId}`);
      return;
    }

    selectedOptions.forEach(optionId => {
      const therapistsToScore = mappings[optionId];
      if (therapistsToScore) {
        therapistsToScore.forEach(therapistName => {
          if (therapistScores.hasOwnProperty(therapistName)) {
            therapistScores[therapistName] += 1;
            console.log(`Added 1 point to ${therapistName} for option ${optionId}`);
          }
        });
      } else {
        console.warn(`No therapist mappings found for option ${optionId} in question ${questionId}`);
      }
    });
  });

  console.log('Final therapist scores:', therapistScores);

  // Convert to array and sort by score (descending)
  const recommendations = Object.entries(therapistScores)
    .map(([name, score]) => ({ name, score, rank: 0 }))
    .sort((a, b) => b.score - a.score);

  // Assign ranks
  recommendations.forEach((rec, index) => {
    rec.rank = index + 1;
  });

  console.log('Sorted recommendations:', recommendations);

  // Return top 3
  return recommendations.slice(0, 3);
};
