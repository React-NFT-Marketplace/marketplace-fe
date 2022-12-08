/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useState } from "react";
import { trending_category_filter } from "../../data/categories_data";
import Link from "next/link";
import { HeadLine } from "../../src/components/component";
import Feature_collections_data from "../../data/Feature_collections_data";
import Collection_dropdown from "../../src/components/dropdown/collection_dropdown";
import Explore_collection_item from "../../src/components/collectrions/explore_collection_item";
import Head from "next/head";
import Meta from "../../src/components/Meta";
import { collectCollectionData } from "../../redux/counterSlice";
import { useDispatch } from "react-redux";

const Explore_collection = () => {
  const dispatch = useDispatch();
  const [collectionFilteredData, setCollectionFilteredData] = useState(
    Feature_collections_data
  );
  const [filterVal, setFilterVal] = useState(0);

  const handleItemFilter = (text) => {
    if (text === "all") {
      setCollectionFilteredData(Feature_collections_data);
    } else {
      setCollectionFilteredData(
        Feature_collections_data.filter((item) => item.category === text)
      );
    }
  };

  useEffect(() => {
    dispatch(collectCollectionData(collectionFilteredData.slice(0, 8)));
  }, [dispatch, collectionFilteredData]);

  return (
    <>
      <Meta title="Explore Collection || MotM | NFT Marketplace" />
      <section className="relative mt-24 lg:pb-48 pb-24">
        <picture className="pointer-events-none absolute inset-0 -z-10 dark:hidden">
          <img
            src="/images/gradient_light.jpg"
            alt="gradient"
            className="h-full"
          />
        </picture>

        <div className="container">
          <HeadLine
            text="Explore Collections"
            classes="font-display text-jacarta-700 py-16 text-center text-4xl font-medium dark:text-white"
          />

          {/* <!-- Filter --> */}
          <div className="mb-8 flex flex-wrap items-start justify-between">
            {/* dropdown */}
            <Collection_dropdown />
          </div>

          {/* <!-- Grid --> */}
          <div className="grid grid-cols-1 gap-[1.875rem] md:grid-cols-3 lg:grid-cols-4">
            <Explore_collection_item itemFor="explore-collection" />
          </div>
        </div>
      </section>
    </>
  );
};

export default Explore_collection;
