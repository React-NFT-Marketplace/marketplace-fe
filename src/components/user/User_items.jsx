import React, { useContext, useEffect, useState } from "react";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import Activity_item from "../collectrions/Activity_item";
import Image from "next/image";
import Feature_collections_data from "../../../data/Feature_collections_data";
import Trending_categories_items2 from "../categories/trending_categories_items2";
import { trendingCategoryData } from "../../../data/categories_data";

import "react-tabs/style/react-tabs.css";
import Explore_collection_item from "../collectrions/explore_collection_item";
import UserContext from "../UserContext";

const User_items = ({ items, listedItems, canList }) => {
  const [itemActive, setItemActive] = useState(1);
  const [itemsOnSale, setItemsOnSale] = useState([]);
  const userContext = useContext(UserContext);

  useEffect(() => {
    console.log(items);
  }, [items]);

  useEffect(() => {
    if(!listedItems) {
      return;
    }

    if(!userContext || !userContext.account) {
      return;
    }
    setItemsOnSale(listedItems.filter(item => item.seller == userContext.account));
  }, [listedItems, userContext]);

  return (
    <>
      <section className="relative py-24">
        <picture className="pointer-events-none absolute inset-0 -z-10 dark:hidden">
          {/* <img src="img/gradient_light.jpg" alt="gradient" className="h-full w-full" /> */}
          <Image
            src="/images/gradient_light.jpg"
            alt="gradient"
            className="h-full w-full"
            layout="fill"
          />
        </picture>
        <div className="container">
          {/* <!-- Tabs Nav --> */}
          <Tabs className="tabs">
            <TabList className="nav nav-tabs scrollbar-custom mb-12 flex items-center justify-start overflow-x-auto overflow-y-hidden border-b border-jacarta-100 pb-px dark:border-jacarta-600 md:justify-center">
              <Tab
                className="nav-item"
                role="presentation"
                onClick={() => setItemActive(1)}
              >
                <button
                  className={
                    itemActive === 1
                      ? "nav-link hover:text-jacarta-700 text-jacarta-400 relative flex items-center whitespace-nowrap py-3 px-6 dark:hover:text-white active"
                      : "nav-link hover:text-jacarta-700 text-jacarta-400 relative flex items-center whitespace-nowrap py-3 px-6 dark:hover:text-white"
                  }
                >
                  <svg className="icon mr-1 h-5 w-5 fill-current">
                    <use xlinkHref={`/icons.svg#icon-on-sale`}></use>
                  </svg>
                  <span className="font-display text-base font-medium">
                    On Sale ({itemsOnSale.length})
                  </span>
                </button>
              </Tab>
              <Tab
                className="nav-item"
                role="presentation"
                onClick={() => setItemActive(2)}
              >
                <button
                  className={
                    itemActive === 2
                      ? "nav-link hover:text-jacarta-700 text-jacarta-400 relative flex items-center whitespace-nowrap py-3 px-6 dark:hover:text-white active"
                      : "nav-link hover:text-jacarta-700 text-jacarta-400 relative flex items-center whitespace-nowrap py-3 px-6 dark:hover:text-white"
                  }
                >
                  <svg className="icon mr-1 h-5 w-5 fill-current">
                    <use xlinkHref={`/icons.svg#icon-owned`}></use>
                  </svg>
                  <span className="font-display text-base font-medium">
                    Owned ({items.length})
                  </span>
                </button>
              </Tab>
            </TabList>

            <TabPanel>
              <div>
                {/* <!-- Filter --> */}
                <Trending_categories_items2 
                  items={listedItems}
                />
              </div>
            </TabPanel>
            <TabPanel>
              <div>
                {/* <!-- Filter --> */}
                <Trending_categories_items2
                  items={items}
                  canList={true}
                />
              </div>
            </TabPanel>
          </Tabs>
        </div>
      </section>
    </>
  );
};

export default User_items;
