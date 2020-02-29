import React, { useState, useEffect } from 'react';
import axios from 'axios';

import IngredientForm from './IngredientForm';
import IngredientList from './IngredientList';
import Search from './Search';

const Ingredients = () => {
	const [userIngredients, setUserIngredients] = useState([]);

	useEffect(() => {
		axios
			.get('https://react-hooks-practice-8d702.firebaseio.com/ingredients.json')
			.then(responseData => {
				const loadedIngredients = [];
				// for (const key in res.data) {
				// 	loadedIngredients.push({
				// 		id: key,
				// 		title: res.data.title,
				// 		amount: res.data.amount
				// 	});
				// }
				const data = responseData.data;
				console.log(data);
				for (const key in data) {
					loadedIngredients.push({
						id: key,
						title: data[key].ingredient.title,
						amount: data[key].ingredient.amount
					});
				}
				// let data = res.data;
				// console.log(res);

				// let mapTest = data.map();
				// console.log(mapTest);
				setUserIngredients(loadedIngredients);
				console.log(loadedIngredients);
			});
	}, []);

	const addIngredientHandler = ingredient => {
		axios
			.post(
				'https://react-hooks-practice-8d702.firebaseio.com/ingredients.json',
				{
					ingredient
				}
			)
			.then(res =>
				setUserIngredients(prevIngredients => [
					...prevIngredients,
					{ id: res.data.name, ...ingredient }
				])
			);
	};

	const removeItemHandler = id => {
		console.log('remove');
		console.log(id);
		const filteredArray = userIngredients.filter(item => item.id !== id);
		setUserIngredients(filteredArray);
		// const result = words.filter(word => word.length > 6);
	};

	return (
		<div className='App'>
			<IngredientForm onAddIngredient={addIngredientHandler} />

			<section>
				<Search />
				<IngredientList
					ingredients={userIngredients}
					onRemoveItem={removeItemHandler}
				/>
			</section>
		</div>
	);
};

export default Ingredients;
