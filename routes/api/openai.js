var express = require('express');
var router = express.Router();

// import modules from OpenAI library
const { Configuration, OpenAIApi } = require('openai');

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

router.get('/chat', async (req, res) => {
  const chat = req.body.prompt;
  const prompt =
    chat +
    'reply with  single body json format with body philipinnes fish Name, fish english Name,fish scientific Name, color of the eye, percent confidence, possible cooking,2  sentences description, if philippine name cannot determine just indicate unknown remove \n in the reply';

  try {
    if (prompt == null) {
      throw new Error('Uh oh, no prompt was provided');
    }
    const response = await openai.createCompletion({
      model: 'text-davinci-003',
      prompt,
      temperature: 0.9,
      max_tokens: 150,
    });
    const completion = response.data.choices[0].text;
    console.log(completion);
    return res.status(200).json({
      success: true,
      message: completion.replace(/(\r\n|\n|\r)/gm, ''),
    });
  } catch (error) {
    console.log(error.message);
  }
});

module.exports = router;
