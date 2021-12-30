# Generated by Django 2.2.25 on 2021-12-22 01:23

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='WorkoutGroup',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('workout_type', models.CharField(blank=True, choices=[(0, 'Series'), (1, 'Challange'), (2, 'Testing')], max_length=255, null=True, verbose_name='Workout Type')),
                ('workout_name', models.CharField(blank=True, max_length=255, null=True, verbose_name='workout Name')),
                ('video_tutorial', models.FileField(blank=True, null=True, upload_to='workout_tutorials')),
                ('need_subscription', models.BooleanField(default=False)),
                ('time', models.PositiveIntegerField(blank=True, null=True)),
                ('repetition_number', models.PositiveIntegerField(blank=True, null=True)),
                ('disk_position', models.CharField(blank=True, max_length=255, null=True)),
                ('weight_shift', models.CharField(blank=True, max_length=255, null=True)),
                ('days', models.PositiveIntegerField(blank=True, null=True)),
                ('rest_days', models.PositiveIntegerField(blank=True, null=True)),
                ('plan', models.BooleanField(default=False)),
                ('metrics', models.BooleanField(default=False)),
            ],
        ),
    ]
