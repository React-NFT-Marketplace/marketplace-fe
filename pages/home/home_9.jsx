import React, { useEffect, useState } from "react";
import Benifits from "../../src/components/dao/Benifits";
import Intro from "../../src/components/dao/Intro";
import Participate from "../../src/components/dao/Participate";
import NewseLatter2 from "../../src/components/dao/newseLatter2";
import { Partners } from "../../src/components/component";
import Hero_9 from "../../src/components/hero/hero_9";
import Meta from "../../src/components/Meta";
import TrustedPartner from "../../src/components/dao/TrustedPartner";

const Home_9 = () => {
  useEffect(() => {
    const header = document.querySelector("header");
    header.classList.add("bg-white/[.15]");
  }, []);

  return (
    <>
      <Meta title="Home 9 || MotM | NFT Marketplace" />
      <Hero_9 />
      <Partners />
      <Intro />
      <Benifits />
      <Participate />
      <TrustedPartner />
      <NewseLatter2 bgWhite={false} />
    </>
  );
};

export default Home_9;
