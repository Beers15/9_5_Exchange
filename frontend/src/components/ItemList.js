import React, {useEffect, useState} from 'react';
import {connect} from 'react-redux';
import {populateItems} from '../redux/actions/itemActions';
import {NavLink} from 'react-router-dom';

const ItemList = ({items, isLoggedIn, dispatch}) => {
    useEffect(() => {   
        dispatch(populateItems());
    }, []);

    return (
        <div className="pt-5 container">
            <p className="display-4">Currently posted on the Exchange</p><hr></hr><br />
            <div className="justify-content-center pt-2" style={{display: 'flex', flexWrap: 'wrap'}}>
                {items.length < 1 && (
                    <p>There aren't any items posted by sellers at this time. Please check again soon! </p>
                )}
                {items.map((item, key) => {
                    return (
                        <div key={key}>
                            <br />
                            <div className="card b-3 bg-light px-4 pt-3 pb-3 mx-4 col-md-11">  
                                <div className="card-header border">
                                
                                {item.name}</div>
                                <div className="card-body">
                                    <h5 className="card-title">${item.price}</h5>
                                    <div></div>
                                    <p className="card-text">{item.description}</p>
                                    <hr/>
                                    <p className="card-text">Seller: {item.seller}</p>

                                    <div>
                                        <NavLink className="btn btn-secondary" to={{pathname:`/item`, search: `?id=${item._id}`}} >View Item</NavLink>
                                    </div>
                                    <br/>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );  
}

const mapStateToProps = state => ({
    items: state.itemReducer.items,
    isLoggedIn: state.userReducer.isLoggedIn,
    role: state.userReducer.role,
    user: state.userReducer.user
});

export default connect(mapStateToProps)(ItemList);