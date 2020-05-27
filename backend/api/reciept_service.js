const express = require('express');
const app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({
    extended: false,
}));
app.use(bodyParser.json());

const nodemailer = require('nodemailer');
const fromEmail = '95exchange@gmail.com';
const KafkaConsumer = require('./KafkaConsumer');
const consumer = new KafkaConsumer(['myTopic', 'myOtherTopic']);

consumer.on('message', (message) => {
	var data = JSON.parse(JSON.parse(message.value))
	var cost = data.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
	var emailText = "Here is your reciept from the 9.5 Exchange.\n\nYou purchased " + data.name + " from " 
					+ data.seller + " for $" + cost + ".\n\nCongratulations!\n\nItem Description: " + data.description;

	const transporter = nodemailer.createTransport({
		service: 'gmail',
		auth: {
			user: fromEmail,
			pass: 'qwerasdf1!',
		},
	});

	const mailOptions = {
		from: fromEmail,
		to: fromEmail,
		subject: 'Your Reciept from the 9.5 Exchange!',
		text: emailText,
	};

	transporter.sendMail(mailOptions, (error, info) => {
	if (error) {
		console.log(error);
	} else {
		console.log('Email sent: ' + info.response);
	}
	});
});

consumer.connect();