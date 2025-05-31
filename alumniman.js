import path from "path";
import express from "express"
import { num } from "./by-no.js";
import { fileURLToPath } from "url";
import mongoose from "mongoose";
import { stds } from "./models/stds.js";
import { ppl } from "./models/people.js";
import cors from "cors";
import fs from "fs";
import multer from "multer";
import { vnt } from "./events.js";
import { reg } from "./models/register.js";
import { vnte } from "./models/vntmngr.js";
import { ls } from "./models/lum.js";
import nodemailer from 'nodemailer';
import session from "express-session";
import { chv } from "./add-ach.js";
import { dmevt } from "./admin-events.js";
import { vntmem } from "./event-mem.js";
import { don } from "./dontion.js";
import { dmgly } from "./admin-gallery.js";
const port =3000;
let x;
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'people')
  },
  filename: function (req, file, cb) {
    x = `${Date.now()}-${file.originalname.replaceAll(" ","-")}`;
    cb(null, x)
  }
})
const upload = multer({ storage: storage })
const app = express()
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
//app.use('/people', express.static(path.join(__dirname, 'people')));
app.use( express.static(path.join(__dirname, 'alumni-email-system','public')));
app.get('/',(req,res)=>{
  res.sendFile(path.join(__dirname, "homee.html"));
})
app.use(express.urlencoded({ extended: true , limit: '10mb' })); 
app.use(express.json({ limit: '10mb' }));
app.use(cors({
  origin: "http://localhost:3000", // or whatever your frontend is on
  credentials: true
}));
app.use(session({
  secret: 'your-secret-key', // change this to a strong secret
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false } // set to true if using HTTPS
}));
app.use(express.static('public'))
app.use('/people', express.static(path.join(__dirname, 'people')));
mongoose.connect("mongodb://localhost:27017/alumni")
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log("DB Connection Error:", err));
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'aggarwalkartik956@gmail.com', 
        pass: 'jjgv njvh jewo grhu'     
    }
});
function isAuthenticated(req, res, next) {
  if (req.session && req.session.loggedIn) {
    return next();
  } else {
    req.session.redirectTo = req.originalUrl;
    res.redirect('/login');
  }
}

// 📬 API endpoint to receive event proposals and send email
app.post("/send-proposal", async (req, res) => {
  const {
    organizerName,
    organizerEmail,
    organizerBatch,
    eventTopic,
    eventDate,
    eventType,
    eventDescription
  } = req.body;

  const mailOptions = {
    from: "your-email@gmail.com",
    to: "recipient-email@example.com", // where proposals should go
    subject: `New Event Proposal: ${eventTopic}`,
    html: `
      <h3>New Event Proposal Received</h3>
      <p><strong>Name:</strong> ${organizerName}</p>
      <p><strong>Email:</strong> ${organizerEmail}</p>
      <p><strong>Batch:</strong> ${organizerBatch}</p>
      <p><strong>Topic:</strong> ${eventTopic}</p>
      <p><strong>Date:</strong> ${eventDate}</p>
      <p><strong>Type:</strong> ${eventType}</p>
      <p><strong>Description:</strong><br>${eventDescription}</p>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "Proposal sent successfully!" });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ message: "Failed to send proposal." });
  }
});


app.use("/uploads", express.static("uploads"));
app.get('/signup',(req,res)=>{
    res.sendFile( path.join(__dirname, 'register.html'));
})
app.get('/donation',isAuthenticated,(req,res)=>{
  res.sendFile( path.join(__dirname, 'Donation-form.html'));
})
app.post("/donation", async (req, res) => {
  const {     name,
    batch,
    email,
    amount,
    purpose,
    occupation,
    message} = req.body;
    const mailOptions = {
      from: "your-email@gmail.com",
      to: "recipient-email@example.com", // where proposals should go
      subject: `donation by ${name}`,
      html: `
        <h3>New Event Proposal Received</h3>
        <p><strong>Name:</strong> ${batch}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Batch:</strong> ${amount}</p>
        <p><strong>Topic:</strong> ${purpose}</p>
        <p><strong>Date:</strong> ${occupation}</p>
        <p><strong>Type:</strong> ${message}</p>
      `
    };
  
    try {
      await transporter.sendMail(mailOptions);
      res.status(200).json({ message: "Proposal sent successfully!" });
    } catch (error) {
      console.error("Error sending email:", error);
      res.status(500).json({ message: "Failed to send proposal." });
    }
  });


app.get('/dmin-upd',(req,res)=>{
  res.sendFile( path.join(__dirname, "admin-update-stats.html"));
})
app.get('/giving',(req,res)=>{
  res.sendFile( path.join(__dirname, "givingg.html"));
})
app.post("/dmin-upd", (req, res) => {
  const { member,
    comp,
    ach,
    countries} = req.body;
      const student = new num({ member,
        comp,
        ach,
        countries});
  student.save() 
  return res.send("u are being registered");

})
app.post("/send-feedback", async (req, res) => {
  const { name, email, subject, message } = req.body;

  const mailOptions = {
    from: "aggarwalkartik956@gmail.com", // your Gmail
    to: "recipient-email@example.com", // 👈 Replace with your recipient
    subject: `Feedback Received: ${subject}`,
    html: `
      <h3>New Feedback Submission</h3>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Subject:</strong> ${subject}</p>
      <p><strong>Message:</strong><br>${message}</p>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    res.send("Feedback submitted successfully!");
  } catch (error) {
    console.error("Error sending feedback email:", error);
    res.status(500).send("Failed to send feedback.");
  }
});
app.get('/gly-upd',(req,res)=>{
  res.sendFile( path.join(__dirname, "admin-gallery.html"));
})

