import express from 'express';
import bodyParser from 'body-parser';


const app = express();
const port = 3000;

app.use(express.static('public'));
app.use(bodyParser.json());


app.post('/commands', async(req, res)=>{
    const question = req.body.question;
    console.log(question);

    try{
        


    }catch(error){
        

    }

    if(question){res.json({question:`tactics ${question}`});

    }else
    {res.status(400).json({error:`no tactics.`});
    }



});


app.listen(port,() =>{
    console.log(`server running at optimal http://localhost:${port}`);


});