
let currentQuestin ='';
let correctandswer ='';




document.getElementById('lahetys').addEventListener('click',lahetykset);



//e on hyvä functio
document.getElementById('nopeanappi').addEventListener('keypress', function(e){
    if(e.key === 'Enter'){
        lahetykset();
    }
});
document.getElementById('tiedot').addEventListener('click',tiedostot);
document.getElementById('vastanappi2').addEventListener('click',sendanswer);

function sendanswer(){

    console.log("vastaus? missä")
    const answerini = document.getElementById('vastanappi').value;
    
    if(answerini.trim() == '') return;

    kerroviesti('??:' + answerini,'user-message','kuvebox');

    try{

        console.log('Error',error);

    }catch(error)
    {
        document.getElementById('answerini').value ='';

    }

}

async function lahetykset(){
    const userInput = document.getElementById('nopeanappi').value;
    if(userInput.trim() === '') return;
    console.log(userInput);

    kerroviesti('Käyttäjä: ' + userInput,'user-message','kuva-arvostelu','gpt',kuvebox);

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
        console.log(data);
        kerroviesti(data.reply,'bot-message','kuva-arvostelu','gpt');
        
    } catch (error) {
        console.error('Error',error);
        kerroviesti('command center got hit!','bot-message','kuva-arvostelu','gpt');
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
function kerroviesti(message,className,kuvebox){
    const viestielement = document.createElement('div');
    viestielement.classList.add('message',className);
    
    viestielement.textContent = message;
    console.log(viestielement);
    document.getElementById(kuvebox).appendChild(viestielement);


    //tarvitsee omaope-vision.json tiedosto google vision tomiakseen muualla ei tässä



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

        const data = await response.json();
        console.log(data);

        
        currentQuestin = data.question
        correctandswer = data.answer;
        console.log('current question' + currentQuestin);
        console.log('current ansewr:' + correctandswer);
        kerroviesti('???' + currentQuestin, 'bot-message','kuva-arvostelu')
    

    }catch(error){
        console.error('Error:',error);

    }
    
}