app.post("/gly-upd",upload.single('imageUrl'), (req, res) => {
  const imageBuffer = fs.readFileSync(req.file.path);
  const {     imageUrl,
    caption,
    category} = req.body;
      const student = new dmgly({    imageUrl:x,
        caption,
        category});
  student.save() 
  return res.send("u are being registered");

})
app.get("/gly-updpi",async (req,res)=>{
  const documents = await dmgly.find({});
  res.json({events:documents});
})
app.get('/dmvnt',isAuthenticated ,
  (req,res)=>{
  res.sendFile( path.join(__dirname, "admin-events.html"));
})

app.post("/dmvnt", (req, res) => {
  const {  eventTopic,
    eventDate,
    eventDescription} = req.body;
      const student = new dmevt({ eventTopic,
        eventDate,
        eventDescription});
  student.save();
  return res.redirect("/dmvnt");
})

app.get('/eventreg',(req,res)=>{
  res.sendFile( path.join(__dirname, "admin-add-member.html"));
})
app.post("/eventreg", upload.single('photo'),(req, res) => {
  
  const imageBuffer = fs.readFileSync(req.file.path);
  const {  name,
    batch,
    branch,
    dob,
    address,
    email,
    contact,

    photo} = req.body;
      const student = new vntmem({ name,
        batch,
        branch,
        dob,
        address,
        email,
        contact,
    
        photo:x});
  student.save();
  return res.send("u are being registered");

})
app.get("/eventreg-pi",async (req,res)=>{
  const documents = await vntmem.find({});
  res.json({events:documents});
})
app.get("/dmvnt-pi",async (req,res)=>{
  const documents = await dmevt.find({});
  res.json({events:documents});
})
app.get('/add-ach',(req,res)=>{
  res.sendFile( path.join(__dirname, "Add-Alumni-Achievement.html"));
})
app.get('/alumni',(req,res)=>{
  res.sendFile( path.join(__dirname, "alumni.html"));
})
app.get('/contct',(req,res)=>{
  res.sendFile( path.join(__dirname, "contact.html"));
})
app.post("/add-ach", upload.single('photo'),(req, res) => {
  
  const imageBuffer = fs.readFileSync(req.file.path);
  const {  name,email,phone,education,achievementTitle,achievement,currentRole,projects,story,photo,date} = req.body;
      const student = new chv({ name,email,phone,education,achievementTitle,achievement,currentRole,projects,story,photo:x,date});
  student.save() 
  return res.send("u are being registered");

})
app.post("/send-otp", async (req, res) => {
  const { email } = req.body;

  if (!email) return res.status(400).json({ message: "Email is required" });

  const otp = Math.floor(100000 + Math.random() * 900000); // 6-digit OTP
  req.session.otp = otp;
  req.session.otpEmail = email;

  const mailOptions = {
    from: 'aggarwalkartik956@gmail.com',
    to: email,
    subject: "Your OTP for Alumni Registration",
    html: `<h3>Your OTP is: ${otp}</h3><p>This is valid for 10 minutes.</p>`
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "OTP sent successfully" });
  } catch (error) {
    console.error("OTP email failed:", error);
    res.status(500).json({ message: "Failed to send OTP" });
  }
});




