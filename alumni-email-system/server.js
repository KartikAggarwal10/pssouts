// const express = require('express');
// const nodemailer = require('nodemailer');
import path from "path";
import express from "express"
import nodemailer from "nodemailer";
import cors from "cors";
const app = express();
const port = 3000;

// Middleware to parse JSON requests
app.use(express.json());
app.use(express.static('public')); // Serve static files (HTML, CSS, JS)
app.use(cors());
// Configure Nodemailer with Gmail
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'aggarwalkartik956@gmail.com', // Replace with your Gmail address
        pass: 'jjgv njvh jewo grhu'     // Replace with your Gmail App Password (see below)
    }
});
   
   

// API endpoint to send emails
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

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});