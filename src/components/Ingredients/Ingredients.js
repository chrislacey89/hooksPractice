import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

import IngredientForm from './IngredientForm';
import IngredientList from './IngredientList';
import Search from './Search';

const Ingredients = () => {
	const [userIngredients, setUserIngredients] = useState([]);
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		console.log('RENDERING INGREDIENTS', userIngredients);
	}, [userIngredients]);

	const filteredIngredientsHandler = useCallback(filteredIngredients => {
		setUserIngredients(filteredIngredients);
	}, []);

	const addIngredientHandler = ingredient => {
		setIsLoading(true);
		axios
			.post(
				'https://react-hooks-practice-8d702.firebaseio.com/ingredients.json',
				{
					title: ingredient.title,
					amount: ingredient.amount
				}
			)
			.then(res => {
				setIsLoading(false);
				setUserIngredients(prevIngredients => [
					...prevIngredients,
					{ id: res.data.name, ...ingredient }
				]);
			});
	};

	const removeItemHandler = id => {
		setIsLoading(true);
		axios
			.delete(
				`https://react-hooks-practice-8d702.firebaseio.com/ingredients/${id}.json`
			)
			.then(res => {
				setIsLoading(false);
				const filteredArray = userIngredients.filter(item => item.id !== id);

				setUserIngredients(filteredArray);
			});

		// const result = words.filter(word => word.length > 6);
	};

	return (
		<div className='App'>
			<IngredientForm
				onAddIngredient={addIngredientHandler}
				loading={isLoading}
			/>

			<section>
				<Search onLoadIngredients={filteredIngredientsHandler} />
				<IngredientList
					ingredients={userIngredients}
					onRemoveItem={removeItemHandler}
				/>
			</section>
		</div>
	);
};

export default Ingredients;
