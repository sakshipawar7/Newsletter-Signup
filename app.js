const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");
const path = require("path");
require("dotenv").config();

const app = express();
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname, "public")));

// app.use(express.static("public"));

app.get("/", (req,res)=>{
    // res.sendFile(__dirname + "/public/signup.html")
    res.sendFile(path.join(__dirname + "/signup.html"));
})

app.post("/", function(req,res){
    const {fname, lname, email} = req.body;
    console.log(fname + " " + lname + " " + email);

    var data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: fname,
                    LNAME: lname
                }
            }
        ]
    }

    const jsonData = JSON.stringify(data);

    const url = "https://us11.api.mailchimp.com/3.0/lists/27f1d49ced"

    const options = {
        method: "POST",
        auth: `sakshi:${process.env.MAILCHIMP_API_KEY}`
    }

    const request = https.request(url, options, function(response){

        response.on("data", function(data){
            // const parsedData = JSON.parse(data);
            // response.statusCode === 200 ? res.send("SUCCESS") : res.send("FAILURE");
            response.statusCode === 200 ? res.sendFile(path.join(__dirname + "/success.html")) : res.sendFile(path.join(__dirname + "/failure.html"))
            // console.log(JSON.parse(data));
            // parsedData.new_members[0].status === 'subscribed' ? res.sendFile(__dirname + "/success.html") : res.sendFile(__dirname + "/failure.html")
        })

    })

    request.write(jsonData);
    request.end();



    // res.send("Thanks");
});

app.post("/failure", function(req,res){
    res.redirect("/");
})

app.post("/success", function(req,res){
    res.redirect("http://s-p.mit.edu/news_events/newsletter.php");
})

// export default app;

app.listen(process.env.PORT || 3000, function(req,res){
    console.log("Server is running on port 3000.")
})


//API key
// 5a8bde0f0e3e548f4b0876b771f3cafe-us11

//list id
// 27f1d49ced