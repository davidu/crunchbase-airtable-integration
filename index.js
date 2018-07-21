var Airtable = require('airtable');
var base = new Airtable({apiKey: 'key1rk5YNnkac6Iv8'}).base('appoxnXQ7asCyquMr');

base('VC Funds').create({
    "Name": "ilan",
    "Sector": [
        "Digital Media",
        "Internet",
        "Ecommerce",
        "Social",
        "Fintech",
        "Edtech",
        "Adtech",
        "Security",
        "Healthtech/Medtech"
    ],
    "Crunchbase": "https://www.crunchbase.com/organization/thetime",
    "Website": "http://thetime.co.il/",
    "Location": [
        "Israel"
    ],
    "Stage": [
        "Seed"
    ],
    "Portfolio Companies": [
        "recblBMc7nr74ABsH"
    ]
}, function(err, record) {
    if (err) { console.error(err); return; }
    console.log(record.getId());
});