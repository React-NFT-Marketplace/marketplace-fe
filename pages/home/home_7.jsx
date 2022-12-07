import React from "react";
import Meta from "../../src/components/Meta";
import { Partners } from "../../src/components/component";
import Hero_7 from "../../src/components/hero/hero_7";
import Services from "../../src/components/services/services";
import Promo from "../../src/components/promo/promo";
import Testimonial from "../../src/components/testimonial/testimonial";
import Faq from "../../src/components/faq/faq";
import Cta from "../../src/components/cta/cta";
import Financialnews from "../../src/components/blog/financialnews";

const Home_7 = () => {
  return (
    <>
      <Meta title="Home 7 || MotM | NFT Marketplace" />
      <Hero_7 />
      <Partners />
      <Services />
      <Promo />
      <Testimonial />
      <Faq />
      <Financialnews />
      <Cta />
    </>
  );
};

export default Home_7;
