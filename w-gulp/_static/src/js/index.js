document.addEventListener('DOMContentLoaded', () => {
  modernFunction();
  highlightNav();
});

// Babelで変換されるかどうかのテストコード
const modernFunction = () => {
  const obj = { a: 'これが出力されれば', b: 'Babelを通じて' };
  const newObj = { ...obj, c: '正常に変換されてます' };
  console.log('Index.jsを読み込んでいます', newObj);
};

// ヘッダーナビ現在のページをハイライト
const highlightNav = () => {
    $('.header-nav a').each(function () {
      if (this.href == location.href) {
        $(this).parents('li').addClass('is-current');
      }
    });
};

// トップページswiper
if (document.querySelector('.top-swiper') !== null) {
  const topSwiper = new Swiper('.top-swiper', {
    autoplay: {
      delay: 1500,
      disableOnInteraction: false, //ユーザー操作後もオートプレイ続行
    },
    loop: true,
    speed: 400,
    slidesPerView: 1,
    centeredSlides: true,
    grabCursor: true,
  });
}
