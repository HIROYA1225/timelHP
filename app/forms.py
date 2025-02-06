from django import forms
from .models import Member
from django.contrib.auth.hashers import make_password
import datetime

# 会員登録用フォーム
class MemberForm(forms.ModelForm):
    password = forms.CharField(widget=forms.PasswordInput)
    GENDER_CHOICES = [
        ('1', 'Male'),
        ('2', 'Female'),
        ('3', 'Other'),
    ]

    gender = forms.ChoiceField(choices=GENDER_CHOICES, required=True)  # ラジオボタンに変更

    class Meta:
        model = Member
        fields = ['username', 'birthday', 'gender', 'email', 'password']
    def clean_email(self):
        email = self.cleaned_data.get('email')
        if Member.objects.filter(email=email).exists():
            raise forms.ValidationError("すでに登録されています。ログインしてください。")
        return email
    def save(self, commit=True):
        member = super().save(commit=False)
        member.password = make_password(self.cleaned_data['password'])  # パスワードをハッシュ化
        if commit:
            member.save()
        return member
    def clean_birthday(self):
        birthday = self.cleaned_data.get("birthday")

        # 8桁の数字かチェック（YYYYMMDD）
        if not (isinstance(birthday, str) and len(birthday) == 8 and birthday.isdigit()):
            raise forms.ValidationError("Enter a valid date in YYYYMMDD format.")

        # 存在する日付かチェック
        try:
            datetime.datetime.strptime(birthday, "%Y%m%d")  # 例: "19941225"
        except ValueError:
            raise forms.ValidationError("Enter a valid date.")

        return birthday  # YYYYMMDD のまま保存

# ログイン用フォーム
class LoginForm(forms.Form):
    email = forms.EmailField(label="メールアドレス", max_length=255)
    password = forms.CharField(label="パスワード", widget=forms.PasswordInput)