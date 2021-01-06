from django.contrib.auth.models import User
from rest_framework import viewsets
from rest_framework.response import Response
from .serializer import MatchSerializer, MatchMiniSerializer, OrderSerializer,UserSerializer,RegisterSerializer,AccountSerializer, TransactionSerializer,ScoreMiniSerializer, ScoreSerializer
from .models import *
from rest_framework.authentication import BasicAuthentication, TokenAuthentication
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.views import APIView

class MatchViewSet(viewsets.ModelViewSet):
    """ 
    API enddpoint that allows users to be viewed or edited. 
    """
    queryset = Match.objects.all()
    
    serializer_class = MatchSerializer
    permission_classes = (AllowAny,)

    def list(self, request, *args, **kwargs):
        matches = Match.objects.all().order_by('time')
        serializer = MatchMiniSerializer(matches, many=True)
        return Response(serializer.data)

class ScoreViewSet(viewsets.ModelViewSet):
    """ 
    API enddpoint that allows users to be viewed or edited. 
    """
    queryset = Score.objects.all()
    
    serializer_class = ScoreSerializer
    permission_classes = (AllowAny,)

    def list(self, request, *args, **kwargs):
        scores = Score.objects.all()
        serializer = ScoreMiniSerializer(scores, many=True)
        return Response(serializer.data)


class OrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer

    def list(self, request, *args, **kwargs):
        order = Order.objects.all().order_by('-date_ordered')
        if 'username' in request.query_params:
            order=order.filter(customer__username=request.query_params['username'])
        serializer = OrderSerializer(order, many=True)
        return Response(serializer.data)

    def get_serializer_context(self):
        context = super(OrderViewSet, self).get_serializer_context()
        context.update({"request": self.request})
        return context

class DeactiveUserAPIView(APIView):
    authentication_classes = (BasicAuthentication,TokenAuthentication,)
    permission_classes = (AllowAny,)

    def post(self,request):
        user = User.objects.get(id=request.data['id'])
        user.is_active = request.data['is_active']
        user.save()
        data = {"user":user.username, 'is_active': user.is_active}
        return Response(data)

class ActiveUserAPIView(APIView):
    authentication_classes = (BasicAuthentication,TokenAuthentication,)
    permission_classes = (AllowAny,)

    def post(self,request):
        order = Order.objects.get(id=request.data['id'])
        order.cancelled = request.data['cancelled']
        order.save()
        data = {'cancelled': order.cancelled}
        return Response(data)

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all().order_by('-date_joined')
    serializer_class = UserSerializer
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated,)
    

class RegisterViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all().order_by('-date_joined')
    serializer_class = RegisterSerializer
    authentication_classes = (TokenAuthentication,)
    permission_classes = (AllowAny,)


    def list(self, request, *args, **kwargs):
        userd = User.objects.all()
        if 'username' in request.query_params:
            userd=userd.filter(username=request.query_params['username'])
        serializer = UserSerializer(userd, many=True)
        return Response(serializer.data)

class AccountViewSet(viewsets.ModelViewSet):
    queryset = Account.objects.all()
    serializer_class = AccountSerializer 

    def list(self, request, *args, **kwargs):
        account = Account.objects.all()
        if 'username' in request.query_params:
            account=account.filter(customer__username=request.query_params['username'])
        serializer = AccountSerializer(account, many=True)
        return Response(serializer.data)

    def get_serializer_context(self):
        context = super(AccountViewSet, self).get_serializer_context()
        context.update({"request": self.request})
        return context

class TransactionViewSet(viewsets.ModelViewSet):
    queryset = Transaction.objects.all()
    serializer_class = TransactionSerializer


    def list(self, request, *args, **kwargs):
       
        transaction = Transaction.objects.all()
        if 'username' in request.query_params:
            transaction=transaction.filter(customer__customer__username=request.query_params['username'])
        serializer = TransactionSerializer(transaction, many=True)
        return Response(serializer.data)

    def get_serializer_context(self):
        context = super(TransactionViewSet, self).get_serializer_context()
        context.update({"request": self.request})
        return context
