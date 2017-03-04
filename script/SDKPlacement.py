import os
import sys
sys.path.append(os.pardir)
from common import copyFile

src = sys.argv[ 1 ]
dest = os.path.dirname(os.path.abspath(__file__)) + "\\..\\application\\app\\src\\extension\\live2d"
copyFile(src, dest)
