import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import multer from 'multer';
import vision from '@google-cloud/vision';

dotenv.config();


const app = express();
const port = 3000;

const upload = multer({dest:'upload/'});

app.use(express.static('public'));
app.use(bodyParser.json());

const client = new vision.ImageAnnotatorClient({keyFilename:'omaope-vision.json'});

let testfieltest = '';
let context = [] //context to keskustelulista
let currentQuestin ='';//tallentaa kys
let correctandswer ='';//tallentaa vastaus

app.post('/check-answer', async(req,res)=>{
    const useranswer =req.body.user_answer
    console.log(useranswer);
    try{
        const response = await fetch('https://api.openai.com/v1/chat/completions',{

            method: 'POST',
            headers:{
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`


            },
            body: JSON.stringify({
                model: 'gpt-4o-mini',
                messages:[
                    {role:'system', content: 'ole aina ystävällinen opettaja, joka arvio oppilaan vastauksen kohtalaiseen sävyyn'},
                    {role:'user', content:`kysymys${currentQuestin}`},
                    {role:'user', content:`oikealle${correctandswer}`},
                    {role:'user', content:`opiskelian vastaus${useranswer}`},
                    {role:'user',content:'arvio opiskelian vastaus asteikolla 0/10 ja anna lyhyt selitys ystävällisesti miten pääddyttiin tähän tulokseen'},

                ],
                max_tokens:150




            })



        });
        const data = await response.json();
        const evaluation = data.choices[0].message.content.trim();
        console.log("arvio:",evaluation);
        res.json({evaluation});
        

    }catch(error){

    }

})

app.post('/commands', async(req, res)=>{
    const question = req.body.question;
    console.log(question);
 //https://api.openai.com/v1/chat/completions muista tämä?

 //se avain pitää vaihtaa jos ei toimi joku .env tiedosto tarvis olla ja sen avaimen = nimi pitää olla OPENAI_API_KEY tiedoston sisällä
    try{
        const response = await fetch('https://api.openai.com/v1/chat/completions',{

            method: 'POST',
            headers:{
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`


            },
            body: JSON.stringify({
                model: 'gpt-4o-mini',
                messages:[
                    {role:'user', content: question}
                ],
                max_tokens:150




            })



        });

        const data = await response.json();
        console.log(data.choices[0].message);
        const reply = data.choices[0].message.content;
        res.json({reply});
        


    }catch(error){
        

    }

    //if(question){res.json({question:`tactics ${question}`});

    //}else
    //{res.status(400).json({error:`no tactics.`});
    //}



});

app.post('/upload-Images',upload.array('images',10) ,async(req,res)=>{

    const files = req.files;
    console.log(files);
    //console.log(req);
    if(!files || files.length === 0){

        return res.status(400).json({error:'noo we are out of files D:'});
    }
    try{
        const texts = await Promise.all(files.map(async file => {

            const imagePath = file.path;
            const [result] = await client.textDetection(imagePath);
            const detections = result.textAnnotations;
            return detections.length > 0 ? detections[0].description : '';
        }))

        testfieltest = texts.join('');
        console.log(testfieltest);
        context = [{role:'user',content:testfieltest}];


        console.log('ocr:'+ texts);


        const response = await fetch('https://api.openai.com/v1/chat/completions',{
            method: 'POST',
            headers:{
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`


            },
            body: JSON.stringify({
                model: 'gpt-4o-mini',
                messages:context.concat([
                    {role:'user', content: 'luo yksi yksinkertainen ja sellkeä kysymys ja sen vastau yllä olevasta tekstistä suomeksi kysy vain yksi asia kerrallaan  '}
                ]),
                max_tokens:150

            })



        });

        const data = await response.json();
        console.log(data.choices[0].message.content);
        const responseText = data.choices[0].message.content.trim();

        const [question, answer] = responseText.includes('Vastaus') ? responseText.split('Vastaus') : [responseText, null];

        console.log("kys" + question );
        console.log("vasta"+ answer);

        if(!question || !answer){

            return res.status(400).json({error:'no queston nor anserws basically maybe more or less required'});
        }
        currentQuestin = question.trim();
        correctandswer = question.trim();
        
        context.push({role:'assistant',content:`quest: ${currentQuestin}`});
        context.push({role:'assistant',content:`oikea: ${correctandswer}`});

        res.json({question: currentQuestin, answer:correctandswer});

        

    }catch(error){
        console.error('Error',error.message);
        ResizeObserver.status(500).json({error:error.message});

    }


});


app.listen(port,() =>{
    console.log(`server running at optimal http://localhost:${port}`);


});