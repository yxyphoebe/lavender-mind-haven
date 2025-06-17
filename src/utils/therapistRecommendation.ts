
interface ScoreMapping {
  [key: string]: string[];
}

interface TherapistScores {
  [therapistName: string]: number;
}

// Scoring mappings based on user answers
const SCORING_MAPPINGS: { [questionId: number]: ScoreMapping } = {
  0: { // Q1: How do you usually process it?
    'talk-emotions': ['Lani', 'Leo'],
    'logical-thinking': ['Jade', 'Camille'],
    'hold-until-break': ['Elena', 'Sage'],
    'understanding-without-explaining': ['Sage', 'Elias']
  },
  1: { // Q2: Which of these do you relate to most?
    'emotionally-overwhelmed': ['Sage', 'Elena'],
    'stuck-decisions': ['Jade', 'Camille'],
    'breakup-identity': ['Lani', 'Sage'],
    'quiet-emptiness': ['Elias', 'Camille'],
    'need-non-judgmental': ['Elena', 'Sage']
  },
  2: { // Q3: What kind of support would feel most comforting?
    'warm-motherly': ['Elena', 'Sage'],
    'calm-grounded': ['Sage', 'Camille'],
    'positive-uplifting': ['Lani', 'Leo'],
    'thoughtful-explorer': ['Leo', 'Camille'],
    'clear-insightful': ['Jade', 'Elias']
  },
  3: { // Q4: Choose a vibe
    'cozy-tea': ['Elena', 'Sage'],
    'clean-desk': ['Jade', 'Camille'],
    'sunny-walk': ['Lani', 'Leo'],
    'candlelit-journal': ['Leo', 'Camille'],
    'wise-conversation': ['Elias', 'Sage']
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
  
  // Initialize scores for all therapists
  const therapistScores: TherapistScores = {
    'Sage': 0,
    'Lani': 0,
    'Jade': 0,
    'Elena': 0,
    'Camille': 0,
    'Leo': 0,
    'Elias': 0
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
