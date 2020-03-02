import React, { useState, useEffect } from 'react';
import axios from 'axios';

import Card from '../UI/Card';
import './Search.css';

const Search = React.memo(props => {
	const { onLoadIngredients } = props;
	const [enteredFilter, setEnteredFilter] = useState('');

	useEffect(() => {
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
		// will only run if entered filter or onLoadIng changes
	}, [enteredFilter, onLoadIngredients]);

	return (
		<section className='search'>
			<Card>
				<div className='search-input'>
					<label>Filter by Title</label>
					<input
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
