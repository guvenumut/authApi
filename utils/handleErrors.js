const handleErrors = (err) => {
    console.log(err.message, err.code);
    let errors = { email: '', password: '' };
  
    
    if (err.message === 'ebb') {
      errors.email = 'Email alani bos birakilmaz';
      
    }

    if (err.message === 'Yanlis Email') {
      errors.email = 'Email Adresini kontrol ediniz.';
      
    }
    

    if(err.message==="Guncel sifreniz yanlis"){
      errors.email = 'Guncel sifreniz yanlis.';
    }

    if(err.message==="y"){
      errors.password="Yeni sifre eski sifre ile aynı olamaz"
    }
    
    if(err.message==="Yeni şifre en az 6 karakter uzunluğunda olmalıdır."){
      errors.password="Yeni şifre en az 6 karakter uzunluğunda olmalıdır."
    }

    if(err.message==="Sifreler ayni olmalidir."){
      errors.password = 'Sifreler ayni olmalidir.';
    }
    

    if(err.message==="y"){
      errors.password="Yeni sifre eski sifre ile aynı olamaz"
    }

    if(err.message==="t"){
      errors.password="Yeni sifre eski sifre ile aynı olamaz"
    }


    if (err.message === 'Yanlis Sifre') {
      errors.password = 'Sifreyi kontrol ediniz';
    }

    if (err.message === 'ey') {
      errors.email = 'Sifre sifirlama mail\'i gonderildi';
    }
    if (err.message ==='User validation failed: email: gecerliMailGiriniz') {
      errors.email = 'Gecerli bir email adresi yaziniz';
    }
    
    
    if (err.code === 11000) {
      errors.email = 'Email adresi kullanimda.';
      return errors;
    }
    if(err.message==="User validation failed: password: sifre6karakterOlamlidir"){
      errors.password = 'Sifre en az 6 karakterli olmali';
    }
    
    if (err.message.includes('user validation failed')) {
      Object.values(err.errors).forEach(({ properties }) => {
        
        errors[properties.path] = properties.message;
      });
    }
  
    return errors;
  }

export default handleErrors