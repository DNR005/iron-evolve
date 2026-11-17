import random
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import (
    WorkoutProgram,
    ExerciseItem,
    NutritionItem,
    NutritionGoal,
    WeightEntry,
    UserSetting,
    ChatMessage,
)
from .serializers import (
    WorkoutProgramSerializer,
    ExerciseItemSerializer,
    NutritionItemSerializer,
    NutritionGoalSerializer,
    WeightEntrySerializer,
    UserSettingSerializer,
    ChatMessageSerializer,
)


class WorkoutListCreateView(generics.ListCreateAPIView):
    queryset = WorkoutProgram.objects.prefetch_related("exercises").all()
    serializer_class = WorkoutProgramSerializer

    def perform_create(self, serializer):
        serializer.save(is_custom=True)


class WorkoutDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = WorkoutProgram.objects.prefetch_related("exercises").all()
    serializer_class = WorkoutProgramSerializer
    lookup_field = "slug"


class ExerciseListCreateView(generics.ListCreateAPIView):
    queryset = ExerciseItem.objects.all()
    serializer_class = ExerciseItemSerializer


class NutritionItemListCreateView(generics.ListCreateAPIView):
    queryset = NutritionItem.objects.all()
    serializer_class = NutritionItemSerializer


class NutritionItemDetailView(generics.DestroyAPIView):
    queryset = NutritionItem.objects.all()
    serializer_class = NutritionItemSerializer


