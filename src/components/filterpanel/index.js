import React, { useState, useEffect, createRef, useRef, useCallback } from 'react'
import FeatureFilter from './FeatureFilter'
import SearchFilter from './SearchFilter'

const FilterPanel = ({ originalArray, callback, query, filterFields, searchFields, debug }) => {
	const [refs, setRefs] = useState([])
	const [outputMasks, setoutputMasks] = useState([])
	const [inputMasks, setinputMasks] = useState([])

	useEffect(() => {
		// Load the arrays with "true", so everything is by default on.
		const allIn = originalArray.map((val, idx) => {
			return true
		})

		let masks = []
		for (let i = 0; i < filterFields.length + 1; i++) masks.push(allIn)

		setoutputMasks(masks)
		setinputMasks(masks)

		setRefs(
			Array(filterFields.length)
				.fill()
				.map((_, i) => refs[i] || createRef())
		)
	}, [originalArray, filterFields])

	const aggregateMasks = (sourceIdx, outputMask) => {
		outputMasks[sourceIdx] = outputMask
		setoutputMasks(outputMasks)

		// Make a mask for each filter that merges all the other filter masks.
		const inputMasks = outputMasks.map((outputMask, filterIdx) => {
			return outputMask.map((val, idx) => {
				let allTrue = true
				for (var i = 0; i < outputMasks.length; i++) {
					if (i != filterIdx && !outputMasks[i][idx]) {
						allTrue = false
						break
					}
				}
				return allTrue
			})
		})

		setinputMasks(inputMasks)

		// Send results to parent.
		// First, make a mask over all feature filters.
		let globalMask = []
		outputMask.forEach((val, idx) => {
			let allTrue = val
			for (var i = 0; i < outputMasks.length; i++) {
				if (!outputMasks[i][idx]) {
					allTrue = false
					break
				}
			}
			globalMask.push(allTrue)
		})

		// Second, gather the original records using the global mask.
		let filteredData = []
		globalMask.forEach((val, idx) => {
			if (val) filteredData.push(originalArray[idx])
		})

		callback(filteredData)
	}

	const clearInterface = (e) => {
		e.preventDefault()
		setoutputMasks([])
		setinputMasks([])
		refs.forEach((ref) => {
			ref.current.clear()
		})
	}

	const filters = filterFields.map((val, idx) => {
		const sortOrder = 'order' in val ? val.order : 'frequency'

		const debugMasks =
			idx in inputMasks && idx in outputMasks && debug ? (
				<div className='fp_debug'>
					in: {JSON.stringify(inputMasks[idx]).replace(/true/g, '1').replace(/false/g, '0')}
					<br />
					out: {JSON.stringify(outputMasks[idx]).replace(/true/g, '1').replace(/false/g, '0')}
				</div>
			) : null

		return (
			<div key={idx}>
				<FeatureFilter
					title={val.title}
					ref={refs[idx]}
					originalArray={originalArray}
					field={val.field}
					order={sortOrder}
					callback={(data) => aggregateMasks(idx, data)}
					inputMasks={inputMasks[idx]}
					isList={val.isList}
				/>
				{debugMasks}
			</div>
		)
	})

	const idx = filterFields.length

	// console.log('FilterPanel, query', query)

	return (
		<div className='fp_filter_panel'>
			<div className='fp_buttons'>
				<div className='fp_home_button' onClick={() => (window.location.href = '/')}>
					home
				</div>
				<div className='fp_clear_button' onClick={clearInterface}>
					clear
				</div>
			</div>

			<SearchFilter
				title='Search'
				originalArray={originalArray}
				callback={(data) => aggregateMasks(idx, data)}
				query={query}
				searchFields={searchFields}
			/>
			{filters}
		</div>
	)
}

export default FilterPanel
