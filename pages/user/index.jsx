import React, { useEffect, useState } from "react";
import Image from "next/image";
import User_items from "../../src/components/user/User_items";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css"; // optional
import { CopyToClipboard } from "react-copy-to-clipboard";
import Meta from "../../src/components/Meta";
import { ellipsizeThis } from "../../src/common/utils";
import axios from 'axios';
import _ from 'lodash';
import { ChainConfigs } from '../../src/components/EVM';
import ContractCall from "../../src/components/EVM/ContractCall";
import UserContext from "../../src/components/UserContext";
import { useContext } from "react";

const User = () => {
  const [copied, setCopied] = useState(false);
  const [nfts, setNfts] = useState([]);
  const [listedNfts, setListedNfts] = useState([]);
  const [hasQueriedNfts, setHasQueriedNfts] = useState(false);
  const userContext = useContext(UserContext);

  useEffect(() => {

  }, [userContext.account]);

  useEffect(() => {
    if(!userContext.chain) {
      return;
    }

    if(hasQueriedNfts) {
      return;
    }

    setHasQueriedNfts(true);

    const getNfts = async() => {

      let newNFTs = [];

      await Promise.all(
        _.map(ChainConfigs, async(chain) => {
            if(!chain.oneNFT) {
              return;
            }

            let contract = new ContractCall(chain.id);
            let nfts = await contract.getAllNFTs();

            nfts.forEach(r => {
              newNFTs.push({
                ...r,
                chain: chain.id
              })
            })
        })
      );

      setListedNfts(newNFTs);
    }

    getNfts();
  }, [userContext.chain, hasQueriedNfts]);

  useEffect(() => {
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  }, [copied]);

  return (
    <>
      <Meta title="User || MotM | NFT Marketplace" />
      {/* <!-- Profile --> */}

      <div className="pt-[5.5rem] lg:pt-24">
        {/* <!-- Banner --> */}
        <div className="relative h-[18.75rem]">
          <Image
            src={'/images/user/axelar_banner.png'}
            alt="banner"
            layout="fill"
            objectFit="cover"
          />
        </div>
        {/* <!-- end banner --> */}
        <section className="dark:bg-jacarta-800 bg-light-base relative pb-12 pt-28">
          {/* <!-- Avatar --> */}
          <div className="absolute left-1/2 top-0 z-10 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center">
            <figure className="relative h-40 w-40 dark:border-jacarta-600 rounded-xl border-[5px] border-white">
              <Image
                src={'/images/user/axelar_logo.png'}
                alt='logo'
                layout="fill"
                objectFit="contain"
                className="dark:border-jacarta-600 rounded-xl border-[5px] border-white"
              />
              <div
                className="dark:border-jacarta-600 bg-green absolute -right-3 bottom-0 flex h-6 w-6 items-center justify-center rounded-full border-2 border-white"
                data-tippy-content="Verified Collection"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  width="24"
                  height="24"
                  className="h-[.875rem] w-[.875rem] fill-white"
                >
                  <path fill="none" d="M0 0h24v24H0z"></path>
                  <path d="M10 15.172l9.192-9.193 1.415 1.414L10 18l-6.364-6.364 1.414-1.414z"></path>
                </svg>
              </div>
            </figure>
          </div>

          <div className="container">
            <div className="text-center">
              <h2 className="font-display text-jacarta-700 mb-2 text-4xl font-medium dark:text-white">
                {ellipsizeThis(userContext.account, 5, 5)}
              </h2>
              <div className="dark:bg-jacarta-700 dark:border-jacarta-600 border-jacarta-100 mb-8 inline-flex items-center justify-center rounded-full border bg-white py-1.5 px-4">
                <Tippy content="ETH">
                  <svg className="icon h-4 w-4 mr-1">
                    <use xlinkHref="/icons.svg#icon-ETH"></use>
                  </svg>
                </Tippy>

                <Tippy
                  hideOnClick={false}
                  content={
                    copied ? <span>copied</span> : <span>copy</span>
                  }
                >
                  <button className="js-copy-clipboard dark:text-jacarta-200 max-w-[10rem] select-none overflow-hidden text-ellipsis whitespace-nowrap">
                    <CopyToClipboard
                      text={userContext.account}
                      onCopy={() => setCopied(true)}
                    >
                      <span>{ellipsizeThis(userContext.account, 10, 10)}</span>
                    </CopyToClipboard>
                  </button>
                </Tippy>
              </div>

              <p className="dark:text-jacarta-300 mx-auto mb-2 max-w-xl text-lg">
                Axelar makes cross chain transactions easy.
              </p>
              <span className="text-jacarta-400">
                Joined December 2022
              </span>
            </div>
          </div>
        </section>
        {/* <!-- end profile --> */}
        <User_items
          items={nfts}
          listedItems={listedNfts}
          canList={true}
        />
      </div>
    </>
  );
};

export default User;