class NutritionGoalView(APIView):
    def get(self, request):
        goal, _ = NutritionGoal.objects.get_or_create(id=1)
        serializer = NutritionGoalSerializer(goal)
        return Response(serializer.data)

    def patch(self, request):
        goal, _ = NutritionGoal.objects.get_or_create(id=1)
        serializer = NutritionGoalSerializer(goal, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class WeightListCreateView(generics.ListCreateAPIView):
    queryset = WeightEntry.objects.all()
    serializer_class = WeightEntrySerializer


class UserSettingView(APIView):
    def get(self, request):
        setting, _ = UserSetting.objects.get_or_create(id=1)
        serializer = UserSettingSerializer(setting)
        return Response(serializer.data)

    def put(self, request):
        setting, _ = UserSetting.objects.get_or_create(id=1)
        serializer = UserSettingSerializer(setting, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def patch(self, request):
        setting, _ = UserSetting.objects.get_or_create(id=1)
        serializer = UserSettingSerializer(setting, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class DashboardSummaryView(APIView):
    def get(self, request):
        goal, _ = NutritionGoal.objects.get_or_create(id=1)
        items = NutritionItem.objects.all()
        total_calories = sum(i.calories for i in items)
        total_protein = sum(i.protein for i in items)
        total_carbs = sum(i.carbs for i in items)
        total_fats = sum(i.fats for i in items)

        weights = WeightEntry.objects.all()
        weight_data = WeightEntrySerializer(weights, many=True).data

        recent_items = items[:4]
        recent_activity = [
            {
                "title": f"Logged {item.name}",
                "meta": f"{item.calories} kcal · {item.protein}g protein",
                "time": item.logged_at.strftime("%b %d, %H:%M"),
            }
            for item in recent_items
        ]

        data = {
            "mission": {
                "name": "Push Protocol · Chest & Delts Destruction",
                "focus": "Chest · Front Delts · Triceps",
                "time_est": "62 min",
                "volume": "18 sets",
                "completion_rate": 68,
                "streak_days": 14,
            },
            "nutrition": {
                "calories_consumed": total_calories,
                "calorie_goal": goal.calories,
                "protein_consumed": total_protein,
                "protein_goal": goal.protein,
                "carbs_consumed": total_carbs,
                "carbs_goal": goal.carbs,
                "fats_consumed": total_fats,
                "fats_goal": goal.fats,
                "water_intake": goal.water_intake,
                "water_goal": goal.water,
            },
            "weight_history": weight_data,
            "recent_activity": recent_activity,
        }
        return Response(data)


class AIChatView(APIView):
    def get(self, request):
        messages = ChatMessage.objects.all()[:50]
        serializer = ChatMessageSerializer(messages, many=True)
        return Response(serializer.data)

    def post(self, request):
        user_text = request.data.get("message", "").strip()
        if not user_text:
            return Response({"error": "Message is required"}, status=status.HTTP_400_BAD_REQUEST)

        # Save user message
        ChatMessage.objects.create(sender="user", message=user_text)

        # Generate intelligent contextual FORGE AI response
        ai_reply = self.generate_forge_reply(user_text)

        # Save AI reply
        ai_msg = ChatMessage.objects.create(sender="forge_ai", message=ai_reply)
        serializer = ChatMessageSerializer(ai_msg)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def generate_forge_reply(self, prompt: str) -> str:
        p = prompt.lower()

        if "push" in p or "chest" in p:
            return (
                "**[FORGE PROTOCOL LOADED: PUSH DOMINANCE]**\n\n"
                "Here is an optimal hypertrophy protocol for Chest, Delts, and Triceps:\n\n"
                "1. **Barbell Bench Press**: 4 sets × 6-8 reps (150s rest, heavy mechanical tension)\n"
                "2. **Incline Dumbbell Press (30°)**: 4 sets × 8-10 reps (120s rest, clavicular head focus)\n"
                "3. **Seated Overhead Dumbbell Press**: 3 sets × 8-10 reps (120s rest)\n"
                "4. **Cable Lateral Raises**: 4 sets × 12-15 reps (60s rest, constant tension on side delts)\n"
                "5. **Overhead Triceps Rope Extension**: 3 sets × 12-15 reps (60s rest, long head stretch)\n\n"
                "💡 *Tactical Tip: Prioritize deep eccentric control on the incline press for maximum muscle fiber recruitment.*"
            )
        elif "pull" in p or "back" in p:
            return (
                "**[FORGE PROTOCOL LOADED: PULL MATRIX]**\n\n"
                "Engineered back density and vertical pulling architecture:\n\n"
                "1. **Weighted Neutral-Grip Pull-Ups**: 4 sets × 5-8 reps (150s rest)\n"
                "2. **Barbell Bent-Over Row**: 4 sets × 6-8 reps (150s rest, mid-back thickness)\n"
                "3. **Chest-Supported Dumbbell Row**: 3 sets × 10-12 reps (90s rest, peak contraction)\n"
                "4. **Cable Face Pulls with External Rotation**: 3 sets × 15-20 reps (60s rest, rear delts)\n"
                "5. **Incline Dumbbell Bicep Curls**: 3 sets × 10-12 reps (75s rest)\n\n"
                "💡 *Tactical Tip: Drive with your elbows, not your hands, to eliminate forearm fatigue and engage the lats.*"
            )
        elif "leg" in p or "squat" in p:
            return (
                "**[FORGE PROTOCOL LOADED: LOWER BODY OVERHAUL]**\n\n"
                "High-intensity quad, hamstring, and glute stimulation:\n\n"
                "1. **Barbell Back Squat**: 5 sets × 5 reps (180s rest, explosive concentric)\n"
                "2. **Romanian Deadlift**: 4 sets × 8-10 reps (150s rest, deep hamstring stretch)\n"
                "3. **Bulgarian Split Squats**: 3 sets × 10 reps/leg (90s rest, unilateral balance)\n"
                "4. **Leg Extensions (Drop set on final set)**: 3 sets × 12-15 reps (60s rest)\n"
                "5. **Standing Calf Raises**: 4 sets × 15-20 reps (45s rest)\n\n"
                "💡 *Tactical Tip: Keep your torso locked and control the eccentric tempo on Romanian Deadlifts to spare the lumbar spine.*"
            )
        elif "calorie" in p or "diet" in p or "eat" in p or "nutrition" in p:
            return (
                "**[NUTRITION ANALYSIS & TARGET COMPUTATION]**\n\n"
                "Based on your 79.4 kg athletic profile and Hypertrophy directive:\n\n"
                "- **Maintenance Calories**: ~2,600 kcal/day\n"
                "- **Lean Bulk Target**: **2,850 kcal/day** (+250 kcal surplus)\n"
                "- **Aggressive Cut Target**: **2,150 kcal/day** (-450 kcal deficit)\n\n"
                "**Macro Breakdown Target (Bulking):**\n"
                "• **Protein**: 180 - 200g (2.2g per kg bodyweight)\n"
                "• **Carbohydrates**: 300 - 325g (clean glycogen fueling)\n"
                "• **Fats**: 70 - 80g (hormonal optimization)\n"
                "• **Water**: 4,000 ml minimum."
            )
        elif "fat" in p or "lose" in p or "cut" in p:
            return (
                "**[FAT LOSS PROTOCOL: PRECISION SHRED]**\n\n"
                "To incinerate body fat while safeguarding muscle mass:\n\n"
                "1. **Establish a 400-500 kcal deficit**: Aim for 0.5 - 0.75 kg loss per week.\n"
                "2. **Elevate Protein**: Maintain at 2.2g - 2.4g per kg (protects lean tissue).\n"
                "3. **Keep Heavy Lifting**: Do not switch to 'high reps for cutting'. Maintain heavy compound weights.\n"
                "4. **Zone 2 Cardio / 10k Steps**: 8,000 to 10,000 steps daily prevents metabolic slowdown without inducing systemic fatigue.\n"
                "5. **Hydration**: Drink 500ml water immediately upon waking."
            )
        else:
            return (
                f"**[FORGE AI ONLINE — DIRECTIVE ACKNOWLEDGED]**\n\n"
                f"Analyzing input: *\"{prompt}\"*\n\n"
                "All physiological metrics and workout systems are synced. Whether you need custom split engineering, progressive overload adjustments, macro recalibration, or form cues, I am at your command.\n\n"
                "Quick actions you can prompt me for:\n"
                "• *'Create a Push workout'*\n"
                "• *'How many calories should I eat?'*\n"
                "• *'How do I lose fat without losing muscle?'*\n"
                "• *'Suggest back and bicep exercises'*"
            )
