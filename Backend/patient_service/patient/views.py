from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import PatientProfile
from .serializer import PatientProfileSerializer,GetPatientProfileSerializer
from .authentication import JWTAuthentication
from rest_framework.views import APIView
from rest_framework.exceptions import AuthenticationFailed
import jwt
class PatientProfileCreateUpdateView(generics.CreateAPIView, generics.UpdateAPIView):
    serializer_class = PatientProfileSerializer
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]

    def get_object(self):
        try:
            return PatientProfile.objects.get(user=self.request.user.id)
        except PatientProfile.DoesNotExist:
            return None

    def create(self, request, *args, **kwargs):
        instance = self.get_object()

        # If the instance exists, update the profile instead of creating a new one
        if instance:
            return self.update(request, *args, **kwargs)

        # Otherwise, create a new profile
        serializer = self.get_serializer(data=request.data)
        print(serializer.is_valid())
        if serializer.is_valid():
            self.perform_create(serializer)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            print(serializer.errors)
        # return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def perform_create(self, serializer):
        print(serializer)
        serializer.save(user=self.request.user.id)  # Assign the authenticated user
class GetprofilePatient(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]

    def get(self, request):

        try:
            user = request.user.id
            print("Authenticated user ID:", user)  # Print the authenticated user ID for debugging

            # Attempt to retrieve the patient's profile
            try:
                patient = PatientProfile.objects.get(user=user)
            except PatientProfile.DoesNotExist:
                return Response({"error": "Patient profile not found"}, status=404)

            # Serialize the patient profile
            serializer = GetPatientProfileSerializer(patient)
            if not serializer.data:
                raise ValueError("No serializer data")

            return Response(serializer.data, status=200)

        except jwt.ExpiredSignatureError:
            raise AuthenticationFailed("Token has expired")
        except jwt.DecodeError:
            raise AuthenticationFailed("Invalid token")
        except Exception as e:
            return Response({"error": str(e)}, status=500)