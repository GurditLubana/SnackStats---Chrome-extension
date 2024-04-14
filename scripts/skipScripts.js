if (document.readyState === 'complete') {
    console.log("i am ready now");
    
  } 
  else {
    window.addEventListener('load', ()=>{
        console.log("i am still loading... ");

    });
  }