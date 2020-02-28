import HomePopular from './popular/home-popular';
import HomeDescription from './description/home-description';
import HomeBanner from './banner/home-banner';

class Home {
  constructor(parent) {
    const homePopularBlocks = [].slice.call(parent.querySelectorAll('.home-popular'));
    const homeDescriptionBloks = [].slice.call(parent.querySelectorAll('.home-description'));
    const homeBannerBloks = [].slice.call(parent.querySelectorAll('.home-banner'));

    homePopularBlocks.forEach((homePopularBlock) => {
      new HomePopular(homePopularBlock);
    });

    homeDescriptionBloks.forEach((homeDescriptionBlok) => {
      new HomeDescription(homeDescriptionBlok);
    });

    homeBannerBloks.forEach((homeBannerBlok) => {
      new HomeBanner(homeBannerBlok);
    });
  }
}

export default Home;
