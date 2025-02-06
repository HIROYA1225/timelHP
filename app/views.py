from django.shortcuts import render, redirect
from django.contrib.auth.hashers import check_password
from .models import Member
from .forms import MemberForm, LoginForm

# 会員登録ビュー
def register(request):
    if request.method == 'POST':
        form = MemberForm(request.POST)
        if form.is_valid():
            form.save()
            return redirect('success')  # 成功時のリダイレクト先
    else:
        form = MemberForm()
    return render(request, 'timel/register.html', {'form': form})

# ログインビュー
def login_view(request):
    if request.method == 'POST':
        form = LoginForm(request.POST)
        if form.is_valid():
            email = form.cleaned_data['email']
            password = form.cleaned_data['password']

            try:
                user = Member.objects.get(email=email)  # メールアドレスからユーザー取得
                print(f"入力されたパスワード: {password}")
                print(f"データベースのパスワード: {user.password}")
                if check_password(password, user.password):  # パスワードチェック
                    return redirect('dashboard')  # ログイン成功時ダッシュボードへ
                else:
                    form.add_error(None, "入力値が間違っています。")
            except Member.DoesNotExist:
                form.add_error(None, "入力値が間違っていますze。")
        else:
            print(form.errors)
    else:
        form = LoginForm()
    return render(request, 'timel/login.html', {'form': form})

# ダッシュボードビュー
def dashboard_view(request):
    return render(request, 'timel/dashboard.html')
def index_1_view(request):
    return render(request, 'timel/index_1.html')

# 成功ページビュー
def success_view(request):
    return render(request, 'timel/success.html')

# LP
def landing_page_view(request):
    return render(request, 'timel/index.html')

def signup_login_view(request):
    login_form = LoginForm()
    signup_form = MemberForm()

    if request.method == 'POST':
        if 'login' in request.POST:  # ログインフォームが送信された場合
            login_form = LoginForm(request.POST)
            if login_form.is_valid():
                email = login_form.cleaned_data['email']
                password = login_form.cleaned_data['password']

                try:
                    user = Member.objects.get(email=email)
                    if check_password(password, user.password):
                        return redirect('dashboard')  # ダッシュボードへリダイレクト
                    else:
                        login_form.add_error(None, "Invalid credentials")
                except Member.DoesNotExist:
                    login_form.add_error(None, "Invalid credentials")

        elif 'signup' in request.POST:  # サインアップフォームが送信された場合
            print("POSTデータ:", request.POST)
            signup_form = MemberForm(request.POST)
            if signup_form.is_valid():
                signup_form.save()
                return redirect('success')  # サインアップ成功ページへリダイレクト
            else:
                print("フォームのエラー:", signup_form.errors)

    return render(request, 'timel/login.html', {
        'login_form': login_form,
        'signup_form': signup_form,
    })