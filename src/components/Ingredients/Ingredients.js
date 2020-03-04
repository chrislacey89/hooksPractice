import React, { useReducer, useState, useEffect, useCallback } from 'react';
import axios from 'axios';

import IngredientForm from './IngredientForm';
import IngredientList from './IngredientList';
import ErrorModal from '../UI/ErrorModal';
import Search from './Search';

const ingredientReducer = (currentIngredients, action) => {
	switch (action.type) {
		case 'SET':
			return action.ingredients;
		case 'ADD':
			return [...currentIngredients, action.ingredient];
		case 'DELETE':
			return currentIngredients.filter(ing => ing.id !== action.id);
		default:
			throw new Error('Should not get there!');
	}
};

const Ingredients = () => {
	const [userIngredients, dispatch] = useReducer(ingredientReducer, []);
	// const [userIngredients, setUserIngredients] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState();

	useEffect(() => {
		console.log('RENDERING INGREDIENTS', userIngredients);
	}, [userIngredients]);

	const filteredIngredientsHandler = useCallback(filteredIngredients => {
		// setUserIngredients(filteredIngredients);
		dispatch({ type: 'SET', ingredients: filteredIngredients });
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
				// setUserIngredients(prevIngredients => [
				// 	...prevIngredients,
				// 	{ id: res.data.name, ...ingredient }
				// ]);
				dispatch({
					type: 'ADD',
					ingredient: { id: res.name, ...ingredient }
				});
			})
			.catch(error => {
				setError('Something went wrong!');
				setIsLoading(false);
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

				// setUserIngredients(filteredArray);
				dispatch({ type: 'DELETE', id: id });
			})
			.catch(error => {
				setError('Something went wrong!');
				setIsLoading(false);
			});
	};
	const clearError = () => {
		setError(null);
	};

	return (
		<div className='App'>
			{error && <ErrorModal onClose={clearError}>{error}</ErrorModal>}
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
