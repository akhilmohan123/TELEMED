import jwt
from django.conf import settings
from rest_framework import authentication
from rest_framework.exceptions import AuthenticationFailed
from django.contrib.auth import get_user_model
from dotenv import load_dotenv
import os
load_dotenv()
if os.getenv('ENVIRONMENT', 'local') != 'production':
    from dotenv import load_dotenv
ENVIRONMENT=os.getenv('ENVIRONMENT', 'local')
print(f"ENVIRONMENT = {ENVIRONMENT}")

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
class AuthServiceUser:
    """
    Represents a user from auth service for DRF
    """
    def __init__(self, id, email):
        self.id = id
        self.email = email

    @property
    def is_authenticated(self):
        return True
class JWTAuthentication(authentication.BaseAuthentication):
    
    def authenticate(self, request):
        # auth_header = request.headers.get('Authorization')
        
        # if not auth_header:
        #     return None
        print("JWTAuthentication called")

        try:
            token = request.COOKIES.get('access_token')
            print("Extracted token:", token)
            if not token:
                return None
            payload = jwt.decode(token, public_key, algorithms=["RS256"])
            print(payload)
            id=payload.get("id")
            email=payload.get("email")
            user = AuthServiceUser(id, email)
            return (user, token)
        except jwt.ExpiredSignatureError:
            print("❌ Token expired")
            raise AuthenticationFailed("Token expired")
        except jwt.DecodeError:
            print("❌ Invalid token")
            raise AuthenticationFailed("Invalid token")
        except Exception as e:
            print("❌ Error decoding token:", e)
            raise AuthenticationFailed("Invalid token")