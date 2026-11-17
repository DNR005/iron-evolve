from rest_framework import serializers
from .models import (
    WorkoutProgram,
    ExerciseItem,
    NutritionItem,
    NutritionGoal,
    WeightEntry,
    UserSetting,
    ChatMessage,
)


class ExerciseItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = ExerciseItem
        fields = ["id", "program", "name", "muscle", "sets", "reps", "rest", "difficulty", "is_custom"]


class WorkoutProgramSerializer(serializers.ModelSerializer):
    exercises = ExerciseItemSerializer(many=True, read_only=True)

    class Meta:
        model = WorkoutProgram
        fields = [
            "id",
            "slug",
            "name",
            "focus",
            "duration",
            "volume",
            "description",
            "is_custom",
            "exercises",
        ]


class NutritionItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = NutritionItem
        fields = ["id", "name", "calories", "protein", "carbs", "fats", "logged_at"]


class NutritionGoalSerializer(serializers.ModelSerializer):
    class Meta:
        model = NutritionGoal
        fields = ["id", "calories", "protein", "carbs", "fats", "water", "water_intake"]


class WeightEntrySerializer(serializers.ModelSerializer):
    class Meta:
        model = WeightEntry
        fields = ["id", "date_label", "weight", "recorded_at"]


class UserSettingSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserSetting
        fields = [
            "id",
            "full_name",
            "email",
            "fitness_goal",
            "experience_level",
            "height_cm",
            "weight_kg",
            "target_weight_kg",
            "unit_system",
            "sound_effects",
            "haptic_feedback",
        ]


class ChatMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ChatMessage
        fields = ["id", "sender", "message", "category", "created_at"]
