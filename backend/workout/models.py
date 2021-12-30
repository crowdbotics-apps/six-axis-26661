from django.db import models
from django.utils.translation import ugettext_lazy as _


# Create your models here.

class WorkoutGroup(models.Model):
    SERIES = 0
    CHALLANGE = 1
    TESTING = 2
    WORKOUT_TYPE_OPTIONS = [
        (SERIES, 'Series'),
        (CHALLANGE, 'Challange'),
        (TESTING, 'Testing'),
    ]

    workout_type = models.CharField(_("Workout Type"), choices=WORKOUT_TYPE_OPTIONS, blank=True, null=True,
                                     max_length=255)
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
