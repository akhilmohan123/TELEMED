import jwt
from django.conf import settings
from rest_framework import authentication
from rest_framework.exceptions import AuthenticationFailed
from django.contrib.auth import get_user_model
from dotenv import load_dotenv
import os


load_dotenv()

ENVIRONMENT = os.getenv("ENVIRONMENT", "local")
  # e.g., doctor / patient / admin
print(f"ENVIRONMENT = {ENVIRONMENT}")


# Load correct key path based on environment
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
User = get_user_model()

class JWTAuthentication(authentication.BaseAuthentication):
    def authenticate(self, request):
        # auth_header = request.headers.get('Authorization')
        
        # if not auth_header:
        #     return None
        print("JWTAuthentication called")

        try:
            print(request.COOKIES)
            token = request.COOKIES.get('access_token')
            print("Extracted token:", token)
            print("private key is there ====",private_key)
            if not token:
                return None
            print("decoding started")
            payload = jwt.decode(token, public_key, algorithms=["RS256"])
            
            user = User.objects.get(id=payload['id'])
            print("user is ======",user)
            return (user, token)
        except jwt.ExpiredSignatureError as e:
            print("1",e)
            return None
        except jwt.DecodeError as e:
            print("2",e)
            return None
        except Exception as e:
            print("3",e)
            return None
        except User.DoesNotExist as e:
            print("4",e)
            return None
