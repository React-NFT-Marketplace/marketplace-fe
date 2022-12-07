import React, { useEffect } from "react";
import Collection_category from "../../src/components/collectrions/collection_category";
import {
  NewseLatter,
  Feature_collections,
  Partners,
  Browse_category,
  Hero_3,
  Bids,
} from "../../src/components/component";
import Meta from "../../src/components/Meta";

const Home_3 = () => {
  useEffect(() => {
    const header = document.querySelector("header");
    header.classList.add("bg-white/[.15]");
  }, []);

  return (
    <>
      <Meta title="Home 3 || MotM | NFT Marketplace" />
      <Hero_3 />
      <Browse_category />
      <Bids classes="dark:bg-jacarta-800 relative py-24" bgWhite={true} />
      <Collection_category />
      <Feature_collections bgWhite={true} />
      <NewseLatter bgWhite={false} />
      <Partners />
    </>
  );
};

export default Home_3;
