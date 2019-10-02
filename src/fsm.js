class FSM {
    
    /**
     * Creates new FSM instance.
     * @param config
     */
    constructor(config) {
        if (!config) throw new Error();
        this.initial = config.initial;
        this.currentState = config.initial;
        this.states = config.states;
        this.statesHistory = ["normal"];
        this.prevStates = [];
        this.undoState = 0;
    }

    /**
     * Returns active state.
     * @returns {String}
     */
    getState() {
        return this.currentState;
    }

    /**
     * Goes to specified state.
     * @param state
     */
    changeState(state) {
        let states = Object.keys(this.states);

        if (states.includes(state)) {
            this.currentState = state;
            this.statesHistory.push(state);
            this.undoState = 0;
        } else {
            throw new Error("no state")
        }
    }

    /**
     * Changes state according to event transition rules.
     * @param event
     */
    trigger(event) {
        // if (this.states[this.currentState].transitions[event] !== undefined) {
        if (event in this.states[this.currentState].transitions) {

            let newState = this.states[this.currentState].transitions[event];
            this.currentState = newState;
            this.statesHistory.push(newState);
            this.undoState = 0;
        } else {
            throw  new Error('no event')
        }
    }

    /**
     * Resets FSM state to initial.
     */
    reset() {
        this.currentState = this.initial;
    }

    /**
     * Returns an array of states for which there are specified event transition rules.
     * Returns all states if argument is undefined.
     * @param event
     * @returns {Array}
     */
    getStates(event) {
        let toReturn = [];
        if (event === undefined) {
            toReturn = Object.keys(this.states);
        } else {
            let availState = Object.keys(this.states);
            availState.forEach(x => {
                if (this.states[x].transitions[event] !== undefined) {
                    toReturn.push(x)
                }
            })
        }
        return toReturn;
    }

    /**
     * Goes back to previous state.
     * Returns false if undo is not available.
     * @returns {Boolean}
     */
    undo() {
        if (this.statesHistory[0] === "normal" && !this.statesHistory[1]) {
            return false;
        } else {
            this.prevStates.push(this.statesHistory.pop());
            this.currentState = this.statesHistory[this.statesHistory.length - 1];
            this.undoState = 1;
            return true;
        }
    }

    /**
     * Goes redo to state.
     * Returns false if redo is not available.
     * @returns {Boolean}
     */
    redo() {
        if (this.prevStates.length === 0 || this.undoState === 0) {
            return false;
        } else {
            let lastState = this.prevStates.pop();
            this.currentState = lastState;
            this.statesHistory.push(lastState);
            return true;
        }
    }

    /**
     * Clears transition history
     */
    clearHistory() {
        this.currentState = "normal";
        this.statesHistory = ["normal"];
    }
}

module.exports = FSM;

/** @Created by Uladzimir Halushka **/
