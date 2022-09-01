from django.contrib import admin

# Register your models here.
from workout.models import WorkoutGroup, WorkoutDifficulty, StandaloneWorkout, StandaloneWorkoutSetup, SeriesWorkout, \
    DiskPosition, WorkoutHistory

admin.site.register(WorkoutGroup)
admin.site.register(DiskPosition)
admin.site.register(WorkoutDifficulty)
admin.site.register(StandaloneWorkout)
admin.site.register(WorkoutHistory)


class StandaloneWorkoutSetupInline(admin.TabularInline):
    model = StandaloneWorkoutSetup
    # list_display = ["name"]


class SeriesWorkoutAdmin(admin.ModelAdmin):
    model = SeriesWorkout
    # list_display = ["name"]
    # search_fields = ["name"]
    inlines = [
        StandaloneWorkoutSetupInline,
    ]


admin.site.register(SeriesWorkout, SeriesWorkoutAdmin)
