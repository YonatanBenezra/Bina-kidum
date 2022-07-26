const express = require("express");
const axios = require("axios").default;
const cheerio = require("cheerio");
const app = express();
const cors = require("cors");
const PORT = process.env.PORT || 3000;
const path = require("path");
const favicon = require("serve-favicon");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { google } = require("googleapis");
const request = require("request");
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

app.use(cors());
app.use(favicon(path.join(__dirname, "favicon.ico")));
app.use(favicon(path.join(__dirname, "public", "favicon.ico")));
app.use(favicon(path.join(__dirname, "public", "images", "favicon.ico")));
app.use(favicon(__dirname + "/public/images/favicon.ico"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

function getRandomInt(min, max) {
  const rand = Math.random() * (max - min) + min;
  return Math.round(rand);
}
mongoose.connect(
  process.env.MONGODB_URI ||
    "mongodb+srv://yonatan1261:Dimoy2021@cluster0.pfw9n.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
  console.log("mongoose connected"),
  {
    useNewUrlParser: true,
    useFindAndModify: false,
  }
);

const MyModel = mongoose.model(
  "Milgot",
  new Schema({ name: String, adress: String, base: String, ForWho: String })
);

const UsersModel = mongoose.model(
  "Users",
  new Schema({ name: String, studies: String, number: String, hobbie: String, degree: String, email: String })
);

const TermModel = mongoose.model(
  "Terms",
  new Schema({ title: String, description: String })
);



const newspapers = [
  {
    name: "NoCamels",
    address: `https://nocamels.com/category/technology/`,
    base: "",
  },
  {
    name: "Calcalist",
    address: `https://www.calcalistech.com/ctech/home/0,7340,L-5211,00.html`,
    base: "",
  },
  {
    name: "TimesOfIsrael",
    address: `https://www.timesofisrael.com/tech-israel/`,
    base: "",
  },
  {
    name: "TimesOfIsrael",
    address: `https://www.timesofisrael.com/israel-inside/`,
    base: "",
  },
  {
    name: "Haaretz",
    address: `https://www.haaretz.com/israel-news/tech-news`,
    base: "",
  },
  {
    name: "כלכליסט",
    address: `https://www.calcalist.co.il/calcalistech`,
    base: "",
  },
  {
    name: "גיקטיים",
    address: `https://www.geektime.co.il/`,
    base: "",
  },
  {
    name: "גיקטיים",
    address: `https://www.geektime.co.il/category/startup/`,
    base: "",
  },
  {
    name: "גיקטיים",
    address: `https://www.geektime.co.il/category/development/`,
    base: "",
  },
  {
    name: "גיקטיים",
    address: `https://www.geektime.co.il/channel/cloud-and-clear/`,
    base: "",
  },
  {
    name: "גיקטיים",
    address: `https://www.geektime.co.il/channel/human-resources/`,
    base: "",
  },
  {
    name: "גיקטיים",
    address: `https://www.geektime.co.il/channel/dev-bible/`,
    base: "",
  },
  {
    name: "גיקטיים",
    address: `https://www.geektime.co.il/channel/future-of-tech/`,
    base: "",
  },
  {
    name: "גיקטיים",
    address: `https://www.geektime.co.il/channel/dev-bible/`,
    base: "",
  },
  {
    name: "GeekTime",
    address: `https://www.geektime.com/`,
    base: "",
  },
  {
    name: "GeekTime",
    address: `https://www.geektime.com/tag/startups/`,
    base: "",
  },
  {
    name: "GeekTime",
    address: `https://www.geektime.com/tag/investments/`,
    base: "",
  },
  {
    name: "Mako",
    address: `https://www.mako.co.il/news-business/news`,
    base: "",
  },
  {
    name: "Mako",
    address: `https://www.mako.co.il/news-business/news?page=2`,
    base: "",
  },
  {
    name: "GeekTime",
    address: `https://www.mako.co.il/news-business/news?page=3`,
    base: "",
  },
  {
    name: "GeekTime",
    address: `https://www.mako.co.il/news-business/news?page=4`,
    base: "",
  },
  {
    name: "GeekTime",
    address: `https://www.mako.co.il/news-business/news?page=5`,
    base: "",
  },
  {
    name: "GeekTime",
    address: `https://www.mako.co.il/news-business/news?page=6`,
    base: "",
  },
  {
    name: "GeekTime",
    address: `https://www.mako.co.il/news-business/news?page=7`,
    base: "",
  },
];

const highTechTermSites = [
  {
    name: "terms-heb",
    address: `https://www.geektime.co.il/startup-and-high-tech-dictionary/`,
    base: "",
  },
  // {
  //   name: 'idc-glossary',
  //   address: `https://www.idc.org/idc/glossary-of-terms`,
  //   base: ''
  // },
];
const educationTermSites = [
  {
    name: "levinsky",
    address: `https://www.levinsky.ac.il/%D7%9E%D7%99%D7%9C%D7%95%D7%9F-%D7%9E%D7%95%D7%A0%D7%97%D7%99%D7%9D/`,
    base: "",
  },
  {
    name: "mcl",
    address: `https://www.mcl.org.il/---c185o`,
    base: "",
  },
  {
    name: "kehilatmorim",
    address: `https://kehilotmorim.macam.ac.il/%D7%9E%D7%99%D7%9C%D7%95%D7%9F-%D7%9E%D7%95%D7%A0%D7%97%D7%99%D7%9D-%D7%A7%D7%94%D7%99%D7%9C%D7%95%D7%AA-%D7%9E%D7%A7%D7%A6%D7%95%D7%A2%D7%99%D7%95%D7%AA-%D7%9C%D7%95%D7%9E%D7%93%D7%95%D7%AA/`,
    base: "",
  },
];

//optional
const cbseducationTermSite = [
  {
    name: "cbs",
    address: `https://www.cbs.gov.il/he/Pages/%D7%9B%D7%9C-%D7%94%D7%9E%D7%95%D7%A0%D7%97%D7%99%D7%9D.aspx?TID=%D7%97%D7%99%D7%A0%D7%95%D7%9A+%D7%95%D7%94%D7%A9%D7%9B%D7%9C%D7%94&k=%D7%90%D7%95%D7%9C%D7%A4%D7%9F+%D7%94%D7%9E%D7%A9%D7%9A`,
    base: "",
  },
];

const articles = [];
const terms = [];
const events = [];
const sadnaot = [];

newspapers.forEach((newspaper) => {
  axios.get(newspaper.address).then((response) => {
    const html = response.data;
    const $ = cheerio.load(html);

    $("a", html).each(function () {
      const title = $(this).text();
      const url = $(this).attr("href");

      articles.push({
        title,
        url: newspaper.base + url,
        source: newspaper.name,
      });
    });
  });
});
app.get("/favicon.ico", (req, res) => res.status(204));

app.get("/", (req, res) => {
  res.json("BerlBot's API");
});

highTechTermSites.forEach((term) => {
  axios.get(term.address).then((response) => {
    const html = response.data;
    const $ = cheerio.load(html);

    $("p", html).each(function () {
      if ($(this).text().includes("(")) {
        const title = $(this).text();
        const secondTitle = title.substr(0, title.indexOf("."));
        const description = $(this).next("p").text();
        terms.push({
          title,
          description: description,
          source: term.name,
        });
      }
    });
  });
});


app.get("/news", (req, res) => {
  res.json(articles);
});

app.get("/terms", (req, res) => {
  res.json(terms);
});

app.get("/events", (req, res) => {
  res.json(events);
});
app.get("/sadnaot", (req, res) => {
  res.json(events);
});

app.post("/term/add", async (req, res) => {
  new TermModel(req.body);

  TermModel.save;

  let termModel = new TermModel({
    title: req.body.title,
    description: req.body.description,
  });
  TermModel = await TermModel.save();
  res.send(termModel);
});


app.get("/news/:word/title", (req, res) => {
  console.log(terms);
  const word =
    req.params.word === "random"
      ? terms[Math.floor(Math.random() * terms.length)].title
      : req.params.word;
  const articleResult = articles.filter((article) =>
    article.title.includes(word)
  );
  const termResult = terms.filter((term) => term.title.includes(word));
  const example =
    articleResult.length > 0
      ? articleResult[0].title
          .replace(/ +(?= )/g, "")
          .replace(/(\r\n|\n|\r)/gm, "")
          .trim()
      : "אין דוגמה לכתבה";
  if (articleResult.length > 0) {
    const response = `${termResult[0].title} - ${termResult[0].description} - כתבה לדוגמה: משעה ${example}`;
    res.json(response);
  } else {
    const response = `${termResult[0].title} - ${termResult[0].description}`;
    res.json(response);
  }
});

// user data
app.post("/user/add", async (req, res) => {
  new UsersModel(req.body);

  UsersModel.save;

  let usersModel = new UsersModel({
    name: req.body.name,
    studies: req.body.studies,
    number: req.body.number,
    email: req.body.email,
    hobbie: req.body.hobbie,
    degree: req.body.degree
  });
  usersModel = await usersModel.save();
  res.send(usersModel);
});

app.get("/users", (req, res) => {
  UsersModel.find({}, (err, users) => {
    if (err) {
      res.send(err);
    } else {
      res.json(users);
    }
  });
});

app.get("/users/:number/name", (req, res) => {
  const data = UsersModel.find(
    {
      number: req.params.number,
    },
    (err, data) => {
      if (data.length > 0) {
        res.send(data[0].name);
      } else {
        res.json(err);
      }
    }
  );
});
app.get("/users/:number/email", (req, res) => {
  const data = UsersModel.find(
    {
      number: req.params.number,
    },
    (err, data) => {
      if (data.length > 0) {
        console.log(data[0])
        res.send(data[0].email);
      } else {
        res.json(err);
      }
    }
  );
});
app.get("/2fa/:randomNumber/:respondedNumber", (req, res) => {
  if (req.params.randomNumber === req.params.respondedNumber) {
    res.json(true);
  } else {
    res.json(false);
  }
});
app.get("/users/:number/studies", (req, res) => {
  const data = UsersModel.find(
    {
      number: req.params.number,
    },
    (err, data) => {
      if (err) {
        res.send(err);
      } else {
        res.json(data[0].studies);
      }
    }
  );
});
app.get("/getRandomNumber", (req, res) => {
  res.json(getRandomInt(1000, 9999));
});

app.get("/milgot", (req, res) => {
  MyModel.find({}, (err, milgot) => {
    if (err) {
      res.send(err);
    } else {
      res.json(milgot);
    }
  });
});
app.get("/milgot/:name/:number", (req, res) => {
  const regex = new RegExp(req.params.name, "i");
  MyModel.find(
    {
      ForWho: { $regex: regex },
    },
    (err, milgot) => {
      if (err) {
        res.send(err);
      } else {
        res.json(
          milgot[req.params.number].name +
            "בלינק הבא:" +
            milgot[req.params.number].adress
        );
      }
    }
  );
});
app.get("/length/:name", (req, res) => {
  const regex = new RegExp(req.params.name, "i");
  MyModel.find(
    {
      ForWho: { $regex: regex },
    },
    (err, milgot) => {
      if (err) {
        res.send(err);
      } else {
        res.json(milgot.length);
      }
    }
  );
});

app.get("/milgot/:milgaId", (req, res) => {
  const data = MyModel.find(
    {
      base: req.params.milgaId,
    },
    (err, data) => {
      if (err) {
        res.send(err);
      } else {
        res.json(data);
      }
    }
  );
});

app.get("/milgot/:milgaId/:forwho", (req, res) => {
  const data = MyModel.find(
    {
      base: req.params.milgaId,
    },
    (err, data) => {
      if (err) {
        res.send(err);
      } else {
        data.map((milga) => {
          if (milga.ForWho) {
            milga.ForWho.includes(req.params.forwho) && res.json(milga);
          }
        });
      }
    }
  );
});

app.get("/milgot/forwho/:data", (req, res) => {
  const data = MyModel.find(
    {
      ForWho: req.params.milgaId,
    },
    (err, data) => {
      if (err) {
        res.send(err);
      } else {
        res.json(data);
      }
    }
  );
});

app.get("/milgot/id/:id", (req, res) => {
  const data = MyModel.findOne(
    {
      _id: req.params.id,
    },
    (err, data) => {
      if (err) {
        res.send(err);
      } else {
        res.json(data);
      }
    }
  );
});

app.post("/milgot/add", async (req, res) => {
  new MyModel(req.body);

  MyModel.save;

  let myModel = new MyModel({
    name: req.body.name,
    adress: req.body.address,
    base: req.body.base,
    ForWho: req.body.ForWho,
  });
  myModel = await myModel.save();
  res.send(myModel);
});

app.delete("/milgot/delete/:id", (req, res) => {
  MyModel.findByIdAndRemove(req.params.id, (err, milga) => {
    app.post("/milgot/bulkupload", async (req, res) => {
      (async function () {
        for await (let milga of Milgot) {
          let myModel = new MyModel({
            name: milga.name,
            adress: milga.adress,
            base: milga.base,
            ForWho: milga.ForWho,
          });
          myModel = myModel.save();
          res.send(myModel);
        }
      })();
    });
  });
});

app.get("/:id", async (req, res) => {
  const auth = new google.auth.GoogleAuth({
    keyFile: "credentials.json",
    scopes: "https://www.googleapis.com/auth/spreadsheets",
  });

  //create client instance
  const client = await auth.getClient();

  //instance of google sheets api
  const googlesheets = google.sheets({
    version: "v4",
    auth: client,
  });

  const id = req.params.id;

  //get meta data about spreasheet
  const data = await googlesheets.spreadsheets.get({
    auth,
    spreadsheetId: id,
  });

  //read rows from spreadsheet
  const getRows = await googlesheets.spreadsheets.values.get({
    auth,
    spreadsheetId: id,
    range: data.data.sheets[0].properties.title,
  });
  const values = getRows.data.values;
  delete values[0];
  let toSend = {};
  values.forEach((value, index) => {
    console.log(index);
    toSend["Question " + index] = {
      שאלה: value[0],
      תשובות: {
        1: {
          תשובה: value[1],
          נכון: true,
        },
        2: {
          תשובה: value[2],
          נכון: false,
        },
        3: {
          תשובה: value[3],
          נכון: false,
        },
        4: {
          תשובה: value[4],
          נכון: false,
        },
      },
    };
  });

  const url =
    "https://cocohub.ai/api/config/glorious-overjoyed-grammy-220-quiz_v2";
  request(
    {
      url,
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization:
          "Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IlJUa3pRamhHTTBJMU16RTVOMFpGUlRjd09ETTRRVUpCTlRFeE5UbEdOVUZGTkVZM1JEazROdyJ9.eyJpc3MiOiJodHRwczovL2xvZ2luLmNvY29odWIuYWkvIiwic3ViIjoiZ29vZ2xlLW9hdXRoMnwxMDUxNTgxNTA2OTY2Njc1MzEyNzMiLCJhdWQiOlsiaHR0cHM6Ly9jb2NvaHViLmFpL2FwaSIsImh0dHBzOi8vZGV2LWdubjk1M3RkLmF1dGgwLmNvbS91c2VyaW5mbyJdLCJpYXQiOjE2NTAxODQ4MjcsImV4cCI6MTY1MDI3MTIyNywiYXpwIjoiZkNoY3hYaXdyMzlYVzZ0b29QVmZVRm0wekhRTHE1eU8iLCJzY29wZSI6Im9wZW5pZCBwcm9maWxlIGVtYWlsIG9mZmxpbmVfYWNjZXNzIn0.QC4byWGcA8eO0wYXph-ybjLOCXrJDtq6EFoqcri4ihluDIzYAGlNov-XLUPwoxjKcv0aUXA3b1QQkOyUP06uCPoSj29akH4-gLZgzSB5Qd-blYUVXr8JtUq6aRZ98Oelb8N62hT2pRsQVg0xfwEBwwDlNXs4uDhTDA0D0OWP7asHqxqXwAbKG9bH-NfaKFAr75WVqEbQhG6HUUS7r77QMbAtlTSzfUJDOJMUwE1E8b4oS9gfB-nsxJQcpMb12iFYTmui86Y-V3Z5HB-HeaiQ3UXw4r1vMpj6LZrUxgkIcowRddQJysKU5RYwRj933UhxcXE7RpB7EaRI1ASKgmW-zw",
      },
      body: toSend,
      json: true,
    },
    function (error, response, body) {
      setTimeout(
        () => console.log("response", response.statusCode, body),
        2000
      );
    }
  );

  console.log(toSend, "send");
  res.send(toSend);
});

// Hi Asaf

app.listen(PORT, () => console.log(`server running on PORT ${PORT}`));
