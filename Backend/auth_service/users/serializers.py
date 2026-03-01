from rest_framework import serializers
from rest_framework.exceptions import AuthenticationFailed
from . models import User
import bcrypt

class RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model=User
        fields = [
            'email',
            'username',
            'first_name',
            'last_name',
            'password',
            'role',
        ]
        extra_kwargs = {'password': {'write_only': True}}
    def create(self, validated_data):
        return User.objects.create_user(
        email=validated_data['email'],
        username=validated_data['username'],
        first_name=validated_data['first_name'],
        last_name=validated_data['last_name'],
        role=validated_data['role'],
        password=validated_data['password'],
    )

class LoginSerializer(serializers.Serializer):
        print("serializer called")
        email = serializers.CharField(max_length=255)
        password=serializers.CharField(write_only=True)
        def validate(self,data):
            email=data.get('email')
            password=data.get('password')
            user=User.objects.filter(email=email).first()
            if user:
                print(f"User's hashed password: {user.password}")
                print(f"Password check result: {user.check_password(password) if user else 'No user found'}")
            
            if user is None:
               raise AuthenticationFailed('User Not found')
            if not user.check_password(password):
               raise AuthenticationFailed(password)
           
            return user
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model=User
        fields='__all__'

class PublicSerializer(serializers.ModelSerializer):
    class Meta:
        model=User
        fields=['id','first_name','last_name','email']