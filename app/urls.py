from django.urls import path
from .views import register, login_view, dashboard_view, success_view,landing_page_view,signup_login_view,index_1_view

urlpatterns = [
    path('register/', register, name='register'),
    path('dashboard/', dashboard_view, name='dashboard'),
    path('index_1/', index_1_view, name='index_1'),
    path('success/', success_view, name='success'),
    path('', landing_page_view, name='index'),  # LPのルートURL
    path('login/', signup_login_view, name='signup_login'),
]
