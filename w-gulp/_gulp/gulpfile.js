// gulpコマンドの省略
const { src, dest, watch, lastRun, series, parallel } = require('gulp');
const gulp = { src, dest, watch, lastRun, series, parallel };
//コマンドgulp

// Sass
const sass = require('gulp-dart-sass');
const notify = require('gulp-notify');
const plumber = require('gulp-plumber');
const postCss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const gcmq = require('gulp-group-css-media-queries');
const cssnano = require('gulp-cssnano');
// const rename = require("gulp-rename");
// wordpressでは使用しない

// JavaScript
const babel = require('gulp-babel');
const terser = require('gulp-terser'); //ES6(ES2015)の圧縮に対応

// 画像圧縮
const imageMin = require('gulp-imagemin');
const pngQuant = require('imagemin-pngquant');
const mozJpeg = require('imagemin-mozjpeg');
const svgo = require('gulp-svgo');
const webp = require('gulp-webp'); //webpに変換

// ブラウザ同期
const browserSync = require('browser-sync').create();

// 削除
const clean = require('gulp-clean');

// localでの使用
// 出力先をlocalのフォルダに変更する

const userDir = require('os').homedir();
const themeDir = `${userDir}/Local Sites/wptest/app/public/wp-content/themes/wptest`;
//出力元フォルダ
const srcPath = '../_static/src';
//パス設定
const paths = {
  php: {
    src: srcPath + '/**/*.php',
    copy: srcPath + '/**/*.php',
    dist: themeDir + '/',
    distCopy: themeDir + '/',
  },
  styles: {
    src: srcPath + '/scss/**/*.scss',
    copy: srcPath + '/css/vendors/*.css',
    dist: themeDir + '/',
    distCopy: themeDir + '/assets/css/vendors/',
  },
  scripts: {
    src: ['../_static/src/js/**/*.js', '!../_static/src/js/**/vendors/*.js'], //外部のライブラリファイルはコンパイルしない
    copy: srcPath + '/js/**/vendors/*.js',
    dist: themeDir + '/assets/js/',
  },
  images: {
    src: srcPath + '/images/**/*.{jpg,jpeg,png,gif,svg}',
    srcWebp: srcPath + '/images/**/*.{jpg,jpeg,png}',
    dist: themeDir + '/assets/images/',
    distWebp: themeDir + '/assets/images/webp/',
  },

  clean: {
    all: themeDir + '/',
    assets: ['../_static/dest//assets/css/', '../_static/dest//assets/js/'],
    php: themeDir + '/!(assets)**',
    css: themeDir + '/assets/css/',
    js: themeDir + '/assets/js/',
    images: themeDir + '/assets/images/',
  },
};

// phpの作成
const phpCompile = () => {
  return src(paths.php.src)
    .pipe(
      plumber({
        // エラーがあっても処理を止めない
        errorHandler: notify.onError('Error: <%= error.message %>'),
      })
    )
    .pipe(dest(paths.php.dist))
    .pipe(browserSync.stream());
};
// Sassコンパイル
const sassCompile = () => {
  return (
    src(paths.styles.src, {
      // ソースマップの出力の有無
      sourcemaps: true,
    })
      .pipe(
        plumber({
          // エラーがあっても処理を止めない
          errorHandler: notify.onError('Error: <%= error.message %>'),
        })
      )
      // scss→cssコンパイル
      .pipe(
        sass({
          //出力時の形式（下記詳細）
          /*
           *https://utano.jp/entry/2018/02/hello-sass-output-style/
           */
          outputStyle: 'compressed',
        }).on('error', sass.logError)
      )
      .pipe(
        postCss([
          autoprefixer({
            //ベンダープレフィックス追加※設定はpackage.jsonに記述
            cascade: false, // プロパティのインデントを整形しない
            grid: 'autoplace', // IE11のgrid対応
          }),
        ])
      )
      //メディアクエリをまとめる
      .pipe(gcmq())
      //圧縮
      .pipe(cssnano())
      .pipe(
        dest(paths.styles.dist, {
          // ソースマップを出力する場合のパス
          sourcemaps: './map',
        })
      )
      //変更があった所のみコンパイル
      .pipe(browserSync.stream())
  );
};

