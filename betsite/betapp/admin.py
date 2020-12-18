from django.contrib import admin
from .models import *
# Register your models here.

@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    # fields = ("customer","match","odd","stake_amount","possible_winning","date_ordered")
    readonly_fields = ['date_ordered']

admin.site.register(Match)
admin.site.register(User)
# admin.site.register(Order)