from rest_framework import serializers
from .models import Appointmentmodel,Medicine
from .utils import get_doctor_details,get_patient_details,get_user_details
class AppointmentSerializers(serializers.ModelSerializer):
    doctor_name = serializers.SerializerMethodField()
    doctor_id = serializers.IntegerField()
    class Meta:
      model=Appointmentmodel
      fields=["id","doctor_id","doctor_name","date","time","note","referrence_no","refer_doctor_id","status","amount"]
      read_only_fields=["patient_id","status"]
      print("the class is called ")
    def get_doctor_name(self, obj):
        print("the doctor name method is called ")
        doctor_data = get_doctor_details(obj.doctor_id)
        if doctor_data and doctor_data.get("user"):
           user_data = doctor_data.get('user')
           if user_data:
              return f"{user_data.get('first_name', '')} {user_data.get('last_name', '')}"
        return "Doctor not found"
    def validate(self,data):
        print("the  validate is called with data",data)
        date=data.get("date")
        time=data.get("time")
        doctor=data.get("doctor")
        if Appointmentmodel.objects.filter(date=date,time=time,doctor_id=doctor).exists():
            raise serializers.ValidationError("There is an Appointment for specefic date")

        return data
class GetdoctorAppointmentserializer(serializers.ModelSerializer):
    doctor_name = serializers.SerializerMethodField()
    patient_name=serializers.SerializerMethodField()

    class Meta:
        model = Appointmentmodel
        fields = ["id","patient_id", "date", "time", "note", "doctor_name", "status","patient_name","referrence_no"]

    def get_doctor_name(self, obj):
        doctor_data = get_doctor_details(obj.doctor_id)
        if doctor_data:
           user_data = doctor_data.get('user')
           if user_data:
              return f"{user_data.get('first_name', '')} {user_data.get('last_name', '')}"
        return "Doctor not found"
    def get_patient_name(self, obj):
        print("before calling the patient name ")
        print("the objects are ",obj.patient_id)
        patient_data = get_patient_details(obj.patient_id)
        print("the patient name is =====",patient_data)
        if patient_data:
            user_data = patient_data.get('user')
            return f"{user_data.get('first_name', '')} {user_data.get('last_name', '')}"
        return "Patient not found"
class GetspeceficSerializer(serializers.ModelSerializer):
    doctor_name = serializers.SerializerMethodField()
    patient_name=serializers.SerializerMethodField()
    medical_history=serializers.SerializerMethodField()
    class Meta:
        model=Appointmentmodel
        fields=["id","patient_id", "date", "time", "note", "doctor_name", "status","patient_name","medical_history","refer_doctor_id"]
    def get_doctor_name(self, obj):
        doctor_data = get_doctor_details(obj.doctor_id)
        if doctor_data:
           user_data = doctor_data.get('user')
           if user_data:
              return f"{user_data.get('first_name', '')} {user_data.get('last_name', '')}"
    def get_patient_name(self, obj):
        patient_data = get_patient_details(obj.patient_id)
        if patient_data:
            user_data = patient_data.get('user')
            return f"{user_data.get('first_name', '')} {user_data.get('last_name', '')}"
    def get_medical_history(self, obj):
        patient_data = get_patient_details(obj.patient_id)
        if patient_data:
            return patient_data.get('medical_history', 'No medical history')
        return "No medical history"
class EditPatientSerializer(serializers.ModelSerializer):
    class Meta:
        model=Appointmentmodel
        fields="__all__"
class AddMedicineSerializer(serializers.ModelSerializer):
    class Meta:
        model=Medicine
        fields="__all__"
    def create(self,validated_data):
       
        data=Medicine.objects.create(**validated_data)
        
        return data
class GetMedicineSerializer(serializers.ModelSerializer):
    doctor_name = serializers.SerializerMethodField()
    date=serializers.SerializerMethodField()
    class Meta:
        model=Medicine
        fields=["name","doctor_name","dosage","frequency","duration","additional_notes","date"]
    def get_doctor_name(self, obj):
        print("get doctor data is ====",obj.appointment.doctor_id)
        doctor_data = get_doctor_details(obj.appointment.doctor_id)
        if doctor_data:
           user_data = doctor_data.get('user')
           if user_data:
              return f"{user_data.get('first_name', '')} {user_data.get('last_name', '')}"
    def get_date(self,obj):
        print(obj.appointment.date)
        return obj.appointment.date
class GetSpeceficMedicineSerializer(serializers.ModelSerializer):
    class Meta:
        model=Medicine
        fields='__all__'
class GetReferAppointmentSerializer(serializers.ModelSerializer):
    doctor_name=serializers.SerializerMethodField()
    refer_doctor_name=serializers.SerializerMethodField()
    special=serializers.SerializerMethodField()
    class Meta:
        model=Appointmentmodel
        fields=["id","doctor_name","date","time","note","refer_doctor_name","special","refer_doctor_id"]
    def get_doctor_name(self, obj):
        doctor_data = get_doctor_details(obj.doctor_id)
        if doctor_data:
           user_data = doctor_data.get('user')
           if user_data:
              return f"{user_data.get('first_name', '')} {user_data.get('last_name', '')}"
    def get_refer_doctor_name(self, obj):
        refer_doctor_data = get_doctor_details(obj.refer_doctor_id)
        if refer_doctor_data:
            user_data = refer_doctor_data.get('user')
            return f"{user_data.get('first_name', '')} {user_data.get('last_name', '')}"
        return "Refer doctor not found"
    def get_special(self, obj):
        refer_doctor_data = get_doctor_details(obj.refer_doctor_id)
        if refer_doctor_data:
            return refer_doctor_data.get('speciality', '')
        return ''