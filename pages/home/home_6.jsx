import React from 'react';
import Meta from '../../src/components/Meta';
import Download from '../../src/components/blog/download';
import { Auctions_categories, Bids, Browse_category, Partners } from '../../src/components/component';
import Collection_category from '../../src/components/collectrions/collection_category';
import Hero_6 from '../../src/components/hero/hero_6';
import Testimonial from '../../src/components/blog/testimonial';

const Home_6 = () => {
	return (
		<>
			<Meta title="Home 6 || MotM | NFT Marketplace" />
			<Hero_6 />
			<Bids />
			<Collection_category bgWhite={true} />
			<Auctions_categories />
			<Browse_category bgWhite={true} />
			<Testimonial bgWhite={true} />
			<Partners />
			<Download />
		</>
	);
};

export default Home_6;
