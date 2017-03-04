import os
import sys
import shutil
from distutils.dir_util import copy_tree
from zipfile import ZipFile

def removeDirectory(filePath):
    if os.path.isdir(filePath):
        t = shutil.rmtree(filePath)


def copyFile(src, dest):
    srcPath, ext = os.path.splitext(src)

    # zipが放り込まれたら解凍してからファイル移動する
    if ext == '.zip':
        # すでに存在してるなら削除
        removeDirectory(srcPath)
        # フォルダーを作成
        os.mkdir(srcPath)

        with ZipFile(src, 'r') as z:
            z.extractall(srcPath)
    else:
        srcPath = src

    #outputPath = dir_path + "\\..\\application\\app\\src\\extension\\live2d"
    outputPath = dest
    # コピー
    copy_tree(srcPath, outputPath)