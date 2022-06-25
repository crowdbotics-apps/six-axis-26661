from django.contrib.auth import get_user_model
from django.db import models
from django.utils import timezone
from django.utils.translation import ugettext_lazy as _

User = get_user_model()


class WorkoutDifficulty(models.Model):
    difficulty_name = models.CharField(max_length=255)
    seconds = models.PositiveIntegerField()


class DiskPosition(models.Model):
    position_name = models.CharField(max_length=255)

    def __str__(self):
        return self.position_name


class WorkoutGroup(models.Model):
    SERIES = 0
    CHALLANGE = 1
    STANDALONE = 2
    WORKOUT_TYPE_OPTIONS = [
        (SERIES, 'Series'),
        (CHALLANGE, 'Challange'),
        (STANDALONE, 'Standalone'),
    ]

    workout_type = models.PositiveIntegerField(_("Workout Type"), choices=WORKOUT_TYPE_OPTIONS)
    workout_name = models.CharField(_("workout Name"), blank=True, null=True, max_length=255)
    video_tutorial = models.FileField(upload_to="workout_tutorials", blank=True, null=True)
    need_subscription = models.BooleanField(default=False)
    time = models.PositiveIntegerField(blank=True, null=True)
    repetition_number = models.PositiveIntegerField(blank=True, null=True)
    disk_position = models.CharField(blank=True, null=True, max_length=255)
    weight_shift = models.CharField(blank=True, null=True, max_length=255)
    days = models.PositiveIntegerField(blank=True, null=True)
    rest_days = models.PositiveIntegerField(blank=True, null=True)
    plan = models.BooleanField(default=False)
    metrics = models.BooleanField(default=False)


class StandaloneWorkout(models.Model):
    workout_name = models.CharField(_("workout Name"), blank=True, null=True, max_length=255)
    video_tutorial = models.FileField(upload_to="workout_tutorials", blank=True, null=True)
    need_subscription = models.BooleanField(default=False)

    # time = models.PositiveIntegerField(blank=True, null=True)
    # repetition_number = models.PositiveIntegerField(blank=True, null=True)
    # disk_position = models.CharField(blank=True, null=True, max_length=255)
    # weight_shift = models.CharField(blank=True, null=True, max_length=255)
    # days = models.PositiveIntegerField(blank=True, null=True)
    # rest_days = models.PositiveIntegerField(blank=True, null=True)
    # plan = models.BooleanField(default=False)
    # metrics = models.BooleanField(default=False)

    def __str__(self):
        return self.workout_name


class SeriesWorkout(models.Model):
    workout_name = models.CharField(_("workout Name"), blank=True, null=True, max_length=255)
    video_tutorial = models.FileField(upload_to="workout_tutorials", blank=True, null=True)
    need_subscription = models.BooleanField(default=False)
    standalone_workouts = models.ManyToManyField(StandaloneWorkout, blank=True, null=True,
                                                 through='StandaloneWorkoutSetup')

    def __str__(self):
        return self.workout_name


class StandaloneWorkoutSetup(models.Model):
    repetition_number = models.PositiveIntegerField(blank=True, null=True)
    disk_position = models.ForeignKey(DiskPosition, on_delete=models.CASCADE, blank=True, null=True)

    series_workout = models.ForeignKey(SeriesWorkout, on_delete=models.CASCADE)
    standalone_workout = models.ForeignKey(StandaloneWorkout, on_delete=models.CASCADE, blank=True, null=True)


class WorkoutHistory(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    series_workout = models.ForeignKey(SeriesWorkout, on_delete=models.CASCADE, blank=True, null=True)
    standalone_workout = models.ForeignKey(StandaloneWorkout, on_delete=models.CASCADE, blank=True, null=True)
    difficulty = models.ForeignKey(WorkoutDifficulty, on_delete=models.CASCADE, blank=True, null=True)

    repetition_number = models.PositiveIntegerField(blank=True, null=True)
    disk_position = models.ForeignKey(DiskPosition, on_delete=models.CASCADE, blank=True, null=True)
    workout_start_time = models.DateTimeField(blank=True, null=True)
    workout_end_time = models.DateTimeField(blank=True, null=True)
    burn_calories = models.PositiveIntegerField(blank=True, null=True)

    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)
