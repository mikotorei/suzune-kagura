"""写真館に写真を1枚追加するための下ごしらえ。

使い方:
  python3 scripts/photo.py <元の画像> <画像の名前> [--room 番号] [--focus 0〜1] [--blur x1,y1,x2,y2 ...]

  例) python3 scripts/photo.py ~/IMG_7020.png 2026-11-27-01 --room 1

やること:
  - public/images/photos/<名前>-full.webp  … 長い辺 1600px まで、切り抜きなし（展示室・拡大用）
  - public/images/photos/<名前>-thumb.webp … 4:3 に切り抜いた 640x480（写真館の壁・ホームの背景用）
  - --blur で指定した長方形（元画像の座標）をぼかす（キャラ名を隠すとき）
  - src/content/photos/<名前>.yaml のひな形を書く（すでにあれば書かない）
"""
import argparse
import pathlib

from PIL import Image, ImageFilter

ROOT = pathlib.Path(__file__).resolve().parent.parent

ap = argparse.ArgumentParser()
ap.add_argument('src')
ap.add_argument('name')
ap.add_argument('--room', type=int)
ap.add_argument('--blur', nargs='*', default=[])
ap.add_argument('--focus', type=float, help='縦長の写真の切り抜き位置（0＝上端、0.5＝真ん中、1＝下端）。顔の高さに合わせる')
args = ap.parse_args()

im = Image.open(args.src).convert('RGB')
for box in args.blur:
    x1, y1, x2, y2 = map(int, box.split(','))
    region = im.crop((x1, y1, x2, y2)).filter(ImageFilter.GaussianBlur(14))
    im.paste(region, (x1, y1))

out = ROOT / 'public/images/photos'
out.mkdir(parents=True, exist_ok=True)

full = im.copy()
full.thumbnail((1600, 1600), Image.LANCZOS)
full.save(out / f'{args.name}-full.webp', quality=82, method=6)

w, h = im.size
tw = min(w, int(h * 4 / 3))
th = int(tw * 3 / 4)
if args.focus is not None:  # 指定した高さを中心に切り抜く
    top = min(max(int(h * args.focus - th / 2), 0), h - th)
else:
    top = 0 if h > w else (h - th) // 2  # 縦長は顔が入るように上寄り
thumb = im.crop(((w - tw) // 2, top, (w - tw) // 2 + tw, top + th)).resize((640, 480), Image.LANCZOS)
thumb.save(out / f'{args.name}-thumb.webp', quality=80, method=6)

yml = ROOT / f'src/content/photos/{args.name}.yaml'
if not yml.exists():
    lines = [
        f'date: {args.name[:10]}',
        f'image: {args.name}',
        f'width: {full.width}',
        f'height: {full.height}',
    ]
    if args.room:
        lines += [f'room: {args.room}', 'comment: ""', '# name: 提供者の名前', '# x: https://x.com/アカウント']
    yml.write_text('\n'.join(lines) + '\n', encoding='utf-8')

print(f'{args.name}: full {full.width}x{full.height} / thumb 640x480')