// JavaScriptコンパイル
const jsCompile = () => {
  return src(paths.scripts.src)
    .pipe(
      plumber({
        // エラーがあっても処理を止めない
        errorHandler: notify.onError('Error: <%= error.message %>'),
      })
    )
    .pipe(
      babel({
        presets: ['@babel/preset-env'],
      })
    )
    .pipe(terser()) //圧縮
    .pipe(dest(paths.scripts.dist));
};

// 画像圧縮
const imagesCompress = () => {
  return src(paths.images.src, {
    since: lastRun(imagesCompress),
  })
    .pipe(
      plumber({
        // エラーがあっても処理を止めない
        errorHandler: notify.onError('Error: <%= error.message %>'),
      })
    )
    .pipe(
      imageMin(
        [
          mozJpeg({
            quality: 80, //画質
          }),
          pngQuant(
            [0.6, 0.8] //画質の最小,最大
          ),
        ],
        {
          verbose: true, //メタ情報削除
        }
      )
    )
    .pipe(
      svgo({
        plugins: [
          {
            removeViewbox: false, //フォトショやイラレで書きだされるviewboxを消すかどうか※表示崩れの原因になるのでfalse推奨。以降はお好みで。
          },
          {
            removeMetadata: false, //<metadata>を削除するかどうか
          },
          {
            convertColors: false, //rgbをhexに変換、または#ffffffを#fffに変換するかどうか
          },
          {
            removeUnknownsAndDefaults: false, //不明なコンテンツや属性を削除するかどうか
          },
          {
            convertShapeToPath: false, //コードが短くなる場合だけ<path>に変換するかどうか
          },
          {
            collapseGroups: false, //重複や不要な`<g>`タグを削除するかどうか
          },
          {
            cleanupIDs: false, //SVG内に<style>や<script>がなければidを削除するかどうか
          },
          // {
          //   mergePaths: false,//複数のPathを一つに統合
          // },
        ],
      })
    )
    .pipe(dest(paths.images.dist));
};

// webp変換
// ※案件によってはIE対応が必要なので、混在しないように別フォルダに出力しています。
const webpConvert = () => {
  return src(paths.images.srcWebp, {
    since: lastRun(webpConvert),
  })
    .pipe(
      plumber({
        // エラーがあっても処理を止めない
        errorHandler: notify.onError('Error: <%= error.message %>'),
      })
    )
    .pipe(webp())
    .pipe(dest(paths.images.distWebp));
};

// PHPファイルコピー（vendorsフォルダの中身はコンパイルしない
const phpCopy = () => {
  return src(paths.php.copy).pipe(dest(paths.php.distCopy));
};
// CSSファイルコピー（vendorsフォルダの中身はコンパイルしない
const cssCopy = () => {
  return src(paths.styles.copy).pipe(dest(paths.styles.distCopy));
};

// JSファイルコピー（vendorsフォルダの中身はコンパイルしない
const jsCopy = () => {
  return src(paths.scripts.copy).pipe(dest(paths.scripts.dist));
};

// ローカルサーバー起動
// const browserSyncFunc = (done) => {
//   browserSync.init({
//     //デフォルトの connected のメッセージ非表示
//     proxy: "http://wptest.local",
//     notify: false,
//     server: {
//       baseDir: "../",
//     },
//     reloadOnRestart: true,
//   });
//   done();
// };

const browserSyncFunc = (done) => {
  browserSync.init({
    proxy: 'http://wptest.local',
    reloadOnRestart: true,
  });
  done();
};

// ブラウザ自動リロード
const browserReloadFunc = (done) => {
  browserSync.reload();
  done();
};

// ファイル監視
function watchFiles() {
  watch(paths.php.src, series(phpCompile, browserReloadFunc));
  watch(paths.php.copy, series(phpCopy, browserReloadFunc));
  watch(paths.styles.src, series(sassCompile, browserReloadFunc));
  watch(paths.styles.copy, series(cssCopy, browserReloadFunc));
  watch(paths.scripts.src, series(jsCompile, browserReloadFunc));
  watch(paths.scripts.copy, series(jsCopy, browserReloadFunc));
  watch(
    paths.images.src,
    series(imagesCompress, webpConvert, browserReloadFunc)
  );
}

// npx gulp のコマンドで実行される処理
exports.default = series(
  parallel(
    phpCompile,
    phpCopy,
    sassCompile,
    cssCopy,
    jsCompile,
    jsCopy,
    imagesCompress,
    webpConvert
  ),
  parallel(watchFiles, browserSyncFunc)
);
