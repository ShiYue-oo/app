# Generated by Django 4.2.13 on 2024-06-20 12:56

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('game', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='player',
            name='openid',
            field=models.CharField(blank=True, default='', max_length=50, null=True),
        ),
    ]
