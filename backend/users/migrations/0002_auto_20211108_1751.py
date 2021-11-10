# Generated by Django 2.2.20 on 2021-11-08 17:51

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0001_initial'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='user',
            name='name',
        ),
        migrations.AddField(
            model_name='user',
            name='height',
            field=models.CharField(blank=True, max_length=255, null=True, verbose_name='Height'),
        ),
        migrations.AddField(
            model_name='user',
            name='weight',
            field=models.CharField(blank=True, max_length=255, null=True, verbose_name='Weight'),
        ),
    ]