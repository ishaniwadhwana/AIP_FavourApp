import React, { Fragment } from 'react';

const PageHandler = ({ itemsPerPage, totalItems, paginate }) => {
    const pageNumbers = [];

    // To get number of pages 
    for (let i = 1; i <= Math.ceil(totalItems / itemsPerPage); i++) {
        pageNumbers.push(i);
    }

    return (
        <Fragment>
            <ul className='pagination'>
                {pageNumbers.map(number => (
                    <li key={number} className='page-item'>
                        <a onClick={() => paginate(number)} href='#!' className='page-link'>
                            {number}
                        </a>
                    </li>
                ))}
            </ul>
        </Fragment>
    );
};

export default PageHandler;
