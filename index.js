import express from "express";
import bodyParser from "body-parser";
import fs from "fs";
import { dirname } from "path";
import { fileURLToPath } from "url";

import rline from "readline";
import { appendFile } from 'fs/promises';
import { threadId } from "worker_threads";
import { time } from "console";
import { title } from "process";
import { promises } from "dns";

const port = 3000;
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
let blogtitles = [];
var blogsWritten = 0;
let day = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
let month = ["Januarary", "Febuarary", "March", "April", "May", "June", "July", "August" ,"September", "October", "November", "December"];


app.set('view engine', 'ejs');

//this if statement persists the blogtitles array even if server is resatartd by writing
//it int a text file in the function get submit and reading from it

async function blogList(){
  const __dirname = dirname(fileURLToPath(import.meta.url))
  let directory = fs.readdirSync(__dirname + "/blogs");
  directory.forEach(async elements => {
    const result = blogtitles.find(element => element === elements);
    if (result === undefined) {
      blogtitles.push(elements)
  }
  });  
  await blogWritten();
}

async function dateandtime(){
  let d = new Date();
  let fullTime = `On ${day[d.getDay()]} ${d.getDate()} ${month[d.getMonth()]} at ${d.getHours()}:${d.getMinutes()} \n`
  return fullTime;
}

async function truncateString(str, maxLength) {
  if (str.length > maxLength) {
      return str.slice(0, maxLength - 3) + '...';
  }
  return str;
}

async function blogDatas() {
  let temparr = [];
  let promises = blogtitles.map(async elements => {
    let arr = {firstLine: "", after: ""};
    let oneLine = await readSingleLine("./blogs/" + elements, 1);
    let someLines = await readRestBlog("./blogs/" + elements, 4);
    arr.firstLine = oneLine;
    arr.after = await truncateString(someLines[0], 200);
    temparr.push(arr);
  });

  await Promise.all(promises);

  return temparr;
}

async function homeResources() {
  let resources = {titles: [], noOfBlogs: 0, allBlogData: []};
  resources.allBlogData = await blogDatas();
  resources.titles = blogtitles;
  blogWritten();
  resources.noOfBlogs = blogsWritten;
  return resources;
}

function sortBlogData(resources) {
  let sortedData = [];
  resources.titles.forEach(title => {
    let blog = resources.allBlogData.find(data => data.firstLine.replace(/ /g, "") + ".txt" === title);
    if (blog) {
      sortedData.push(blog);
    }
  });
  return sortedData;
}
 
async function blogWritten(){
  blogsWritten = 0;
  for (let index = 0; index < blogtitles.length; index++) {
    const element = blogtitles[index];
    if (element !== "") {
      blogsWritten += 1;
    }
    else{
      
    }
  }
}

async function readSingleLine(filePath, lineNumber) {
  try {
      const data = await fs.promises.readFile(filePath, 'utf8');
      const lines = data.split('\n');
      if (lines.length >= lineNumber) {
          return lines[lineNumber - 1];
      } else {
          return '';
      }
  } catch (err) {
      console.error(err);
      return '';
  }
}

async function readRestBlog(filePath, startLine) {
  try {
      const data = await fs.promises.readFile(filePath, 'utf8');
      const lines = data.split('\n');
      if (lines.length >= startLine) {
          return lines.slice(startLine - 1);
      } else {
          return [];
      }
  } catch (err) {
      console.error(err);
      return [];
  }
}

app.get("/",async (req,res) => {
  await blogList();
  await blogWritten();
  let resources = await homeResources();
  resources.allBlogData = sortBlogData(resources);
  console.log(`Total no. of blogs present is ${blogsWritten}`,blogtitles);
  res.render("index.ejs",resources);
})

app.post("/submit",async (req,res) => {
  let title = req.body["blogTitle"] + "\n";
  let blogauthor = req.body["blogAuthor"] + "\n";
  let d = await dateandtime();
  let content = req.body["blogText"];
  let data = title + blogauthor + d + content;
  let fileName = "./blogs/" + req.body["blogTitle"].replace(/ /g, '') + ".txt";
  fs.writeFile(fileName, data, (err) => {
    console.log("Blog is posted successfully. yay!")
    blogList();
  }) 
  blogWritten();
  res.render("posted.ejs");
})

app.get("/write", (req,res) =>{
  res.render("blogwrite.ejs")
})


//A get request handler that can take the url of the dynamically generated a tag and
//use that to make a get request

app.get('/:slug', async (req, res) => {
  if (req.params.slug === 'favicon.ico') {
    res.status(204).end();
    return;
} 
  const blogSlug = req.params.slug;
  const filePath = './blogs/' + blogSlug;
  let blog = { firstLine: "", secondLine: "", thirdLine: "", restBlog: "", blogPath: filePath};

  blog.firstLine = await readSingleLine(filePath, 1);
  blog.secondLine = await readSingleLine(filePath, 2);
  blog.thirdLine = await readSingleLine(filePath, 3);
  blog.restBlog = await readRestBlog(filePath, 4);

  res.render('blogview', blog);
});

app.post("/",async (req, res) => {
  let blogpath = req.body.blogPath;
  let blogName = await readSingleLine(req.body.blogPath, 1);
  fs.unlink(blogpath, (err) => {
    if (err) {
      console.error(`Error removing file: ${err}`);
      return;
    }
    })
    for (let i = 0; i < blogtitles.length; i++) {
      if (blogtitles[i] === blogName.replace(/ /g, "") + ".txt") {
          console.log(blogtitles.splice(i, 1));
        }
     };
    console.log(`File ${blogName} has been successfully removed.`);
    res.render("index.ejs", await homeResources());
  })


app.post("/update",async (req, res) => {
  let blogpath = req.body.blogPath;
  let blog = { firstLine: "", secondLine: "", thirdLine: "", restBlog: "", blogPath: blogpath};

  blog.firstLine = await readSingleLine(blogpath, 1);
  blog.secondLine = await readSingleLine(blogpath, 2);
  blog.thirdLine = await readSingleLine(blogpath, 3);
  blog.restBlog = await readRestBlog(blogpath, 4);

  res.render("blogUpdate.ejs", blog)
})

app.post("/updated",async (req,res) => {
  let blogaddress = req.body.blogPath;
  await fs.promises.unlink(blogaddress, (err) => {
    if (err) throw err;
  })
  let title = req.body["blogTitle"] + "\n";
  let blogauthor = req.body["blogAuthor"] + "\n"
  let d = await dateandtime();
  let content = req.body["blogText"];
  let data = title + blogauthor + d + content;
  let fileName = "./blogs/" + req.body["blogTitle"].replace(/ /g, '') + ".txt";
  await fs.promises.writeFile(fileName, data, (err) => {
    console.log("Blog updated successfully. yay!")
    blogList();
  })

  for (let i = 0; i < blogtitles.length; i++) {
    if (blogtitles[i] === req.body["previousName"].replace(/ /g,"") + ".txt") {
        console.log(blogtitles.splice(i, 1));
        blogtitles.push(req.body["blogTitle"].replace(/ /g,"") + ".txt")
      }
   };
  console.log(blogList);
  res.render("Submitted.ejs");
})


app.listen(port, ()=>{
  console.log(`Server is running at port ${port}`);
})














 
// const appendToFile = async (filePath, text) => {
//   try {
//     await appendFile(filePath, text);
//     console.log('Text appended successfully!');
//   } catch (err) {
//     console.error('Error appending to file:', err);
//   }
// };


// fs.readFile("real.txt", {encoding:"utf8"},(err, data)=>{
//   if (err) {console.log(err);
// }
//   else
//   {console.log(data);}
// });
