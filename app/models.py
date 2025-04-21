from django.contrib.auth.models import AbstractBaseUser, BaseUserManager
from django.db import models

class MemberManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError("メールアドレスは必須です")
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)  # パスワードをハッシュ化
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault("is_admin", True)
        return self.create_user(email, password, **extra_fields)
class Member(models.Model):
    GENDER_CHOICES = [
        ('1', 'Male'),
        ('2', 'Female'),
        ('3', 'Other'),
    ]
    user_id = models.AutoField(primary_key=True) 
    username = models.CharField(max_length=50)
    birthday = models.CharField(max_length=8)
    gender = models.CharField(max_length=1, choices=GENDER_CHOICES)
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=255)
    cognito_sub = models.CharField(max_length=64, unique=True)

    class Meta:
        db_table = 'users'  # テーブル名を指定
        managed = False

    def __str__(self):
        return self.username

class UserHistory(models.Model):
    # id = models.AutoField(primary_key=True)
    user_id = models.IntegerField(primary_key=True)  # Member の user_id と対応
    start_time = models.DateTimeField()  # 来店日時
    end_time = models.DateTimeField(null=True, blank=True)

    class Meta:
        db_table = 'table_users_history'  # 既存のテーブル名を指定
        managed = False  # Django によるテーブル管理をしない（マイグレーションで変更されない）

class CountPlayedGames(models.Model):
    play_bdg_history_id = models.IntegerField(primary_key=True)
    user_id = models.IntegerField()  # `users` テーブルの `user_id` と紐づく
    bdg_id = models.IntegerField()  # プレイしたボードゲームのID
    created_at = models.DateTimeField()  # 最後にプレイした日

    class Meta:
        db_table = 'play_bdg_history'  # MySQL の既存テーブル
        managed = False  # Django にテーブル管理させない