if (document.readyState === 'complete') {
    console.log("i am ready now");
    expandScreen();
  } 
  else {
    window.addEventListener('load', ()=>{
        console.log("i am still loading... ");

    });
  }

  function expandScreen(){

    var mainElement = document.querySelector('.styles__Wrapper-sc-1kbgjlb-0');
    var button = mainElement.querySelector('.MuiButtonBase-root-330');
    console.log(button);
    button.click();

  }