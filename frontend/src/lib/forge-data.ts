export type Exercise = {
  name: string;
  muscle: string;
  sets: number;
  reps: string;
  rest: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
};

export type WorkoutSplit = {
  id: string;
  name: string;
  focus: string;
  duration: string;
  volume: string;
  description: string;
  exercises: Exercise[];
};

export const workoutSplits: WorkoutSplit[] = [
  {
    id: "push",
    name: "Push",
    focus: "Chest · Shoulders · Triceps",
    duration: "62 min",
    volume: "18 sets",
    description: "Heavy pressing followed by isolation burnout for maximum upper-body drive.",
    exercises: [
      { name: "Barbell Bench Press", muscle: "Chest", sets: 4, reps: "6-8", rest: "150s", difficulty: "Advanced" },
      { name: "Incline Dumbbell Press", muscle: "Upper Chest", sets: 4, reps: "8-10", rest: "120s", difficulty: "Intermediate" },
      { name: "Seated Shoulder Press", muscle: "Front Delts", sets: 3, reps: "8-10", rest: "120s", difficulty: "Intermediate" },
      { name: "Cable Lateral Raise", muscle: "Side Delts", sets: 4, reps: "12-15", rest: "60s", difficulty: "Beginner" },
      { name: "Overhead Rope Extension", muscle: "Triceps", sets: 3, reps: "10-12", rest: "75s", difficulty: "Beginner" },
    ],
  },
  {
    id: "pull",
    name: "Pull",
    focus: "Back · Rear Delts · Biceps",
    duration: "58 min",
    volume: "17 sets",
    description: "Vertical and horizontal pulling to build a dense, wide back.",
    exercises: [
      { name: "Weighted Pull-Up", muscle: "Lats", sets: 4, reps: "5-8", rest: "150s", difficulty: "Advanced" },
      { name: "Barbell Row", muscle: "Mid Back", sets: 4, reps: "6-8", rest: "150s", difficulty: "Intermediate" },
      { name: "Chest-Supported Row", muscle: "Rhomboids", sets: 3, reps: "10-12", rest: "90s", difficulty: "Beginner" },
      { name: "Face Pull", muscle: "Rear Delts", sets: 3, reps: "15-20", rest: "60s", difficulty: "Beginner" },
      { name: "Incline Dumbbell Curl", muscle: "Biceps", sets: 3, reps: "10-12", rest: "75s", difficulty: "Beginner" },
    ],
  },
  {
    id: "legs",
    name: "Legs",
    focus: "Quads · Hamstrings · Calves",
    duration: "70 min",
    volume: "19 sets",
    description: "Brutal compound base with unilateral work and calf finishers.",
    exercises: [
      { name: "Back Squat", muscle: "Quads", sets: 5, reps: "5", rest: "180s", difficulty: "Advanced" },
      { name: "Romanian Deadlift", muscle: "Hamstrings", sets: 4, reps: "8-10", rest: "150s", difficulty: "Intermediate" },
      { name: "Bulgarian Split Squat", muscle: "Glutes", sets: 3, reps: "10 / leg", rest: "90s", difficulty: "Intermediate" },
      { name: "Leg Extension", muscle: "Quads", sets: 3, reps: "12-15", rest: "60s", difficulty: "Beginner" },
      { name: "Standing Calf Raise", muscle: "Calves", sets: 4, reps: "15-20", rest: "45s", difficulty: "Beginner" },
    ],
  },
  {
    id: "upper",
    name: "Upper",
    focus: "Full Upper Body",
    duration: "65 min",
    volume: "18 sets",
    description: "Balanced push/pull pairing for high-frequency upper-body training.",
    exercises: [
      { name: "Incline Barbell Press", muscle: "Chest", sets: 4, reps: "6-8", rest: "150s", difficulty: "Intermediate" },
      { name: "Lat Pulldown", muscle: "Lats", sets: 4, reps: "8-10", rest: "120s", difficulty: "Beginner" },
      { name: "Dumbbell Shoulder Press", muscle: "Delts", sets: 3, reps: "8-10", rest: "120s", difficulty: "Intermediate" },
      { name: "Seated Cable Row", muscle: "Mid Back", sets: 3, reps: "10-12", rest: "90s", difficulty: "Beginner" },
      { name: "Superset: Curl / Dip", muscle: "Arms", sets: 4, reps: "12", rest: "60s", difficulty: "Intermediate" },
    ],
  },
  {
    id: "lower",
    name: "Lower",
    focus: "Posterior Chain · Quads",
    duration: "60 min",
    volume: "16 sets",
    description: "Hinge-dominant session engineered for strength and hypertrophy.",
    exercises: [
      { name: "Trap Bar Deadlift", muscle: "Posterior Chain", sets: 4, reps: "5", rest: "180s", difficulty: "Advanced" },
      { name: "Hack Squat", muscle: "Quads", sets: 4, reps: "8-10", rest: "150s", difficulty: "Intermediate" },
      { name: "Seated Leg Curl", muscle: "Hamstrings", sets: 3, reps: "12-15", rest: "75s", difficulty: "Beginner" },
      { name: "Hip Thrust", muscle: "Glutes", sets: 3, reps: "10-12", rest: "90s", difficulty: "Beginner" },
      { name: "Weighted Plank", muscle: "Core", sets: 3, reps: "45s", rest: "45s", difficulty: "Beginner" },
    ],
  },
  {
    id: "bro",
    name: "Bro Split",
    focus: "One Muscle Per Day",
    duration: "55 min",
    volume: "20 sets",
    description: "Classic chest day: maximum local volume, maximum pump.",
    exercises: [
      { name: "Flat Bench Press", muscle: "Chest", sets: 5, reps: "8", rest: "120s", difficulty: "Intermediate" },
      { name: "Incline Machine Press", muscle: "Upper Chest", sets: 4, reps: "10", rest: "90s", difficulty: "Beginner" },
      { name: "Weighted Dip", muscle: "Lower Chest", sets: 4, reps: "8-10", rest: "120s", difficulty: "Advanced" },
      { name: "Cable Fly", muscle: "Chest", sets: 4, reps: "12-15", rest: "60s", difficulty: "Beginner" },
      { name: "Push-Up Burnout", muscle: "Chest", sets: 3, reps: "AMRAP", rest: "45s", difficulty: "Beginner" },
    ],
  },
  {
    id: "arnold",
    name: "Arnold Split",
    focus: "Chest & Back · Shoulders & Arms · Legs",
    duration: "75 min",
    volume: "22 sets",
    description: "Golden-era antagonist supersets with relentless volume.",
    exercises: [
      { name: "Bench Press / Wide Pull-Up", muscle: "Chest & Back", sets: 4, reps: "8 / 8", rest: "120s", difficulty: "Advanced" },
      { name: "Incline Fly / Barbell Row", muscle: "Chest & Back", sets: 4, reps: "12 / 10", rest: "105s", difficulty: "Intermediate" },
      { name: "Arnold Press", muscle: "Delts", sets: 4, reps: "10", rest: "90s", difficulty: "Intermediate" },
      { name: "Lateral Raise Drop Set", muscle: "Side Delts", sets: 3, reps: "15+15", rest: "60s", difficulty: "Advanced" },
      { name: "Preacher Curl / Skullcrusher", muscle: "Arms", sets: 4, reps: "12 / 12", rest: "60s", difficulty: "Intermediate" },
    ],
  },
];

