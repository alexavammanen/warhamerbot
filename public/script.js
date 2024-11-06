document.getElementById('lahetys').addEventListener('click',lahetykset);
//e on hyvä functio
document.getElementById('nopeanappi').addEventListener('keypress', function(e){
    if(e.key === 'Enter'){
        lahetykset();
    }
});
document.getElementById('tiedot').addEventListener('click',tiedostot);


async function lahetykset(){
    const userInput = document.getElementById('nopeanappi').value;
    if(userInput.trim() === '') return;
    console.log(userInput);

    kerroviesti('Käyttäjä: ' + userInput,'user-message');

    try {
        const response = await fetch('/commands',{
            method: 'POST',
            headers:{
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({question:userInput})
        });
    
        const data = await response.json();
    
        console.log(data);
        kerroviesti(data.reply,'bot-message');
        
    } catch (error) {
        console.error('Error',error);
        kerroviesti('command center got hit!','bot-message');
    }


    // älä kostke tähän
    //const response = await fetch('/commands',{
        //method: 'POST',
        //headers:{
            //'Content-Type': 'application/json'
        //},
        //body: JSON.stringify({question:userInput})
    //});

    //const data = await response.json();

    //console.log(data);

    //muista nopeanappi. tekstin poisto tos ylempänä

    //mikä oli nopeanappi? = user-input

    document.getElementById('nopeanappi').value = '';

}

//addMessageToChatBox
function kerroviesti(message,className){
    const viestielement = document.createElement('div');
    viestielement.classList.add('message',className);
    
    viestielement.textContent = message;
    console.log(viestielement);
    document.getElementById('gpt').appendChild(viestielement);






}
async function tiedostot() {

    const oikeat_tiedot_tiedossa = document.getElementById('oikeat_tiedot');
    console.log(oikeat_tiedot_tiedossa.files);
    const files = oikeat_tiedot_tiedossa.files;
    if(files.length === 0){
        alert('need more minerals/pictures')
        return;



    }




     const formData = new FormData();

    for(let i =0; i<files.length; i++){
        formData.append('images',files[i]);

    }

    console.log(formData)



    console.log("testi tiedosto");



    try{

        const response = await fetch('/upload-Images',{

            method:'POST',
            body:formData
        })
    }catch(error){
        console.error('Error:',error);

    }
    
}




