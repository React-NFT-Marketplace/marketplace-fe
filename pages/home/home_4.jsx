import React from 'react';
import {
	Auctions_categories,
	Feature_collections,
	NewseLatter,
	Partners,
	Top_collection,
} from '../../src/components/component';
import Meta from '../../src/components/Meta';
import Hero_4 from '../../src/components/hero/hero_4';
import CoverflowCarousel from '../../src/components/carousel/coverflowCarousel';

const Home_4 = () => {
	return (
		<>
			<Meta title="Home 4 || MotM | NFT Marketplace" />
			<Hero_4 />
			<CoverflowCarousel />
			<Top_collection />
			<Auctions_categories />
			<NewseLatter bgWhite={true} />
			<Feature_collections />
			<Partners />
		</>
	);
};

export default Home_4;
