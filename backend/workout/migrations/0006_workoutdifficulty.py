# Generated by Django 2.2.25 on 2022-06-24 16:56

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('workout', '0005_auto_20220624_1653'),
    ]

    operations = [
        migrations.CreateModel(
            name='WorkoutDifficulty',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('difficulty_name', models.CharField(max_length=255)),
                ('seconds', models.PositiveIntegerField()),
            ],
        ),
    ]