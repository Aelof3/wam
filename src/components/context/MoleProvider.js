import React, { Component } from 'react';
import MOLE_CONTEXT from './MoleContext';


class MOLEPROVIDER extends Component {
    state = {
        faces: this.props.faces,
        textures: this.props.textures,
        moleLayout: this.props.moleLayout,
        moles: this.props.moles,
        points: 0,
        popupDuration: 5000,
        popupInterval: 1000,
        moleCount: 100,
        prefaceClass: true,
        timer: 0,
        //RESTAPI: 'http://localhost:8000'
        RESTAPI: 'https://floating-crag-15121.herokuapp.com'
    }
    bonkMole = (mole,e) => {
        if (!e.isTrusted) return;
        const p = mole.burrowed || mole.bonked ? 0 : 1;
        const moles = this.state.moles.map( m => {
            if ( m.i !== mole.i ) return m;
            m.bonked = true;
            return m;
        } );
        this.setState({
            moles: moles,
            points: this.state.points + p
        });

        setTimeout( ()=>{
            const molesAfter = this.state.moles.map( m => {
                if ( m.i !== mole.i ) return m;
                m.bonked = false;
                m.burrowed = true;
                return m;
            } );
            this.setState({
                moles: molesAfter
            });
        }, 500 )
    }
    handleClick = (e) => {
        e.preventDefault();
        this.props.history.replace('/wam/');
    }
    popUpMole = (moles,m) => {
        moles[m].burrowed = false;
        this.setState({
        moles: moles
        });
        setTimeout( ()=>{
            moles[m].burrowed = true;
            this.setState({
            moles: moles
            });
        }, this.state.popupDuration )
    }

    stepSequence = ( ) => {
        // create sequence to randomly pop moles up
        const burrowedMoles = this.state.moles.filter( mole => mole.burrowed ).map( mole => mole.i );
        const m = burrowedMoles[this.getRandomInt(0,burrowedMoles.length - 1)];
        const tempMoles = this.state.moles;
        this.popUpMole(tempMoles,m);
    }

    setFinalTime = ( time ) => {
        this.setState({
            timer: time
        })
    }

    gameReset = () => {
        this.setState({
            points: 0,
            timer: 0
        });
    }
    
    getRandomInt = (min,max) => {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

    gameStart = () => {
        this.setState({
            prefaceClass: false,
            interval: setInterval( ()=>{
                this.stepSequence();
            },this.state.popupInterval)
        })
    }

    gameEnd = () => {
        clearInterval( this.state.interval );
    }

    render(){
        return (
            <MOLE_CONTEXT.Provider value={{
                ...this.state,
                bonkMole: this.bonkMole,
                gameStart: this.gameStart,
                gameEnd: this.gameEnd,
                setFinalTime: this.setFinalTime,
                gameReset: this.gameReset,
                handleClick: this.handleClick
            }}>
                {this.props.children}
            </MOLE_CONTEXT.Provider>
        )
    }
}

export default MOLEPROVIDER;