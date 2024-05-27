const handleErrors = (err) => {
    console.log(err.message, err.code);
    let errors = { email: '', password: '' };
  
    
    if (err.message === 'Yanlis Email') {
      errors.email = 'Email Adresini kontrol ediniz.';
      console.log('sadasdadas');
    }
  
    
    if (err.message === 'Yanlis Sifre') {
      errors.password = 'Sifre veya Email\'i kontrol ediniz';
    }
  
    
    if (err.code === 11000) {
      errors.email = 'Email adresi kullanimda.';
      return errors;
    }
  
    // validation errors
    if (err.message.includes('user validation failed')) {
      Object.values(err.errors).forEach(({ properties }) => {
        
        errors[properties.path] = properties.message;
      });
    }
  
    return errors;
  }

export default handleErrors