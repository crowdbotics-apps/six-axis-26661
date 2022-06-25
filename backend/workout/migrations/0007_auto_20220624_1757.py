# Generated by Django 2.2.25 on 2022-06-24 17:57

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('workout', '0006_workoutdifficulty'),
    ]

    operations = [
        migrations.AlterField(
            model_name='seriesworkout',
            name='standalone_workouts',
            field=models.ManyToManyField(blank=True, null=True, through='workout.StandaloneWorkoutSetup', to='workout.StandaloneWorkout'),
        ),
    ]