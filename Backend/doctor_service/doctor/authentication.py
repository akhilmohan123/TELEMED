import jwt
from django.conf import settings
from rest_framework import authentication
from rest_framework.exceptions import AuthenticationFailed
from django.contrib.auth import get_user_model
import os




def load_secret_file(filename):
    """
    Loads secret contents from /run/secrets in production.
    Falls back to /Backend/keys in local/dev environment.
    """

    ENVIRONMENT = os.getenv("ENVIRONMENT", "local")

    if ENVIRONMENT == "production":
        # Docker secret path
        secret_path = f"/app/keys/{filename}"
    else:
        print("inside the else")
        # Local: keys inside common Backend folder
        SERVICE_BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        PROJECT_ROOT = os.path.dirname(SERVICE_BASE)
        KEYS_DIR = os.path.join(PROJECT_ROOT, "keys")

        secret_path = os.path.join(KEYS_DIR, filename)

    if not os.path.exists(secret_path):
        raise FileNotFoundError(f"❌ Secret file not found: {secret_path}")

    if os.path.isdir(secret_path):
        raise IsADirectoryError(f"❌ Expected a file but found directory: {secret_path}")

    with open(secret_path, "r") as f:
        print(f"🔑 Loaded secret: {secret_path}")
        return f.read().strip()



# Load public key (automatically detects environment)
PUBLIC_KEY = load_secret_file('public.pem')

User = get_user_model()


class AuthServiceUser:
    """Represents an authenticated user for DRF"""

    def __init__(self, id, email):
        self.id = id
        self.email = email

    @property
    def is_authenticated(self):
        return True


class JWTAuthentication(authentication.BaseAuthentication):

    def authenticate(self, request):
        print("JWTAuthentication called")

        token = request.COOKIES.get("access_token")

        if not token:
            return None

        print("Extracted token:", token)

        try:
            payload = jwt.decode(token, PUBLIC_KEY, algorithms=["RS256"])
            print("Decoded payload:", payload)

            user = AuthServiceUser(payload.get("id"), payload.get("email"))
            return (user, token)

        except jwt.ExpiredSignatureError:
            raise AuthenticationFailed("Token expired")
        except jwt.DecodeError:
            raise AuthenticationFailed("Invalid token")
        except Exception as e:
            print("❌ Unexpected token error:", e)
            raise AuthenticationFailed("Invalid token")
