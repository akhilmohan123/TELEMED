from django.shortcuts import get_object_or_404
from rest_framework.views import APIView
from .serializers import DoctorCreateSerializer,GetDoctorSerializer,GetSpeceficDoctorSerializer
from rest_framework.exceptions import AuthenticationFailed
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated,AllowAny
from .authentication import JWTAuthentication
from .models import DoctorModel
from . models import DoctorModel
from rest_framework.response import Response
from rest_framework import status
from rest_framework.parsers import MultiPartParser, FormParser
import jwt
import requests
import uuid
class DoctorCreateView(generics.CreateAPIView, generics.UpdateAPIView):
    serializer_class = DoctorCreateSerializer
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]
    parser_classes = (MultiPartParser, FormParser)
    def get_object(self,user_id):
        try:
            return DoctorModel.objects.get(user_id=user_id)
        except DoctorModel.DoesNotExist:
            return None
    def create(self, request, *args, **kwargs):
        user_id=request.user.id#get the user id from the payload
        instance=self.get_object(user_id)
        print(request.data)
        if instance:
            ##if the user is there update the profile
            serializer=self.get_serializer(instance,data=request.data,partial=True)
            serializer.is_valid(raise_exception=True)
            serializer.save()
            return Response(serializer.data,status=status.HTTP_200_OK)
        else:
            #if the user is not there create a new profile
            serializer=self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            serializer.save(user_id=user_id)
            return Response(serializer.data,status=status.HTTP_201_CREATED)
        
        instance = self.get_object()
        # If the instance exists, update the profile instead of creating a new one


class GetDoctordata(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]    
    def get(self,request):
        print("Called the get view ")
        try:
            user = request.user.id # get the user id from the payload 
            print("user is =====",user)
            user_email=getattr(request.user,'email',None)
            print("user_email is =====",user_email)
            print("request.user.email is =====",request.user.email)

            try:
                print("before the the doctor fetch")
                doctor = DoctorModel.objects.get(user_id=user)
                print("After the doctor fetch")
                print("doctor is =====",doctor)
                print(doctor)
            except DoctorModel.DoesNotExist:
                return Response({"error": "Doctor profile not found"}, status=404)
            # Serialize the patient profile
            serializer = GetDoctorSerializer(doctor,context={'user_email':user_email})
            print("serializer is",serializer.data)
            if not serializer.data:
                raise ValueError("No serializer data")
            return Response(serializer.data, status=200)
        except jwt.ExpiredSignatureError:
            raise AuthenticationFailed("Token has expired")
        except jwt.DecodeError:
            raise AuthenticationFailed("Invalid token")
        except Exception as e:
            return Response({"error": str(e)}, status=500)
    

class GetAllDoctors(APIView):
    def get(self, request):
        try:
            # 1️ Fetch all doctors
            doctors = DoctorModel.objects.all()
            doctor_data = DoctorCreateSerializer(doctors, many=True).data

            # 2️ Fetch all users from Auth Service
            auth_service_url = "http://127.0.0.1:8000/users/api/users"
            response = requests.get(auth_service_url)
            user_data = response.json()

            #  Convert user data to a dict for quick lookup
            user_lookup = {str(u["id"]): u for u in user_data}
            print("user lookup is ",user_lookup)
            # 4 Merge doctor info with corresponding user info
            merged_data = []
            for doc in doctor_data:
                doc_id=str(doc["user_id"])
                doc_id=doc_id.split('-')[-1]
                print("doctor user id is ",int(doc_id))
                user = user_lookup.get(str(int(doc_id)))
                print(doc["user_id"],"corresponding user is ",user)

                merged = {
                    **doc,
                    "user_email": user["email"] if user else None,
                    "first_name": user["first_name"] if user else None,
                    "last_name": user["last_name"] if user else None,
                }
                merged_data.append(merged)

            return Response(merged_data, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class GetSpeceficDoctor(APIView):
    permission_classes = [AllowAny]
    def get(self, request, doctor_id):
        try:
            # Fetch the specific doctor by ID
            doctor = get_object_or_404(DoctorModel, id=doctor_id)
            serializer = GetSpeceficDoctorSerializer(doctor)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class GetSpeceficDoctorid(APIView):
    permission_classes=[AllowAny]
    def get(self,request,user_id):
        try:
            user_id=int(user_id)
            #fetch the specefic doctor by user id 
            user_id=uuid.UUID(int=user_id)
            doctor=DoctorModel.objects.get(user_id=user_id)
            serializer=GetSpeceficDoctorSerializer(doctor)
            return Response(serializer.data,status=status.HTTP_200_OK)
        except DoctorModel.DoesNotExist:
            return Response({"error":"Doctor profile not found"},status=status.HTTP_404_NOT_FOUND)
        except Exception as e:  
            return Response({"error":str(e)},status=status.HTTP_500_INTERNAL_SERVER_ERROR)
