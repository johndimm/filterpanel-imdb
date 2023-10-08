import React, { useState } from 'react'
import FilterPanel from 'filterpanel'
//import FilterPanel from './filterpanel'
import Head from 'next/head'
import data from './ExampleData'
import styles from './Example.module.css'

const filterFields = [
	{ title: 'Size', field: 'size' },
	{ title: 'Color', field: 'color' },
	{ title: 'Shape', field: 'shape' }
]

const searchFields = ['name']

const Card = ({ item, onClick }) => {
	return (
		<div className={styles.card} onClick={onClick} title={item.title}>
			<div>
				{item.image}
				<br />
				{item.name}
			</div>
		</div>
	)
}

const Example = () => {
	const [filteredData, setFilteredData] = useState(data)

	const cards = filteredData.map((val, idx) => {
		return <Card item={val} key={idx} />
	})

	return (
		<div>
			<Head>
				<meta
					name='viewport'
					content='width=device-width, initial-scale=.5, maximum-scale=10.0, minimum-scale=.25, user-scalable=yes'
				/>
			</Head>
			<div className={styles.app}>
				<FilterPanel
					originalArray={data}
					callback={setFilteredData}
					filterFields={filterFields}
					searchFields={searchFields}
					debug={true}
				/>
				<div className={styles.cards}>{cards}</div>
			</div>
		</div>
	)
}

export default Example
