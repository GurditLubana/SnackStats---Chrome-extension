if (document.readyState === 'complete') {
    console.log("i am ready now");
    calculateExpenditure();
  } 
  else {
    window.addEventListener('load', ()=>{
        console.log("i am still loading... ");
        calculateExpenditure();

    });
  }


  function calculateExpenditure(){

    const loadmoreBtn =  document.querySelector('.iMIGfw');
    console.log(loadmoreBtn);
  }