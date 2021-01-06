from django.contrib.auth.models import User, Group
from rest_framework import serializers
from rest_framework.serializers import ModelSerializer
from .models import *
from django.db.models import Sum

class UserSerializer(serializers.HyperlinkedModelSerializer): 
    class Meta: 
        model = User 
        fields = ('id', 'username', 'email','password','phone', 'fullname', 'is_superuser','is_active' ) 
        extra_kwargs = {'password': {'write_only': True, 'required': True}}
    
    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user

class RegisterSerializer(serializers.HyperlinkedModelSerializer): 
    class Meta: 
        model = User 
        fields = ('id', 'username', 'email','password','phone', 'fullname') 
        extra_kwargs = {'password': {'write_only': True, 'required': True}}
        
    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user
        
class MatchSerializer(serializers.ModelSerializer):
    class Meta:
        model = Match
        fields = ('id','time','match_name','home_code','draw_code', 'away_code')
        
class MatchMiniSerializer(serializers.ModelSerializer):
    class Meta:
        model = Match
        fields = ('id','time','match_name','home_code','draw_code', 'away_code')

class ScoreSerializer(serializers.ModelSerializer):
    class Meta:
        model = Score
        fields = ('id','time','match_name','home_score','away_score')
        
class ScoreMiniSerializer(serializers.ModelSerializer):
    class Meta:
        model = Score
        fields = ('id','time','match_name','home_score','away_score' , 'date','finish')

class OrderSerializer(serializers.ModelSerializer):
    customer_name = serializers.SerializerMethodField()

    class Meta:
        model = Order
        fields = ('id','customer_name', 'match','odd', 'stake_amount', 'possible_winning','finished','cancelled', 'date_ordered')

    def get_customer_name(self,obj):
        if obj.customer != None:
            return obj.customer.username

    def create(self, validated_data):
        order_obj = super(OrderSerializer, self).create(validated_data)
        order_obj.customer=self.context['request'].user
        order_obj.save()
        return order_obj

class AccountSerializer(serializers.ModelSerializer):
    customer_name = serializers.SerializerMethodField()
    balance_real = serializers.SerializerMethodField()

    class Meta:
        model = Account
        fields = ('customer_name','balance','datetime', 'balance_real')

    def get_customer_name(self,obj):
        if obj.customer != None:
            return obj.customer.username

    def get_balance_real(self,obj):
        return obj.transaction_set.all().aggregate(Sum('amount'))

    def create(self, validated_data):
        acct_obj = super(AccountSerializer, self).create(validated_data)
        acct_obj.customer=self.context['request'].user
        acct_obj.save()
        return acct_obj



class TransactionSerializer(serializers.ModelSerializer):
    customer_name = serializers.SerializerMethodField()

    class Meta:
        model = Transaction
        fields = ('customer_name','amount', 'desc','datetime')

    def get_customer_name(self,obj):
        if obj.customer != None:
            return obj.customer.customer.username

    def create(self, validated_data):
        transac_obj = super(TransactionSerializer, self).create(validated_data)
        transac_obj.customer=self.context['request'].user.account
        transac_obj.save()
        return transac_obj


