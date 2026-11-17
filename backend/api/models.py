from django.db import models


class WorkoutProgram(models.Model):
    slug = models.SlugField(max_length=100, unique=True)
    name = models.CharField(max_length=150)
    focus = models.CharField(max_length=200)
    duration = models.CharField(max_length=50)
    volume = models.CharField(max_length=50)
    description = models.TextField()
    is_custom = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name


class ExerciseItem(models.Model):
    program = models.ForeignKey(
        WorkoutProgram,
        related_name="exercises",
        on_delete=models.CASCADE,
        null=True,
        blank=True,
    )
    name = models.CharField(max_length=150)
    muscle = models.CharField(max_length=100)
    sets = models.IntegerField(default=3)
    reps = models.CharField(max_length=50, default="10-12")
    rest = models.CharField(max_length=50, default="60s")
    difficulty = models.CharField(
        max_length=50,
        choices=[
            ("Beginner", "Beginner"),
            ("Intermediate", "Intermediate"),
            ("Advanced", "Advanced"),
        ],
        default="Intermediate",
    )
    is_custom = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.name} ({self.muscle})"


class NutritionItem(models.Model):
    name = models.CharField(max_length=200)
    calories = models.IntegerField(default=0)
    protein = models.IntegerField(default=0)
    carbs = models.IntegerField(default=0)
    fats = models.IntegerField(default=0)
    logged_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-logged_at"]

    def __str__(self):
        return f"{self.name} - {self.calories} kcal"


class NutritionGoal(models.Model):
    calories = models.IntegerField(default=2850)
    protein = models.IntegerField(default=200)
    carbs = models.IntegerField(default=300)
    fats = models.IntegerField(default=80)
    water = models.IntegerField(default=4000)
    water_intake = models.IntegerField(default=2800)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Daily Goals: {self.calories} kcal / {self.water_intake}ml water"


class WeightEntry(models.Model):
    date_label = models.CharField(max_length=50)
    weight = models.FloatField()
    recorded_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["recorded_at"]

    def __str__(self):
        return f"{self.date_label}: {self.weight} kg"


class UserSetting(models.Model):
    full_name = models.CharField(max_length=120, default="Agent 001")
    email = models.EmailField(default="warrior@forge.ai")
    fitness_goal = models.CharField(max_length=150, default="Hypertrophy & Strength")
    experience_level = models.CharField(max_length=50, default="Intermediate")
    height_cm = models.FloatField(default=180.0)
    weight_kg = models.FloatField(default=79.4)
    target_weight_kg = models.FloatField(default=77.0)
    unit_system = models.CharField(max_length=20, default="metric")
    sound_effects = models.BooleanField(default=True)
    haptic_feedback = models.BooleanField(default=False)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Settings for {self.full_name}"


class ChatMessage(models.Model):
    sender = models.CharField(max_length=30)  # 'user' or 'forge_ai'
    message = models.TextField()
    category = models.CharField(max_length=50, blank=True, default="general")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["created_at"]

    def __str__(self):
        return f"[{self.sender}] {self.message[:30]}"
