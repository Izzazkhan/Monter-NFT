
import React, { useState, useEffect } from "react"
import "../../App.css";
import { getDearMonsters, addDearMonsters, editDearMonsters, deleteDearMonsters } from '../../redux/monsters/action';
import { connect } from 'react-redux';
import { Switch, Route, useRouteMatch, Redirect } from 'react-router-dom';

function MonsterPage(props) {
    console.log('props', props)

    const [state, setState] = useState({ id: '', name: '', element: '', level: '', exp: '', star: '', energy: '' })
    const [imageState, setImageState] = useState({ image: null, imagePreviewUrl: null })

    useEffect(() => {
        if (
            props.location.state !== undefined
        ) {
            const propsData = props.location.state.data
            setState({
                ...state, id: propsData.id, name: propsData.name, element: propsData.element, level: propsData.level,
                exp: propsData.exp,
                star: propsData.star,
                energy: propsData.energy,
                image: propsData.image
            })
        }

    }, [props.location.state])

    console.log('stateeeee', state)

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

    const handleImageChange = (e) => {
        e.preventDefault()
        let reader = new FileReader()
        let file = e.target.files[0]
        reader.onloadend = () => {
            setImageState({ ...imageState, image: file, imagePreviewUrl: reader.result })
        }

        reader.readAsDataURL(file)
    }

    // console.log('imageState', imageState)

    const submitData = () => {

        const dearMonsters = {
            name: state.name,
            element: state.element,
            level: state.level,
            exp: state.exp,
            star: state.star,
            energy: state.energy,
            image: imageState.image ? imageState.image.name : ''
        }


        if (state.name && state.element && !state.id) {
            props.addDearMonsters({ ...dearMonsters, id: Math.floor(Math.random() * (999 - 100 + 1) + 100) })
            // props.history.push('/')
            // < Redirect to={`/`} />

        } else if (state.name && state.element && state.id) {
            props.editDearMonsters({ ...dearMonsters, id: state.id });
        } else {
            alert('Enter Employee Details.');
        }

        clearData();
    }

    const handleChange = (e) => {
        setState({ ...state, [e.target.name]: e.target.value })
    }

    const InputField = Object.entries(state).map((item, i) => {
        const field = item[0]
        const value = item[1]
        if (field !== 'id' && field !== 'image') {
            return (
                <div className="form-group col-md-6" key={i}>
                    <label className="control-label">{field.toUpperCase()}</label>
                    <input type="text" required="required" className="form-control" onChange={handleChange}
                        name={field} value={value}
                        placeholder={`Enter ${field}`} />
                </div>
            )
        }

    });

    const clearData = () => {
        setState({ id: '', name: '', element: '', level: '', exp: '', star: '', energy: '' })
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

                        <div className="row">
                            <div className="form-group col-md-6">
                                <label className="control-label">Item Image</label>
                                <input type="file" required="required" className="form-control" onChange={handleImageChange} />
                                <img style={{
                                    marginTop: imageState.imagePreviewUrl && '20px',
                                    height: imageState.imagePreviewUrl && '100px'
                                }} src={imageState.imagePreviewUrl} />
                            </div>
                        </div>
                        <div classNameName="row" style={{ justifyContent: 'center' }}>
                            {state.id ? <button className="btn-default hvr-bounce-in" onClick={submitData}>UPDATE</button> :
                                <button className="btn-default hvr-bounce-in" onClick={submitData}>ADD</button>}   <button className="btn-default hvr-bounce-in" onClick={clearData}>CLEAR</button>
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