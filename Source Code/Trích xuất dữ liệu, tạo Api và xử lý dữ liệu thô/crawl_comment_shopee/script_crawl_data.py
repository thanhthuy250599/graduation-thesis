
from numpy.core.records import record
import requests
import json
import pandas as pd

from SACR.model import model_sentiment_analysis_customer_reviews

def read_comment(itemid: str, shopid: str):
    data_comment = pd.DataFrame()
    
    for offset in range(15):
        url = r"https://shopee.vn/api/v2/item/get_ratings?filter=1&flag=1&itemid={}&limit=6&offset={}&shopid={}&type=0".format(itemid, offset*6, shopid)

        headers = {
            'cookie': "SPC_PC_HYBRID_ID=84; csrftoken=yfXVW13rQpK3DzcXrQVd7HxVy0CQiLby; SPC_IA=-1; SPC_EC=-; SPC_U=-; REC_T_ID=3908e25e-ca61-11eb-bda5-b49691a184d6; SPC_SI=mall.Bzx0PwZeSVAFgIHB9hbnMNkCj0tT058y; REC_T_ID=3907c5e8-ca61-11eb-8919-2cea7f90b8dd; SPC_F=5YYHYE2NhmeGDFsZy2bENJdo7uWXmG8G; _gcl_au=1.1.986783983.1623380447; _med=refer; welcomePkgShown=true; _fbp=fb.1.1623380447884.2089297794; _hjid=73079271-761f-45ec-8ec3-d29b2bfbff00; _hjFirstSeen=1; _hjAbsoluteSessionInProgress=0; AMP_TOKEN=%24NOT_FOUND; _ga=GA1.2.1801455669.1623380448; _gid=GA1.2.1367985147.1623380449; _dc_gtm_UA-61914164-6=1; cto_bundle=H55KnF9yZTYxY0d0dnFLdE1RM2RwR0JEUHYlMkZkd3h3Z2dMTFJlTUxlWjhyMzRyazNyY3JRUlZzcG1sdUZHNFFiNFk0JTJGN3FQMkV5N3p4OEVOUDNhNlFhaFBrZFAySUtvcVBrTFZKd1gxVTBzV1NNWjMzWSUyRklpOTcyY1N4ZFpPTCUyQmdPNXls; _ga_M32T05RVZT=GS1.1.1623380448.1.1.1623380474.34; SPC_R_T_ID='9BWkgUMYI/LFWBSrJ7kZ6ZVO8q+dubLBe7ZYTZKFZHDajgfOT0KQgUcqBIPsqLafhHDj2EN0S8AKARyq1b6V/wuwmCuA0brj6NP9j1OOAnI='; SPC_T_IV='eu1JKxgz1uPp2DJ5FxaVMg=='; SPC_R_T_IV='eu1JKxgz1uPp2DJ5FxaVMg=='; SPC_T_ID='9BWkgUMYI/LFWBSrJ7kZ6ZVO8q+dubLBe7ZYTZKFZHDajgfOT0KQgUcqBIPsqLafhHDj2EN0S8AKARyq1b6V/wuwmCuA0brj6NP9j1OOAnI='"
        }

        respons = requests.request("GET", url, headers=headers).json()

        id_comment = []
        id_product = []
        comment_product = []
        rating_comment = []

        for item in respons["data"]["ratings"]:

            id_comment.append(item["cmtid"])
            id_product.append(itemid)
            comment_product.append(item["comment"])
            rating_comment.append(item["rating"])
        
       
        data = pd.DataFrame(zip(id_comment, id_product, comment_product, rating_comment), columns=['id_comment', 'id_product', 'comment_product', 'rating_comment'])
        data_comment = pd.concat([data_comment, data], ignore_index=True)
    return data_comment

def write_comment(body: record):
    url = "http://localhost:8000/comment"

    payload = json.dumps(body)
    headers = {
    'Content-Type': 'application/json'
    }

    response = requests.request("POST", url, headers=headers, data=payload)

    print(response.text)


def write_ratings_shopee_model(body: dict):
    url = "http://localhost:8000/rating"

    payload = json.dumps(body)
    headers = {
    'Content-Type': 'application/json'
    }

    response = requests.request("POST", url, headers=headers, data=payload)

    print(response.text)

def main(itemid: str, shopid: str):
    df = read_comment(itemid, shopid)

    data = model_sentiment_analysis_customer_reviews(df)

    thisratingsdict = {
        "positive_shopee": list(data["rating_comment"]==1).count(True),
        "negative_shopee": list(data["rating_comment"]==-1).count(True),
        "neutral_shopee": list(data["rating_comment"]==0).count(True),
                    
        "positive_model": list(data["rating_model"]==1).count(True),
        "negative_model": list(data["rating_model"]==-1).count(True),
        "neutral_model": list(data["rating_model"]==0).count(True),
        "id_product" : itemid,
    }

    data.pop("comment")
    try:
        write_ratings_shopee_model(thisratingsdict)
    except:
        print("Fail write_ratings_shopee_model itemid: {} - shopid: {}".format(itemid, shopid))
    data_resualt = data.to_dict('records')
    try:
        write_comment(data_resualt)
    except:
        print("Fail write_comment itemid: {} - shopid: {}".format(itemid, shopid))