export const exerciseLibrary: Exercise[] = workoutSplits.flatMap((s) => s.exercises);

export const weeklyActivity = [
  { day: "Mon", minutes: 62, volume: 14200 },
  { day: "Tue", minutes: 48, volume: 11800 },
  { day: "Wed", minutes: 0, volume: 0 },
  { day: "Thu", minutes: 71, volume: 16400 },
  { day: "Fri", minutes: 55, volume: 13100 },
  { day: "Sat", minutes: 82, volume: 18900 },
  { day: "Sun", minutes: 34, volume: 6200 },
];

export const weightSeries = [
  { date: "Mar", weight: 84.4 },
  { date: "Apr", weight: 83.1 },
  { date: "May", weight: 82.2 },
  { date: "Jun", weight: 81.0 },
  { date: "Jul", weight: 80.2 },
  { date: "Aug", weight: 79.4 },
];

export const consistencySeries = [
  { week: "W1", sessions: 4 },
  { week: "W2", sessions: 5 },
  { week: "W3", sessions: 3 },
  { week: "W4", sessions: 6 },
  { week: "W5", sessions: 5 },
  { week: "W6", sessions: 6 },
];

export const macroSplit = [
  { name: "Protein", value: 182, color: "var(--color-primary)" },
  { name: "Carbs", value: 246, color: "var(--color-cyan)" },
  { name: "Fats", value: 68, color: "var(--color-warning)" },
];

