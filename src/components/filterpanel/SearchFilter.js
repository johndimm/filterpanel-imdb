import React, { useState, useEffect } from 'react'

const SearchFilter = ({ title, originalArray, callback, query, searchFields }) => {
	const [queryString, setQueryString] = useState(query)

	const exactMatch = (query) => {
		let searchMask
		if (query === '') searchMask = originalArray.map((val) => true)
		else {
			// Lower-case the query.
			const regex = new RegExp(query, 'i')
			searchMask = originalArray.map((val, idx) => {
				let found = false

				// Use a for loop so we can abort after finding a match, 
				// since one match is enough.
				for (var i = 0; i < searchFields.length; i++) {
					if (regex.test(val[searchFields[i]])) {
						found = true
						break
					}
				}
				return found
			})

			setQueryString(query)
		}

		callback(searchMask)
	}

	useEffect(() => {
		if (query && query.length > 0) {
			exactMatch(query)
		}
	}, [query])

	const newQuery = (query, e) => {
		setQueryString(query)
		exactMatch(query)
		e.preventDefault()
	}

	const clearSearch = (e) => {
		newQuery('', e)
		document.getElementById("inputQuery").value = ''
	}

	return (
		<div className='fp_feature_filter'>
			<h3>{title}</h3>
			<form onSubmit={(e) => newQuery(e.target[0].value, e)}>
				<input id="inputQuery" type='text' name='query' defaultValue={queryString} />
				<span className='fp_clear_search' onClick={clearSearch}>
					X
				</span>
			</form>
		</div>
	)
}

export default SearchFilter
