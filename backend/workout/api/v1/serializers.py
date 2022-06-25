from rest_framework import serializers

from workout.models import WorkoutGroup, WorkoutDifficulty, StandaloneWorkout, SeriesWorkout, StandaloneWorkoutSetup, \
    WorkoutHistory


class WorkoutGroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = WorkoutGroup
        fields = '__all__'


class WorkoutDifficultySerializer(serializers.ModelSerializer):
    class Meta:
        model = WorkoutDifficulty
        fields = '__all__'


class StandaloneWorkoutSerializer(serializers.ModelSerializer):
    class Meta:
        model = StandaloneWorkout
        fields = '__all__'


class StandaloneWorkoutSetupSerializer(serializers.ModelSerializer):
    id = serializers.ReadOnlyField(source='standalone_workout.id')
    workout_name = serializers.ReadOnlyField(source='standalone_workout.workout_name')
    video_tutorial = serializers.FileField(source='standalone_workout.video_tutorial', default=None)

    class Meta:
        model = StandaloneWorkoutSetup
        fields = ('id', 'workout_name', 'video_tutorial', 'repetition_number', 'disk_position',)


class SeriesWorkoutSerializer(serializers.ModelSerializer):
    standalone_workouts = StandaloneWorkoutSetupSerializer(source='standaloneworkoutsetup_set', many=True,
                                                           read_only=True)

    class Meta:
        model = SeriesWorkout
        fields = '__all__'


class WorkoutHistorySerializer(serializers.ModelSerializer):

    class Meta:
        model = WorkoutHistory
        fields = '__all__'
