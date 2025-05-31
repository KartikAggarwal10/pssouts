import express from "express"
import rout from "./temp/rout.js";
import blog from "./temp/blog.js";

const app = express()
const port = 3000

app.use(express.json()); 
app.use(express.static('public'))
app.use('/rout',rout);
app.use('/',rout);
app.use('/blog',blog);
app.post('/', (req, res) => {
  console.log("Received POST data:", req.body);
  res.send('Hello World!@#$')
})
app.get('/', (req, res) => {
  console.log("Received POST data:", req.body);
  res.send('Hello')
})


app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
app.get('/api', (req, res) => {
  res.json({a: 3,c: 9,b: 3}) 
})