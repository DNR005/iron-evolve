from django.core.management.base import BaseCommand
from api.models import (
    WorkoutProgram,
    ExerciseItem,
    NutritionItem,
    NutritionGoal,
    WeightEntry,
    UserSetting,
    ChatMessage,
)


class Command(BaseCommand):
    help = "Seed initial FORGE AI workout splits, exercises, and defaults"

    def handle(self, *args, **options):
        self.stdout.write("Seeding database...")

        # 1. Nutrition Goals
        goal, _ = NutritionGoal.objects.get_or_create(id=1)
        goal.calories = 2850
        goal.protein = 200
        goal.carbs = 300
        goal.fats = 80
        goal.water = 4000
        goal.water_intake = 2800
        goal.save()

        # 2. User Settings
        setting, _ = UserSetting.objects.get_or_create(id=1)
        setting.full_name = "Agent 001"
        setting.email = "warrior@forge.ai"
        setting.fitness_goal = "Hypertrophy & Max Strength"
        setting.experience_level = "Advanced"
        setting.height_cm = 182.0
        setting.weight_kg = 79.4
        setting.target_weight_kg = 78.0
        setting.unit_system = "metric"
        setting.save()

        # 3. Default Meals
        if NutritionItem.objects.count() == 0:
            NutritionItem.objects.create(name="Chicken Breast (200g)", calories=330, protein=62, carbs=0, fats=7)
            NutritionItem.objects.create(name="White Rice (250g)", calories=320, protein=6, carbs=70, fats=1)
            NutritionItem.objects.create(name="Whey Isolate Shake", calories=165, protein=30, carbs=5, fats=2)
            NutritionItem.objects.create(name="Oats + Banana", calories=410, protein=12, carbs=74, fats=8)

        # 4. Weight Entries
        if WeightEntry.objects.count() == 0:
            weights = [
                ("Mar", 84.4),
                ("Apr", 83.1),
                ("May", 82.2),
                ("Jun", 81.0),
                ("Jul", 80.2),
                ("Aug", 79.4),
            ]
            for label, w in weights:
                WeightEntry.objects.create(date_label=label, weight=w)

        # 5. Workout Programs & Exercises
        programs_data = [
            {
                "slug": "push",
                "name": "Push",
                "focus": "Chest · Shoulders · Triceps",
                "duration": "62 min",
                "volume": "18 sets",
                "description": "Heavy pressing followed by isolation burnout for maximum upper-body drive.",
                "exercises": [
                    {"name": "Barbell Bench Press", "muscle": "Chest", "sets": 4, "reps": "6-8", "rest": "150s", "difficulty": "Advanced"},
                    {"name": "Incline Dumbbell Press", "muscle": "Upper Chest", "sets": 4, "reps": "8-10", "rest": "120s", "difficulty": "Intermediate"},
                    {"name": "Seated Shoulder Press", "muscle": "Front Delts", "sets": 3, "reps": "8-10", "rest": "120s", "difficulty": "Intermediate"},
                    {"name": "Cable Lateral Raise", "muscle": "Side Delts", "sets": 4, "reps": "12-15", "rest": "60s", "difficulty": "Beginner"},
                    {"name": "Overhead Rope Extension", "muscle": "Triceps", "sets": 3, "reps": "10-12", "rest": "75s", "difficulty": "Beginner"},
                ]
            },
            {
                "slug": "pull",
                "name": "Pull",
                "focus": "Back · Rear Delts · Biceps",
                "duration": "58 min",
                "volume": "17 sets",
                "description": "Vertical and horizontal pulling to build a dense, wide back.",
                "exercises": [
                    {"name": "Weighted Pull-Up", "muscle": "Lats", "sets": 4, "reps": "5-8", "rest": "150s", "difficulty": "Advanced"},
                    {"name": "Barbell Row", "muscle": "Mid Back", "sets": 4, "reps": "6-8", "rest": "150s", "difficulty": "Intermediate"},
                    {"name": "Chest-Supported Row", "muscle": "Rhomboids", "sets": 3, "reps": "10-12", "rest": "90s", "difficulty": "Beginner"},
                    {"name": "Face Pull", "muscle": "Rear Delts", "sets": 3, "reps": "15-20", "rest": "60s", "difficulty": "Beginner"},
                    {"name": "Incline Dumbbell Curl", "muscle": "Biceps", "sets": 3, "reps": "10-12", "rest": "75s", "difficulty": "Beginner"},
                ]
            },
            {
                "slug": "legs",
                "name": "Legs",
                "focus": "Quads · Hamstrings · Calves",
                "duration": "70 min",
                "volume": "19 sets",
                "description": "Brutal compound base with unilateral work and calf finishers.",
                "exercises": [
                    {"name": "Back Squat", "muscle": "Quads", "sets": 5, "reps": "5", "rest": "180s", "difficulty": "Advanced"},
                    {"name": "Romanian Deadlift", "muscle": "Hamstrings", "sets": 4, "reps": "8-10", "rest": "150s", "difficulty": "Intermediate"},
                    {"name": "Bulgarian Split Squat", "muscle": "Glutes", "sets": 3, "reps": "10 / leg", "rest": "90s", "difficulty": "Intermediate"},
                    {"name": "Leg Extension", "muscle": "Quads", "sets": 3, "reps": "12-15", "rest": "60s", "difficulty": "Beginner"},
                    {"name": "Standing Calf Raise", "muscle": "Calves", "sets": 4, "reps": "15-20", "rest": "45s", "difficulty": "Beginner"},
                ]
            },
            {
                "slug": "upper",
                "name": "Upper",
                "focus": "Full Upper Body",
                "duration": "65 min",
                "volume": "18 sets",
                "description": "Balanced push/pull pairing for high-frequency upper-body training.",
                "exercises": [
                    {"name": "Incline Barbell Press", "muscle": "Chest", "sets": 4, "reps": "6-8", "rest": "150s", "difficulty": "Intermediate"},
                    {"name": "Lat Pulldown", "muscle": "Lats", "sets": 4, "reps": "8-10", "rest": "120s", "difficulty": "Beginner"},
                    {"name": "Dumbbell Shoulder Press", "muscle": "Delts", "sets": 3, "reps": "8-10", "rest": "120s", "difficulty": "Intermediate"},
                    {"name": "Seated Cable Row", "muscle": "Mid Back", "sets": 3, "reps": "10-12", "rest": "90s", "difficulty": "Beginner"},
                    {"name": "Superset: Curl / Dip", "muscle": "Arms", "sets": 4, "reps": "12", "rest": "60s", "difficulty": "Intermediate"},
                ]
            },
            {
                "slug": "lower",
                "name": "Lower",
                "focus": "Posterior Chain · Quads",
                "duration": "60 min",
                "volume": "16 sets",
                "description": "Hinge-dominant session engineered for strength and hypertrophy.",
                "exercises": [
                    {"name": "Trap Bar Deadlift", "muscle": "Posterior Chain", "sets": 4, "reps": "5", "rest": "180s", "difficulty": "Advanced"},
                    {"name": "Hack Squat", "muscle": "Quads", "sets": 4, "reps": "8-10", "rest": "150s", "difficulty": "Intermediate"},
                    {"name": "Seated Leg Curl", "muscle": "Hamstrings", "sets": 3, "reps": "12-15", "rest": "75s", "difficulty": "Beginner"},
                    {"name": "Hip Thrust", "muscle": "Glutes", "sets": 3, "reps": "10-12", "rest": "90s", "difficulty": "Beginner"},
                    {"name": "Weighted Plank", "muscle": "Core", "sets": 3, "reps": "45s", "rest": "45s", "difficulty": "Beginner"},
                ]
            },
            {
                "slug": "bro",
                "name": "Bro Split",
                "focus": "One Muscle Per Day",
                "duration": "55 min",
                "volume": "20 sets",
                "description": "Classic chest day: maximum local volume, maximum pump.",
                "exercises": [
                    {"name": "Flat Bench Press", "muscle": "Chest", "sets": 5, "reps": "8", "rest": "120s", "difficulty": "Intermediate"},
                    {"name": "Incline Machine Press", "muscle": "Upper Chest", "sets": 4, "reps": "10", "rest": "90s", "difficulty": "Beginner"},
                    {"name": "Weighted Dip", "muscle": "Lower Chest", "sets": 4, "reps": "8-10", "rest": "120s", "difficulty": "Advanced"},
                    {"name": "Cable Fly", "muscle": "Chest", "sets": 4, "reps": "12-15", "rest": "60s", "difficulty": "Beginner"},
                    {"name": "Push-Up Burnout", "muscle": "Chest", "sets": 3, "reps": "AMRAP", "rest": "45s", "difficulty": "Beginner"},
                ]
            },
            {
                "slug": "arnold",
                "name": "Arnold Split",
                "focus": "Chest & Back · Shoulders & Arms · Legs",
                "duration": "75 min",
                "volume": "22 sets",
                "description": "Golden-era antagonist supersets with relentless volume.",
                "exercises": [
                    {"name": "Bench Press / Wide Pull-Up", "muscle": "Chest & Back", "sets": 4, "reps": "8 / 8", "rest": "120s", "difficulty": "Advanced"},
                    {"name": "Incline Fly / Barbell Row", "muscle": "Chest & Back", "sets": 4, "reps": "12 / 10", "rest": "105s", "difficulty": "Intermediate"},
                    {"name": "Arnold Press", "muscle": "Delts", "sets": 4, "reps": "10", "rest": "90s", "difficulty": "Intermediate"},
                    {"name": "Lateral Raise Drop Set", "muscle": "Side Delts", "sets": 3, "reps": "15+15", "rest": "60s", "difficulty": "Advanced"},
                    {"name": "Preacher Curl / Skullcrusher", "muscle": "Arms", "sets": 4, "reps": "12 / 12", "rest": "60s", "difficulty": "Intermediate"},
                ]
            }
        ]

        for p_data in programs_data:
            exercises_list = p_data.pop("exercises")
            program, _ = WorkoutProgram.objects.get_or_create(
                slug=p_data["slug"],
                defaults=p_data
            )
            for ex in exercises_list:
                ExerciseItem.objects.get_or_create(
                    program=program,
                    name=ex["name"],
                    defaults=ex
                )

        # 6. Default AI Welcome message
        if ChatMessage.objects.count() == 0:
            ChatMessage.objects.create(
                sender="forge_ai",
                message="**[FORGE AI INITIALIZED]**\n\nI am your tactical fitness intelligence core. All telemetry streams are connected. How can I assist your physical evolution today?",
            )

        self.stdout.write(self.style.SUCCESS("Database seeded successfully!"))
