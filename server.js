import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';

dotenv.config();


const app = express();
const port = 3000;

app.use(express.static('public'));
app.use(bodyParser.json());


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


app.listen(port,() =>{
    console.log(`server running at optimal http://localhost:${port}`);


});