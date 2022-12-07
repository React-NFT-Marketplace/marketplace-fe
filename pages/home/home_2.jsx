import React from 'react';
import Hero_2 from '../../src/components/hero/hero_2';
import {
	Top_collection,
	Auctions_categories,
	NewseLatter,
	Feature_collections,
	Partners,
} from '../../src/components/component';
import Meta from '../../src/components/Meta';

const Home_2 = () => {
	return (
		<>
			<Meta title="Home 2 || MotM | NFT Marketplace" />
			<Hero_2 />
			<Top_collection />
			<Auctions_categories />
			<NewseLatter />
			<Feature_collections />
			<Partners />
		</>
	);
};

export default Home_2;
