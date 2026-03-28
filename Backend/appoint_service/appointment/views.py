from django.shortcuts import render, get_object_or_404
from rest_framework.views import APIView
from .serializers import (
    AppointmentSerializers, GetdoctorAppointmentserializer, GetspeceficSerializer,
    EditPatientSerializer, AddMedicineSerializer, GetMedicineSerializer,
    GetSpeceficMedicineSerializer, GetReferAppointmentSerializer
)
from rest_framework.permissions import IsAuthenticated, AllowAny
from .authentication import JWTAuthentication
from rest_framework.response import Response
from rest_framework import status
from .models import Appointmentmodel, Medicine
from .utils import (
    get_user_details, get_doctor_details, get_patient_details,
    get_patient_id_from_user, get_doctor_id_from_user, change_doctor_status
)
import jwt
from rest_framework.exceptions import AuthenticationFailed
import traceback


# ========================= APPOINTMENT VIEW =========================

class Appointmentview(APIView):
    serializer_class = AppointmentSerializers
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]

    def get(self, request, id=None, *args, **kwargs):
        try:
            if id:
                appointments = get_object_or_404(Appointmentmodel, id=id)
                serializer = self.serializer_class(appointments)
                return Response(serializer.data, status=status.HTTP_200_OK)

            user = request.user.id
            user_data = get_user_details(user) or {}
            patient = get_patient_id_from_user(user)

            appontments_data = Appointmentmodel.objects.filter(patient_id=patient).first()

            if not appontments_data:
                return Response({"message": "No appointments found"}, status=404)

            doctor = get_doctor_details(appontments_data.doctor_id)

            if user_data.get('is_staff'):
                appointments = Appointmentmodel.objects.all()

            elif user_data.get('role') == 2:
                appointments = Appointmentmodel.objects.filter(
                    doctor_id=appontments_data.doctor_id
                )

            elif user_data.get('role') == 1:
                appointments = Appointmentmodel.objects.filter(patient_id=patient)

            else:
                return Response({"error": "Invalid role"}, status=400)

            serializer = self.serializer_class(appointments, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)

        except jwt.ExpiredSignatureError:
            raise AuthenticationFailed("Token expired")
        except Exception as e:
            traceback.print_exc()
            return Response({"error": str(e)}, status=500)

    def post(self, request, id):
        try:
            doctor = get_doctor_details(id)

            if not doctor:
                return Response({"error": "Doctor not found"}, status=404)

            if doctor.get('available_status') in ('available', 'Available'):

                data = request.data.copy()
                data['doctor_id'] = doctor.get('id')
                data['amount'] = doctor.get('amount')

                serializer = self.serializer_class(data=data)

                doctor_status = change_doctor_status(doctor.get('id'))

                if serializer.is_valid() and doctor_status:
                    patient_id = get_patient_id_from_user(request.user.id)
                    serializer.save(patient_id=patient_id)
                    return Response(serializer.data, status=status.HTTP_201_CREATED)

                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

            return Response({"message": "Doctor not available"}, status=400)

        except Exception as e:
            traceback.print_exc()
            print(f"Execption is === {str(e)}")
            return Response({"error": str(e)}, status=500)

    def update(self, request, *args, **kwargs):
        try:
            instance = self.get_object()
            serializer = self.serializer_class(instance=instance, data=request.data)

            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)

            return Response(serializer.errors, status=400)

        except Exception as e:
            traceback.print_exc()
            return Response({"error": str(e)}, status=500)


# ========================= DELETE =========================

class DeleteAppointment(APIView):
    permission_classes = [AllowAny]
    authentication_classes = [JWTAuthentication]

    def delete(self, request, id):
        try:
            appointment = get_object_or_404(Appointmentmodel, id=id)
            appointment.delete()
            return Response(status=status.HTTP_200_OK)
        except Exception as e:
            traceback.print_exc()
            return Response({"error": str(e)}, status=500)


# ========================= DOCTOR APPOINTMENTS =========================