app.get("/add-ach-api",async (req,res)=>{
  const documents = await chv.find({});
  res.json({events:documents});
})
app.get("/updte",  async (req, res) => {
  try {
    const document = await num.findOne({})
      .sort({ createdAt: -1 }); // most recent

    res.json({ event: document });
  } catch (err) {
    console.error("Error fetching latest event:", err);
    res.status(500).json({ error: "Failed to fetch event" });
  }
});

app.get('/is-logged-in', (req, res) => {
  res.json({ loggedIn: !!req.session.loggedIn });
});
app.get('/login',(req,res)=>{
  res.sendFile(path.join(__dirname, "login.html"));
})
app.get('/admin-fill-giving',(req,res)=>{
  res.sendFile(path.join(__dirname, "admin-fill-giving.html"));
})
app.post("/admin-fill-giving", async (req, res) => {
  const {     name,
    batch,
    email,
    amount,
    purpose,
    occupation,
    message} = req.body;
    const student = new don({   name,
      batch,
      email,
      amount,
      purpose,
      occupation,
      message});
    student.save() 
    return res.send("u are being registered");
  

  });
  app.get("/donationpi",async (req,res)=>{
    const documents = await don.find({});
    res.json({events:documents});
  })
app.get('/add',isAuthenticated,(req,res)=>{
  res.sendFile(path.join(__dirname, "eventsinp.html"));
})
app.get('/rst',isAuthenticated,(req,res)=>{
  res.sendFile(path.join(__dirname, "registrationn.html"));
})
app.get('/evmng',isAuthenticated,(req,res)=>{
  res.sendFile(path.join(__dirname, "eventsmng.html"));
})
app.get('/dlus',isAuthenticated,(req,res)=>{
  res.sendFile(path.join(__dirname, "dlums.html"));
})
app.get("/dlusin",isAuthenticated, async (req,res)=>{
  const documents = await ls.find({});
  res.json({events:documents});
})
app.get("/rstdin",isAuthenticated, async (req,res)=>{
  const documents = await reg.find({});
  res.json({events:documents});
})

app.get('/glr',(req,res)=>{
  res.sendFile(path.join(__dirname, "gallery.html"));
})
app.get('/cnt',isAuthenticated,(req,res)=>{
  res.sendFile(path.join(__dirname, "contact.html"));
})
 app.get('/members',isAuthenticated,(req,res)=>{
  res.sendFile(path.join(__dirname, "memberss.html"));
})

app.get('/events',(req,res)=>{
  res.sendFile(path.join(__dirname, "event.html"));
})
app.get('/companies',isAuthenticated,(req,res)=>{
  res.sendFile(path.join(__dirname, "companies.html"));
})
app.get('/countries',isAuthenticated,(req,res)=>{
  res.sendFile(path.join(__dirname, "countries.html"));
})
app.get('/ach', (req,res)=>{
  res.sendFile(path.join(__dirname, "achievements.html"));
})
app.get("/ddin",isAuthenticated, async (req,res)=>{
  const documents = await vnt.find({});

  res.json({events:documents});
  
})
app.get("/edin",isAuthenticated, async (req,res)=>{
  const documents = await vnte.find({});

  res.json({events:documents});
  
})
app.get('/peopledisp',isAuthenticated,(req,res)=>{
  res.sendFile(path.join(__dirname, "peopledisp.html"));
})
    app.get('/people',isAuthenticated,(req,res)=>{
      res.sendFile(path.join(__dirname,"./people.html"))
    })
    app.get("/peoplein",isAuthenticated, async (req,res)=>{
      const documents = await ppl.find({});
 
      res.json({people:documents});
      
    })
    app.get("/stdin",isAuthenticated, async (req,res)=>{
      const documents = await stds.find({});
      const emails = documents.map(student => student.email);
      res.json({emails});
      
    })
    app.get("/stdint",async (req,res)=>{
      const documents = await stds.find({});
      res.json({documents});
      
    })
    app.get("giving",(req,res)=>{
      res.sendFile( path.join(__dirname, "givingg.html"));
    })
    app.get("/send-emails",isAuthenticated,(req,res)=>{
      res.sendFile( path.join(__dirname, 'alumni-email-system', 'public', 'send-email.html'));
    })
