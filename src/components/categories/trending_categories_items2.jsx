import React, { useEffect, useState } from "react";
import CategoryItem from "./categoryItem";
import Recently_added_dropdown from "../dropdown/recently_added_dropdown";
import { cloneObj } from "../../common/utils";
import CategoryItem2 from "./categoryItem2";

const Trending_categories_items = ({items, canList = false}) => {
  const [currentItems, setCurrentItems] = useState([]);
  const [currentSort, setCurrentSort] = useState(1);

  /*
  // trendingCategoryData
  {
    image: "/images/products/item_5.jpg",
    id: "Flourishing Cat #1800",
    category: "art",
    title: "Flourishing Cat #180",
    nfsw: true,
    lazyMinted: false,
    verified: true,
    addDate: 1,
    sortPrice: 8.49,
    price: "From 8.49 ETH",
    bidLimit: 8,
    bidCount: 2,
    likes: 15,
    creator: {
      name: "Sussygirl",
      image: "/images/avatars/creator_1.png",
    },
    owner: {
      name: "Sussygirl",
      image: "/images/avatars/owner_1.png",
    },
  }
  */

  const sortText = [
    {
      id: 1,
      text: "Recently Added",
    },
    {
      id: 2,
      text: "Price: Low to High",
    },
    {
      id: 3,
      text: "Price: High to Low",
    },
  ];

  useEffect(() => {
    let currentItems = cloneObj(items);

    /* switch(currentSort) {
      case 1: // recently added
        currentItems = currentItems.sort((a,b) => a.addDate > b.addDate? 1 : -1 );
        break;
      case 2: // Price Low to High
        currentItems = currentItems.sort((a,b) => a.sortPrice > b.sortPrice? 1 : -1 );
        break;
      case 3: // Price High to Low
        currentItems = currentItems.sort((a,b) => a.sortPrice < b.sortPrice? 1 : -1 );
        break;
      default:
        break;
    } */
    
    setCurrentItems(currentItems);
  }, [items, currentSort]);

  return (
    <>
      {/* <!-- Filter --> */}
      <div className="mb-8 flex flex-wrap items-center justify-between">
        {/* dropdown */}
        <Recently_added_dropdown 
          data={sortText} 
          dropdownFor="recently_added" 
          onSortChange={(sort) => { setCurrentSort(sort) }}
        />
      </div>

      {/* <!-- Grid --> */}
      <CategoryItem2 items={currentItems} canList={canList}/>
    </>
  );
};

export default Trending_categories_items;