export const recentActivity = [
  { title: "Push Day — Heavy Bench", meta: "18 sets · 62 min", time: "Today, 07:40" },
  { title: "Logged 214g protein", meta: "Nutrition", time: "Yesterday, 21:10" },
  { title: "Pull Day — PR Deadlift 190kg", meta: "New personal record", time: "Yesterday, 08:05" },
  { title: "Weight logged: 79.4 kg", meta: "-0.8 kg this month", time: "2 days ago" },
];

export const achievements = [
  { name: "Iron Streak", detail: "14-day training streak", unlocked: true },
  { name: "Century Club", detail: "100 sessions logged", unlocked: true },
  { name: "Protein Machine", detail: "30 days hitting protein", unlocked: true },
  { name: "Two Plate Bench", detail: "100kg bench press", unlocked: true },
  { name: "Four Plate Squat", detail: "180kg back squat", unlocked: false },
  { name: "Forge Master", detail: "365 days of consistency", unlocked: false },
];

export const playlists = [
  {
    genre: "Phonk",
    tagline: "Drift-mode aggression for heavy sets",
    tracks: 42,
    duration: "2h 18m",
    bpm: "140-160",
    sample: ["Metamorphosis", "Close Eyes", "Murder In My Mind", "Sahara"],
  },
  {
    genre: "Hip Hop",
    tagline: "Confidence fuel between rounds",
    tracks: 55,
    duration: "3h 04m",
    bpm: "85-105",
    sample: ["Sicko Mode", "Till I Collapse", "Nonstop", "Kill Bill"],
  },
  {
    genre: "Hardstyle",
    tagline: "Pure adrenaline for final reps",
    tracks: 36,
    duration: "1h 52m",
    bpm: "150-160",
    sample: ["Rebirth", "Project One", "Reawakening", "Dragonborn"],
  },
  {
    genre: "Metal",
    tagline: "Maximum intensity, zero excuses",
    tracks: 48,
    duration: "2h 41m",
    bpm: "120-180",
    sample: ["Bleed It Out", "Duality", "Master of Puppets", "Chop Suey"],
  },
  {
    genre: "Rock",
    tagline: "Steady drive for volume days",
    tracks: 39,
    duration: "2h 12m",
    bpm: "110-140",
    sample: ["Thunderstruck", "Kickstart My Heart", "Whole Lotta Love", "Enter Sandman"],
  },
  {
    genre: "Cinematic",
    tagline: "Epic scores for the final mission",
    tracks: 28,
    duration: "1h 47m",
    bpm: "90-130",
    sample: ["Legend", "Time", "Why So Serious", "Arrival to Earth"],
  },
];

export const foodDatabase = [
  { name: "Chicken Breast (200g)", calories: 330, protein: 62, carbs: 0, fats: 7 },
  { name: "Whey Shake", calories: 165, protein: 30, carbs: 5, fats: 2 },
  { name: "White Rice (250g)", calories: 320, protein: 6, carbs: 70, fats: 1 },
  { name: "Oats + Banana", calories: 410, protein: 12, carbs: 74, fats: 8 },
  { name: "Salmon Fillet (180g)", calories: 370, protein: 40, carbs: 0, fats: 22 },
  { name: "Greek Yogurt (200g)", calories: 140, protein: 20, carbs: 8, fats: 4 },
  { name: "Eggs (3 whole)", calories: 215, protein: 19, carbs: 2, fats: 15 },
  { name: "Almonds (30g)", calories: 175, protein: 6, carbs: 6, fats: 15 },
];

export const dailyGoals = {
  calories: 2850,
  protein: 200,
  carbs: 300,
  fats: 80,
  water: 4000,
};
