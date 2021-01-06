from django.db import models
from django.contrib.auth.models import AbstractUser
from django.db.models.signals import post_save
from django.dispatch import receiver


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

class Score(models.Model):
    time         = models.CharField(max_length=255)
    match_name   = models.CharField(max_length=255)
    home_score   = models.IntegerField()
    away_score   = models.IntegerField()
    date         = models.DateTimeField(auto_now_add=True)
    finish       = models.BooleanField(default=False)

    def __str__(self):
        return self.match_name

class Order(models.Model):
    customer           = models.ForeignKey('User', on_delete=models.SET_NULL,null=True)
    match              = models.JSONField()
    odd                = models.FloatField()
    stake_amount       = models.FloatField()
    possible_winning   = models.FloatField()
    finished           = models.BooleanField(default=False)
    cancelled          = models.BooleanField(default=False)
    date_ordered       = models.DateTimeField(auto_now_add=True)
    

    def __str__(self):
        return self.customer.username

class Account(models.Model):
    customer = models.OneToOneField('User',primary_key=True, on_delete=models.CASCADE)
    balance  = models.IntegerField(default=0)
    datetime = models.DateTimeField(auto_now_add=True)


    def __str__(self):
        return self.customer.username
    
@receiver(post_save, sender=User)
def create_account(sender, instance, created, *args, **kwargs):
    if created:
        Account.objects.create(customer=instance)



class Transaction(models.Model):
    customer = models.ForeignKey('Account', on_delete=models.SET_NULL,null=True)
    datetime = models.DateTimeField(auto_now_add=True)
    desc     = models.CharField(max_length=250)
    amount   = models.FloatField(default=0)

    def __str__(self):
        return self.desc
