import requests

from dotenv import load_dotenv
import os
# USER_SERVICE_URL = config('USER_SERVICE_URL')
# DOCTOR_SERVICE_URL = config('DOCTOR_SERVICE_URL')
# PATIENT_SERVICE_URL=config('PATIENT_SERVICE_URL')
ENVIRONMENT=os.getenv('ENVIRONMENT', 'local')

if ENVIRONMENT == 'production':
    APPOINTMENT_SERVICE_URL = "http://user-service:8003/"

else:

    APPOINTMENT_SERVICE_URL = "http://127.0.0.1:8003/"


def mark_appoitment_details(appointment_id):
    print("called the function ")
    try:
        response=requests.post(f"{APPOINTMENT_SERVICE_URL}/appointment/api/appointment-mark/{appointment_id}")
        print(response.json())
        print("after the response")
        if response.status_code==200:
            return response.json()
        else:
            return None
    except Exception as e:
        print(f"Error fetching the user details: {e}")
    return None

