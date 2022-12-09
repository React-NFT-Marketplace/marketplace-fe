import React, { useEffect, useState, useContext, useMemo } from 'react';
import { useRouter } from 'next/router';
import { collection_item_data } from '../../data/collection_data';
import Auctions_dropdown from '../../src/components/dropdown/Auctions_dropdown';
import Social_dropdown from '../../src/components/dropdown/Social_dropdown';
import Collection_items from '../../src/components/collectrions/Collection_items';
import Image from 'next/image';
import Link from 'next/link';
import Head from 'next/head';
import Meta from '../../src/components/Meta';
import { ChainConfigs } from '../../src/components/EVM';
import ContractCall from "../../src/components/EVM/ContractCall";
import UserContext from '../../src/components/UserContext';
import _ from 'lodash';
import { getChainIcon } from '../../src/common/utils';

const Collection = () => {
	const router = useRouter();
	const chainId = router.query.chainId;
	const [nfts, setNfts] = useState([]);
	const userContext = useContext(UserContext);
	const chain = useMemo(() => {
		return _.find(ChainConfigs, {id: Number(chainId)});
	}, [chainId]);

	useEffect(() => {
		if(!chainId) {
			return;
		}

		//get collection NFTs
		const getNFTs = async() => {
			try {
				let contract = new ContractCall(chainId);
				let nfts = await contract.getAllNFTs();
				let ret = [];
				nfts.forEach(nft => {
					ret.push({
						...nft,
						chain: chainId,
						isListed: true,
					});
				});

				setNfts(ret);
			}
	
			catch(e) {
				console.error(e);
			}
		}

		getNFTs();
	}, [chainId, userContext.account]);

	return (
		<>
			<Meta title={`MotM | NFT Marketplace`} />

			<div className="pt-[5.5rem] lg:pt-24">
				{/* <!-- Banner --> */}
				<div className="relative h-[150px]">
					{/* <Image
						src="/images/collections/collection_banner.jpg"
						alt="banner"
						layout="fill"
						objectFit="cover"
					/> */}
				</div>
				{/* <!-- end banner --> */}

				{/* <!-- Profile --> */}
				<section className="dark:bg-jacarta-800 bg-light-base relative pb-12 pt-28">
					{/* <!-- Avatar --> */}
					<div className="absolute left-1/2 top-0 z-10 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center">
						<figure className="relative h-40 w-40 dark:border-jacarta-600 rounded-xl border-[5px] border-white">
							<Image
								src={getChainIcon(Number(chainId))}
								alt={'icon'}
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
								Collection ({chain?.name})
							</h2>
							{/* <div className="mb-8">
								<span className="text-jacarta-400 text-sm font-bold">Created by </span>
								<Link href="/user">
									<a className="text-accent text-sm font-bold">{creator}</a>
								</Link>
							</div> */}

							{/* <div className="dark:bg-jacarta-800 dark:border-jacarta-600 border-jacarta-100 mb-8 inline-flex flex-wrap items-center justify-center rounded-xl border bg-white">
								{details.map(({ id, detailsNumber, detailsText }) => {
									return (
										<Link href="#" key={id}>
											<a className="dark:border-jacarta-600 border-jacarta-100 w-1/2 rounded-l-xl border-r py-4 hover:shadow-md sm:w-32">
												<div className="text-jacarta-700 mb-1 text-base font-bold dark:text-white">
													{detailsNumber}
												</div>
												<div className="text-2xs dark:text-jacarta-400 font-medium tracking-tight">
													{detailsText}
												</div>
											</a>
										</Link>
									);
								})}
							</div> */}

							<p className="dark:text-jacarta-300 mx-auto max-w-xl text-lg mt-8">Test NFT on {chain?.name}</p>

							{/* <div className="mt-6 flex items-center justify-center space-x-2.5 relative">
								<div className="dark:border-jacarta-600 dark:hover:bg-jacarta-600 border-jacarta-100 hover:bg-jacarta-100 dark:bg-jacarta-700 rounded-xl border bg-white">

									<div
										className="js-likes relative inline-flex h-10 w-10 cursor-pointer items-center justify-center text-sm"
										onClick={() => handleLikes()}
									>
										<button>
											{likesImage ? (
												<svg className="icon dark:fill-jacarta-200 fill-jacarta-500 h-4 w-4">
													<use xlinkHref="/icons.svg#icon-heart-fill"></use>
												</svg>
											) : (
												<svg className="icon dark:fill-jacarta-200 fill-jacarta-500 h-4 w-4">
													<use xlinkHref="/icons.svg#icon-heart"></use>
												</svg>
											)}
										</button>
									</div>
								</div>

								<Social_dropdown />

								<Auctions_dropdown classes="dark:border-jacarta-600 dark:hover:bg-jacarta-600 border-jacarta-100 dropdown hover:bg-jacarta-100 dark:bg-jacarta-700 rounded-xl border bg-white relative" />
							</div> */}
						</div>
					</div>
				</section>

				{/* <!-- end profile --> */}
			</div>
			{
				nfts.length > 0?
				<Collection_items 
					items={nfts}
				/> :
				<div className='flex items-center justify-center py-10'>Loading..</div>

			}
		</>
	);
};

export default Collection;
