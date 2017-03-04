import os
import sys
sys.path.append(os.pardir)
from common import copyFile

src = sys.argv[ 1 ]
dest = os.path.dirname(os.path.abspath(__file__)) + "\\..\\application\\assets\\"
copyFile(src, dest)

