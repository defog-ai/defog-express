const express = require('express')
const cors = require('cors')
const Defog = require('defog')
const app = express()

app.use(express.json())
app.use(cors())

process.env.GOOGLE_APPLICATION_CREDENTIALS = '/Users/rishabh/Projects/google_key.json';

const defog = new Defog(process.env.DEFOG_API_KEY, "bigquery");
const port = 3000;

app.post('/', async(req, res) => {
  const resJson = req.body;
  const mode = resJson.mode;
  const question = resJson.question;
  const previousContext = resJson.previous_context;
  const hardFilters = resJson.hard_filters;
  
  if (mode && mode === "get_questions") {
    const questions = await defog.getPredefinedQueries();
    console.log(questions);
    const questionsResp = questions.predefined_queries.map(item => ({value: item['question']}));
    res.json({status: 'success', questions: questionsResp})
  } else {
    const answer = await defog.runQuery(question, hardFilters, previousContext)
    res.json(answer);
  }
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
