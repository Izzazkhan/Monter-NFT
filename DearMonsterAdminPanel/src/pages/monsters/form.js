
import React, { useState, useEffect } from "react"
import "../../App.css";
import { getDearMonsters, addDearMonsters, editDearMonsters, deleteDearMonsters } from '../../redux/monsters/action';
import { connect } from 'react-redux';
// import { Switch, Route, useRouteMatch, Redirect } from 'react-router-dom';

function MonsterPage(props) {

    const [state, setState] = useState({ title: '', cetagory: '', totalRating: 0, price: 0, img: '' });

    // todo commented untill file is added
    // const [imageState, setImageState] = useState({ image: null, imagePreviewUrl: null })

    useEffect(() => {
        if (props.location.state !== undefined) {
            const propsData = props.location.state.data
            setState({
                ...state,
                _id: propsData._id,
                title: propsData.title,
                img: propsData.img,
                totalRating: propsData.totalRating,
                price: propsData.price,
                cetagory: propsData.cetagory
            })
        }

    }, [props.location.state])

    // handleSubmit(e) {
    //     e.preventDefault();
    //     let form = document.forms.itemAdd;
    //     this.props.createItem({
    //         name: form.name.value,
    //         image: this.state.image
    //     });
    //     // Clear the form and state for the next input.
    //     form.name.value = "";
    //     this.state.image = null;
    //     this.state.imagePreviewUrl = null;
    // }

    // const handleImageChange = (e) => {
    //     e.preventDefault()
    //     let reader = new FileReader()
    //     let file = e.target.files[0]
    //     reader.onloadend = () => {
    //         setImageState({ ...imageState, image: file, imagePreviewUrl: reader.result })
    //     }

    //     reader.readAsDataURL(file)
    // }

    // console.log('imageState', imageState)

    const submitData = () => {

        if (!state._id) {
            props.addDearMonsters(state, JSON.parse(localStorage.getItem('token')))
            props.history.push('/monsters')
        } else if (state._id) {
            props.editDearMonsters(state, JSON.parse(localStorage.getItem('token')));
            props.history.push('/monsters')

        } else {
            alert('Enter Monster Details.');
        }
        // clearData()
    }

    const handleChange = (e) => {
        setState({ ...state, [e.target.name]: e.target.value })
    }

    const InputField = Object.entries(state).map((item, i) => {
        const field = item[0]
        const value = item[1]

        // todo commenting until file is added
        // if (field !== 'id' && field !== 'img') {
        if (field !== '_id') {
            return (
                <div className="form-group col-md-6 mb-4" key={i}>
                    <label className="control-label">{field.toUpperCase()}</label>
                    <input type="text" required="required" className="form-control" onChange={handleChange}
                        name={field} value={value}
                        disabled={ field === 'img' ? 'disabled' : ''}
                        placeholder={`Enter ${field}`} />
                </div>
            )
        }

    });

    const clearData = () => {
        setState({ title: '', cetagory: '', totalRating: 0, price: 0 })
    }

    return (
        <>
            <div className="col-lg-9 col-md-8">
                <div className="content-wrapper">
                    <div className="content-box">
                        <h3>DearMonsters Profile</h3>
                        <div className="row">
                            {InputField}
                        </div>

                        {/* todo untill file is added */}

                        {/* <div className="row">
                            <div className="form-group col-md-6">
                                <label className="control-label">Item Image</label>
                                <input type="file" required="required" className="form-control" onChange={handleImageChange} />
                                <img style={{
                                    marginTop: imageState.imagePreviewUrl && '20px',
                                    height: imageState.imagePreviewUrl && '100px'
                                }} src={imageState.imagePreviewUrl} />
                            </div>
                        </div> */}



                        <div className="row" >
                            <div className="col-md-6">
                                {state._id ?

                                    <button className="btn-default hvr-bounce-in" onClick={submitData}>UPDATE</button> :
                                    <button className="btn-default hvr-bounce-in" onClick={submitData}>ADD</button>}
                            </div>

                            <div className="col-md-6"><button className="btn-default hvr-bounce-in" onClick={clearData}>CLEAR</button></div>
                        </div>
                        <br />
                    </div>
                </div>
            </div>


        </>
    )
}

const mapStateToProps = state => ({
    dearMonsters: state.MonsterReducer
});

export default connect(mapStateToProps, { getDearMonsters, addDearMonsters, editDearMonsters, deleteDearMonsters })(MonsterPage); 