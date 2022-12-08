import React from 'react';
import {
	Hero,
	Bids,
	Top_collection,
	Tranding_category,
	NewseLatter,
} from '../../src/components/component';
import Meta from '../../src/components/Meta';

const Home_1 = () => {
	return (
		<main>
			<Meta title="MotM | NFT Marketplace" />
			<Hero />
			<Bids />
			<Top_collection />
			<Tranding_category />
			<NewseLatter />
		</main>
	);
};

export default Home_1;
