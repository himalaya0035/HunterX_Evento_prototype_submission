import datetime
import json
from pprint import pprint

from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer

from accounts.models import EventUser
from banking.models import BankAccount
from chatapp.models import ChatMessage
import requests


def send_budget_update_notification(user, amount, event_id, participant_id):
    message = f"{user.full_name} set estimated budget to {amount}"
    new_chat_message = ChatMessage(event_id=event_id, message=message, from_participant_id=participant_id,
                                   message_type='notification')
    new_chat_message.save()

    # channel_layer = get_channel_layer()
    # async_to_sync(channel_layer.group_send)(
    #     'event_%s' % event_id,
    #     {
    #         "type": "notify",
    #         "data": {
    #             'id': new_chat_message.id,
    #             'message': message
    #         }
    #     }
    # )


from django.conf import settings


def issue_bundle(individualID, phoneNumber, full_name):
    base_url = settings.FUSION_BASE_URL
    url = f"/ifi/{settings.IFI_ID}/bundles/{settings.BUNDLE_ID}/issueBundle"

    data = {
        "accountHolderID": individualID,
        "disableCardFFCreation": False,
        "disableFFCreation": False,
        "disablePhoneFFCreation": False,
        "name": "bundle_%s" % full_name,
        "phoneNumber": phoneNumber
    }

    res = requests.post(base_url + url, json.dumps(data), headers=settings.FUSION_HEADERS)
    res = json.loads(res.text)
    print(res)
    return res


def complete_kyc(user: EventUser, pan_card_number, year, month, date):
    if user.kyc_status:
        return

    base_url = settings.FUSION_BASE_URL
    url = f"/ifi/{settings.IFI_ID}/applications/newIndividual"

    data = {
        "ifiID": settings.IFI_ID,
        "formID": "event_" + datetime.datetime.now().isoformat(),
        "spoolID": "123",
        "individualType": "REAL",
        "firstName": user.full_name,
        "profilePicURL": "",
        "dob": {
            "year": year,
            "month": month,
            "day": date
        },
        "kycDetails": {
            "kycStatus": "MINIMAL",
            "kycStatusPostExpiry": "string",
            "kycAttributes": {},
            "authData": {
                "PAN": pan_card_number
            },
            "authType": "PAN"
        },
        "vectors": [
            {
                "type": "e",
                "value": user.email,
                "isVerified": False
            }
        ],
        "pops": [],
        "source": "postman",

    }

    res = requests.post(base_url + url, headers=settings.FUSION_HEADERS, data=json.dumps(data))
    response = json.loads(res.text)
    print(response)
    user.individual_id = response['individualID']
    user.kyc_status = True
    user.save()

    res = issue_bundle(response['individualID'], user.whatsappNo, user.full_name)
    new_bank_account = BankAccount(user=user, accountNumber=res['accounts'][0]['accountID'])
    new_bank_account.save()
    return response, res

import uuid

def a2atransfer(amount, creditAccopuntID, debitAccountID, remarks='TASK'):
    base_url = settings.FUSION_BASE_URL
    url = F"/ifi/{settings.IFI_ID}/transfers"

    data = {
        "requestID": uuid.uuid1().int,
        "amount": {
            "currency": "INR",
            "amount": amount * 100
        },
        "transferCode": "ATLAS_P2M_AUTH",
        "debitAccountID": debitAccountID,
        "creditAccountID": creditAccopuntID,
        "remarks": remarks,
        "transferTime": int(datetime.datetime.now().timestamp()),
        "attributes": {}
    }

    res = requests.post(base_url + url, json.dumps(data), headers=settings.FUSION_HEADERS)
    print(res.text)
    # return


"""

{
"pancard_number":"KKXPL7573X",
"dob":"2002-05-10"
}

2021-08-26T16:31:53.833349600Z {'requestID': 'b179a5c9-eaaa-483c-89a4-1e0da053ab6f', 'accounts': [{'bundleID': 'd731761e-8a10-46a4-8974-31aa80c54746', 'accountHolderID': 'cbbdd9d7-3aca-4db7-b98d-c78c4dd57681', 'accountID': 'd5bcd2d0-008f-45b8-8f3a-69e0caaa4dae'}], 'paymentInstruments': [{'bundleID': 'd731761e-8a10-46a4-8974-31aa80c54746', 'resourceID': '8f35c9cb-18a7-4adb-bded-eeb15bca3df8', 'status': 'ACTIVE', 'targetAccount': 'account://d5bcd2d0-008f-45b8-8f3a-69e0caaa4dae'}]} cbbdd9d7-3aca-4db7-b98d-c78c4dd57681
"transferTime": 1581083590962
"""
