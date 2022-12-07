import React from "react";
import Story from "../../src/components/about/story";
import Meta from "../../src/components/Meta";

const newsletter = () => {
  return (
    <div>
      <Meta title="newseletter || MotM | NFT Marketplace" />
      <div className="pt-[5.5rem] lg:pt-24">
        <Story compFor="news" />
      </div>
    </div>
  );
};

export default newsletter;
