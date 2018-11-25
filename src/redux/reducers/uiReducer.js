import { SET_LOADER, SET_UPDATER, SET_GEOLOCATION, SET_SIDEBAR } from "../actions/ui";

const initState = {
    loading: false,
    updating: false,
    geolocation: false,
    sidebar: false
};

export const uiReducer = (ui = initState, action) => {
    switch (true) {

        case action.type.includes(SET_LOADER):
            return { ...ui, loading: action.payload };
        
        case action.type.includes(SET_UPDATER):
            return { ...ui, updating: action.payload };
        
        case action.type.includes(SET_GEOLOCATION):
            return { ...ui, geolocation: action.payload };
        
        case action.type.includes(SET_SIDEBAR):
            return { ...ui, sidebar: action.payload };

        default:
            return ui;
    }
};