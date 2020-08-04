import React from 'react'

import styles from './controls.module.css'

function Controls ({items}) {
    return (
        <div className={styles.wrapper}>
            React PDF
            <div className={styles.controls}>
                {
                    items.map((item, index) => <div className="control__item" key={index}>{item}</div>)
                }
            </div>
        </div>
    )
}

export default Controls