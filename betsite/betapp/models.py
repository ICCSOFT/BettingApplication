from django.db import models
from django.contrib.auth.models import AbstractUser

# Create your models here.
class User(AbstractUser):
    fullname = models.CharField(max_length=200, null=True)
    phone= models.CharField(max_length=200, null=True)

    def __str__(self):
        return self.username

class Match(models.Model):
    time       = models.TimeField()
    match_name = models.CharField(max_length=255)
    home_code  = models.FloatField()
    draw_code  = models.FloatField()
    away_code  = models.FloatField()

    def __str__(self):
        return self.match_name

class Order(models.Model):
    customer           = models.ForeignKey('User', on_delete=models.SET_NULL,null=True)
    match              = models.JSONField()
    odd                = models.FloatField()
    stake_amount       = models.FloatField()
    possible_winning   = models.FloatField()
    date_ordered       = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.customer.username