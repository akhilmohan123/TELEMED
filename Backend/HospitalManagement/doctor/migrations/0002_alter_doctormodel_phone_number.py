# Generated by Django 5.1 on 2024-09-10 17:37

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('doctor', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='doctormodel',
            name='phone_number',
            field=models.IntegerField(blank=True, max_length=12, null=True),
        ),
    ]
