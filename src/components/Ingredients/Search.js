import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

import Card from '../UI/Card';
import './Search.css';

const Search = React.memo(props => {
	const { onLoadIngredients } = props;
	const [enteredFilter, setEnteredFilter] = useState('');
	const inputRef = useRef();

	useEffect(() => {
		const timer = setTimeout(() => {
			// enteredFilter will not be the current input, but the old one set .5 seconds ago
			//inputRef is defined outside of closure, so it is not effected
			if (enteredFilter === inputRef.current.value) {
				const query =
					enteredFilter.length === 0
						? ''
						: `?orderBy="title"&equalTo="${enteredFilter}"`;
				axios
					.get(
						'https://react-hooks-practice-8d702.firebaseio.com/ingredients.json' +
							query
					)
					.then(responseData => {
						const loadedIngredients = [];
						const data = responseData.data;
						console.log(data);
						for (const key in data) {
							loadedIngredients.push({
								id: key,
								title: data[key].title,
								amount: data[key].amount
							});
						}
						onLoadIngredients(loadedIngredients);
					});
			}
		}, 500);
		//clean up effect
		return () => {
			clearTimeout(timer);
		};

		// will only run if entered filter or onLoadIng changes
	}, [enteredFilter, onLoadIngredients, inputRef]);

	return (
		<section className='search'>
			<Card>
				<div className='search-input'>
					<label>Filter by Title</label>
					<input
						ref={inputRef}
						type='text'
						value={enteredFilter}
						onChange={event => setEnteredFilter(event.target.value)}
					/>
				</div>
			</Card>
		</section>
	);
});

export default Search;
