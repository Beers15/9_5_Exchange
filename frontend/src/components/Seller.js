import React, {useState} from 'react';
import {Link} from 'react-router-dom';
import {connect} from 'react-redux';
import {setName, setPrice, setDescription, postItemToDB} from '../redux/actions/itemActions';

const Seller = ({isLoggedIn, dispatch, role, user, items, name}) => {
    const [showSoldItems, toggleShowSoldItems] = useState(false);
    const [showListedItems, toggleShowListedItems] = useState(false);
    const [showPostForm, toggleShowPostForm] = useState(true);
    const [showFeedback, setShowFeedback] = useState(false);

    const attemptPost = (event) => {
        event.preventDefault();
        setShowFeedback(true);
        dispatch(postItemToDB());
    }

    return (
        <div className="mt-4">
            {isLoggedIn && role == "seller" && (
                <div className="parent-container d-flex">
                    <div className="container">                  
                            <div className="display-4 ">Welcome {user}</div>
                            <div>
                                <button className="btn btn-primary mt-4 mb-4 mr-3" onClick={() => toggleShowSoldItems(!showSoldItems)}>
                                    Toggle Sold Items
                                </button>
                                <button className="btn btn-primary mt-4 mb-4 ml-3" onClick={() => toggleShowListedItems(!showListedItems)}>
                                    Toggle Listed Items
                                </button>
                            </div>
                   
                   
                            {showSoldItems && (<div><h5 className ="mt-5">Sold Items</h5> <br/></div>)}
                            <div className="justify-content-center pt-2" style={{display: 'flex', flexWrap: 'wrap'}}>
                                {showSoldItems && items.every((item) => {
                                    return ((item.purchasers.length > 0 && item.seller == user) == false);
                                        }) && (
                                        <h1>There are no sold items to show.</h1>
                                )}
                                {showSoldItems && (items.map((item, key) => {
                                    return (
                                        <div>
                                            {item.purchasers.length > 0 && item.seller == user && (
                                                <div className="card b-3 bg-light px-4 pt-3 pb-3 mx-4" key={key}>    
                                                    <div class="card-header border">{item.name}</div>
                                                    <div class="card-body">
                                                        <h5 class="card-title">Sold for ${item.price}</h5>
                                                        <hr/>
                                                        <p class="card-text">Times sold: {item.purchasers.length}</p>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    );
                                }))}
                            </div>
                            
                            {showListedItems && (<div><h5 className ="mt-5">Listed Items</h5> <br/></div>)}
                            <div className="justify-content-center pt-2" style={{display: 'flex', flexWrap: 'wrap'}}>
                                {showListedItems && items.every((item) => {
                                    return ((item.seller == user) == false);
                                        }) && (
                                        <h1>There are no listed items to show.</h1>
                                )}
                                {showListedItems && (items.map((item, key) => {
                                    return (
                                        <div>
                                            {item.seller == user && (
                                                <div className="card b-3 bg-light px-4 pt-3 mt-3 pb-3 mx-4" key={key}>    
                                                    <div class="card-header border">{item.name}</div>
                                                    <div class="card-body">
                                                        <h5 class="card-title">Description given:<br/> {item.description}</h5>
                                                        <hr/>
                                                        <h5 class="card-title">Listed for ${item.price}</h5>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    );
                                }))}
                            </div>
                    </div>

                    <div className="container mt-5">
                            {showPostForm && (                   
                                <div className="card bg-light col-md-8">       
                                    <br /><br /><br />              
                                    <br /><h3 className="text-left pb-3 mt-3"><em>Post an item to the 9.5 Exchange's Catalog</em></h3>
                                    <div className="pb-2 col-md-10">
                                        <label className="float-left">Item Name</label>
                                        <input type="text" className="form-control mb-2" placeholder=" enter item name" onChange={e=> dispatch(setName(e.target.value))}/>
                                    </div>
                                    
                                    <div className="pb-2 col-md-10">
                                        <label className="float-left">Description</label>
                                        <textarea className="form-control" placeholder="enter item description" rows="5" onChange={e=> dispatch(setDescription(e.target.value))}/>
                                    </div>
                                    <div className="pb-2 col-md-4">
                                        <label className="float-left">Price</label>
                                        <input type="text" className="form-control" placeholder="" onChange={e=> dispatch(setPrice(e.target.value))}/>
                                    </div>

                                    <div className="text-left col-md-2 mt-2">
                                        <button 
                                            onClick={(e) => {attemptPost(e)}}
                                            className="btn btn-primary mb-2">
                                            Post!
                                        </button>
                                    </div>     
                                    {showFeedback && (
                                        <Link to='/' className="nav-link text-white bg-success">Item Posted! Click here to return to the home page.</Link>
                                    )}          
                                </div>
                            )}             
                    </div>
                </div>
            )}
        </div>
    );
    
}

const mapStateToProps = state => ({
    user: state.userReducer.user,
    isLoggedIn: state.userReducer.isLoggedIn,
    role: state.userReducer.role,
    items: state.itemReducer.items,
    name: state.itemReducer.name, 
    price: state.itemReducer.price,
    description: state.itemReducer.description,
});

export default connect(mapStateToProps)(Seller);
