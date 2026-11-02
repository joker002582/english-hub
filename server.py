# -*- coding: utf-8 -*-
"""
英途 EnglishHub 本地服务器（支持局域网访问）

用法：
    在本目录下运行  python server.py
    电脑自动打开 http://localhost:8000
    同一 WiFi 下的手机/平板用控制台里打印的「手机访问」地址打开

只用 Python 标准库，无需安装任何第三方包。
"""
import http.server
import os
import socket
import sys
import threading
import webbrowser

PORT = 8000
HERE = os.path.dirname(os.path.abspath(__file__))

# Windows 控制台默认编码可能是 GBK，打印中文前先尝试切到 UTF-8
try:
    sys.stdout.reconfigure(encoding="utf-8")
except Exception:
    pass


def lan_ip():
    """获取本机局域网 IP（不需要真的联网，只是借路由地址）"""
    s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    try:
        s.connect(("8.8.8.8", 80))
        return s.getsockname()[0]
    except OSError:
        return None
    finally:
        s.close()


class Handler(http.server.SimpleHTTPRequestHandler):
    """静态文件服务器：根目录就是本文件所在目录。"""

    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=HERE, **kwargs)

    def end_headers(self):
        # 关闭缓存：改完代码刷新页面就能看到最新效果
        self.send_header("Cache-Control", "no-cache, no-store, must-revalidate")
        super().end_headers()


def qr_url(url):
    """生成二维码图片地址（手机扫一扫即可打开，无需手动输入）"""
    return "https://api.qrserver.com/v1/create-qr-code/?size=260x260&data=" + url.replace("&", "%26")


def main():
    os.chdir(HERE)
    ip = lan_ip()
    try:
        # 监听 0.0.0.0 = 所有网卡，同一 WiFi 下的手机才能访问到
        server = http.server.ThreadingHTTPServer(("0.0.0.0", PORT), Handler)
    except OSError:
        print("[!] 端口 %d 被占用，请关闭占用该端口的程序，或修改上方 PORT 变量" % PORT)
        sys.exit(1)

    print("=" * 60)
    print("  英途 EnglishHub 已启动！")
    print("  电脑访问:  http://localhost:%d" % PORT)
    if ip:
        print("  手机访问:  http://%s:%d   (手机和电脑连同一个WiFi)" % (ip, PORT))
    else:
        print("  [!] 未检测到局域网 IP，手机可能无法访问")
    print("  按 Ctrl+C 停止服务器")
    print("=" * 60)
    print("[提示] 手机打不开时按顺序排查：")
    print("  1. 手机和电脑是否连的是同一个 WiFi（校园网可能隔离设备互访）；")
    print("  2. Windows 防火墙弹窗请点「允许访问」，没弹窗就手动放行 python.exe；")
    print("  3. 实在不行：手机开热点 → 电脑连手机热点，再用上面的手机地址。")
    print("[注意] 手机在局域网 http 下无法用麦克风功能（跟读评分/语音输入），")
    print("       朗读等其余功能正常；想要全功能 + 让外网的人也能访问，")
    print("       请按 README 里的「手机和其他人怎么访问」章节部署到 GitHub Pages。")

    threading.Timer(1.0, webbrowser.open, args=("http://localhost:%d/" % PORT,)).start()
    if ip:
        # 弹出一个二维码图片标签页，用手机相机扫一扫即可打开
        threading.Timer(2.5, webbrowser.open, args=(qr_url("http://%s:%d/" % (ip, PORT)),)).start()
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\n服务器已停止，再见！")


if __name__ == "__main__":
    main()
