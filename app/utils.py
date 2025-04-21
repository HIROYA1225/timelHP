import boto3
import qrcode
import hmac
import hashlib
import base64
import json
import time
from django.conf import settings
from io import BytesIO

def cognito_signup(email, password, name, gender, birthdate):
    client = boto3.client('cognito-idp', region_name=settings.AWS_REGION)
    response = client.sign_up(
        ClientId=settings.COGNITO_CLIENT_ID,
        Username=email,
        Password=password,
        UserAttributes=[
            {'Name': 'email', 'Value': email},
            {'Name': 'name', 'Value': name},
            {'Name': 'gender', 'Value': gender},  # male / female など
            {'Name': 'birthdate', 'Value': birthdate},  # '1994-08-20'
        ]
    )
    return response

def cognito_login(email, password):
    client = boto3.client('cognito-idp', region_name=settings.AWS_REGION)
    response = client.admin_initiate_auth(
        UserPoolId=settings.COGNITO_USER_POOL_ID,
        ClientId=settings.COGNITO_CLIENT_ID,
        AuthFlow='ADMIN_NO_SRP_AUTH',
        AuthParameters={
            'USERNAME': email,
            'PASSWORD': password
        }
    )
    return response['AuthenticationResult']  # ここにid_token, access_tokenなどが入る

def get_sub_from_cognito(email):
    client = boto3.client('cognito-idp', region_name=settings.AWS_REGION)
    response = client.admin_get_user(
        UserPoolId=settings.COGNITO_USER_POOL_ID,
        Username=email
    )
    for attr in response['UserAttributes']:
        if attr['Name'] == 'sub':
            return attr['Value']
    return None

# 署名付きトークンを作る
def generate_entry_token(user_sub, expires_in=300):  # 300秒 = 5分
    exp = int(time.time()) + expires_in
    payload = json.dumps({"sub": user_sub, "exp": exp})
    payload_b64 = base64.urlsafe_b64encode(payload.encode()).decode()

    signature = hmac.new(
        settings.SECRET_KEY.encode(),
        payload_b64.encode(),
        hashlib.sha256
    ).digest()
    signature_b64 = base64.urlsafe_b64encode(signature).decode()

    return payload_b64, signature_b64

# QRコード作成
def generate_entry_qr(user_sub):
    payload, sig = generate_entry_token(user_sub)
    url = f"token={payload}&sig={sig}"

    qr_img = qrcode.make(url)
    buffer = BytesIO()
    qr_img.save(buffer, format="PNG")
    img_base64 = base64.b64encode(buffer.getvalue()).decode()
    return img_base64