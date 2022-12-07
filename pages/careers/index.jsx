import React from 'react';
import Careers_title from '../../src/components/careers/careers_title';
import Positions from '../../src/components/careers/positions';
import Meta from '../../src/components/Meta';
import Parks from '../../src/components/careers/parks';
import { Partners } from '../../src/components/component';

const Careers = () => {
	return (
		<div className="mt-[95px]">
			<Meta title="Careers || MotM | NFT Marketplace" />
			<Careers_title />
			<Positions />
			<Parks />
			<Partners />
		</div>
	);
};

export default Careers;
