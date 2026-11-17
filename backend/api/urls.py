from django.urls import path
from .views import (
    WorkoutListCreateView,
    WorkoutDetailView,
    ExerciseListCreateView,
    NutritionItemListCreateView,
    NutritionItemDetailView,
    NutritionGoalView,
    WeightListCreateView,
    UserSettingView,
    DashboardSummaryView,
    AIChatView,
)

urlpatterns = [
    path("dashboard/", DashboardSummaryView.as_view(), name="dashboard-summary"),
    path("workouts/", WorkoutListCreateView.as_view(), name="workout-list"),
    path("workouts/<slug:slug>/", WorkoutDetailView.as_view(), name="workout-detail"),
    path("exercises/", ExerciseListCreateView.as_view(), name="exercise-list"),
    path("nutrition/items/", NutritionItemListCreateView.as_view(), name="nutrition-items"),
    path("nutrition/items/<int:pk>/", NutritionItemDetailView.as_view(), name="nutrition-item-detail"),
    path("nutrition/goals/", NutritionGoalView.as_view(), name="nutrition-goals"),
    path("weight/", WeightListCreateView.as_view(), name="weight-list"),
    path("settings/", UserSettingView.as_view(), name="user-settings"),
    path("ai/chat/", AIChatView.as_view(), name="ai-chat"),
]
