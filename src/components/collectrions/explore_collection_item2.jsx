import { BigNumber } from 'ethers';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Feature_collections_data from '../../../data/Feature_collections_data';
import { getChainIcon, runIfFunction } from '../../common/utils';
import { ChainConfigs } from '../EVM';
import ContractCall from '../EVM/ContractCall';

const Explore_collection_item2 = ({ onFinishLoad }) => {
	const [collections, setCollections] = useState([]);

	useEffect(() => {
		let collections = [];
		_.map(ChainConfigs, async(chain) => {
            let contract = new ContractCall(chain.id);
			let oneNFT = contract.getOneNFTContract(true);
            let itemsCount = await oneNFT.getCurrentId();
            let name = await oneNFT.name();

			collections.push({
				id: chain.id,
				bigImage: getChainIcon(chain.id),
				title: name,
				itemsCount: BigNumber.from(itemsCount).toNumber(),
			});

            setCollections(collections);
            if(collections.length == 5 /* currently only has 5 collections */) {
                runIfFunction(onFinishLoad)
            }
		});
	}, []);

	return (
		<>
			{collections.map((item) => {
				const {
					id,
					bigImage,
					title,
					itemsCount,
				} = item;
				return (
					<article key={id}>
						<div className="dark:bg-jacarta-700 dark:border-jacarta-700 border-jacarta-100 rounded-2xl border bg-white p-[1.1875rem] transition-shadow hover:shadow-lg">
							<Link href={`/collection/${id}`}>
								<a className="flex space-x-[0.625rem]">
									<span className="w-[100%]">
										<img
											src={bigImage}
											alt="item 1"
											className="h-full w-full rounded-[0.625rem] object-cover"
											loading="lazy"
										/>
									</span>
								</a>
							</Link>

							<Link href={`/collection/${id}`}>
								<a className="font-display hover:text-accent dark:hover:text-accent text-jacarta-700 mt-4 block text-base dark:text-white">
									{title}
								</a>
							</Link>

							<div className="mt-2 flex items-center justify-between text-sm font-medium tracking-tight">
								<span className="dark:text-jacarta-300 text-sm">{itemsCount} Items</span>
							</div>
						</div>
					</article>
				);
			})}
		</>
	);
};

export default Explore_collection_item2;
