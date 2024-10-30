document.getElementById('lahetys').addEventListener('click',lahetykset);
//e on hyvä functio
document.getElementById('nopeanappi').addEventListener('keypress', function(e){
    if(e.key === 'Enter'){
        lahetykset();
    }
});


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




