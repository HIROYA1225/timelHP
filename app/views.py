from django.shortcuts import render, redirect
from django.contrib.auth.hashers import check_password
from django.contrib.auth.hashers import make_password
from .models import Member,UserHistory,CountPlayedGames
from .forms import MemberForm, LoginForm
from django.contrib.auth.decorators import login_required
from django.utils import timezone
import calendar
from django.db import connection,models
from datetime import timedelta
import traceback
from .utils import cognito_signup,get_sub_from_cognito,generate_entry_token,generate_entry_qr
from datetime import datetime
import boto3
from django.conf import settings



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

    # **今月の開始・終了日**
    first_day_current = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
    last_day_current = now.replace(day=calendar.monthrange(now.year, now.month)[1], hour=23, minute=59, second=59, microsecond=999999)

    # 前月の開始・終了日
    first_day_previous = (first_day_current - timedelta(days=1)).replace(day=1)
    last_day_previous = first_day_current - timedelta(seconds=1)

    ### **1️⃣ 来店回数を取得**
    visit_count = UserHistory.objects.filter(
        user_id=user_id,
        start_time__range=(first_day_current, last_day_current)
    ).count()
    visit_count_previous = UserHistory.objects.filter(
        user_id=user_id,
        start_time__range=(first_day_previous, last_day_previous)
    ).count()
    # 前月差
    visit_count_diff = visit_count - visit_count_previous

    # **今月のプレイしたゲーム数をカウント**
    game_count = CountPlayedGames.objects.filter(
        user_id=user_id,
        created_at__range=(first_day_current, last_day_current)  # `updated_at` が今月の範囲内
    ).count()
    game_count_previous = CountPlayedGames.objects.filter(
        user_id=user_id,
        created_at__range=(first_day_previous, last_day_previous)  # `updated_at` が今月の範囲内
    ).count()
    # 前月差
    game_count_diff = game_count - game_count_previous

    # 滞在時間
    def get_total_stay_time(user_id,start_date, end_date):
        total_stay_time = UserHistory.objects.filter(
            user_id=user_id,
            start_time__range=(start_date, end_date),
            end_time__isnull=False
        ).exclude(end_time__lt=models.F('start_time')).aggregate(
            total_stay_time=models.Sum(
                models.ExpressionWrapper(
                    models.F('end_time') - models.F('start_time'),
                    output_field=models.DurationField()
                )
            )
        )['total_stay_time']
        
        return (total_stay_time.total_seconds() // 60) if total_stay_time else 0

    stay_time = get_total_stay_time(user_id,first_day_current, last_day_current)
    stay_time_previous = get_total_stay_time(user_id,first_day_previous, last_day_previous)

    # 前月差
    stay_time_diff = stay_time - stay_time_previous


    context = {
        'visit_count': visit_count,
        'visit_count_diff': visit_count_diff,
        'game_count': game_count,
        'game_count_diff': game_count,
        'stay_time': int(stay_time),
        'stay_time_diff': stay_time_diff,
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
            print("Cognitoサインアップ押下:")
            name = request.POST.get('username')
            email = request.POST.get('email')
            password = request.POST.get('password')
            gender = request.POST.get('gender')
            raw_birthday = request.POST.get('birthday')  # yyyymmdd形式で受け取る
            # 'yyyy-mm-dd' に変換
            birthdate = datetime.strptime(raw_birthday, '%Y%m%d').strftime('%Y-%m-%d')

            try:
                response = cognito_signup(email, password, name, gender, birthdate)
                # MySQLにもユーザー追加
                sub = get_sub_from_cognito(email)
                hashed_password = make_password(password)
                Member.objects.create(
                    cognito_sub=sub,
                    email=email,
                    username=name,
                    gender=gender,
                    birthday=raw_birthday,
                    password=hashed_password
                )

                print("Cognito sign up success")
                return redirect('confirm_signup')  # 確認コード入力画面などへ
            except Exception as e:
                print("Cognito signup error:", e)
                traceback.print_exc()
                return render(request, 'timel/login.html', {'error': str(e)})
    return render(request, 'timel/login.html', {
        'login_form': login_form,
        'signup_form': signup_form,
    })

def confirm_signup_view(request):
    if request.method == 'POST':
        email = request.POST.get('email')
        code = request.POST.get('code')

        try:
            client = boto3.client('cognito-idp', region_name=settings.AWS_REGION)
            client.confirm_sign_up(
                ClientId=settings.COGNITO_CLIENT_ID,
                Username=email,
                ConfirmationCode=code
            )
            # 成功したらログインページへリダイレクト
            return redirect('signup_login')
        except Exception as e:
            print("確認エラー:", e)
            return render(request, 'timel/confirm_signup.html', {'error': str(e)})

    return render(request, 'timel/confirm_signup.html')

def show_qr_view(request):
    user_sub = request.session.get("cognito_sub")
    img_qr = generate_entry_qr(user_sub)
    return render(request, 'timel/enter_qr.html', {"img_qr": img_qr})