app.post("/evmng", (req, res) => {
  const { name, date,msg} = req.body;
      const student = new vnte({ name,date,msg});
  student.save() 
  return res.send("u are being registered");

})

app.post("/dlus", (req, res) => {
  const { name, date,msg} = req.body;
  
 
      const student = new ls({ name,date,msg});
  student.save() 
  return res.send("u are being registered");

})


app.post("/rst", (req, res) => {
  const { name, email,phone,college,batch,event,message} = req.body;
  
 
      const student = new reg({ name, email,phone,college,batch,event,message});
  student.save() 
  return res.send("u are being done");

})

app.post('/add',(req,res)=>{
  const { hed,cnt} = req.body;
    
  const event = new vnt({hed,cnt});
      event.save();
      console.log(event);
      res.sendFile(path.join(__dirname, "homee.html"));
})

app.post("/signup", upload.single('photo'), async (req, res) => {
  const imageBuffer = fs.readFileSync(req.file.path);
  const { name, batch, location, branch, comp, position, email, summary, id, idc, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({ message: "Missing email or OTP" });
  }

  if (email !== req.session.otpEmail || otp != req.session.otp) {
    return res.status(403).json({ message: "Invalid OTP" });
  }

  if (email.includes("@iiitsonepat") && id === idc) {
    const student = new stds({
      name, batch, location, branch, comp, position, email, photo: x, summary, id
    });

    await student.save();
    return res.status(200).json({ message: "Registered successfully!" });
  }

  return res.status(400).json({ message: "Invalid data or email domain" });
});
app.get("/signupt",(req,res)=>{
  res.sendFile( path.join(__dirname, "signup.html"));
})
app.post("/signupt", async(req, res) => {
    const { name, email,id,idc,otp } = req.body;
    if (!email || !otp) {
      return res.status(400).json({ message: "Missing email or OTP" });
    }
  
    if (email !== req.session.otpEmail || otp != req.session.otp) {
      return res.status(403).json({ message: "Invalid OTP" });
    }
  
    if (email.includes("@iiitsonepat") && id === idc) {
      const student = new stds({
        name, email,id,idc 
      });
  
      await student.save();
      return res.send("Registered successfully!"); // Or redirect to login
    }
  
    return res.send("Invalid data or domain");
})
app.post("/set-redirect", (req, res) => {
  const { url } = req.body;
  req.session.redirectTo = url;
  res.status(200).send("Redirect path set");
});

app.post("/login", async (req, res) => {
  const { email, pswrd } = req.body;
  try {
    const student = await stds.findOne({ email, pswrd });

    if (student) {
      req.session.loggedIn = true;

      // Redirect to original URL if available
      const redirectTo = req.session.redirectTo || "http://localhost:3000";
      delete req.session.redirectTo; // clean up
      return res.redirect(redirectTo);
    }

    res.status(401).send("Incorrect data");
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).send("Server error");
  }
});


  app.post('/people',upload.single('photo'),async(req,res)=> {
    const imageBuffer = fs.readFileSync(req.file.path);
    const { name, work, email,photo } = req.body;
    const pepl = new ppl({ name, work, email ,photo:x});
     
    await pepl.save();

    return res.redirect("/");
  })
  app.post('/send-emails', (req, res) => {
    const { subject, message, emails } = req.body;
  
    if (!emails || emails.length === 0) {
        return res.status(400).json({ error: 'No email addresses provided' });
    }

    // Email options
    const mailOptions = {
        from: 'your-email@gmail.com', // Your email
        to: emails.join(','),         // Comma-separated list of recipient emails
        subject: subject,
        text: message
    };

    // Send email
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error sending email:', error);
            return res.status(500).json({ error: 'Failed to send email' });
        }
        console.log('Email sent:', info.response);
        res.json({ success: 'Emails sent successfully' });
    });
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Server running at http://localhost:${port} or http://127.0.0.1:${port}`);
});