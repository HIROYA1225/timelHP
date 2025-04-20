from django.shortcuts import render, redirect
from django.contrib.auth.hashers import check_password
from .models import Member,UserHistory,CountPlayedGames
from .forms import MemberForm, LoginForm
from django.contrib.auth.decorators import login_required
from django.utils import timezone
import calendar
from django.db import connection,models
from datetime import timedelta



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