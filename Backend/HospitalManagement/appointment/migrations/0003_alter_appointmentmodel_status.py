# Generated by Django 5.1 on 2024-09-17 03:48

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('appointment', '0002_appointmentmodel_status'),
    ]

    operations = [
        migrations.AlterField(
            model_name='appointmentmodel',
            name='status',
            field=models.CharField(choices=[('completed', 'completed'), ('Refer', 'Refer')], max_length=20, null=True),
        ),
    ]