class GetDoctorAppointment(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]

    def get(self, request):
        try:
            user = request.user.id
            doctor_id = get_doctor_id_from_user(user)

            appointments = Appointmentmodel.objects.filter(doctor_id=doctor_id)

            if not appointments.exists():
                return Response({"message": "No appointments found"}, status=404)

            serializer = GetdoctorAppointmentserializer(appointments, many=True)
            return Response(serializer.data)

        except jwt.ExpiredSignatureError:
            raise AuthenticationFailed("Token expired")
        except jwt.DecodeError:
            raise AuthenticationFailed("Invalid token")
        except Exception as e:
            traceback.print_exc()
            return Response({"error": str(e)}, status=500)


# ========================= SPECIFIC PATIENT =========================

class GetSpeceficPatient(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]

    def get(self, request, id):
        try:
            patient = get_object_or_404(Appointmentmodel, id=id)
            serializer = GetspeceficSerializer(patient)
            return Response(serializer.data)
        except Exception as e:
            traceback.print_exc()
            return Response({"error": str(e)}, status=500)


# ========================= EDIT =========================

class EditDoctorView(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]

    def put(self, request, id):
        try:
            appointment = Appointmentmodel.objects.get(id=id)

            new_status = request.data.get('status')
            new_refer = request.data.get('refer')

            if new_refer:
                refer = get_doctor_details(new_refer)
                if refer:
                    appointment.refer_doctor_id = new_refer

            if new_status:
                appointment.status = new_status

            appointment.save()

            serializer = EditPatientSerializer(appointment)
            return Response(serializer.data)

        except Appointmentmodel.DoesNotExist:
            return Response({"error": "Appointment not found"}, status=404)
        except Exception as e:
            traceback.print_exc()
            return Response({"error": str(e)}, status=500)


# ========================= MEDICINE =========================

class AddMedicineViews(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]

    def post(self, request):
        try:
            serializer = AddMedicineSerializer(data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)

            return Response(serializer.errors, status=400)

        except Exception as e:
            traceback.print_exc()
            return Response({"error": str(e)}, status=500)


class GetMedicineView(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]

    def get(self, request):
        try:
            patient = get_patient_id_from_user(request.user.id)

            appointments = Appointmentmodel.objects.filter(patient_id=patient)

            medicine_list = []
            for appointment in appointments:
                medicines = Medicine.objects.filter(appointment=appointment)
                medicine_list.extend(medicines)

            serializer = GetMedicineSerializer(medicine_list, many=True)
            return Response(serializer.data)

        except Exception as e:
            traceback.print_exc()
            return Response({"error": str(e)}, status=500)


class GetSpeceficMedicine(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]

    def get(self, request, id):
        try:
            medicine = Medicine.objects.get(id=id)
            serializer = GetMedicineSerializer(medicine)
            return Response(serializer.data)
        except Exception as e:
            traceback.print_exc()
            return Response({"error": str(e)}, status=500)


# ========================= REFER =========================

class GetReferAppointment(APIView):
    def get(self, request):
        try:
            user = request.user.id
            patient_id = get_patient_id_from_user(user)

            appointment = Appointmentmodel.objects.get(
                patient_id=patient_id,
                refer_doctor_id__isnull=False
            )

            serializer = GetReferAppointmentSerializer(appointment)
            return Response(serializer.data)

        except Exception as e:
            traceback.print_exc()
            return Response({"error": str(e)}, status=500)


# ========================= PAYMENT =========================

class Appointmentmarkview(APIView):
    permission_classes = [AllowAny]
    authentication_classes = [JWTAuthentication]

    def post(self, request, id):
        try:
            appointment = get_object_or_404(Appointmentmodel, id=id)
            appointment.payment_status = 'paid'
            appointment.save()
            return Response({"message": "Appointment marked as paid"})
        except Exception as e:
            traceback.print_exc()
            return Response({"error": str(e)}, status=500)


class AppointmentStatusmarkview(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]

    def post(self, request, id):
        try:
            appointment = get_object_or_404(Appointmentmodel, id=id)
            appointment.status = 'completed'
            appointment.save()
            return Response({"message": "Completed"})
        except Exception as e:
            traceback.print_exc()
            return Response({"error": str(e)}, status=500)


# ========================= PING =========================

class AppointPing(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        try:
            return Response({"message": "Pinged"})
        except Exception:
            return Response({"message": "Error"}, status=500)