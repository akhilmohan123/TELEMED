from rest_framework import serializers
from .models import PatientProfile
class PatientProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = PatientProfile
        fields = '__all__'
        read_only_fields = ['id', 'user']

    def create(self, validated_data):
        print("create patientprofile serializer called")
        # We don't need to handle user here, it's done in the view.
        profile = PatientProfile.objects.create(**validated_data)
        return profile

    def update(self, instance, validated_data):
        # No need to handle user here, it's handled by the view.
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance
class GetPatientProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = PatientProfile
        fields=['phone_number','date_of_birth','address','medical_history','additional_information']
