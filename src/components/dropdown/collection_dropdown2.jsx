import React, { useEffect, useState } from 'react';
import { runIfFunction } from '../../common/utils';

const Collection_dropdown2 = ({ data, collection, onItemChange }) => {
	const [dropdown, setDropdown] = useState(false);
	const [activeItem, setActiveItem] = useState(null);
	const handleDropdown = () => {
		window.addEventListener('click', (w) => {
			if (w.target.closest('.dropdown-toggle')) {
				if (dropdown) {
					setDropdown(false);
				} else {
					setDropdown(true);
				}
			} else {
				setDropdown(false);
			}
		});
	};

	useEffect(() => {
		if(!activeItem) {
			return;
		}
		
		runIfFunction(onItemChange, Number(activeItem));
	}, [activeItem, onItemChange]);

	return (
		<>
			<div
				className={
					dropdown
						? 'overlay h-[100vh] dropdown-toggle w-[100vw] fixed top-0 left-0 opacity-0 show bg-red z-40 cursor-default'
						: 'overlay h-[100vh] w-[100vw] fixed top-0 left-0 opacity-0 hidden bg-red z-40 cursor-default'
				}
				onClick={() => handleDropdown()}
			></div>
			<div
				className="dark:bg-jacarta-700 dropdown-toggle border-jacarta-100 dark:border-jacarta-600 dark:text-jacarta-300 flex items-center justify-between rounded-lg border bg-white py-3 px-3 show z-50 relative"
				onClick={() => handleDropdown()}
			>
				{
					!activeItem? 
					<>
					<span className="">Select Chain</span>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 24 24"
						width="24"
						height="24"
						className="fill-jacarta-500 h-4 w-4 dark:fill-white"
					>
						<path fill="none" d="M0 0h24v24H0z" />
						<path d="M12 13.172l4.95-4.95 1.414 1.414L12 16 5.636 9.636 7.05 8.222z" />
					</svg>
					</> :
					<>
					<span className="flex items-center space-x-3">
						<img src={data.filter(item => item.id == activeItem)[0].image} className="h-8 w-8 rounded-full" loading="lazy" alt="chain" />
						<span className="">{data.filter(item => item.id == activeItem)[0].text}</span>
					</span>
					</>
				}
				
			</div>

			<div
				className={
					dropdown
						? 'absolute dark:bg-jacarta-800 whitespace-nowrap w-full rounded-xl bg-white py-4 px-2 text-left shadow-xl show z-50'
						: 'absolute dark:bg-jacarta-800 whitespace-nowrap w-full rounded-xl bg-white py-4 px-2 text-left shadow-xl hidden z-50'
				}
			>
				<ul className="scrollbar-custom flex max-h-48 flex-col overflow-y-auto">
					{data.map((item) => {
						const { id, text, image } = item;
						return (
							<li key={id}>
								<button
									href="#"
									className="dropdown-item font-display dark:hover:bg-jacarta-600 hover:bg-jacarta-50 flex w-full items-center justify-between rounded-xl px-5 py-2 text-left text-sm transition-colors dark:text-white"
									onClick={() => setActiveItem(id)}
								>
									<span className="flex items-center space-x-3">
										<img src={image} className="h-8 w-8 rounded-full" loading="lazy" alt="avatar" />
										<span className="text-jacarta-700 dark:text-white">{text}</span>
									</span>
									{activeItem === id && (
										<svg
											xmlns="http://www.w3.org/2000/svg"
											viewBox="0 0 24 24"
											width="24"
											height="24"
											className="fill-accent mb-[3px] h-4 w-4"
										>
											<path fill="none" d="M0 0h24v24H0z"></path>
											<path d="M10 15.172l9.192-9.193 1.415 1.414L10 18l-6.364-6.364 1.414-1.414z"></path>
										</svg>
									)}
								</button>
							</li>
						);
					})}
				</ul>
			</div>
		</>
	);
};

export default Collection_dropdown2;
