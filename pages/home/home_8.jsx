import React, { useEffect } from "react";
import Meta from "../../src/components/Meta";
import { Partners } from "../../src/components/component";
import Hero_8 from "../../src/components/hero/hero_8";
import Intro_video from "../../src/components/intro_video";
import Characters from "../../src/components/characters";
import Statistic from "../../src/components/promo/statistic";
import Statistic_promo_2 from "../../src/components/promo/statistic_promo_2";
import Features from "../../src/components/features/features";
import Newsletter from "../../src/components/nwesletter/newsletter";
import { useTheme } from "next-themes";

const Home_8 = () => {
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setTheme("dark");
  }, [setTheme]);

  return (
    <>
      <Meta title="Home 8 || MotM | NFT Marketplace" />
      <Hero_8 />
      <Intro_video />
      <Characters />
      <Statistic />
      <Statistic_promo_2 />
      <Features />
      <Newsletter />
      <Partners />
    </>
  );
};

export default Home_8;
