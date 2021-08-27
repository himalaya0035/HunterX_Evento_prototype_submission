from django.urls import path
from . import views

urlpatterns = [
    path('transact', views.MakeTransactionView.as_view()),
    path('set_estimated_budget', views.SetEstimatedBudget.as_view()),
    path('bank_accounts', views.AddBankAccView.as_view()),
    path('event_transactions/<int:event_id>', views.EventTransactions.as_view()),
    path('event_transactions/<int:event_id>/third_party', views.GetThirdPartyTransactions.as_view()),
    path('third_party_transaction', views.ThirdPartyTransaction.as_view()),
    path('complete_kyc', views.completeKYC.as_view()),
    path('kyc_status', views.kyc_status)
]
