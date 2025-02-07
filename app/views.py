from django.shortcuts import render, redirect
from django.contrib.auth.hashers import check_password
from .models import Member,UserHistory
from .forms import MemberForm, LoginForm
from django.contrib.auth.decorators import login_required
from django.utils import timezone
import calendar
from django.db import connection


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
                if check_password(password, user.password):  # パスワードチェック
                    print("ログイン成功！user.id:", user.user_id)
                    request.session['user_id'] = user.user_id  # セッションにユーザーIDを保存
                    # login(request, user)  # Django のログイン処理
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
    user_id = request.session.get('user_id')
    now = timezone.now()

    print("ログインユーザーのID:", user_id)

    # 今月の初日を作成（例: 2025/2/1 00:00:00）
    first_day = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
    # 今月の最終日を取得して、末日の23:59:59.999999を作成
    last_day_num = calendar.monthrange(now.year, now.month)[1]
    last_day = now.replace(day=last_day_num, hour=23, minute=59, second=59, microsecond=999999)

    # user_idはモデルではIntegerFieldで定義してるから、user.idを使ってフィルターするで
    # start_timeは来店日時のフィールドやから、今月の範囲で絞ってる
    visit_count = UserHistory.objects.filter(
        user_id=user_id,
        start_time__range=(first_day, last_day)
    ).count()

    print("visit_count:", visit_count)
    print("実行されたSQL:", connection.queries[-1]["sql"])

    context = {
        'visit_count': visit_count,
        # 他の必要なデータも追加するならここに書くんや
    }
    return render(request, 'timel/dashboard.html',context)

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
            form = LoginForm(request.POST)
            if form.is_valid():
                email = form.cleaned_data['email']
                password = form.cleaned_data['password']

                try:
                    user = Member.objects.get(email=email)  # メールアドレスからユーザー取得
                    if check_password(password, user.password):  # パスワードチェック
                        print("ログイン成功！user.id:", user.user_id)
                        request.session['user_id'] = user.user_id  # セッションにユーザーIDを保存
                        # login(request, user)  # Django のログイン処理
                        return redirect('dashboard')  # ログイン成功時ダッシュボードへ
                    else:
                        form.add_error(None, "入力値が間違っています。")
                except Member.DoesNotExist:
                    form.add_error(None, "入力値が間違っていますze。")
            else:
                print(form.errors)

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