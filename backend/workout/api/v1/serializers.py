from rest_framework import serializers

from workout.models import WorkoutGroup


class WorkoutGroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = WorkoutGroup
        fields = '__all__'
