
from dataclasses import dataclass, field
from dotenv import load_dotenv
import os

load_dotenv()

@dataclass
class RSM:
    LOGIN = os.environ["RSM_LOGIN"]
    PASS = os.environ["RSM_PASS"]
    PING_LINK = os.environ["RSM_PING_LINK"]
    COUNTER_LAYOUT = 21703