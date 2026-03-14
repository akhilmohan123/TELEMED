import jwt
from django.utils import timezone
import datetime
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from rest_framework.exceptions import AuthenticationFailed
from rest_framework.response import Response
from .models import User
from dotenv import load_dotenv
import os
load_dotenv()
if os.getenv('ENVIRONMENT', 'local') != 'production':
    from dotenv import load_dotenv
ENVIRONMENT=os.getenv('ENVIRONMENT', 'local')
print(f"ENVIRONMENT = {ENVIRONMENT}")

##change the pem taking path based on your environment

if ENVIRONMENT == "production":

    secret_path_private = f"/app/keys/private.pem"
    secret_path_public =  f"/app/keys/public.pem"
    print(f"🔑 Loaded secret key from: {secret_path_private} and {secret_path_public}")

else:
    print("🔧 Loading development private/public keys")
    SERVICE_BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    PROJECT_ROOT = os.path.dirname(SERVICE_BASE)
    KEYS_DIR = os.path.join(PROJECT_ROOT, "keys")

    secret_path_private = os.path.join(KEYS_DIR, "private.pem")
    secret_path_public = os.path.join(KEYS_DIR, "public.pem")


# Read key files
with open(secret_path_private, "r") as f:
    private_key = f.read()

with open(secret_path_public, "r") as f:
    public_key = f.read()
def generate_tokens(user):
    print("private key is ====",private_key)
    access_payload={
        "id":user.id,
        "email":user.email,
        "exp":timezone.now()+datetime.timedelta(minutes=15),
        "iat":timezone.now()
    }
    refresh_payload={
        "id":user.id,
        "exp":timezone.now()+datetime.timedelta(days=7),
        "iat":timezone.now()
    }

    access_token=jwt.encode(access_payload,private_key,algorithm="RS256")
    refresh_token=jwt.encode(refresh_payload,private_key,algorithm="RS256")

    return access_token,refresh_token

class RefreshTokenView(APIView):
    permission_classes = [AllowAny]
    authentication_classes = [] 
    def post(self,request):
        refresh_token=request.COOKIES.get('refresh_token')
        print("refresh token is ===",refresh_token)
        if not refresh_token:
            print("inside the none")
            return Response(
                {"error": "Refresh token missing. Please log in again."},
                status=401
            )
        try:
            payload=jwt.decode(refresh_token,private_key,algorithms=["RS256"])
            user=User.objects.get(id=payload['id'])
        except jwt.ExpiredSignatureError:
            raise AuthenticationFailed('Refresh token has expired')
        except jwt.DecodeError:
            raise AuthenticationFailed('Invalid token')
        
        access_token,_=generate_tokens(user)
        response=Response()
        response.set_cookie(key='access_token',value=access_token,httponly=True,secure=False,samesite='Strict')
        response.data={
            "message":"New access token issued"
        }
        return response

