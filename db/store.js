import {LocalStorage} from 'node-localstorage' 

// constructor function to create a storage directory inside our project for all our localStorage setItem.
var localStorage = new LocalStorage('./scratch'); 

const setItem=(token)=>{
    localStorage.setItem('Token', token) 
}


export{setItem};