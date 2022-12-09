import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";
import { buyModalShow, updateBuyModalProps } from "../../../redux/counterSlice";
import { getChainIcon } from "../../common/utils";
import { ChainConfigs } from "../EVM";
import { useDispatch } from "react-redux";
import { BigNumber } from "ethers";

const CategoryItem2 = ({items}) => {
  const dispatch = useDispatch();

  return (
    <div className="grid grid-cols-1 gap-[1.875rem] md:grid-cols-2 lg:grid-cols-4">
      {items.map((item) => {
        /**
         * [
              {
                  "token_address": "0x0bd341f2783e3d2fdfaf9c46d45f0de57feaef39",
                  "token_id": "5",
                  "owner_of": "0x2438939dd447e6a223c14968bd6a18920b98da5f",
                  "block_number": "25273760",
                  "block_number_minted": "25273760",
                  "token_hash": "8a9a1c104475fd76b342f6c793ab3100",
                  "amount": "1",
                  "contract_type": "ERC721",
                  "name": "bscNFT",
                  "symbol": "bNFT",
                  "token_uri": "https://ipfs.moralis.io:2053/ipfs/QmNVMJTPbgHxVvrEgHRCuArBh8TeoBuKvp3r4ETccindtY/Screenshot 2022-12-08 at 3.08.19 PM.png",
                  "metadata": null,
                  "last_token_uri_sync": "2022-12-08T11:38:21.161Z",
                  "last_metadata_sync": "2022-12-08T13:50:07.912Z",
                  "minter_address": null,
                  "chain": 97
              }
          ]
         */
        const {
          tokenId,
          tokenURI: image,
          chain
        } = item;

        const price = 10; //update this

        const id = BigNumber.from(tokenId).toNumber();
        const fromChain = _.find(ChainConfigs, {id: Number(chain)});

        return (
          <article key={id}>
            <div className="dark:bg-jacarta-700 dark:border-jacarta-700 border-jacarta-100 rounded-2.5xl block border bg-white p-[1.1875rem] transition-shadow hover:shadow-lg">
              <figure className="relative">
                <Link href={`/item`}>
                  <a>
                    <img
                      src={image}
                      alt={`Item #${id}`}
                      className="w-full h-[230px] rounded-[0.625rem] object-cover"
                    />
                  </a>
                </Link>

                <div className="absolute bottom-3">
                  <div className="flex -space-x-2">
                    <Link href={`/item}`}>
                      <a>
                        <Tippy content={<span>{fromChain.name}</span>}>
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
                <Link href={`/item`}>
                  <a>
                    <span className="font-display text-jacarta-700 hover:text-accent text-base dark:text-white">
                      Item #{id}
                    </span>
                  </a>
                </Link>
              </div>
              <div className="mt-2 text-sm">
                <span className="dark:text-jacarta-200 text-jacarta-700 mr-1">
                  {0}
                </span>
                <span className="dark:text-jacarta-300 text-jacarta-500">
                  {0}/{0}
                </span>
              </div>

              {
                item.isListed &&
                <div className="mt-8 flex items-center justify-between">
                  <button
                    className="text-accent font-display text-sm font-semibold"
                    onClick={() => {
                      dispatch(buyModalShow());
                      dispatch(updateBuyModalProps({
                        image,
                        name: `Item ${id}`,
                        collectionName: `Collection (${fromChain.name})`,
                        price
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
            </div>
          </article>
        );
      })}
    </div>
  );
};

export default CategoryItem2;
