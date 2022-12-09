import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";
import { buyModalShow, delistModalShow, updateBuyModalProps, updateDelistModalProps } from "../../../redux/counterSlice";
import { ellipsizeThis, getChainIcon, toLocaleDecimal } from "../../common/utils";
import { ChainConfigs } from "../EVM";
import { useDispatch } from "react-redux";
import { BigNumber } from "ethers";
import axios from "axios";

const CategoryItem3 = ({items, listedItems}) => {
  const dispatch = useDispatch();
  const [itemsWithMetadata, setItemsWithMetadata] = useState([]);

  useEffect(() => {
    if(itemsWithMetadata.length == items.length) {
      return;
    }

    let newItemsWithMetadata = [];
    setItemsWithMetadata(items);

    const getItems = async() => {
      items.forEach(async(item) => {
        let { data } = await axios.get(item.tokenURI.replace("https://ipfs.moralis.io:2053/ipfs/", "https://gateway.moralisipfs.com/ipfs/"));
        item.metadata = data;
        newItemsWithMetadata.push(item);

        if(newItemsWithMetadata.length == items.length) {
          setItemsWithMetadata(newItemsWithMetadata);
        }
      });
    }

    getItems();
  }, [items, itemsWithMetadata]);

  return (
    <div className="grid grid-cols-1 gap-[1.875rem] md:grid-cols-2 lg:grid-cols-4">
      {itemsWithMetadata.map((item) => {
        /**
         * [
                {
                    "collection": "bscNFT",
                    "nft": "0xa0d58e0C914FBC2A54852a4AABFD9B60D77F4f1f",
                    "tokenId": 1,
                    "tokenURI": "https://ipfs.moralis.io:2053/ipfs/QmVAvweaXekLyfLYuXs5rSsEsTcx8gHt5wCKwnov9ZQq21/metadata/BscTest/ancient-doge",
                    "holder": "0x6f210bee122F6B0A5009AF8b1606b09327001B97",
                    "chain": "97",
                    "metadata": {
                      "name": "ancient doge",
                      "creator": "0x1cc5F2F37a4787f02e18704D252735FB714f35EC",
                      "image": "https://ipfs.moralis.io:2053/ipfs/QmS1SP3MaE1Cz4wAiukEm8zsNf3baiV3D5Wjd22ah7kfQn/BscTest/ancient-doge",
                      "description": "BscTest's ancient doge"
                    }
                },
            ]
         */
        const {
          collection: collectionName,
          nft,
          tokenId,
          tokenURI,
          holder,
          chain,
          metadata
        } = item;

        let listDetails = listedItems.filter(x => BigNumber.from(x.tokenId).toNumber() == tokenId && !x.sold);
        const isListed = listDetails.length > 0;
        const price = isListed? BigNumber.from(listDetails[0].sellingPrice).toNumber() / Math.pow(10, 6) : 0; //update this
        const seller = isListed? listDetails[0].seller : "";

        const id = BigNumber.from(tokenId).toNumber();
        const chainConfig = _.find(ChainConfigs, {id: Number(chain)});
        const itemId = isListed? BigNumber.from(listDetails[0].itemId).toNumber() : undefined;

        return (
          <article key={id + '-nftitem'}>
            <div className="dark:bg-jacarta-700 dark:border-jacarta-700 border-jacarta-100 rounded-2.5xl block border bg-white p-[1.1875rem] transition-shadow hover:shadow-lg">
              <figure className="relative">
                <Link href={`/item`}>
                  <a>
                    {
                      metadata?.image?
                      <img
                        src={metadata.image}
                        alt={`Item #${id}`}
                        className="w-full h-[230px] rounded-[0.625rem] object-cover"
                      /> : 
                      <div className="w-full h-[230px] rounded-[0.625rem] flex items-center justify-center">Loading..</div>
                    }
                  </a>
                </Link>

                <div className="absolute bottom-3">
                  <div className="flex -space-x-2">
                    <Link href={`/item}`}>
                      <a>
                        <Tippy content={<span>{chainConfig.name}</span>}>
                          <img
                            src={getChainIcon(Number(chain))}
                            alt="Chain"
                            className="dark:border-jacarta-600 hover:border-accent dark:hover:border-accent h-6 w-6 rounded-full border-2 border-white"
                          />
                        </Tippy>
                      </a>
                    </Link>
                  </div>
                </div>
              </figure>
              <div className="mt-7 flex items-center justify-between">
                <Link href={`/collection/${chain}`}>
                  <a>
                    <span className="font-display text-jacarta-700 hover:text-accent text-base dark:text-white">
                      {collectionName}
                    </span>
                  </a>
                </Link>
                <Link href={`/item`}>
                  <a>
                    <span className="font-display text-jacarta-700 hover:text-accent text-base dark:text-white">
                      {metadata?.name ?? "Loading.."}
                    </span>
                  </a>
                </Link>
              </div>
              {
                seller &&
                <div className="mt-2 text-sm">
                  <span className="dark:text-jacarta-200 text-jacarta-700 mr-1">
                    Seller: {ellipsizeThis(seller, 5, 5)}
                  </span>
                  <span className="mb-1 flex items-center whitespace-nowrap">
                    <span data-tippy-content="USDC">
                      <svg className="h-4 w-4">
                        <use xlinkHref="/icons.svg#icon-usdc"></use>
                      </svg>
                    </span>
                    <span className="dark:text-jacarta-100 text-sm font-medium tracking-tight ml-2">
                      {toLocaleDecimal(price, 3, 3)}
                    </span>
                  </span>
                </div>
              }

              {
                isListed &&
                seller.toLowerCase() != window.ethereum?.selectedAddress.toLowerCase() &&
                <div className="mt-8 flex items-center justify-between">
                  <button
                    className="text-accent font-display text-sm font-semibold"
                    onClick={() => {
                      dispatch(buyModalShow());
                      dispatch(updateBuyModalProps({
                        image: metadata.image,
                        name: metadata.name,
                        collectionName,
                        price,
                        itemId,
                        chainId: chain,
                      }));
                    }}
                  >
                    Buy now
                  </button>
                  <Link href={`/item`}>
                    <a className="group flex items-center">
                      <svg className="icon icon-history group-hover:fill-accent dark:fill-jacarta-200 fill-jacarta-500 mr-1 mb-[3px] h-4 w-4">
                        <use xlinkHref="/icons.svg#icon-history"></use>
                      </svg>
                      <span className="group-hover:text-accent font-display dark:text-jacarta-200 text-sm font-semibold">
                        View History
                      </span>
                    </a>
                  </Link>
                </div>
              }
              {
                isListed &&
                seller.toLowerCase() == window.ethereum?.selectedAddress.toLowerCase() &&
                <div className="mt-8 flex items-center justify-between">
                  <button
                    className="text-accent font-display text-sm font-semibold"
                    onClick={() => {
                      dispatch(delistModalShow());
                      dispatch(updateDelistModalProps({
                        chainId: chain,
                        itemId: BigNumber.from(itemId).toNumber(),
                      }));
                    }}
                  >
                    Delist
                  </button>
                  <Link href={`/item`}>
                    <a className="group flex items-center">
                      <svg className="icon icon-history group-hover:fill-accent dark:fill-jacarta-200 fill-jacarta-500 mr-1 mb-[3px] h-4 w-4">
                        <use xlinkHref="/icons.svg#icon-history"></use>
                      </svg>
                      <span className="group-hover:text-accent font-display dark:text-jacarta-200 text-sm font-semibold">
                        View History
                      </span>
                    </a>
                  </Link>
                </div>
              }
            </div>
          </article>
        );
      })}
    </div>
  );
};

export default CategoryItem3;
