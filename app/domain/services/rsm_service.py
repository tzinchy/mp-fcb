import urllib
import psycopg2
import requests
import json
# import pandas as pd
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.by import By
from core.config import RSM
from core.database import DatabaseSettings
import time
import uuid
import random
import string
import asyncio
from datetime import datetime, timedelta
import multiprocessing
from urllib.parse import urlencode, urljoin
from concurrent.futures import ProcessPoolExecutor, as_completed


class RsmService ():

    def normalize_district(self, value: str) -> str:

        district_mapping = {
            "Восточный АО": "ВАО",
            "Центральный АО": "ЦАО",
            "Северо-Восточный АО": "СВАО",
            "Новомосковский АО": "НАО",
            "Люблинский р-н": "ЮВАО",  # Люблинский район относится к Юго-Восточному АО
            "Юго-Восточный АО": "ЮВАО",
            "Северо-Западный АО": "СЗАО",
            "Северный АО": "САО",
            "Зеленоградский АО": "ЗелАО",
            "Юго-Западный АО": "ЮЗАО",
            "Южный АО": "ЮАО",
            "Вос": "ВАО",
            "СЗАО": "СЗАО",
            "Троицкий АО": "ТАО",
            "Западный АО": "ЗАО",
            "Зел": "ЗелАО",
            "С-В": "СВАО",
            "Южн": "ЮАО",
            "С-З": "СЗАО",
            "Зап": "ЗАО",
            "Цен": "ЦАО",
            "Ю-З": "ЮЗАО",
            "ТАО": "ТАО",
            "Сев": "САО",
            "НАО": "НАО",
            "МО": "МО",  # Московская область, если нужно
            "Ю-В": "ЮВАО",
            "Якиманка": "ЦАО",  # Район в ЦАО
            "Тверской": "ЦАО",  # Район в ЦАО
            "Северное Бутово": "ЮЗАО",  # Район в ЮЗАО
            "Очаково-Матвеевское": "ЗАО",  # Район в ЗАО
            "Левобережный": "САО",  # Район в САО
            "Некрасовка": "ЮВАО",  # Район в ЮВАО
            "Митино": "СЗАО",  # Район в СЗАО
            "Крылатское": "ЗАО",  # Район в ЗАО
            "Бирюлёво Восточное": "ЮАО",  # Район в ЮАО
            "Академический": "ЮЗАО"  # Район в ЮЗАО
        }

        if not value:
            return ""
        value = value.strip()

        # 1. Точное соответствие
        if value in district_mapping:
            return district_mapping[value]

        # 2. Частичное совпадение по подстроке
        for key, val in district_mapping.items():
            if key in value:
                return val

        return value  # если ничего не подошло, вернуть как есть

    async def get_kpu_info(self, affair_id :int):
        
        return
    
    async def get_token(self):

        return
    
    async def check_token(self):

        return
    
    def generate_key(self):
        """
        Generates unique session key
        which required to the search request for identification responses
        in RSM
        :return:
        """
        # Генерация UUID
        uuid_part = str(uuid.uuid4())
        # Генерация случайных символов
        random_part = ''.join(random.choices(string.ascii_lowercase + string.digits, k=3))
        # Объединение частей
        key = f"{uuid_part}-{random_part}"
        return key
    

    def get_cookie(self):

        """
        Request for the new auth token
        Login and Password required in .env
        :return:
        """

        chrome_options = webdriver.ChromeOptions()
        prefs = {'profile.default_content_settings.popups': 0,
                "download.prompt_for_download": False,
                "directory_upgrade": True,
                "safebrowsing.enabled": True,
                "safebrowsing.disable_download_protection": True}
        chrome_options.add_experimental_option('prefs', prefs)
        chrome_options.add_argument("--allow-running-insecure-content")
        chrome_options.add_argument("--disable_web_security")
        chrome_options.add_argument('--no-sandbox')
        chrome_options.add_argument('--disable-dev-shm-usage')
        chrome_options.add_argument('--headless') 

        driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=chrome_options)
        # driver = webdriver.Chrome()
        driver.get(RSM.PING_LINK)
        try:
            WebDriverWait(driver, 600).until(EC.visibility_of_element_located((By.XPATH, '//*[@id="login"]'))).click()
            driver.find_element(By.XPATH, '//*[@id="login"]').send_keys(RSM.LOGIN)
        except:
            print("Timed out waiting for page to load")
        time.sleep(3)
        try:
            WebDriverWait(driver, 600).until(EC.visibility_of_element_located((By.XPATH, '//*[@id="password"]'))).click()
            driver.find_element(By.XPATH, '//*[@id="password"]').send_keys(RSM.PASS)
        except:
            print("Timed out waiting for page to load")
        time.sleep(3)
        driver.find_element(By.XPATH, '//*[@id="bind"]').click()
        cooks = driver.get_cookie('Rsm.Cookie')
        cookie = cooks['value']
        driver.close()
        return cookie
    

    def check_token(self):
        """
        checks is the token from DB allowed now
        if not - generates a new one
        :return:
        """
        conn_params = {
            "dbname": DatabaseSettings.DB_NAME,
            "user": DatabaseSettings.DB_USER,
            "password": DatabaseSettings.DB_PASS,
            "host": DatabaseSettings.DB_HOST,
            "port": DatabaseSettings.DB_PORT
        }

        query = "SELECT value FROM env.env WHERE name = 'rsm_token' LIMIT 1;"

        try:

            with psycopg2.connect(**conn_params) as conn:

                with conn.cursor() as cursor:

                    cursor.execute(query)
                    result = cursor.fetchone()

                    if result:

                        value = result[0]
                        print(f"Value: {value}")

                    else:

                        print("No value found.")

        except psycopg2.Error as e:

            print(f"Database error: {e}")

        response = requests.get(RSM.PING_LINK, cookies={'Rsm.Cookie': value},
                                allow_redirects=False)

        if response.status_code == 200:
            return value
        elif response.status_code == 302:
            token = self.get_cookie()
            print(token)

            query = f"""UPDATE env.env
                    SET value = '{token}'
                    WHERE name = 'rsm_token';
                    """

            try:

                with psycopg2.connect(**conn_params) as conn:

                    with conn.cursor() as cursor:

                        cursor.execute(query)
                        conn.commit()

            except psycopg2.Error as e:

                print(f"Database error: {e}")

            return token
        else:
            return None
        

    def send_request(url, cookie):
        try:
            requests.get(url, cookies={'Rsm.Cookie': cookie})
        except requests.exceptions.RequestException as e:
            print(e)
            pass

    async def get_kpu_info(self, affair_id :int):
        token = self.check_token()
        search_link = 'http://webrsm.mlc.gov:5222/Registers/GetData'

        search_dynamic_control_data = [{
            "IdControl":"AffairId",
            "StringValue":f"{affair_id}",
            "ControlType":"DynamicNumber",
            "QueryOperation":"Equal"}]

        params = {
            "sort": "",
            "page": "1",
            "pageSize": "30",
            "group": "",
            "filter": "",
            "RegisterId": "KursKpu",
            "SearchApplied": "true",
            "PageChanged": "false",
            "Page": "1",
            "PageSize": "30",
            "SelectAll": "false",
            "ClearSelection": "true",
            "LayoutId": "22810",
            "RegisterViewId": "KursKpu",
            "LayoutRegisterId": "0",
            "FilterRegisterId": "0",
            "ListRegisterId": "0",
            "SearchDynamicControlData": json.dumps(search_dynamic_control_data),
            "UniqueSessionKey": self.generate_key(),
            "UniqueSessionKeySetManually": "true",
            "ContentLoadCounter": "1"
        }

        response = requests.get(search_link, params=params, cookies={'Rsm.Cookie': token})

        # Пример вывода результата
        # print(response.status_code)
        # print(response.text)
        if response.ok:
            jsonn = json.loads(response.text)

            response_dict = {'affair_id': '',
                        'fio': '',
                        'district': '',
                        'municipal_district': '',
                        'house_address': '',
                        'apart_number': '',
                        'kpu': '',
                        'unom': ''}
            
            if jsonn['Data']:
                if len(jsonn['Data']) == 1:
                    data = jsonn['Data'][0]
                    response_dict["affair_id"] = int(data['448826'])
                    response_dict["fio"] = data['448827']
                    response_dict['district'] = self.normalize_district(data.get('448828', ''))
                    response_dict["municipal_district"] = data['448829']
                    response_dict["house_address"] = data['448830']
                    response_dict["apart_number"] = data['448831']
                    response_dict["kpu"] = data['448832']
                    response_dict["unom"] = data['448833']

            print(response_dict)


        return response_dict
    
# rsm = RsmService()
# asyncio.run(rsm.get_kpu_info(1033628))