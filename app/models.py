from django.db import models

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

    class Meta:
        db_table = 'users'  # テーブル名を指定

    def __str__(self):
        return self.nickname

class UserHistory(models.Model):
    table_users_history_id = models.AutoField(primary_key=True)
    user_id = models.IntegerField()  # `Member` の `user_id` と対応
    start_time = models.DateTimeField()  # 来店日時

    class Meta:
        db_table = 'table_users_history'  # 既存のテーブル名を指定
        managed = False  # Django によるテーブル管理をしない（マイグレーションで変更されない）