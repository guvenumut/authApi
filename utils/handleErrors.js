const handleErrors=(err)=>{
    console.log(err.message,err.code)
    let errors={email:'',password:''}
    if (err.code===11000){
        errors.email='Email kullanimda'
    }


    if(err.message.includes('User validation failed')){
        Object.values(err.errors).forEach(({properties})=>{
            errors[properties.path]=properties.message;
        })
    }
    return errors
}


export default handleErrors