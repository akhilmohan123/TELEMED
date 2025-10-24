from rest_framework import serializers
from .models import DoctorModel
class DoctorCreateSerializer(serializers.ModelSerializer):
     class Meta:
        model=DoctorModel
        fields = '__all__'
        extra_kwargs = {
            'user_id': {'read_only': True}  # Make user read-only in the serializer
        }
     def create(self, validated_data):
        # We don't need to handle user here, it's done in the view.
             profile = DoctorModel.objects.create(**validated_data)
             return profile

     def update(self, instance, validated_data):
        # No need to handle user here, it's handled by the view.
            for attr, value in validated_data.items():
                setattr(instance, attr, value)
                instance.save()
            return instance
class GetDoctorSerializer(serializers.ModelSerializer):
    ##user_email = serializers.EmailField(source='user.email', read_only=True)
    user_email=serializers.SerializerMethodField()
    class Meta:
        model = DoctorModel
        fields = ['id','user_id', 'speciality', 'license_no', 'organization_name', 'location', 'phone_number', 'experiance', 'available_status', 'image','user_email']

    def get_user_email(self,obj):
        return self.context.get('user_email')

class GetAllDoctorsSerializers(serializers.ModelSerializer):
    user_email = serializers.EmailField(source='user.email', read_only=True)
    first_name=serializers.CharField(source='user.first_name',read_only=True)
    last_name=serializers.CharField(source='user.last_name',read_only=True)

    class Meta:
        model=DoctorModel
        fields = ['id', 'speciality', 'license_no', 'organization_name', 'location', 'phone_number', 'experiance', 'available_status', 'image', 'user_email','first_name','last_name']
        
class GetSpeceficDoctorSerializer(serializers.ModelSerializer):
     
     class Meta:
        model=DoctorModel
        fields='__all__'

     