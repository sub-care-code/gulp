# タスクランナー

## gulp の使い方

1. gulp ディレクトリを開く
2. \_gulp ディレクトリで npm install で node_modules をインストール
3. gulp でタスクランナーの起動
4. \_static ディレクトリに移動
5. src ディレクトリでで編集する
6. dest ディレクトリに HTML、CSS、JavaScript のコンパイルされたファイルが作られる
7. dest ディレクトリに作られるファイルなどは src ディレクトリで削除しても消えないので注意

## .gitignore ファイルで node_modules はコミットしないように設定中

<br>

# git にコミットしない方法

## ディレクトリを指定する場合

node_modules/

### ファイルのパターン一致でコンパイルなどで生成したファイルを指定する場合

_.com
_.class
_.dll
_.exe
_.o
_.so
<br>

## src ディレクトリ構成

```
.
├── css
│   └── vendors
│       └── swiper.min.css
├── images
├── index.html
├── js
│   ├── index.js
│   └── vendors
│       └── swiper.min.js
└── scss
    ├── base
    │   ├── _base.scss
    │   ├── _index.scss
    │   └── _reset.scss
    ├── foundation
    │   ├── _index.scss
    │   ├── mixin
    │   │   ├── _breakpoint.scss
    │   │   ├── _index.scss
    │   │   └── _mixins.scss
    │   └── setting
    │       ├── _font.scss
    │       ├── _functions.scss
    │       ├── _index.scss
    │       ├── _space.scss
    │       └── _vars.scss
    ├── layout
    │   ├── _footer.scss
    │   ├── _header.scss
    │   ├── _index.scss
    │   └── _main.scss
    ├── object
    │   ├── _index.scss
    │   ├── component
    │   │   ├── _btn.scss
    │   │   ├── _icon.scss
    │   │   ├── _index.scss
    │   │   └── _page-top.scss
    │   └── project
    │       ├── _about.scss
    │       └── _index.scss
    └── style.scss

```
