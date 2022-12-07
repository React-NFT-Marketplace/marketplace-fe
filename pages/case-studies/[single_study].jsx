import React from 'react';
import { useRouter } from 'next/router';
import Post from '../../src/components/case-studies/post';
import Approach from '../../src/components/case-studies/approach';
import Results from '../../src/components/case-studies/results';
import Testimonial from '../../src/components/testimonial/testimonial';
import Related_studies from '../../src/components/case-studies/related_studies';
import Meta from '../../src/components/Meta';

const SingleStudy = () => {
	const router = useRouter();
	const pid = router.query.single_study;

	return (
		<div className="mt-[95px]">
			<Meta title="Single_study || MotM | NFT Marketplace" />
			<Post url={pid} />
			<Approach />
			<Results />
			<Testimonial bg_jacerta={true} />
			<Related_studies />
		</div>
	);
};

export default SingleStudy;
