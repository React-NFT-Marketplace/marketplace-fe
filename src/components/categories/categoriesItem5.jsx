import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";
import { delistModalShow, listModalShow, updateDelistModalProps, updateListModalProps } from "../../../redux/counterSlice";
import { ellipsizeThis, getChainIcon, toLocaleDecimal } from "../../common/utils";
import { ChainConfigs } from "../EVM";
import { useDispatch } from "react-redux";
import { BigNumber } from "ethers";
import axios from "axios";

const CategoryItem5 = ({items}) => {
  const dispatch = useDispatch();
  const [itemsWithMetadata, setItemsWithMetadata] = useState([]);

  useEffect(() => {
    let newItemsWithMetadata = [];

    const getItems = async() => {

    items.forEach(async(item) => {
        let res = await axios.get(item.tokenURI.replace("https://ipfs.moralis.io:2053/ipfs/", "https://gateway.moralisipfs.com/ipfs/"));

        item.metadata = res.data;
        newItemsWithMetadata.push(item);

        if(newItemsWithMetadata.length == items.length) {
          setItemsWithMetadata(newItemsWithMetadata);
        }
      });
    }

    getItems();
  }, [items]);

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
          itemId,
          tokenId,
          tokenURI,
          holder,
          chain,
          metadata
        } = item;
        
        const id = BigNumber.from(tokenId).toNumber();
        const chainConfig = _.find(ChainConfigs, {id: Number(chain)});

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

                <div className="mt-8 flex items-center justify-between">
                  <button
                    className="text-accent font-display text-sm font-semibold"
                    onClick={() => {
                      dispatch(listModalShow());
                      dispatch(updateListModalProps({
                        chainId: Number(chain),
                        tokenId: tokenId,
                      }));
                    }}
                  >
                    List now
                  </button>
                </div>
            </div>
          </article>
        );
      })}
    </div>
  );
};

export default CategoryItem5;
