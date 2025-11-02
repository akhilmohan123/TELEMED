import requests
from decouple import config

import os
# USER_SERVICE_URL = config('USER_SERVICE_URL')
# DOCTOR_SERVICE_URL = config('DOCTOR_SERVICE_URL')
# PATIENT_SERVICE_URL=config('PATIENT_SERVICE_URL')
USER_SERVICE_URL = "http://127.0.0.1:8000/"
DOCTOR_SERVICE_URL = "http://127.0.0.1:8001/"
PATIENT_SERVICE_URL="http://127.0.0.1:8002/"

def get_user_details(user_id):
    print("called the function ")
    try:
        response=requests.get(f"{USER_SERVICE_URL}/users/api/get-user/{user_id}")
        print(response.json())
        print("after the response")
        if response.status_code==200:
            return response.json()
        else:
            return None
    except Exception as e:
        print(f"Error fetching the user details: {e}")
    return None


def get_doctor_details(doctor_id):
    try:
        response=requests.get(f"{DOCTOR_SERVICE_URL}/doctor/api/get-doctor/{doctor_id}/")
        if response.status_code==200:
            doctor_data= response.json()
            user_id=doctor_data.get('user_id')
            user_id=user_id.split("-")
            user_id=user_id[-1]
            print("user id parts are ",user_id)
            user_id=int(user_id)
            print("user id in doctor details is ",user_id)
            print("doctor data is ",doctor_data)
        else:
            doctor_data=None
    except Exception as e:
        print(f"Error fetching the doctor details: {e}")
    
    #get the user data
    try:
       response=requests.get(f"{USER_SERVICE_URL}/users/api/get-user/{user_id}")
       if response.status_code==200:
           user_data=response.json()
           print("user data in doctor details is ",user_data)
           if doctor_data is not None:
               doctor_data['user']=user_data
            
           return doctor_data
       else:
           return None
    except Exception as e:
        print(f"Error fetching the user details: {e}")

def get_patient_details(patient_id):
    try:
        response=requests.get(f"{PATIENT_SERVICE_URL}/patient/api/get-patient/{patient_id}")
        if response.status_code==200:
            patient_data= response.json()
            print("patient data is =====",patient_data)
            user_id=patient_data.get('user')
            user_id=user_id.split("-")
            user_id=user_id[-1]
            user_id=int(user_id)
            print("user id is ====",user_id)
        else:
            print("inside the else ")
            patient_data=None
    except Exception as e:
        print(f"Error fetching the patient details: {e}")
    
    try:
         response=requests.get(f"{USER_SERVICE_URL}/users/api/get-user/{user_id}")
         if response.status_code==200:
              print("the response is successs ")
              user_data=response.json()
              if patient_data is not None:
                patient_data['user']=user_data
                print("the patient nameis =====",user_data)
              return patient_data
         else:
              print
              return None
    except Exception as e:
        print(f"Error fetching the user details: {e}")
    return None



##get the patient id based on the user id 

def get_patient_id_from_user(user_id):
    try:
        print("called the get patient id from user id function with user id =",user_id)
        response=requests.get(f"{PATIENT_SERVICE_URL}/patient/api/get-user-id/{user_id}/")
        if response.status_code==200:
            patient_data=response.json()
            patient_id=patient_data.get('id')
            print("patient id from the user id is ===",patient_id)
            return patient_id
        else:
            return None
    except Exception as e:
        print(f"Error fetching the patient id from user id: {e}")
    return None


def get_doctor_id_from_user(user_id):
    try:
        response=requests.get(f"{DOCTOR_SERVICE_URL}/doctor/api/get-user-id-doctor/{user_id}/")
        print(response.json())
        if response.status_code==200:
            doctor_id=response.json().get('id')
            return doctor_id
        else:
            return None
    except Exception as e:
        print(f"Error fetching the doctor id from the user {e}")
    return None


##api call for updating the doctor status from avilable to booked 

def change_doctor_status(id):
    try:
        response=requests.post(f"{DOCTOR_SERVICE_URL}/doctor/api/change-doctor-status/{id}/")
        if response.status_code==200:
            print("it has the status 200 doctor api status change")
            return True
        else:
            print("it has the status code not 200")
            return False
    except Exception as e:
        print(f"Error in fetching the doctor status api change {e}")
        return False