import React, { useCallback, useEffect, useState, useContext } from 'react';
// import { collection_activity_item_data } from '../../../data/collection_data';
import Link from 'next/link';
import Image from 'next/image';
import { getAxelarTxsHistory, getBlockExporerHistory, formatUsdcAmount, getChainIcon } from '../../common/utils';
import UserContext from '../UserContext';
import _, { omit } from 'lodash';
import moment from 'moment';
import { ChainConfigs } from '../EVM';
import { truncateStr } from '../../common/utils';
const chains = ChainConfigs;

const Activity_item = () => {
    const userContext = useContext(UserContext);
	const [filterVal, setFilterVal] = useState(null);
	function onlyUnique(value, index, self) {
		return self.indexOf(value) === index;
	}

	const [data, setData] = useState([]);
	const [allData, setAllData] = useState([]);
	const [filterData, setfilterData] = useState(['interchain', 'crosschain']);

	const [inputText, setInputText] = useState('');

	const handleFilter = (category) => {
		setData(allData.filter((item) => item.category === category));
	};
	const handleSubmit = (e) => {
		e.preventDefault();
		const newArray = allData.filter((item) => {
			return item.title.toLowerCase().includes(inputText);
		});
		setData(newArray);
		setInputText('');
	};

    const getAxelarTxs = useCallback(async() => {
        const results = await getAxelarTxsHistory();
        const formatted = [];

        const eventType = {
            "ContractCallWithToken(address,string,string,bytes32,bytes,string,uint256)": "Buy"
        }

        _.map(results.data, (res, resIndex) => {
            const eventTypeCall = eventType[res.call?.eventSignature] || 'ContractCall';
            // console.log(eventTypeCall);
            const price = eventTypeCall == 'Buy' ? formatUsdcAmount(res.call.returnValues.amount.hex) : '';
            const eventTime = moment.unix(res.call.created_at.ms / 1000);

            // find if call from our contract
            const isMsgSender = _.find(chains, {"messageSender": res.call.to});
            const toChain = _.find(chains, {"evmChain": res.approved.chain});

            if (!_.isNil(isMsgSender)) {
                formatted.push({
                    id: `https://testnet.axelarscan.io/gmp/${res.call.transactionHash}`,
                    image: '',
                    fromChain: getChainIcon(res.call.transaction.chainId),
                    toChain: getChainIcon(toChain.id),
                    title: `${eventTypeCall}`,
                    price: price,
                    time: eventTime.format('YYYY-MM-DD HH:mm:ss'),
                    category: 'crosschain',
                    hash: res.call.transactionHash
                })
            }
        })

        console.log(formatted);
        setAllData(_.merge(allData, formatted));
    }, []);

    const getBscExplorer = useCallback(async() => {
        const chain = _.find(chains, {"id": Number(window.ethereum.networkVersion)});

        const results = await getBlockExporerHistory(false, chain.oneNFT);
        const formatted = [];

        _.map(results.result, (res, resIndex) => {
            let eventTypeCall = 'Buy';

            if (res.from == "0x0000000000000000000000000000000000000000") {
                eventTypeCall = 'Mint';
            } else if (res.to == chain.nftMarketplace.toLowerCase()) {
                eventTypeCall = 'List';
            } else if (res.from == chain.nftMarketplace.toLowerCase() && Number(res.transactionIndex) > 2) {
                eventTypeCall = 'Buy';
            } else {
                eventTypeCall = 'Delist';
            }
            const eventTime = moment.unix(Number(res.timeStamp));
            const price = '';

            formatted.push({
                id: `${chain.blockExplorerUrl}/tx/${res.hash}`,
                image: '',
                fromChain: '',
                toChain: '',
                title: `${eventTypeCall}`,
                price: price,
                time: eventTime.format('YYYY-MM-DD HH:mm:ss'),
                category: 'interchain',
                hash: res.hash
            })

            setAllData(_.merge(allData, formatted));
        });
        // massage data
        // from: "0x0000000000000000000000000000000000000000" = mint
        // to: "0xa8ea7a97eb0ab5d4ccbafe82eb1941577f42abf7" = list
        // from: "0xa8ea7a97eb0ab5d4ccbafe82eb1941577f42abf7" = buy / delist
        // else buy
    }, [userContext.account])

	useEffect(() => {
        getAxelarTxs();
        getBscExplorer();
		setfilterData(filterData.filter(onlyUnique));
        setFilterVal(1);
        setData(allData.filter((item) => item.category === 'crosschain'));
	}, []);

	return (
		<>
			{/* <!-- Activity Tab --> */}
			<div className="tab-pane fade">
				{/* <!-- Records / Filter --> */}
				<div className="lg:flex">
					{/* <!-- Filters --> */}
					<aside className="basis-4/12 lg:pr-5">
						<form action="search" className="relative mb-12 block" onSubmit={handleSubmit}>
							<input
								type="search"
								className="text-jacarta-700 placeholder-jacarta-500 focus:ring-accent border-jacarta-100 w-full rounded-2xl border py-[0.6875rem] px-4 pl-10 dark:border-transparent dark:bg-white/[.15] dark:text-white dark:placeholder-white"
								placeholder="Search"
								value={inputText}
								onChange={(e) => setInputText(e.target.value)}
							/>
							<button
								type="submit"
								className="absolute left-0 top-0 flex h-full w-12 items-center justify-center rounded-2xl"
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									viewBox="0 0 24 24"
									width="24"
									height="24"
									className="fill-jacarta-500 h-4 w-4 dark:fill-white"
								>
									<path fill="none" d="M0 0h24v24H0z"></path>
									<path d="M18.031 16.617l4.283 4.282-1.415 1.415-4.282-4.283A8.96 8.96 0 0 1 11 20c-4.968 0-9-4.032-9-9s4.032-9 9-9 9 4.032 9 9a8.96 8.96 0 0 1-1.969 5.617zm-2.006-.742A6.977 6.977 0 0 0 18 11c0-3.868-3.133-7-7-7-3.868 0-7 3.132-7 7 0 3.867 3.132 7 7 7a6.977 6.977 0 0 0 4.875-1.975l.15-.15z"></path>
								</svg>
							</button>
						</form>

						<h3 className="font-display text-jacarta-500 mb-4 font-semibold dark:text-white">
                            Txs Type
						</h3>
						<div className="flex flex-wrap">
							{filterData.map((category, i) => {
								return (
									<button
										className={
											filterVal === i
												? 'dark:border-jacarta-600 group bg-accent border-jacarta-100 mr-2.5 mb-2.5 inline-flex items-center rounded-xl border px-4 py-3 border-transparent text-white dark:border-transparent'
												: 'dark:border-jacarta-600 dark:bg-jacarta-700 group dark:hover:bg-accent hover:bg-accent border-jacarta-100 mr-2.5 mb-2.5 inline-flex items-center rounded-xl border bg-white px-4 py-3 hover:border-transparent hover:text-white dark:text-white dark:hover:border-transparent'
										}
										key={i}
										onClick={() => {
											handleFilter(category);
											setFilterVal(i);
										}}
									>
										<svg
											className={
												filterVal === i
													? 'icon mr-2 h-4 w-4 fill-white'
													: 'icon fill-jacarta-700 mr-2 h-4 w-4 group-hover:fill-white dark:fill-white'
											}
										>
											<use xlinkHref={`/icons.svg#icon-${category}`}></use>
										</svg>
										<span className="text-2xs font-medium capitalize">{category}</span>
									</button>
								);
							})}
						</div>
					</aside>

					{/* <!-- Records --> */}
					<div className="mb-10 shrink-0 basis-8/12 space-y-5 lg:mb-0 lg:pr-10">
						{!_.isNil(data) && data.slice(0, 5).map((item) => {
							const { id, image, toChain, fromChain, title, price, time, category, hash } = item;
							const itemLink = image
								.split('/')
								.slice(-1)
								.toString()
								.replace('.jpg', '')
								.replace('.gif', '')
								.replace('_sm', '')
								.replace('avatar', 'item');
							return (
                                <Link href={id}>
                                    <a className="dark:bg-jacarta-700 dark:border-jacarta-700 border-jacarta-100 rounded-2.5xl relative flex items-center border bg-white p-8 transition-shadow hover:shadow-lg">
                                        {/* <figure className="mr-5 self-start">
                                            <Image
                                                src={image}
                                                alt={title}
                                                height={50}
                                                width={50}
                                                objectFit="cover"
                                                className="rounded-2lg"
                                                loading="lazy"
                                            />
                                        </figure> */}

                                        <div>
                                            <h3 className="font-display text-jacarta-700 mb-1 text-base font-semibold dark:text-white">
                                            <div style={{display: "flex", alignItems: "center"}}>

                                                {toChain != fromChain && <img className="h-5 w-5" src={fromChain} />}

                                                {toChain != fromChain && <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mx-1"> <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" /> </svg> }

                                                {toChain != fromChain && <img className="h-5 w-5 mr-3" src={toChain} />}
                                                {title}
                                            </div>
                                            </h3>
                                            <span className="dark:text-jacarta-200 text-jacarta-500 mb-3 block text-sm">
                                                {price}
                                            </span>
                                            <span className="text-jacarta-200 block text-xs">#{truncateStr(hash, 16)}</span>
                                            <span className="text-jacarta-300 block text-xs">{time}</span>
                                        </div>

                                        <div className="dark:border-jacarta-600 border-jacarta-100 ml-auto rounded-full border p-3">
                                            <svg className="icon fill-jacarta-700 dark:fill-white h-6 w-6">
                                                <use xlinkHref={`/icons.svg#icon-${category}`}></use>
                                            </svg>
                                        </div>
                                    </a>
                                </Link>
							);
						})}
					</div>

				</div>
			</div>
		</>
	);
};

export default Activity_item;
